using FluentValidation;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.KktcBelgeDtos;

namespace IsBasvuru.WebAPI.Validators.TanimlamalarValidators
{
    public class KktcBelgeCreateValidator : AbstractValidator<KktcBelgeCreateDto>
    {
        public KktcBelgeCreateValidator()
        {
            RuleFor(x => x.BelgeAdi).NotEmpty().WithMessage("Belge adı boş geçilemez.");
        }
    }

    public class KktcBelgeUpdateValidator : AbstractValidator<KktcBelgeUpdateDto>
    {
        public KktcBelgeUpdateValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Geçersiz ID.");
            RuleFor(x => x.BelgeAdi).NotEmpty().WithMessage("Belge adı boş geçilemez.");
        }
    }
}