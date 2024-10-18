
/**
 * 1. https://code.juejin.cn/pen/7239270841731514428
 * 2. https://blog.csdn.net/mmmmmmmmzw/article/details/134052740
 */
// import React, { useState } from 'react'
// import './index.css'
// import * as echarts from "echarts";
// import 'echarts-gl';
// const EchartPie = (props) => {
//     console.log(echarts,'sb');
//     const [optionData,setOptionData] = useState([{
//         name: '民生路统计',
//         value: 10000,
//         itemStyle: {
//             color: '#22c4ff',
//         }
//     }, {
//         name: '金桥路统计',
//         value: 12116,
//         itemStyle: {
//             color: '#aaff00'
//         }
//     }, {
//         name: '世纪大道统计',
//         value: 16616,
//         itemStyle: {
//             color: '#ffaaff'
//         }
//     }],)


//     return (
        // <div className="water-eval-container">
        //     <div className="cityGreenLand-charts" id="cityGreenLand-charts">
        //     </div>
        // </div>
//     )
// }
import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl';
import './index.css'
const CityGreenLand = () => {
    const chartRef = useRef(null);
    const [optionData] = useState([
        {
            name: '民生路统计',
            value: 10000,
            itemStyle: {
                color: '#22c4ff',
            },
        },
        {
            name: '金桥路统计',
            value: 12116,
            itemStyle: {
                color: '#aaff00',
            },
        },
        {
            name: '世纪大道统计',
            value: 16616,
            itemStyle: {
                color: '#ffaaff',
            },
        },
    ]);
    const [option, setOption] = useState({});

    useEffect(() => {
        if(chartRef.current){
            const myChart = echarts.init(chartRef.current);
        const initialOption = getPie3D(optionData, 0.8);
        myChart.setOption(initialOption);
        setOption(initialOption);
        bindListen(myChart);
        return () => {
            myChart.dispose();
        };
        }
    }, [optionData]);

    const getPie3D = (pieData, internalDiameterRatio) => {
        let series = [];
        let sumValue = 0;
        let startValue = 0;
        let endValue = 0;
        let legendData = [];
        let legendBfb = [];
        let k = 1 - internalDiameterRatio;

        pieData.sort((a, b) => b.value - a.value);

        for (let i = 0; i < pieData.length; i++) {
            sumValue += pieData[i].value;
            let seriesItem = {
                name: pieData[i].name || `series${i}`,
                type: 'surface',
                parametric: true,
                wireframe: {
                    show: false,
                },
                pieData: pieData[i],
                pieStatus: {
                    selected: false,
                    hovered: false,
                    k: k,
                },
                center: ['50%', '50%'],
                itemStyle: pieData[i].itemStyle,
            };
            series.push(seriesItem);
        }

        legendData = [];
        legendBfb = [];
        for (let i = 0; i < series.length; i++) {
            endValue = startValue + series[i].pieData.value;
            series[i].pieData.startRatio = startValue / sumValue;
            series[i].pieData.endRatio = endValue / sumValue;
            series[i].parametricEquation = getParametricEquation(
                series[i].pieData.startRatio,
                series[i].pieData.endRatio,
                false,
                false,
                k,
                series[i].pieData.value
            );
            startValue = endValue;
            let bfb = fomatFloat(series[i].pieData.value / sumValue, 4);
            legendData.push({
                name: series[i].name,
                value: bfb,
            });
            legendBfb.push({
                name: series[i].name,
                value: bfb,
            });
        }

        const boxHeight = getHeight3D(series, 26);

        return {
            legend: {
                data: legendData,
                orient: 'horizontal',
                left: 10,
                top: 10,
                itemGap: 10,
                textStyle: {
                    color: '#A1E2FF',
                },
                show: true,
                icon: 'circle',
                formatter: function(param) {
                    const item = legendBfb.filter(item => item.name === param)[0];
                    const bfs = fomatFloat(item.value * 100, 2) + '%';
                    return `${item.name}  ${bfs}`;
                },
            },
            labelLine: {
                show: true,
                lineStyle: {
                    color: '#7BC0CB',
                },
            },
            label: {
                show: true,
                position: 'outside',
                rich: {
                    b: {
                        color: '#7BC0CB',
                        fontSize: 12,
                        lineHeight: 20,
                    },
                    c: {
                        fontSize: 16,
                    },
                },
                formatter: '{b|{b} \n}{c|{c}}{b|  条}',
            },
            tooltip: {
                formatter: params => {
                    if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
                        const bfb =
                            ((option.series[params.seriesIndex].pieData.endRatio - option.series[params.seriesIndex].pieData.startRatio) * 100).toFixed(2);
                        return `${params.seriesName}<br/>` +
                            `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>` +
                            `${bfb}%`;
                    }
                },
            },
            xAxis3D: {
                min: -1,
                max: 1,
            },
            yAxis3D: {
                min: -1,
                max: 1,
            },
            zAxis3D: {
                min: -1,
                max: 1,
            },
            grid3D: {
                show: false,
                boxHeight: boxHeight,
                viewControl: {
                    alpha: 40,
                    distance: 300,
                    rotateSensitivity: 0,
                    zoomSensitivity: 0,
                    panSensitivity: 0,
                    autoRotate: true,
                },
            },
            series: series,
        };
    };

    const getHeight3D = (series, height) => {
        series.sort((a, b) => b.pieData.value - a.pieData.value);
        return (height * 25) / series[0].pieData.value;
    };

    const getParametricEquation = (startRatio, endRatio, isSelected, isHovered, k, h) => {
        const midRatio = (startRatio + endRatio) / 2;
        const startRadian = startRatio * Math.PI * 2;
        const endRadian = endRatio * Math.PI * 2;
        const midRadian = midRatio * Math.PI * 2;
        if (startRatio === 0 && endRatio === 1) {
            isSelected = false;
        }
        k = typeof k !== 'undefined' ? k : 1 / 3;
        const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
        const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
        const hoverRate = isHovered ? 1.05 : 1;

        return {
            u: {
                min: -Math.PI,
                max: Math.PI * 3,
                step: Math.PI / 32,
            },
            v: {
                min: 0,
                max: Math.PI * 2,
                step: Math.PI / 20,
            },
            x: (u, v) => {
                if (u < startRadian) {
                    return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                if (u > endRadian) {
                    return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
            },
            y: (u, v) => {
                if (u < startRadian) {
                    return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                if (u > endRadian) {
                    return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
            },
            z: (u, v) => {
                if (u < -Math.PI * 0.5) {
                    return Math.sin(u);
                }
                if (u > Math.PI * 2.5) {
                    return Math.sin(u) * h * 0.1;
                }
                return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
            },
        };
    };

    const fomatFloat = (num, n) => {
        const f = parseFloat(num);
        if (isNaN(f)) {
            return false;
        }
        const rounded = Math.round(num * Math.pow(10, n)) / Math.pow(10, n);
        let s = rounded.toString();
        let rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + n) {
            s += '0';
        }
        return s;
    };

    const bindListen = (myChart) => {
        let selectedIndex = '';
        let hoveredIndex = '';

        myChart.on('click', function (params) {
            const isSelected = !option.series[params.seriesIndex].pieStatus.selected;
            const isHovered = option.series[params.seriesIndex].pieStatus.hovered;
            selectedIndex = isSelected ? params.seriesIndex : '';
            hoveredIndex = isHovered ? params.seriesIndex : '';
            option.series[params.seriesIndex].pieStatus.selected = isSelected;
            option.series[params.seriesIndex].pieStatus.hovered = !isHovered;

            myChart.setOption(getPie3D(optionData, 0.8));
        });

        myChart.on('mouseover', function (params) {
            hoveredIndex = params.seriesIndex;
            option.series[hoveredIndex].pieStatus.hovered = true;
            myChart.setOption(getPie3D(optionData, 0.8));
        });

        myChart.on('mouseout', function (params) {
            hoveredIndex = params.seriesIndex;
            option.series[hoveredIndex].pieStatus.hovered = false;
            myChart.setOption(getPie3D(optionData, 0.8));
        });
    };

    return (
        <div className="water-eval-container">
            <div className="cityGreenLand-charts" id="cityGreenLand-charts">
            </div>
        </div>
    );
};

export default CityGreenLand;
