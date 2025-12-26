import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    private apiUrl = '/api/docs';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    getDocuments(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    addDocument(docData: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, docData, { headers: this.getHeaders() });
    }

    updateDocument(id: string, docData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, docData, { headers: this.getHeaders() });
    }

    deleteDocument(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}
