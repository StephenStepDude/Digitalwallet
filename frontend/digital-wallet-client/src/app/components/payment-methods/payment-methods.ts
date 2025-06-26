import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PaymentMethod } from '../../models/payment-method.model';
import { PaymentMethodService } from '../../services/payment-method';

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  templateUrl: './payment-methods.html',
  styleUrl: './payment-methods.scss'
})
export class PaymentMethods implements OnInit {
  paymentMethods: PaymentMethod[] = [];
  isLoading = false;
  showAddForm = false;
  paymentForm!: FormGroup;
  
  constructor(
    private paymentMethodService: PaymentMethodService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPaymentMethods();
  }

  initForm(): void {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      cardholderName: ['', Validators.required],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\\/[0-9]{2}$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      setAsDefault: [false]
    });
  }

  loadPaymentMethods(): void {
    this.isLoading = true;
    this.paymentMethodService.getPaymentMethods().subscribe({
      next: (methods) => {
        this.paymentMethods = methods;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load payment methods', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      this.initForm(); // Reset form when showing
    }
  }

  submitPaymentMethod(): void {
    if (this.paymentForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.paymentMethodService.createPaymentMethod(this.paymentForm.value).subscribe({
      next: () => {
        this.snackBar.open('Payment method added successfully', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.showAddForm = false;
        this.loadPaymentMethods();
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Failed to add payment method', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  setDefaultPaymentMethod(id: number): void {
    this.isLoading = true;
    this.paymentMethodService.setDefaultPaymentMethod(id).subscribe({
      next: () => {
        this.snackBar.open('Default payment method updated', 'Close', { duration: 3000 });
        this.loadPaymentMethods();
      },
      error: (error) => {
        this.snackBar.open('Failed to update default payment method', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  deletePaymentMethod(id: number): void {
    if (confirm('Are you sure you want to delete this payment method?')) {
      this.isLoading = true;
      this.paymentMethodService.deletePaymentMethod(id).subscribe({
        next: () => {
          this.snackBar.open('Payment method deleted', 'Close', { duration: 3000 });
          this.loadPaymentMethods();
        },
        error: (error) => {
          this.snackBar.open('Failed to delete payment method', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }
}
