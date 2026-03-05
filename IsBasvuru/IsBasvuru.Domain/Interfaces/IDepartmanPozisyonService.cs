using IsBasvuru.Domain.DTOs.SirketYapisiDtos.DepartmanPozisyonDtos;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IDepartmanPozisyonService
    {
        Task<ServiceResponse<List<DepartmanPozisyonListDto>>> GetAllAsync();
        Task<ServiceResponse<DepartmanPozisyonListDto>> GetByIdAsync(int id);
        Task<ServiceResponse<DepartmanPozisyonListDto>> CreateAsync(DepartmanPozisyonCreateDto createDto);
        Task<ServiceResponse<bool>> UpdateAsync(DepartmanPozisyonUpdateDto updateDto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}