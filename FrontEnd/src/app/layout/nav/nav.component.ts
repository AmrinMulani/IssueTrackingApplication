import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
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
  constructor(private authService: AuthenticationService, private route: ActivatedRoute, private toastr: ToastrService,
    private router: Router) {
    // route.params.subscribe(
    //   () => {
        
    //   });
  }
  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      console.log('user')
      console.log(user)
      this.userName = user.userDetails.name;
      this.photoUrl = user.userDetails.photoUrl;
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
