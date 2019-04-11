import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = "http://localhost:3000/api/v1/users";
  constructor(private http: HttpClient) { }
  
  
  getAllUsers() : Observable<any>{
    return this.http.get(`${this.url}/get`);
  };//end of get all users


  createIssue(data): Observable<any>{
    // console.log('data');
    // console.log(data);
    return this.http.post(`${this.url}/create`, data)
  };

}
