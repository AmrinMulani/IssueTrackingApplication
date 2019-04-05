import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  userName: any;
  photoUrl: any;

  currentUserSubscription: Subscription;
  constructor(private authService: AuthenticationService, private toastr: ToastrService,
    private router: Router) {
  }
  ngOnInit() {
    this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
      console.log('user')
      console.log(user)
      this.userName = user.userDetails.name;
      this.photoUrl = user.userDetails.photoUrl;
    });
  }
  loggedIn() {
    return this.authService.loggedIn();
  }
  logout() {
    this.authService.logout();
    this.toastr.info("Logged out successfully!");
    this.router.navigate(['/login'])
  }
}
