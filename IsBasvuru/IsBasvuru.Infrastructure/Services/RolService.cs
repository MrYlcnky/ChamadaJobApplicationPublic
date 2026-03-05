using AutoMapper;
using IsBasvuru.Domain.DTOs.AdminDtos.RolDtos;
using IsBasvuru.Domain.Entities.AdminBilgileri;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.Domain.Wrappers;
using IsBasvuru.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Infrastructure.Services
{
    public class RolService : IRolService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;

        public RolService(IsBasvuruContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<RolListDto>>> GetAllAsync()
        {
            var list = await _context.Roller.ToListAsync();
            var mappedList = _mapper.Map<List<RolListDto>>(list);
            return ServiceResponse<List<RolListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<RolListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.Roller.FindAsync(id);
            if (entity == null)
                return ServiceResponse<RolListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<RolListDto>(entity);
            return ServiceResponse<RolListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            // Bu rol herhangi bir panel kullanıcısına atanmış mı?
            bool isUsed = await _context.PanelKullanicilari.AnyAsync(x => x.RolId == id);
            if (isUsed)
            {
                return ServiceResponse<bool>.FailureResult("Bu rol bir veya daha fazla kullanıcıya atandığı için silinemez.");
            }

            var entity = await _context.Roller.FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _context.Roller.Remove(entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true, "Rol silindi.");
        }
    }
}