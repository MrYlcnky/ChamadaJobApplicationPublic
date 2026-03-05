using IsBasvuru.Domain.DTOs.AdminDtos.RolDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IRolService
    {
        Task<ServiceResponse<List<RolListDto>>> GetAllAsync();
        Task<ServiceResponse<RolListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}