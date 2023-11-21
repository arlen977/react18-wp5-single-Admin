import React, { useRef, useEffect } from "react";
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

/**
 *折线图
 *
 * @return {*}
 */
const Echart = props => {
    const { options, style } = props;
    const chartRef = useRef();
    const myChart = useRef();
    const resizeEcharts = () => {
        myChart.current && myChart.current.resize();
    };

    useEffect(() => {
        myChart.current = echarts.init(chartRef.current);
        window.addEventListener("resize", resizeEcharts);
        return () => {
            window.removeEventListener("resize", resizeEcharts);
            if (myChart.current) {
                myChart.current.dispose();
            }
        };
    }, []);

    useEffect(() => {
        myChart.current && myChart.current.setOption(options);
    }, [myChart, options]);

    return <div ref={chartRef} className="default-charts" style={style} />;
};

export default Echart;
