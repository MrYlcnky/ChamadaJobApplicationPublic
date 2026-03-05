using IsBasvuru.Domain.DTOs.TanimlamalarDtos.UlkeDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IUlkeService
    {
        Task<ServiceResponse<List<UlkeListDto>>> GetAllAsync();
        Task<ServiceResponse<UlkeListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<UlkeListDto>> CreateAsync(UlkeCreateDto createDto);
        Task<ServiceResponse<bool>> UpdateAsync(UlkeUpdateDto updateDto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}