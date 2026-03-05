using IsBasvuru.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace IsBasvuru.Persistence.Services // Katman ismine göre düzenle
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int UserId
        {
            get
            {
                // Token içindeki NameIdentifier (genelde User ID buradadır) claim'ini oku
                var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);

                if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int id))
                {
                    return id;
                }
                return 0; // Eğer login değilse veya bulunamazsa
            }
        }

        public int? RolId
        {
            get
            {
                var roleClaim = _httpContextAccessor.HttpContext?.User?.FindFirst("RolId")?.Value;
                return roleClaim != null ? int.Parse(roleClaim) : null;
            }
        }
    }
}