import { Component, OnInit } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { AuthenticationService } from "../authentication.service";

@Component({
    selector: 'app-login-button',
    templateUrl: 'login-button.component.html',
    styleUrls: ['login-button.component.scss'],
})
export class LoginButtonComponent {

    constructor(
        protected readonly authService: AuthenticationService) { }
}