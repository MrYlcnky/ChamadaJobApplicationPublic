using IsBasvuru.Domain.Entities.Tanimlamalar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.SirketYapisi.SirketTanimYapisi
{
    public class DepartmanPozisyon : BaseEntity
    {
        public int DepartmanId { get; set; }
        public virtual Departman? Departman { get; set; }
        public int MasterPozisyonId { get; set; }
        public virtual MasterPozisyon? MasterPozisyon { get; set; }
        public bool DepartmanPozisyonAktifMi { get; set; }

        
    }
}


