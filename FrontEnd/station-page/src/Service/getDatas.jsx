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