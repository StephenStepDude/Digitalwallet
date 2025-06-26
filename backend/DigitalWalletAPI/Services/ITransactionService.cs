using DigitalWalletAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalWalletAPI.Services
{
    public interface ITransactionService
    {
        Task<Transaction> CreateTransactionAsync(int senderId, int receiverId, decimal amount);
        Task<List<Transaction>> GetTransactionsByUserIdAsync(int userId);
        Task<Transaction> GetTransactionByIdAsync(int transactionId);
    }
}
