using IsBasvuru.Domain.Wrappers;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IImageService
    {
        Task<ServiceResponse<string>> UploadImageAsync(IFormFile file, string folderName, string? customName = null, string? oldFileName = null);
        Task<ServiceResponse<bool>> DeleteImageAsync(string fileName, string folderName);
    }
}