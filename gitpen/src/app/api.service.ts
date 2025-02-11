import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private baseUrl = '';

  constructor(private http: HttpClient, private configService: ConfigService) {
      this.baseUrl = this.configService.getApiUrl();
  }

  getAll(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/all');
  }

  getFile(filepath: string): Observable<any> {
    let params = new HttpParams().set('filepath', filepath)
    return this.http.get<any>(this.baseUrl + '/get-file', { params: { filepath: filepath } });
  }

  getLast(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/get-last');
  }

  saveFile(content: string, filepath: string): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/save-file', { content: content, filepath: filepath} );
  }
}
