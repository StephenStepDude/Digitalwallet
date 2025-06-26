export interface PaymentMethod {
  paymentMethodId: number;
  id: number; // Adding id property as an alias for paymentMethodId
  cardNumber: string; // Last 4 digits only for display
  expiryDate: string;
  isDefault: boolean;
  cardType?: string;
}

export interface CreatePaymentMethodRequest {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string; // Format: MM/YY
  cvv: string;
  setAsDefault: boolean;
}
