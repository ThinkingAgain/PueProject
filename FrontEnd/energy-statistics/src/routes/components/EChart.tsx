import {useEffect, useRef} from "react";
import * as echarts from "echarts";

const EChart:(a: {option:echarts.EChartsCoreOption,}) => JSX.Element = ({option}) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chart = echarts.init(chartRef.current);
        chart.setOption(option);

        return () => {
            chart.dispose();    // 清理chart实例
        };
    }, [option]);

    return(
        <>
            <div ref={chartRef}  style={{ width: '100%', height: '100%' }}></div>
        </>

    );

};

export default EChart