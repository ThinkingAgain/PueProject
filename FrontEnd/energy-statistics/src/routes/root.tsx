import {
    UserOutlined,
    SettingFilled,
    LogoutOutlined,
} from '@ant-design/icons';
import { PageContainer, ProLayout, MenuDataItem } from '@ant-design/pro-components';
import { useState } from 'react';
import { ProLayoutConfig } from '../proj-config.tsx'
import {Link, Outlet} from "react-router-dom";

const Root = () => {
    const [pathname, setPathname] = useState('/list/sub-page/sub-sub-page1');

    return (
        <div id="pro-layout" style={{ height: '100vh'}}>
            <ProLayout
                siderWidth={216}
                title="能耗综合管理"
                logo="/assets/unicom.jpeg"
                bgLayoutImgList={[
                    {
                        src: '/assets/bglayout1.png',
                        left: 85,
                        bottom: 100,
                        height: '303px',
                    },
                    {
                        src: '/assets/bglayout2.jpg',
                        bottom: -68,
                        right: -45,
                        height: '303px',
                    },
                    {
                        src: '/assets/bglayout3.png',
                        bottom: 0,
                        left: 0,
                        width: '331px',
                    },

                ]}
                {...ProLayoutConfig}

                location={{
                    pathname,
                }}
                avatarProps={{
                    className: "bg-blue-500",
                    icon: <UserOutlined />,
                    title: '用户',
                    size: 'small',
                }}
                actionsRender={(props) => {
                    if (props.isMobile) return [];
                    return [
                        <SettingFilled key="SettingFilled"/>,
                        <LogoutOutlined key="LogoutOutlined"/>,
                    ];
                }}
                menuItemRender={(item:MenuDataItem, dom, props) => {
                    return (
                        <div className=""
                             onClick={() => {
                                 setPathname(item.path || '/welcome');
                             }}
                        >
                            <Link to={(props.route?.path?? "/alltheother/energy-statistics") + (item.path ?? "/")}>
                                {dom}
                            </Link>


                        </div>
                    )}}



            >
                <PageContainer>
                    {/*<ProCard className="bg-gray-100"
                        style={{
                            height: '100vh',
                            minHeight: 800,
                        }}
                    >*/}
                    {/*<PTable1 />*/}
                    {/*</ProCard>*/}
                    <Outlet />
                </PageContainer>
            </ProLayout>
        </div>
    );
};

export default Root