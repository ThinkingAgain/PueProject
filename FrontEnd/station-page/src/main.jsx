import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from "antd";
import locale from 'antd/locale/zh_CN'
import 'dayjs/locale/zh-cn'

import App from './App.jsx'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider locale={locale}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
