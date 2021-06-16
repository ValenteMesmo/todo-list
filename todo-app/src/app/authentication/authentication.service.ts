import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, OnDestroy, OnInit } from "@angular/core";
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from "@azure/msal-angular";
import { InteractionStatus, RedirectRequest } from "@azure/msal-browser";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { Md5 } from "ts-md5";

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string,
  picture?: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private readonly _destroying$ = new Subject<void>();
  public profile: ProfileType;

  private _loggedIn: boolean;
  public get loggedIn(): boolean {
    return this._loggedIn;
  }

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration
    , private authService: MsalService
    , private msalBroadcastService: MsalBroadcastService
    , private http: HttpClient) {
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
        , takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay(true);
      });

    this.setLoginDisplay(false);
  }

  private setLoginDisplay(requestLogin: boolean) {
    this._loggedIn = this.authService.instance.getAllAccounts().length > 0;

    if (this._loggedIn && requestLogin)
      this.getProfile();
  }

  login() {
    if (this.msalGuardConfig.authRequest)
      this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    else
      this.authService.loginRedirect();
  }

  logout() {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: "/",
    });
  }

  private getProfile() {
    this.http.get(GRAPH_ENDPOINT)
      .subscribe(profile => {
        this.profile = profile;
        const md5 = new Md5();
        this.profile.picture = `https://www.gravatar.com/avatar/${md5.appendStr(this.profile.userPrincipalName).end()}`;
      });
  }

  upload() {
    ///me/drive/root:/FolderA/FileB.txt:/content
    this.http.put(`${GRAPH_ENDPOINT}/drive/root:/todoApp/testEvents.txt:/content`, 'teste 2')
      .subscribe(f => console.log(f), f => console.log(f));
  }
}
