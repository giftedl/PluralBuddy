
import * as Sentry from "@sentry/bun";

if (process.env.SENTRY_DSN)
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 1.0,
        environment: process.env.BRANCH ?? "unknown"
    });
