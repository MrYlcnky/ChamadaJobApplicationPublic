using IsBasvuru.Domain.Entities.AdminBilgileri;
using IsBasvuru.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.Log
{
    public class BasvuruIslemLog : BaseEntity
    {
        public int MasterBasvuruId { get; set; }
        public virtual MasterBasvuru? MasterBasvuru { get; set; }

        public int? PanelKullaniciId { get; set; }
        public virtual PanelKullanici? PanelKullanici { get; set; }

        public int? RolId { get; set; } 
        public BasvuruDurum? BasvuruDurum { get; set; } 
        public BasvuruOnayAsamasi? BasvuruOnayAsamasi { get; set; } 

        public LogIslemTipi IslemTipi { get; set; }
        public required string IslemAciklama { get; set; }
        public DateTime IslemTarihi { get; set; }
    }
}
