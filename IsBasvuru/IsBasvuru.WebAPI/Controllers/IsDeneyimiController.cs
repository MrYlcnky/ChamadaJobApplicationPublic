using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.IsDeneyimiDtos;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class IsDeneyimiController : BaseController
{
    private readonly IIsDeneyimiService _service;
    public IsDeneyimiController(IIsDeneyimiService service) { _service = service; }

    [HttpGet("GetAll")]
    [Authorize(Roles = "SuperAdmin,Admin,IkAdmin")]
    public async Task<IActionResult> GetAll()
    {
        var response = await _service.GetAllAsync();
        return CreateActionResultInstance(response);
    }

    [HttpGet("GetByPersonelId/{personelId}")]
    public async Task<IActionResult> GetByPersonelId([FromRoute] int personelId)
    {
        if (personelId <= 0) return BadRequest("Geçersiz Personel ID.");
        var response = await _service.GetByPersonelIdAsync(personelId);
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
    [AllowAnonymous]
    public async Task<IActionResult> Create([FromBody] IsDeneyimiCreateDto dto)
    {
        var response = await _service.CreateAsync(dto);
        return CreateActionResultInstance(response);
    }

    [HttpPut("Update")]
    public async Task<IActionResult> Update([FromBody] IsDeneyimiUpdateDto dto)
    {
        var response = await _service.UpdateAsync(dto);
        return CreateActionResultInstance(response);
    }

    [HttpDelete("Delete/{id}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        if (id <= 0) return BadRequest("Geçersiz ID.");
        var response = await _service.DeleteAsync(id);
        return CreateActionResultInstance(response);
    }
}