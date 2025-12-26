import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = '/api/admin';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/users`, { headers: this.getHeaders() });
    }

    deleteUser(userId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/users/${userId}`, { headers: this.getHeaders() });
    }

    updateUser(userId: string, userData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/users/${userId}`, userData, { headers: this.getHeaders() });
    }

    getStats(): Observable<any> {
        return this.http.get(`${this.apiUrl}/stats`, { headers: this.getHeaders() });
    }
}
