using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.Tanimlamalar
{
    public class Ilce:BaseEntity
    {
        public int SehirId { get; set; }
        public virtual Sehir? Sehir { get; set; }

        public required string IlceAdi { get; set; }
    }
}
