using IsBasvuru.Domain.DTOs.SirketYapisiDtos.ProgramBilgisiDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IProgramBilgisiService
    {
        Task<ServiceResponse<List<ProgramBilgisiListDto>>> GetAllAsync();
        Task<ServiceResponse<ProgramBilgisiListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<ProgramBilgisiListDto>> CreateAsync(ProgramBilgisiCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(ProgramBilgisiUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}