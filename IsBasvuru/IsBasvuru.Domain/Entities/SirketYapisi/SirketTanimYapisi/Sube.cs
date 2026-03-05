using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.SirketYapisi.SirketTanimYapisi
{
    public class Sube:BaseEntity
    {
        public required string SubeAdi { get; set; }
        public bool SubeAktifMi { get; set; }

        public virtual ICollection<SubeAlan> SubeAlanlar { get; set; } = new List<SubeAlan>();

    }
}
