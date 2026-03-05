using IsBasvuru.Domain.DTOs.SirketYapisiDtos.DepartmanDtos;
using IsBasvuru.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IsBasvuru.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DepartmanController : BaseController
    {
        private readonly IDepartmanService _service;

        public DepartmanController(IDepartmanService service)
        {
            _service = service;
        }

        [HttpGet("GetAll")]
        [AllowAnonymous] // Başvuru yapan adaylar departman listesini görebilmeli
        public async Task<IActionResult> GetAll()
        {
            var response = await _service.GetAllAsync();
            return CreateActionResultInstance(response);
        }

        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (id <= 0) return BadRequest("Geçersiz ID.");

            var response = await _service.GetByIdAsync(id);
            return CreateActionResultInstance(response);
        }

        [HttpPost("Create")]
        [Authorize(Roles = "SuperAdmin,Admin")] // Sadece yetkililer ekleme yapabilir
        public async Task<IActionResult> Create([FromBody] DepartmanCreateDto dto)
        {
            var response = await _service.CreateAsync(dto);
            return CreateActionResultInstance(response);
        }

        [HttpPut("Update")]
        [Authorize(Roles = "SuperAdmin,Admin")] // Sadece yetkililer güncelleyebilir
        public async Task<IActionResult> Update([FromBody] DepartmanUpdateDto dto)
        {
            var response = await _service.UpdateAsync(dto);
            return CreateActionResultInstance(response);
        }

        [HttpDelete("Delete/{id}")]
        [Authorize(Roles = "SuperAdmin,Admin")] // Silme işlemi en kritik yetki
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (id <= 0) return BadRequest("Geçersiz ID.");

            var response = await _service.DeleteAsync(id);
            return CreateActionResultInstance(response);
        }
    }
}