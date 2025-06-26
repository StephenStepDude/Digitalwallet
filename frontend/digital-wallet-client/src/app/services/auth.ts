import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { User } from '../models/user.model';
import { Api } from './api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(private api: Api, private router: Router) {
    const platformId = inject(PLATFORM_ID);
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.loadUserFromStorage();
    }
  }
  private loadUserFromStorage(): void {
    if (!this.isBrowser) return;

    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        this.currentUserSubject.next(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth_token');
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/login', credentials).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/register', userData).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }  private handleAuthResponse(response: AuthResponse): void {
    // Create a user object from the response
    const user: User = {
      id: response.user.userId,
      email: response.user.email,
      phone: response.user.phone,
      firstName: response.user.firstName || '',
      lastName: response.user.lastName || '',
      createdDate: new Date(response.user.createdDate),
      balance: 0 // Will be updated on dashboard load
    };

    if (this.isBrowser) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(user));
    }

    this.currentUserSubject.next(user);
  }
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }

    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser) return false;

    const token = localStorage.getItem('auth_token');
    return !!token; // Convert to boolean
  }
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  refreshCurrentUser(): Observable<User> {
    return this.api.get<User>('users/me').pipe(
      tap(user => {
        if (this.isBrowser) {
          localStorage.setItem('user_data', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
      })
    );
  }
}
