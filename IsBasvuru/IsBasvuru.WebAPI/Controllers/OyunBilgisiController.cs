using IsBasvuru.Domain.DTOs.SirketYapisiDtos.OyunBilgisiDtos;
using IsBasvuru.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IsBasvuru.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OyunBilgisiController : BaseController
    {
        private readonly IOyunBilgisiService _service;

        public OyunBilgisiController(IOyunBilgisiService service)
        {
            _service = service;
        }

        [HttpGet("GetAll")]
        [AllowAnonymous] // Adayların oyun listesini görebilmesi için
        public async Task<IActionResult> GetAll()
        {
            var response = await _service.GetAllAsync();
            return CreateActionResultInstance(response);
        }

        [HttpGet("GetById/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (id <= 0) return BadRequest("Geçersiz ID.");
            var response = await _service.GetByIdAsync(id);
            return CreateActionResultInstance(response);
        }

        [HttpPost("Create")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Create([FromBody] OyunBilgisiCreateDto dto)
        {
            var response = await _service.CreateAsync(dto);
            return CreateActionResultInstance(response);
        }

        [HttpPut("Update")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Update([FromBody] OyunBilgisiUpdateDto dto)
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
    }
}