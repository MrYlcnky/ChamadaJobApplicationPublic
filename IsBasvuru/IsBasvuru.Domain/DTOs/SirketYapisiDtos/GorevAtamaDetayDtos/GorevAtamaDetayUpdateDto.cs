using System;
using IsBasvuru.Domain.Enums;

namespace IsBasvuru.Domain.DTOs.SirketYapisiDtos.GorevAtamaDetayDtos
{
    public class GorevAtamaDetayUpdateDto
    {
        public int Id { get; set; }
        public int PersonelId { get; set; }
        public int MasterDepartmanId { get; set; }
        public int GorevId { get; set; }
        public int PanelKullaniciId { get; set; }

        public int NetUcret { get; set; }
        public int TalepEdilenGorevGenelButcesi { get; set; }
        public DateTime BaslangicTarihi { get; set; }

        public TalepNedeni TalepNedeni { get; set; }
        public string? YerineAlinacakKisiAdSoyad { get; set; }
    }
}