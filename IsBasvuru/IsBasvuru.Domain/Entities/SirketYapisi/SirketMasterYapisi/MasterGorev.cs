using IsBasvuru.Domain.Entities.SirketYapisi.SirketTanimYapisi;

namespace IsBasvuru.Domain.Entities.SirketYapisi.SirketMasterYapisi
{
    public class MasterGorev : BaseEntity
    {
        public required string MasterGorevAdi { get; set; }
        public virtual ICollection<Gorev> Gorevler { get; set; } = new List<Gorev>();
    }
}