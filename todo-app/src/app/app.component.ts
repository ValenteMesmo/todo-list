import { HttpClient } from "@angular/common/http";
import { Component, Inject, Injectable, OnDestroy, OnInit } from "@angular/core";
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from "@azure/msal-angular";
import { EventMessage, EventType, InteractionStatus, RedirectRequest } from "@azure/msal-browser";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { Md5 } from "ts-md5";

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string,
  picture?: string
}

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  private readonly _destroying$ = new Subject<void>();
  public profile: ProfileType;
  public loading = true;


  constructor(
    private msalBroadcastService: MsalBroadcastService
    , private authService: MsalService
    , private http: HttpClient
    , @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration
  ) { }

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
        , takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        this.asdads();
      });

    this.asdads();
  }

  private asdads() {
    var loggedIn = this.authService.instance.getAllAccounts().length > 0;
    if (loggedIn)
      this.getProfile();
    else if (!window.location.hash) 
      this.loading = false;    
  }

  private getProfile() {
    this.http.get(GRAPH_ENDPOINT)
      .subscribe(profile => {
        this.loading = false;
        this.profile = profile;
        const md5 = new Md5();
        this.profile.picture = `https://www.gravatar.com/avatar/${md5.appendStr(this.profile.userPrincipalName).end()}`;
      });
  }

  ngOnDestroy(): void {
    this._destroying$.next(null);
    this._destroying$.complete();
  }

  login() {
    if (this.msalGuardConfig.authRequest)
      this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    else
      this.authService.loginRedirect();
  }

}
