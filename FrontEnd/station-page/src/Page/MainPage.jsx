import { Link, NavLink } from 'react-router-dom'
export default  function MainPage () {
    return (
        <>
            <div className="container" style={{width: "300px", paddingTop: "30vh"}}>
            <div className="list-group">

                <NavLink to="station/146502/277041" className="list-group-item h4 text-center">东昌 - 闫寺</NavLink>
                <NavLink to="station/146167/276709" className="list-group-item h4 text-center">茌平 - 博平</NavLink>

            </div>
            </div>
        </>

    )
}