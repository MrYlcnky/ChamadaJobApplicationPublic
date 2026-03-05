using IsBasvuru.Domain.DTOs.SirketYapisiDtos.PersonelEhliyetDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IPersonelEhliyetService
    {
        Task<ServiceResponse<List<PersonelEhliyetListDto>>> GetAllAsync();
        Task<ServiceResponse<List<PersonelEhliyetListDto>>> GetByPersonelIdAsync(int personelId);
        Task<ServiceResponse<PersonelEhliyetListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<PersonelEhliyetListDto>> CreateAsync(PersonelEhliyetCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(PersonelEhliyetUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}