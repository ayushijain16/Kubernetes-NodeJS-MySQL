# MarketStatsImporter

The MarketStatsImporter collects market stats from 3rd parties for display in vAuto.

## General Process

The file named ```marketstats_dealers``` is dropped to incoming SFTP bucket named ```vauto-marketstatsimporter-incoming-prod-us-east-2``` which triggers the ECS task to process via SQS. The application then reads the dealer's data from the incoming file and hits the API to get the stats data for the dealers.
MarketStatsImporter currently supports only one provider i.e. CarGurus, for which stats data is written into the file named ```cargurus_srpvdp``` and then the file is dropped to SFTP location ```vauto/cargurus/```.

## Infrastructure
The application is currently running in the ```us-east-2``` region.

![MarketStatsImporter Infrastructure](/docs/marketstats_importer.png)

## Developing Locally

To develop locally, the application needs to be able to hit the SQS queue and the S3 bucket. Credentials must be supplied in the following local file `C:\\Users\\<UserProfile>\\.aws\\credentials`.

_Example credential file:_

```
[default]
aws_access_key_id=abc
aws_secret_access_key=def
aws_session_token=ghi
```

## Deployment

### Production

Infrastructure and code deployment is done using [CodePipeline](https://us-east-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/MarketStatsImporter-Prod/view?region=us-east-2/).

### Non-Production

Infrastructure and code deployment is done using [CodePipeline](https://us-east-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/MarketStatsImporter-NonProd/view?region=us-east-2).

### First Time

The first time deployments are required to run terraform on your local so that the code build pipeline can be set up, further deployments can be run via the code build pipeline

Manually update any SSM Parameters created

   * The [SSM terraform scripts](/infrastructure/terraform/app/ssm_parameters.tf) will create encrypted parameters but we do not store the actual parameter values for security reasons

### Subsequent Deployments

1. Run the CodeBuild Pipeline
    * This will update the AWS resources configured in terraform scripts, creates a new ECS task revision, and update the service to use it.
