import { Component, OnInit, OnDestroy, Sanitizer } from '@angular/core';

import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { SocketService } from 'src/app/_services/socket.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {

  userName: any;
  photoUrl: SafeUrl;
  disconnectedSocket: Boolean = true;
  currentUserSubscription: Subscription;
  authToken: string = '';
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }
  constructor(private authService: AuthenticationService,
    public sanitizer: DomSanitizer, private route: ActivatedRoute, private socketService: SocketService, private toastr: ToastrService,
    private router: Router) {
  }
  ngOnInit() {


    this.socketService.disconnectedSocket();

    this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
      if (user) {
        this.authToken = user.authToken;
        this.userName = user.userDetails.name;
        let photo = user.userDetails.photoUrl;
        if (user.userDetails.provider === "local")
          this.photoUrl = environment.baseUrl + "" + photo;
        else
          this.photoUrl = photo;
        // this.photoUrl = this.sanitizer.bypassSecurityTrustUrl(photo);
        console.log(this.photoUrl)
      }


      //making socket connection
      this.makeSocketConnection();
      //activating socket to receive changes and comments
      this.getBroadCast();
    });
  }

  makeSocketConnection = () => {
    this.socketService.verifyUser().subscribe(
      (data) => {
        console.log('data hai ' + data)
        this.disconnectedSocket = false;
        this.socketService.setUser(this.authToken);
      });
  };

  protected getBroadCast: any = () => {
    this.socketService.registerForNotification()
      .subscribe((data) => {
        console.log(data)
        console.log('inside getBroadCast updated')
        this.toastr.success(`${data}`);
      }); //end of subscribe
  } //end get message from a user

  loggedIn() {
    return this.authService.loggedIn();
  }
  logout() {
    this.authService.logout();
  }
}
