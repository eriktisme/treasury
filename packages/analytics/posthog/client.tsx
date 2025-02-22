'use client'

import posthog, { type PostHog } from 'posthog-js'
import { PostHogProvider as PostHogProviderRaw } from 'posthog-js/react'
import type { ReactNode } from 'react'
import { z } from 'zod'

const ConfigSchema = z.object({
  key: z.string(),
  host: z.string(),
})

const { host, key } = ConfigSchema.parse({
  key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
})

export const analytics = posthog.init(key, {
  api_host: '/ingest',
  ui_host: host,
  person_profiles: 'identified_only',
  session_recording: {
    maskAllInputs: true,
    maskTextSelector: '*',
  },
  capture_pageview: false,
  capture_pageleave: true,
}) as PostHog

interface Props {
  children: ReactNode
}

export const PostHogProvider = (
  properties: Readonly<Omit<Props, 'client'>>
) => <PostHogProviderRaw client={analytics} {...properties} />
