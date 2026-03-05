using System;
using IsBasvuru.Domain.Enums;

namespace IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.KisiselBilgilerListDtos
{
    public class KisiselBilgilerListDto
    {

        public int Id { get; set; }
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



        public int? UyrukId { get; set; }
        public string? UyrukAdi { get; set; } 

        // Doğum Yeri
        public int? DogumUlkeId { get; set; }
        public string? DogumUlkeAdi { get; set; }

        public int? DogumSehirId { get; set; }
        public string? DogumSehirAdi { get; set; }

        public int? DogumIlceId { get; set; }
        public string? DogumIlceAdi { get; set; }

        // İkametgah
        public int? IkametgahUlkeId { get; set; }
        public string? IkametgahUlkeAdi { get; set; }

        public int? IkametgahSehirId { get; set; }
        public string? IkametgahSehirAdi { get; set; }

        public int? IkametgahIlceId { get; set; }
        public string? IkametgahIlceAdi { get; set; }
    }
}