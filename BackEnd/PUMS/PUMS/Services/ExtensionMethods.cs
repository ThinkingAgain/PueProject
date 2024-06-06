namespace PUMS.Services
{
    public static class ExtensionMethods
    {
        
        /// <summary>
        /// <string, double>字典中读取指定key, 没有就返回0
        /// </summary>
        /// <param name="d"></param>
        /// <param name="key"></param>
        /// <returns>float</returns>
        public static float TryGetFloat(this Dictionary<string, double> d, string key)
        {
            return d.ContainsKey(key) ? (float)d[key] : 0f;
        }
    }
}
