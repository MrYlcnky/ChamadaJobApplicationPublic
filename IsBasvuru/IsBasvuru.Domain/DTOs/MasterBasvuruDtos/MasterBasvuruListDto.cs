using IsBasvuru.Domain.DTOs.LogDtos.BasvuruLogDtos;
using IsBasvuru.Domain.DTOs.PersonelDtos;
using IsBasvuru.Domain.Enums;
using System;

namespace IsBasvuru.Domain.DTOs.MasterBasvuruDtos
{
    public class MasterBasvuruListDto
    {
        public int Id { get; set; }
        public int PersonelId { get; set; }
        public PersonelListDto? Personel { get; set; }

        public DateTime BasvuruTarihi { get; set; }
        public required string BasvuruVersiyonNo { get; set; }

        // Enumlar ve String Karşılıkları
        public BasvuruDurum BasvuruDurum { get; set; }
        public required string BasvuruDurumAdi { get; set; }

        public BasvuruOnayAsamasi BasvuruOnayAsamasi { get; set; }
        public required string BasvuruOnayAsamasiAdi { get; set; }
        public List<BasvuruIslemLogListDto> BasvuruIslemLoglari { get; set; } = new List<BasvuruIslemLogListDto>();
        public List<BasvuruIslemLogListDto> Notes { get; set; } = new List<BasvuruIslemLogListDto>();
    }
}