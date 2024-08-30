import {RouteObject} from "react-router-dom";
import {
    ChromeFilled,
    DashboardTwoTone,
    AlertTwoTone,
    ThunderboltTwoTone,
} from '@ant-design/icons';
import Root from "./routes/root.tsx";
import SiteStatement from "./routes/SiteStatement.tsx";
import NonproductiveAlarm from "./routes/NonproductiveAlarm.tsx";
import RealTimeStatement from "./routes/RealTimeStatement.tsx";

export const BrowserRouterConfig: RouteObject[] = [
    {
        path: "/alltheother/energy-statistics",
        element: <Root />,
        children:[
            {
                path: 'dashboard',//"table/0/",
                element: <>欢迎!</>
            },
            {
                path: 'site-energy',//"table/0/",
                element: <SiteStatement />
            },
            {
                path: 'energy-alarm',//"table/1/",
                element: <NonproductiveAlarm />
            },
            {
                path: 'real-time-energy',//"table/1/",
                element: <RealTimeStatement />
            },

        ]

    },


]

export const ProLayoutConfig = {
    route: {
        path: '/alltheother/energy-statistics',
        routes: [
            {
                path: 'dashboard',
                name: '主页',
                icon: <DashboardTwoTone />,
                component: './Welcome',
            },
            {
                path: 'site-energy',
                name: '全市站点用电量',
                icon: <ThunderboltTwoTone />,
                access: 'canAdmin',
                component: './Admin',
            },
            {
                path: 'energy-alarm',
                name: '办公营业用电预警',
                icon: <AlertTwoTone />,
                component: './ListTableList',

            },
            {
                path: 'real-time-energy',
                name: '站点实时用电量',
                icon: <ThunderboltTwoTone />,
                access: 'canAdmin',
                component: './Admin',
            },
            {
                path: '/',
                name: '全量能耗监测大屏',
                icon: <ChromeFilled />,
            },
        ],
    },

    location: {
        pathname: '/',
    },
    appList: [
        {
            icon: "/assets/chart.jpeg",
            title: '全量能耗监测大屏',
            desc: '全量能耗监测与分析的大屏展示',
            url: 'https://176.16.1.100',
        },
    ],
};