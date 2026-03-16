using AutoMapper;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.GorevAtamaDetayDtos;
using IsBasvuru.Domain.Entities.SirketYapisi.GorevAtama;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.Domain.Wrappers;
using IsBasvuru.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace IsBasvuru.Infrastructure.Services
{
    public class GorevAtamaDetayService : IGorevAtamaDetayService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;

        public GorevAtamaDetayService(IsBasvuruContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<GorevAtamaDetayListDto>> GetByPersonelIdAsync(int personelId)
        {
            // AsNoTracking() performansı artırır.
            var entity = await _context.GorevAtamaDetaylari
                .Include(x => x.Personel).ThenInclude(p => p!.KisiselBilgiler)
                .Include(x => x.MasterDepartman)
                .Include(x => x.Gorev).ThenInclude(g => g!.MasterGorev)
                .Include(x => x.PanelKullanici)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.PersonelId == personelId);

            if (entity == null)
                return ServiceResponse<GorevAtamaDetayListDto>.FailureResult("Bu başvuru için henüz görev ataması yapılmamış.");

            var dto = _mapper.Map<GorevAtamaDetayListDto>(entity);
            return ServiceResponse<GorevAtamaDetayListDto>.SuccessResult(dto);
        }

        public async Task<ServiceResponse<int>> CreateAsync(GorevAtamaDetayCreateDto dto)
        {
            // Önce bu adaya daha önce atama yapılmış mı kontrol edelim 
            var existing = await _context.GorevAtamaDetaylari.AsNoTracking().FirstOrDefaultAsync(x => x.PersonelId == dto.PersonelId);
            if (existing != null)
                return ServiceResponse<int>.FailureResult("Bu adaya zaten bir görev ataması yapılmış. Lütfen güncelleme işlemi yapınız.");

            var entity = _mapper.Map<GorevAtamaDetay>(dto);
            await _context.GorevAtamaDetaylari.AddAsync(entity);
            await _context.SaveChangesAsync();

            return ServiceResponse<int>.SuccessResult(entity.Id, "Görev atama bilgileri başarıyla kaydedildi.");
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(GorevAtamaDetayUpdateDto dto)
        {
            var entity = await _context.GorevAtamaDetaylari.FindAsync(dto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Güncellenecek atama kaydı bulunamadı.");

            _mapper.Map(dto, entity);
            _context.GorevAtamaDetaylari.Update(entity);
            await _context.SaveChangesAsync();

            return ServiceResponse<bool>.SuccessResult(true, "Görev atama bilgileri başarıyla güncellendi.");
        }
    }
}