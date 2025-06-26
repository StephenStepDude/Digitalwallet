import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTransactionRequest, Transaction } from '../models/transaction.model';
import { Api } from './api';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private api: Api) { }
  getTransactions(): Observable<Transaction[]> {
    // Get the current user ID from AuthService
    const currentUser = JSON.parse(localStorage.getItem('user_data') || '{}');
    const userId = currentUser.id;
    return this.api.get<Transaction[]>(`transactions/${userId}`);
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.api.get<Transaction>(`transactions/details/${id}`);
  }
  createTransaction(transaction: CreateTransactionRequest): Observable<Transaction> {
    return this.api.post<Transaction>('transactions/send', {
      receiverEmail: transaction.recipientEmail,
      amount: transaction.amount,
      description: transaction.description,
      paymentMethodId: transaction.paymentMethodId
    });
  }
}
