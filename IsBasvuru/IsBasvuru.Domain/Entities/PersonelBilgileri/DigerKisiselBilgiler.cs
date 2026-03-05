using IsBasvuru.Domain.Entities.Tanimlamalar;
using IsBasvuru.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.PersonelBilgileri
{
    public class DigerKisiselBilgiler:BaseEntity
    {
        public int PersonelId { get; set; }
        public virtual Personel? Personel { get; set; }

        public int KktcBelgeId { get; set; }

        public virtual KktcBelge? KktcBelge { get; set; }



        public SecimDurumu DavaDurumu { get; set; }

        public string? DavaNedeni { get; set; }

        public SecimDurumu SigaraKullanimi { get; set; }

        public AskerlikDurumu AskerlikDurumu { get; set; }

        public SecimDurumu KaliciRahatsizlik { get; set; }

        public string? KaliciRahatsizlikAciklama { get; set; }

        public SecimDurumu EhliyetDurumu { get; set; }


        public required int Boy { get; set; }

        public required int Kilo { get; set; }
    }
}
