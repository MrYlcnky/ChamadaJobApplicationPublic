using AutoMapper;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.PersonelEhliyetDtos;
using IsBasvuru.Domain.Entities.SirketYapisi;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.Domain.Wrappers;
using IsBasvuru.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IsBasvuru.Infrastructure.Services
{
    public class PersonelEhliyetService : IPersonelEhliyetService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;

        public PersonelEhliyetService(IsBasvuruContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<PersonelEhliyetListDto>>> GetAllAsync()
        {
            var list = await _context.Set<PersonelEhliyet>()
                .Include(x => x.EhliyetTuru)
                .ToListAsync();
            var mappedList = _mapper.Map<List<PersonelEhliyetListDto>>(list);
            return ServiceResponse<List<PersonelEhliyetListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<List<PersonelEhliyetListDto>>> GetByPersonelIdAsync(int personelId)
        {
            var list = await _context.Set<PersonelEhliyet>()
                .Include(x => x.EhliyetTuru)
                .Where(x => x.PersonelId == personelId)
                .ToListAsync();
            var mappedList = _mapper.Map<List<PersonelEhliyetListDto>>(list);
            return ServiceResponse<List<PersonelEhliyetListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<PersonelEhliyetListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.Set<PersonelEhliyet>()
                .Include(x => x.EhliyetTuru)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
                return ServiceResponse<PersonelEhliyetListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<PersonelEhliyetListDto>(entity);
            return ServiceResponse<PersonelEhliyetListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<PersonelEhliyetListDto>> CreateAsync(PersonelEhliyetCreateDto dto)
        {
            var entity = _mapper.Map<PersonelEhliyet>(dto);
            await _context.Set<PersonelEhliyet>().AddAsync(entity);
            await _context.SaveChangesAsync();

            // İlişkili veriyi (Ehliyet Adı) dönmek için tekrar çekiyoruz
            return await GetByIdAsync(entity.Id);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(PersonelEhliyetUpdateDto dto)
        {
            var entity = await _context.Set<PersonelEhliyet>().FindAsync(dto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _mapper.Map(dto, entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            var entity = await _context.Set<PersonelEhliyet>().FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _context.Set<PersonelEhliyet>().Remove(entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true);
        }
    }
}