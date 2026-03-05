using IsBasvuru.Domain.DTOs.TanimlamalarDtos.SehirDtos;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class SehirController : BaseController
{
    private readonly ISehirService _service;
    public SehirController(ISehirService service) { _service = service; }

    [HttpGet("GetAll")]
    [AllowAnonymous]
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

    [HttpGet("GetByUlkeId/{ulkeId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByUlkeId([FromRoute] int ulkeId)
    {
        if (ulkeId <= 0) return BadRequest("Geçersiz Ülke ID.");
        var response = await _service.GetByUlkeIdAsync(ulkeId);
        return CreateActionResultInstance(response);
    }

    [HttpPost("Create")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Create([FromBody] SehirCreateDto dto)
    {
        var response = await _service.CreateAsync(dto);
        return CreateActionResultInstance(response);
    }

    [HttpPut("Update")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Update([FromBody] SehirUpdateDto dto)
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