import type { StackProps } from '@internal/cdk-utils/stack'
import { Stack } from '@internal/cdk-utils/stack'
import type { Construct } from 'constructs'
import {
  ARecord,
  PublicHostedZone,
  RecordTarget,
} from 'aws-cdk-lib/aws-route53'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'

interface Props extends StackProps {
  domainName: string
}

export class Network extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props)

    const zone = new PublicHostedZone(this, 'hosted-zone', {
      zoneName: props.domainName,
    })

    new StringParameter(this, 'hosted-zone-id', {
      parameterName: `/${props.stage}/hosted-zone-id`,
      stringValue: zone.hostedZoneId,
    })

    new ARecord(this, 'a', {
      recordName: props.domainName,
      target: RecordTarget.fromIpAddresses('76.76.21.21'),
      zone,
    })

    new ARecord(this, 'app-a', {
      recordName: `app.${props.domainName}`,
      target: RecordTarget.fromIpAddresses('76.76.21.21'),
      zone,
    })
  }
}
