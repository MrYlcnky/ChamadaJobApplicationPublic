using FluentValidation;
using IsBasvuru.Domain.DTOs.AdminDtos.PanelKullaniciDtos;

namespace IsBasvuru.WebAPI.Validators.AdminValidators
{
    public class PanelKullaniciCreateValidator : AbstractValidator<PanelKullaniciCreateDto>
    {
        public PanelKullaniciCreateValidator()
        {
            RuleFor(x => x.KullaniciAdi)
                .NotEmpty().WithMessage("Kullanıcı adı zorunludur.")
                .MaximumLength(50).WithMessage("Kullanıcı adı en fazla 50 karakter olabilir.");

            RuleFor(x => x.Adi)
                .NotEmpty().WithMessage("Ad alanı zorunludur.")
                .MaximumLength(50);

            RuleFor(x => x.Soyadi)
                .NotEmpty().WithMessage("Soyad alanı zorunludur.")
                .MaximumLength(50);

            // Yeni kullanıcı oluştururken şifre ZORUNLUDUR
            RuleFor(x => x.KullaniciSifre)
                .NotEmpty().WithMessage("Şifre oluşturulması zorunludur.")
                .MinimumLength(3).WithMessage("Şifre en az 3 karakter olmalıdır.");

            RuleFor(x => x.RolId)
                .GreaterThan(0).WithMessage("Lütfen bir rol seçiniz.");

            RuleFor(x => x.SubeId)
                .GreaterThan(0).When(x => x.SubeId.HasValue)
                .WithMessage("Geçersiz şube seçimi.");
            RuleFor(x => x.MasterAlanId)
               .GreaterThan(0).When(x => x.MasterAlanId.HasValue)
               .WithMessage("Geçersiz alan seçimi.");

            RuleFor(x => x.MasterDepartmanId)
                .GreaterThan(0).When(x => x.MasterDepartmanId.HasValue)
                .WithMessage("Geçersiz departman seçimi.");
        }
    }

    public class PanelKullaniciUpdateValidator : AbstractValidator<PanelKullaniciUpdateDto>
    {
        public PanelKullaniciUpdateValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Geçersiz ID.");

            RuleFor(x => x.KullaniciAdi)
                .NotEmpty().WithMessage("Kullanıcı adı boş bırakılamaz.");

            RuleFor(x => x.Adi).NotEmpty().WithMessage("Ad alanı zorunludur.");
            RuleFor(x => x.Soyadi).NotEmpty().WithMessage("Soyad alanı zorunludur.");

            RuleFor(x => x.RolId).GreaterThan(0).WithMessage("Rol seçimi zorunludur.");

           
            RuleFor(x => x.SubeId)
                .GreaterThan(0).When(x => x.SubeId.HasValue)
                .WithMessage("Geçersiz şube seçimi.");

            RuleFor(x => x.MasterAlanId)
              .GreaterThan(0).When(x => x.MasterAlanId.HasValue)
              .WithMessage("Geçersiz alan seçimi.");

            RuleFor(x => x.MasterDepartmanId)
                .GreaterThan(0).When(x => x.MasterDepartmanId.HasValue)
                .WithMessage("Geçersiz departman seçimi.");

           
            // Sadece dolu gönderilirse (değiştirilmek istenirse) kural uygula.
            RuleFor(x => x.YeniKullaniciSifre)
                .MinimumLength(3)
                .When(x => !string.IsNullOrEmpty(x.YeniKullaniciSifre))
                .WithMessage("Yeni şifre en az 3 karakter olmalıdır.");
        }
    }
}