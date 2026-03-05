using FluentValidation;
using IsBasvuru.Domain.DTOs.MasterBasvuruDtos;

namespace IsBasvuru.WebAPI.Validators.MasterBasvuruValidators
{
    public class MasterBasvuruCreateValidator : AbstractValidator<MasterBasvuruCreateDto>
    {
        public MasterBasvuruCreateValidator()
        {

            RuleFor(x => x.PersonelId).GreaterThan(0).WithMessage("Geçerli bir personel seçilmelidir.");
        }
    }

    public class MasterBasvuruUpdateValidator : AbstractValidator<MasterBasvuruUpdateDto>
    {
        public MasterBasvuruUpdateValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Geçersiz Başvuru ID.");
            RuleFor(x => x.PersonelId).GreaterThan(0).WithMessage("Geçerli bir personel seçilmelidir.");

            // Update işleminde statü değişikliği yapılabildiği için burada kontrol şart
            RuleFor(x => x.BasvuruDurum).IsInEnum().WithMessage("Geçersiz başvuru durumu.");
            RuleFor(x => x.BasvuruOnayAsamasi).IsInEnum().WithMessage("Geçersiz onay aşaması.");
        }
    }
}