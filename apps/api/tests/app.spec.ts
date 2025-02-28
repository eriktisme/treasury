import { Template } from 'aws-cdk-lib/assertions'
import { App } from 'aws-cdk-lib'
import type { ApiServiceProps } from '../src'
import { ApiService } from '../src'

const app = new App()

const mockProps: ApiServiceProps = {
  stage: 'test',
  clerk: {
    publishableKey: 'test-publishable-key',
    secretKey: 'test-secret-key',
    webhookSecret: 'test-webhook-secret',
  },
  postHog: {
    key: '',
    host: '',
  },
  stripe: {
    secretKey: 'test-secret-key',
    webhookSecret: 'test-webhook-secret',
  },
  databaseUrl: 'test-database-url',
  domainName: 'test-domain-name',
}

const stack = new ApiService(app, 'api-stack', mockProps)

describe('ApiService', () => {
  it('should create a Certificate', () => {
    const template = Template.fromStack(stack)

    template.hasResource('AWS::CertificateManager::Certificate', {
      //
    })
  })

  it('should create an API Gateway', () => {
    const template = Template.fromStack(stack)

    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: `${mockProps.stage}-api`,
    })

    template.hasResource('AWS::ApiGateway::RestApi', {
      //
    })
  })

  it('should create a Lambda function', () => {
    const template = Template.fromStack(stack)

    template.hasResourceProperties('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          CLERK_PUBLISHABLE_KEY: mockProps.clerk.publishableKey,
          CLERK_SECRET_KEY: mockProps.clerk.secretKey,
          CLERK_WEBHOOK_SECRET: mockProps.clerk.webhookSecret,
          DATABASE_URL: mockProps.databaseUrl,
          POSTHOG_HOST: mockProps.postHog.host,
          POSTHOG_KEY: mockProps.postHog.key,
        },
      },
    })

    template.hasResource('AWS::Lambda::Function', {
      //
    })
  })
})
