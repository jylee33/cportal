var $grpTreeGrid, $urlGrid, $filterGrid;
var evtIndex;
var ctxIdxs = 0;
var Main = {
    /** variable */
    initVariable: function() {
        $grpTreeGrid = $('#grpTreeGrid'), $urlGrid = $('#urlGrid'), $filterGrid = $('#filterGrid');
        this.initCondition();
    },

    initCondition: function() {
        HmBoxCondition.createRadio($('#sStatus'), [{label: '전체', value: -1}, {label: '정상', value: 1}, {label: '장애', value: 0}]);
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnSearch': this.searchWebSvc(); break;
            case 'btnAdd': this.addWebSvc(); break;
            case 'btnEdit': this.editWebSvc(); break;
            case 'btnDel': this.delWebSvc(); break;

            //필터관련 버튼
            case 'btnAdd_filter': this.addFilter(); break;
            case 'btnEdit_filter': this.editFilter(); break;
            case 'btnDel_filter': this.delFilter(); break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function(event) {
        if(event.keyCode == 13) {
            Main.searchDev();
        }
    },

    /** init design */
    initDesign: function() {
        Master.createGrpTab(Main.selectTree);
        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

        HmGrid.create($urlGrid, {
            source: new $.jqx.dataAdapter(
                    {
                        datatype: 'json'
                    },
                    {
                        formatData: function(data) {
                            $.extend(data, Main.getCommParams());
                            return data;
                        },
                        loadComplete: function(records) {

                        }
                    }
            ),
            columns:
                    [
                        { text : 'svc_no', datafield : 'svcNo', hidden: true },
                        { text : '그룹명', datafield : 'grpName', width: 130 },
                        { text : '서버명', datafield : 'devName', width: 150 },
                        { text : '사용여부', datafield : 'useFlag', width: 80, cellsrenderer: HmGrid.setUnsetRenderer },
                        { text : 'url', datafield : 'svcInfo', minwidth : 150  },
                        { text : '상태', datafield : 'status', width: 70, cellsalign: 'center', filtertype: 'checkedlist', cellsrenderer: HmGrid.healthChkrenderer,
                            createfilterwidget: function (column, columnElement, widget) {
                                widget.jqxDropDownList({
                                    renderer: HmGrid.healthChkFilterRenderer
                                });
                            }
                        },
                        { text : '설명', datafield : 'description', minwidth: 150 ,columngroup: 'comm' },
                        //{ text : 'extraInfo', datafield : 'extraInfo', width: 100, cellsalign: 'right', hidden: true},
                        //{ text : 'evt_level', datafield : 'evtLevel', width: 100, cellsalign: 'right', hidden: true},
                        { text : 'TIMEOUT', datafield : 'tcpTimeout', width: 70, cellsalign: 'right', filterable: false ,
                        cellsRenderer: function (row, column, value, rowData) {
                                var extraInfo = $urlGrid.jqxGrid('getcellvalue', row, "extraInfo");
                                var jsonExtraInfo = JSON.parse(extraInfo);
                                var val = jsonExtraInfo.TIMEOUT;
                                return '<div style="margin-top: 6px" class="jqx-grid-cell-middle-align">' + val + '</div>';
                            }
                        },
                        { text : 'COUNT', datafield : 'tcpCount', width: 70, cellsalign: 'right', filterable: false  ,
                        cellsRenderer: function (row, column, value, rowData) {
                                var extraInfo = $urlGrid.jqxGrid('getcellvalue', row, "extraInfo");
                                var jsonExtraInfo = JSON.parse(extraInfo);
                                var val = jsonExtraInfo.CNT;
                                return '<div style="margin-top: 6px" class="jqx-grid-cell-middle-align">' + val + '</div>';
                            }
                        },
                        

                        { text : '최소(ms)', columngroup: 'resptime', datafield : 'respMin',  width: 80, cellsalign: 'right' },
                        { text : '최대(ms)', columngroup: 'resptime', datafield : 'respMax',  width: 80, cellsalign: 'right' },
                        { text : '평균(ms)', columngroup: 'resptime', datafield : 'respAvg',  width: 80, cellsalign: 'right' },
                        { text : '응답횟수', datafield : 'successCnt', width: 80, cellsalign: 'right' },
                        { text : '시도횟수', datafield : 'iterateCnt', width: 80, cellsalign: 'right' },
                        { text : '응답률(%)', datafield : 'respPer', width: 100, cellsrenderer: HmGrid.progressbarrenderer },
                        { text : '최종수집일시', datafield : 'lastUpd', width: 160 , cellsalign: 'center'}
                    ]
        }, CtxMenu.RESTIME, ctxIdxs++);

        $urlGrid.on('bindingcomplete', function (event) {
            $urlGrid.jqxGrid('selectrow', 0)
        });

        $urlGrid.on('rowselect', function (event) {
            if(event.args.row) {
                evtIndex = event.args.row.boundindex;
                Main.searchConfFilter();
            }
        });

        Main.createFilterGrid();

        $('#section').css('display', 'block');


    },

    createFilterGrid: function () {

        HmGrid.create($filterGrid, {
            source : new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function (data) {
                        var evtInfo = HmGrid.getRowData($urlGrid, evtIndex);
                        if(evtInfo !== null) {
                            data.workerNo = evtInfo.svcNo;
                        }
                        return data;
                    }
                }
            ),
            pageable: false,
            columns :
                [
                    { text : '위변조 판단여부', datafield : 'filerUseFlag', width: 100, cellsrenderer: HmGrid.setUnsetRenderer,filterable: false},
                    { text : '필터명', datafield : 'filterName', width : 250 , filterable: false},
                    { text : '이벤트등급', datafield : 'evtLevelFilter', width : 70 , filterable: false,
                        cellsrenderer: HmGrid.evtLevelrenderer,
                        cellsalign: 'center',
                        createfilterwidget: function (column, columnElement, widget) {
                            widget.jqxDropDownList({
                                renderer: HmGrid.evtLevelFilterRenderer
                            });
                        }
                    },
                    { text : '대소문자', datafield : 'caseIgnore', displayfield: 'caseIgnoreStr', width : 200 ,filterable: false},
                    { text : '필터구분', datafield : 'filterType', displayfield: 'filterTypeStr', width : 200 ,filterable: false},
                    { text : '위변조판단문자', datafield : 'filterForm', minwidth : 150 , filterable: false},
                ]
        }, CtxMenu.NONE);
    },

    searchConfFilter: function () {
        HmGrid.updateBoundData($filterGrid, '/main/nms/urlSvcPort/getUrlSvcPortFilterList.do');
    },

    /** init data */
    initData: function() {

    },

    /** 그룹트리 선택이벤트 */
    selectTree: function() {
        Main.searchWebSvc();
    },

    /** 공통 파라미터 */
    getCommParams: function() {
        var params = Master.getGrpTabParams();
        params.sStatus = HmBoxCondition.val('sStatus');
        return params;
    },

    searchWebSvc: function() {
        HmGrid.updateBoundData($urlGrid, ctxPath + '/main/nms/urlSvcPort/getUrlSvcPortList.do');
    },

    addWebSvc: function() {
        $.post(ctxPath + '/main/popup/nms/pUrlSvcPortAdd.do', function(result) {
            HmWindow.open($('#pwindow'), '웹 서비스 감시 추가', result, 600, 380, 'pwindow_init');
        });
    },

    editWebSvc: function() {
        var rowdata = HmGrid.getRowData($urlGrid);
        if(rowdata == null) {
            alert('웹 서비스를 선택해주세요.');
            return;
        }
        $.post(ctxPath + '/main/popup/nms/pUrlSvcPortEdit.do', function(result) {
            HmWindow.open($('#pwindow'), '웹 서비스 감시 수정', result, 600, 380, 'pwindow_init', rowdata);
        });
    },

    delWebSvc: function() {
        var rowdata = HmGrid.getRowData($urlGrid);

        if(rowdata == null) {
            alert('웹 서비스를 선택해주세요.');
            return;
        }
        if(!confirm('[{0}] 웹 서비스를 삭제하시겠습니까?'.substitute(rowdata.svcInfo))) return;

        Server.post('/main/nms/urlSvcPort/delUrlSvcPort.do', {
            data: { svcNo: rowdata.svcNo , evtCd: rowdata.evtCd},
            success: function() {
                $urlGrid.jqxGrid('deleterow', rowdata.uid);
                alert('삭제되었습니다.');
            }
        })
    },

    addFilter: function() {
        var rowData = HmGrid.getRowData($urlGrid);
        if(rowData == null) {
            alert('웹서비스를 선택해주세요.');
            return;
        }

        $.post(ctxPath + '/main/popup/nms/pUrlSvcPortFilterAdd.do', function(result) {
            HmWindow.open($('#pwindow'), '웹 서비스 위변조 추가', result, 600, 250, 'pwindow_init', rowData);
        });
    },

    editFilter: function () {
        var rowData = HmGrid.getRowData($filterGrid);
        if(rowData == null) {
            alert('위변조 데이터를 선택해주세요.');
            return;
        }

        $.post(ctxPath + '/main/popup/nms/pUrlSvcPortFilterEdit.do', function(result) {
            HmWindow.open($('#pwindow'), '웹 서비스 위변조 수정', result, 600, 250, 'pwindow_init', rowData);
        });
    },

    delFilter: function () {
        var rowData = HmGrid.getRowData($filterGrid);
        if(rowData == null) {
            alert('위변조 데이터를 선택해주세요.');
            return;
        }

        if(!confirm('위변조 데이터를 삭제하시겠습니까?')) return;

        var params = {
            workerNo: rowData.workerNo,
            seqNo: rowData.seqNo
        };

        Server.post('/main/nms/urlSvcPort/delUrlSvcPortFilter.do', {
            data: params,
            success: function () {
                alert('삭제되었습니다.');
                HmGrid.updateBoundData($filterGrid, '/main/nms/urlSvcPort/getUrlSvcPortFilterList.do');
                $('#pbtnClose').click();

            }
        });
    }

};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});