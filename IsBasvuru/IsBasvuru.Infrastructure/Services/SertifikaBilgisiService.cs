using AutoMapper;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.SertifikaBilgisiDtos;
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
    public class SertifikaBilgisiService : ISertifikaBilgisiService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;

        public SertifikaBilgisiService(IsBasvuruContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<SertifikaBilgisiListDto>>> GetAllAsync()
        {
            var list = await _context.Set<SertifikaBilgisi>().ToListAsync();
            var mappedList = _mapper.Map<List<SertifikaBilgisiListDto>>(list);
            return ServiceResponse<List<SertifikaBilgisiListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<List<SertifikaBilgisiListDto>>> GetByPersonelIdAsync(int personelId)
        {
            var list = await _context.Set<SertifikaBilgisi>()
                .Where(x => x.PersonelId == personelId)
                .OrderByDescending(x => x.VerilisTarihi)
                .ToListAsync();
            var mappedList = _mapper.Map<List<SertifikaBilgisiListDto>>(list);
            return ServiceResponse<List<SertifikaBilgisiListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<SertifikaBilgisiListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.Set<SertifikaBilgisi>().FindAsync(id);
            if (entity == null)
                return ServiceResponse<SertifikaBilgisiListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<SertifikaBilgisiListDto>(entity);
            return ServiceResponse<SertifikaBilgisiListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<SertifikaBilgisiListDto>> CreateAsync(SertifikaBilgisiCreateDto dto)
        {
            var entity = _mapper.Map<SertifikaBilgisi>(dto);
            await _context.Set<SertifikaBilgisi>().AddAsync(entity);
            await _context.SaveChangesAsync();

            var mapped = _mapper.Map<SertifikaBilgisiListDto>(entity);
            return ServiceResponse<SertifikaBilgisiListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(SertifikaBilgisiUpdateDto dto)
        {
            var entity = await _context.Set<SertifikaBilgisi>().FindAsync(dto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _mapper.Map(dto, entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            var entity = await _context.Set<SertifikaBilgisi>().FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _context.Set<SertifikaBilgisi>().Remove(entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true);
        }
    }
}