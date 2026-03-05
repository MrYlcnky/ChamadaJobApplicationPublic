using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.BilgisayarBilgisiDtos;
using IsBasvuru.Domain.Wrappers; 
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IBilgisayarBilgisiService
    {
        Task<ServiceResponse<List<BilgisayarBilgisiListDto>>> GetAllAsync();
        Task<ServiceResponse<List<BilgisayarBilgisiListDto>>> GetByPersonelIdAsync(int personelId);
        Task<ServiceResponse<BilgisayarBilgisiListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<BilgisayarBilgisiListDto>> CreateAsync(BilgisayarBilgisiCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(BilgisayarBilgisiUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}