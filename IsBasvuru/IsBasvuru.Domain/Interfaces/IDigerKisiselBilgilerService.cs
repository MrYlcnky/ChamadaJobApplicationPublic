using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.DigerKisiselBilgilerDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IDigerKisiselBilgilerService
    {
        Task<ServiceResponse<List<DigerKisiselBilgilerListDto>>> GetAllAsync();
        Task<ServiceResponse<List<DigerKisiselBilgilerListDto>>> GetByPersonelIdAsync(int personelId);
        Task<ServiceResponse<DigerKisiselBilgilerListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<DigerKisiselBilgilerListDto>> CreateAsync(DigerKisiselBilgilerCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(DigerKisiselBilgilerUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}