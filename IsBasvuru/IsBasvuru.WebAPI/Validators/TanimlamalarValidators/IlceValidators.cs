using FluentValidation;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.IlceDtos;

namespace IsBasvuru.WebAPI.Validators.TanimlamalarValidators
{
    public class IlceCreateValidator : AbstractValidator<IlceCreateDto>
    {
        public IlceCreateValidator()
        {
            RuleFor(x => x.IlceAdi).NotEmpty().WithMessage("İlçe adı zorunludur.");
            RuleFor(x => x.SehirId).GreaterThan(0).WithMessage("Geçerli bir Şehir seçilmelidir.");
        }
    }

    public class IlceUpdateValidator : AbstractValidator<IlceUpdateDto>
    {
        public IlceUpdateValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Geçersiz ID.");
            RuleFor(x => x.IlceAdi).NotEmpty().WithMessage("İlçe adı zorunludur.");
            RuleFor(x => x.SehirId).GreaterThan(0).WithMessage("Geçerli bir Şehir seçilmelidir.");
        }
    }
}