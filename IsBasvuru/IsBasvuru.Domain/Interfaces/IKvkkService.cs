using IsBasvuru.Domain.DTOs.TanimlamalarDtos.KvkkDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IKvkkService
    {
        Task<ServiceResponse<List<KvkkListDto>>> GetAllAsync();
        Task<ServiceResponse<KvkkListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<KvkkListDto>> CreateAsync(KvkkCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(KvkkUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}