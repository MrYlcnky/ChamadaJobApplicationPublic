using IsBasvuru.Domain.Enums;

namespace IsBasvuru.Domain.DTOs.MasterBasvuruDtos
{
    public class MasterBasvuruUpdateDto
    {
        public int Id { get; set; }
        public int PersonelId { get; set; }

        public BasvuruDurum BasvuruDurum { get; set; }
        public BasvuruOnayAsamasi BasvuruOnayAsamasi { get; set; }
        public string? BasvuruVersiyonNo { get; set; } // Versiyon değişirse diye opsiyonel
        public string? IslemAciklama { get; set; }
    }
}