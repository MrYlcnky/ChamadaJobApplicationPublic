using IsBasvuru.Domain.Entities.SirketYapisi.SirketTanimYapisi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.SirketYapisi.SirketMasterYapisi
{
    public class MasterOyun
    {
        public int Id { get; set; }
        public required string MasterOyunAdi { get; set; }
        // İlişki: Bu oyun hangi departmanlarda (masalarda) oynatılıyor?
        public virtual ICollection<OyunBilgisi>? OyunBilgileri { get; set; }
    }
}
