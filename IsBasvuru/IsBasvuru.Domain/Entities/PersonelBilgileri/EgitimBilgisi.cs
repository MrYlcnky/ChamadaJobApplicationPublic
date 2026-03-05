using IsBasvuru.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.PersonelBilgileri
{
    public class EgitimBilgisi:BaseEntity
    {
        public int PersonelId { get; set; }
        public virtual Personel? Personel { get; set; }

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
