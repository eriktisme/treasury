import { PostHog } from 'posthog-node'
import { z } from 'zod'

const ConfigSchema = z.object({
  key: z.string(),
  host: z.string(),
})

const { host, key } = ConfigSchema.parse({
  key: process.env.POSTHOG_KEY,
  host: process.env.POSTHOG_HOST,
})

export const analytics = new PostHog(key, {
  host,
  flushAt: 1,
  flushInterval: 0,
})
