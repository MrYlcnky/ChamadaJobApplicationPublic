using IsBasvuru.Domain.DTOs.AdminDtos;
using IsBasvuru.Domain.Wrappers;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IAuthService
    {
        Task<ServiceResponse<LoginResponseDto>> LoginAsync(AdminLoginDto dto);
    }
}