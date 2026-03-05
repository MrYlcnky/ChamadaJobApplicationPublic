using AutoMapper;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.ReferansBilgisiDtos;
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
    public class ReferansBilgisiService : IReferansBilgisiService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;

        public ReferansBilgisiService(IsBasvuruContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<ReferansBilgisiListDto>>> GetAllAsync()
        {
            var list = await _context.Set<ReferansBilgisi>().ToListAsync();
            var mappedList = _mapper.Map<List<ReferansBilgisiListDto>>(list);
            return ServiceResponse<List<ReferansBilgisiListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<List<ReferansBilgisiListDto>>> GetByPersonelIdAsync(int personelId)
        {
            var list = await _context.Set<ReferansBilgisi>()
                                     .Where(x => x.PersonelId == personelId)
                                     .ToListAsync();
            var mappedList = _mapper.Map<List<ReferansBilgisiListDto>>(list);
            return ServiceResponse<List<ReferansBilgisiListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<ReferansBilgisiListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.Set<ReferansBilgisi>().FindAsync(id);
            if (entity == null)
                return ServiceResponse<ReferansBilgisiListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<ReferansBilgisiListDto>(entity);
            return ServiceResponse<ReferansBilgisiListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<ReferansBilgisiListDto>> CreateAsync(ReferansBilgisiCreateDto dto)
        {
            var entity = _mapper.Map<ReferansBilgisi>(dto);
            await _context.Set<ReferansBilgisi>().AddAsync(entity);
            await _context.SaveChangesAsync();

            var mapped = _mapper.Map<ReferansBilgisiListDto>(entity);
            return ServiceResponse<ReferansBilgisiListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(ReferansBilgisiUpdateDto dto)
        {
            var entity = await _context.Set<ReferansBilgisi>().FindAsync(dto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _mapper.Map(dto, entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            var entity = await _context.Set<ReferansBilgisi>().FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _context.Set<ReferansBilgisi>().Remove(entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true);
        }
    }
}