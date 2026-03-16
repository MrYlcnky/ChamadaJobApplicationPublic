using FluentValidation;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.KisiselBilgilerDtos;
using IsBasvuru.Domain.DTOs.PersonelDtos;
using IsBasvuru.Domain.Enums;

namespace IsBasvuru.WebAPI.Validators.PersonelValidators
{
    public class PersonelCreateValidator : AbstractValidator<PersonelCreateDto>
    {
        public PersonelCreateValidator()
        {
            // 1. Organizasyon ve Şirket Yapısı Kontrolleri 

            RuleFor(x => x.SubeIds)
              .NotNull().WithMessage("Şube seçimi zorunludur.")
              .NotEmpty().WithMessage("Şube seçimi zorunludur.");

            RuleFor(x => x.DepartmanIds)
                .NotNull().WithMessage("Departman seçimi zorunludur.")
                .NotEmpty().WithMessage("Departman seçimi zorunludur.");

            RuleFor(x => x.DepartmanPozisyonIds)
                .NotNull().WithMessage("Pozisyon seçimi zorunludur.")
                .NotEmpty().WithMessage("Pozisyon seçimi zorunludur.");

            RuleFor(x => x.SubeAlanIds)
                .NotNull().WithMessage("Alan seçimi zorunludur.")
                .NotEmpty().WithMessage("Alan seçimi zorunludur.");




            RuleForEach(x => x.SubeIds)
                .GreaterThan(0).WithMessage("Geçersiz Şube seçimi.");
            RuleForEach(x => x.SubeAlanIds)
                .GreaterThan(0).WithMessage("Geçersiz Alan seçimi.");
            RuleForEach(x => x.DepartmanIds)
                .GreaterThan(0).WithMessage("Geçersiz Departman seçimi.");
            RuleForEach(x => x.DepartmanPozisyonIds)
                .GreaterThan(0).WithMessage("Geçersiz Pozisyon seçimi.");
            RuleForEach(x => x.ProgramIds)
     .GreaterThan(0).WithMessage("Geçersiz Program seçimi.")
     .When(x => x.ProgramIds != null && x.ProgramIds.Any());

            RuleForEach(x => x.OyunIds)
                .GreaterThan(0).WithMessage("Geçersiz Oyun seçimi.")
                .When(x => x.OyunIds != null && x.OyunIds.Any());

            // 2. Kişisel Bilgiler Validasyonu 

            RuleFor(x => x.KisiselBilgiler)
                .NotNull().WithMessage("Kişisel bilgiler eksik.")
                .SetValidator(new KisiselBilgilerValidator());

            RuleFor(x => x.DigerKisiselBilgiler)
                .NotNull().WithMessage("Diğer kişisel bilgiler eksik.")
                .SetValidator(new DigerKisiselBilgilerValidator());

            RuleFor(x => x.PersonelEhliyetler)
           .NotEmpty()
           .When(x => x.DigerKisiselBilgiler != null && x.DigerKisiselBilgiler.EhliyetDurumu == SecimDurumu.EVET)
           .WithMessage("Ehliyet durumu 'Evet' ise en az bir ehliyet seçmelisiniz.");


            RuleForEach(x => x.EgitimBilgileri).SetValidator(new EgitimBilgisiValidator());
            RuleForEach(x => x.IsDeneyimleri).SetValidator(new IsDeneyimiValidator());
            RuleForEach(x => x.YabanciDilBilgileri).SetValidator(new YabanciDilBilgisiValidator());
            RuleForEach(x => x.SertifikaBilgileri).SetValidator(new SertifikaBilgisiValidator());
            RuleForEach(x => x.ReferansBilgileri).SetValidator(new ReferansBilgisiValidator());
            RuleForEach(x => x.BilgisayarBilgileri).SetValidator(new BilgisayarBilgisiValidator());


            // Foto
            RuleFor(x => x.VesikalikDosyasi)
                .NotNull().WithMessage("Lütfen bir vesikalık fotoğraf yükleyiniz.")
                .Must(x => x != null && x.Length > 0).WithMessage("Dosya içeriği boş olamaz.");

            RuleFor(x => x.NedenBiz)
            .NotEmpty().WithMessage("Neden bizle çalışmak istediğinizi belirtiniz.")
            .MaximumLength(1000).WithMessage("Açıklama çok uzun.");

            RuleFor(x => x.LojmanTalebi)
                .IsInEnum().WithMessage("Geçersiz lojman talebi seçimi.");


        }
    }
}