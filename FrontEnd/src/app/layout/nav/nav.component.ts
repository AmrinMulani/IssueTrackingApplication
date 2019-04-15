import { Component, OnInit, OnDestroy, Sanitizer } from '@angular/core';

import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {



  userName: any;
  photoUrl: SafeUrl;

  currentUserSubscription: Subscription;

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }
  constructor(private authService: AuthenticationService,
    public sanitizer: DomSanitizer, private route: ActivatedRoute, private toastr: ToastrService,
    private router: Router) {
  }
  ngOnInit() {
    this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
      if (user) {
        this.userName = user.userDetails.name;
        let photo = user.userDetails.photoUrl;
        if (user.userDetails.provider === "local")
          this.photoUrl = environment.baseUrl + "" + photo;
        else
          this.photoUrl = photo;
        // this.photoUrl = this.sanitizer.bypassSecurityTrustUrl(photo);
        console.log(this.photoUrl)
      }
    });
  }

  loggedIn() {
    //return true
    return this.authService.loggedIn();
  }
  logout() {
    this.authService.logout();
  }
}
