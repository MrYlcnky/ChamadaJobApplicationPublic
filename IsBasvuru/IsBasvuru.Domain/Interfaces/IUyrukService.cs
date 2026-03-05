using IsBasvuru.Domain.DTOs.TanimlamalarDtos.UyrukDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IUyrukService
    {
        Task<ServiceResponse<List<UyrukListDto>>> GetAllAsync();
        Task<ServiceResponse<UyrukListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<UyrukListDto>> CreateAsync(UyrukCreateDto createDto);
        Task<ServiceResponse<bool>> UpdateAsync(UyrukUpdateDto updateDto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}