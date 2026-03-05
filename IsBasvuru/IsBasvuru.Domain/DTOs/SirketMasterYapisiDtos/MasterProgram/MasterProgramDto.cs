using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterProgram
{
    public class MasterProgramDto
    {
        public int Id { get; set; }
        public required string MasterProgramAdi { get; set; }
    }

    public class MasterProgramCreateDto
    {
        public required string MasterProgramAdi { get; set; }
    }

    public class MasterProgramUpdateDto
    {
        public int Id { get; set; }
        public required string MasterProgramAdi { get; set; }
    }


}
