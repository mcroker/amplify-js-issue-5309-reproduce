import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FederatedResponse, FederatedUser } from '@aws-amplify/auth/lib/types';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Auth } from 'aws-amplify';

interface ServerAuthResponse {
  authorization_token: string;
  identity_id: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

  private jwtHelper: JwtHelperService = new JwtHelperService();

  authToken: string;
  identityId: string;
  tokenDataJSONString: string;
  tokenData: any;
  authResponse: string;

  constructor(
    private http: HttpClient
  ) { }

  async getToken() {
    const response = await this.http.get(environment.authUrl).toPromise() as ServerAuthResponse;
    console.log('http response:', response);
    this.authToken = response.authorization_token;
    this.identityId = response.identity_id;
    this.tokenData = this.jwtHelper.decodeToken(this.authToken);
    this.tokenDataJSONString = JSON.stringify(this.tokenData);
  }

  async authenticateWithToken() {
    const federatedUser: FederatedUser = {
      name: 'HARD CODED'
    };
    const tokenResponse: FederatedResponse = {
      identity_id: this.identityId,
      token: this.authToken,
      expires_at: this.tokenData.exp
    };
    try {
      const result = await Auth.federatedSignIn('developer', tokenResponse, federatedUser);
      this.authResponse = JSON.stringify(result);
    } catch (err) {
      const error = err as Error;
      this.authResponse = error.name + ' : ' + error.message;
      console.log(err);
    }
  }

  async signOut() {
    await Auth.signOut();
    this.authResponse = '';
  }

}
