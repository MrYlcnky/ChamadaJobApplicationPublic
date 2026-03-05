using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterProgram;
using IsBasvuru.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IsBasvuru.WebAPI.Controllers.SirketMasterYapisi
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // En azından giriş yapmış olmalı
    public class MasterProgramController(IMasterProgramService masterProgramService) : ControllerBase
    {
        private readonly IMasterProgramService _masterProgramService = masterProgramService;
         
        [HttpGet("GetAll")]
        [Authorize(Roles = "SuperAdmin,Admin")] // Listelemeyi IK da yapabilsin
        public async Task<IActionResult> GetAll()
        {
            var response = await _masterProgramService.GetAllAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPost("Create")]
        [Authorize(Roles = "SuperAdmin,Admin")] // Sadece üst yetkililer ekleyebilir
        public async Task<IActionResult> Create(MasterProgramCreateDto dto)
        {
            var response = await _masterProgramService.CreateAsync(dto);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPut("Update")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Update(MasterProgramUpdateDto dto)
        {
            var response = await _masterProgramService.UpdateAsync(dto);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpDelete("Delete/{id}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _masterProgramService.DeleteAsync(id);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}