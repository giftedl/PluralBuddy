/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

'use server';

import { auth, clerkClient } from '@clerk/nextjs/server'
import type { RESTGetAPIUserResult } from "discord-api-types/v10"

export async function getDiscordUserData(): Promise<RESTGetAPIUserResult | { error: string }> {
    const { isAuthenticated, userId } = await auth()

    if (!isAuthenticated) {
        return { error: "User not found." }
    }

    const client = await clerkClient()

    const clerkResponse = await client.users.getUserOauthAccessToken(userId, "discord")
    const accessToken = clerkResponse.data[0].token || ''
    if (!accessToken) {
        return { error: ('Access token not found') }
    }
    
    const discordUserApi = 'https://discord.com/api/v10/users/@me'

    const discordResponse = await fetch(discordUserApi, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    
  const discordData = await discordResponse.json()

  return discordData
}