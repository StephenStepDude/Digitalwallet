using System;

namespace DigitalWalletAPI.Models
{
    public enum TransactionStatus
    {
        Pending,
        Completed,
        Failed,
        Cancelled
    }

    public class Transaction
    {
        public int TransactionId { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public TransactionStatus Status { get; set; }

        public User Sender { get; set; }
        public User Receiver { get; set; }
    }
}
