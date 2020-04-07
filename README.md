# Introduction

This is a reproduce case for amplify-js issue https://github.com/aws-amplify/amplify-js/issues/5309

it's bigger than I would want a reproduce case to be, event those in practive it contains only two small modules of code, with everything else being vanilla scafolding to get Amplify and Cognito to work.

1) server/src/auth.ts
2) client/src/app/app.component.ts

The reproduce case contains two components...

## Server 

A cognito identity pool, plus lambda functions to create a developer identity server side.
The code exposes one endpoint

GET /auth/signin  - returns a cognitoToken, the same use is returned each time, and there is no validation.

## Client

Angular 9 client, with a single component app.component.


# Installation

## Install the server

```
$ cd server
$ npm install
$ ./node_modules/.bin/serverless --aws-profile NAME_OF_YOUR_AWS_PROFILR deploy

Service Information
service: authreproduce
stage: dev
region: us-east-1
stack: authreproduce-dev
resources: 32
api keys:
  None
endpoints:
  GET - https://XXXX.execute-api.us-east-1.amazonaws.com/dev/auth/signin
  GET - https://XXXX.execute-api.us-east-1.amazonaws.com/dev/test/public
  GET - https://XXXX.execute-api.us-east-1.amazonaws.com/dev/test/private
functions:
  Auth_SignIn: authreproduce-dev-Auth_SignIn
  Test_public: authreproduce-dev-Test_public
  Test_private: authreproduce-dev-Test_private
layers:
  None
```

Verify that the sever is installed

```
Serverless: Run the "serverless" command to setup monitoring, troubleshooting and testing.
$ curl  https://XXXX.execute-api.us-east-1.amazonaws.com/dev/auth/signin
{"authorization_token":"XXXXTOKENXXXX"}
```

## Install & run the client

## Install packages

$ cd client
$ npm install

## Edit the configuration file

Copy `src/app/environments/environments.sample.ts` to `src/app/environments/environment.ts` and replace the contents with values pertinent to your environment.

```
export const environment = {
  production: false,
  authUrl: 'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/auth/signin',
  awsconfig: {
    aws_project_region: 'us-east-1',
    Auth: {
      identityPoolId: 'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx',
      region: 'us-east-1',
      userPoolId: 'xx-xxxx-x_xxxxxxxx',                  // For some reason this is needed or amp won't init (another bug?).
      userPoolWebClientId: 'xxxxxxxxxxxxxxxxxxxxxxxxxx'  // For some reason this is needed or amp won't init (another bug?).
    }
  }
};
```

# Steps to reproduce

## Prove functioning under v2

The checked in package.json is using @amplify^2.2.6

```
$ ./node_modules/.bin/ng serve
```

You should be presented with a single page app, with 3 buttons (at the bottom). To reproduce
1) Click Get authorization_token, the Token, IdentityId and Decode Token fields should populate.
2) Click User authorziation_token to authenticate to Amplify. The Amplify Response should populate.

## Prove failure under v3

Install aws-amplify@3.0.5 and start the app.
```
$ node add aws-amplify@^3.0.5
$ ./node_modules/.bin/ng serve
```

You should be presented with a single page app, with 3 buttons (at the bottom). To reproduce
1) Click Get authorization_token, the Token, IdentityId and Decode Token fields should populate.
2) Click User authorziation_token to authenticate to Amplify. The Amplify Response should now generate an exception `NotAuthorizedException : Invalid login token. Can't pass in a Cognito token`.
