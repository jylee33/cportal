var $grpTree, $devGrid;
var timer, rowIndex, rowMngNo;
var _templateHTML;
var ctxmenuIdx = 1;

var TAB = {GW: 0, NUM: 1};

var Main = {
    /** variable */
    initVariable: function () {
        $grpTree = $('#dGrpTreeGrid'), $devGrid = $('#devGrid');
        this.initCondition();
    },
    initCondition: function() {
        // 기간
        HmBoxCondition.createPeriod('', Main.refreshSearch, timer);
        $("input[name=sRef]").eq(2).click();
        // radio 조건
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_dev_srch_type'));
    },
    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
        $('.searchBox').keypress(function (e) {
            if (e.keyCode == 13)
                Main.searchDev();
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch':
                this.searchDev();
                break;
            case 'btnTotalChart':
                this.showTotalChart();
                break;
            case 'btnExcel':
                this.exportExcel();
                break;
        }
    },
    refreshSearch:function (){
        Main.searchDev();
        $devGrid.jqxGrid('selectrow', rowIndex);
        Main.searchChannel(rowMngNo);
        $(this).val(0);
    },
    /** init design */
    initDesign: function () {
        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind2: 'VGW' });

        HmGrid.create($devGrid, {
            source: new $.jqx.dataAdapter({datatype: 'json',
                datafields:[
                    { name:'mngNo', type:'number' },
                    { name:'disDevName', type:'string' },
                    { name:'devIp', type:'string' },
                    { name:'devKind2', type:'string' },
                    { name:'vendor', type:'string' },
                    { name:'model', type:'string' },
                    { name:'e1Cnt', type:'number' },
                    { name:'totalChannelCnt', type:'number' },
                    { name:'usedChannelCnt', type:'number' },
                    { name:'channelUsePer', type:'number' },
                ]
            }, {
                formatData: function (data) {
                    $.extend(data, Main.getCommParams());
                    return data;
                }
            }),
            columns: [
                {text: '장비번호', datafield: 'mngNo', width: 80, pinned: true, hidden: true}, {text: '장비명', datafield: 'disDevName', minwidth: 150, pinned: true},
                {text: '대표IP', datafield: 'devIp', width: 120}, {text: '종류', datafield: 'devKind2', width: 100, filtertype: 'checkedlist'}, {text: '제조사', datafield: 'vendor', width: 130, filtertype: 'checkedlist'},
                {text: '모델명', datafield: 'model', width: 150, filtertype: 'checkedlist'}, {text: 'E1회선 수', datafield: 'e1Cnt', width: 100, cellsalign: 'right', cellsformat: 'n'},
                {text: '채널 수', datafield: 'totalChannelCnt', width: 100, cellsalign: 'right', cellsformat: 'n'},
                {
                    text: '사용 채널', datafield: 'usedChannelCnt', width: 100, cellsalign: 'right', cellsformat: 'n', cellsrenderer: function (row, datafield, value) {
                        return "<div class='jqx-grid-cell-right-align' style='margin-top: 2.5px;'>" + "<a href ='javascript:Main.showVgwCntChart(" + row + ");'>" + value + "</a></div>";
                    }
                }, {
                    text: '채널 사용률 (%)', datafield: 'channelUsePer', width: 120, cellsrenderer: function (row, datafield, value) {
                        return "<div class='jqx-grid-cell-right-align' style='margin-top: 2.5px;'>" + "<a href ='javascript:Main.showVgwPerfChart(" + row + ");'>" + value + " %</a></div>";
                    }
                    // createwidget: HmGrid.progressbarCreatewidget, initwidget:
                    // HmGrid.progressbarInitwidget
                }
                //, { text : 'Active Call수', datafield : 'activeCallCnt', width : 100, cellsalign : 'right', cellsformat : 'n' }
            ]
        }, CtxMenu.NONE);
        $devGrid.on('rowclick', function (event) {
            rowIndex = event.args.rowindex;
            rowMngNo = event.args.row.bounddata.mngNo;
            Main.searchChannel(rowMngNo);
        });

        var menu = $('<div id="ctxmenu_' + 'dev' + '"></div>');
        var ul = $('<ul></ul>');
        ul.append($('<li><img style="margin-right: 5px" src=' + ctxPath + '"/img/ctxmenu/ip_dtl.png"><span>채널사용률 그래프</span></li>'));
        var li = $('<li><img style="margin-right: 5px" src=' + ctxPath + '"/img/ctxmenu/op_tool.png"><span>도구</span></li>');
        li.append($('<ul><li><img style="margin-right: 5px" src=' + ctxPath + '"/img/ctxmenu/filter.png"><span>필터</span></li>' + '<li><img style="margin-right: 5px" src=' + ctxPath
            + '"/img/ctxmenu/filter_reset.png"><span>필터초기화</span></li></ul>'));
        ul.append(li);
        menu.append(ul).appendTo('body');

        $devGrid.on('contextmenu', function (event) {
            return false;
        }).on('rowclick', function (event) {
            if (event.args.rightclick) {
                $devGrid.jqxGrid('selectrow', event.args.rowindex);
                var scrollTop = $(window).scrollTop();
                var scrollLeft = $(window).scrollLeft();
                $('#ctxmenu_' + 'dev').jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft, parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                return false;
            }
        });
        menu.jqxMenu({width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme}).on('itemclick', function (event) {
            Main.selectCtxmenu(event);
        });

      /*  Main.chgRefreshCycle();*/
    },
    /** init data */
    initData: function () {
        $.get(ctxPath + '/main/ipt/ciscoIfChannelMonitorTemplate.do', function (result) {
            _templateHTML = result;
        });
    }, selectCtxmenu: function (event) {
        var ctxmenuId = event.currentTarget.id;
        var grid = $devGrid;
        switch ($.trim($(event.args).text())) {
            case '채널사용률 그래프':
                try {
                    var rowidx = HmGrid.getRowIdx(grid, '선택된 데이터가 없습니다.');
                    if (rowidx === false)
                        return;
                    var rowdata = grid.jqxGrid('getrowdata', rowidx);
                    var params = {mngNo: rowdata.mngNo};
                    Main.showVgwPerfChart(rowidx);
                } catch (e) {
                }
                break;
            case '필터':
                grid.jqxGrid('beginupdate');
                if (grid.jqxGrid('filterable') === false) {
                    grid.jqxGrid({filterable: true});
                }
                grid.jqxGrid({showfilterrow: !grid.jqxGrid('showfilterrow')});
                grid.jqxGrid('endupdate');
                break;
            case '필터초기화':
                grid.jqxGrid('clearfilters');
                break;
        }
    },
    /** 트리선택 */
    selectTree: function () {
        Main.searchDev();
    },

    /** 공통 파라미터 */
    getCommParams: function () {
        var params = Master.getDefGrpParams($grpTree);
        $.extend(params, HmBoxCondition.getSrchParams());
        return params;
    },

    /** 장비 조회 */
    searchDev: function () {
        $('#monitorMap').empty();
        HmGrid.updateBoundData($devGrid, ctxPath + '/main/ipt/ciscoIfChannelMonitor/getVgwStatusList.do');
    },

    /** 채널모니터링 조회 */
    searchChannel: function (mngNo) {
        var _monitorMap = $('#monitorMap');
        _monitorMap.empty();

        Server.get('/main/ipt/ciscoIfChannelMonitor/getIfChannelMonitorList.do', {
            data: {mngNo: mngNo}, success: function (result) {
                if (result != null && result.length > 0) {
                    var posIdx = 1;
                    var statPoll = false;
                    $.each(result, function (idx, value) {
                        posIdx = 1;
                        var $template = $(_templateHTML);
                        var children = value.children;
                        var tdList = $template.find('td');
                        statPoll = value.statPoll > 0 ? false : true;

                        $.each(tdList, function (idx, td) {
                            var $td = $(td);
                            if (idx == 0) {
                                var _text = value.ifName + ' ' + value.slot + '/' + value.port;
                                if (value.ifAlias != null)
                                    _text += ' (' + value.ifAlias + ')';

                                $td.find('div:first').text(_text);
                                if (statPoll) {
                                    $td.find('div:first').css('color', '#776969');
                                }
                            } else {
                                var ifItem = children[idx - 1];
                                $td.text(posIdx++);
                                if (ifItem != undefined) {
                                    switch (ifItem.channelStatus) {
                                        case 1:
                                        case 2:
                                        case 6:
                                            $td.addClass('down');
                                            break;
                                        case 3:
                                            $td.addClass('idle');
                                            break;
                                        case 4:
                                            $td.addClass('setup');
                                            break;
                                        case 5:
                                            $td.addClass('connected');
                                            break;
                                        default:
                                    }
                                }
                            }
                        });

                        _monitorMap.append($template);
                    });
                }
            }
        });
    },

    /** VGW 채널사용율 추이 차트 */
    showVgwPerfChart: function (row) {
        var rowdata = $devGrid.jqxGrid('getrowdata', row);
        if (rowdata == null)
            return;

        $.get(ctxPath + '/main/popup/ipt/pCiscoVgwChannelUseChart.do', {mngNo: rowdata.mngNo, searchType: 'per'}, function (result) {
            HmWindow.open($('#pwindow'), '채널 사용율 추이그래프', result, 600, 370, 'pwindow_init', rowdata);
        });
    },

    /** VGW 사용 채널수 추이 차트 */
    showVgwCntChart: function (row) {
        var rowdata = $devGrid.jqxGrid('getrowdata', row);

        $.get(ctxPath + '/main/popup/ipt/pCiscoVgwChannelUseChart.do', {mngNo: (rowdata == null ? 0 : rowdata.mngNo), searchType: 'cnt'}, function (result) {
            HmWindow.open($('#pwindow'), '사용 채널수 추이그래프', result, 600, 370, 'pwindow_init', rowdata);
        });
    },

    /** VGW 사용 채널수 합산 추이 차트 */
    showTotalChart: function (row) {
        var rowdata = $devGrid.jqxGrid('getrowdata', row);

        $.get(ctxPath + '/main/popup/svc/pVgwChannelUseChart.do', {mngNo: 0, searchType: 'cnt'}, function (result) {
            HmWindow.open($('#pwindow'), '사용 채널수 합산 추이 그래프', result, 600, 370, 'pwindow_init', rowdata);
        });
    },

    /** export */
    exportExcel: function () {
        var params = Main.getCommParams();
        HmUtil.exportGrid($devGrid, 'V회선/채널 모니터링', false);
    },

    /** 새로고침 주기 변경 */
    chgRefreshCycle: function () {
        var cycle = $('#refreshCycleCb').val();
        if (timer != null)
            clearInterval(timer);
        if (cycle > 0) {
            timer = setInterval(function () {
                var curVal = $('#prgrsBar').val();
                if (curVal < 100)
                    curVal += 100 / cycle;
                $('#prgrsBar').val(curVal);
            }, 1000);
        } else {
            $('#prgrsBar').val(0);
        }
    }

};

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});