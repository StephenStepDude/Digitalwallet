using AutoMapper;
using DigitalWalletAPI.DTOs;
using DigitalWalletAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DigitalWalletAPI.Controllers
{
    [ApiController]
    [Route("api/transactions")]
    [Authorize]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionService _transactionService;
        private readonly IMapper _mapper;

        public TransactionController(ITransactionService transactionService, IMapper mapper)
        {
            _transactionService = transactionService;
            _mapper = mapper;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMoney([FromBody] SendMoneyDto sendMoneyDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var senderId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            
            try
            {
                var transaction = await _transactionService.CreateTransactionAsync(
                    senderId,
                    sendMoneyDto.ReceiverId,
                    sendMoneyDto.Amount
                );

                var transactionDto = _mapper.Map<TransactionDto>(transaction);
                return Ok(transactionDto);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetTransactionHistory(int userId)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            
            // Only allow users to view their own transactions
            if (currentUserId != userId)
                return Forbid();

            var transactions = await _transactionService.GetTransactionsByUserIdAsync(userId);
            var transactionDtos = _mapper.Map<IEnumerable<TransactionDto>>(transactions);
            
            return Ok(transactionDtos);
        }

        [HttpGet("details/{id}")]
        public async Task<IActionResult> GetTransactionDetails(int id)
        {
            var transaction = await _transactionService.GetTransactionByIdAsync(id);
            
            if (transaction == null)
                return NotFound();

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            
            // Only allow users to view their own transactions
            if (transaction.SenderId != currentUserId && transaction.ReceiverId != currentUserId)
                return Forbid();

            var transactionDto = _mapper.Map<TransactionDto>(transaction);
            return Ok(transactionDto);
        }
    }
}
