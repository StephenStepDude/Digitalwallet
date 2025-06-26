using DigitalWalletAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalWalletAPI.Services
{    public interface IUserService
    {
        Task<User> GetUserByIdAsync(int userId);
        Task<User> GetUserByEmailAsync(string email);
        Task<User> RegisterUserAsync(string email, string password, string phone);
        Task<User> ValidateUserCredentialsAsync(string email, string password);
        Task<List<User>> GetAllUsersAsync();
        Task<User> AddBalanceAsync(int userId, decimal amount);
    }
}
