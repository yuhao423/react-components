import { useEffect, useState } from "react"
import EchartView from "../EchartView"

interface PieProps {
    pieData: PieItemProp[]
}
interface PieItemProp {
    name: string;
    value: number;
    itemStyle?: {
        color: string;
        opacity?: number;
    };
}
const TestPie: React.FC<PieProps> = (props) => {

    const { pieData = [] } = props
    // const [data,setData] = useState(data)
    useEffect(() => {
        getPie3D(pieData, 0.8)
    }, [pieData])
    const getParametricEquation = (startRatio: number, endRatio: number, isSelected: boolean, isHovered: boolean, k: number, h: number) => {
        const midRatio = (startRatio + endRatio) / 2;
        const startRadian = startRatio * Math.PI * 2;
        const endRadian = endRatio * Math.PI * 2;
        const midRadian = midRatio * Math.PI * 2;

        if (startRatio === 0 && endRatio === 1) {
            isSelected = false;
        }

        k = k !== undefined ? k : 1 / 3;
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
            x: (u: number, v: number) => {
                if (u < startRadian) {
                    return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                if (u > endRadian) {
                    return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
            },
            y: (u: number, v: number) => {
                if (u < startRadian) {
                    return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                if (u > endRadian) {
                    return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
            },
            z: (u: number, v: number) => {
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
    //函数
    const formatFloat = (num: number, n: number) => {
        const f = parseFloat(num.toString());
        if (isNaN(f)) return false;
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
    //
    const getHeight3D = (series: any[], height: number) => {
        series.sort((a, b) => b.pieData.value - a.pieData.value);
        return (height * 25) / series[0].pieData.value;
    };


    const getPie3D = (data: any[], internalDiameterRatio: number) => {
        //internalDiameterRatio:透明的空心占比
        let that = this;
        let series = [];
        let sumValue = 0;
        let startValue = 0;
        let endValue = 0;
        let legendData = [];
        let legendBfb = [];
        let k = 1 - internalDiameterRatio;
        pieData.sort((a, b) => {
            return (b.value - a.value);
        });
        // 为每一个饼图数据，生成一个 series-surface 配置
        for (let i = 0; i < pieData.length; i++) {
            sumValue += pieData[i].value;
            let seriesItem :any = {
                name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
                type: 'surface',
                parametric: true,
                wireframe: {
                    show: false
                },
                pieData: pieData[i],
                pieStatus: {
                    selected: false,
                    hovered: false,
                    k: k
                },
                center: ['50%', '50%']
            };

            // if (typeof pieData[i].itemStyle != 'undefined') {
            //     let itemStyle = {} as PieItemProp;
            //     typeof pieData[i]?.itemStyle.color != 'undefined' ? itemStyle.color = pieData[i].itemStyle.color : null;
            //     typeof pieData[i].itemStyle.opacity != 'undefined' ? itemStyle.opacity = pieData[i].itemStyle.opacity : null;
            //     seriesItem.itemStyle = itemStyle;
            // }
            if(pieData[i].itemStyle){
                //自定义颜色的
                seriesItem.itemStyle = {
                    color:pieData[i]?.itemStyle?.color || 'yellow',
                    opacity:pieData[i]?.itemStyle?.opacity ?? 1,

                }
            }
            series.push(seriesItem);
        }
        // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
                // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
                legendData = [];
                legendBfb = [];
                for (let i = 0; i < series.length; i++) {
                    endValue = startValue + series[i].pieData.value;
                    series[i].pieData.startRatio = startValue / sumValue;
                    series[i].pieData.endRatio = endValue / sumValue;
                    series[i].parametricEquation = getParametricEquation(series[i].pieData.startRatio, series[i].pieData.endRatio,
                        false, false, k, series[i].pieData.value);
                    startValue = endValue;
                    let bfb = formatFloat(series[i].pieData.value / sumValue, 4);
                    legendData.push({
                        name: series[i].name,
                        value: bfb
                    });
                    legendBfb.push({
                        name: series[i].name,
                        value: bfb
                    });
                }
                let boxHeight = getHeight3D(series, 26);//通过传参设定3d饼/环的高度，26代表26px
                // 准备待返回的配置项，把准备好的 legendData、series 传入。
                const option = {
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
                        formatter: (param: any) => {
                            const item:any = legendBfb.find(item => item.name === param);
                            const bfs = formatFloat(item.value * 100, 2) + '%';
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
                        formatter: (params: any) => {
                            if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
                                const bfb = ((option.series[params.seriesIndex].pieData.endRatio - option.series[params.seriesIndex].pieData.startRatio) * 100).toFixed(2);
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
        
                return option;
    }

    return (
        <EchartView></EchartView>
    )
}