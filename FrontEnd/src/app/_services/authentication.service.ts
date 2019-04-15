import { Injectable } from '@angular/core';

import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http'

import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private url = "http://api.issuetrackingtool.ga/api/v1/users";
  userName: string;

  //private currentUserSubject: BehaviorSubject<any>;
  //public currentUser: Observable<any>;

  currentData: any;
  currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('userData')));
  currentUser = this.currentUserSubject.asObservable();
  constructor(private httpClient: HttpClient, private router: Router, private toastr: ToastrService) {
    console.log('service instance created')
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  changeUserData(photoUrl: string) {
    this.currentUserSubject.next(photoUrl);
  }
  // login(data): Observable<any> {
  //   const params = new HttpParams()
  //     .set('email', data.email)
  //     .set('password', data.password);
  //   return this.httpClient.post(`${this.url}/login`, params)
  //   .pipe(map(user => {
  //     if (user && user.data.authToken) {
  //       console.log('user.data.authToken')
  //       console.log(user.data.authToken)

  //       // store user details and jwt token in local storage to keep user logged in between page refreshes
  //       localStorage.setItem('currentUser', JSON.stringify(user));
  //       this.currentUserSubject.next(user);
  //     }
  //     return user;
  //   }));
  // }
  signInSocial(p): Observable<any> {
    var httpParams = new HttpParams()
      .set('type', p.type)
      .set('idToken', p.idToken);
    return this.httpClient.post<any>(`${this.url}/signInSocial`, httpParams)
      .pipe(map(user => {
        if (user && user.data.authToken) {
          console.log('user.data.authToken')
          console.log(user.data.authToken)

          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('userData', JSON.stringify(user.data));
          this.changeUserData(user.data);
          this.currentData = user.data;
        }
        return user;
      }));
  }

  login(data): Observable<any> {
    const params = new HttpParams()
      .set('username', data.username)
      .set('password', data.password);
    return this.httpClient.post<any>(`${this.url}/login`, params)
      .pipe(map(user => {
        if (user && user.data.authToken) {
          console.log('user.data.authToken')
          console.log(user.data.authToken)
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('userData', JSON.stringify(user.data));
          this.changeUserData(user.data);
          this.currentData = user.data;
        }
        return user;
      }))
      .pipe(catchError(e => this.handleError(e)));
  }
  //exception handler
  private handleError(err: HttpErrorResponse) {
    console.log(err)
    console.log("Handle Http calls error");
    console.log(err.error.message);
    return throwError(err.error);
  }
  storeData(data) {
    this.userName = data.userDetails.name;
    localStorage.setItem('userData', JSON.stringify(data));
  }

  loggedIn(): boolean {
    const token = JSON.parse(localStorage.getItem('userData'));
    if (token === null || token.authToken === null || token.authToken === '' || token.authToken === undefined) {
      return false;
    } return true;
  }
  logout() {
    this.currentUserSubject.next(null);
    console.log(this.currentUserSubject.value);
    localStorage.removeItem('userData');
    this.toastr.info("Logged out successfully!");
    this.router.navigate(['/login'])
  }
}
