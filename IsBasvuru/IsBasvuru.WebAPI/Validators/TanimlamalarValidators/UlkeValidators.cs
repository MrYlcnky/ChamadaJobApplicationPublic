using FluentValidation;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.UlkeDtos;

namespace IsBasvuru.WebAPI.Validators.TanimlamalarValidators
{
    public class UlkeCreateValidator : AbstractValidator<UlkeCreateDto>
    {
        public UlkeCreateValidator()
        {
            // DTO'da "UlkeAdi" olduğu için burası güncellendi
            RuleFor(x => x.UlkeAdi)
                .NotEmpty().WithMessage("Ülke adı boş geçilemez.")
                .MaximumLength(100).WithMessage("Ülke adı en fazla 100 karakter olabilir.");
        }
    }

    public class UlkeUpdateValidator : AbstractValidator<UlkeUpdateDto>
    {
        public UlkeUpdateValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Geçersiz ID değeri.");

            RuleFor(x => x.UlkeAdi)
                .NotEmpty().WithMessage("Ülke adı boş geçilemez.")
                .MaximumLength(100).WithMessage("Ülke adı en fazla 100 karakter olabilir.");
        }
    }
}