using FluentValidation;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.SehirDtos;

namespace IsBasvuru.WebAPI.Validators.TanimlamalarValidators
{
    public class SehirCreateValidator : AbstractValidator<SehirCreateDto>
    {
        public SehirCreateValidator()
        {
            RuleFor(x => x.SehirAdi).NotEmpty().WithMessage("Şehir adı zorunludur.");
            RuleFor(x => x.UlkeId).GreaterThan(0).WithMessage("Geçerli bir Ülke seçilmelidir.");
        }
    }

    public class SehirUpdateValidator : AbstractValidator<SehirUpdateDto>
    {
        public SehirUpdateValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Geçersiz ID.");
            RuleFor(x => x.SehirAdi).NotEmpty().WithMessage("Şehir adı zorunludur.");
            RuleFor(x => x.UlkeId).GreaterThan(0).WithMessage("Geçerli bir Ülke seçilmelidir.");
        }
    }
}