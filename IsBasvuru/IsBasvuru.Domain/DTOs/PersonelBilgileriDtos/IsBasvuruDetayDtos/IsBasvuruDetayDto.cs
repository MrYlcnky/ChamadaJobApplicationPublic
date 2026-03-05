using IsBasvuru.Domain.DTOs.SirketYapisiDtos.DepartmanDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.DepartmanPozisyonDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.OyunBilgisiDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.ProgramBilgisiDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.SubeAlanDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.SubeDtos;
using System.Collections.Generic;

namespace IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.IsBasvuruDetayDtos
{
    public class IsBasvuruDetayDto
    {
        public int LojmanTalebiVarMi { get; set; }
        public required string NedenBiz { get; set; }

        public List<SubeListDto> BasvuruSubeler { get; set; } = [];
        public List<SubeAlanListDto> BasvuruAlanlar { get; set; } = [];
        public List<DepartmanListDto> BasvuruDepartmanlar { get; set; } = [];
        public List<DepartmanPozisyonListDto> BasvuruPozisyonlar { get; set; } = [];
        public List<ProgramBilgisiListDto> BasvuruProgramlar { get; set; } = [];
        public List<OyunBilgisiListDto> BasvuruOyunlar { get; set; } = [];
    }
}