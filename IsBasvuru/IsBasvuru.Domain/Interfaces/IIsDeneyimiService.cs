using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.IsDeneyimiDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IIsDeneyimiService
    {
        Task<ServiceResponse<List<IsDeneyimiListDto>>> GetAllAsync();
        Task<ServiceResponse<List<IsDeneyimiListDto>>> GetByPersonelIdAsync(int personelId);
        Task<ServiceResponse<IsDeneyimiListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<IsDeneyimiListDto>> CreateAsync(IsDeneyimiCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(IsDeneyimiUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}