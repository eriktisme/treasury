#!/usr/bin/env node
import 'source-map-support/register'
import { App } from 'aws-cdk-lib'
import { ApiService } from '../src'

const app = new App({
  analyticsReporting: false,
})

const stage = app.node.tryGetContext('stage') ?? 'prod'

const databaseUrl = process.env.DATABASE_URL as string
const clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY as string
const clerkSecretKey = process.env.CLERK_SECRET_KEY as string

new ApiService(app, `${stage}-service-api`, {
  clerkPublishableKey,
  clerkSecretKey,
  databaseUrl,
  stage,
})
