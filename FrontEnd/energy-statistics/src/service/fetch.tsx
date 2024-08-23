export async function  fetchData<T>(url: string): Promise<T> {
    let data: T;
    //console.log(url)
    await fetch(url)
        .then((res) => res.json())
        .then((d) => {
            data = d
        })
        .catch(err => {
            alert("获取后台数据错误!")
            console.log(err)
            return data
        })
    return data!;
}