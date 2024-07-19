import { Link, NavLink } from 'react-router-dom'
export default  function MainPage () {
    return (
        <>
            <div className="container" style={{width: "300px", paddingTop: "30vh"}}>
            <div className="list-group">

                <NavLink to="station/146503/277042" className="list-group-item h4 text-center">东昌 - 白洼驻地</NavLink>
                <NavLink to="station/234582/360370" className="list-group-item h4 text-center">临清 - 大辛庄营业部</NavLink>
                <NavLink to="station/150025/280594" className="list-group-item h4 text-center">阳谷 - 闫楼支局</NavLink>

            </div>
            </div>
        </>

    )
}