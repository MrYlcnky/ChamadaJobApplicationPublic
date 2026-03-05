using IsBasvuru.Domain.DTOs.SirketYapisiDtos.OyunBilgisiDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IOyunBilgisiService
    {
        Task<ServiceResponse<List<OyunBilgisiListDto>>> GetAllAsync(); 
        Task<ServiceResponse<OyunBilgisiListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<OyunBilgisiListDto>> CreateAsync(OyunBilgisiCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(OyunBilgisiUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}