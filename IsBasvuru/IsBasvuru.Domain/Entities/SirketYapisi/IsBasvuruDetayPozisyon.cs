using IsBasvuru.Domain.Entities.PersonelBilgileri;
using IsBasvuru.Domain.Entities.SirketYapisi.SirketTanimYapisi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.SirketYapisi
{
    public class IsBasvuruDetayPozisyon:BaseEntity
    {
        public int IsBasvuruDetayId { get; set; }
        public virtual IsBasvuruDetay? IsBasvuruDetay { get; set; }

        public int DepartmanPozisyonId { get; set; }
        public virtual DepartmanPozisyon? DepartmanPozisyon { get; set; }
    }
}
