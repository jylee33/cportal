/**
 * Created by freehan on 2019-09-02.
 */
var HmHighchart = {

    setOptions: function () {
        Highcharts.setOptions({
            time: {
                useUTC: false
            },
            lang: {
                months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                shortMonths: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                weekdays: ['일', '월', '화', '수', '목', '금', '토'],
                noData: '조회된 데이터가 없습니다.',
                loading: '조회중입니다.',
                printChart: '인쇄'
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            colors: ['#7786D8', '#64B2F8', '#78D2C7', '#B7DB89', '#DDE74D', '#D781B9', '#AB93C5', '#2A398B', '#1765AB', '#2B857A', '#6A8E3C', '#909A00', '#8A346C', '#5E4678']
        });

        /**
         * Experimental Highcharts plugin to implement chart.alignThreshold option.
         * Author: Torstein Hønsi
         * Last revision: 2013-12-02
         */
        (function (H) {
            var each = H.each;
            H.wrap(H.Chart.prototype, 'adjustTickAmounts', function (proceed) {
                var ticksBelowThreshold = 0,
                    ticksAboveThreshold = 0;
                console.log('tick');
                console.log(this.options.chart.alignThresholds);
                if (this.options.chart.alignThresholds) {
                    each(this.yAxis, function (axis) {
                        var threshold = axis.series[0] && axis.series[0].options.threshold || 0,
                            index = axis.tickPositions && axis.tickPositions.indexOf(threshold);

                        if (index !== undefined && index !== -1) {
                            axis.ticksBelowThreshold = index;
                            axis.ticksAboveThreshold = axis.tickPositions.length - index;
                            ticksBelowThreshold = Math.max(ticksBelowThreshold, index);
                            ticksAboveThreshold = Math.max(ticksAboveThreshold, axis.ticksAboveThreshold);
                        }
                    });

                    each(this.yAxis, function (axis) {

                        var tickPositions = axis.tickPositions;
                        if (tickPositions) {

                            if (axis.ticksAboveThreshold < ticksAboveThreshold) {
                                while (axis.ticksAboveThreshold < ticksAboveThreshold) {
                                    tickPositions.push(
                                        tickPositions[tickPositions.length - 1] + axis.tickInterval);
                                    axis.ticksAboveThreshold++;
                                }
                            }

                            if (axis.ticksBelowThreshold < ticksBelowThreshold) {
                                while (axis.ticksBelowThreshold < ticksBelowThreshold) {
                                    tickPositions.unshift(
                                        tickPositions[0] - axis.tickInterval);
                                    axis.ticksBelowThreshold++;
                                }

                            }
                            //axis.transA *= (calculatedTickAmount - 1) / (tickAmount - 1);
                            axis.min = tickPositions[0];
                            axis.max = tickPositions[tickPositions.length - 1];
                        }
                    });
                } else {
                    proceed.call(this);
                }

            })
        }(Highcharts));
    },

    getDefaultOptions: function ($chart) {
        return {
            colors: ['#7786D8', '#78D2C7', '#64B2F8', '#B7DB89', '#DDE74D', '#D781B9', '#AB93C5', '#2A398B', '#1765AB', '#2B857A', '#6A8E3C', '#909A00', '#8A346C', '#5E4678'],
            centerTitle: {
                text1: '',
                text1FontSize: 32
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: false
                    }
                },
                pie: {
                    dataLabels: {
                        enabled: false
                    }
                }
            }
        }
    },

    create: function (chart, options, ctxmenuType, ctxmenuIdx, callback) {
        HmHighchart.setOptions();
        var defOpts = this.getDefaultOptions(chart);
        $.extend(defOpts, options);
        var ch = Highcharts.chart(chart, defOpts, callback);
        if (ctxmenuType === undefined) ctxmenuType = CtxMenu.NONE;
        if (ctxmenuIdx === undefined) ctxmenuIdx = '';
        CtxMenu.createHighchart(ch, ctxmenuType, ctxmenuIdx);
        return ch;
    },

    /**
     * 날짜 변환. Highchart 에서 사용하는 형태로 변경. (String -> Date.UTC)
     * @param val : 날짜 형태가 (YYYY-MM-DD HH:mm:ss 형태거나 구분자 없는것만 체크)
     */
    setting_dt_convert: function (val) {
        var rtnTxt = val;
        // "20170317091210"
        if (val != null) {
            var tem_dt = HmHighchart.change_date(val);
            var yyyy = tem_dt.getFullYear();
            var mm = tem_dt.getMonth();
            var dd = tem_dt.getDate();
            var hh = tem_dt.getHours();
            var ii = tem_dt.getMinutes();
            var ss = tem_dt.getSeconds();
            rtnTxt = Date.UTC(yyyy, mm, dd, hh, ii, ss);
        }
        return rtnTxt;
    },

    /**
     * 날짜 변환. (String -> Date)
     * @param val : 날짜 형태가 (YYYY-MM-DD HH:mm
     * */
    change_date: function (val) {
        var dd = new Date();

        var chgVal = val.replace(/-/gi, "");
        chgVal = chgVal.replace(/:/gi, "");
        chgVal = chgVal.replace(/ /gi, "");

        var yyyy = chgVal.substr(0, 4);
        var mm = chgVal.substr(4, 2) - 1;
        var dd = chgVal.substr(6, 2);
        var hh = chgVal.substr(8, 2);
        var mi = chgVal.substr(10, 2);
        var ss = chgVal.substr(12, 2);

        return new Date(yyyy, mm, dd, hh, mi, ss);

    },

    /**
     * 날짜 변환. (Date -> String)
     * @param val : 날짜 데이터
     * @param day_sp : 일자 구분자
     * @param dt_time_sp : 일자와 시간사이 구분자
     * @param time_sp : 시간 구분자
     * @param misecFlag : 밀리세컨 표시여부(true:표시)
     * @param misec_sp : 시간과 밀리세컨 사이 구분자
     * */
    getConvertTime: function (setDate, day_sp, dt_time_sp, time_sp, misecFlag, misec_sp) {
        var dat_split = "", dt_time_split = "_", time_split = "";
        var misec_split = "  ";

        try {
            if (day_sp != null) dat_split = day_sp;
        } catch (e) {
//    		console.log("day_sp err", e, day_sp, dt_time_sp, time_sp);
        }
        try {
            if (dt_time_sp != null) dt_time_split = dt_time_sp;
        } catch (e) {
//    		console.log("dt_time_sp err", e, day_sp, dt_time_sp, time_sp);
        }
        try {
            if (time_sp != null) time_split = time_sp;
        } catch (e) {
//    		console.log("time_sp err", e , day_sp, dt_time_sp, time_sp);
        }
        try {
            if (misec_sp != null) misec_split = misec_sp;
        } catch (e) {
        }

        var now = setDate;
        var year = now.getFullYear();

        var month = now.getMonth() + 1;
        if ((month + "").length < 2) month = "0" + month;

        var now_date = now.getDate();
        if ((now_date + "").length < 2) now_date = "0" + now_date;

        var now_hour = now.getHours();
        if ((now_hour + "").length < 2) now_hour = "0" + now_hour;
        var now_min = now.getMinutes();
        if ((now_min + "").length < 2) now_min = "0" + now_min;
        var now_sec = now.getSeconds();
        if ((now_sec + "").length < 2) now_sec = "0" + now_sec;

        var now_time = year + dat_split + month + dat_split + now_date
            + dt_time_split + now_hour + time_split + now_min + time_split + now_sec;

        if (misecFlag == true) {

            now_time += misec_split + now.getMilliseconds();
        }

        return now_time;
    },

    resetPieCenterText: function (chart, idx) {
        var text1 = chart.options.centerTitle.text1;
        var text1FontSize = chart.options.centerTitle.text1FontSize;

        idx = "_" + idx;
        var chartid = chart.container.parentElement.id;
        $("#" + chartid + idx).remove();
        $("#" + chartid).append('<div id="' + chartid + idx + '" style="width: 100%; height: 100%;"></div>');

        var textX = chart.plotLeft + (chart.plotWidth * 0.5);
        var textY = chart.plotTop + (chart.plotHeight * 0.5);

        var span = '<span id="' + chartid + idx + "_title" + '" style="position:absolute; text-align:center;">';
        span += '<span style="font-size: ' + text1FontSize + 'px">' + text1 + '</span><br>';
        span += '</span>';

        $("#" + chartid + idx).append(span);
        span = $('#' + chartid + idx + "_title");
        span.css('left', textX + (span.width() * -0.5));
        span.css('top', textY + (span.height() * -0.5));
    },

    /** chart type */
    TYPE_LINE: 'line',
    TYPE_SPLINE: 'spline',
    TYPE_AREA: 'area',
    TYPE_AREASPLINE: 'areaspline',
    TYPE_COLUMN: 'column',
    TYPE_BAR: 'bar',
    TYPE_PIE: 'pie',
    TYPE_SOLIDGAUGE: 'solidgauge',
    TYPE_SCATTER: 'scatter',
    TYPE_NETWORK: 'networkgraph',

    X_TYPE_LINEAR: 'linear',
    X_TYPE_LOGARITHMIC: 'logarithmic',
    X_TYPE_DATETIME: 'datetime',
    X_TYPE_CATEGORY: 'category',

    /** 공통 옵션 */
    getCommOptions: function (chartType) {
        var options = {
            chart: {
                type: chartType,
                zoomType: 'x',
                resetZoomButton: {
                    //relativeTo: 'chart'
                    position: {
                        verticalAlign: 'top',
                        x: 0,
                        y: 0
                    }
                },
                reflow: true,
                alignTicks: false,
                alignThresholds: true,		// 차트 multiple axes 사용시 centor 맞추기
                ignoreHiddenSeries: true,	// 차트 series show/hide시 no redraw (If true, the axes will scale to the remaining visible series once one series is hidden)
                events: {
                    load: function () {
                        try {
                            this.hideNoData();  // hide no data message
                        } catch (err) {
                        }
                        try {
//			                	this.showLoading();  // show loading message
                        } catch (err) {
                        }
                    },
                    redraw: function () {
                        try {
                            this.hideNoData();  // hide no data message
                        } catch (err) {
                        }
                        try {
                            this.hideLoading();  // hide loading message
                        } catch (err) {
                        }
                    }
                }
            },
            noData: {
                style: {fontSize: '12px', fontWeight: 'normal', color: '#000000', zIndex: 999}
            },
            // colors: ['#7786D8', '#64B2F8', '#78D2C7', '#B7DB89', '#DDE74D', '#D781B9', '#AB93C5', '#2A398B', '#1765AB', '#2B857A', '#6A8E3C', '#909A00', '#8A346C', '#5E4678'],
            // colors: ['#1CA3E3', '#E7E707', '#2BA043', '#FF7515', '#a45ace', '#003499', '#ba8e6a', '#e585b0', '#a8022d'],
            title: {
                text: null
            },
            subtitle: {
                text: null
            },
            legend: {
                enabled: true
            },
            credits: {
                enabled: false
            },
            tooltip: {
                crosshairs: true,
                shared: true
            },
            yAxis: {
                tickAmount: 8,
                labels: {}
            },
            xAxis: {
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%m/%d',
                    week: '%b-%d',
                    month: '%y-%b',
                    year: '%Y'
                }
            },
            exporting: {
                enabled: false
            }
        };
        switch (chartType) {
            case HmHighchart.TYPE_LINE:
                options.plotOptions = {
                    line: {
                        lineWidth: 1,
                        marker: {
                            enabled: false
                        },
                        connectNulls: false
                    }
                };
                break;
            case HmHighchart.TYPE_AREA:
                options.plotOptions = {
                    area: {
                        marker: {
                            radius: 1
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        fillOpacity: .8,
                        connectNulls: false
//					threshold: 0
                    }
                };
                break;
            case HmHighchart.TYPE_NETWORK:
                options.plotOptions = {
                    networkgraph: {
                        keys: ['from', 'to'],
                        layoutAlgorithm: {
                            enableSimulation: true,
                            friction: -0.9
                        }
                    }
                };
                break;
        }
        return options;
    },
    /** y-axis formatter unit1000 */
    unit1000Formatter: function () {
        return HmUtil.convertUnit1000(this.value);
    },

    /** y-axis formatter unit1024 */
    unit1024Formatter: function () {
        return HmUtil.convertUnit1024(this.value);
    },
    /** tooltip formatter unit1000 */
    unit1000TooltipFormatter: function (dateFormat) {
        var s = '<b>' + $.format.date(new Date(this.x), 'yyyy-MM-dd HH:mm') + '</b>';
        $.each(this.points, function () {
            s += '<br/>' + this.series.name + ': ' + HmUtil.convertUnit1000(this.y);
        });
        return s;
    },

    /** y-axis formatter unit1000 */
    absUnit1000Formatter: function () {
        return HmUtil.convertUnit1000(Math.abs(this.value));
    },

    /** y-axis formatter unit1024 */
    absUnit1024Formatter: function () {
        return HmUtil.convertUnit1024(Math.abs(this.value));
    },

    /** tooltip formatter unit1000 */
    absUnit1000TooltipFormatter: function (dateFormat) {
        var s = '<b>' + $.format.date(new Date(this.x), 'yyyy-MM-dd HH:mm') + '</b>';
        $.each(this.points, function () {
            s += '<br/>' + this.series.name + ': ' + HmUtil.convertUnit1000(this.y).replace('- ', '');
        });
        return s;
    },

    absUnit1024TooltipFormatter: function (dateFormat) {
        var s = '<b>' + $.format.date(new Date(this.x), 'yyyy-MM-dd HH:mm') + '</b>';
        $.each(this.points, function () {
            s += '<br/>' + this.series.name + ': ' + HmUtil.convertUnit1024(this.y).replace('- ', '');
        });
        return s;
    },

    /** tooltip formatter unit1024 */
    unit1024TooltipFormatter: function (dateFormat) {
        var s = '<b>' + $.format.date(new Date(this.x), 'yyyy-MM-dd HH:mm') + '</b>';
        $.each(this.points, function () {
            s += '<br/>' + this.series.name + ': ' + HmUtil.convertUnit1024(this.y);
        });
        return s;
    },
    /** 차트 생성 */
    create2: function (chartId, options, chartType) {
        this.setOptions();
        var defOpts = this.getCommOptions(chartType);
        $.extend(defOpts, options);
        return Highcharts.chart(chartId, defOpts);
    },

    /** 차트 yAxis의 0값을 센터에 맞춘다. max/min 값을 큰값으로 설정 */
    centerThreshold: function (chart) {
        if (chart == null || chart.yAxis == null) return;
        var isUpdate = false;
        var yAxisCnt = chart.yAxis.length;
        var stime = new Date().getTime();
        for (var i = 0; i < yAxisCnt; i++) {
//				console.log(chart.yAxis[i]);
            var ext = chart.yAxis[i].getExtremes();
            if (ext.max != undefined && ext.min != undefined) {
                var dMax = Math.abs(ext.dataMax == null ? ext.max : ext.dataMax);
                var dMin = Math.abs(ext.dataMin == null ? ext.min : ext.dataMin);
//			    	var dMax = Math.abs(ext.dataMax || 0);
//			    	var dMin = Math.abs(ext.datamin || 0);
                var dExt = dMax >= dMin ? dMax : dMin;
                var min = 0 - dExt;
//			    	if(ext.max != dExt) {
                chart.yAxis[i].options.min = min;
                chart.yAxis[i].options.max = dExt;
                if (i == (yAxisCnt - 1)) {
                    chart.yAxis[i].setExtremes(min, dExt, true);
                }
                else {
                    chart.yAxis[i].setExtremes(min, dExt, false);
                }
//		    		}
            }
//			    console.log(chart.yAxis[i].getExtremes());
        }
//			chart.redraw(true);
    },

    /**
     *
     * @param c        chart
     * @param flag        true | false
     */
    reAnimate: function (c, flag) {
        var H = Highcharts;
        // store animation:
        var seriesAnimate = H.Series.prototype.animate;
        var columnAnimate = H.seriesTypes.column.prototype.animate;
        var pieAnimate = H.seriesTypes.pie.prototype.animate;

        // run animation again: tested with line chart only
        H.each(c.series, function (s) {
            if (animation && !(animation && typeof animation === 'object')) {
                animation = H.defaultPlotOptions[series.type].animation;
            }
            var animation = s.options.animation,
                clipBox = s.clipBox || c.clipBox,
                sharedClipKey = ['_sharedClip', animation.duration, animation.easing, clipBox.height].join(','),
                clipRect = c[sharedClipKey],
                markerClipRect = c[sharedClipKey + 'm'];

            if (flag) {
                if (clipRect) {
                    clipRect.attr({
                        width: 0
                    });
                }
                if (markerClipRect) {
                    markerClipRect.attr({
                        width: 0
                    });
                }
            }
            s.animate = s.type == 'pie' || s.type == 'solidgauge' ? pieAnimate
                : (s.type == 'column' ? columnAnimate : seriesAnimate);

            s.animate();
        });
    },


    /** HighStock */
    getStockOptions: function (chartType) {
        var options = {
            chart: {
                type: chartType,
                marginTop: 20,
                zoomType: 'x',
                resetZoomButton: {
                    //relativeTo: 'chart'
                    position: {
                        verticalAlign: 'top',
                        x: 0,
                        y: 0
                    },
                    theme: {
                        fill: 'white',
                        stroke: 'silver',
                        r: 0,
                        states: {
                            hover: {
                                fill: '#41739D',
                                style: {
                                    color: 'white'
                                }
                            }
                        }
                    }
                },
                reflow: true,
                alignTicks: false,
                alignThresholds: true,		// 차트 multiple axes 사용시 centor 맞추기
                ignoreHiddenSeries: true,	// 차트 series show/hide시 no redraw (If true, the axes will scale to the remaining visible series once one series is hidden)
                events: {
                    load: function () {
                        try {
                            this.hideNoData();  // hide no data message
                        } catch (err) {
                        }
                        try {
//			                	this.showLoading();  // show loading message
                        } catch (err) {
                        }
                    },
                    redraw: function () {
                        try {
                            this.hideNoData();  // hide no data message
                        } catch (err) {
                        }
                        try {
                            this.hideLoading();  // hide loading message
                        } catch (err) {
                        }
                    }
                }
            },
            noData: {
                style: {fontSize: '12px', fontWeight: 'normal', color: '#000000'}
            },
            colors: ['#85ddf4', '#f9899b', '#81e4c9', '#fcdb92', '#8fc0f6', '#f4add8', '#c2b6f1', '#3aadd9', '#d94452', '#35ba9b', '#f5b945', '#4a88da', '#d56fac', '#9579da'],
            title: {
                text: null
            },
            subtitle: {
                text: null
            },
            legend: {
                enabled: true,
            },
            credits: {
                enabled: false
            },
            tooltip: {
                shared: true
            },
            navigator: {
                enabled: false
            },
            rangeSelector: {
                enabled: false,
                inputEnabled: false
            },
            scrollbar: {
                enabled: false
            },
            plotOptions: {
                series: {
                    connectNulls: false,
                    gapSize: 1,
                    lineWidth: 1,
                    marker: {
                        enabled: false,
                        radius: 1
                    },
                    dataGrouping: {
                        enabled: false
                    }
                },
                area: {
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    fillOpacity: .4
                }
            },
            yAxis: {
                tickAmount: 8,
                opposite: false,
                showLastLabel: true
            },
            xAxis: {
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%m/%d',
                    week: '%b-%d',
                    month: '%y-%b',
                    year: '%Y'
                },
                ordinal: false
            },
            exporting: {
                enabled: true,
                // Custom definition
                menuItemDefinitions: {
                    hmViewChartData: {
                        onclick: function () {
                            HmHighchart.showChartData(this, $(event.currentTarget).text());
                        },
                        text: '데이터보기'
                    },
                    hmDownloadPNG: {
                        onclick: function () {
                            var filename = 'chart_' + $.format.date(new Date(), 'yyyyMMddHHmmssSSS');
                            HmUtil.exportHighchart(this, filename);
                        },
                        text: '다운로드'
                    }
                },
                buttons: {
                    contextButton: {
                        menuItems: ['viewFullscreen', 'hmViewChartData', 'printChart', 'hmDownloadPNG'],
                        verticalAlign: 'bottom',
                        y: -10
                    }
                }
            },
            navigation: {
                buttonOptions: {
                    enabled: true
                },
                menuItemStyle: {
                    padding: '0.3em 1em'
                }
            }
        };
        return options;
    },

    /** highstock 차트 생성 */
    createStockChart: function (chartId, options, chartType) {

        this.setOptions();
        var commOptions = this.getStockOptions(chartType);

        /**
         * split, shared, useHTML
         *  split=true, shared=true 이면 split 우선
         *  TODO split 속성이 정의되지 않으면 shared, useHTML이 적용되지만 차트의 height가 낮은 경우 툴팁이 그려지지 않는 현상이 있음 (highstock 특성)
         *  임시로 tooltip.split=false 적용하여 해결
         */
        if (options.tooltip && options.tooltip.hasOwnProperty('shared') && options.tooltip.shared) {
            options.tooltip.split = false;
        }

        /**
         * 현대해상인 경우 차트 스타일 변경
         * 5.1 버전에서 엔지니어 설정으로 변경 예정
         */
        // console.log('userOptions', options.userOptions);
        if (GlobalEnv.webSiteName == SiteEnum.HI
            && options.hasOwnProperty('userOptions')
            && options.userOptions.hasOwnProperty('chartConfig')) {
            var _chartConfig = options.userOptions.chartConfig;
            if (_chartConfig.sysCode == 'NMS' && _chartConfig.srcType == 'IF'
                && $.inArray(_chartConfig.perfType, [IfPerfType.BPS, IfPerfType.BPSPER, IfPerfType.PPS, IfPerfType.ERR]) !== -1) {
                options.series[0].type = 'line';
                options.series[0].color = '#88151d';
                options.series[1].color = '#8fd68a';
            }
        }

        /**
         * 현대해상인 경우 회선의 차트 스타일을 변경한다.
         */
        $.extend(commOptions, options);
        commOptions.yAxis.tickAmount = 5;
        return Highcharts.stockChart(chartId, commOptions);
    },

    setSeriesData: function (chartId, seriesIdx, chartData, redraw) {

        var chart = $('#' + chartId).highcharts();

        if(chart.series[seriesIdx]) {
            chart.series[seriesIdx].setData(chartData, redraw);
        }

    },

    redraw: function (chartId) {
        $('#' + chartId).highcharts().redraw();
    },

    /**
     * remove the chart and purge memory
     * @param chartId
     */
    destroyById: function (chartId) {
        $('#' + chartId).highcharts().destroy();
    },

    destroy: function (chart) {
        chart.destroy();
    },


    absUnit1000HtmlTooltipFormatter_main: function () {
        var s = '<b>' + $.format.date(new Date(this.x), 'yyyy-MM-dd HH:mm') + '</b>';
        s += '<table>';
        $.each(this.points, function () {
            s += '<tr><td style="color: ' + this.series.color + '; font-size: 10px">' + this.series.name + ':</td>' +
                '<td style="text-align: right; font-size: 12px">' + HmUtil.convertUnit1000(Math.abs(this.y)) + '</td></tr>';
        });
        s += '</table>';
        return s;
    },


    absUnit1000HtmlTooltipFormatter: function () {
        var s = '<b>' + $.format.date(new Date(this.x), 'yyyy-MM-dd HH:mm') + '</b>';
        s += '<table>';
        $.each(this.points, function () {
            s += '<tr><td style="color: ' + this.series.color + '">' + this.series.name + ':</td>' +
                '<td style="text-align: right">' + HmUtil.convertUnit1000(Math.abs(this.y)) + '</td></tr>';
        });
        s += '</table>';
        return s;
    },

    absUnit1024HtmlTooltipFormatter: function () {
        var s = '<b>' + $.format.date(new Date(this.x), 'yyyy-MM-dd HH:mm') + '</b>';
        s += '<table>';
        $.each(this.points, function () {
            s += '<tr><td style="color: ' + this.series.color + '">' + this.series.name + ':</td>' +
                '<td style="text-align: right">' + HmUtil.convertUnit1024(Math.abs(this.y)) + '</td></tr>';
        });
        s += '</table>';
        return s;
    },

    absHtmlTooltipFormatter: function () {
        var s = '<b>' + $.format.date(new Date(this.x), 'yyyy-MM-dd HH:mm') + '</b>';
        s += '<table>';
        var suffix = this.points[0].series.tooltipOptions.valueSuffix || '';
        $.each(this.points, function () {

            s += '<tr><td style="color: ' + this.series.color + '">' + this.series.name + ':</td>' +
                '<td style="text-align: right">' + Math.abs(this.y.toFixed(2)) + suffix + '</td></tr>';
        });
        s += '</table>';
        return s;
    },

    scatterTooltipFormatter: function () {
        var s = '<b>' + $.format.date(new Date(this.x), 'yyyy-MM-dd HH:mm') + '</b>';
        s += '<table>';

        // //현재 표현하는 데이터값이 하나라서, this 하위에 points속성이 없음. [주석처리]
        // var suffix = this.points[0].series.tooltipOptions.valueSuffix || '';
        // $.each(this.points, function () {
        //     //줌을 당길때, this.series.name을 찾지 못해 드래그가 풀리지 않는 에러가 있음. [es6 적용]
            s += '<tr><td style="color: ' + this.color + '">' + this.series?.name + ':</td>' +
                '<td style="text-align: right">' + Math.abs(this.y.toFixed(2)) + ' %' + '</td></tr>';
        // });
        s += '</table>';
        return s;
    },

    /**
     * add plotLine
     * @param axis          차트 Axis
     * @param id            plotLine id
     * @param limitValue    임계치값
     * @param labelText     임계선에 표시할 문구
     */

    addAxisPlotLine: function (axis, id, limitValue, labelText) {
        axis.addPlotLine({
            id: id, value: limitValue,
            color: 'red', width: 1, dashStyle: 'ShortDash', zIndex: 3,
            label: {text: labelText, align: 'right', style: {color: 'red', fontSize: 10}}
        });
    },

    /** remove plotLine by id */
    removeAxisPlotLine: function (axis, id) {
        axis.removePlotLine(id);
    },

    /** remove all plotLines */
    removeAllAxisPlotLines: function (axis) {
        var pl = [];
        $.each(axis.plotLinesAndBands, function (i, v) {
            pl.push(v.id);
        });
        $.each(pl, function (i, v) {
            axis.removePlotLine(v);
        });
    },

    /** 차트 데이터 보기 */
    showChartData: function (chart, popupTitle) {
        if (chart == null) return null;

        var dataRows = chart.getDataRows();
        var params = {
            cols: [],
            chartData: []
        };
        var sumColArr = [];
        var dataColArr = [];
        var wpValue = null;
        // yAxis.labels.formatter 에 따라 차트 series의 값을 표현하는 그리드 컬럼의 cellsrenderer를 적용한다.
        var labelFormatter = chart.yAxis[0].labelFormatter;
        var unitrenderer = null;
        if (labelFormatter === HmHighchart.absUnit1000Formatter) {
            unitrenderer = HmGrid.unit1000renderer;
        }
        else if (labelFormatter === HmHighchart.absUnit1024Formatter) {
            unitrenderer = HmGrid.unit1024renderer;
        }

        if (dataRows != null && dataRows.length) {
            $.each(dataRows, function (idx, item) {
                if (idx == 0) { // grid.columns
                    if (item.length <= 3) {
                        wpValue = "40%";
                    }else if (item.length <= 9){
                         wpValue = Math.floor(100 / item.length) + "%";
                    }else { // 컬럼 개수가 10개 이상일 경우 => width="70px" 고정
                         wpValue = "70px";
                    }
                    for (var x in item) {
                        // if (x == 0) {
                        if (item[x] == "DateTime") {
                            params.cols.push({
                                text: item[x],
                                datafield: 'val' + x,
                                cellsalign: 'center',
                                // width: wpValue
                                width: "130px"
                            });
                        }
                        else {
                            if (item[x] == "합계") {
                                sumColArr.push({
                                    text: item[x],
                                    datafield: 'val' + x,
                                    cellsalign: 'right',
                                    cellsrenderer: unitrenderer,
                                    width: wpValue
                                });
                            } else {
                                dataColArr.push({
                                    text: item[x],
                                    datafield: 'val' + x,
                                    cellsalign: 'right',
                                    cellsrenderer: unitrenderer,
                                    width: wpValue
                                });
                            }
                        }
                    }

                    if (sumColArr) params.cols.push(...sumColArr);

                    if (dataColArr) params.cols.push(...dataColArr);
                }
                else { // grid data
                    var tmpData = {};
                    for (var x in item) {
                        tmpData['val' + x] = x == 0 ? item[x] : Math.abs(item[x]);
                    }
                    for (var v of params.cols) {
                        if (!tmpData.hasOwnProperty(v.datafield)) tmpData[v.datafield] = ''
                    }
                    params.chartData.push(tmpData);
                }
            });
        }

        console.log(params);
        $.get(ctxPath + '/main/popup/comm/pChartDataList.do', function (result) {
            console.log($('#p2window'));
            HmWindow.createNewWindow('p2window');
            HmWindow.open($('#p2window'), popupTitle || '차트 데이터 보기', result, 700, 610, 'p2window_init', params, {p2close: true});
        });
    },

    /** 차트 스타일 설정 팝업 */
    showChartStylePopup: function (chart) {
        console.log(chart.userOptions);
    },

    /**
     * json array 데이터를 2차원 배열의 차트 데이터로 변환하여 리턴
     * @param xField        x축 필드(ex: ymdhms)
     * @param yFieldArr     y축 필드 배열(ex: [avg_in, max_in])
     * @param jsonArr       가공할 JSON 데이터 배열
     * @returns {Array}
     */
    convertJsonArrToChartDataArr: function (xField, yFieldArr, jsonArr) {

        var chartDataArr = [];

        $.each(yFieldArr, function (i, v) {
            chartDataArr[i] = [];
        });

        $.each(jsonArr, function (i, v) {
            for (var y in yFieldArr) {
                chartDataArr[y].push([v[xField], v[yFieldArr[y]]]);
            }
        });
        return chartDataArr;
    },

    /**
     * IN/OUT 차트처럼 0을 기준으로 차트를 표현할때 반전 기준값을 넘겨 차트 데이터를 +/- 선택적으로 가공한다.
     * @param xField
     * @param yFieldJsonArr     ex: [{field: 'AVG_IN', baseVal: 1}, {field: 'AVG_OUT', baseVal: -1}]
     * @param jsonArr
     * @returns {Array}
     */
    convertJsonArrToChartDataArrByBaseVal: function (xField, yFieldJsonArr, jsonArr) {
        var chartDataArr = [];
        $.each(yFieldJsonArr, function (i, v) {
            chartDataArr[i] = [];
        });

        $.each(jsonArr, function (i, v) {
            for (var y in yFieldJsonArr) {
                var yFieldVal = yFieldJsonArr[y];
                chartDataArr[y].push([v[xField], v[yFieldVal.field] * yFieldVal.baseVal]);
            }
        });
        return chartDataArr;
    }

};