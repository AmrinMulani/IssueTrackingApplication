import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular-6-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  //private user: SocialUser;
  private loggedIn: boolean;
  constructor(private socialAuthService: AuthService, public authenticationService: AuthenticationService, private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  // login = () => {
  //   this.authenticationService.login(this.model)
  //   .pipe(first())
  //       .subscribe(
  //         data => {
  //   //     this.toastr.success("Logged in successfully");

  //           this.router.navigate(['/dashboard'])
  //         },
  //         error => {
  //           this.toastr.error(error);
  //         });
  //   // .subscribe(
  //   //   (data) => {
  //   //     this.toastr.success("Logged in successfully");
  //   //   }, (error) => {
  //   //     this.toastr.error(error);
  //   //   }, () => {
  //   //     this.router.navigate(['/members'])
  //   //   }
  //   // );
  // };//end of login function

  public signInSocial(using: String): void {
    let socialPlatformProvider = "";
    alert('social login' + using)
    if (using === "Google")
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;

    this.socialAuthService.signIn(socialPlatformProvider).then(userData => {
      this.apiConnection(userData);
    });
  }
  apiConnection(data) {
    console.log(data);
    let socialObj = {
      idToken: data.idToken,
      type: 'google'
    };
    this.authenticationService.signInSocial(socialObj)
    .pipe(first())
        .subscribe(
          data => {
            this.router.navigate(['/dashboard'])
          },
          error => {
            this.toastr.error(error);
          });
    // .subscribe(
    //   (result) => {
    //     if (result.error === false) {
    //       this.toastr.success('Login Successfully');
    //       this.authenticationService.storeData(result.data);
    //     }
    //     else {
    //       this.toastr.error(result.message);
    //     }
    //   },
    //   err => {
    //     this.toastr.error(err);
    //   }, () => {
    //     this.router.navigate(['/dashboard']);
    //   });
  }
}
