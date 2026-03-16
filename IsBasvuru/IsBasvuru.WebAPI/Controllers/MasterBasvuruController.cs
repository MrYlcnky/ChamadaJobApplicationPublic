using IsBasvuru.Domain.DTOs.MasterBasvuruDtos;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.Infrastructure.Services;
using IsBasvuru.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class MasterBasvuruController : BaseController
{
    private readonly IMasterBasvuruService _service;
    public MasterBasvuruController(IMasterBasvuruService service) { _service = service; }

    [HttpGet("GetAll")]
    [Authorize(Roles = "SuperAdmin,Admin,IkAdmin,IK,GenelMudur,DepartmanMudur,MaliIslerMudur")]
    public async Task<IActionResult> GetAll()
    {
        // Token içerisindeki Claim'lerden kullanıcının bilgilerini alıyoruz
        // Claim türleri projendeki TokenService/Identity yapılandırmasına göre farklılık gösterebilir ("role", "RoleId", "subeId" gibi)
        var roleId = int.Parse(User.FindFirst("RoleId")?.Value ?? "0");

        int? subeId = int.TryParse(User.FindFirst("SubeId")?.Value, out int sId) ? sId : null;
        int? departmanId = int.TryParse(User.FindFirst("DepartmanId")?.Value, out int dId) ? dId : null;
        int? alanId = int.TryParse(User.FindFirst("AlanId")?.Value, out int aId) ? aId : null;

        // Servis metoduna yetki parametrelerini geçiyoruz
        var response = await _service.GetAllAsync(roleId, subeId, departmanId, alanId);
        return CreateActionResultInstance(response);
    }

    [HttpGet("GetById/{id}")]
    [Authorize] // GetById için de yetki kontrolü eklemek güvenli olur
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        if (id <= 0) return BadRequest("Geçersiz ID.");

        // Güvenlik: Bir müdür başkasının yetkisindeki ID'yi rastgele yazıp çekememeli
        var roleId = int.Parse(User.FindFirst("RoleId")?.Value ?? "0");
        int? subeId = int.TryParse(User.FindFirst("SubeId")?.Value, out int sId) ? sId : null;
        int? departmanId = int.TryParse(User.FindFirst("DepartmanId")?.Value, out int dId) ? dId : null;
        int? alanId = int.TryParse(User.FindFirst("AlanId")?.Value, out int aId) ? aId : null;

        var response = await _service.GetByIdAsync(id, roleId, subeId, departmanId, alanId);
        return CreateActionResultInstance(response);
    }

    [HttpGet("GetByPersonelId/{personelId}")]
    public async Task<IActionResult> GetByPersonelId([FromRoute] int personelId)
    {
        var response = await _service.GetByPersonelIdAsync(personelId);
        return CreateActionResultInstance(response);
    }

    [HttpPost("Create")]
    [AllowAnonymous] // Yeni başvurular anonim olabilir
    public async Task<IActionResult> Create([FromBody] MasterBasvuruCreateDto dto)
    {
        var response = await _service.CreateAsync(dto);
        return CreateActionResultInstance(response);
    }

    [HttpPut("Update")]
    public async Task<IActionResult> Update([FromBody] MasterBasvuruUpdateDto dto)
    {
        var response = await _service.UpdateAsync(dto);
        return CreateActionResultInstance(response);
    }

    [HttpDelete("Delete/{id}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        var response = await _service.DeleteAsync(id);
        return CreateActionResultInstance(response);
    }

    [HttpGet("GetNotifications")]
    [Authorize(Roles = "SuperAdmin,Admin,IkAdmin,IK,GenelMudur,DepartmanMudur,MaliIslerMudur")]
    public async Task<IActionResult> GetNotifications()
    {
        var roleClaimValue = User.FindFirst("RolId")?.Value;

        System.Diagnostics.Debug.WriteLine($"Gelen RolId Claim: {roleClaimValue ?? "Hala Bulunamadı"}");

        if (int.TryParse(roleClaimValue, out int roleId))
        {
            var result = await _service.GetOnayBekleyenBildirimlerAsync(roleId);
            return CreateActionResultInstance(result);
        }

        return BadRequest("Kullanıcı rol bilgisi alınamadı.");
    }
}