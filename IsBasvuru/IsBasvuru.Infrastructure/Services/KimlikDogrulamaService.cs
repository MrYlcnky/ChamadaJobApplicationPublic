using IsBasvuru.Domain.DTOs.KimlikDogrulamaDtos;
using IsBasvuru.Domain.Entities.KimlikDogrulama;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.Domain.Wrappers;
using IsBasvuru.Infrastructure.Tools;
using IsBasvuru.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace IsBasvuru.Infrastructure.Services
{
    public class KimlikDogrulamaService : IKimlikDogrulamaService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMailService _mailService;
        private readonly JwtHelper _jwtHelper;

        public KimlikDogrulamaService(IsBasvuruContext context, IMailService mailService, IConfiguration configuration)
        {
            _context = context;
            _mailService = mailService;
            _jwtHelper = new JwtHelper(configuration);
        }

        public async Task<ServiceResponse<bool>> KodGonderAsync(KodGonderDto dto)
        {
            if (string.IsNullOrEmpty(dto.Eposta))
                return ServiceResponse<bool>.FailureResult("E-posta adresi zorunludur.");

            if (dto.KayitliKullaniciKontrolu)
            {
                bool basvuruVarMi = await _context.Personeller.AnyAsync(p => p.KisiselBilgiler!.Email == dto.Eposta);

                if (!basvuruVarMi)
                {
                    return ServiceResponse<bool>.FailureResult("Bu e-posta adresine ait sistemimizde herhangi bir başvuru bulunmamaktadır.");
                }
            }

            // Güvenli Kod Üretimi
            int secureNumber = RandomNumberGenerator.GetInt32(100000, 1000000);
            string uretilenKod = secureNumber.ToString();

            var dogrulamaKaydi = new DogrulamaKodu
            {
                Eposta = dto.Eposta,
                Kod = uretilenKod,
                GecerlilikTarihi = DateTime.Now.AddMinutes(3),
                KullanildiMi = false
            };

            await _context.DogrulamaKodlari.AddAsync(dogrulamaKaydi);
            await _context.SaveChangesAsync();

            // Mail Gönderimi (Hata yakalama eklenebilir)
            try
            {
                await _mailService.DogrulamaKoduGonderAsync(dto.Eposta, uretilenKod);
            }
            catch (Exception ex)
            {
                return ServiceResponse<bool>.FailureResult($"Kod üretildi ancak mail gönderilemedi: {ex.Message}");
            }

            return ServiceResponse<bool>.SuccessResult(true, "Doğrulama kodu e-posta adresinize gönderildi.");
        }

        public async Task<ServiceResponse<AuthResponseDto>> KodDogrulaAsync(KodDogrulaDto dto)
        {
            var kayit = await _context.DogrulamaKodlari
                .OrderByDescending(x => x.Id)
                .FirstOrDefaultAsync(x => x.Eposta == dto.Eposta && x.Kod == dto.Kod && !x.KullanildiMi);

            if (kayit == null)
                return ServiceResponse<AuthResponseDto>.FailureResult("Geçersiz veya kullanılmış kod.");

            if (kayit.GecerlilikTarihi < DateTime.Now)
                return ServiceResponse<AuthResponseDto>.FailureResult("Kodun süresi dolmuş. Lütfen tekrar kod isteyin.");

            // Kod doğru -> Kullanıldı işaretle
            kayit.KullanildiMi = true;
            await _context.SaveChangesAsync();

            // Token Üret
            string token = _jwtHelper.BasvuruTokenUret(dto.Eposta);

            return ServiceResponse<AuthResponseDto>.SuccessResult(new AuthResponseDto
            {
                Token = token,
                Eposta = dto.Eposta
            }, "Doğrulama başarılı.");
        }
    }
}