using AutoMapper;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.IsDeneyimiDtos;
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
    public class IsDeneyimiService : IIsDeneyimiService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;

        public IsDeneyimiService(IsBasvuruContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<IsDeneyimiListDto>>> GetAllAsync()
        {
            var list = await _context.IsDeneyimleri
                .Include(x => x.Ulke)
                .Include(x => x.Sehir)
                .ToListAsync();
            var mappedList = _mapper.Map<List<IsDeneyimiListDto>>(list);
            return ServiceResponse<List<IsDeneyimiListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<List<IsDeneyimiListDto>>> GetByPersonelIdAsync(int personelId)
        {
            var list = await _context.IsDeneyimleri
                .Include(x => x.Ulke)
                .Include(x => x.Sehir)
                .Where(x => x.PersonelId == personelId)
                .OrderByDescending(x => x.BitisTarihi)
                .ToListAsync();
            var mappedList = _mapper.Map<List<IsDeneyimiListDto>>(list);
            return ServiceResponse<List<IsDeneyimiListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<IsDeneyimiListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.IsDeneyimleri
                .Include(x => x.Ulke)
                .Include(x => x.Sehir)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
                return ServiceResponse<IsDeneyimiListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<IsDeneyimiListDto>(entity);
            return ServiceResponse<IsDeneyimiListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<IsDeneyimiListDto>> CreateAsync(IsDeneyimiCreateDto dto)
        {
            var entity = _mapper.Map<IsDeneyimi>(dto);
            await _context.IsDeneyimleri.AddAsync(entity);
            await _context.SaveChangesAsync();

            var mapped = _mapper.Map<IsDeneyimiListDto>(entity);
            return ServiceResponse<IsDeneyimiListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(IsDeneyimiUpdateDto dto)
        {
            var entity = await _context.IsDeneyimleri.FindAsync(dto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _mapper.Map(dto, entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            var entity = await _context.IsDeneyimleri.FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _context.IsDeneyimleri.Remove(entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true);
        }
    }
}