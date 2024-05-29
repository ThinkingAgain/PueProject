import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routerConfig from "./routerConfig";

const router = createBrowserRouter(routerConfig)

function App() {
    return(
        <RouterProvider router={router} />
    )
}

export default App
