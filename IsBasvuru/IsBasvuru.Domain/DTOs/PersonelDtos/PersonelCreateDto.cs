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
using System.Collections.Generic;

namespace IsBasvuru.Domain.DTOs.PersonelDtos
{
    public class PersonelCreateDto
    {
        // Başvuru Tercihleri 
        public List<int> SubeIds { get; set; } = new();
        public List<int> SubeAlanIds { get; set; } = new();
        public List<int> DepartmanIds { get; set; } = new();
        public List<int> DepartmanPozisyonIds { get; set; } = new();
        public List<int> ProgramIds { get; set; } = new();
        public List<int>? OyunIds { get; set; } = new();
        public required string NedenBiz { get; set; }
        public SecimDurumu LojmanTalebi { get; set; }
        // Dosya İşlemleri
        public IFormFile? VesikalikDosyasi { get; set; }

       

        public required KisiselBilgilerDto KisiselBilgiler { get; set; }
        public required DigerKisiselBilgilerCreateDto DigerKisiselBilgiler { get; set; }

        //Listeler (Null Reference hatası almamak için başlatıyoruz) 
        public ICollection<EgitimBilgisiCreateDto> EgitimBilgileri { get; set; } = new List<EgitimBilgisiCreateDto>();
        public ICollection<IsDeneyimiCreateDto> IsDeneyimleri { get; set; } = new List<IsDeneyimiCreateDto>();
        public ICollection<YabanciDilBilgisiCreateDto> YabanciDilBilgileri { get; set; } = new List<YabanciDilBilgisiCreateDto>();
        public ICollection<BilgisayarBilgisiCreateDto> BilgisayarBilgileri { get; set; } = new List<BilgisayarBilgisiCreateDto>();
        public ICollection<SertifikaBilgisiCreateDto> SertifikaBilgileri { get; set; } = new List<SertifikaBilgisiCreateDto>();
        public ICollection<ReferansBilgisiCreateDto> ReferansBilgileri { get; set; } = new List<ReferansBilgisiCreateDto>();
        public ICollection<PersonelEhliyetCreateDto> PersonelEhliyetler { get; set; } = new List<PersonelEhliyetCreateDto>();

        public BasvuruOnayCreateDto? BasvuruOnay { get; set; }
    }
}