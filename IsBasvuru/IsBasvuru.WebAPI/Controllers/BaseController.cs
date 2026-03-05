using IsBasvuru.Domain.Wrappers;
using Microsoft.AspNetCore.Authorization; 
using Microsoft.AspNetCore.Mvc;

namespace IsBasvuru.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class BaseController : ControllerBase
    {
        
        [NonAction]
        public IActionResult CreateActionResultInstance<T>(ServiceResponse<T> response)
        {
            if (response.Success)
            {
                
                if (response.StatusCode == 204)
                    return NoContent();

                return Ok(response);
            }

            
            return StatusCode(response.StatusCode, response);
        }
    }
}