import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaymentMethod } from '../../models/payment-method.model';
import { Transaction } from '../../models/transaction.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth';
import { PaymentMethodService } from '../../services/payment-method';
import { TransactionService } from '../../services/transaction';
import { Api } from '../../services/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  currentUser: User | null = null;
  recentTransactions: Transaction[] = [];
  paymentMethods: PaymentMethod[] = [];
  isLoadingTransactions = false;
  isLoadingPaymentMethods = false;
  displayedColumns: string[] = ['date', 'description', 'amount', 'status'];

  constructor(
    private authService: AuthService,
    private api: Api,
    private transactionService: TransactionService,
    private paymentMethodService: PaymentMethodService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadRecentTransactions();
    this.loadPaymentMethods();
  }

  loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Get updated user data including balance
    this.api.get<User>('user/me').subscribe({
      next: (userData) => {
        // Update the stored user data
        const updatedUser = {
          ...this.currentUser,
          ...userData
        };
        
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        this.currentUser = updatedUser;
      }
    });
  }

  loadRecentTransactions(): void {
    this.isLoadingTransactions = true;
    this.transactionService.getTransactions().subscribe({
      next: (transactions) => {
        this.recentTransactions = transactions.slice(0, 5); // Get only the 5 most recent
        this.isLoadingTransactions = false;
      },
      error: () => {
        this.isLoadingTransactions = false;
      }
    });
  }

  loadPaymentMethods(): void {
    this.isLoadingPaymentMethods = true;
    this.paymentMethodService.getPaymentMethods().subscribe({
      next: (paymentMethods) => {
        this.paymentMethods = paymentMethods;
        this.isLoadingPaymentMethods = false;
      },
      error: () => {
        this.isLoadingPaymentMethods = false;
      }
    });
  }
}
