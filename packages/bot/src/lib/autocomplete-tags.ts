/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { AutocompleteInteraction } from "seyfert";
import { getUserById } from "../types/user";
import { alterCollection, tagCollection } from "../mongodb";

export async function autocompleteTags(ctx: AutocompleteInteraction<boolean>) {
    const user = await getUserById(ctx.user.id)

    if (user.system === undefined) {
        return ctx.respond([ { name: "You have no system.", value: "no" }])
    }

    const prompt = ctx.getInput();
    const trimmedPrompt = prompt?.trim();
    
    // Build MongoDB aggregation pipeline for filtering and sorting
    // Build match filter conditionally
    const matchFilter: Document = trimmedPrompt && trimmedPrompt.length > 0
        ? {
            systemId: ctx.user.id,
            tagFriendlyName: { 
                $regex: trimmedPrompt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 
                $options: 'i' 
            }
        }
        : { systemId: ctx.user.id };
    
    const pipeline: Document[] = [
        // Match alters for this system (and optionally by username)
        { $match: matchFilter }
    ];

    if (trimmedPrompt && trimmedPrompt.length > 0) {
        // Escape special regex characters in the prompt
        const escapedPrompt = trimmedPrompt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const promptLower = trimmedPrompt.toLowerCase();
        
        // Add relevance scoring based on match quality
        pipeline.push({
            $addFields: {
                usernameLower: { $toLower: "$tagFriendlyName" }
            }
        });
        
        pipeline.push({
            $addFields: {
                relevanceScore: {
                    $cond: [
                        // Exact match: highest priority (score 1000)
                        { $eq: ["$usernameLower", { $literal: promptLower }] },
                        1000,
                        {
                            $cond: [
                                // Starts with prompt: high priority (score 500 - length for shorter names)
                                { 
                                    $regexMatch: { 
                                        input: "$usernameLower", 
                                        regex: `^${escapedPrompt}`,
                                        options: "i" 
                                    } 
                                },
                                { $subtract: [500, { $strLenCP: "$tagFriendlyName" }] },
                                {
                                    $cond: [
                                        // Contains prompt: medium priority (score 100 - position - length)
                                        { 
                                            $regexMatch: { 
                                                input: "$usernameLower", 
                                                regex: escapedPrompt,
                                                options: "i" 
                                            } 
                                        },
                                        {
                                            $subtract: [
                                                {
                                                    $subtract: [
                                                        100,
                                                        { $indexOfCP: ["$usernameLower", { $literal: promptLower }] }
                                                    ]
                                                },
                                                { $strLenCP: "$tagFriendlyName" }
                                            ]
                                        },
                                        0
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        });
        
        pipeline.push({
            $sort: {
                relevanceScore: -1,
                username: 1
            }
        });
    } else {
        pipeline.push({
            $sort: { username: 1 }
        });
    }
    
    pipeline.push({ $limit: 25 });
    
    // Project only username field
    pipeline.push({
        $project: {
            tagFriendlyName: 1
        }
    });

    const array = await tagCollection.aggregate(pipeline).toArray();

    return ctx.respond(array.map(v => {return {name: v.username, value: v.username}}))
}