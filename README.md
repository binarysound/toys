# Toys

## Run Locally
Install JDK to run DynamoDB locally.

```
yarn install
yarn sls dynamodb install
yarn offline
```

## Deploy
Make sure that you have set `toys` AWS credential properly.

```ini
[toys]
aws_access_key_id=
aws_secret_access_key=
region=
```

Create `.custom.yml` file at the project root and fill it with credentials.

```
S3_STATIC_BUCKET_NAME: your.s3.bucket.name
```

Now deploy.

```
yarn deploy
```
