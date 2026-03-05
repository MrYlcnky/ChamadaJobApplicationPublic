using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.SertifikaBilgisiDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface ISertifikaBilgisiService
    {
        Task<ServiceResponse<List<SertifikaBilgisiListDto>>> GetAllAsync();
        Task<ServiceResponse<List<SertifikaBilgisiListDto>>> GetByPersonelIdAsync(int personelId);
        Task<ServiceResponse<SertifikaBilgisiListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<SertifikaBilgisiListDto>> CreateAsync(SertifikaBilgisiCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(SertifikaBilgisiUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}