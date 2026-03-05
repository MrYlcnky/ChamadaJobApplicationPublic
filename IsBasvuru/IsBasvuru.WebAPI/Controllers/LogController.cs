using IsBasvuru.Domain.Interfaces;
using IsBasvuru.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IsBasvuru.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // Sadece Admin ve SuperAdmin logları görebilsin
    [Authorize(Roles = "SuperAdmin,Admin,IkAdmin,IK,DepartmanMudur,GenelMudur")]
    public class LogController : BaseController
    {
        private readonly ILogService _logService;

        public LogController(ILogService logService)
        {
            _logService = logService;
        }

        
        [HttpGet("GetAllLogs")]
        public async Task<IActionResult> GetAllLogs()
        {
            var response = await _logService.GetAllBasvuruLogsAsync();
            return CreateActionResultInstance(response);
        }

       
        [HttpGet("GetBasvuruLogs/{masterBasvuruId}")]
        public async Task<IActionResult> GetBasvuruLogs([FromRoute] int masterBasvuruId)
        {
            if (masterBasvuruId <= 0)
                return BadRequest("Geçersiz Başvuru ID.");

            var response = await _logService.GetBasvuruLogsAsync(masterBasvuruId);
            return CreateActionResultInstance(response);
        }

        
        [HttpGet("GetCvLogs/{personelId}")]
        public async Task<IActionResult> GetCvLogs([FromRoute] int personelId)
        {
            if (personelId <= 0)
                return BadRequest("Geçersiz Personel ID.");

            var response = await _logService.GetCvLogsAsync(personelId);
            return CreateActionResultInstance(response);
        }
    }
}