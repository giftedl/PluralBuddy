/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
    ComponentCommand,
    ComponentContext,
    ContextMenuCommand,
    Declare,
    Label,
    MenuCommandContext,
    MessageCommandInteraction,
    Modal,
    TextInput,
} from "seyfert";
import {
    type APIContainerComponent,
    type APITextDisplayComponent,
    ApplicationCommandType,
    ComponentType,
    TextInputStyle,
} from "seyfert/lib/types";
import { emojis } from "@/lib/emojis";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { messagesCollection } from "@/mongodb";

export default class EditContextForm extends ComponentCommand {
    componentType = "Button" as const;

    override filter(context: ComponentContext) {
        return InteractionIdentifier.EditMenu.EditMessageReaction.startsWith(
            context.customId,
        );
    }

    override async run(ctx: ComponentContext<typeof this.componentType>) {

        const messageId = InteractionIdentifier.EditMenu.EditMessageReaction.substring(
            ctx.customId,
        )[0]
        const pluralbuddyMessage = await messagesCollection.findOne({ messageId })

        if (!pluralbuddyMessage || !messageId)
            throw new Error("message doesn't exist?")

        const target =
            await ctx.client.messages.fetch(messageId, pluralbuddyMessage.channelId)
        const isExpress = target.webhookId === undefined;

        if (!target)
            throw new Error("message doesn't exist?")

        const contents =
            target.content !== ""
                ? // Make fake virtual component
                { data: { content: target.content } }
                : target.components.find((v) =>
                    isExpress
                        ? (v.data.type === ComponentType.TextDisplay &&
                            !v.data.content.startsWith(`-# ${emojis.reply}`)) ||
                        v.data.type === ComponentType.Container
                        : v.data.type === ComponentType.TextDisplay &&
                        !v.data.content.startsWith(`-# ${emojis.reply}`),
                );
        const innerComp = (contents ?? { data: { content: "" } }).data as
            | APITextDisplayComponent
            | APIContainerComponent;

        const modal = new Modal()
            .setCustomId(
                InteractionIdentifier.EditMenu.EditContextForm.create(target.id),
            )
            .setTitle((await ctx.userTranslations()).EDIT_MESSAGE)
            .setComponents([
                new Label()
                    .setLabel((await ctx.userTranslations()).MESSAGE_CONTENTS)
                    .setComponent(
                        new TextInput()
                            .setCustomId(
                                InteractionIdentifier.EditMenu.EditContextType.create(),
                            )
                            .setValue(
                                "content" in innerComp
                                    ? innerComp.content
                                    : innerComp.components[0]?.type === ComponentType.TextDisplay
                                        ? innerComp.components[0]?.content
                                        : "",
                            )
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true),
                    ),
            ]);

        return await ctx.modal(modal);
    }
}
