import { Tag, Badge } from 'antd'
import dayjs from "dayjs";
import { NavLink } from 'react-router-dom'
import {fetchData, getLatestEnerydataById, getRealTimedatasById} from "../Service/getDatas.jsx";
import {useLoaderData} from "react-router-dom";

export async  function stationCardsPageLoader({params}) {

    const stations = await fetchData(`/api/datas/collectdatas/sitedatas`);
    const stationValidDates = await await fetchData(`/api/datas/collectdatas/sitevaliddates`);
    let sevenDays = [];
    for (let i = 0; i < 7; i++) {
        sevenDays.push(dayjs().subtract(i, 'd'))
    }
    return {stations, stationValidDates, sevenDays}
}

const stationCardsPage = () => {
    const {stations, stationValidDates, sevenDays} = useLoaderData();


    return (
        <div className="pt-20 px-10 pb-16 office-efficiency-index station-card-text min-h-screen">
            <header className="flex flex-col text-center
          justify-center items-center mx-auto pb-16  ">
                <div className="flex items-center gap-x-4 ">
                    <h1 className=" text-4xl">全口径能耗监控分析系统（一期）</h1>
                </div>
            </header>
            <div className="flex flex-row flex-wrap gap-2
            justify-center">

                {stations.map(station => {
                    const validDays = stationValidDates
                        .filter(sv => sv.roomID === station.roomID)[0]?.dayTimeStrs ?? [];
                    const dayTags = sevenDays.map(day => {
                        const title = day.format("M-D")
                        const dayStr = day.format("YYYY-MM-DD")
                        return(
                            <Tag key={title} color={validDays.includes(dayStr) ? "#87d068": "gray"} className="shadow-md">
                                {title}
                            </Tag>
                        )
                    })
                    return (
                        <div key={station.siteID} className="bg-[#eff0ff] flex flex-col items-start
                rounded-[2rem] p-16   max-w-screen-sm text-center">
                            <NavLink to={`station/${station.siteID}/${station.meterID}`}
                                     className="text-[#2b1c50] text-xl mb-2 border-[#d1d1f7] border-b-2 pb-1 w-full">
                                {station.roomID}
                            </NavLink>
                            <p className="font-bold mb-2 w-full">近七日数据采集情况:</p>

                            <div className="grid grid-cols-3 items-center gap-1
                    border shadow-inner rounded-s p-2">
                                {/*<Tag color="#87d068" className="shadow-md">{dayjs().format("M-D")}</Tag>
                                <Tag color="gray" className="shadow-md">
                                    {dayjs().subtract(1, 'd').format("M-D")}
                                </Tag>
                                <Tag color="#87d068" className="shadow-md">7-15</Tag>
                                <Tag color="#87d068" className="shadow-md">7-14</Tag>
                                <Tag color="#87d068" className="shadow-md">7-13</Tag>
                                <Tag className="bg-lime-500
                     shadow-md text-white">7-12</Tag>
                                <Tag color="gray" className="shadow-md">7-11</Tag>*/}
                                {dayTags}
                            </div>
                            <div className=" mt-2 w-full flex justify-center items-center gap-x-2">
                                <Badge color="#87d068" count={" "}></Badge>
                                <label>有数据</label>
                                <Badge color="gray" count={" "}></Badge>
                                <label>无数据</label>
                            </div>

                        </div>
                    )
                })}


            </div>
        </div>

    )
}

export default stationCardsPage
