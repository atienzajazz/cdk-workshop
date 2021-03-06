import * as cdk from 'aws-cdk-lib';
import { Template, Match, Capture } from 'aws-cdk-lib/assertions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as CdkWorkshop from '../lib/cdk-workshop-stack';
import { HitCounter } from '../lib/hitcounter';

let stack: cdk.Stack;
let template: Template;

beforeAll(() => {
  // Configure the stack
  stack = new cdk.Stack();
  new HitCounter(stack, 'MyTestConstruct', {
    downstream: new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'hello.handler',
      code: lambda.Code.fromAsset('lambda'),
    }),
  });

  template = Template.fromStack(stack);
});

test('Dynamo Table Created', () => {
  // THEN
  template.resourceCountIs('AWS::DynamoDB::Table', 1);
});

test('Lambda Has Environment Variables', () => {
  const envCapture = new Capture();
  template.hasResourceProperties('AWS::Lambda::Function', {
    Environment: envCapture,
  });

  expect(envCapture.asObject()).toEqual({
    Variables: {
      DOWNSTREAM_FUNCTION_NAME: {
        Ref: 'TestFunction22AD90FC',
      },
      HITS_TABLE_NAME: {
        Ref: 'MyTestConstructHits24A357F0',
      },
    },
  });
});

test('DynamoDB Table Created With Encrption', () => {
  template.hasResourceProperties('AWS::DynamoDB::Table', {
    SSESpecification: {
      SSEEnabled: true,
    },
  });
});

test('read capacity can be configured', () => {
  stack = new cdk.Stack();
  expect(() => {
    new HitCounter(stack, 'MyTestConstruct', {
      downstream: new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'hello.handler',
        code: lambda.Code.fromAsset('lambda'),
      }),
      readCapacity: 3,
    });
  }).toThrowError(/readCapacity must be greater than 5 and less than 20/);
});
