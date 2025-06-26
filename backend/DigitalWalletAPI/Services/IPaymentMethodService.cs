using DigitalWalletAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalWalletAPI.Services
{
    public interface IPaymentMethodService
    {
        Task<PaymentMethod> AddPaymentMethodAsync(int userId, string cardNumber, string expiryDate, string cvv);
        Task<List<PaymentMethod>> GetPaymentMethodsByUserIdAsync(int userId);
        Task<PaymentMethod> GetPaymentMethodByIdAsync(int paymentMethodId);
        Task DeletePaymentMethodAsync(int paymentMethodId, int userId);
    }
}
