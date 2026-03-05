using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterAlanDtos;
using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterDepartmanDtos;
using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterOyun;
using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterPozisyonDtos;
using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterProgram;
using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterSubeAlan;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IMasterAlanService
    {
        Task<ServiceResponse<List<MasterAlanListDto>>> GetAllAsync();
        Task<ServiceResponse<MasterAlanListDto>> CreateAsync(MasterAlanCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(MasterAlanUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }

    public interface IMasterDepartmanService
    {
        Task<ServiceResponse<List<MasterDepartmanListDto>>> GetAllAsync();
        Task<ServiceResponse<MasterDepartmanListDto>> CreateAsync(MasterDepartmanCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(MasterDepartmanUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }

    public interface IMasterPozisyonService
    {
        Task<ServiceResponse<List<MasterPozisyonListDto>>> GetAllAsync();
        Task<ServiceResponse<MasterPozisyonListDto>> CreateAsync(MasterPozisyonCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(MasterPozisyonUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }

    public interface IMasterProgramService
    {
        Task<ServiceResponse<List<MasterProgramDto>>> GetAllAsync();
        Task<ServiceResponse<MasterProgramDto>> CreateAsync(MasterProgramCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(MasterProgramUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }

    public interface IMasterOyunService
    {
        Task<ServiceResponse<List<MasterOyunDto>>> GetAllAsync();
        Task<ServiceResponse<MasterOyunDto>> CreateAsync(MasterOyunCreateDto dto);
        Task<ServiceResponse<bool>> UpdateAsync(MasterOyunUpdateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}