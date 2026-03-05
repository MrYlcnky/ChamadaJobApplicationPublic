using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterOyun
{
    public class MasterOyunDto
    {
        public int Id { get; set; }
        public required string MasterOyunAdi { get; set; }
    }

    public class MasterOyunCreateDto
    {
        public required string MasterOyunAdi { get; set; }
    }

    public class MasterOyunUpdateDto
    {
        public int Id { get; set; }
        public required string MasterOyunAdi { get; set; }
    }
}
