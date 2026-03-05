using IsBasvuru.Domain.Entities.AdminBilgileri;
using IsBasvuru.Domain.Entities.SirketYapisi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.Tanimlamalar
{
    public class EhliyetTuru:BaseEntity
    {

        public required string EhliyetTuruAdi { get; set; }
        public virtual ICollection<PersonelEhliyet> PersonelEhliyetler { get; set; } = new List<PersonelEhliyet>();
    }
}
