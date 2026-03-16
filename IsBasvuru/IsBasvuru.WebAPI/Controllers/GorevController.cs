using IsBasvuru.Domain.DTOs.SirketYapisiDtos.GorevDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.OrganizationImportDtos;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IsBasvuru.WebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GorevController : ControllerBase
    {
        private readonly IGorevService _service;

        public GorevController(IGorevService service)
        {
            _service = service;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        // Kategoriye (MasterGorev) göre görevleri getirmek için
        [HttpGet("GetByMasterGorevId/{masterGorevId}")]
        public async Task<IActionResult> GetByMasterGorevId(int masterGorevId)
        {
            var result = await _service.GetByMasterGorevIdAsync(masterGorevId);
            return Ok(result);
        }

        [HttpGet("GetByMasterDepartmanId/{masterDepartmanId}")]
        public async Task<IActionResult> GetByMasterDepartmanId(int masterDepartmanId)
        {
            var result = await _service.GetByMasterDepartmanIdAsync(masterDepartmanId);
            return Ok(result);
        }

        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return Ok(result);
        }

        [Authorize(Roles = "SuperAdmin,Admin")]
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] GorevCreateDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        [Authorize(Roles = "SuperAdmin,Admin")]
        [HttpPut("Update")]
        public async Task<IActionResult> Update([FromBody] GorevUpdateDto dto)
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

        [HttpPost("import")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> ImportGorevler([FromBody] List<GorevImportDto> importData)
        {
            var result = await _service.ImportGorevAsync(importData);

            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
    }
}