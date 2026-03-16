using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.DTOs.SirketYapisiDtos.OrganizationImportDtos
{
    public class OrganizationImportDto
    {
        public string Sube { get; set; }
        public string Alan { get; set; }
        public string Departman { get; set; }
        public string Pozisyon { get; set; }
    }

    public class ProgramImportDto
    {
        public string Sube { get; set; }
        public string Departman { get; set; }
        public string ProgramAdi { get; set; }
    }

    public class OyunImportDto
    {
        public string Sube { get; set; }
        public string Departman { get; set; }
        public string OyunAdi { get; set; }
    }

    public class GorevImportDto
    {
        public string Departman { get; set; } // Bu MasterDepartmanAdi ile eşleşecek
        public string GorevAdi { get; set; }
    }
}
