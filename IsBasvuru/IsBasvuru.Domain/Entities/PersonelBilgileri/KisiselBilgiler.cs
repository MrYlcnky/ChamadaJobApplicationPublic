using IsBasvuru.Domain.Entities.Tanimlamalar;
using IsBasvuru.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.PersonelBilgileri
{
    public class KisiselBilgiler : BaseEntity
    {
        public int PersonelId { get; set; }
        public virtual Personel? Personel { get; set; }
        // Uyruk
        public int? UyrukId { get; set; }
        public virtual Uyruk? Uyruk { get; set; }
        public string? UyrukAdi { get; set; }

        //Doğum ülke-şehir-ilçe
        public int? DogumUlkeId { get; set; }
        public virtual Ulke? DogumUlke { get; set; }
        public string? DogumUlkeAdi { get; set; }

        public int? DogumSehirId { get; set; }
        public virtual Sehir? DogumSehir { get; set; }
        public string? DogumSehirAdi { get; set; }
     
        public int? DogumIlceId { get; set; }
        public virtual Ilce? DogumIlce { get; set; }
        public string? DogumIlceAdi { get; set; }

        //İkametgah ülke-şehir-ilçe
        public int? IkametgahUlkeId { get; set; }
        public virtual Ulke? IkametgahUlke { get; set; }
        public string? IkametgahUlkeAdi { get; set; }

        public int? IkametgahSehirId { get; set; }
        public virtual Sehir? IkametgahSehir { get; set; }
        public string? IkametgahSehirAdi { get; set; }

        public int? IkametgahIlceId { get; set; }
        public virtual Ilce? IkametgahIlce { get; set; }
        public string? IkametgahIlceAdi { get; set; }

        public required string Ad { get; set; }
        public required string Soyadi { get; set; }
        public required string Email { get; set; }
        public required string Telefon { get; set; }
        public required string TelefonWhatsapp { get; set; }
        public required string Adres { get; set; }
        public DateTime DogumTarihi { get; set; }
        public Cinsiyet Cinsiyet { get; set; }
        public MedeniDurum MedeniDurum { get; set; }
        public int? CocukSayisi { get; set; }


        public string? VesikalikFotograf { get; set; }

    }
}
