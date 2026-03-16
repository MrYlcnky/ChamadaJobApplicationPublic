using IsBasvuru.Domain.DTOs.SirketYapisiDtos.GorevAtamaDetayDtos;
using IsBasvuru.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IsBasvuru.WebAPI.Controllers
{
    [Authorize] // İçeriye sadece giriş yapanlar girebilir
    [Route("api/[controller]")]
    [ApiController]
    public class GorevAtamaDetayController : ControllerBase
    {
        private readonly IGorevAtamaDetayService _service;

        public GorevAtamaDetayController(IGorevAtamaDetayService service)
        {
            _service = service;
        }

        // HERKES OKUYABİLİR (İK, Genel Müdür, Mali İşler vb. ekranı açtığında görecek)
        [HttpGet("GetByPersonelId/{personelId}")]
        public async Task<IActionResult> GetByPersonelId(int personelId)
        {
            var result = await _service.GetByPersonelIdAsync(personelId);
            return Ok(result);
        }

        // SADECE DEPARTMAN MÜDÜRÜ, SUPER ADMIN VE ADMIN OLUŞTURABİLİR
        [Authorize(Roles = "DepartmanMudur,SuperAdmin,Admin")]
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] GorevAtamaDetayCreateDto dto)
        {
            // Güvenlik: İşlemi yapan yöneticinin ID'sini Token'dan otomatik alıyoruz!
            // Böylece Frontend'den manipüle edilemez.
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdStr, out int userId))
            {
                dto.PanelKullaniciId = userId;
            }

            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        // SADECE DEPARTMAN MÜDÜRÜ, SUPER ADMIN VE ADMIN GÜNCELLEYEBİLİR
        [Authorize(Roles = "DepartmanMudur,SuperAdmin,Admin")]
        [HttpPut("Update")]
        public async Task<IActionResult> Update([FromBody] GorevAtamaDetayUpdateDto dto)
        {
            // Güncellemede de token'dan ID'yi eziyoruz.
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdStr, out int userId))
            {
                dto.PanelKullaniciId = userId;
            }

            var result = await _service.UpdateAsync(dto);
            return Ok(result);
        }
    }
}