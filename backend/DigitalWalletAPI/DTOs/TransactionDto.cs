using System;
using DigitalWalletAPI.Models;

namespace DigitalWalletAPI.DTOs
{
    public class TransactionDto
    {
        public int TransactionId { get; set; }
        public int SenderId { get; set; }
        public string SenderEmail { get; set; }
        public int ReceiverId { get; set; }
        public string ReceiverEmail { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public TransactionStatus Status { get; set; }
    }

    public class SendMoneyDto
    {
        public int ReceiverId { get; set; }
        public decimal Amount { get; set; }
    }
}
