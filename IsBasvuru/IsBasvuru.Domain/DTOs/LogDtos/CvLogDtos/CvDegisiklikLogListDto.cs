using System;

namespace IsBasvuru.Domain.DTOs.LogDtos.CvLogDtos
{
    public class CvDegisiklikLogListDto
    {
        public int Id { get; set; }
        public int MasterBasvuruId { get; set; }
        public int PersonelId { get; set; }

        public int DegisenKayitId { get; set; }

        public  string? DegisenTabloAdi { get; set; }
        public  string? DegisenAlanAdi { get; set; }

        public string? EskiDeger { get; set; }
        public string? YeniDeger { get; set; }

        public required string DegisiklikTipiAdi { get; set; }

        public DateTime DegisiklikTarihi { get; set; }
    }
}