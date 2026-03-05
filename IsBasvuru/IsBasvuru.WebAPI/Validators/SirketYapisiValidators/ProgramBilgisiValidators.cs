using FluentValidation;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.ProgramBilgisiDtos;

namespace IsBasvuru.WebAPI.Validators.SirketYapisiValidators
{
    public class ProgramBilgisiCreateValidator : AbstractValidator<ProgramBilgisiCreateDto>
    {
        public ProgramBilgisiCreateValidator()
        {
            // Bir program mutlaka bir departmana bağlı olmalıdır
            RuleFor(x => x.DepartmanId).GreaterThan(0).WithMessage("Bağlı olunacak departman seçilmelidir.");

            RuleFor(x => x.ProgramAdi)
                .NotEmpty().WithMessage("Program adı boş geçilemez.")
                .MaximumLength(100).WithMessage("Program adı en fazla 100 karakter olabilir.");
        }
    }

    public class ProgramBilgisiUpdateValidator : AbstractValidator<ProgramBilgisiUpdateDto>
    {
        public ProgramBilgisiUpdateValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Geçersiz ID.");

            RuleFor(x => x.DepartmanId).GreaterThan(0).WithMessage("Bağlı olunacak departman seçilmelidir.");

            RuleFor(x => x.ProgramAdi)
                .NotEmpty().WithMessage("Program adı boş geçilemez.")
                .MaximumLength(100).WithMessage("Program adı en fazla 100 karakter olabilir.");
        }
    }
}