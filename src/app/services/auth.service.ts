import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth'; // Proxy handles this in dev, Vercel in prod
  private tokenKey = 'authToken';
  private userKey = 'authUser';

  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setSession(response);
          this.currentUserSubject.next(response);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    // In a real app, actually check token expiry
    return !!token;
  }

  isAdmin(): boolean {
    const user = this.getUserFromStorage();
    return user?.role === 'admin';
  }

  updateProfile(data: any): Observable<any> {
    const headers = { Authorization: `Bearer ${this.getToken()}` };
    return this.http.put(`${this.apiUrl}/profile`, data, { headers }).pipe(
      tap((updatedUser: any) => {
        const currentSession = this.getUserFromStorage();
        const newSession = { ...currentSession, ...updatedUser, id: updatedUser._id };
        localStorage.setItem(this.userKey, JSON.stringify(newSession));
        this.currentUserSubject.next(newSession);
      })
    );
  }

  private setSession(authResult: any) {
    localStorage.setItem(this.tokenKey, authResult.token);
    // Store simple user info - careful with what you store in local storage
    if (authResult.username) {
      localStorage.setItem(this.userKey, JSON.stringify({
        username: authResult.username,
        id: authResult.userId,
        role: authResult.role || 'user',
        email: authResult.email,
        profileImage: authResult.profileImage
      }));
    }
  }

  private getUserFromStorage() {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }
}
