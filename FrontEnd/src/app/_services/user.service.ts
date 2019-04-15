import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  // private url = "http://localhost:3000/api/v1/users";
  private url = "http://myapp.issuetrackingtool.ga/api/v1/users";

  constructor(private http: HttpClient) { }


  getAllUsers(): Observable<any> {
    return this.http.get(`${this.url}/get`);
  };//end of get all users


  createIssue(data): Observable<any> {
    // console.log('data');
    // console.log(data);
    return this.http.post(`${this.url}/create`, data);
  };

  //calling from sign up page
  register(data): Observable<any> {
    return this.http.post(`${this.url}/register`, data)
      .pipe(catchError(e => this.handleError(e)));
  };//end of register method

  login(data): Observable<any> {
    const params = new HttpParams()
      .set('username', data.username)
      .set('password', data.password);
    return this.http.post(`${this.url}/login`, params)
      .pipe(catchError(e => this.handleError(e)));
  }
  //exception handler
  private handleError(err: HttpErrorResponse) {
    console.log(err)
    console.log("Handle Http calls error");
    console.log(err.error.message);
    return throwError(err.error);
  }
}
