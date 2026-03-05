using FluentValidation;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.ReferansBilgisiDtos;

namespace IsBasvuru.WebAPI.Validators.PersonelValidators
{
    public class ReferansBilgisiValidator : AbstractValidator<ReferansBilgisiCreateDto>
    {
        // İsim kontrolü için sadece harf (Regex)
        private const string TextOnlyTrRegex = @"^[a-zA-ZığüşöçİĞÜŞÖÇ\s]+$";
        private const string PhoneRegex = @"^\+?[1-9](?:[\s]?\d){6,14}$";

        public ReferansBilgisiValidator()
        {
            RuleFor(x => x.CalistigiKurum)
                .IsInEnum().WithMessage("Lütfen geçerli bir kurum türü seçiniz.");

            RuleFor(x => x.ReferansAdi)
                .NotEmpty().WithMessage("Referans adı zorunludur.")
                .Matches(TextOnlyTrRegex).WithMessage("Referans adı sadece harflerden oluşmalıdır.");

            RuleFor(x => x.ReferansSoyadi)
                .NotEmpty().WithMessage("Referans soyadı zorunludur.")
                .Matches(TextOnlyTrRegex).WithMessage("Referans soyadı sadece harflerden oluşmalıdır.");

            RuleFor(x => x.ReferansTelefon)
                .NotEmpty().WithMessage("Referans telefonu zorunludur.")
                .Matches(PhoneRegex).WithMessage("Geçersiz telefon formatı.");

            RuleFor(x => x.IsYeri)
                .NotEmpty().WithMessage("Çalıştığı yer zorunludur.")
                .MaximumLength(150);

            RuleFor(x => x.Gorev)
                .NotEmpty().WithMessage("Görevi zorunludur.")
                .MaximumLength(100);
        }
    }
}