using AutoMapper;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.GorevDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.OrganizationImportDtos;
using IsBasvuru.Domain.Entities.SirketYapisi.SirketMasterYapisi;
using IsBasvuru.Domain.Entities.SirketYapisi.SirketTanimYapisi;
using IsBasvuru.Domain.Entities.Tanimlamalar;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.Domain.Wrappers;
using IsBasvuru.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace IsBasvuru.Infrastructure.Services
{
    public class GorevService : IGorevService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;

        public GorevService(IsBasvuruContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<IEnumerable<GorevListDto>>> GetAllAsync()
        {
            var list = await _context.Gorevler
                .Include(x => x.MasterGorev)
                .Include(x => x.MasterDepartman) // Direkt bağlandık
                .ToListAsync();

            var dtoList = _mapper.Map<IEnumerable<GorevListDto>>(list);
            return ServiceResponse<IEnumerable<GorevListDto>>.SuccessResult(dtoList);
        }

        public async Task<ServiceResponse<IEnumerable<GorevListDto>>> GetByMasterGorevIdAsync(int masterGorevId)
        {
            var list = await _context.Gorevler
                .Include(x => x.MasterGorev)
                .Include(x => x.MasterDepartman)
                .Where(x => x.MasterGorevId == masterGorevId)
                .ToListAsync();

            var dtoList = _mapper.Map<IEnumerable<GorevListDto>>(list);
            return ServiceResponse<IEnumerable<GorevListDto>>.SuccessResult(dtoList);
        }

      
        public async Task<ServiceResponse<IEnumerable<GorevListDto>>> GetByMasterDepartmanIdAsync(int masterDepartmanId)
        {
            var list = await _context.Gorevler
                .Include(x => x.MasterGorev)
                .Where(x => x.MasterDepartmanId == masterDepartmanId)
                .ToListAsync();

            var dtoList = _mapper.Map<IEnumerable<GorevListDto>>(list);
            return ServiceResponse<IEnumerable<GorevListDto>>.SuccessResult(dtoList);
        }

        public async Task<ServiceResponse<GorevListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.Gorevler
                .Include(x => x.MasterGorev)
                .Include(x => x.MasterDepartman)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
                return ServiceResponse<GorevListDto>.FailureResult("Kayıt bulunamadı.");

            var dto = _mapper.Map<GorevListDto>(entity);
            return ServiceResponse<GorevListDto>.SuccessResult(dto);
        }

        public async Task<ServiceResponse<int>> CreateAsync(GorevCreateDto dto)
        {
            var entity = _mapper.Map<Gorev>(dto);
            await _context.Gorevler.AddAsync(entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<int>.SuccessResult(entity.Id, "Başarıyla eklendi.");
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(GorevUpdateDto dto)
        {
            var entity = await _context.Gorevler.FindAsync(dto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _mapper.Map(dto, entity);
            _context.Gorevler.Update(entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true, "Başarıyla güncellendi.");
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            var entity = await _context.Gorevler.FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _context.Gorevler.Remove(entity);
            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true, "Başarıyla silindi.");
        }


        public async Task<ServiceResponse<bool>> ImportGorevAsync(List<GorevImportDto> importData)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var validData = importData
                    .Where(r => !string.IsNullOrWhiteSpace(r.Departman) &&
                                !string.IsNullOrWhiteSpace(r.GorevAdi))
                    .Select(r => new {
                        Departman = r.Departman.Trim(),
                        GorevAdi = r.GorevAdi.Trim()
                    }).ToList();

                if (!validData.Any()) return ServiceResponse<bool>.FailureResult("Aktarılacak geçerli veri bulunamadı.");

                // 1. Master Departmanları ve Master Görevleri Çek/Oluştur
                var uniqueGorevler = validData.Select(x => x.GorevAdi).Distinct().ToList();
                var uniqueDepartmanlar = validData.Select(x => x.Departman).Distinct().ToList();

                var existingGorevler = await _context.MasterGorevler.ToListAsync();
                foreach (var g in uniqueGorevler)
                {
                    if (!existingGorevler.Any(e => e.MasterGorevAdi != null && e.MasterGorevAdi.Equals(g, StringComparison.OrdinalIgnoreCase)))
                    {
                        var newGorev = new MasterGorev { MasterGorevAdi = g };
                        _context.MasterGorevler.Add(newGorev);
                        existingGorevler.Add(newGorev);
                    }
                }

                var existingDept = await _context.MasterDepartmanlar.ToListAsync();
                foreach (var d in uniqueDepartmanlar)
                {
                    if (!existingDept.Any(e => e.MasterDepartmanAdi != null && e.MasterDepartmanAdi.Equals(d, StringComparison.OrdinalIgnoreCase)))
                    {
                        var newDept = new MasterDepartman { MasterDepartmanAdi = d };
                        _context.MasterDepartmanlar.Add(newDept);
                        existingDept.Add(newDept);
                    }
                }
                await _context.SaveChangesAsync();

                // 2. Gorev Tablosuna İlişkileri Ekle
                var existingGorevAtamalari = await _context.Gorevler.ToListAsync();

                foreach (var data in validData)
                {
                    var masterDeptId = existingDept.First(d => d.MasterDepartmanAdi != null && d.MasterDepartmanAdi.Equals(data.Departman, StringComparison.OrdinalIgnoreCase)).Id;
                    var masterGorevId = existingGorevler.First(g => g.MasterGorevAdi != null && g.MasterGorevAdi.Equals(data.GorevAdi, StringComparison.OrdinalIgnoreCase)).Id;

                    if (!existingGorevAtamalari.Any(ga => ga.MasterDepartmanId == masterDeptId && ga.MasterGorevId == masterGorevId))
                    {
                        var newGa = new Gorev
                        {
                            MasterDepartmanId = masterDeptId,
                            MasterGorevId = masterGorevId
                        };
                        _context.Gorevler.Add(newGa);
                        existingGorevAtamalari.Add(newGa);
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return ServiceResponse<bool>.SuccessResult(true, "Görev verileri başarıyla aktarıldı.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return ServiceResponse<bool>.FailureResult($"İçe aktarım hatası: {ex.Message}");
            }
        }
    }
}