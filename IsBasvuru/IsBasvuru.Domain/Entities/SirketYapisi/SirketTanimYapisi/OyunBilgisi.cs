using IsBasvuru.Domain.Entities.SirketYapisi.SirketMasterYapisi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.SirketYapisi.SirketTanimYapisi
{
    public class OyunBilgisi : BaseEntity
    {
        public int DepartmanId { get; set; }
        public virtual Departman? Departman { get; set; }
        public required string OyunAdi { get; set; }

        public int MasterOyunId { get; set; }
        public virtual MasterOyun? MasterOyun { get; set; }
        public bool OyunAktifMi { get; set; }

    }
}
