var $grpTree, $devPerfCmpChart, $devGrid;

var Main = {
    /** variable */
    initVariable: function () {
        $grpTree = $('#grpTree');
        $devPerfCmpChart = $('#devPerfCmpChart');
        $devGrid = $('#devGrid');
        this.initCondition();
    },

    initCondition: function () {
        HmBoxCondition.createPeriod('', null, null, 'sPerfCycle');
        HmBoxCondition.createRadio($('#sPerfCycle'), HmResource.getResource('cond_perf_cycle'));
        HmBoxCondition.createRadio($('#sSortType'), HmResource.getResource('cond_perf_val'));
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
        $('.searchBox input:text').bind('keyup', function (event) {
            Main.keyupEventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch':
                this.search();
                break;
            case 'btnExcel':
                this.exportExcel();
                break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
//				Main.searchHist();
        }
    },

    /** init design */
    initDesign: function () {
        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT, Main.searchDevList);
        HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_V, [{
            size: 400,
            collapsible: false
        }, {size: '100%'}], '100%', '100%');
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{
            size: '50%',
            collapsible: false
        }, {size: '50%'}], '100%', '100%');

        var _itemType = [
            {label: 'CPU', value: '1'},
            {label: 'MEMORY', value: '2'},
            {label: '온도', value: '5'},
            {label: '응답시간', value: '6'},
            {label: '세션', value: '11'}
        ];
        HmDropDownList.create($('#sItemType'), {
            source: _itemType, width: 120, selectedIndex: 0
        });

        HmGrid.create($devGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        {name: 'mngNo', type: 'number'},
                        {name: 'devName', type: 'string'},
                        {name: 'devIp', type: 'string'},
                        {name: 'devKind2', type: 'string'},
                        {name: 'model', type: 'string'},
                        {name: 'vendor', type: 'string'}
                    ]
                },
                {
                    formatData: function (data) {
                        $.extend(data, Main.getCommParams());
                        return data;
                    }
                }
            ),
            selectionmode: 'checkbox',
            width: '100%',
            columns:
                [
//				 	{ text : '선택', datafield : 'checkYn', width : 40 },
                {text: '장비명', datafield: 'devName', minwidth: 100},
                {text: '장비 IP', datafield: 'devIp', width: 90},
                {text: '모델', datafield: 'model', width: 80},
                {text: '제조사', datafield: 'vendor', width: 80}
            ]
        });

        Main.createChart();
    },

    /** init data */
    initData: function () {

    },
    /** 차트 생성 */
    createChart: function () {
        var options = HmHighchart.getCommOptions(HmHighchart.TYPE_LINE);
        options.boost = {useGPUTranslations: true};
        options.chart = {
            zoomType: 'x',
            resetZoomButton: {
                position: {
                    align: 'right', // by default
                    verticalAlign: 'top', // by default
                    x: -10,
                    y: 10
                },
                relativeTo: 'chart'
            }
        };
        options.xAxis = {
            type: 'datetime',
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
        };

        options.exporting = {
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
        };

        options.navigation = {
            buttonOptions: {
                enabled: true
            },
            menuItemStyle: {
                padding: '0.3em 1em'
            }
        }


//			options.yAxis = [
//								{
//									labels: {
////										format: '{value}'+valUnit
//										formatter:function(){
//											var val = this.value;
//											if(val!=null) val = Math.abs(val);
//											if($('#cbItemType').val()!='BPSPER')
//												return HmUtil.convertUnit1000(Math.abs(val))+valUnit;
//											else
//												return Math.abs(val)+valUnit;
//										}
//									},
//									title: null
//								}
//							];
        options.legend = {enabled: true};
        options.plotOptions = {
            line: {
                lineWidth: 1,
                marker: {
                    enabled: false
                },
                connectNulls: true
            }
        };
//			options.yAxis = [
//								{
//									labels: {
//										format: '{value}'
//									},
//									title: null
//								}
//							];

        options.series = [{name: 'NONE', data: null, lineWidth: 0.5}];


        HmHighchart.create('devPerfCmpChart', options);
    },

    getCommParams: function () {
        var params = Master.getGrpTabParams();
        var treeItem = HmTreeGrid.getSelectedItem($grpTree);
        $.extend(params, {
            grpNo: treeItem !== null ? treeItem.devKind2 == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1] : 0,
            sortType: HmBoxCondition.val('sSortType'),
            itemType: $('#sItemType').val(),
            perfCycle: HmBoxCondition.val('sPerfCycle')
        }, HmBoxCondition.getPeriodParams());
        return params;
    },

    /** export Excel */
    exportExcel: function () {
        var params = Main.getCommParams();
//			HmUtil.exportExcel(ctxPath + '/main/nms/configMgmt/export.do', params);
    },
    searchDevList: function () {
        HmGrid.updateBoundData($devGrid, ctxPath + '/main/nms/devPerfCmp/getDevList.do');
    },
    /** 차트 조회 */
    search: function () {
        var rowIdxes = HmGrid.getRowIdxes($devGrid, '선택된  데이터가 없습니다.');
        if (rowIdxes === false) return;

        var _mngNos = [];
        var _mngInfos = [];
        $.each(rowIdxes, function (idx, value) {
            _mngNos.push($devGrid.jqxGrid('getrowdata', value).mngNo);
            _mngInfos.push({
                mngNo: $devGrid.jqxGrid('getrowdata', value).mngNo,
                devName: $devGrid.jqxGrid('getrowdata', value).devName
            });
        });
        var params = Main.getCommParams();

        $.extend(params, {mngInfos: _mngInfos});

        console.log("PARAM : " + JSON.stringify(params));

        Server.post('/main/nms/devPerfCmp/getDevPerfChartList.do', {
            data: params,
            success: function (result) {
                Main.searchChartResult(result, _mngInfos);
            }
        });

    },
    searchChartResult: function (result, mngInfos) {

        var devPerfCmpChart = $('#devPerfCmpChart').highcharts();
        var chk = 0;

        try {
            devPerfCmpChart.hideNoData();
            devPerfCmpChart.showLoading();
        } catch (err) {
        }

        var len = devPerfCmpChart.series.length;
        for (var i = len - 1; i >= 0; i--) {
            devPerfCmpChart.series[i].remove();
        }

        var itemType = $('#sItemType').jqxDropDownList('getSelectedItem');

        devPerfCmpChart.yAxis[0].axisTitle.attr({
            text: itemType.label
        });

        devPerfCmpChart.tooltip.options.formatter = function () {
            var xyArr = [], ymd;
            $.each(this.points, function () {
                if(xyArr.length == 0) ymd = $.format.date(this.x, 'yyyy-MM-dd HH:mm:ss');
                xyArr.push(this.series.name + ' : ' + Main.tooltipFormatFn(itemType.value, this.y));
            });
            xyArr.unshift(ymd);
            return xyArr.join('<br/>');
        };

        var seriesCnt = mngInfos.length;
        for (var i = 0; i < seriesCnt; i++) {
            devPerfCmpChart.addSeries({name: mngInfos[i].devName}, false);
        }

        $.each(result, function (idx, value) {

            var chartData = [];
            var mngInfo = mngInfos.filter(function (item) {
                return idx == item.mngNo;
            });
            $.each(value, function (i, v) {
                chartData.push([v.time, v.val > 0 ? parseFloat(v.val) : 0 ]);
            });
            devPerfCmpChart.series[chk].update({name: mngInfo[0].devName, data: chartData}, false);
            chk++;
        });
        devPerfCmpChart.redraw();
        devPerfCmpChart.hideLoading();
    },

    tooltipFormatFn: function (label, value) {
        var rVal = null;
        switch (label) {
            case '1':
                rVal = value + '%';
                break;
            case '2':
                rVal = value + '%';
                break;
            case '5':
                rVal = value;
                break;
            case '6':
                rVal = value;
                break;
            case '11':
                rVal = value;
                break;
            default:
                return;
        }
        return rVal;

    }
};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});