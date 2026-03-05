using IsBasvuru.Domain.DTOs.AdminDtos; 
using IsBasvuru.Domain.DTOs.KimlikDogrulamaDtos;
using IsBasvuru.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization; 
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IsBasvuru.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous] 
    public class KimlikDogrulamaController : BaseController
    {
        private readonly IKimlikDogrulamaService _kimlikService;
        private readonly IAuthService _authService;

        public KimlikDogrulamaController(IKimlikDogrulamaService kimlikService, IAuthService authService)
        {
            _kimlikService = kimlikService;
            _authService = authService;
        }

        // 1. Admin/Panel Girişi (Token Alma Yeri)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AdminLoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            return CreateActionResultInstance(result);
        }

        // 2. Doğrulama Kodu Gönderme
        [HttpPost("kod-gonder")]
        public async Task<IActionResult> KodGonder([FromBody] KodGonderDto dto)
        {
            var response = await _kimlikService.KodGonderAsync(dto);
            return CreateActionResultInstance(response);
        }

        // 3. Kod Doğrulama
        [HttpPost("kod-dogrula")]
        public async Task<IActionResult> KodDogrula([FromBody] KodDogrulaDto dto)
        {
            var response = await _kimlikService.KodDogrulaAsync(dto);
            return CreateActionResultInstance(response);
        }
    }
}