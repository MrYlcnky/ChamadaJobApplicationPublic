using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.YabanciDilBilgisiDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IYabanciDilBilgisiService
    {
        Task<ServiceResponse<List<YabanciDilBilgisiListDto>>> GetAllAsync();
        Task<ServiceResponse<List<YabanciDilBilgisiListDto>>> GetByPersonelIdAsync(int personelId);
        Task<ServiceResponse<YabanciDilBilgisiListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<YabanciDilBilgisiListDto>> CreateAsync(YabanciDilBilgisiCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(YabanciDilBilgisiUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}