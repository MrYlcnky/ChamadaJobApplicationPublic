using IsBasvuru.Domain.Entities.SirketYapisi.SirketTanimYapisi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IsBasvuru.Domain.Entities.Tanimlamalar;

namespace IsBasvuru.Domain.Entities.AdminBilgileri
{
    public class PanelKullanici:BaseEntity
    {
        public int RolId { get; set; }
        public virtual Rol? Rol { get; set; }

        public int? SubeId { get; set; }
        public virtual Sube? Sube { get; set; }

        public int? MasterAlanId { get; set; }
        public virtual MasterAlan? MasterAlan { get; set; }

        public int? MasterDepartmanId { get; set; }
        public virtual MasterDepartman? MasterDepartman { get; set; }

        public required string KullaniciAdi { get; set; }
        public required string Adi { get; set; }
        public required string Soyadi { get; set; }
        public required string KullaniciSifre { get; set; }

        public DateTime SonGirisTarihi { get; set; }

        //public bool AktifMi { get; set; }
    }
}
