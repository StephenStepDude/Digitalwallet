using DigitalWalletAPI.Data;
using DigitalWalletAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalWalletAPI.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserService _userService;

        public TransactionService(ApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }        public async Task<Transaction> CreateTransactionAsync(int senderId, int receiverId, decimal amount)
        {
            // Validate users
            var sender = await _userService.GetUserByIdAsync(senderId);
            if (sender == null)
                throw new KeyNotFoundException("Sender not found");

            var receiver = await _userService.GetUserByIdAsync(receiverId);
            if (receiver == null)
                throw new KeyNotFoundException("Receiver not found");

            // Validate amount
            if (amount <= 0)
                throw new ArgumentException("Amount must be greater than zero");

            // Check if sender has sufficient balance
            if (sender.Balance < amount)
                throw new ArgumentException("Insufficient balance to complete this transaction");

            // Update balances
            sender.Balance -= amount;
            receiver.Balance += amount;

            // Create transaction record
            var transaction = new Transaction
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Amount = amount,
                Date = DateTime.UtcNow,
                Status = TransactionStatus.Completed
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return transaction;
        }

        public async Task<List<Transaction>> GetTransactionsByUserIdAsync(int userId)
        {
            // Get transactions where the user is either sender or receiver
            return await _context.Transactions
                .Include(t => t.Sender)
                .Include(t => t.Receiver)
                .Where(t => t.SenderId == userId || t.ReceiverId == userId)
                .OrderByDescending(t => t.Date)
                .ToListAsync();
        }

        public async Task<Transaction> GetTransactionByIdAsync(int transactionId)
        {
            return await _context.Transactions
                .Include(t => t.Sender)
                .Include(t => t.Receiver)
                .FirstOrDefaultAsync(t => t.TransactionId == transactionId);
        }
    }
}
