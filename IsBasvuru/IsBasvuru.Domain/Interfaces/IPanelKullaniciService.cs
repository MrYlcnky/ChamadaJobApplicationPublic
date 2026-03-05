using IsBasvuru.Domain.DTOs.AdminDtos;
using IsBasvuru.Domain.DTOs.AdminDtos.PanelKullaniciDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IPanelKullaniciService
    {
        Task<ServiceResponse<List<PanelKullaniciListDto>>> GetAllAsync();
        Task<ServiceResponse<PanelKullaniciListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<PanelKullaniciListDto>> CreateAsync(PanelKullaniciCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(PanelKullaniciUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
        Task<ServiceResponse<bool>> ChangePasswordAsync(PanelKullaniciPasswordChangeDto dto);
    }
}