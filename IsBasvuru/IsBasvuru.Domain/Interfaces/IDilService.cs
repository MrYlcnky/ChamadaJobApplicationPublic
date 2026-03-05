using IsBasvuru.Domain.DTOs.TanimlamalarDtos.DilDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IDilService
    {
        Task<ServiceResponse<List<DilListDto>>> GetAllAsync();
        Task<ServiceResponse<DilListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<DilListDto>> CreateAsync(DilCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(DilUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}