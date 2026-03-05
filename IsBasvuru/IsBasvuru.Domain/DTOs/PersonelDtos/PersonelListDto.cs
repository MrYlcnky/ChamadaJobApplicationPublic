using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.BasvuruOnayDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.BilgisayarBilgisiDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.DigerKisiselBilgilerDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.EgitimBilgisiDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.IsBasvuruDetayDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.IsDeneyimiDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.KisiselBilgilerListDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.ReferansBilgisiDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.SertifikaBilgisiDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.YabanciDilBilgisiDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.PersonelEhliyetDtos;

namespace IsBasvuru.Domain.DTOs.PersonelDtos
{
    public class PersonelListDto
    {
        public int Id { get; set; }
        public required string Ad { get; set; }
        public required string Soyad { get; set; }
        public required string FotografYolu { get; set; }

        public required string NedenBiz { get; set; }
        public int LojmanTalebi { get; set; }

        public DateTime GuncellemeTarihi { get; set; }

        public required KisiselBilgilerListDto KisiselBilgiler { get; set; }
        public required DigerKisiselBilgilerListDto DigerKisiselBilgiler { get; set; }

        public List<EgitimBilgisiListDto> EgitimBilgileri { get; set; } = [];
        public List<IsDeneyimiListDto> IsDeneyimleri { get; set; } = [];
        public List<YabanciDilBilgisiListDto> YabanciDilBilgileri { get; set; } = [];
        public List<BilgisayarBilgisiListDto> BilgisayarBilgileri { get; set; } = [];
        public List<SertifikaBilgisiListDto> SertifikaBilgileri { get; set; } = [];
        public List<ReferansBilgisiListDto> ReferansBilgileri { get; set; } = [];
        public List<PersonelEhliyetListDto> PersonelEhliyetler { get; set; } = [];

        public IsBasvuruDetayDto? IsBasvuruDetay { get; set; }
        public BasvuruOnayListDto? BasvuruOnay { get; set; }
    }
}