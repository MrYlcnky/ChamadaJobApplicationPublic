using IsBasvuru.Domain.DTOs.SirketYapisiDtos.SubeDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface ISubeService
    {
        Task<ServiceResponse<List<SubeListDto>>> GetAllAsync();
        Task<ServiceResponse<SubeListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<SubeListDto>> CreateAsync(SubeCreateDto createDto);
        Task<ServiceResponse<bool>> UpdateAsync(SubeUpdateDto updateDto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}