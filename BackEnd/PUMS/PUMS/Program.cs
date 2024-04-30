using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PUMS.Authorization;
using PUMS.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// 数据上下文
var datasConnectionString = builder.Configuration.GetConnectionString("DatasContext") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<DatasContext>(options =>
    options.UseMySql(
        datasConnectionString,
        ServerVersion.AutoDetect(datasConnectionString)
        ));

// Identity上下文
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        connectionString, 
        ServerVersion.AutoDetect(connectionString)
        ));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Idenity数据库操作
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ApplicationDbContext>();
    var userManager = services.GetService<UserManager<IdentityUser>>();

    // 1.  Idenity数据库初始化
    //context.Database.Migrate();  // Idenity数据库初始化---首次运行时建表

    // 2. 运行Seed.Initialize() 增加管理员账号
    //await SeedData.Initialize(services);

    // 3. 将角色写入数据库
    //await SeedData.AddRole(services, Constants.ManagerRole);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
}
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

app.Run();
