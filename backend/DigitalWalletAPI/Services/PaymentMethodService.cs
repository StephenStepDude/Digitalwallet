using DigitalWalletAPI.Data;
using DigitalWalletAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalWalletAPI.Services
{
    public class PaymentMethodService : IPaymentMethodService
    {
        private readonly ApplicationDbContext _context;

        public PaymentMethodService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaymentMethod> AddPaymentMethodAsync(int userId, string cardNumber, string expiryDate, string cvv)
        {
            // Check if user exists
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            // Create a new payment method with hashed CVV
            var paymentMethod = new PaymentMethod
            {
                UserId = userId,
                CardNumber = cardNumber,
                ExpiryDate = expiryDate,
                CVVHash = BCrypt.Net.BCrypt.HashPassword(cvv)
            };

            _context.PaymentMethods.Add(paymentMethod);
            await _context.SaveChangesAsync();

            return paymentMethod;
        }

        public async Task<List<PaymentMethod>> GetPaymentMethodsByUserIdAsync(int userId)
        {
            return await _context.PaymentMethods
                .Where(p => p.UserId == userId)
                .ToListAsync();
        }

        public async Task<PaymentMethod> GetPaymentMethodByIdAsync(int paymentMethodId)
        {
            return await _context.PaymentMethods.FindAsync(paymentMethodId);
        }

        public async Task DeletePaymentMethodAsync(int paymentMethodId, int userId)
        {
            var paymentMethod = await _context.PaymentMethods
                .FirstOrDefaultAsync(p => p.PaymentMethodId == paymentMethodId && p.UserId == userId);

            if (paymentMethod == null)
                throw new KeyNotFoundException("Payment method not found or does not belong to user");

            _context.PaymentMethods.Remove(paymentMethod);
            await _context.SaveChangesAsync();
        }
    }
}
