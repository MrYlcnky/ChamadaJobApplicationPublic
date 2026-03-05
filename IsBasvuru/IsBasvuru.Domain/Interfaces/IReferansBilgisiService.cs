using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.ReferansBilgisiDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IReferansBilgisiService
    {
        Task<ServiceResponse<List<ReferansBilgisiListDto>>> GetAllAsync();
        Task<ServiceResponse<List<ReferansBilgisiListDto>>> GetByPersonelIdAsync(int personelId);
        Task<ServiceResponse<ReferansBilgisiListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<ReferansBilgisiListDto>> CreateAsync(ReferansBilgisiCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(ReferansBilgisiUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}