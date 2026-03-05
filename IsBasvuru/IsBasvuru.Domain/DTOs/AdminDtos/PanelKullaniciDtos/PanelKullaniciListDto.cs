using System;

namespace IsBasvuru.Domain.DTOs.AdminDtos.PanelKullaniciDtos
{
    public class PanelKullaniciListDto
    {
        public int Id { get; set; }

        public required string KullaniciAdi { get; set; }
        public required string Adi { get; set; }
        public required string Soyadi { get; set; }

        // İlişkili Veriler
        public required int RolId { get; set; }
        public required string RolAdi { get; set; } 

        public int? SubeId { get; set; }
        public string? SubeAdi { get; set; }

        public int? MasterAlanId { get; set; }
        public string? MasterAlanAdi { get; set; }

        public int? MasterDepartmanId { get; set; }
        public  string? MasterDepartmanAdi { get; set; }
      

        public DateTime SonGirisTarihi { get; set; }

        
    }
}