using FluentValidation;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.EgitimBilgisiDtos;
using IsBasvuru.Domain.Enums;

namespace IsBasvuru.WebAPI.Validators.PersonelValidators
{
    public class EgitimBilgisiValidator : AbstractValidator<EgitimBilgisiCreateDto>
    {
        public EgitimBilgisiValidator()
        {
            // --- Temel Bilgiler ---
            RuleFor(x => x.EgitimSeviyesi)
                .IsInEnum().WithMessage("Lütfen geçerli bir eğitim seviyesi seçiniz.");

            RuleFor(x => x.OkulAdi)
                .NotEmpty().WithMessage("Okul adı boş bırakılamaz.")
                .MaximumLength(100).WithMessage("Okul adı en fazla 100 karakter olabilir.");

            RuleFor(x => x.Bolum)
                .NotEmpty().WithMessage("Bölüm adı boş bırakılamaz.")
                .MaximumLength(100).WithMessage("Bölüm adı en fazla 100 karakter olabilir.");

            // --- Tarih Kontrolleri  ---
            RuleFor(x => x.BaslangicTarihi)
                .NotEmpty().WithMessage("Başlangıç tarihi zorunludur.");

            // Bitiş Tarihi Validasyonu
            // 1. Durum: MEZUN veya ARA VERDİ ise -> Bitiş Tarihi ZORUNLU
            When(x => x.DiplomaDurum == DiplomaDurum.Mezun || x.DiplomaDurum == DiplomaDurum.AraVerdi, () =>
            {
                RuleFor(x => x.BitisTarihi)
                    .NotEmpty()
                    .WithMessage(x => x.DiplomaDurum == DiplomaDurum.Mezun
                        ? "Mezun olduğunuz için mezuniyet tarihini girmelisiniz."
                        : "Okula ara verdiğiniz tarihi girmelisiniz.");

                RuleFor(x => x.BitisTarihi)
                    .GreaterThan(x => x.BaslangicTarihi)
                    .When(x => x.BitisTarihi.HasValue)
                    .WithMessage("Bitiş tarihi başlangıç tarihinden sonra olmalıdır.");
            });

            // 2. Durum: DEVAM EDİYOR veya TERK ise -> Bitiş Tarihi ZORUNLU DEĞİL (Opsiyonel)
            
            When(x => x.DiplomaDurum == DiplomaDurum.DevamEdiyor || x.DiplomaDurum == DiplomaDurum.Terk, () =>
            {
                RuleFor(x => x.BitisTarihi)
                    .GreaterThan(x => x.BaslangicTarihi)
                    .When(x => x.BitisTarihi.HasValue)
                    .WithMessage("Ayrılma tarihi başlangıç tarihinden sonra olmalıdır.");
            });

            // --- Not Sistemi ve Ortalama ---
            RuleFor(x => x.NotSistemi)
                .IsInEnum()
                .WithMessage("Geçersiz not sistemi.");

            // GANO Kontrolü (Gano nullable olduğu için HasValue kullanılabilir)
            RuleFor(x => x.Gano)
                .GreaterThanOrEqualTo(0).When(x => x.Gano.HasValue)
                .WithMessage("Diploma notu 0'dan küçük olamaz.");

            // 4'lük Sistem Kontrolü
            RuleFor(x => x.Gano)
                .LessThanOrEqualTo(4)
                .When(x => x.NotSistemi.ToString() == "Dortluk" && x.Gano.HasValue)
                .WithMessage("4'lük sistemde not 4'ten büyük olamaz.");

            // 100'lük Sistem Kontrolü
            RuleFor(x => x.Gano)
                .LessThanOrEqualTo(100)
                .When(x => x.NotSistemi.ToString() == "Yuzluk" && x.Gano.HasValue)
                .WithMessage("100'lük sistemde not 100'den büyük olamaz.");
        }
    }
}