#!/usr/bin/env node
import 'source-map-support/register'
import { App } from 'aws-cdk-lib'
import { TargetAccountGitHubRoles } from '@eriktisme/aws-cdk-github-action-integration'

const app = new App({
  analyticsReporting: false,
})

new TargetAccountGitHubRoles(app, 'target-account-github-roles', {
  owner: 'eriktisme',
  repositories: ['treasury'],
})
