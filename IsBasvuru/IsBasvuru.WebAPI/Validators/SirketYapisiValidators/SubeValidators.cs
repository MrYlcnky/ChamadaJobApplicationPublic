using FluentValidation;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.SubeDtos;

namespace IsBasvuru.WebAPI.Validators.SirketYapisiValidators
{
    public class SubeCreateValidator : AbstractValidator<SubeCreateDto>
    {
        public SubeCreateValidator()
        {
            RuleFor(x => x.SubeAdi)
                .NotEmpty().WithMessage("Şube adı boş geçilemez.")
                .MaximumLength(100).WithMessage("Şube adı en fazla 100 karakter olabilir.");

            // Eğer DTO'nuzda "SubeKodu" gibi başka zorunlu alanlar varsa buraya ekleyebiliriz.
        }
    }

    public class SubeUpdateValidator : AbstractValidator<SubeUpdateDto>
    {
        public SubeUpdateValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Geçersiz ID değeri.");

            RuleFor(x => x.SubeAdi)
                .NotEmpty().WithMessage("Şube adı boş geçilemez.")
                .MaximumLength(100).WithMessage("Şube adı en fazla 100 karakter olabilir.");
        }
    }
}