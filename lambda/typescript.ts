import { ApiEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export async function handler(event: ApiEventSource) {
  return {
    body: JSON.stringify({ message: 'Successful lambda invocation' }),
    statusCode: 200,
  };
}
