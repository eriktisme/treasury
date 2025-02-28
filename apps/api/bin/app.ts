#!/usr/bin/env node
import 'source-map-support/register'
import { App } from 'aws-cdk-lib'
import { ApiService } from '../src'

const app = new App({
  analyticsReporting: false,
})

const stage = app.node.tryGetContext('stage') ?? 'prod'

const databaseUrl = process.env.DATABASE_URL as string
const domainName = process.env.DOMAIN_NAME as string

new ApiService(app, `${stage}-service-api`, {
  clerk: {
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY as string,
    secretKey: process.env.CLERK_SECRET_KEY as string,
    webhookSecret: process.env.CLERK_WEBHOOK_SECRET as string,
  },
  databaseUrl,
  domainName,
  postHog: {
    key: process.env.POSTHOG_KEY as string,
    host: process.env.POSTHOG_HOST as string,
  },
  stage,
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY as string,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string,
  },
})
