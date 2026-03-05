using IsBasvuru.Domain.Entities.PersonelBilgileri;
using IsBasvuru.Domain.Entities.SirketYapisi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities
{
    public class Personel:BaseEntity
    {
        public virtual MasterBasvuru? MasterBasvuru { get; set; }
        //1-N
        public required ICollection<EgitimBilgisi> EgitimBilgileri { get; set; }
        public ICollection<SertifikaBilgisi>? SertifikaBilgileri { get; set; }
        public ICollection<BilgisayarBilgisi>? BilgisayarBilgileri { get; set; }
        public ICollection<YabanciDilBilgisi>? YabanciDilBilgileri { get; set; }
        public ICollection<IsDeneyimi>? IsDeneyimleri { get; set; }
        public ICollection<ReferansBilgisi>? ReferansBilgileri { get; set; }
        public ICollection<PersonelEhliyet>? PersonelEhliyetler { get; set; }
        //1-1
        public virtual KisiselBilgiler? KisiselBilgiler { get; set; }
        public virtual DigerKisiselBilgiler? DigerKisiselBilgiler { get; set; }
        public virtual IsBasvuruDetay? IsBasvuruDetay { get; set; }
        public virtual BasvuruOnay? BasvuruOnay { get; set; }

        public DateTime? GuncellemeTarihi { get; set; }



    }
}
