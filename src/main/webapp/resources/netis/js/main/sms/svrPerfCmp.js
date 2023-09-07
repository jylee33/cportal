var $grpTree, $svrPerfCmpChart, $svrGrid, $svrPerfTree;

var itemIdx = [];
var Main = {


    /** variable */
    initVariable: function () {

        $svrPerfTree = $('#svrPerfTree');
        $grpTree = $('#grpTree');
        $svrPerfCmpChart = $('#svrPerfCmpChart');
        $svrGrid = $('#svrGrid');
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

        HmJqxSplitter.create($('#subSplitter'), HmJqxSplitter.ORIENTATION_V, [{
            size: 200,
            collapsible: false
        }, {size: '100%'}], '100%', '100%');

        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{
            size: '50%',
            collapsible: false
        }, {size: '50%'}], '100%', '100%');

        HmTreeGrid.create($svrPerfTree, HmTree.T_SVR_PERF);
        $svrPerfTree.jqxTreeGrid(
            {
                filterable: false,
                //ready의 경우 최초에만 fire 되고 이후 다른탭 갔다오면 발동안함.. 그래서 bindingComplete 이벤트로 변경
//                        ready: function () {
//                            console.log('ready');
//                            $svrPerfTree.jqxTreeGrid('expandAll');
//                            $svrPerfTree.jqxTreeGrid('selectRow', '9');
//                        }
            }
        );

        $svrPerfTree.on('bindingComplete', function (e) {
            $svrPerfTree.jqxTreeGrid('expandAll');
            $svrPerfTree.jqxTreeGrid('selectRow', '9');
            Main.changeItemIdx();
        });

        $svrPerfTree.on('rowSelect', function (event) {
            if (event.args.row.grpParent != 0) {
                Main.changeItemIdx();
            }
        });

        HmDropDownList.create($('#sItemType'), {
            source: [], width: 120, selectedIndex: 0
        });


        HmGrid.create($svrGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        {name: 'mngNo', type: 'number'},
                        {name: 'grpName', type: 'number'},
                        {name: 'name', type: 'string'},
                        {name: 'disDevName', type: 'string'},

                        {name: 'devIp', type: 'string'},
                        {name: 'devKind1', type: 'string'},
                        {name: 'devKind2', type: 'string'},
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
                    {text: '서버번호', datafield: 'mngNo', width: 80, hidden: true},
                    {text: '그룹명', datafield: 'grpName', width: '25%', pinned: false},
                    {
                        text: '서버명',
                        datafield: 'name',
                        displayfield: 'disDevName',
                        width: '25%',
                        pinned: false,
                        cellsrenderer: HmGrid.devNameRenderer
                    },
                    {text: 'IP', datafield: 'devIp', width: '25%', pinned: false},
                    {text: '타입', datafield: 'devKind1', hidden: true},
                    {text: '종류', datafield: 'devKind2', width: '25%', filtertype: 'checkedlist'},
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

        options.series = [{name: 'NONE', data: null, lineWidth: 0.5}];

        HmHighchart.create('svrPerfCmpChart', options);
    },

    getCommParams: function () {

        var params = Master.getGrpTabParams();
        var treeItem = HmTreeGrid.getSelectedItem($grpTree);
        var treeParams = HmTreeGrid.getSelectedItem($svrPerfTree);

        var _itemType;
        var _svrPerfKind;
        var _grpParent;
        var itemIdx;

        if (treeParams != null) {

            switch (treeParams.grpParent) {
                case 1:
                    _itemType = 'CPU';
                    itemIdx = treeParams.devKind2;
                    break;
                case 10:
                    _itemType = 'FS';
                    itemIdx = treeParams.devKind2;
                    break;
                case 20:
                    _itemType = 'MEM';
                    itemIdx = treeParams.devKind2;
                    break;
                case 30:
                    _itemType = 'NETWORK';
                    itemIdx = $('#sItemType').jqxDropDownList('getSelectedItem').value;
                    break;
                case 33:
                    _itemType = "DISK";
                    itemIdx = $('#sItemType').jqxDropDownList('getSelectedItem').value;
                    break;
            }
            _svrPerfKind = treeParams.devKind2
            _grpParent = treeParams.grpParent;

        }

        $.extend(params, {
            grpNo: treeItem !== null ? treeItem.devKind2 == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1] : 0,
            sortType: HmBoxCondition.val('sSortType'),
            itemType: _itemType,
            perfCycle: HmBoxCondition.val('sPerfCycle'),
            svrPerfKind: _svrPerfKind,
            itemIdx: itemIdx,
            grpParent: _grpParent
        }, HmBoxCondition.getPeriodParams());


        return params;

    },

    /** export Excel */
    exportExcel: function () {
        var params = Main.getCommParams();
//			HmUtil.exportExcel(ctxPath + '/main/nms/configMgmt/export.do', params);
    },

    searchDevList: function () {
        HmGrid.updateBoundData($svrGrid, ctxPath + '/main/sms/svrStatus/getSvrStatusList.do');
    },


    /** 차트 조회 */
    search: function () {

        var rowIdxes = HmGrid.getRowIdxes($svrGrid, '선택된  데이터가 없습니다.');
        if (rowIdxes === false) return;

        var _mngNos = [];
        var _mngInfos = [];

        $.each(rowIdxes, function (idx, value) {
            _mngNos.push($svrGrid.jqxGrid('getrowdata', value).mngNo);
            _mngInfos.push({
                mngNo: $svrGrid.jqxGrid('getrowdata', value).mngNo,
                devName: $svrGrid.jqxGrid('getrowdata', value).devName,
                disDevName: $svrGrid.jqxGrid('getrowdata', value).disDevName
            });
        });

        var params = Main.getCommParams();
        $.extend(params, {mngInfos: _mngInfos});

        if (params.grpParent==0){
            alert('목록을 설정해 주세요.');
            return;
        }

        Server.post('/main/sms/svrPerfCmp/getSvrPerfChartList.do', {
            data: params,
            success: function (result) {
                Main.searchChartResult(result, _mngInfos);
            }
        });

    },


    searchChartResult: function (result, mngInfos) {

        var svrPerfCmpChart = $('#svrPerfCmpChart').highcharts();
        var chk = 0;

        try {
            svrPerfCmpChart.hideNoData();
            svrPerfCmpChart.showLoading();
        } catch (err) {

        }

        var len = svrPerfCmpChart.series.length;
        for (var i = len - 1; i >= 0; i--) {
            svrPerfCmpChart.series[i].remove();
        }

        var itemType = $('#sItemType').jqxDropDownList('getSelectedItem');

        svrPerfCmpChart.yAxis[0].axisTitle.attr({
            text: itemType.label
        });

        svrPerfCmpChart.tooltip.options.formatter = function () {
            var xyArr = [], ymd;
            $.each(this.points, function () {
                if (xyArr.length == 0) ymd = $.format.date(this.x, 'yyyy-MM-dd HH:mm:ss');
                xyArr.push(this.series.name + ' : ' + Main.tooltipFormatFn(itemType.value, this.y));
            });
            xyArr.unshift(ymd);
            return xyArr.join('<br/>');
        };

        var seriesCnt = mngInfos.length;
        for (var i = 0; i < seriesCnt; i++) {
            svrPerfCmpChart.addSeries({name: mngInfos[i].disDevName}, false);
        }

        $.each(result, function (idx, value) {

            var chartData = [];
            var mngInfo = mngInfos.filter(function (item) {
                return idx == item.mngNo;
            });
            $.each(value, function (i, v) {
                chartData.push([v.time, v.val > 0 ? parseFloat(v.val) : 0]);
            });
            svrPerfCmpChart.series[chk].update({name: mngInfo[0].disDevName, data: chartData}, false);
            chk++;
        });
        svrPerfCmpChart.redraw();
        svrPerfCmpChart.hideLoading();
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
    },

    changeItemIdx: function () {
        var value = HmTreeGrid.getSelectedItem($svrPerfTree);
        var grpNo = value.grpNo;
        if (grpNo == '31') {
            $("#idxTitle").show();
            itemIdx = [
                {label: "INBPS", value: "INBPS"},
                {label: "OUTBPS", value: "OUTBPS"}];
        } else if (grpNo == '32') {
            $("#idxTitle").show();
            itemIdx = [
                {label: "INPPS", value: "INPPS"},
                {label: "OUTPPS", value: "OUTPPS"}];
        } else if (grpNo == '34' || grpNo == '35') {
            $("#idxTitle").show();
            itemIdx = [{label: "READ", value: "READ"}, {label: "WRITE", value: "WRITE"}];
        } else if (grpNo == 2) {
            $("#idxTitle").hide();
            itemIdx = [{label: "IDLE", value: "IDLE"}];
        } else if (grpNo == 3) {
            $("#idxTitle").hide();
            itemIdx = [{label: "IOWAIT", value: "IOWAIT"}];
        } else if (grpNo == 4) {
            $("#idxTitle").hide();
            itemIdx = [{label: "IRQ", value: "IRQ"}];
        } else if (grpNo == 5) {
            $("#idxTitle").hide();
            itemIdx = [{label: "NICE", value: "NICE"}];
        } else if (grpNo == 6) {
            $("#idxTitle").hide();
            itemIdx = [{label: "SOFTIRQ", value: "SOFTIRQ"}];
        } else if (grpNo == 7) {
            $("#idxTitle").hide();
            itemIdx = [{label: "STEAL", value: "STEAL"}];
        } else if (grpNo == 8) {
            $("#idxTitle").hide();
            itemIdx = [{label: "SYSTEM", value: "SYSTEM"}];
        } else if (grpNo == 8) {
            $("#idxTitle").hide();
            itemIdx = [{label: "SYSTEM", value: "SYSTEM"}];
        } else if (grpNo == 9) {
            $("#idxTitle").hide();
            itemIdx = [{label: "USER", value: "USER"}];
        } else if (grpNo == 11) {
            $("#idxTitle").hide();
            itemIdx = [{label: "사용량", value: "사용량"}];
        } else if (grpNo == 12) {
            $("#idxTitle").hide();
            itemIdx = [{label: "사용률", value: "사용률"}];
        } else if (grpNo == 21) {
            $("#idxTitle").hide();
            itemIdx = [{label: "물리 사용량", value: "물리 사용량"}];
        } else if (grpNo == 22) {
            $("#idxTitle").hide();
            itemIdx = [{label: "물리 사용률", value: "물리 사용률"}];
        } else if (grpNo == 23) {
            $("#idxTitle").hide();
            itemIdx = [{label: "SWAP 사용량", value: "SWAP 사용량"}];
        } else if (grpNo == 24) {
            $("#idxTitle").hide();
            itemIdx = [{label: "SWAP 사용률", value: "SWAP 사용률"}];
        }

        $("#sItemType").jqxDropDownList({source: itemIdx});

    }

};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});