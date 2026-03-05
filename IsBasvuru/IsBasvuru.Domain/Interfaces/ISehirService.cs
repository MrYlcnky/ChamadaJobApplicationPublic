using IsBasvuru.Domain.DTOs.TanimlamalarDtos.SehirDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface ISehirService
    {
        Task<ServiceResponse<List<SehirListDto>>> GetAllAsync();
        Task<ServiceResponse<List<SehirListDto>>> GetByUlkeIdAsync(int ulkeId);
        Task<ServiceResponse<SehirListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<SehirListDto>> CreateAsync(SehirCreateDto createDto);
        Task<ServiceResponse<bool>> UpdateAsync(SehirUpdateDto updateDto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}