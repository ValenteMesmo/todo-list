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
    protected readonly authService: AuthenticationService
    , public alertController: AlertController) { }

  async logout() {
    const alert = await this.alertController.create({
      //cssClass: 'my-custom-class',
      header: this.authService.profile.givenName,
      message: `Logado como ${this.authService.profile.userPrincipalName}`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          //cssClass: 'secondary',
          handler: () => { }
        }, {
          text: 'Logout',
          cssClass: 'color-danger',
          handler: () => this.authService.logout()
        }
      ]
    });

    await alert.present();
  }


}
