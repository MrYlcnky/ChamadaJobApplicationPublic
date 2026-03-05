using IsBasvuru.Domain.Entities.SirketYapisi;
using IsBasvuru.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.PersonelBilgileri
{
    public class IsBasvuruDetay:BaseEntity
    {
        public int PersonelId { get; set; }
        public virtual Personel? Personel { get; set; }

        public SecimDurumu LojmanTalebiVarMi { get; set; }
        public required string NedenBiz { get; set; }

        public virtual ICollection<IsBasvuruDetaySube> BasvuruSubeler { get; set; } = new List<IsBasvuruDetaySube>();
        public virtual ICollection<IsBasvuruDetayAlan> BasvuruAlanlar { get; set; } = new List<IsBasvuruDetayAlan>();
        public virtual ICollection<IsBasvuruDetayDepartman> BasvuruDepartmanlar { get; set; } = new List <IsBasvuruDetayDepartman>();
        public virtual ICollection<IsBasvuruDetayPozisyon> BasvuruPozisyonlar { get; set; } = new List <IsBasvuruDetayPozisyon>();
        public virtual ICollection<IsBasvuruDetayProgram> BasvuruProgramlar { get; set; } = new List <IsBasvuruDetayProgram>();
        public virtual ICollection<IsBasvuruDetayOyun> BasvuruOyunlar { get; set; } = new List<IsBasvuruDetayOyun>();

    }
}
