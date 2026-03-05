using System;
using IsBasvuru.Domain.Enums;

namespace IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.EgitimBilgisiDtos
{
    public class EgitimBilgisiCreateDto
    {
        public int PersonelId { get; set; }

        public EgitimSeviye EgitimSeviyesi { get; set; }
        public required string OkulAdi { get; set; }
        public required string Bolum { get; set; }
        public DiplomaDurum DiplomaDurum { get; set; } // Enum
        public NotSistemi NotSistemi { get; set; }
        public decimal? Gano { get; set; }
        public DateTime BaslangicTarihi { get; set; }
        public DateTime? BitisTarihi { get; set; }
    }
}