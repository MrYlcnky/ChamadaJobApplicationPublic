using AutoMapper;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.DigerKisiselBilgilerDtos;
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
    public class DigerKisiselBilgilerService : IDigerKisiselBilgilerService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;

        public DigerKisiselBilgilerService(IsBasvuruContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<DigerKisiselBilgilerListDto>>> GetAllAsync()
        {
            var list = await _context.Set<DigerKisiselBilgiler>()
                .Include(x => x.KktcBelge)
                .ToListAsync();
            var mappedList = _mapper.Map<List<DigerKisiselBilgilerListDto>>(list);
            return ServiceResponse<List<DigerKisiselBilgilerListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<List<DigerKisiselBilgilerListDto>>> GetByPersonelIdAsync(int personelId)
        {
            var list = await _context.Set<DigerKisiselBilgiler>()
                .Include(x => x.KktcBelge)
                .Where(x => x.PersonelId == personelId)
                .ToListAsync();
            var mappedList = _mapper.Map<List<DigerKisiselBilgilerListDto>>(list);
            return ServiceResponse<List<DigerKisiselBilgilerListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<DigerKisiselBilgilerListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.Set<DigerKisiselBilgiler>()
                .Include(x => x.KktcBelge)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
                return ServiceResponse<DigerKisiselBilgilerListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<DigerKisiselBilgilerListDto>(entity);
            return ServiceResponse<DigerKisiselBilgilerListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<DigerKisiselBilgilerListDto>> CreateAsync(DigerKisiselBilgilerCreateDto dto)
        {
            var entity = _mapper.Map<DigerKisiselBilgiler>(dto);
            await _context.Set<DigerKisiselBilgiler>().AddAsync(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(DigerKisiselBilgilerUpdateDto dto)
        {
            var entity = await _context.Set<DigerKisiselBilgiler>().FindAsync(dto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _mapper.Map(dto, entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            var entity = await _context.Set<DigerKisiselBilgiler>().FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _context.Set<DigerKisiselBilgiler>().Remove(entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true);
        }
    }
}