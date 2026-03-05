using FluentValidation;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.DigerKisiselBilgilerDtos;
using IsBasvuru.Domain.Enums;

namespace IsBasvuru.WebAPI.Validators.PersonelValidators
{
    public class DigerKisiselBilgilerValidator : AbstractValidator<DigerKisiselBilgilerCreateDto>
    {
        public DigerKisiselBilgilerValidator()
        {
            RuleFor(x => x.KktcBelgeId)
                .GreaterThan(0).WithMessage("KKTC Belge türü seçimi zorunludur.");

            

            // 1. Dava Durumu "Var" (veya ilgili Enum değeri) ise Açıklama Zorunlu
            RuleFor(x => x.DavaDurumu).IsInEnum();

            RuleFor(x => x.DavaNedeni)
                .NotEmpty()
                .When(x => x.DavaDurumu == SecimDurumu.EVET) // Enum ismine göre düzenle (Var/Evet vb.)
                .WithMessage("Dava durumu 'Var' olarak işaretlendiği için nedenini belirtmelisiniz.");

            // 2. Kalıcı Rahatsızlık "Var" ise Açıklama Zorunlu
            RuleFor(x => x.KaliciRahatsizlik).IsInEnum();

            RuleFor(x => x.KaliciRahatsizlikAciklama)
                .NotEmpty()
                .When(x => x.KaliciRahatsizlik == SecimDurumu.EVET)
                .WithMessage("Rahatsızlık durumu belirtildiği için açıklama girmelisiniz.");


            // --- Diğer Enumlar ---
            RuleFor(x => x.SigaraKullanimi).IsInEnum();
            RuleFor(x => x.EhliyetDurumu).IsInEnum();
            RuleFor(x => x.AskerlikDurumu).IsInEnum();

            // --- Fiziksel Özellikler ---
            RuleFor(x => x.Boy)
                .InclusiveBetween(50, 250).WithMessage("Boy bilgisi 50 ile 250 cm arasında olmalıdır.");

            RuleFor(x => x.Kilo)
                .InclusiveBetween(20, 300).WithMessage("Kilo bilgisi 20 ile 200 kg arasında olmalıdır.");
        }
    }
}