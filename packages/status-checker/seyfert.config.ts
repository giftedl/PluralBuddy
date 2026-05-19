// @ts-check

import { config } from 'seyfert';
import { GatewayIntentBits } from 'seyfert/lib/types';

export default config.bot({
    locations: {
        base: 'src',
        components: 'components'
    },
    token: process.env.TOKEN ?? '',
    intents: GatewayIntentBits.Guilds
});