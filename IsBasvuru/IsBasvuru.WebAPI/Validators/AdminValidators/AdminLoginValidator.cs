using FluentValidation;
using IsBasvuru.Domain.DTOs.AdminDtos;

namespace IsBasvuru.WebAPI.Validators.AdminValidators
{
    public class AdminLoginValidator : AbstractValidator<AdminLoginDto>
    {
        public AdminLoginValidator()
        {
            RuleFor(x => x.KullaniciAdi)
                .NotEmpty().WithMessage("Kullanıcı adı giriniz.");

            RuleFor(x => x.KullaniciSifre)
                .NotEmpty().WithMessage("Şifre giriniz.");
        }
    }
}