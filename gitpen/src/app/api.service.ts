import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://127.0.0.1:5000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/all');
  }

  getFile(filepath: string): Observable<any> {
    let params = new HttpParams().set('filepath', filepath)
    return this.http.get<any>(this.baseUrl + '/get-file', { params: { filepath: filepath } });
  }

  saveFile(content: string, filepath: string): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/save-file', { content: content, filepath: filepath} );
  }
}
