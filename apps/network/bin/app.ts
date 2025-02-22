#!/usr/bin/env node
import 'source-map-support/register'
import { App } from 'aws-cdk-lib'
import { Network } from '../src'

const app = new App({
  analyticsReporting: false,
})

const stage = app.node.tryGetContext('stage') ?? 'prod'

const domainName = process.env.DOMAIN_NAME as string

new Network(app, `${stage}-network`, {
  domainName,
  stage,
})
