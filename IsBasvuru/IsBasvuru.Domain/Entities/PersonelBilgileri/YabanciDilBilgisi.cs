using IsBasvuru.Domain.Entities.Tanimlamalar;
using IsBasvuru.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.PersonelBilgileri
{
    public class YabanciDilBilgisi:BaseEntity
    {
        public int PersonelId { get; set; }
        public virtual Personel? Personel {  get; set; }

        public int DilId { get; set; }
        public virtual Dil? Dil { get; set; }
        public string? DigerDilAdi { get; set; }
        public DilSeviyesi KonusmaSeviyesi { get; set; }
        public DilSeviyesi YazmaSeviyesi { get; set; }
        public DilSeviyesi OkumaSeviyesi { get; set; }
        public DilSeviyesi DinlemeSeviyesi { get; set; }
        public required string NasilOgrenildi { get; set; }
    }
}
