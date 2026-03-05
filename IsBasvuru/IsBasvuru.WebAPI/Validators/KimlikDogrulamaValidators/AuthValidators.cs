using FluentValidation;
using IsBasvuru.Domain.DTOs.KimlikDogrulamaDtos;

namespace IsBasvuru.WebAPI.Validators.KimlikDogrulamaValidators
{
    
    public class KodGonderValidator : AbstractValidator<KodGonderDto>
    {
        public KodGonderValidator()
        {
            RuleFor(x => x.Eposta)
                .NotEmpty().WithMessage("E-posta adresi boş geçilemez.")
                .EmailAddress().WithMessage("Lütfen geçerli bir e-posta adresi giriniz.");
        }
    }

   
    public class KodDogrulaValidator : AbstractValidator<KodDogrulaDto>
    {
        public KodDogrulaValidator()
        {
            RuleFor(x => x.Eposta)
                .NotEmpty().WithMessage("E-posta adresi boş geçilemez.")
                .EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.");

            RuleFor(x => x.Kod)
                .NotEmpty().WithMessage("Doğrulama kodu boş olamaz.")
                .Length(6).WithMessage("Doğrulama kodu 6 haneli olmalıdır.");
         
        }
    }
}