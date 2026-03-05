using IsBasvuru.Domain.DTOs.TanimlamalarDtos.EhliyetTuruDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IEhliyetTuruService
    {
        Task<ServiceResponse<List<EhliyetTuruListDto>>> GetAllAsync();
        Task<ServiceResponse<EhliyetTuruListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<EhliyetTuruListDto>> CreateAsync(EhliyetTuruCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(EhliyetTuruUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}