import { Inject, Injectable, OnDestroy, OnInit } from "@angular/core";
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from "@azure/msal-angular";
import { InteractionStatus, RedirectRequest } from "@azure/msal-browser";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {

    private readonly _destroying$ = new Subject<void>();

    private _loggedIn: boolean;
    public get loggedIn(): boolean {
        return this._loggedIn;
    }

    constructor(
        @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration
        , private authService: MsalService
        , private msalBroadcastService: MsalBroadcastService) {
        this.msalBroadcastService.inProgress$
            .pipe(
                filter((status: InteractionStatus) => status === InteractionStatus.None)
                , takeUntil(this._destroying$)
            )
            .subscribe(() => {
                this.setLoginDisplay();
            });

        this.setLoginDisplay();
    }

    private setLoginDisplay() {
        this._loggedIn = this.authService.instance.getAllAccounts().length > 0;
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
}