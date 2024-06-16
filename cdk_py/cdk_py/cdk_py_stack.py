from aws_cdk import (
    Stack,
    aws_s3 as s3,
    aws_cloudfront as cloudfront,
    aws_s3_deployment as s3_deployment,
    aws_iam as iam,
    RemovalPolicy
)
from constructs import Construct

class CdkPyStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)
        
        bucket = s3.Bucket(self, "Bucket-Crosscheck",
            removal_policy=RemovalPolicy.DESTROY,
            block_public_access = s3.BlockPublicAccess.BLOCK_ALL,
            auto_delete_objects=True,
        )
        
        bucket.add_to_resource_policy(iam.PolicyStatement(
            actions=["s3:GetObject"],
            resources=[bucket.arn_for_objects("*")],
            effect=iam.Effect.ALLOW,
            principals=[iam.ServicePrincipal("cloudfront.amazonaws.com")],
        ))
        origin_access_identity = cloudfront.OriginAccessIdentity(self, "OAI")
        distribution = cloudfront.CloudFrontWebDistribution(self, "Cloudfront-Distribution-Crosscheck",
            origin_configs=[
                cloudfront.SourceConfiguration(
                    s3_origin_source=cloudfront.S3OriginConfig(
                        s3_bucket_source=bucket,
                        origin_access_identity=origin_access_identity
                    ),
                    behaviors=[cloudfront.Behavior(is_default_behavior=True)]
                )
            ],
            comment="This is the distribution for crosschecks-RomanNeudakh"
        )

        bucket.grant_read(origin_access_identity)
        deployment = s3_deployment.BucketDeployment(self, "DeployWithInvalidation",
            sources=[s3_deployment.Source.asset("./dist")],
            destination_bucket=bucket,
            distribution=distribution,
            distribution_paths=["/*"]
        )
        deployment.node.add_dependency(bucket)
