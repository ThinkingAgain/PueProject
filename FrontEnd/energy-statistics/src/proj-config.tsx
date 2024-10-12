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
import CoreSite from "./routes/CoreSite.tsx";
import Level2SiteAlarm from "./routes/Level2SiteAlarm.tsx";
import Level2SiteRealTime from "./routes/Level2SiteRealTime.tsx";

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
                path: 'core-site',//"table/0/",
                element: <CoreSite />
            },
            {
                path: 'site-energy',//"table/0/",
                element: <SiteStatement />
            },
            {
                path: 'energy-alarm',//"table/1/",
                children: [
                    {
                        path: 'stations',
                        element: <NonproductiveAlarm />,
                    },
                    {
                        path: 'sites',
                        element: <Level2SiteAlarm />,
                    },
                ],
            },
            {
                path: 'real-time-energy',//"table/1/",
                //element: <RealTimeStatement />,
                children: [
                    {
                        path: 'stations',
                        element: <RealTimeStatement />,
                    },
                    {
                        path: 'sites',
                        element: <Level2SiteRealTime />,
                    },
                ],
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
                path: 'core-site',
                name: '842',
                icon: <ThunderboltTwoTone />,
                access: 'canAdmin',
                component: './Admin',
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
                name: '非生产夜间用电量',
                icon: <AlertTwoTone />,
                routes: [
                    {
                        path: 'stations',
                        name: '局站预警表',
                        icon: <AlertTwoTone />,
                        component: './ListTableList',
                    },
                    {
                        path: 'sites',
                        name: '二级用电点预警表',
                        icon: <AlertTwoTone />,
                        component: './ListTableList',
                    },

                ],

            },
            {
                path: 'real-time-energy',
                name: '实时用电量',
                icon: <ThunderboltTwoTone />,
                access: 'canAdmin',
                //component: './Admin',
                routes: [
                    {
                        path: 'stations',
                        name: '局站用电量',
                        icon: <AlertTwoTone />,
                        component: './ListTableList',
                    },
                    {
                        path: 'sites',
                        name: '二级用电点用电量',
                        icon: <AlertTwoTone />,
                        component: './ListTableList',
                    },

                ],
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