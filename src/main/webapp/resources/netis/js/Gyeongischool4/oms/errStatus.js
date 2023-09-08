var $evtGrid, evtCodeMap;
var timer;

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});

var Main = {
    /** variable */
    initVariable: function () {
        $evtGrid = $('#evtGrid');
        this.initCondition();
    },

    initCondition: function () {
        // 기간
        HmBoxCondition.createPeriod('', Main.searchErr, timer);
        $("input[name=sRef]").eq(2).click();
        // radio 조건
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
        //이벤트그룹별 현황 show/hide 처리
        $('div.btnEvtGrp').bind('click', function (event) {

            var isHide = $(event.currentTarget).attr('data-key') == 'hide';

            if (isHide) {
                $('div.errGrpBox').animate({height: '25px'}, 500);
                $('div.errGrpBox > table tr:last').css('visibility', 'hidden');
                $('div.scontent').animate({top: '93px'}, 500);
            } else {
                $('div.errGrpBox').animate({height: '100px'}, 500);
                $('div.errGrpBox > table tr:last').css('visibility', 'visible');
                $('div.scontent').animate({top: '168px'}, 500);
            }

            $('div.btnEvtGrp:first').css('display', isHide ? 'block' : 'none');
            $('div.btnEvtGrp:last').css('display', isHide ? 'none' : 'block');

            setTimeout(function () {
                $(window).resize();
            }, 500);

        });

        $('.searchBox input:text').bind('keyup', function (event) {
            Main.keyupEventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case "btnSearch":
                this.searchErr();
                break;
            case 'btnConfigDel':
                this.delConfigAll();
                break;
            case 'btnSyslogDel':
                this.delSyslogAll();
                break;
            case "btnExcel":
                this.exportExcel();
                break;
            case 'btnEvtConf':
                this.confEvtGrp();
                break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
            Main.searchErr();
        }
    },

    /** init design */
    initDesign: function () {

        HmJqxSplitter.createTree($('#mainSplitter'));

        $('#leftTab').jqxTabs({
            width: '100%', height: '99.8%', scrollable: true, theme: jqxTheme,
            initTabContent: function (tab) {
                switch (tab) {
                    case 0:
                        HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_GRP_DEFAULT_GYEONGI, Main.selectTree);
                        break;
                }
            }
        }).on('selected', function (event) {
            Main.searchErr();
        });

        CtxMenu_Evt.create_impala('status_impala');

        HmGrid.create($evtGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        {name: 'educationCode', type: 'string'},
                        {name: 'seqNo', type: 'number'},
                        {name: 'mngNo', type: 'number'},
                        {name: 'srcIdx', type: 'number'},
                        {name: 'srcIdxText', type: 'string'},
                        {name: 'devIp', type: 'string'},
                        {name: 'engName', type: 'string'},
                        {name: 'devKind1', type: 'string'},
                        {name: 'devKind2', type: 'string'},
                        {name: 'devName', type: 'string'},
                        {name: 'disDevName', type: 'string'},
                        {name: 'userDevName', type: 'string'},
                        {name: 'ifName', type: 'string'},
                        {name: 'ifAlias', type: 'string'},
                        {name: 'evtLevelStr', type: 'string'},
                        {name: 'evtLevel', type: 'number'},
                        {name: 'ymdhms', type: 'string'},
                        {name: 'grpName', type: 'string'},
                        {name: 'grpKey', type: 'string'},
                        {name: 'srcTypeStr', type: 'string'},
                        {name: 'srcType', type: 'string'},
                        {name: 'srcInfo', type: 'string'},
                        {name: 'devLocation', type: 'string'},
                        {name: 'code', type: 'string'},
                        {name: 'evtName', type: 'string'},
                        {name: 'sumSec', type: 'int'},
                        {name: 'status', type: 'string'},
                        {name: 'progressState', type: 'string'},
                        {name: 'receiptUser', type: 'string'},
                        {name: 'receiptMemo', type: 'string'},
                        {name: 'memo', type: 'string'},
                        {name: 'limitDesc', type: 'string'}
                    ]
                },
                {
                    formatData: function (data) {
                        $.extend(data, Main.getCommParams());
                        data.filterGroups = [];
                        return data;
                    }
                }
            ),
            selectionmode: 'multiplerowsextended',
            pagerheight: 27,
            pagerrenderer: HmGrid.pagerrenderer,
            columns: [
                {text: '지원청 코드 ', datafield: 'educationCode', hidden: true},
                {text: '시퀀스', datafield: 'seqNo', hidden: true},
                {text: '장비번호', datafield: 'mngNo', hidden: true},
                {text: '서브번호', datafield: 'srcIdx', hidden: true},
                {text: '서브키', datafield: 'srcIdxText', hidden: true},
                {text: 'IP', datafield: 'devIp', hidden: true},
                {text: '엔진종류', datafield: 'engName', hidden: true},
                {text: '장비명', datafield: 'disDevName', hidden: true},
                {text: '원천장비명', datafield: 'devName', hidden: true},
                {text: '사용자장비명', datafield: 'userDevName', hidden: true},
                {text: '회선명', datafield: 'ifName', hidden: true},
                {text: '회선별칭', datafield: 'ifAlias', hidden: true},
                {text: '장비분류', datafield: 'devKind1', hidden: true},
                {text: '장비상세분류', datafield: 'devKind2', hidden: true},
                {
                    text: '장애등급',
                    datafield: 'evtLevelStr',
                    width: 70,
                    filtertype: 'checkedlist',
                    cellsrenderer: HmGrid.evtLevelrenderer,
                    cellsalign: 'center',
                    createfilterwidget: function (column, columnElement, widget) {
                        widget.jqxDropDownList({
                            renderer: HmGrid.evtLevelFilterRenderer
                        });
                    }
                },
                {text: '장애등급코드', datafield: 'evtLevel', hidden: true},
                {text: '발생일시', datafield: 'ymdhms', cellsalign: 'center', width: 140},
                {text: '그룹', datafield: 'grpName', width: 100},
                {text: '전용회선번호', datafield: 'grpKey', width: 100},
                {text: '장애종류', datafield: 'srcTypeStr', width: 70, cellsalign: 'center', filtertype: 'checkedlist'},
                {text: '장애종류코드', datafield: 'srcType', hidden: true},
                {text: '장애대상', datafield: 'srcInfo', minwidth: 405},
                {text: '장비위치', datafield: 'devLocation', width: 150, hidden: true},
                {text: '이벤트코드', datafield: 'code', width: 100, hidden: true},
                {text: '이벤트명', datafield: 'evtName', width: 140},
                {
                    text: '지속시간',
                    datafield: 'sumSec',
                    width: 150,
                    cellsrenderer: HmGrid.cTimerenderer,
                    filtertype: 'number'
                },
                {text: '장애상태', datafield: 'status', width: 70, cellsalign: 'center'},
                {text: '진행상태', datafield: 'progressState', width: 70, cellsalign: 'center'},
                {text: '조치내역', datafield: 'receiptMemo', width: 150},
                {text: '비고', datafield: 'memo', width: 150, hidden: true},
                {text: '조치자', datafield: 'receiptUser', cellsalign: 'center', width: 100},
                {text: '이벤트설명', datafield: 'limitDesc', width: 250}
            ]
        }, CtxMenu.NONE);

        $evtGrid.on('bindingcomplete', function () {
            Main.setEvtCodeGrpState();
        });

        $evtGrid.on('rowdoubleclick', function (event) {

            var rowIdx = event.args.rowindex;
            var rowdata = $(this).jqxGrid('getrowdata', rowIdx);

            rowdata.disSumSec = HmUtil.convertCTime(rowdata.sumSec);
            var params = {
                type: 'STATUS'
            };

            $.extend(params, rowdata);

            $.post(ctxPath + '/main/popup/nms/pEvtDetail.do', params, function (result) {
                HmWindow.openFit($('#pwindow'), '이벤트 상세', result, 600, 430, 'pwindow_init', params);
            });

        });

        $evtGrid.on('contextmenu', function () {
            return false;
        })
            .on('rowclick', function (event) {
                if (event.args.rightclick) {
                    $('#ctxmenu_evt, #ctxmenu_dev, #ctxmenu_if, #ctxmenu_svr').jqxMenu('close');
                    var targetMenu = null;
                    $evtGrid.jqxGrid('selectrow', event.args.rowindex);
                    var idxes = $evtGrid.jqxGrid('getselectedrowindexes');
                    // 선택 Row 개수가 1이상일때
                    if (idxes.length > 1) {
                        var _list = [];
                        $.each(idxes, function (idx, value) {
                            var tmp = $evtGrid.jqxGrid('getrowdata', value);
                            if (tmp.srcType == 'ITMON') return;
                            _list.push(tmp);
                        });

                        if (_list.length > 1) targetMenu = $('#ctxmenu_evt');
                        else if (_list.length == 1) {	// 우클릭메뉴가 제공되는 이벤트가 1개일때
                            switch (_list[0].srcType) {
                                case 'DEV':
                                    targetMenu = $('#ctxmenu_dev');
                                    break;
                                case 'IF':
                                    targetMenu = $('#ctxmenu_if');
                                    break;
                                default:
                                    targetMenu = $('#ctxmenu_evt');
                                    break;
                            }
                        }
                    } else if (idxes.length == 1) { // 선택 Row가 1개일때
                        var rowdata = $evtGrid.jqxGrid('getrowdata', event.args.rowindex);
                        switch (rowdata.srcType) {
                            case 'DEV':
                                targetMenu = $('#ctxmenu_dev');
                                break;
                            case 'IF':
                                targetMenu = $('#ctxmenu_if');
                                break;

                            default:
                                targetMenu = $('#ctxmenu_evt');
                                break;
                        }
                    }

                    $('#cm_evtTicket').css('display', 'none');

                    if (targetMenu != null) {
                        var posX = parseInt(event.args.originalEvent.clientX) + 5 + $(window).scrollLeft();
                        var posY = parseInt(event.args.originalEvent.clientY) + 5 + $(window).scrollTop();
                        if ($(window).height() < (event.args.originalEvent.clientY + targetMenu.height() + 10)) {
                            posY = $(window).height() - (targetMenu.height() + 10);
                        }
                        targetMenu.jqxMenu('open', posX, posY);
                    }
                    return false;
                }
            });

        $('#ctxmenu_evt, #ctxmenu_dev, #ctxmenu_if').jqxMenu({
            width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme, popupZIndex: 99999
        }).on('itemclick', function (event) {

            CtxMenu_Evt.selectDevCtxmenu(event, $evtGrid);

        });

        $('#section').css('display', 'block');

    },

    /** init data */
    initData: function () {
        this.initEvtCodeGrp();
        this.searchErr();
    },

    initEvtCodeGrp: function () {
        // 이벤트 코드별 코드그룹 관리
        Server.get('/main/popup/evtCodeGrp/getCfgEvtGrpSubListAll.do', {
            success: function (result) {
                evtCodeMap = {};
                if (result != null && result.length > 0) {
                    $.each(result, function (idx, item) {
                        if (item.isUse != 1) return;
                        evtCodeMap[item.evtCode] = item.evtGrpNo;
                    });
                }
            }
        });
        // 코드그룹별 UI 생성
        Server.get('/main/popup/evtCodeGrp/getCfgEvtGrpList.do', {
            success: function (result) {
                if (result != null && result.length > 0) {
                    var table = $('#evtCodeGrpTable'),
                        docFrag = $(document.createDocumentFragment()),
                        headerTr = $('<tr></tr>', {style: 'height: 24px; border-bottom:1px solid #e0e0e0;'}),
                        stateTr = $('<tr></tr>');
                    // add all
                    headerTr.append($('<td></td>', {class: 'pop_gridSub focusTd'}).append($('<div></div>', {text: '전체'})));
                    stateTr.append($('<td></td>', {class: 'pop_gridVal'}).append($('<div></div>', {
                        class: 'bubble bubbleSize50 normal',
                        text: '정상',
                        'data-key': 'all'
                    })));
                    $.each(result, function (idx, item) {
                        if (item.isUse != 1) return; //미표시
                        headerTr.append($('<td></td>', {class: 'pop_gridSub'})
                            .append($('<div></div>', {text: item.evtGrpName}))
                        );
                        stateTr.append($('<td></td>', {class: 'pop_gridVal'})
                            .append($('<div></div>', {
                                class: 'bubble bubbleSize50 normal',
                                text: '정상',
                                'data-key': item.evtGrpNo
                            })))
                    });
                    // add others
                    var othersStr = $('#gSiteName').val() == 'HyundaiCar' ? '경보' : 'Others';
                    headerTr.append($('<td></td>', {class: 'pop_gridSub'})
                        .append($('<div></div>', {text: othersStr}))
                    );
                    stateTr.append($('<td></td>', {class: 'pop_gridVal'})
                        .append($('<div></div>', {
                            class: 'bubble bubbleSize50 normal',
                            text: '정상',
                            'data-key': 'etc'
                        })));
                    docFrag.append(headerTr);
                    docFrag.append(stateTr);
                    table.append(docFrag);
                }
                else {
                    $('div.errGrpBox').css('height', '25px', 'border-bottom', '1px solid #e0e0e0');
                    $('div.errGrpBox > table tr:last').css('visibility', 'hidden');
                    $('div.scontent').css('top', '130px');
                }

                // add event
                $('#evtCodeGrpTable td').on('click', function () {
                    var target = $(event.currentTarget);
                    var tdIndex = target.index();
                    $('#evtCodeGrpTable tr:first > td').removeClass('focusTd');
                    $('#evtCodeGrpTable tr:first').find('td:eq(' + tdIndex + ')').addClass('focusTd');
                    var dataKey = $('#evtCodeGrpTable tr:last').find('td:eq(' + tdIndex + ')').find('div').attr('data-key');
                    Main.applyCfgEvtGrpFilter(dataKey);
                });
            }
        });
    },

    setEvtCodeGrpState: function () {
        var rows = $evtGrid.jqxGrid('getboundrows');
        var stateDiv = $('#evtCodeGrpTable div.bubble');
        if (evtCodeMap === undefined) return;

        if (rows != null && rows.length > 0) {
            var maxLvl = 0;
            var evtMap = {
                all: {cnt: rows.length, lvl: 0},
                etc: {cnt: 0, lvl: 0}
            };
            for (var x in evtCodeMap) {
                evtMap[evtCodeMap[x]] = {cnt: 0, lvl: 0};
            }

            $.each(rows, function (evtIdx, evtItem) {
                if (evtItem.evtLevel > maxLvl) maxLvl = evtItem.evtLevel;
                // console.log(evtItem);
                if (evtCodeMap.hasOwnProperty(evtItem.code)) {
                    var tmp = evtMap[evtCodeMap[evtItem.code]];
                    tmp.cnt++;
                    if (tmp.lvl < evtItem.evtLevel) tmp.lvl = evtItem.evtLevel;
                }
                else {
                    evtMap.etc.cnt++;
                    if (evtMap.etc.lvl < evtItem.evtLevel) evtMap.etc.lvl = evtItem.evtLevel;
                }
            });
            evtMap.all.lvl = $('#gSiteName').val() == 'HyundaiCar' ? 6 : maxLvl;
            console.log(evtMap);

            var evtClz = ['normal', 'info', 'warning', 'minor', 'major', 'critical', 'hyundaiCarAllLvl'];
            $.each(evtMap, function (key, item) {

                var div = $('#evtCodeGrpTable div[data-key="{0}"]'.substitute(key));
                div.text(item.cnt > 0 ? item.cnt : '정상');

                // 필터시 색상이 남아서 제거
                //if(item.lvl > 0) {
                div.removeClass().addClass('bubble bubbleSize50 {0}'.substitute(evtClz[item.lvl]));
                //}
            });
        }
        else {
            stateDiv.text('정상');
            stateDiv.removeClass().addClass('bubble bubbleSize50 normal');
            if ($('#gSiteName').val() == 'HyundaiCar')
                $('#evtCodeGrpTable div[data-key="all"]').removeClass().addClass('bubble bubbleSize50 hyundaiCarAllLvl');
        }
    },

    /** 이벤트그룹 필터 적용 */
    applyCfgEvtGrpFilter: function (evtGrpNo) {
        console.log('evtGrpNo:::' + evtGrpNo);
        if (evtGrpNo == 'all') {
            $evtGrid.jqxGrid('removefilter', 'code');
        }
        else if (evtGrpNo == 'etc') { // others
            $evtGrid.jqxGrid('removefilter', 'code');
            var filtergroup = new $.jqx.filter(),
                operator = 0; //and

            for (var code in evtCodeMap) {
                filtergroup.addfilter(operator, filtergroup.createfilter('stringfilter', code, 'NOT_EQUAL'));
            }
            $evtGrid.jqxGrid('addfilter', 'code', filtergroup);
            $evtGrid.jqxGrid('applyfilters');
        }
        else {
            // find code list
            var codeList = [];
            for (var x in evtCodeMap) {
                if (evtCodeMap[x] == evtGrpNo) codeList.push(x);
            }
            if (codeList != null && codeList.length > 0) {
                $evtGrid.jqxGrid('removefilter', 'code');
                var filtergroup = new $.jqx.filter(),
                    operator = 1; //or

                for (var idx in codeList) {
                    filtergroup.addfilter(operator, filtergroup.createfilter('stringfilter', codeList[idx], 'EQUAL'));
                }
                $evtGrid.jqxGrid('addfilter', 'code', filtergroup);
                $evtGrid.jqxGrid('applyfilters');
            }
            console.log(codeList)
        }
    },

    refresh: function () {
        this.searchErr();
    },

    /** 공통 파라미터 */
    getCommParams: function () {

        var params = Master.getGrpTabParams();
        $.extend(params, HmBoxCondition.getSrchParams());
        return params;

    },

    /** 그룹트리 선택이벤트 */
    selectTree: function () {
        Main.searchErr();
    },

    /** 조회 */
    searchErr: function () {
        HmGrid.updateBoundData($evtGrid, ctxPath + '/gyeongischool4/oms/errStatus/getErrStatusList.do');
    },


    /** config 전체삭제 */
    delConfigAll: function () {

        Server.post('/main/popup/errAction/saveConfigEvtAllStop.do', {
            data: Main.getCommParams(),
            success: function (result) {
                if (result > 0) {
                    alert(result + '건의 Config이벤트가 해제되었습니다.');
                    $('#prgrsBar').val(100);
                } else {
                    alert('해제 할 Config이벤트가 없습니다.');
                }
            }
        });

    },
    /** Syslog 전체삭제 */
    delSyslogAll: function () {
        Server.post('/main/popup/errAction/saveSyslogEvtAllStop.do', {
            data: Main.getCommParams(),
            success: function (result) {
                if (result > 0) {
                    alert(result + '건의 Syslog이벤트가 해제되었습니다.');
                    $('#prgrsBar').val(100);
                } else {
                    alert('해제할 Syslog이벤트가 없습니다.');
                }
            }
        });
    },

    /** export Excel */
    exportExcel: function () {
        HmUtil.exportGrid($evtGrid, '종합이벤트현황', false);
    },

    exportExcel__: function () {
        var params = Main.getCommParams();
        HmUtil.exportExcel(ctxPath + '/main/oms/errStatus/export.do', params);
    },

    /** 이벤트 설정 */
    confEvtGrp: function () {
        HmUtil.createPopup('/main/popup/nms/pEvtCodeGrp.do', $('#hForm'), '이벤트 그룹 설정', 1000, 600);
    }

};

function refresh() {
    Main.searchErr();
}