import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Contact {
    _id?: string;
    userId?: string;
    name: string;
    mobileNumber: string;
    email?: string;
    category?: string;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private apiUrl = 'http://localhost:3000/api/contacts';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders() {
        return new HttpHeaders({
            'Authorization': `Bearer ${this.authService.getToken()}`
        });
    }

    getContacts(): Observable<Contact[]> {
        return this.http.get<Contact[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    addContact(contact: Contact): Observable<Contact> {
        return this.http.post<Contact>(this.apiUrl, contact, { headers: this.getHeaders() });
    }

    updateContact(id: string, contact: Contact): Observable<Contact> {
        return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact, { headers: this.getHeaders() });
    }

    deleteContact(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}
