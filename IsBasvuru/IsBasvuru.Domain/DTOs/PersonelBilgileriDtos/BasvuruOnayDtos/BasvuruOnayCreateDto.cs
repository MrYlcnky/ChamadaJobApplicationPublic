using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.BasvuruOnayDtos
{
    public class BasvuruOnayCreateDto
    {
        public int KvkkId { get; set; }

        public bool OnayDurum { get; set; }
    }
}
