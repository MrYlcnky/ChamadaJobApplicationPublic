using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.AdminBilgileri
{
    public class Rol: BaseEntity
    {
        public required string RolAdi { get; set; }
        public required string RolTanimi { get; set; }

        public virtual ICollection<PanelKullanici> PanelKullanicilari { get; set; } = new List<PanelKullanici>();
    }
}
