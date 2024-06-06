export async function  getLatestEnerydataById(siteId, meterId) {
    let energydata = null
    await fetch(`/api/datas/energydata/${siteId}/${meterId}`)
        .then((res) => res.json())
        .then((data) => {
            energydata = data
        })
        .catch(err => {
            alert("获取后台数据错误!")
            console.log(err)
            return null
        })
    return energydata;
}

///  请求实时数据
export async function  getRealTimedatasById(siteID) {
    let realTimeData = null
    await fetch(`/api/datas/collectdatas/realtimedata/${siteID}`)
        .then((res) => res.json())
        .then((data) => {
            realTimeData = data
        })
        .catch(err => {
            alert("获取后台数据错误!")
            console.log(err)
            return null
        })
    return realTimeData;
}

///  请求电流序列数据
export async function  getCurrentSeriesById(siteID){
    return await fetchData(`api/datas/collectdatas/currentseriesdata/${siteID}`);
}


export async function  getEnerydataOfSomeMonthById(siteId, meterId, month) {
    let energydata = null
    await fetch(`/api/datas/energydata/${siteId}/${meterId}/${month}`)
        .then((res) => res.json())
        .then((data) => {
            energydata = data
        })
        .catch(err => {
            alert("获取后台数据错误!")
            console.log(err)
            return null
        })
    return energydata;
}


/// 请求API数据
export async function  fetchData(url){
    let data = null
    //console.log(url)
    await fetch(url)
        .then((res) => res.json())
        .then((d) => {
            data = d
        })
        .catch(err => {
            alert("获取后台数据错误!")
            console.log(err)
            return null
        })
    return data;
}