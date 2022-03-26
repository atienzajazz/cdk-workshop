#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkWorkshopStack } from '../lib/cdk-workshop-stack';

const env = process.env.ENV || 'dev';

const app = new cdk.App();
new CdkWorkshopStack(app, `${env}-CdkExperiment`);
