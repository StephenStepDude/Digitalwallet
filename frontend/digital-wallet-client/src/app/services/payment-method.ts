import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePaymentMethodRequest, PaymentMethod } from '../models/payment-method.model';
import { Api } from './api';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  constructor(private api: Api) { }
  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.api.get<PaymentMethod[]>('payment-methods');
  }

  getPaymentMethodById(id: number): Observable<PaymentMethod> {
    return this.api.get<PaymentMethod>(`payment-methods/${id}`);
  }

  createPaymentMethod(paymentMethod: CreatePaymentMethodRequest): Observable<PaymentMethod> {
    return this.api.post<PaymentMethod>('payment-methods/add', {
      cardNumber: paymentMethod.cardNumber,
      expiryDate: paymentMethod.expiryDate,
      cvv: paymentMethod.cvv,
      setAsDefault: paymentMethod.setAsDefault
    });
  }

  setDefaultPaymentMethod(id: number): Observable<any> {
    return this.api.put<any>(`payment-methods/${id}/default`, {});
  }

  deletePaymentMethod(id: number): Observable<any> {
    return this.api.delete<any>(`payment-methods/${id}`);
  }
}
