using IsBasvuru.Domain.Wrappers;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IMailService
    {
        Task<ServiceResponse<bool>> DogrulamaKoduGonderAsync(string aliciEposta, string kod);
    }
}