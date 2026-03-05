using FluentValidation;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.YabanciDilBilgisiDtos;

namespace IsBasvuru.WebAPI.Validators.PersonelValidators
{
    public class YabanciDilBilgisiValidator : AbstractValidator<YabanciDilBilgisiCreateDto>
    {
        public YabanciDilBilgisiValidator()
        {

            RuleFor(x => x)
                .Must(x => (x.DilId != null && x.DilId > 0) || !string.IsNullOrWhiteSpace(x.DigerDilAdi))
                .WithMessage("Lütfen listeden bir dil seçiniz veya 'Diğer' alanına dil adını giriniz.");

            // --- SEVİYE KONTROLLERİ ---
            RuleFor(x => x.OkumaSeviyesi)
                .IsInEnum().WithMessage("Geçersiz okuma seviyesi.");

            RuleFor(x => x.YazmaSeviyesi)
                .IsInEnum().WithMessage("Geçersiz yazma seviyesi.");

            RuleFor(x => x.KonusmaSeviyesi)
                .IsInEnum().WithMessage("Geçersiz konuşma seviyesi.");

            RuleFor(x => x.DinlemeSeviyesi)
                .IsInEnum().WithMessage("Geçersiz dinleme seviyesi.");

            // --- METİN ALANLARI ---
            RuleFor(x => x.NasilOgrenildi)
                .NotEmpty().WithMessage("Dilin nasıl öğrenildiği bilgisini giriniz.")
                .MaximumLength(100).WithMessage("Bu alan en fazla 100 karakter olabilir.");
        }
    }
}