using IsBasvuru.Domain.Entities.Tanimlamalar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.PersonelBilgileri
{
    public class IsDeneyimi:BaseEntity
    {

        public int PersonelId { get; set; }
        public virtual Personel? Personel { get; set; }

        public int? UlkeId { get; set; }
        public virtual Ulke? Ulke { get; set; }
        public int? SehirId { get; set; }
        public virtual Sehir? Sehir { get; set; }

        public required string SirketAdi { get; set; }
        public required string Departman { get; set; }
        public required string Pozisyon { get; set; }
        public required string Gorev { get; set; }
        public required int Ucret { get; set; }
        public string? UlkeAdi { get; set; }
        public string? SehirAdi { get; set; }
        public DateTime BaslangicTarihi { get; set; }
        public DateTime? BitisTarihi { get; set; }
        public string? AyrilisSebep { get; set; }

    }
}
