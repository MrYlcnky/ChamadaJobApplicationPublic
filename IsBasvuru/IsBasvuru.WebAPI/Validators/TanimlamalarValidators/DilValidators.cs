using FluentValidation;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.DilDtos;

namespace IsBasvuru.WebAPI.Validators.TanimlamalarValidators
{
    public class DilCreateValidator : AbstractValidator<DilCreateDto>
    {
        public DilCreateValidator()
        {
            RuleFor(x => x.DilAdi).NotEmpty().WithMessage("Dil adı boş geçilemez.");
        }
    }

    public class DilUpdateValidator : AbstractValidator<DilUpdateDto>
    {
        public DilUpdateValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Geçersiz ID.");
            RuleFor(x => x.DilAdi).NotEmpty().WithMessage("Dil adı boş geçilemez.");
        }
    }
}