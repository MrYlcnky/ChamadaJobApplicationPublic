using FluentValidation;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.OyunBilgisiDtos;

namespace IsBasvuru.WebAPI.Validators.SirketYapisiValidators
{
    public class OyunBilgisiCreateValidator : AbstractValidator<OyunBilgisiCreateDto>
    {
        public OyunBilgisiCreateValidator()
        {
            RuleFor(x => x.OyunAdi)
                .NotEmpty().WithMessage("Oyun adı boş geçilemez.")
                .MaximumLength(100).WithMessage("Oyun adı en fazla 100 karakter olabilir.");
        }
    }

    public class OyunBilgisiUpdateValidator : AbstractValidator<OyunBilgisiUpdateDto>
    {
        public OyunBilgisiUpdateValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Geçersiz ID.");

            RuleFor(x => x.OyunAdi)
                .NotEmpty().WithMessage("Oyun adı boş geçilemez.")
                .MaximumLength(100).WithMessage("Oyun adı en fazla 100 karakter olabilir.");
        }
    }
}