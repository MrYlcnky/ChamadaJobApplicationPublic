using IsBasvuru.Domain.Entities.Log;
using IsBasvuru.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities
{
    public class MasterBasvuru:BaseEntity
    {
        public int PersonelId { get; set; }
        public virtual Personel? Personel { get; set; }
        public DateTime BasvuruTarihi { get; set; } = DateTime.Now;
        public BasvuruDurum BasvuruDurum { get; set; }
        public BasvuruOnayAsamasi BasvuruOnayAsamasi { get; set; }
        public required string BasvuruVersiyonNo { get; set; }

        public virtual ICollection<BasvuruIslemLog> BasvuruIslemLoglari { get; set; } = new List<BasvuruIslemLog>();
    }
}
