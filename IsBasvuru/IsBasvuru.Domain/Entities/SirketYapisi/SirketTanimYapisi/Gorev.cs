using IsBasvuru.Domain.Entities.SirketYapisi.SirketMasterYapisi;
using IsBasvuru.Domain.Entities.Tanimlamalar;

namespace IsBasvuru.Domain.Entities.SirketYapisi.SirketTanimYapisi
{
    public class Gorev : BaseEntity
    {
        public int MasterGorevId { get; set; }
        public virtual MasterGorev? MasterGorev { get; set; }
        public int MasterDepartmanId { get; set; }
        public virtual MasterDepartman? MasterDepartman { get; set; }
        
    }
}