using IsBasvuru.Domain.Entities.Tanimlamalar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.SirketYapisi.SirketTanimYapisi
{
    public class Departman:BaseEntity
    {
        public int SubeAlanId { get; set; }
        public virtual SubeAlan? SubeAlan { get; set; }
        public int MasterDepartmanId { get; set; }
        public virtual MasterDepartman? MasterDepartman { get; set; }
        public bool DepartmanAktifMi { get; set; }


        public ICollection<OyunBilgisi> OyunBilgileri { get; set; } = new List<OyunBilgisi>();
        public ICollection<ProgramBilgisi> ProgramBilgileri { get; set; } = new List<ProgramBilgisi>();
        public virtual ICollection<DepartmanPozisyon> DepartmanPozisyonlar { get; set; } = new List<DepartmanPozisyon>();
    }
}