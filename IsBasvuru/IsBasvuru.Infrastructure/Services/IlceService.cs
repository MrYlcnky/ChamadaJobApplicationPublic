using AutoMapper;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.IlceDtos;
using IsBasvuru.Domain.Entities.Tanimlamalar;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.Domain.Wrappers;
using IsBasvuru.Infrastructure.Tools;
using IsBasvuru.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Infrastructure.Services
{
    public class IlceService : IIlceService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _cache;

        private const string CacheKey = "ilce_list";

        public IlceService(IsBasvuruContext context, IMapper mapper, IMemoryCache cache)
        {
            _context = context;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<ServiceResponse<List<IlceListDto>>> GetAllAsync()
        {
            if (_cache.TryGetValue(CacheKey, out List<IlceListDto>? cachedList) && cachedList is not null)
            {
                return ServiceResponse<List<IlceListDto>>.SuccessResult(cachedList);
            }

            var list = await _context.Ilceler
                .Include(x => x.Sehir)
                    .ThenInclude(s => s!.Ulke)
                .ToListAsync();

            var mappedList = _mapper.Map<List<IlceListDto>>(list) ?? new List<IlceListDto>();

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(24))
                .SetPriority(CacheItemPriority.Normal);

            _cache.Set(CacheKey, mappedList, cacheOptions);

            return ServiceResponse<List<IlceListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<IlceListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.Ilceler
                .Include(x => x.Sehir)
                    .ThenInclude(s => s!.Ulke)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
                return ServiceResponse<IlceListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<IlceListDto>(entity);
            return ServiceResponse<IlceListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<IlceListDto>> CreateAsync(IlceCreateDto createDto)
        {
            // 1. Gelen metni hemen normalize et
            string normalizedName = createDto.IlceAdi.ToTurkishUpper();

            // Şehir kontrolü
            if (!await _context.Sehirler.AnyAsync(x => x.Id == createDto.SehirId))
                return ServiceResponse<IlceListDto>.FailureResult("Seçilen şehir bulunamadı.");

            // 2. İsim çakışması kontrolünü büyük harf üzerinden yap
            if (await _context.Ilceler.AnyAsync(x => x.SehirId == createDto.SehirId && x.IlceAdi == normalizedName))
                return ServiceResponse<IlceListDto>.FailureResult($"'{normalizedName}' ilçesi bu şehirde zaten kayıtlı.");

            var entity = _mapper.Map<Ilce>(createDto);

            // 3. Veritabanına büyük harf garantisiyle kaydet
            entity.IlceAdi = normalizedName;

            await _context.Ilceler.AddAsync(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            var mapped = _mapper.Map<IlceListDto>(entity);
            return ServiceResponse<IlceListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(IlceUpdateDto updateDto)
        {
            var entity = await _context.Ilceler.FindAsync(updateDto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // 1. Yeni ismi normalize et
            string normalizedName = updateDto.IlceAdi.ToTurkishUpper();

            // Şehir değişikliği kontrolü
            if (entity.SehirId != updateDto.SehirId)
            {
                if (!await _context.Sehirler.AnyAsync(x => x.Id == updateDto.SehirId))
                    return ServiceResponse<bool>.FailureResult("Yeni seçilen şehir geçersiz.");
            }

            // 2. İsim çakışması kontrolü (Aynı şehirde başka bir ilçe bu ismi kullanıyor mu?)
            if (await _context.Ilceler.AnyAsync(x => x.SehirId == updateDto.SehirId && x.IlceAdi == normalizedName && x.Id != updateDto.Id))
                return ServiceResponse<bool>.FailureResult($"'{normalizedName}' ismi bu şehirdeki başka bir ilçe kaydında kullanılıyor.");

            _mapper.Map(updateDto, entity);

            // 3. Update sonrası manuel set
            entity.IlceAdi = normalizedName;

            _context.Ilceler.Update(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            // Hem Doğum Yeri hem de İkametgah olarak kontrol ediyoruz.
            bool kullaniliyorMu = await _context.KisiselBilgileri
                .AnyAsync(x => x.DogumIlceId == id || x.IkametgahIlceId == id);

            if (kullaniliyorMu)
            {
                return ServiceResponse<bool>.FailureResult("Bu ilçe, personel kayıtlarında (Doğum yeri veya İkametgah olarak) kullanıldığı için silinemez.");
            }

            var entity = await _context.Ilceler.FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _context.Ilceler.Remove(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }
    }
}