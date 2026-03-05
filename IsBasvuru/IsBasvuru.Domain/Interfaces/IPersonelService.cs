using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.BasvuruOnayDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.KisiselBilgilerListDtos;
using IsBasvuru.Domain.DTOs.PersonelDtos;
using IsBasvuru.Domain.DTOs.Shared;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IPersonelService
    {
        // Sayfalama olduğu için PagedResponse dönüyor, burası kalabilir.
        Task<PagedResponse<List<PersonelListDto>>> GetAllAsync(PaginationFilter filter);

        Task<ServiceResponse<PersonelListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<PersonelListDto>> GetByEmailAsync(string email);
        Task<ServiceResponse<PersonelListDto>> CreateAsync(PersonelCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(PersonelUpdateDto dto);
        Task<ServiceResponse<bool>> UpdateVesikalikAsync(int id, string dosyaAdi);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
        Task<ServiceResponse<List<BasvuruOnayListDto>>> GetOnayLoglariAsync();
    }
}