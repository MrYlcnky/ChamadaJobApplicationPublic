using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.Tanimlamalar
{
    public class Kvkk:BaseEntity
    {
      
        public required string DogrulukAciklamaTr { get; set; }
        public required string KvkkAciklamaTr { get; set; }
        public required string ReferansAciklamaTr { get; set; }
        public required string DogrulukAciklamaEn { get; set; }
        public required string KvkkAciklamaEn { get; set; }
        public required string ReferansAciklamaEn { get; set; }
        public required string KvkkVersiyon { get; set; }
        public DateTime GuncellemeTarihi { get; set; } //Ekleme
    }
}
