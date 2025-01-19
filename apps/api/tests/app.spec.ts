import { Template } from 'aws-cdk-lib/assertions'
import { App } from 'aws-cdk-lib'
import { ApiService } from '../src'

const app = new App()

const mockProps = {
  stage: 'test',
  clerkPublishableKey: 'test-publishable-key',
  clerkSecretKey: 'test-secret-key',
  databaseUrl: 'test-database-url',
}

const stack = new ApiService(app, 'api-stack', mockProps)

describe('ApiService', () => {
  it('should have an API Gateway', () => {
    const template = Template.fromStack(stack)

    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: `${mockProps.stage}-api`,
    })

    template.hasResource('AWS::ApiGateway::RestApi', {
      //
    })
  })

  it('should have a Lambda function', () => {
    const template = Template.fromStack(stack)

    template.hasResourceProperties('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          CLERK_PUBLISHABLE_KEY: mockProps.clerkPublishableKey,
          CLERK_SECRET_KEY: mockProps.clerkSecretKey,
          DATABASE_URL: mockProps.databaseUrl,
        },
      },
    })

    template.hasResource('AWS::Lambda::Function', {
      //
    })
  })
})
