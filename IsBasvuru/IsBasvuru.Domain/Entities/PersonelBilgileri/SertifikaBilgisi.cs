using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.PersonelBilgileri
{
    public class SertifikaBilgisi:BaseEntity
    {
        public int PersonelId { get; set; }
        public virtual Personel? Personel { get; set; }

        public required string SertifikaAdi { get; set; }
        public required string KurumAdi { get; set; }
        public required string Suresi { get; set; }
        public DateTime VerilisTarihi { get; set; }
        public DateTime? GecerlilikTarihi { get; set; }
    }
}
