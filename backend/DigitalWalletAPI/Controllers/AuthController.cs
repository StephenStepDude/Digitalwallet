using AutoMapper;
using DigitalWalletAPI.DTOs;
using DigitalWalletAPI.Models;
using DigitalWalletAPI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace DigitalWalletAPI.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IAuthService _authService;
        private readonly IMapper _mapper;

        public AuthController(IUserService userService, IAuthService authService, IMapper mapper)
        {
            _userService = userService;
            _authService = authService;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var user = await _userService.RegisterUserAsync(
                    registerDto.Email, 
                    registerDto.Password, 
                    registerDto.Phone);

                var token = await _authService.GenerateJwtTokenAsync(user);
                var userDto = _mapper.Map<UserDto>(user);

                return Ok(new AuthResponseDto
                {
                    Token = token,
                    User = userDto
                });
            }
            catch (System.InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userService.ValidateUserCredentialsAsync(loginDto.Email, loginDto.Password);
            if (user == null)
                return Unauthorized(new { message = "Invalid credentials" });

            var token = await _authService.GenerateJwtTokenAsync(user);
            var userDto = _mapper.Map<UserDto>(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                User = userDto
            });
        }
    }
}
