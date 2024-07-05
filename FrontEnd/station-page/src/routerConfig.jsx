import MainPage from "./Page/MainPage";
import StationMonitor, {stationMonitorLoader} from "./Page/StationMonitor.jsx";
import HistoryAnalysis, {historyAnalysisLoader} from "./Page/HistoryAnalysis.jsx";

const routerConfig = [
    {
        path: "/",
        element: <MainPage/>,
        errorElement: <div>错误!</div>,
    },
    {
        path: "station/:siteID/:meterID",
        element: <StationMonitor />,
        loader: stationMonitorLoader,
    },
    {
        path: "history/station/:siteID/:meterID",
        element: <HistoryAnalysis />,
        loader: historyAnalysisLoader,
    }

]

export default routerConfig