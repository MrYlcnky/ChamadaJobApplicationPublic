using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.EgitimBilgisiDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IEgitimBilgisiService
    {
        Task<ServiceResponse<List<EgitimBilgisiListDto>>> GetAllAsync();
        Task<ServiceResponse<List<EgitimBilgisiListDto>>> GetByPersonelIdAsync(int personelId);
        Task<ServiceResponse<EgitimBilgisiListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<EgitimBilgisiListDto>> CreateAsync(EgitimBilgisiCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(EgitimBilgisiUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}