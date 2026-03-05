using IsBasvuru.Domain.DTOs.TanimlamalarDtos.KktcBelgeDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IKktcBelgeService
    {
        Task<ServiceResponse<List<KktcBelgeListDto>>> GetAllAsync();
        Task<ServiceResponse<KktcBelgeListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<KktcBelgeListDto>> CreateAsync(KktcBelgeCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(KktcBelgeUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}