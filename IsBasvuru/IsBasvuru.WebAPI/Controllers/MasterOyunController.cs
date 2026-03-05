using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterOyun;
using IsBasvuru.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IsBasvuru.WebAPI.Controllers.SirketMasterYapisi
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MasterOyunController(IMasterOyunService masterOyunService) : ControllerBase
    {
        private readonly IMasterOyunService _masterOyunService = masterOyunService;

        [HttpGet ("GetAll")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> GetAll()
        {
            var response = await _masterOyunService.GetAllAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPost("Create")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Create(MasterOyunCreateDto dto)
        {
            var response = await _masterOyunService.CreateAsync(dto);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPut("Update")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Update(MasterOyunUpdateDto dto)
        {
            var response = await _masterOyunService.UpdateAsync(dto);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpDelete("Delete/{id}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _masterOyunService.DeleteAsync(id);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}