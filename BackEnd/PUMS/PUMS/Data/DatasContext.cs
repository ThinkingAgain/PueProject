using Microsoft.EntityFrameworkCore;
using PUMS.Models;

namespace PUMS.Data
{
    public class DatasContext : DbContext
    {
        public DatasContext(DbContextOptions<DatasContext> options)
            : base(options) { }

        public DbSet<EnergyData> EnergyDatas { get; set; }

    }
}
