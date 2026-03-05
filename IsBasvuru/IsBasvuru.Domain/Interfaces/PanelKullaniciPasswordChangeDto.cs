using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public class PanelKullaniciPasswordChangeDto
    {
        public int Id { get; set; }
        public required string EskiSifre { get; set; }
        public required string YeniSifre { get; set; }
        public required string YeniSifreTekrar { get; set; }
    }
}
