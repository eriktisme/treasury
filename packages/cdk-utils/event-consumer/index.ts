import { Construct } from 'constructs'
import type { EventBus, EventPattern } from 'aws-cdk-lib/aws-events'
import { Rule } from 'aws-cdk-lib/aws-events'
import { SqsQueue } from 'aws-cdk-lib/aws-events-targets'
import type { NodeJSLambdaProps } from '../lambda'
import { NodeJSLambda } from '../lambda'
import { Queue } from 'aws-cdk-lib/aws-sqs'
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources'
import { Duration } from 'aws-cdk-lib'

interface Props {
  eventBus: EventBus
  eventPattern: EventPattern
  handlerProps: NodeJSLambdaProps
}

export class EventConsumer extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id)

    const deadLetterQueue = new Queue(this, 'dead-letter-queue', {
      //
    })

    const queue = new Queue(this, 'queue', {
      visibilityTimeout: Duration.seconds(30),
      deadLetterQueue: {
        queue: deadLetterQueue,
        maxReceiveCount: 3,
      },
    })

    new Rule(this, 'rule', {
      eventBus: props.eventBus,
      eventPattern: props.eventPattern,
      targets: [new SqsQueue(queue)],
    })

    const handler = new NodeJSLambda(this, 'handler', props.handlerProps)

    handler.addEventSource(new SqsEventSource(queue))
  }
}
