using System;

namespace DigitalWalletAPI.Models
{
    public class PaymentMethod
    {
        public int PaymentMethodId { get; set; }
        public int UserId { get; set; }
        public string CardNumber { get; set; }
        public string ExpiryDate { get; set; }
        public string CVVHash { get; set; }

        public User User { get; set; }
    }
}
