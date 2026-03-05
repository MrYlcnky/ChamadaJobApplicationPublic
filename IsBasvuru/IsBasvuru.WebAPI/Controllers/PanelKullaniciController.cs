using IsBasvuru.Domain.DTOs.AdminDtos.PanelKullaniciDtos;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace IsBasvuru.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Varsayılan olarak tüm işlemler yetki gerektirir
    public class PanelKullaniciController : BaseController
    {
        private readonly IPanelKullaniciService _service;

        public PanelKullaniciController(IPanelKullaniciService service)
        {
            _service = service;
        }

        [HttpGet("GetAll")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> GetAll()
        {
            var response = await _service.GetAllAsync();
            return CreateActionResultInstance(response);
        }

        [HttpGet("GetById/{id}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (id <= 0) return BadRequest("Geçersiz Kullanıcı ID.");

            var response = await _service.GetByIdAsync(id);
            return CreateActionResultInstance(response);
        }

        [HttpPost("Create")]
        [Authorize(Roles = "SuperAdmin,Admin")] 
        public async Task<IActionResult> Create([FromBody] PanelKullaniciCreateDto dto)
        {
            var response = await _service.CreateAsync(dto);
            return CreateActionResultInstance(response);
        }

        [HttpPut("Update")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Update([FromBody] PanelKullaniciUpdateDto dto)
        {
            var response = await _service.UpdateAsync(dto);
            return CreateActionResultInstance(response);
        }

        [HttpDelete("Delete/{id}")]
        [Authorize(Roles = "SuperAdmin,Admin")] 
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (id <= 0) return BadRequest("Geçersiz ID.");

            var response = await _service.DeleteAsync(id);
            return CreateActionResultInstance(response);
        }

        [HttpPost("ChangePassword")]
        [Authorize(Roles = "SuperAdmin,Admin,IkAdmin,Ik,GenelMudur,DepartmanMudur")]
        public async Task<IActionResult> ChangePassword([FromBody] PanelKullaniciPasswordChangeDto dto)
        {
            // 1. Token içerisindeki Kullanıcı ID'sini (NameIdentifier) alıyoruz
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "Oturum bilgisi okunamadı." });
            }

            // 2. Token ID'sini int'e çeviriyoruz
            if (!int.TryParse(userIdClaim.Value, out int currentUserId))
            {
                return BadRequest(new { message = "Geçersiz kullanıcı kimliği." });
            }

            // 3. GÜVENLİK KONTROLÜ (KRİTİK):
            // Kullanıcı sadece kendi ID'si için işlem yapabilir.
            // Eğer Token'daki ID ile DTO'daki ID uyuşmazsa işlemi reddediyoruz.
            if (currentUserId != dto.Id)
            {
                // 403 Forbidden: Yetkisiz işlem denemesi
                return StatusCode(403, new { message = "Sadece kendi şifrenizi değiştirebilirsiniz." });
            }

            // Servis çağrısı
            var result = await _service.ChangePasswordAsync(dto);

            if (result.Success)
                return Ok(result);

            return BadRequest(result);
        }
    }
}