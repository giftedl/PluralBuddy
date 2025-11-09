import { createMiddleware } from "seyfert";
import { ChannelType } from 'seyfert/lib/types';
 
export const noWebhookMiddleware = createMiddleware<void>((middle) => {
  if (middle.context.author.bot === true)
    return middle.stop("1a - Cannot trigger commands via bots/webhooks.");
 
  // Pass to the next middleware if the command is being executed in a guild
  middle.next();
});