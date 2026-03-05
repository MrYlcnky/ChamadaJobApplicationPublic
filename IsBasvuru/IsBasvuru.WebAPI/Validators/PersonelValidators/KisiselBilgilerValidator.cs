using FluentValidation;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.KisiselBilgilerDtos;

namespace IsBasvuru.WebAPI.Validators.PersonelValidators
{
    public class KisiselBilgilerValidator : AbstractValidator<KisiselBilgilerDto>
    {
        private const string TextOnlyTrRegex = @"^[a-zA-ZığüşöçİĞÜŞÖÇ\s]+$";


        private const string PhoneRegex = @"^\+?[1-9](?:[\s]?\d){6,14}$";

        public KisiselBilgilerValidator()
        {
            // --- Ad & Soyad ---
            RuleFor(x => x.Ad)
                .NotEmpty().WithMessage("Ad alanı zorunludur.")
                .Length(1, 30).WithMessage("Ad alanı en fazla 30 karakter olabilir.") // Frontend max:30
                .Matches(TextOnlyTrRegex).WithMessage("Ad alanında sadece harf kullanılabilir.");

            RuleFor(x => x.Soyadi)
                .NotEmpty().WithMessage("Soyad alanı zorunludur.")
                .Length(1, 30).WithMessage("Soyad alanı en fazla 30 karakter olabilir.")
                .Matches(TextOnlyTrRegex).WithMessage("Soyad alanında sadece harf kullanılabilir.");

            // --- İletişim ---
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("E-posta adresi zorunludur.")
                .EmailAddress().WithMessage("Lütfen geçerli bir e-posta adresi giriniz.");

            RuleFor(x => x.Telefon)
                .NotEmpty().WithMessage("Telefon numarası zorunludur.")
                .Matches(PhoneRegex).WithMessage("Geçersiz telefon formatı. (Örn: 5551234567)");

            RuleFor(x => x.TelefonWhatsapp)
                .NotEmpty().WithMessage("WhatsApp numarası zorunludur.")
                .Matches(PhoneRegex).WithMessage("Geçersiz WhatsApp numarası formatı.");

            RuleFor(x => x.Adres)
                .NotEmpty().WithMessage("Adres alanı zorunludur.")
                .Length(5, 90).WithMessage("Adres en az 5, en fazla 90 karakter olmalıdır."); // Frontend min:5 max:90

            // --- Demografik Bilgiler ---
            RuleFor(x => x.DogumTarihi)
                .NotEmpty().WithMessage("Doğum tarihi zorunludur.")
                .LessThan(DateTime.Now.AddYears(-18)).WithMessage("Personel 18 yaşından küçük olamaz.");

            RuleFor(x => x.Cinsiyet)
                .IsInEnum().WithMessage("Lütfen geçerli bir cinsiyet seçiniz.");

            RuleFor(x => x.MedeniDurum)
                .IsInEnum().WithMessage("Lütfen geçerli bir medeni durum seçiniz.");

            RuleFor(x => x.CocukSayisi)
                .GreaterThanOrEqualTo(0).When(x => x.CocukSayisi.HasValue)
                .WithMessage("Çocuk sayısı 0'dan küçük olamaz.");

            // Kural: Ya ID > 0 olmalı YA DA Ad dolu olmalı.

            // 1. Doğum Yeri
            RuleFor(x => x)
                .Must(x => (x.DogumUlkeId.HasValue && x.DogumUlkeId > 0) || !string.IsNullOrEmpty(x.DogumUlkeAdi))
                .WithMessage("Doğum Ülkesi seçilmeli veya yazılmalıdır.");

            RuleFor(x => x)
                .Must(x => (x.DogumSehirId.HasValue && x.DogumSehirId > 0) || !string.IsNullOrEmpty(x.DogumSehirAdi))
                .WithMessage("Doğum Şehri seçilmeli veya yazılmalıdır.");

            // 2. İkametgah
            RuleFor(x => x)
                .Must(x => (x.IkametgahUlkeId.HasValue && x.IkametgahUlkeId > 0) || !string.IsNullOrEmpty(x.IkametgahUlkeAdi))
                .WithMessage("İkamet Ülkesi seçilmeli veya yazılmalıdır.");

            RuleFor(x => x)
                .Must(x => (x.IkametgahSehirId.HasValue && x.IkametgahSehirId > 0) || !string.IsNullOrEmpty(x.IkametgahSehirAdi))
                .WithMessage("İkamet Şehri seçilmeli veya yazılmalıdır.");

            // 3. Uyruk
            RuleFor(x => x)
                .Must(x => (x.UyrukId.HasValue && x.UyrukId > 0) || !string.IsNullOrEmpty(x.UyrukAdi))
                .WithMessage("Uyruk seçilmeli veya yazılmalıdır.");
        }
    }
}
