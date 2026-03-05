using IsBasvuru.Domain.DTOs.SirketYapisiDtos.SubeAlanDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface ISubeAlanService
    {
        Task<ServiceResponse<List<SubeAlanListDto>>> GetAllAsync();
        Task<ServiceResponse<SubeAlanListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<SubeAlanListDto>> CreateAsync(SubeAlanCreateDto createDto);
        Task<ServiceResponse<bool>> UpdateAsync(SubeAlanUpdateDto updateDto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}