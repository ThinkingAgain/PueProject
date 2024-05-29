import MainPage from "./Page/MainPage";
import StationPage, {stationLoader} from "./Page/StationPage";

const routerConfig = [
    {
        path: "/",
        element: <MainPage/>,
        errorElement: <div>错误!</div>,
    },
    {
        path: "station/:siteId/:meterId",
        element: <StationPage />,
        loader: stationLoader,
    }

]

export default routerConfig