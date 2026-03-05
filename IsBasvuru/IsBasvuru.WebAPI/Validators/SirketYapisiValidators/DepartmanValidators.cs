using FluentValidation;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.DepartmanDtos;

namespace IsBasvuru.WebAPI.Validators.SirketYapisiValidators
{
    public class DepartmanCreateValidator : AbstractValidator<DepartmanCreateDto>
    {
        public DepartmanCreateValidator()
        {
            // Bir departman mutlaka bir Şube Alanına (Ofise) bağlı olmalıdır
            RuleFor(x => x.SubeAlanId)
                .GreaterThan(0).WithMessage("Bağlı olunacak ofis/alan seçilmelidir.");

            RuleFor(x => x.MasterDepartmanId)
                .GreaterThan(0).WithMessage("Lütfen listeden bir departman seçiniz.");
        }
    }

    public class DepartmanUpdateValidator : AbstractValidator<DepartmanUpdateDto>
    {
        public DepartmanUpdateValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Geçersiz ID.");

            RuleFor(x => x.SubeAlanId)
                .GreaterThan(0).WithMessage("Bağlı olunacak ofis/alan seçilmelidir.");

            RuleFor(x => x.MasterDepartmanId)
                .GreaterThan(0).WithMessage("Lütfen listeden bir departman seçiniz.");
        }
    }
}