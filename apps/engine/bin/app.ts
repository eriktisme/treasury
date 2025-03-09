#!/usr/bin/env node
import 'source-map-support/register'
import { App } from 'aws-cdk-lib'
import { Engine } from '../src'

const app = new App({
  analyticsReporting: false,
})

const stage = app.node.tryGetContext('stage') ?? 'prod'

new Engine(app, `${stage}-engine`, {
  databaseUrl: process.env.DATABASE_URL as string,
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY as string,
  },
  postHog: {
    key: process.env.POSTHOG_KEY as string,
    host: process.env.POSTHOG_HOST as string,
  },
  clerk: {
    secretKey: process.env.CLERK_SECRET_KEY as string,
  },
  stage,
  tags: {
    stage,
  },
})
