using FluentValidation;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.SertifikaBilgisiDtos;

namespace IsBasvuru.WebAPI.Validators.PersonelValidators
{
    public class SertifikaBilgisiValidator : AbstractValidator<SertifikaBilgisiCreateDto>
    {
        public SertifikaBilgisiValidator()
        {
            RuleFor(x => x.SertifikaAdi)
                .NotEmpty().WithMessage("Sertifika adı zorunludur.")
                .MaximumLength(150).WithMessage("Sertifika adı en fazla 150 karakter olabilir.");

            RuleFor(x => x.KurumAdi)
                .NotEmpty().WithMessage("Kurum adı zorunludur.")
                .MaximumLength(150).WithMessage("Kurum adı en fazla 150 karakter olabilir.");

        
            RuleFor(x => x.Suresi)
                .NotEmpty().WithMessage("Geçerlilik süresi bilgisi zorunludur.")
                .MaximumLength(50).WithMessage("Süre bilgisi en fazla 50 karakter olabilir.");

            // --- Tarih Kontrolleri  ---
            RuleFor(x => x.VerilisTarihi)
                .NotEmpty().WithMessage("Veriliş tarihi zorunludur.")
                .LessThanOrEqualTo(DateTime.Now).WithMessage("Veriliş tarihi bugünden ileri olamaz.");

            RuleFor(x => x.GecerlilikTarihi)
                .GreaterThan(x => x.VerilisTarihi)
                .When(x => x.GecerlilikTarihi.HasValue)
                .WithMessage("Geçerlilik tarihi veriliş tarihinden sonra olmalıdır.");
        }
    }
}