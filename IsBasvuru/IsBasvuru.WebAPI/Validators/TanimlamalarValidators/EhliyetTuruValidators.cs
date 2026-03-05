using FluentValidation;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.EhliyetTuruDtos;

namespace IsBasvuru.WebAPI.Validators.TanimlamalarValidators
{
    public class EhliyetTuruCreateValidator : AbstractValidator<EhliyetTuruCreateDto>
    {
        public EhliyetTuruCreateValidator()
        {
            RuleFor(x => x.EhliyetTuruAdi).NotEmpty().WithMessage("Ehliyet türü adı boş geçilemez.");
        }
    }

    public class EhliyetTuruUpdateValidator : AbstractValidator<EhliyetTuruUpdateDto>
    {
        public EhliyetTuruUpdateValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Geçersiz ID.");
            RuleFor(x => x.EhliyetTuruAdi).NotEmpty().WithMessage("Ehliyet türü adı boş geçilemez.");
        }
    }
}