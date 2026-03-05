using IsBasvuru.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.BasvuruOnayDtos
{
    public class BasvuruOnayListDto
    {
        public int Id { get; set; }
        public int PersonelId { get; set; }
        public int? BasvuruId { get; set; }
        public string? PersonelAdSoyad { get; set; }
        public int KvkkId { get; set; }
        public bool OnayDurum { get; set; }
        public required string IpAdres { get; set; }
        public required string KullaniciCihaz { get; set; }
        public string? KvkkVersiyon { get; set; }
        public string? DogrulukAciklamaTr { get; set; }
        public string? KvkkAciklamaTr { get; set; }
        public string? ReferansAciklamaTr { get; set; }
        public DateTime OnayTarihi { get; set; }
    }
}
