using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.Tanimlamalar
{
    public class Uyruk:BaseEntity
    {
        public int UlkeId { get; set; }
        public virtual Ulke? Ulke { get; set; }
        public required string UyrukAdi { get; set; }
    }
}
