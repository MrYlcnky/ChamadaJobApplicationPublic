using FluentValidation;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.IsDeneyimiDtos;

namespace IsBasvuru.WebAPI.Validators.PersonelValidators
{
    public class IsDeneyimiValidator : AbstractValidator<IsDeneyimiCreateDto>
    {
        public IsDeneyimiValidator()
        {
            // --- Şirket ve Pozisyon Bilgileri ---
            RuleFor(x => x.SirketAdi)
                .NotEmpty().WithMessage("Şirket adı zorunludur.")
                .MaximumLength(150).WithMessage("Şirket adı en fazla 150 karakter olabilir.");

            RuleFor(x => x.Departman)
                .NotEmpty().WithMessage("Departman bilgisi zorunludur.")
                .MaximumLength(100).WithMessage("Departman adı en fazla 100 karakter olabilir.");

            RuleFor(x => x.Pozisyon)
                .NotEmpty().WithMessage("Pozisyon bilgisi zorunludur.")
                .MaximumLength(100).WithMessage("Pozisyon adı en fazla 100 karakter olabilir.");

            RuleFor(x => x.Gorev)
                .MaximumLength(250).WithMessage("Görev tanımı en fazla 250 karakter olabilir.");

            RuleFor(x => x.Ucret)
                .GreaterThanOrEqualTo(0).WithMessage("Ücret negatif olamaz.");


            // --- Tarih Kontrolleri  ---
            RuleFor(x => x.BaslangicTarihi)
                .NotEmpty().WithMessage("İşe giriş tarihi zorunludur.")
                .LessThanOrEqualTo(DateTime.Now).WithMessage("Giriş tarihi bugünden ileri olamaz.");

            // 1. Mantık: Bitiş Tarihi Girildiyse, Başlangıçtan Sonra Olmalı
            RuleFor(x => x.BitisTarihi)
                .GreaterThan(x => x.BaslangicTarihi)
                .When(x => x.BitisTarihi.HasValue)
                .WithMessage("İşten çıkış tarihi, giriş tarihinden önce olamaz.");


            // 3. Mantık: Gelecek tarihli çıkış olamaz (Genel kural)
            RuleFor(x => x.BitisTarihi)
                .LessThanOrEqualTo(DateTime.Now)
                .When(x => x.BitisTarihi.HasValue)
                .WithMessage("Çıkış tarihi bugünden ileri olamaz.");


        

            RuleFor(x => x)
                .Must(x => (x.UlkeId.HasValue && x.UlkeId > 0) || !string.IsNullOrEmpty(x.UlkeAdi))
                .WithMessage("Çalışılan Ülke seçilmeli veya yazılmalıdır.");

            RuleFor(x => x)
                .Must(x => (x.SehirId.HasValue && x.SehirId > 0) || !string.IsNullOrEmpty(x.SehirAdi))
                .WithMessage("Çalışılan Şehir seçilmeli veya yazılmalıdır.");
        }
    }
}