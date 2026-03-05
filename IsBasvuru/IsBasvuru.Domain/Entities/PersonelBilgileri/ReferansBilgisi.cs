using IsBasvuru.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.PersonelBilgileri
{
    public class ReferansBilgisi:BaseEntity
    {
        public int PersonelId { get; set; }
        public virtual Personel? Personel { get; set; }

        public ReferansKurum CalistigiKurum { get; set; }
        public required string ReferansAdi { get; set; }
        public required string ReferansSoyadi { get; set; }
        public required string IsYeri { get; set; }
        public required string Gorev { get; set; }
        public required string ReferansTelefon { get; set; }

    }
}
