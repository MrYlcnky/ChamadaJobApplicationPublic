using IsBasvuru.Domain.DTOs.TanimlamalarDtos.IlceDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IIlceService
    {
        Task<ServiceResponse<List<IlceListDto>>> GetAllAsync();
        Task<ServiceResponse<IlceListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<IlceListDto>> CreateAsync(IlceCreateDto createDto);
        Task<ServiceResponse<bool>> UpdateAsync(IlceUpdateDto updateDto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}