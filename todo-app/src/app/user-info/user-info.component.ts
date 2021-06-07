import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Md5 } from 'ts-md5';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

type ProfileType = {
    givenName?: string,
    surname?: string,
    userPrincipalName?: string,
    id?: string,
    picture?: string
  }

@Component({
    selector: 'app-user-info',
    templateUrl: 'user-info.component.html',
    styleUrls: ['user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
    
    profile: ProfileType;

    constructor(
        private http: HttpClient
      ) { }

    ngOnInit() {
        this.getProfile();
    }

    getProfile() {
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