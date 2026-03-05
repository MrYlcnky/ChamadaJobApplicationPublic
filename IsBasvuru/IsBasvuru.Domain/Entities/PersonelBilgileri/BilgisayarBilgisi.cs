using IsBasvuru.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.PersonelBilgileri
{
    public class BilgisayarBilgisi:BaseEntity
    {
        public int PersonelId { get; set; }
        public virtual Personel? Personel { get; set; }

        public required string ProgramAdi { get; set; }
        public Yetkinlik Yetkinlik { get; set; }
    }
}
