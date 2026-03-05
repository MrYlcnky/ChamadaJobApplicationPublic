using IsBasvuru.Domain.Entities.Tanimlamalar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.SirketYapisi
{
    public class PersonelEhliyet:BaseEntity
    {
        public int PersonelId { get; set; }
        public virtual Personel? Personel {  get; set; }
        public int EhliyetTuruId { get; set; }
        public virtual EhliyetTuru? EhliyetTuru { get; set; }
    }
}
