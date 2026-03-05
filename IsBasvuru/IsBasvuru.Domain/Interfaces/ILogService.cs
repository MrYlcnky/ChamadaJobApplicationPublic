using IsBasvuru.Domain.DTOs.LogDtos.BasvuruLogDtos;
using IsBasvuru.Domain.DTOs.LogDtos.CvLogDtos;
using IsBasvuru.Domain.Enums;
using IsBasvuru.Domain.Wrappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface ILogService
    {
        Task<ServiceResponse<List<BasvuruIslemLogListDto>>> GetAllBasvuruLogsAsync();
        Task<ServiceResponse<List<BasvuruIslemLogListDto>>> GetBasvuruLogsAsync(int masterBasvuruId);
        Task<ServiceResponse<List<CvDegisiklikLogListDto>>> GetCvLogsAsync(int personelId);
        Task<ServiceResponse<bool>> LogBasvuruIslemAsync(int masterBasvuruId, int? panelKullaniciId, LogIslemTipi islemTipi, string islemAciklama, int? rolId = null, BasvuruDurum? basvuruDurum = null, BasvuruOnayAsamasi? basvuruOnayAsamasi = null);
        Task<ServiceResponse<bool>> LogCvDegisiklikAsync(int masterBasvuruId, int personelId, int degisenKayitId, string degisenTabloAdi, string degisenAlanAdi, string eskiDeger, string yeniDeger, LogIslemTipi degisiklikTipi);
    }
}