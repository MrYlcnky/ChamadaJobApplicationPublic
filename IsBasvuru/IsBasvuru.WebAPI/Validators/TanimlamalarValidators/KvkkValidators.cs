using FluentValidation;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.KvkkDtos;

namespace IsBasvuru.WebAPI.Validators.TanimlamalarValidators
{
    public class KvkkCreateValidator : AbstractValidator<KvkkCreateDto>
    {
        public KvkkCreateValidator()
        {
           
            RuleFor(x => x.KvkkAciklamaTr).NotEmpty().WithMessage("KVKK açıklama metni zorunludur.");
            RuleFor(x => x.DogrulukAciklamaTr).NotEmpty().WithMessage("Doğruluk beyanı metni zorunludur.");
            RuleFor(x => x.ReferansAciklamaTr).NotEmpty().WithMessage("Referans açıklama metni zorunludur.");
            RuleFor(x => x.KvkkAciklamaEn).NotEmpty().WithMessage("KVKK açıklama metni zorunludur.");
            RuleFor(x => x.DogrulukAciklamaEn).NotEmpty().WithMessage("Doğruluk beyanı metni zorunludur.");
            RuleFor(x => x.ReferansAciklamaEn).NotEmpty().WithMessage("Referans açıklama metni zorunludur.");
        }
    }

    public class KvkkUpdateValidator : AbstractValidator<KvkkUpdateDto>
    {
        public KvkkUpdateValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Geçersiz ID.");
            RuleFor(x => x.KvkkAciklamaTr).NotEmpty().WithMessage("KVKK açıklama metni zorunludur.");
            RuleFor(x => x.DogrulukAciklamaTr).NotEmpty().WithMessage("Doğruluk beyanı metni zorunludur.");
            RuleFor(x => x.ReferansAciklamaTr).NotEmpty().WithMessage("Referans açıklama metni zorunludur.");
            RuleFor(x => x.KvkkAciklamaEn).NotEmpty().WithMessage("KVKK açıklama metni zorunludur.");
            RuleFor(x => x.DogrulukAciklamaEn).NotEmpty().WithMessage("Doğruluk beyanı metni zorunludur.");
            RuleFor(x => x.ReferansAciklamaEn).NotEmpty().WithMessage("Referans açıklama metni zorunludur.");
        }
    }
}