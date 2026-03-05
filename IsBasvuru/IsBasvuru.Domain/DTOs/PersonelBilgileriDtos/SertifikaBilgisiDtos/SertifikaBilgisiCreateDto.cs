using System;

namespace IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.SertifikaBilgisiDtos
{
    public class SertifikaBilgisiCreateDto
    {
        public int PersonelId { get; set; }

        public required string SertifikaAdi { get; set; }
        public required string KurumAdi { get; set; }
        public required string Suresi { get; set; } 
        public DateTime VerilisTarihi { get; set; }
        public DateTime? GecerlilikTarihi { get; set; } 
    }
}