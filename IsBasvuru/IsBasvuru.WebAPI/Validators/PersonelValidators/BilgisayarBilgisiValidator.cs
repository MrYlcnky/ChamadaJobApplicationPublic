using FluentValidation;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.BilgisayarBilgisiDtos;

namespace IsBasvuru.WebAPI.Validators.PersonelValidators
{
    public class BilgisayarBilgisiValidator : AbstractValidator<BilgisayarBilgisiCreateDto>
    {
        public BilgisayarBilgisiValidator()
        {
            RuleFor(x => x.ProgramAdi)
                .NotEmpty().WithMessage("Program/Yazılım adı zorunludur.")
                .MaximumLength(100).WithMessage("Program adı en fazla 100 karakter olabilir.");

            RuleFor(x => x.Yetkinlik)
                .IsInEnum().WithMessage("Lütfen geçerli bir yetkinlik seviyesi seçiniz.");
        }
    }
}