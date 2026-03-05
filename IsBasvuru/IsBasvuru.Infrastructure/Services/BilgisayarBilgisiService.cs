using AutoMapper;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.BilgisayarBilgisiDtos;
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
    public class BilgisayarBilgisiService : IBilgisayarBilgisiService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;

        public BilgisayarBilgisiService(IsBasvuruContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<BilgisayarBilgisiListDto>>> GetAllAsync()
        {
            var list = await _context.BilgisayarBilgileri.ToListAsync();
            var mappedList = _mapper.Map<List<BilgisayarBilgisiListDto>>(list);

            return ServiceResponse<List<BilgisayarBilgisiListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<List<BilgisayarBilgisiListDto>>> GetByPersonelIdAsync(int personelId)
        {
            var list = await _context.BilgisayarBilgileri
                                     .Where(x => x.PersonelId == personelId)
                                     .ToListAsync();

            var mappedList = _mapper.Map<List<BilgisayarBilgisiListDto>>(list);

            return ServiceResponse<List<BilgisayarBilgisiListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<BilgisayarBilgisiListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.BilgisayarBilgileri.FindAsync(id);
            if (entity == null)
                return ServiceResponse<BilgisayarBilgisiListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<BilgisayarBilgisiListDto>(entity);
            return ServiceResponse<BilgisayarBilgisiListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<BilgisayarBilgisiListDto>> CreateAsync(BilgisayarBilgisiCreateDto dto)
        {
            // Aynı personele aynı programı ikinci kez ekletmeyelim.
            bool zatenVarMi = await _context.BilgisayarBilgileri
                .AnyAsync(x => x.PersonelId == dto.PersonelId &&
                               x.ProgramAdi.ToLower() == dto.ProgramAdi.ToLower());

            if (zatenVarMi)
            {
                
                return ServiceResponse<BilgisayarBilgisiListDto>.FailureResult($"Bu personel için '{dto.ProgramAdi}' bilgisi zaten eklenmiş.");
            }

            var entity = _mapper.Map<BilgisayarBilgisi>(dto);
            await _context.BilgisayarBilgileri.AddAsync(entity);
            await _context.SaveChangesAsync();

            var mapped = _mapper.Map<BilgisayarBilgisiListDto>(entity);
            return ServiceResponse<BilgisayarBilgisiListDto>.SuccessResult(mapped, "Kayıt başarıyla eklendi.");
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(BilgisayarBilgisiUpdateDto dto)
        {
            var entity = await _context.BilgisayarBilgileri.FindAsync(dto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Güncellenecek kayıt bulunamadı.");

            // İsim değişiyorsa çakışma kontrolü
            if (entity.ProgramAdi.ToLower() != dto.ProgramAdi.ToLower())
            {
                bool cakisma = await _context.BilgisayarBilgileri
                    .AnyAsync(x => x.PersonelId == entity.PersonelId &&
                                   x.ProgramAdi.ToLower() == dto.ProgramAdi.ToLower() &&
                                   x.Id != dto.Id);

                if (cakisma)
                    return ServiceResponse<bool>.FailureResult($"Bu personel için '{dto.ProgramAdi}' bilgisi zaten mevcut.");
            }

            _mapper.Map(dto, entity);
            await _context.SaveChangesAsync();

            return ServiceResponse<bool>.SuccessResult(true, "Güncelleme başarılı.");
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            var entity = await _context.BilgisayarBilgileri.FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Silinecek kayıt bulunamadı.");

            _context.BilgisayarBilgileri.Remove(entity);
            await _context.SaveChangesAsync();

            return ServiceResponse<bool>.SuccessResult(true, "Kayıt silindi.");
        }
    }
}