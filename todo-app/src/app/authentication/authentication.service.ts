import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, OnDestroy, OnInit } from "@angular/core";
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from "@azure/msal-angular";
import { EventMessage, EventType, InteractionStatus, RedirectRequest } from "@azure/msal-browser";
import { Observable, Subject, Subscriber } from "rxjs";
import { filter, map, takeUntil, tap } from "rxjs/operators";
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
    , private http: HttpClient) { }

  public Init(): Observable<boolean> {

    return new Observable(sub => {

      this.msalBroadcastService.msalSubject$
        .pipe(
          filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
          , takeUntil(this._destroying$)
        )
        .subscribe((result: EventMessage) => {
          this.asdads(sub);
        });

      this.asdads(sub);
    });
  }

  private asdads(sub: Subscriber<boolean>) {
    var loggedIn = this.authService.instance.getAllAccounts().length > 0;
    if (loggedIn)
      this.getProfile(sub);
    else if (!window.location.hash) {
      sub.next(false);
      sub.complete();
    }
  }

  private getProfile(sub: Subscriber<boolean>) {
    this.http.get(GRAPH_ENDPOINT)
      .subscribe(profile => {
        sub.next(true);
        sub.complete();
        this.profile = profile;
        const md5 = new Md5();
        this.profile.picture = `https://www.gravatar.com/avatar/${md5.appendStr(this.profile.userPrincipalName).end()}`;
      });
  }

  public OnDestroy(): void {
    this._destroying$.next(null);
    this._destroying$.complete();
  }

  public login() {
    if (this.msalGuardConfig.authRequest)
      this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    else
      this.authService.loginRedirect();
  }

  public logout() {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: "/",
    });
  }

  public save(fileName: string, content: any): Observable<any> {
    return this.http.put(
      `${GRAPH_ENDPOINT}/drive/root:/todoApp/${fileName.replace('/', '-')}.json:/content`
      , JSON.stringify(content));
  }

  //TODO: handle 302 Found
  public load<T>(fileName: string): Observable<T> {
    return this.http.get(
      `${GRAPH_ENDPOINT}/drive/root:/todoApp/${fileName.replace('/', '-')}.json:/content`)
      .pipe(
        tap(response => {
          console.log(response);
        })
        , map(f => f as T));
  }
}
