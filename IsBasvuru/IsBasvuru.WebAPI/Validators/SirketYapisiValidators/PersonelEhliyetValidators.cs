using FluentValidation;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.PersonelEhliyetDtos;

namespace IsBasvuru.WebAPI.Validators.SirketYapisiValidators
{
    public class PersonelEhliyetCreateValidator : AbstractValidator<PersonelEhliyetCreateDto>
    {
        public PersonelEhliyetCreateValidator()
        {
            RuleFor(x => x.PersonelId).GreaterThan(0).WithMessage("Geçerli bir personel seçilmelidir.");
            RuleFor(x => x.EhliyetTuruId).GreaterThan(0).WithMessage("Geçerli bir ehliyet türü seçilmelidir.");
        }
    }

    public class PersonelEhliyetUpdateValidator : AbstractValidator<PersonelEhliyetUpdateDto>
    {
        public PersonelEhliyetUpdateValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Geçersiz ID.");
            RuleFor(x => x.PersonelId).GreaterThan(0).WithMessage("Geçerli bir personel seçilmelidir.");
            RuleFor(x => x.EhliyetTuruId).GreaterThan(0).WithMessage("Geçerli bir ehliyet türü seçilmelidir.");
        }
    }
}