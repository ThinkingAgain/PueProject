using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace PUMS.Data
{
    public class SeedData
    {
        /// <summary>
        /// 初始化方法用于自动创建管理员账号
        /// </summary>
        /// <param name="serviceProvider"></param>
        /// <param name="initUserPw">管理员初始密码</param>
        /// <returns></returns>
        public static async Task Initialize(IServiceProvider serviceProvider, string initUserPw = "ww**9878A")
        {
            using (var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                // admin用户拥有所有权限
                var adminID = await EnsureUser(serviceProvider, initUserPw, "admin");
                await EnsureRole(serviceProvider, adminID, "Admin");
                
            }
        }

        /// <summary>
        /// 增加用户及角色
        /// </summary>
        /// <param name="serviceProvider"></param>
        /// <param name="userName">用户名</param>
        /// <param name="initUserPw">初始密码</param>
        /// <param name="role">角色</param>
        /// <returns></returns>
        public static async Task AddUserWithRole(IServiceProvider serviceProvider,
            string userName, string initUserPw, string role)
        {
            var userID = await EnsureUser(serviceProvider, initUserPw, userName);
            await EnsureRole(serviceProvider, userID, role);
        }

        /// <summary>
        /// 增加角色
        /// </summary>
        /// <param name="serviceProvider"></param>
        /// <param name="roles">可迭代的一组角色</param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public static async Task AddRole(IServiceProvider serviceProvider,
            IEnumerable<string> roles)
        {
            var roleManager = serviceProvider.GetService<RoleManager<IdentityRole>>();
            if (roleManager == null)
            {
                throw new Exception("roleManager null");
            }

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    // 若角色不存在, 创建角色
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

        }

        /// <summary>
        /// 增加角色的重载版本(只增加单个角色)
        /// </summary>
        /// <param name="serviceProvider"></param>
        /// <param name="role">角色名</param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public static async Task<IdentityResult> AddRole(IServiceProvider serviceProvider,
           string role)
        {
            IdentityResult IR = null;
            var roleManager = serviceProvider.GetService<RoleManager<IdentityRole>>();

            if (roleManager == null)
            {
                throw new Exception("roleManager null");
            }

            if (!await roleManager.RoleExistsAsync(role))
            {
                // 若角色不存在, 创建角色
                IR = await roleManager.CreateAsync(new IdentityRole(role));
            }
            return IR;
        }

        /* 以下为私有方法 ******************************************************************/

        private static async Task<string> EnsureUser(IServiceProvider serviceProvider,
                string userPw, string userName)
        {
            var userManager = serviceProvider.GetService<UserManager<IdentityUser>>();

            var user = await userManager.FindByNameAsync(userName);
            if (user == null)
            {
                user = new IdentityUser
                {
                    UserName = userName,
                    Email = $"{userName}@b.com",
                    EmailConfirmed = true
                };
                 var tt = await userManager.CreateAsync(user, userPw);
            }

            if (user == null)
            {
                throw new Exception("可能密码强度不够!");
            }

            return user.Id;

        }


        /// <summary>
        /// 为指定用户关联角色
        /// </summary>
        /// <param name="serviceProvider"></param>
        /// <param name="uid">用户ID</param>
        /// <param name="role">角色名</param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        private static async Task<IdentityResult> EnsureRole(IServiceProvider serviceProvider,
            string uid, string role)
        {
            IdentityResult IR = null;
            var roleManager = serviceProvider.GetService<RoleManager<IdentityRole>>();

            if (roleManager == null)
            {
                throw new Exception("roleManager null");
            }

            if (!await roleManager.RoleExistsAsync(role))
            {
                // 若角色不存在, 创建角色
                IR = await roleManager.CreateAsync(new IdentityRole(role));
            }

            var userManager = serviceProvider.GetService<UserManager<IdentityUser>>();

            var user = await userManager.FindByIdAsync(uid);
            if (user == null)
            {
                throw new Exception("用户不存在!");
            }

            // 在userRoles表中增加用户/角色对应关系
            IR = await userManager.AddToRoleAsync(user, role);
            return IR;
        }



    }
}
