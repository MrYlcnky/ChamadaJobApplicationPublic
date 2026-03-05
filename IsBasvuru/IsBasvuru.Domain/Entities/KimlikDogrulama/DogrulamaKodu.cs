using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Entities.KimlikDogrulama
{
    public class DogrulamaKodu : BaseEntity
    {
        public required string Eposta { get; set; } 
        public required string Kod { get; set; }    
        public DateTime GecerlilikTarihi { get; set; } 
        public bool KullanildiMi { get; set; } = false; 
    }
}
