import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
    private config: any = {};

    constructor(private http: HttpClient) { }

    // async loadConfig(): Promise<ConfigService> {
    async loadConfig(): Promise<void> {
        try {
            this.config = await firstValueFrom(this.http.get('/assets/config.json'));
        } catch (error) {
            console.error('could not load config.json', error);
        }
    }

    get(key: string): any {
        return this.config[key] || null;
    }

    getApiUrl(): string {
        return this.get('apiUrl') || 'http://localhost:5000/api';
    }
}
