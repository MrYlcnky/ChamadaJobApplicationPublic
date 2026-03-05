using IsBasvuru.Domain.Entities.Tanimlamalar;
using IsBasvuru.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.PersonelBilgileri
{
    public class BasvuruOnay:BaseEntity
    {
        public int PersonelId { get; set; }
        public virtual Personel? Personel { get; set; }

        public int KvkkId { get; set; }
        public virtual Kvkk? Kvkk { get; set; }

        public bool OnayDurum { get; set; }
        public required string IpAdres { get; set; }
        public required string KullaniciCihaz { get; set; }

        public string? KvkkVersiyon { get; set; }
        public string? DogrulukAciklamaTr { get; set; }
        public string? KvkkAciklamaTr { get; set; }
        public string? ReferansAciklamaTr { get; set; }
        public DateTime OnayTarihi { get; set; } = DateTime.Now;
    }
}
