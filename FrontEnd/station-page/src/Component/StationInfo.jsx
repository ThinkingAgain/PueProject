
export default function StationInfo({ stationInfoData }) {
    const { title, data } = stationInfoData

    return (
        <div className="col-info">
            <div className="title">{title}</div>
            <div className="content staff-info" id="staff-info">
                <div className='swiper-container visual_swiper_staffInfo'>
                    <div className='swiper-wrapper'>
                    </div>
                </div>
            </div>
        </div>
    )
}