using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.BilgisayarBilgisiDtos;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class BilgisayarBilgisiController : BaseController
{
    private readonly IBilgisayarBilgisiService _service;

    public BilgisayarBilgisiController(IBilgisayarBilgisiService service)
    {
        _service = service;
    }

    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll()
    {
        var response = await _service.GetAllAsync();
        return CreateActionResultInstance(response);
    }

    [HttpGet("GetByPersonelId/{personelId}")]
    public async Task<IActionResult> GetByPersonelId([FromRoute] int personelId) 
    {
        if (personelId <= 0) return BadRequest("Geçersiz Personel ID");

        var response = await _service.GetByPersonelIdAsync(personelId);
        return CreateActionResultInstance(response);
    }

    [HttpGet("GetById/{id}")]
    public async Task<IActionResult> GetById([FromRoute] int id) 
    {
        if (id <= 0) return BadRequest("Geçersiz ID");

        var response = await _service.GetByIdAsync(id);
        return CreateActionResultInstance(response);
    }

    [HttpPost("Create")]
    public async Task<IActionResult> Create([FromBody] BilgisayarBilgisiCreateDto dto) 
    {
        var response = await _service.CreateAsync(dto);
        return CreateActionResultInstance(response);
    }

    [HttpPut("Update")]
    public async Task<IActionResult> Update([FromBody] BilgisayarBilgisiUpdateDto dto) 
    {
        var response = await _service.UpdateAsync(dto);
        return CreateActionResultInstance(response);
    }

    [HttpDelete("Delete/{id}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Delete([FromRoute] int id) 
    {
        if (id <= 0) return BadRequest("Geçersiz ID");

        var response = await _service.DeleteAsync(id);
        return CreateActionResultInstance(response);
    }
}