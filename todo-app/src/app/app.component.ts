import { Component, Inject, Injectable, OnDestroy, OnInit } from "@angular/core";
import { mergeMap } from "rxjs/operators";
import { AuthenticationService } from "./authentication/authentication.service";
import { AppStateService } from "./_shared/services/app-state.service";
import { EventService } from "./_shared/services/event-service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public loading = true;

  constructor(
    public auth: AuthenticationService
    , public state: AppStateService
    , public eventService: EventService
  ) { }

  ngOnInit(): void {
    this.auth.Init()
      .pipe(mergeMap(() => this.state.load()))
      .pipe(mergeMap(() => this.eventService.initialize()))
      .subscribe(f => this.loading = false);
  }

  ngOnDestroy(): void {
    this.auth.OnDestroy();
  }

}
