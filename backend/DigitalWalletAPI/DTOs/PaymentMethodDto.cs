using System;

namespace DigitalWalletAPI.DTOs
{
    public class PaymentMethodDto
    {
        public int PaymentMethodId { get; set; }
        public string CardNumber { get; set; }
        public string ExpiryDate { get; set; }
    }

    public class AddPaymentMethodDto
    {
        public string CardNumber { get; set; }
        public string ExpiryDate { get; set; }
        public string CVV { get; set; }
    }
}
