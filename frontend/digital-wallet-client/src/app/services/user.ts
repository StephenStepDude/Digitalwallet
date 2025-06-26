import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Api } from './api';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private api: Api,
    private authService: AuthService
  ) { }
  getUserDetails(): Observable<User> {
    return this.api.get<User>('user').pipe(
      tap(user => {
        // Update the current user with the latest details including balance
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            balance: user.balance
          };
          localStorage.setItem('user_data', JSON.stringify(updatedUser));
          // Notify the auth service of the updated user data
          this.authService.refreshCurrentUser();
        }
      })
    );
  }

  deposit(amount: number): Observable<User> {
    return this.api.post<User>('users/deposit', { amount }).pipe(
      tap(user => {
        // Update the current user with the latest details including balance
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            balance: user.balance
          };
          localStorage.setItem('user_data', JSON.stringify(updatedUser));
          // Notify the auth service of the updated user data
          this.authService.refreshCurrentUser();
        }
      })
    );
  }
}
