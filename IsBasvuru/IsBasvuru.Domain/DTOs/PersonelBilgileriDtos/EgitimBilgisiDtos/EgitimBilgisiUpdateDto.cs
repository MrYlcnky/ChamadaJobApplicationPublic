using System;
using IsBasvuru.Domain.Enums;

namespace IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.EgitimBilgisiDtos
{
    public class EgitimBilgisiUpdateDto
    {
        public int Id { get; set; }
        public int PersonelId { get; set; } 

        public EgitimSeviye EgitimSeviyesi { get; set; }
        public required string OkulAdi { get; set; }
        public required string Bolum { get; set; }
        public DiplomaDurum DiplomaDurum { get; set; }
        public NotSistemi NotSistemi { get; set; }
        public decimal? Gano { get; set; }
        public DateTime BaslangicTarihi { get; set; }
        public DateTime? BitisTarihi { get; set; }
    }
}