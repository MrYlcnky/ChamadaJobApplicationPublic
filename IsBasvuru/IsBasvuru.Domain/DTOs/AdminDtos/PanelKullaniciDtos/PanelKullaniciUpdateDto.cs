namespace IsBasvuru.Domain.DTOs.AdminDtos.PanelKullaniciDtos
{
    public class PanelKullaniciUpdateDto
    {
        public int Id { get; set; }

        public required string KullaniciAdi { get; set; }
        public required  string Adi { get; set; }
        public required string Soyadi { get; set; }

        // Eğer boş gönderilirse eski şifre korunacak
        public string? YeniKullaniciSifre { get; set; }

        public int RolId { get; set; }
        public int? SubeId { get; set; }
        public int? MasterAlanId { get; set; }
        public int? MasterDepartmanId { get; set; }
    }
}