using IsBasvuru.Domain.DTOs.SirketYapisiDtos.DepartmanDtos;
using IsBasvuru.Domain.Wrappers; 
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IDepartmanService
    {
        Task<ServiceResponse<List<DepartmanListDto>>> GetAllAsync();
        Task<ServiceResponse<DepartmanListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<DepartmanListDto>> CreateAsync(DepartmanCreateDto createDto);
        Task<ServiceResponse<bool>> UpdateAsync(DepartmanUpdateDto updateDto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}