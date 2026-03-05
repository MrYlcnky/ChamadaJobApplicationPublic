using IsBasvuru.Domain.Entities.SirketYapisi.SirketMasterYapisi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.SirketYapisi.SirketTanimYapisi
{
    public class ProgramBilgisi:BaseEntity
    {
        public int DepartmanId { get; set; }
        public virtual Departman? Departman { get; set; }

        public int MasterProgramId { get; set; }
        public virtual MasterProgram? MasterProgram { get; set; }

        public required string ProgramAdi { get; set; }
        public bool ProgramAktifMi { get; set; }
    }
}
