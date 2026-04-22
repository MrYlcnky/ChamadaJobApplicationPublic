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
    // 1. DÜZELTME: Sayfalama (pageNumber, pageSize) parametrelerini tamamen kaldırdık.
    public async Task<IActionResult> GetAll()
    {
        // 2. Rol ve Token verilerini okumaya devam ediyoruz (Burası aynı kalıyor)
        var roleClaimValue = User.FindFirst("RolId")?.Value ?? User.FindFirst("RoleId")?.Value ?? "0";
        var roleId = int.Parse(roleClaimValue);

        int? subeId = int.TryParse(User.FindFirst("SubeId")?.Value, out int sId) ? sId : null;
        int? departmanId = int.TryParse(User.FindFirst("MasterDepartmanId")?.Value ?? User.FindFirst("DepartmanId")?.Value, out int dId) ? dId : null;
        int? alanId = int.TryParse(User.FindFirst("MasterAlanId")?.Value ?? User.FindFirst("SubeAlanId")?.Value ?? User.FindFirst("AlanId")?.Value, out int aId) ? aId : null;

        // 3. DÜZELTME: Servisi çağırırken sadece gerekli olan 4 yetki parametresini gönderiyoruz.
        var response = await _service.GetAllAsync(roleId, subeId, departmanId, alanId);

        return CreateActionResultInstance(response);
    }

    [HttpGet("GetById/{id}")]
    [Authorize]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        if (id <= 0) return BadRequest("Geçersiz ID.");

        // 2. DÜZELTME: "RolId" güvencesini buraya da ekledik
        var roleClaimValue = User.FindFirst("RolId")?.Value ?? User.FindFirst("RoleId")?.Value ?? "0";
        var roleId = int.Parse(roleClaimValue);

        int? subeId = int.TryParse(User.FindFirst("SubeId")?.Value, out int sId) ? sId : null;
        int? departmanId = int.TryParse(User.FindFirst("MasterDepartmanId")?.Value ?? User.FindFirst("DepartmanId")?.Value, out int dId) ? dId : null;
        int? alanId = int.TryParse(User.FindFirst("MasterAlanId")?.Value ?? User.FindFirst("SubeAlanId")?.Value ?? User.FindFirst("AlanId")?.Value, out int aId) ? aId : null;

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
        // "RolId" claim adını kullandığını fark ettim, diğer yerlerde "RoleId" kullanılmış. Güvenlik için ikisine de bakıyoruz.
        var roleClaimValue = User.FindFirst("RolId")?.Value ?? User.FindFirst("RoleId")?.Value;

        // Tıpkı GetAll'da olduğu gibi kullanıcının yerleşke bilgilerini claim'den alıyoruz
        int? subeId = int.TryParse(User.FindFirst("SubeId")?.Value, out int sId) ? sId : null;
        int? departmanId = int.TryParse(User.FindFirst("MasterDepartmanId")?.Value ?? User.FindFirst("DepartmanId")?.Value, out int dId) ? dId : null;
        int? alanId = int.TryParse(User.FindFirst("MasterAlanId")?.Value ?? User.FindFirst("SubeAlanId")?.Value ?? User.FindFirst("AlanId")?.Value, out int aId) ? aId : null;


        if (int.TryParse(roleClaimValue, out int roleId))
        {
            // Yeni parametreleri servise gönderiyoruz
            var result = await _service.GetOnayBekleyenBildirimlerAsync(roleId, subeId, departmanId, alanId);
            return CreateActionResultInstance(result);
        }

        return BadRequest("Kullanıcı rol bilgisi alınamadı.");
    }
}