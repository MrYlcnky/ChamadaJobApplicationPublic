using IsBasvuru.Domain.DTOs.TanimlamalarDtos.DilDtos;
using IsBasvuru.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IsBasvuru.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class DilController : BaseController
    {
        private readonly IDilService _service;

        public DilController(IDilService service)
        {
            _service = service;
        }

        [HttpGet("GetAll")]
        [AllowAnonymous] // Adaylar dil seçeneklerini görebilmeli
        public async Task<IActionResult> GetAll()
        {
            var response = await _service.GetAllAsync();
            return CreateActionResultInstance(response);
        }

        [HttpGet("GetById/{id}")]
        [Authorize(Roles = "SuperAdmin,Admin")] // Detay sadece yöneticilere özel olabilir
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (id <= 0) return BadRequest("Geçersiz ID.");

            var response = await _service.GetByIdAsync(id);
            return CreateActionResultInstance(response);
        }

        [HttpPost("Create")]
        [Authorize(Roles = "SuperAdmin,Admin")] // Yeni dil ekleme sadece yöneticilere açık
        public async Task<IActionResult> Create([FromBody] DilCreateDto dto)
        {
            var response = await _service.CreateAsync(dto);
            return CreateActionResultInstance(response);
        }

        [HttpPut("Update")]
        [Authorize(Roles = "SuperAdmin,Admin")] // Güncelleme sadece yöneticilere açık
        public async Task<IActionResult> Update([FromBody] DilUpdateDto dto)
        {
            var response = await _service.UpdateAsync(dto);
            return CreateActionResultInstance(response);
        }

        [HttpDelete("Delete/{id}")]
        [Authorize(Roles = "SuperAdmin,Admin")] // Silme işlemi en yüksek yetkiyi gerektirir
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (id <= 0) return BadRequest("Geçersiz ID.");

            var response = await _service.DeleteAsync(id);
            return CreateActionResultInstance(response);
        }
    }
}