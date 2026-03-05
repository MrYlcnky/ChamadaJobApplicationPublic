using AutoMapper;
using IsBasvuru.Domain.DTOs.AdminDtos;
using IsBasvuru.Domain.DTOs.AdminDtos.PanelKullaniciDtos;
using IsBasvuru.Domain.Entities.AdminBilgileri;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.Domain.Wrappers;
using IsBasvuru.Infrastructure.Tools;
using IsBasvuru.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Infrastructure.Services
{
    public class PanelKullaniciService : IPanelKullaniciService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;

        // Login işlemi AuthService'e taşındığı için IConfiguration'ı buradan kaldırdık.
        public PanelKullaniciService(IsBasvuruContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<PanelKullaniciListDto>> CreateAsync(PanelKullaniciCreateDto dto)
        {
            // 1. Kullanıcı Adı: Sadece boşluk temizliği
            string normalizedUsername = dto.KullaniciAdi?.Trim() ?? string.Empty;

            // 2. Aynı kullanıcı adı kontrolü
            var exist = await _context.PanelKullanicilari.AnyAsync(x => x.KullaniciAdi == normalizedUsername);
            if (exist)
                return ServiceResponse<PanelKullaniciListDto>.FailureResult("Bu kullanıcı adı zaten kullanılıyor.");

            var entity = _mapper.Map<PanelKullanici>(dto);

            // 3. Entity değerlerini atıyoruz (Kullanıcının girdiği gibi)
            entity.KullaniciAdi = normalizedUsername;
            entity.Adi = dto.Adi?.Trim()!;
            entity.Soyadi = dto.Soyadi?.Trim()!;

            // 4. Şifre Hashleme
            entity.KullaniciSifre = BCrypt.Net.BCrypt.HashPassword(dto.KullaniciSifre);

            // 5. Tarih
            entity.SonGirisTarihi = DateTime.Now;

            await _context.PanelKullanicilari.AddAsync(entity);
            await _context.SaveChangesAsync();

            var responseDto = _mapper.Map<PanelKullaniciListDto>(entity);
            return ServiceResponse<PanelKullaniciListDto>.SuccessResult(responseDto, "Kullanıcı başarıyla oluşturuldu.");
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(PanelKullaniciUpdateDto dto)
        {
            var entity = await _context.PanelKullanicilari.FindAsync(dto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kullanıcı bulunamadı.");

            // 1. Kullanıcı Adı: Sadece boşlukları temizliyoruz, olduğu gibi bırakıyoruz.
            string normalizedUsername = dto.KullaniciAdi?.Trim() ?? string.Empty;

            // 2. Çakışma Kontrolü
            if (entity.KullaniciAdi != normalizedUsername)
            {
                bool isTaken = await _context.PanelKullanicilari
                    .AnyAsync(x => x.KullaniciAdi == normalizedUsername && x.Id != dto.Id);

                if (isTaken)
                    return ServiceResponse<bool>.FailureResult($"'{normalizedUsername}' kullanıcı adı zaten başkası tarafından kullanılıyor.");
            }

            // 3. Bilgileri Güncelle (Olduğu gibi)
            entity.Adi = dto.Adi?.Trim()!;
            entity.Soyadi = dto.Soyadi?.Trim()!;
            entity.KullaniciAdi = normalizedUsername;
            entity.RolId = dto.RolId;
            entity.SubeId = dto.SubeId;

            // 4. Master Alanlar
            entity.MasterAlanId = dto.MasterAlanId;
            entity.MasterDepartmanId = dto.MasterDepartmanId;

            // 5. Şifre Güncelleme
            if (!string.IsNullOrEmpty(dto.YeniKullaniciSifre))
            {
                entity.KullaniciSifre = BCrypt.Net.BCrypt.HashPassword(dto.YeniKullaniciSifre);
            }

            _context.PanelKullanicilari.Update(entity);
            await _context.SaveChangesAsync();

            return ServiceResponse<bool>.SuccessResult(true, "Kullanıcı başarıyla güncellendi.");
        }
        public async Task<ServiceResponse<List<PanelKullaniciListDto>>> GetAllAsync()
        {
            var list = await _context.PanelKullanicilari
                .AsNoTracking()
                .Include(x => x.Rol)
                .Include(x => x.Sube)
                .Include(x => x.MasterDepartman) // Yeni Master Yapı
                .Include(x => x.MasterAlan)      // Yeni Master Yapı
                .OrderByDescending(x => x.Id)
                .ToListAsync();

            var map = _mapper.Map<List<PanelKullaniciListDto>>(list);
            return ServiceResponse<List<PanelKullaniciListDto>>.SuccessResult(map);
        }

        public async Task<ServiceResponse<PanelKullaniciListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.PanelKullanicilari
                .AsNoTracking()
                .Include(x => x.Rol)
                .Include(x => x.Sube)
                .Include(x => x.MasterDepartman) // Yeni Master Yapı
                .Include(x => x.MasterAlan)      // Yeni Master Yapı
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
                return ServiceResponse<PanelKullaniciListDto>.FailureResult("Kullanıcı bulunamadı.");

            var map = _mapper.Map<PanelKullaniciListDto>(entity);
            return ServiceResponse<PanelKullaniciListDto>.SuccessResult(map);
        }

       

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            var entity = await _context.PanelKullanicilari.FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kullanıcı bulunamadı.");

            _context.PanelKullanicilari.Remove(entity);
            await _context.SaveChangesAsync();

            return ServiceResponse<bool>.SuccessResult(true, "Kullanıcı silindi.");
        }


        public async Task<ServiceResponse<bool>> ChangePasswordAsync(PanelKullaniciPasswordChangeDto dto)
        {
            // 1. Yeni şifreler uyuşuyor mu? (Frontend'de de kontrol ediliyor ama backend'de de şart)
            if (dto.YeniSifre != dto.YeniSifreTekrar)
                return ServiceResponse<bool>.FailureResult("Yeni şifreler birbiriyle uyuşmuyor.");

            // 2. Kullanıcıyı bul
            var entity = await _context.PanelKullanicilari.FindAsync(dto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kullanıcı bulunamadı.");

            // 3. ESKİ ŞİFRE KONTROLÜ (Kritik Nokta)
            // Veritabanındaki hash ile gönderilen eski şifreyi kıyasla
            bool isOldPasswordCorrect = BCrypt.Net.BCrypt.Verify(dto.EskiSifre, entity.KullaniciSifre);

            if (!isOldPasswordCorrect)
                return ServiceResponse<bool>.FailureResult("Eski şifreniz hatalı. Lütfen kontrol ediniz.");

            // 4. Yeni şifreyi Hash'le ve Kaydet
            entity.KullaniciSifre = BCrypt.Net.BCrypt.HashPassword(dto.YeniSifre);

            _context.PanelKullanicilari.Update(entity);
            await _context.SaveChangesAsync();

            return ServiceResponse<bool>.SuccessResult(true, "Şifreniz başarıyla değiştirildi.");
        }
    }
}