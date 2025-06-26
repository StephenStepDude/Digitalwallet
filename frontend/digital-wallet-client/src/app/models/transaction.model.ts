export interface Transaction {
  transactionId: number;
  senderId: number;
  senderEmail: string;
  receiverId: number;
  receiverEmail: string;
  amount: number;
  date: Date;
  status: TransactionStatus;
  description?: string;
}

export enum TransactionStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed'
}

export interface CreateTransactionRequest {
  recipientEmail: string;
  amount: number;
  description: string;
  paymentMethodId?: number;
}
