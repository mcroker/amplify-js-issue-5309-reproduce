require('source-map-support');

import { APIGatewayProxyEvent, APIGatewayEventRequestContext, APIGatewayProxyCallback, APIGatewayProxyResult } from 'aws-lambda';
import { CognitoIdentity } from 'aws-sdk';

export interface CognitoCredentials {
  identityId: CognitoIdentity.IdentityId;
  token: CognitoIdentity.OIDCToken;
}

async function getCognitoToken(): Promise<CognitoCredentials> {
  return new Promise<CognitoCredentials>((resolve, reject) => {
    const clientConf: CognitoIdentity.ClientConfiguration = {};
    const cognitoidentity = new CognitoIdentity(clientConf);
    const params: CognitoIdentity.GetOpenIdTokenForDeveloperIdentityInput = {
      IdentityPoolId: process.env.COGNITO_IDENTITYPOOL,
      Logins: {
        developer: 'anyvalue'
      } as CognitoIdentity.LoginsMap
    };
    cognitoidentity.getOpenIdTokenForDeveloperIdentity(params, (err, data) => {
      if (err) {
        reject(err);  // an error occurred
      } else {
        if (undefined !== data.IdentityId && undefined !== data.Token) {
          const creds: CognitoCredentials = {
            identityId: data.IdentityId,
            token: data.Token
          };
          resolve(creds); // successful response
        } else {
          reject(new Error('identity or token is undefined in response from Cognito'));
        }
      }
    });
  });
}

export function signinHandler(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, cb: APIGatewayProxyCallback): void {
  getCognitoToken()
    .then((creds: CognitoCredentials) => {
      const response = {
        statusCode: 200,
        headers: {
          'Content-type': 'text/plain',
          'Content-Language': 'en',
          'Authorization-Token': creds.token,
          'Access-Control-Allow-Origin': '*' // Required for CORS support to work
        },
        body: JSON.stringify({ authorization_token: creds.token, identity_id: creds.identityId })
      };
      cb(null, response);
    })
    .catch((err: Error) => {
      console.error(err);
      const response = {
        statusCode: 500,
        headers: {
          'Content-type': 'text/plain',
          'Content-Language': 'en',
          'Access-Control-Allow-Origin': '*' // Required for CORS support to work
        },
        body: err.name + ' : ' + err.message
      };
      cb(null, response);
    });
}
