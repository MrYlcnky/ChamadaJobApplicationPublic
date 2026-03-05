using System;

namespace IsBasvuru.Domain.DTOs.LogDtos.BasvuruLogDtos
{
    public class BasvuruIslemLogListDto
    {
        public int Id { get; set; }
        public int MasterBasvuruId { get; set; }


        public int? PanelKullaniciId { get; set; }
        public string? PanelKullaniciAdSoyad { get; set; }

        public int? RolId { get; set; }
        public int? BasvuruDurum { get; set; }
        public int? BasvuruOnayAsamasi { get; set; }

        // Enum string karşılığı
        public string? IslemTipiAdi { get; set; } // Onay, Red vb.
        public string? IslemAciklama { get; set; }
        public DateTime IslemTarihi { get; set; }

        // --- JOIN İLE GELECEK ADAY BİLGİLERİ  ---
        public string? AdSoyad { get; set; }
        public string? FotoUrl { get; set; }
        public string? BasvuruVersiyonNo { get; set; }

        // --- ORGANİZASYON BİLGİLERİ  ---
        public string? Subeler { get; set; }
        public string? Alanlar { get; set; }
        public string? Departmanlar { get; set; }
        public string? Pozisyonlar { get; set; }

        // --- ROL BAZLI NOTLAR  ---
        public string? DmIslemi { get; set; } // DM Adı + Notu
        public string? GmIslemi { get; set; } // GM Adı + Notu
        public string? IkIslemi { get; set; } // İK Adı + Notu
    }
}