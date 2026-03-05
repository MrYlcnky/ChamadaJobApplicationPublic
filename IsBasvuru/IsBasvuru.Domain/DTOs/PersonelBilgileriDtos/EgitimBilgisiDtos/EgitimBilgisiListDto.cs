using System;
using IsBasvuru.Domain.Enums;

namespace IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.EgitimBilgisiDtos
{
    public class EgitimBilgisiListDto
    {
        public int Id { get; set; }
        public int PersonelId { get; set; }

        public required string OkulAdi { get; set; }
        public required string Bolum { get; set; }

        // Enum'ların hem int hem string hallerini dönebiliriz
        public EgitimSeviye EgitimSeviyesi { get; set; }
        public string? EgitimSeviyesiAdi { get; set; }

        public DiplomaDurum DiplomaDurum { get; set; }
        public string? DiplomaDurumAdi { get; set; }

        public NotSistemi NotSistemi { get; set; }
        public decimal? Gano { get; set; }

        public DateTime BaslangicTarihi { get; set; }
        public DateTime? BitisTarihi { get; set; }
    }
}