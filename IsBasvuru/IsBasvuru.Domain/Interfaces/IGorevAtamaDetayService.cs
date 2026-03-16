using IsBasvuru.Domain.DTOs.SirketYapisiDtos.GorevAtamaDetayDtos;
using IsBasvuru.Domain.Wrappers;

namespace IsBasvuru.Domain.Interfaces
{
    public interface IGorevAtamaDetayService
    {
        // Personel (Başvuru) ID'sine göre atama detayını getirir
        // Mali İşler ve Genel Müdür ekranlarında bu data gösterilecek
        Task<ServiceResponse<GorevAtamaDetayListDto>> GetByPersonelIdAsync(int personelId);

        // Atama formunu kaydet
        Task<ServiceResponse<int>> CreateAsync(GorevAtamaDetayCreateDto dto);

        // Eğer yönetici kararı sonradan değiştirirse diye Update metodu
        Task<ServiceResponse<bool>> UpdateAsync(GorevAtamaDetayUpdateDto dto);
    }
}