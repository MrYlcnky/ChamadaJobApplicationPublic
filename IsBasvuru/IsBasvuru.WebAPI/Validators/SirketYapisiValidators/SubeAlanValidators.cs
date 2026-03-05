using FluentValidation;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.SubeAlanDtos;

namespace IsBasvuru.WebAPI.Validators.SirketYapisiValidators
{
    public class SubeAlanCreateValidator : AbstractValidator<SubeAlanCreateDto>
    {
        public SubeAlanCreateValidator()
        {
            RuleFor(x => x.SubeId)
                .GreaterThan(0).WithMessage("Bağlı olunacak şube seçilmelidir.");

            RuleFor(x => x.MasterAlanId)
                .GreaterThan(0).WithMessage("Lütfen listeden bir alan seçiniz.");
        }
    }

    public class SubeAlanUpdateValidator : AbstractValidator<SubeAlanUpdateDto>
    {
        public SubeAlanUpdateValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Geçersiz ID.");

            RuleFor(x => x.SubeId)
                .GreaterThan(0).WithMessage("Bağlı olunacak şube seçilmelidir.");

            
            RuleFor(x => x.MasterAlanId)
                .GreaterThan(0).WithMessage("Lütfen listeden bir alan seçiniz.");
        }
    }
}