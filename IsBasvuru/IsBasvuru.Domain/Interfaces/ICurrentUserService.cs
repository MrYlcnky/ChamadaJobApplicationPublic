using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Domain.Interfaces
{
    public interface ICurrentUserService
    {
        int UserId { get; }
        int? RolId { get; }
    }
}
