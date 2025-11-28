import { createAuthClient } from "better-auth/react"
import { oidcClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    plugins: [ oidcClient() ]
})