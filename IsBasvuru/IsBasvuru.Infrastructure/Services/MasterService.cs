using AutoMapper;
using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterAlanDtos;
using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterDepartmanDtos;
using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterOyun;
using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterPozisyonDtos;
using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterProgram;
using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterSubeAlan;
using IsBasvuru.Domain.Entities.SirketYapisi.SirketMasterYapisi;
using IsBasvuru.Domain.Entities.Tanimlamalar;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.Domain.Wrappers;
using IsBasvuru.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Infrastructure.Services
{
    // ==========================================
    // 1. MASTER ALAN SERVICE
    // ==========================================
    public class MasterAlanService : IMasterAlanService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;

        public MasterAlanService(IsBasvuruContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<MasterAlanListDto>>> GetAllAsync()
        {
            var list = await _context.MasterAlanlar.AsNoTracking().ToListAsync();
            var mapped = _mapper.Map<List<MasterAlanListDto>>(list);
            return ServiceResponse<List<MasterAlanListDto>>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<MasterAlanListDto>> CreateAsync(MasterAlanCreateDto dto)
        {
            // Aynı isimde alan var mı?
            bool varMi = await _context.MasterAlanlar.AnyAsync(x => x.MasterAlanAdi == dto.MasterAlanAdi);
            if (varMi) return ServiceResponse<MasterAlanListDto>.FailureResult("Bu isimde bir alan zaten mevcut.");

            var entity = _mapper.Map<MasterAlan>(dto);
            await _context.MasterAlanlar.AddAsync(entity);
            await _context.SaveChangesAsync();

            var mapped = _mapper.Map<MasterAlanListDto>(entity);
            return ServiceResponse<MasterAlanListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(MasterAlanUpdateDto dto)
        {
            var entity = await _context.MasterAlanlar.FindAsync(dto.Id);
            if (entity == null) return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // İsim çakışması (kendi ID'si hariç)
            bool cakisma = await _context.MasterAlanlar.AnyAsync(x => x.MasterAlanAdi == dto.MasterAlanAdi && x.Id != dto.Id);
            if (cakisma) return ServiceResponse<bool>.FailureResult("Bu isimde başka bir alan zaten var.");

            _mapper.Map(dto, entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            // 1. ÖNCELİKLİ KONTROL (Kullanıcıya güzel mesaj vermek için)
            bool kullaniliyorMu = await _context.SubeAlanlar.AnyAsync(x => x.MasterAlanId == id);
            if (kullaniliyorMu)
                return ServiceResponse<bool>.FailureResult("Bu alan bir şubede kullanıldığı için silinemez.");

            var entity = await _context.MasterAlanlar.FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // 2. NİHAİ GÜVENLİK (Veritabanı kısıtlamaları için)
            try
            {
                _context.MasterAlanlar.Remove(entity);
                await _context.SaveChangesAsync();
                return ServiceResponse<bool>.SuccessResult(true, "Kayıt başarıyla silindi.");
            }
            catch (DbUpdateException) // Veritabanı ilişkisel hatası (Foreign Key)
            {
                // AnyAsync ile yakalayamadığımız başka bir tablo varsa buraya düşer.
                return ServiceResponse<bool>.FailureResult("Bu kayıt başka verilerle ilişkili olduğu için silinemiyor.");
            }
            catch (Exception ex)
            {
                return ServiceResponse<bool>.FailureResult($"Bir hata oluştu: {ex.Message}");
            }
        }
    }

    // ==========================================
    // 2. MASTER DEPARTMAN SERVICE
    // ==========================================
    public class MasterDepartmanService : IMasterDepartmanService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;

        public MasterDepartmanService(IsBasvuruContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<MasterDepartmanListDto>>> GetAllAsync()
        {
            var list = await _context.MasterDepartmanlar.AsNoTracking().ToListAsync();
            var mapped = _mapper.Map<List<MasterDepartmanListDto>>(list);
            return ServiceResponse<List<MasterDepartmanListDto>>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<MasterDepartmanListDto>> CreateAsync(MasterDepartmanCreateDto dto)
        {
            bool varMi = await _context.MasterDepartmanlar.AnyAsync(x => x.MasterDepartmanAdi == dto.MasterDepartmanAdi);
            if (varMi) return ServiceResponse<MasterDepartmanListDto>.FailureResult("Bu isimde bir departman zaten mevcut.");

            var entity = _mapper.Map<MasterDepartman>(dto);
            await _context.MasterDepartmanlar.AddAsync(entity);
            await _context.SaveChangesAsync();

            var mapped = _mapper.Map<MasterDepartmanListDto>(entity);
            return ServiceResponse<MasterDepartmanListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(MasterDepartmanUpdateDto dto)
        {
            var entity = await _context.MasterDepartmanlar.FindAsync(dto.Id);
            if (entity == null) return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            bool cakisma = await _context.MasterDepartmanlar.AnyAsync(x => x.MasterDepartmanAdi == dto.MasterDepartmanAdi && x.Id != dto.Id);
            if (cakisma) return ServiceResponse<bool>.FailureResult("Bu isimde başka bir departman zaten var.");

            _mapper.Map(dto, entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            // 1. İLİŞKİ KONTROLÜ (Frontend'deki 500 hatasını engelleyen kısım burası)
            bool kullaniliyorMu = await _context.Departmanlar.AnyAsync(x => x.MasterDepartmanId == id);
            if (kullaniliyorMu)
                return ServiceResponse<bool>.FailureResult("Bu departman kullanımda olduğu için silinemez.");

            // 2. VARLIK KONTROLÜ
            var entity = await _context.MasterDepartmanlar.FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // 3. SİLME İŞLEMİ (Güvenli Blok)
            try
            {
                _context.MasterDepartmanlar.Remove(entity);
                await _context.SaveChangesAsync();
                return ServiceResponse<bool>.SuccessResult(true, "Kayıt başarıyla silindi.");
            }
            catch (Exception ex)
            {
                // Beklenmedik bir veritabanı hatası olursa (Bağlantı kopması vb.)
                return ServiceResponse<bool>.FailureResult($"İşlem sırasında bir hata oluştu: {ex.Message}");
            }
        }
    }

    // ==========================================
    // 3. MASTER POZİSYON SERVICE
    // ==========================================
    public class MasterPozisyonService : IMasterPozisyonService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;

        public MasterPozisyonService(IsBasvuruContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<MasterPozisyonListDto>>> GetAllAsync()
        {
            var list = await _context.MasterPozisyonlar.AsNoTracking().ToListAsync();
            var mapped = _mapper.Map<List<MasterPozisyonListDto>>(list);
            return ServiceResponse<List<MasterPozisyonListDto>>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<MasterPozisyonListDto>> CreateAsync(MasterPozisyonCreateDto dto)
        {
            bool varMi = await _context.MasterPozisyonlar.AnyAsync(x => x.MasterPozisyonAdi == dto.MasterPozisyonAdi);
            if (varMi) return ServiceResponse<MasterPozisyonListDto>.FailureResult("Bu isimde bir pozisyon zaten mevcut.");

            var entity = _mapper.Map<MasterPozisyon>(dto);
            await _context.MasterPozisyonlar.AddAsync(entity);
            await _context.SaveChangesAsync();

            var mapped = _mapper.Map<MasterPozisyonListDto>(entity);
            return ServiceResponse<MasterPozisyonListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(MasterPozisyonUpdateDto dto)
        {
            var entity = await _context.MasterPozisyonlar.FindAsync(dto.Id);
            if (entity == null) return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            bool cakisma = await _context.MasterPozisyonlar.AnyAsync(x => x.MasterPozisyonAdi == dto.MasterPozisyonAdi && x.Id != dto.Id);
            if (cakisma) return ServiceResponse<bool>.FailureResult("Bu isimde başka bir pozisyon zaten var.");

            _mapper.Map(dto, entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            // 1. İLİŞKİ KONTROLÜ
            // Bu pozisyon herhangi bir departmana atanmış mı?
            bool kullaniliyorMu = await _context.DepartmanPozisyonlar.AnyAsync(x => x.MasterPozisyonId == id);
            if (kullaniliyorMu)
                return ServiceResponse<bool>.FailureResult("Bu pozisyon bir departmanda tanımlı olduğu için silinemez.");

            // 2. VARLIK KONTROLÜ
            var entity = await _context.MasterPozisyonlar.FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // 3. SİLME İŞLEMİ (Güvenli Blok)
            try
            {
                _context.MasterPozisyonlar.Remove(entity);
                await _context.SaveChangesAsync();
                return ServiceResponse<bool>.SuccessResult(true, "Pozisyon başarıyla silindi.");
            }
            catch (Exception ex)
            {
                return ServiceResponse<bool>.FailureResult($"Silme işlemi sırasında hata oluştu: {ex.Message}");
            }
        }
    }

    // ==========================================
    // 4. MASTER PROGRAM SERVICE
    // ==========================================
    public class MasterProgramService(IsBasvuruContext context, IMapper mapper) : IMasterProgramService
    {
        private readonly IsBasvuruContext _context = context;
        private readonly IMapper _mapper = mapper;

        public async Task<ServiceResponse<List<MasterProgramDto>>> GetAllAsync()
        {
            var list = await _context.MasterProgramlar.AsNoTracking().ToListAsync();
            var mapped = _mapper.Map<List<MasterProgramDto>>(list);
            return ServiceResponse<List<MasterProgramDto>>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<MasterProgramDto>> CreateAsync(MasterProgramCreateDto dto)
        {
            bool varMi = await _context.MasterProgramlar.AnyAsync(x => x.MasterProgramAdi == dto.MasterProgramAdi);
            if (varMi) return ServiceResponse<MasterProgramDto>.FailureResult("Bu isimde bir program zaten mevcut.");

            var entity = _mapper.Map<MasterProgram>(dto);
            await _context.MasterProgramlar.AddAsync(entity);
            await _context.SaveChangesAsync();

            var mapped = _mapper.Map<MasterProgramDto>(entity);
            return ServiceResponse<MasterProgramDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(MasterProgramUpdateDto dto)
        {
            var entity = await _context.MasterProgramlar.FindAsync(dto.Id);
            if (entity == null) return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            bool cakisma = await _context.MasterProgramlar.AnyAsync(x => x.MasterProgramAdi == dto.MasterProgramAdi && x.Id != dto.Id);
            if (cakisma) return ServiceResponse<bool>.FailureResult("Bu isimde başka bir program zaten var.");

            _mapper.Map(dto, entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            // 1. İLİŞKİ KONTROLÜ
            // Bu program herhangi bir departmana atanmış mı?
            bool kullaniliyorMu = await _context.ProgramBilgileri.AnyAsync(x => x.MasterProgramId == id);
            if (kullaniliyorMu)
                return ServiceResponse<bool>.FailureResult("Bu program departman eşleşmelerinde kullanıldığı için silinemez.");

            // 2. VARLIK KONTROLÜ
            var entity = await _context.MasterProgramlar.FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // 3. SİLME İŞLEMİ (Güvenli Blok)
            try
            {
                _context.MasterProgramlar.Remove(entity);
                await _context.SaveChangesAsync();
                return ServiceResponse<bool>.SuccessResult(true, "Program başarıyla silindi.");
            }
            catch (Exception ex)
            {
                return ServiceResponse<bool>.FailureResult($"Silme işlemi sırasında hata oluştu: {ex.Message}");
            }
        }
    }

    // ==========================================
    // 5. MASTER OYUN SERVICE
    // ==========================================
    public class MasterOyunService(IsBasvuruContext context, IMapper mapper) : IMasterOyunService
    {
        private readonly IsBasvuruContext _context = context;
        private readonly IMapper _mapper = mapper;

        public async Task<ServiceResponse<List<MasterOyunDto>>> GetAllAsync()
        {
            var list = await _context.MasterOyunlar.AsNoTracking().ToListAsync();
            var mapped = _mapper.Map<List<MasterOyunDto>>(list);
            return ServiceResponse<List<MasterOyunDto>>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<MasterOyunDto>> CreateAsync(MasterOyunCreateDto dto)
        {
            bool varMi = await _context.MasterOyunlar.AnyAsync(x => x.MasterOyunAdi == dto.MasterOyunAdi);
            if (varMi) return ServiceResponse<MasterOyunDto>.FailureResult("Bu isimde bir oyun zaten mevcut.");

            var entity = _mapper.Map<MasterOyun>(dto);
            await _context.MasterOyunlar.AddAsync(entity);
            await _context.SaveChangesAsync();

            var mapped = _mapper.Map<MasterOyunDto>(entity);
            return ServiceResponse<MasterOyunDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(MasterOyunUpdateDto dto)
        {
            var entity = await _context.MasterOyunlar.FindAsync(dto.Id);
            if (entity == null) return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            bool cakisma = await _context.MasterOyunlar.AnyAsync(x => x.MasterOyunAdi == dto.MasterOyunAdi && x.Id != dto.Id);
            if (cakisma) return ServiceResponse<bool>.FailureResult("Bu isimde başka bir oyun zaten var.");

            _mapper.Map(dto, entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            // 1. İLİŞKİ KONTROLÜ
            // Bu oyun herhangi bir departmana atanmış mı?
            bool kullaniliyorMu = await _context.OyunBilgileri.AnyAsync(x => x.MasterOyunId == id);
            if (kullaniliyorMu)
                return ServiceResponse<bool>.FailureResult("Bu oyun departman eşleşmelerinde kullanıldığı için silinemez.");

            // 2. VARLIK KONTROLÜ
            var entity = await _context.MasterOyunlar.FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // 3. SİLME İŞLEMİ (Güvenli Blok)
            try
            {
                _context.MasterOyunlar.Remove(entity);
                await _context.SaveChangesAsync();
                return ServiceResponse<bool>.SuccessResult(true, "Oyun başarıyla silindi.");
            }
            catch (Exception ex)
            {
                return ServiceResponse<bool>.FailureResult($"Silme işlemi sırasında hata oluştu: {ex.Message}");
            }
        }
    }


}