using System;
using System.Text.Json.Serialization;

namespace IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.IsDeneyimiDtos
{
    public class IsDeneyimiCreateDto
    {
        public int PersonelId { get; set; } // Hangi personele ait?

        public required string SirketAdi { get; set; }
        public required string Departman { get; set; }
        public required string Pozisyon { get; set; }
        public required string Gorev { get; set; }
        public required int Ucret { get; set; }

        public int? UlkeId { get; set; }
        public string? UlkeAdi { get; set; }

        public int? SehirId { get; set; }
        public string? SehirAdi { get; set; }

        public DateTime BaslangicTarihi { get; set; }
        public DateTime? BitisTarihi { get; set; } 
        public string? AyrilisSebep { get; set; }
    }
}