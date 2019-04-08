import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private url = "http://localhost:3000/api/v1/issues/";
  constructor(private http: HttpClient) { }

  getIssue(issueId: string, authToken: string): Observable<any> {
    return this.http.get(`${this.url}view/${issueId}?authToken=${authToken}`);
  }

  deletePhoto(issueId: string, photo: string, authToken: string) : Observable<any> {
    const httpParam = new HttpParams()
      .set('issueId', issueId)
      .set('photo', photo)
      .set('authToken', authToken);
    return this.http.delete(`${this.url}delete/photo`, { 'params': httpParam });
  };//end of deletePhoto
}
