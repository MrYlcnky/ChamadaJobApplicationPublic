using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.BasvuruOnayDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.BilgisayarBilgisiDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.DigerKisiselBilgilerDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.EgitimBilgisiDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.IsDeneyimiDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.KisiselBilgilerDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.ReferansBilgisiDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.SertifikaBilgisiDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.YabanciDilBilgisiDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.PersonelEhliyetDtos;
using IsBasvuru.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace IsBasvuru.Domain.DTOs.PersonelDtos
{
    public class PersonelUpdateDto
    {
        public int Id { get; set; }

        public List<int> SubeIds { get; set; } = new();
        public List<int> SubeAlanIds { get; set; } = new();
        public List<int> DepartmanIds { get; set; } = new();
        public List<int> DepartmanPozisyonIds { get; set; } = new();
        public List<int> ProgramIds { get; set; } = new();
        public List<int>? OyunIds { get; set; } = new();
        public string? VesikalikFotograf { get; set; }
        public IFormFile? VesikalikDosyasi { get; set; }
         public required string NedenBiz { get; set; }
       // public string? NedenBiz { get; set; } = "";
        public SecimDurumu LojmanTalebi { get; set; }

        // İç içe güncelleme
        public required KisiselBilgilerDto KisiselBilgiler { get; set; }
        public required DigerKisiselBilgilerUpdateDto DigerKisiselBilgiler { get; set; }

        public ICollection<EgitimBilgisiUpdateDto> EgitimBilgileri { get; set; } = new List<EgitimBilgisiUpdateDto>();
        public ICollection<IsDeneyimiUpdateDto> IsDeneyimleri { get; set; } = new List<IsDeneyimiUpdateDto>();
        public ICollection<YabanciDilBilgisiUpdateDto> YabanciDilBilgileri { get; set; } = new List<YabanciDilBilgisiUpdateDto>();
        public ICollection<BilgisayarBilgisiUpdateDto> BilgisayarBilgileri { get; set; } = new List<BilgisayarBilgisiUpdateDto>();
        public ICollection<SertifikaBilgisiUpdateDto> SertifikaBilgileri { get; set; } = new List<SertifikaBilgisiUpdateDto>();
        public ICollection<ReferansBilgisiUpdateDto> ReferansBilgileri { get; set; } = new List<ReferansBilgisiUpdateDto>();
        public ICollection<PersonelEhliyetUpdateDto> PersonelEhliyetler { get; set; } = new List<PersonelEhliyetUpdateDto>();
        public BasvuruOnayCreateDto? BasvuruOnay { get; set; }
    }
}