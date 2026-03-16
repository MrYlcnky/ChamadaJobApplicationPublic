using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterGorev;
using IsBasvuru.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IsBasvuru.WebAPI.Controllers
{
    [Authorize] // Sadece giriş yapanlar erişebilir
    [Route("api/[controller]")]
    [ApiController]
    public class MasterGorevController : ControllerBase
    {
        private readonly IMasterGorevService _service;

        public MasterGorevController(IMasterGorevService service)
        {
            _service = service;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return Ok(result);
        }

        [Authorize(Roles = "SuperAdmin,Admin")] // Sadece yetkililer yeni master görev açabilsin
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] MasterGorevCreateDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        [Authorize(Roles = "SuperAdmin,Admin")]
        [HttpPut("Update")]
        public async Task<IActionResult> Update([FromBody] MasterGorevUpdateDto dto)
        {
            var result = await _service.UpdateAsync(dto);
            return Ok(result);
        }

        [Authorize(Roles = "SuperAdmin,Admin")]
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            return Ok(result);
        }
    }
}