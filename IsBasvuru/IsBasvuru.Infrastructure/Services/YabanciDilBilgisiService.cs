using AutoMapper;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.YabanciDilBilgisiDtos;
using IsBasvuru.Domain.Entities.PersonelBilgileri;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.Domain.Wrappers;
using IsBasvuru.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IsBasvuru.Infrastructure.Services
{
    public class YabanciDilBilgisiService : IYabanciDilBilgisiService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;

        public YabanciDilBilgisiService(IsBasvuruContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<YabanciDilBilgisiListDto>>> GetAllAsync()
        {
            var list = await _context.Set<YabanciDilBilgisi>()
                .Include(x => x.Dil)
                .ToListAsync();
            var mappedList = _mapper.Map<List<YabanciDilBilgisiListDto>>(list);
            return ServiceResponse<List<YabanciDilBilgisiListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<List<YabanciDilBilgisiListDto>>> GetByPersonelIdAsync(int personelId)
        {
            var list = await _context.Set<YabanciDilBilgisi>()
                .Include(x => x.Dil)
                .Where(x => x.PersonelId == personelId)
                .ToListAsync();
            var mappedList = _mapper.Map<List<YabanciDilBilgisiListDto>>(list);
            return ServiceResponse<List<YabanciDilBilgisiListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<YabanciDilBilgisiListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.Set<YabanciDilBilgisi>()
                .Include(x => x.Dil)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
                return ServiceResponse<YabanciDilBilgisiListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<YabanciDilBilgisiListDto>(entity);
            return ServiceResponse<YabanciDilBilgisiListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<YabanciDilBilgisiListDto>> CreateAsync(YabanciDilBilgisiCreateDto dto)
        {
            var entity = _mapper.Map<YabanciDilBilgisi>(dto);
            await _context.Set<YabanciDilBilgisi>().AddAsync(entity);
            await _context.SaveChangesAsync();

            // Eklenen veriyi ilişkilerle birlikte dönmek için tekrar çekiyoruz
            return await GetByIdAsync(entity.Id);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(YabanciDilBilgisiUpdateDto dto)
        {
            var entity = await _context.Set<YabanciDilBilgisi>().FindAsync(dto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _mapper.Map(dto, entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            var entity = await _context.Set<YabanciDilBilgisi>().FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _context.Set<YabanciDilBilgisi>().Remove(entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true);
        }
    }
}