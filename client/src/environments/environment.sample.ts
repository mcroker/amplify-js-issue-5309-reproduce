// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
