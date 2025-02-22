import { Template } from 'aws-cdk-lib/assertions'
import { App } from 'aws-cdk-lib'
import { Network } from '../src'

const app = new App()

const mockProps = {
  stage: 'test',
  domainName: 'test-domain-name',
}

const stack = new Network(app, 'network-stack', mockProps)

describe('Network', () => {
  it('should create a Hosted Zone', () => {
    const template = Template.fromStack(stack)

    template.hasResource('AWS::Route53::HostedZone', {
      //
    })
  })

  it('should create a String Parameter', () => {
    const template = Template.fromStack(stack)

    template.hasResource('AWS::SSM::Parameter', {
      //
    })
  })
})
