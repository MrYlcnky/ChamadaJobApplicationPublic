using IsBasvuru.Domain.DTOs.KimlikDogrulamaDtos;
using IsBasvuru.Domain.Wrappers;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IKimlikDogrulamaService
    {
        Task<ServiceResponse<bool>> KodGonderAsync(KodGonderDto dto);
        Task<ServiceResponse<AuthResponseDto>> KodDogrulaAsync(KodDogrulaDto dto);
    }
}