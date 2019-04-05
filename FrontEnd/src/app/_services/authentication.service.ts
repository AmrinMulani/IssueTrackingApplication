import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http'

import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private url = "http://localhost:3000/api/v1/users";
  userName: string;

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private httpClient: HttpClient) {
    console.log('service instance created')
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('userData')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  login(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);
    return this.httpClient.post(`${this.url}/login`, params);
  }
  signInSocial(data): Observable<any> {
    var httpParams = new HttpParams()
      .set('type', data.type)
      .set('idToken', data.idToken);
    return this.httpClient.post(`${this.url}/signInSocial`, httpParams);
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
    localStorage.removeItem('userData');
    this.currentUserSubject.next(null);
  }
}
