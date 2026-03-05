using IsBasvuru.Domain.Entities.SirketYapisi.SirketTanimYapisi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.SirketYapisi.SirketMasterYapisi
{
    public class MasterProgram
    {
        public int Id { get; set; }
        public required string MasterProgramAdi { get; set; } 
        public virtual ICollection<ProgramBilgisi>? ProgramBilgileri { get; set; }
    }
}
