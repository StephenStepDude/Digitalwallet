import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction';
import { PaymentMethodService } from '../../services/payment-method';
import { PaymentMethod } from '../../models/payment-method.model';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-send-money',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './send-money.html',
  styleUrl: './send-money.scss'
})
export class SendMoney implements OnInit {
  sendMoneyForm!: FormGroup;
  isLoading = false;
  paymentMethods: PaymentMethod[] = [];
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private paymentMethodService: PaymentMethodService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initForm();
    this.loadPaymentMethods();
  }

  initForm(): void {
    this.sendMoneyForm = this.fb.group({
      recipientEmail: ['', [Validators.required, Validators.email]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
      paymentMethodId: ['', Validators.required]
    });
  }

  loadPaymentMethods(): void {
    this.paymentMethodService.getPaymentMethods().subscribe({
      next: (methods) => {
        this.paymentMethods = methods;
        // Set default payment method if available
        const defaultMethod = this.paymentMethods.find(m => m.isDefault);
        if (defaultMethod) {          this.sendMoneyForm.patchValue({
            paymentMethodId: defaultMethod.paymentMethodId
          });
        }
      },
      error: () => {
        this.snackBar.open('Failed to load payment methods', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.sendMoneyForm.invalid) {
      return;
    }

    // Validate if amount is more than current balance
    if (this.currentUser && this.sendMoneyForm.value.amount > this.currentUser.balance) {
      this.snackBar.open('Insufficient balance to complete this transaction', 'Close', { duration: 5000 });
      return;
    }

    this.isLoading = true;
    this.transactionService.createTransaction({
      recipientEmail: this.sendMoneyForm.value.recipientEmail,
      amount: this.sendMoneyForm.value.amount,
      description: this.sendMoneyForm.value.description,
      paymentMethodId: this.sendMoneyForm.value.paymentMethodId
    }).subscribe({
      next: () => {
        this.snackBar.open('Money sent successfully', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/transactions']);
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error.error?.message || 'Failed to send money', 'Close', { duration: 5000 });
      }
    });
  }
}
