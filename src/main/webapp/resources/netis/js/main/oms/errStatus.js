var $evtGrid, evtCodeMap, etcEvtCodeMap = [];
var evtCodeArr = [];
var keyKeep = null;
var timer;
var _exist = false;

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
        $('.btnEvtGrp').bind('click', function (event) {

            var isHide = $(event.currentTarget).attr('data-key') == 'hide';

            if (isHide) {
                $('div.errStatusBox').animate({height: '27px'}, 500);
                $('div.errStatusBox > table tr:last').css('visibility', 'visible');
                $('div.scontent').animate({top: '62px'}, 500);
                $('div.scontent').css('background', '#fff');
            } else {
                $('div.errStatusBox').animate({height: '74px'}, 500);
                $('div.errStatusBox > table tr:last').css('visibility', 'visible');
                $('div.scontent').animate({top: '109px'}, 500);
            }

            $('.btnEvtGrp:first').css('display', isHide ? 'inline-block' : 'none');
            $('.btnEvtGrp:last').css('display', isHide ? 'none' : 'inline-block');
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
        Master.createGrpTab(Main.selectTree);
        CtxMenu_Evt.create('status');

        HmGrid.create($evtGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        {name: 'seqNo', type: 'number'},
                        {name: 'mngNo', type: 'number'},
                        {name: 'srcIdx', type: 'number'},
                        {name: 'srcGrpNo', type: 'number'},
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
                        {name: 'srcTypeStr', type: 'string'},
                        {name: 'srcType', type: 'string'},
                        {name: 'srcInfo', type: 'string'},
                        {name: 'devLocation', type: 'string' },
                        {name: 'code', type: 'string'},
                        {name: 'evtName', type: 'string'},
                        {name: 'sumSec', type: 'int'},
                        {name: 'status', type: 'string'},
                        {name: 'progressState', type: 'string'},
                        {name: 'receiptUser', type: 'string'},
                        {name: 'receiptMemo', type: 'string'},
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
                {text: '장애종류', datafield: 'srcTypeStr', width: 70, cellsalign: 'center', filtertype: 'checkedlist'},
                {text: '장애종류코드', datafield: 'srcType', hidden: true},
                {text: '장애대상', datafield: 'srcInfo', minwidth: 405},
                {text: '장비위치', datafield: 'devLocation', width: 150, hidden: true  },
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
                {text: '조치자', datafield: 'receiptUser', cellsalign: 'center', width: 100},
                {text: '이벤트설명', datafield: 'limitDesc', width: 250}
            ]
        }, CtxMenu.NONE);

        $evtGrid.on('bindingcomplete', function () {
            Main.setEvtCodeGrpState();
        });

        $evtGrid.on('rowdoubleclick', function (event) {
            /* shift를 입력중이면 더블클릭이벤트가 발생하지 않도록 변경 */
            if (event.args.originalEvent.shiftKey) return;
            /* 우클릭으로 더블클릭이벤트가 발생하지 않도록 변경 */
            if (event.args.rightclick) return;

            var rowIdx = event.args.rowindex;
            var rowdata = $(this).jqxGrid('getrowdata', rowIdx);

            rowdata.disSumSec = HmUtil.convertCTime(rowdata.sumSec);
            var params = {
                type: 'STATUS'
            };
            $.extend(params, rowdata);

            $.post(ctxPath + '/main/popup/nms/pEvtDetail.do', params, function (result) {
                HmWindow.openFit($('#pwindow'), '이벤트 상세', result, 800, 430, 'pwindow_init', params);
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
                                    // if (_list[0].engName.indexOf("CONFIG") > -1) {
                                    //     targetMenu = $('#ctxmenu_config');
                                    // } else
                                        targetMenu = $('#ctxmenu_dev');
                                    break;
                                case 'SVR':
                                    targetMenu = $('#ctxmenu_svr');
                                    break;
                                case 'IF':
                                    targetMenu = $('#ctxmenu_if');
                                    break;
                                case 'AP':
                                    targetMenu = $('#ctxmenu_ap');
                                    break;
                                case 'ITMON':
                                    targetMenu = $('#ctxmenu_itmon');
                                    break;
                                case 'SYSLOG':
                                    targetMenu = $('#ctxmenu_syslog');
                                    break;
                                case 'TRAP':
                                    targetMenu = $('#ctxmenu_trap');
                                    break;
                                default:
                                    targetMenu = $('#ctxmenu_evt');
                                    break;
                            }
                        }
                        else {
                            targetMenu = $('#ctxmenu_itmon');
                        }
                    }
                    else if (idxes.length == 1) { // 선택 Row가 1개일때
                        var rowdata = $evtGrid.jqxGrid('getrowdata', event.args.rowindex);
                        switch (rowdata.srcType) {
                            case 'DEV':
                                var engName = rowdata.engName;
                                // if (engName.indexOf("CONFIG") > -1) {
                                //     targetMenu = $('#ctxmenu_config');
                                // } else
                                    targetMenu = $('#ctxmenu_dev');
                                break;
                            case 'SVR':
                                targetMenu = $('#ctxmenu_svr');
                                break;
                            case 'IF':
                                targetMenu = $('#ctxmenu_if');
                                break;
                            case 'AP':
                                targetMenu = $('#ctxmenu_ap');
                                break;
                            case 'ITMON':
                                targetMenu = $('#ctxmenu_itmon');
                                break;
                            case 'SYSLOG':
                                targetMenu = $('#ctxmenu_syslog');
                                break;
                            case 'TRAP':
                                targetMenu = $('#ctxmenu_trap');
                                break;
                            default:
                                targetMenu = $('#ctxmenu_evt');
                                break;
                        }
                    }

                    if ($('#gSiteName').val() == 'Samsung') {
                        $('#cm_evtTicket').css('display', 'none');
                    } else {
                        $('#cm_evtTicket').css('display', 'block');
                    }

                    if (targetMenu != null) {
                        var posX = parseInt(event.args.originalEvent.clientX) + 5 + $(window).scrollLeft();
                        var posY = parseInt(event.args.originalEvent.clientY) + 5 + $(window).scrollTop();
                        if ($(window).height() < (event.args.originalEvent.clientY + targetMenu.height() + 10)) {
                            posY = $(window).height() - (targetMenu.height() + 10);
                        }
                        targetMenu.jqxMenu('open', posX, posY);
                    }

                    // if (targetMenu[0].id == "ctxmenu_svr" && event.args.row.bounddata.code.indexOf("FILE_LOG_")==-1) {
                    //     $('#cm_evt_stop_file_log').css("display","none");
                    // }

                    return false;
                }
            });
        $('#ctxmenu_evt, #ctxmenu_dev, #ctxmenu_if, #ctxmenu_ap, #ctxmenu_itmon, #ctxmenu_syslog, #ctxmenu_svr, #ctxmenu_config, #ctxmenu_trap').jqxMenu({
            width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme, popupZIndex: 99999
        }).on('itemclick', function (event) {
            CtxMenu_Evt.selectDevCtxmenu(event, $evtGrid);
        });

        /*	$('div.jqx-progressbar > div:last').css('left', '50px'); // jqwidgets 버전업 되면서 스타일이 깨지는 현상이 발생하여 강제 조정 (showText)*/

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
                evtCodeArr = [];
                keyKeep = null;

                console.log("이벤트 코드별 코드 그룹 관리");
                console.log(result);

                if (result != null && result.length > 0) {

                    $.each(result, function (idx, item) {

                        if(idx === result.length - 1) { //마지막 데이터 적용
                            evtCodeMap[keyKeep] = evtCodeArr;
                        }
                        if (item.isUse != 1) return;

                        if (etcEvtCodeMap.findIndex(v => v === item.evtCode) < 1 ) etcEvtCodeMap.push(item.evtCode);

                        if (keyKeep === null) keyKeep = item.evtGrpNo;

                        if (keyKeep !== item.evtGrpNo) {

                            evtCodeMap[keyKeep] = evtCodeArr;
                            evtCodeArr = [];
                            evtCodeArr.push(item.evtCode);
                            keyKeep = item.evtGrpNo
                        }
                        else {
                            evtCodeArr.push(item.evtCode);
                        }
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
                        headerTr = $('<tr></tr>', {style: 'height: 24px;/*border-bottom:1px solid #f3f3f3;*/'}),
                        stateTr = $('<tr></tr>');
                    table.empty();
                    // 전체
                    headerTr.append($('<td></td>', {class: 'pop_gridSub focusTd'})
                        .append($('<div></div>', {text: '전체'}))
                    );
                    stateTr.append($('<td></td>', {class: 'pop_gridVal'})
                        .append($('<div></div>', {
                            class: 'eventBg',
                            style: 'opacity:0;', // 최초 흰색 적용 //2022.12.26 흰색 적용 후 바뀌지 않아서 1로 변경 // 2023.02.01 - 정상일때 흰색이오니 변경 금지
                            'data-key': 'all',
                        }))
                        .append($('<span></span>',{
                            class: 'errEffect ',
                            text: '정상',
                            'data-key': 'all'
                        }))
                    );
                    // 가운데
                    $.each(result, function (idx, item) {
                        if (item.isUse != 1) return; //미표시
                        headerTr.append($('<td></td>', {class: 'pop_gridSub'})
                            .append($('<div></div>', {text: item.evtGrpName}))
                        );
                        stateTr.append($('<td></td>', {class: 'pop_gridVal'})
                            .append($('<div></div>', {
                                class: 'eventBg',
                                style: 'opacity:0;', //2022.12.25 // 2023.02.01 - 정상일때 흰색이오니 변경 금지
                                'data-key': item.evtGrpNo
                            }))
                            .append($('<span></span>',{
                                class: 'errEffect ',
                                text: '정상',
                                'data-key': item.evtGrpNo
                            }))
                        )
                    });
                    // 기타
                    var othersStr = $('#gSiteName').val() == 'HyundaiCar' ? '경보' : '기타';
                    headerTr.append($('<td></td>', {class: 'pop_gridSub'})
                        .append($('<div></div>', {text: othersStr}))
                    );
                    stateTr.append($('<td></td>', {class: 'pop_gridVal'})
                        .append($('<div></div>', {
                            class: 'eventBg',
                            style: 'opacity:0;', //2022.12.25 // 2023.02.01 - 정상일때 흰색이오니 변경 금지
                            'data-key': 'etc'
                        }))
                        .append($('<span></span>',{
                            class: 'errEffect ',
                            text: '정상',
                            'data-key': 'etc'
                        }))
                    );
                    docFrag.append(headerTr);
                    docFrag.append(stateTr);
                    table.append(docFrag);
                }
                else {
                    $('div.errStatusBox').css('height', '24px');
                    $('div.errStatusBox > table tr:last').css('visibility', 'hidden');
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

    /*
    * 이벤트 조회 완료 후 상단 이벤트 그룹 표시
    * */
    setEvtCodeGrpState: function () {

        var rows = $evtGrid.jqxGrid('getboundrows');
        var stateDiv = $('#evtCodeGrpTable div.eventBg');
        var stateSpan = $('#evtCodeGrpTable span.errEffect');
        if (evtCodeMap === undefined) return;

        if (rows != null && rows.length > 0) {
            var maxLvl = 0;
            var evtMap = {
                all: {cnt: rows.length, lvl: 0},
                etc: {cnt: 0, lvl: 0}
            };

            // console.log('evtCodeMap',evtCodeMap)
            for (var x in evtCodeMap) {
                evtMap[x] = {cnt: 0, lvl: 0};
            }

            $.each(rows, function (evtIdx, evtItem) {
                _exist = false;
                if (evtItem.evtLevel > maxLvl) maxLvl = evtItem.evtLevel;
                for (var i=0; i < Object.keys(evtMap).length; i++ ) {
                    if (Object.keys(evtMap)[i] !== 'all' && Object.keys(evtMap)[i] !== 'etc') {
                        if ( evtCodeMap[Object.keys(evtCodeMap)[i]].findIndex(v => v === evtItem.code) > -1 ) {
                            evtMap[parseInt(Object.keys(evtMap)[i])].cnt++;
                            if (evtMap[parseInt(Object.keys(evtMap)[i])].lvl < evtItem.evtLevel) evtMap[parseInt(Object.keys(evtMap)[i])].lvl = evtItem.evtLevel;
                            _exist = true;
                        }
                    }
                }

                if (!_exist) {
                    evtMap.etc.cnt++;
                    if (evtMap.etc.lvl < evtItem.evtLevel) evtMap.etc.lvl = evtItem.evtLevel;
                }
            });

            evtMap.all.lvl = $('#gSiteName').val() == 'HyundaiCar' ? 6 : maxLvl;

            var evtClz = ['normal', 'info', 'warning', 'minor', 'major', 'critical', 'hyundaiCarAllLvl'];
            $.each(evtMap, function (key, item) {

                var div = $('#evtCodeGrpTable div[data-key="{0}"]'.substitute(key));
                var span = $('#evtCodeGrpTable span[data-key="{0}"]'.substitute(key));
                span.text(item.cnt > 0 ? item.cnt : '정상');

                // 필터시 색상이 남아서 제거
                if(item.lvl > 0) {
                    div.removeClass().addClass('eventBg {0}'.substitute(evtClz[item.lvl]));
                    if(item.lvl !== 0) {//정상은 흰색. 나머지는 이벤트 level 색 적용
                        div.attr('style', 'opacity:1')
                    }
                }
                else {
                    div.removeClass();
                }
            });
        }
        else {
            stateSpan.text('정상');
            stateDiv.removeClass().addClass('eventBg');
            if ($('#gSiteName').val() == 'HyundaiCar') {
                $('#evtCodeGrpTable div[data-key="all"]').removeClass().addClass('eventBg hyundaiCarAllLvl');
            }
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

            for (var code in etcEvtCodeMap) {
                filtergroup.addfilter(operator, filtergroup.createfilter('stringfilter', etcEvtCodeMap[code], 'NOT_EQUAL'));
            }
            $evtGrid.jqxGrid('addfilter', 'code', filtergroup);
            $evtGrid.jqxGrid('applyfilters');
        }
        else {
            // find code list
            var codeList = [];
            for (var x in evtCodeMap) {
                if (x == evtGrpNo) codeList = evtCodeMap[evtGrpNo];
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
        Main.initData();
    },

    /** 조회 */
    searchErr: function () {

        if ($("#gSiteName").val() == "KangOneEdu") {
            HmGrid.updateBoundData($evtGrid, ctxPath + '/kac/oms/errStatus/getErrStatusList.do');
        } else {
            HmGrid.updateBoundData($evtGrid, ctxPath + '/main/oms/errStatus/getErrStatusList.do');
        }

    },


    /** config 전체삭제 */
    delConfigAll: function () {
        Server.post('/main/popup/errAction/saveConfigEvtAllStop.do', {
            data: Main.getCommParams(),
            success: function (result) {
                if (result > 0) {
                    alert(result + '건의 Config이벤트가 해제되었습니다.');
                    $('#prgrsBar').val(100);

                }
                else {
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

                }
                else {
                    alert('해제 할 Syslog이벤트가 없습니다.');

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