using AutoMapper;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.EgitimBilgisiDtos;
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
    public class EgitimBilgisiService : IEgitimBilgisiService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;

        public EgitimBilgisiService(IsBasvuruContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<EgitimBilgisiListDto>>> GetAllAsync()
        {
            var list = await _context.Set<EgitimBilgisi>().ToListAsync();
            var mappedList = _mapper.Map<List<EgitimBilgisiListDto>>(list);
            return ServiceResponse<List<EgitimBilgisiListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<List<EgitimBilgisiListDto>>> GetByPersonelIdAsync(int personelId)
        {
            var list = await _context.Set<EgitimBilgisi>()
                .Where(x => x.PersonelId == personelId)
                .OrderByDescending(x => x.BaslangicTarihi)
                .ToListAsync();
            var mappedList = _mapper.Map<List<EgitimBilgisiListDto>>(list);
            return ServiceResponse<List<EgitimBilgisiListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<EgitimBilgisiListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.Set<EgitimBilgisi>().FindAsync(id);
            if (entity == null)
                return ServiceResponse<EgitimBilgisiListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<EgitimBilgisiListDto>(entity);
            return ServiceResponse<EgitimBilgisiListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<EgitimBilgisiListDto>> CreateAsync(EgitimBilgisiCreateDto dto)
        {
            var entity = _mapper.Map<EgitimBilgisi>(dto);
            await _context.Set<EgitimBilgisi>().AddAsync(entity);
            await _context.SaveChangesAsync();

            var mapped = _mapper.Map<EgitimBilgisiListDto>(entity);
            return ServiceResponse<EgitimBilgisiListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(EgitimBilgisiUpdateDto dto)
        {
            var entity = await _context.Set<EgitimBilgisi>().FindAsync(dto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _mapper.Map(dto, entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            var entity = await _context.Set<EgitimBilgisi>().FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _context.Set<EgitimBilgisi>().Remove(entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true);
        }
    }
}