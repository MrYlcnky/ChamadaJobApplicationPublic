using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.Tanimlamalar
{
    public class Ulke:BaseEntity
    {
        public required string UlkeAdi { get; set; }

        public virtual ICollection<Sehir> Sehirler { get; set; } = new List<Sehir>();
        public virtual Uyruk? Uyruk { get; set; }
    }
}
