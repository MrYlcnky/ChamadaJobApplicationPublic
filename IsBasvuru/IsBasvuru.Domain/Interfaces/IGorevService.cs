using IsBasvuru.Domain.DTOs.SirketYapisiDtos.GorevDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.OrganizationImportDtos;
using IsBasvuru.Domain.Wrappers;
using Microsoft.AspNetCore.Http;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IGorevService
    {
        Task<ServiceResponse<IEnumerable<GorevListDto>>> GetAllAsync();
        Task<ServiceResponse<IEnumerable<GorevListDto>>> GetByMasterGorevIdAsync(int masterGorevId);
        Task<ServiceResponse<IEnumerable<GorevListDto>>> GetByMasterDepartmanIdAsync(int masterDepartmanId);
        Task<ServiceResponse<GorevListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<int>> CreateAsync(GorevCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(GorevUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);

        Task<ServiceResponse<bool>> ImportGorevAsync(List<GorevImportDto> importData);
    }
}