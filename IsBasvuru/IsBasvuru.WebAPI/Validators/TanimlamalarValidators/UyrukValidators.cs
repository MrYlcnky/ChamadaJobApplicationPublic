using FluentValidation;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.UyrukDtos;

namespace IsBasvuru.WebAPI.Validators.TanimlamalarValidators
{
    public class UyrukCreateValidator : AbstractValidator<UyrukCreateDto>
    {
        public UyrukCreateValidator()
        {
            RuleFor(x => x.UyrukAdi).NotEmpty().WithMessage("Uyruk adı zorunludur.");

            
            RuleFor(x => x.UlkeId).GreaterThan(0).WithMessage("Geçerli bir Ülke seçilmelidir.");
        }
    }

    public class UyrukUpdateValidator : AbstractValidator<UyrukUpdateDto>
    {
        public UyrukUpdateValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Geçersiz ID.");
            RuleFor(x => x.UyrukAdi).NotEmpty().WithMessage("Uyruk adı zorunludur.");

            RuleFor(x => x.UlkeId).GreaterThan(0).WithMessage("Geçerli bir Ülke seçilmelidir.");
        }
    }
}