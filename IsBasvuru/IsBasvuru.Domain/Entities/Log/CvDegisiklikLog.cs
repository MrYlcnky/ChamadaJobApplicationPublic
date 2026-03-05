using IsBasvuru.Domain.Entities.AdminBilgileri;
using IsBasvuru.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.Log
{
    public class CvDegisiklikLog : BaseEntity
    {
        public int? MasterBasvuruId { get; set; }
        public virtual MasterBasvuru? MasterBasvuru { get; set; }

        public int PersonelId { get; set; }
        public virtual Personel? Personel { get; set; }


        public int DegisenKayitId { get; set; }

        public string? DegisenTabloAdi { get; set; }
        public string? DegisenAlanAdi { get; set; }
        public string? EskiDeger { get; set; }
        public string? YeniDeger { get; set; }
        public LogIslemTipi DegisiklikTipi { get; set; }
        public DateTime DegisiklikTarihi { get; set; }
    }
}
