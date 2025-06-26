using AutoMapper;
using DigitalWalletAPI.DTOs;
using DigitalWalletAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DigitalWalletAPI.Controllers
{
    [ApiController]
    [Route("api/payment-methods")]
    [Authorize]
    public class PaymentMethodController : ControllerBase
    {
        private readonly IPaymentMethodService _paymentMethodService;
        private readonly IMapper _mapper;

        public PaymentMethodController(IPaymentMethodService paymentMethodService, IMapper mapper)
        {
            _paymentMethodService = paymentMethodService;
            _mapper = mapper;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddPaymentMethod([FromBody] AddPaymentMethodDto addPaymentMethodDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            
            try
            {
                var paymentMethod = await _paymentMethodService.AddPaymentMethodAsync(
                    userId,
                    addPaymentMethodDto.CardNumber,
                    addPaymentMethodDto.ExpiryDate,
                    addPaymentMethodDto.CVV
                );

                var paymentMethodDto = _mapper.Map<PaymentMethodDto>(paymentMethod);
                return Ok(paymentMethodDto);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetPaymentMethods()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            
            var paymentMethods = await _paymentMethodService.GetPaymentMethodsByUserIdAsync(userId);
            var paymentMethodDtos = _mapper.Map<IEnumerable<PaymentMethodDto>>(paymentMethods);
            
            return Ok(paymentMethodDtos);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymentMethod(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            
            try
            {
                await _paymentMethodService.DeletePaymentMethodAsync(id, userId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
