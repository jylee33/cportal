var $commandRunHistGrid;
var $commandRunResultGrid;
var $commandListGrid;
var _cmdNo, _ymdhmsStr, _mngNo;
var Main = {
    /** variable */
    initVariable: function () {
        $commandRunHistGrid = $('#commandRunHistGrid');
        $commandRunResultGrid = $('#commandRunResultGrid');
        $commandListGrid = $('#commandListGrid');
    },

    /** add event */
    observe: function () {
        $('button').on('click', (event) => Main.eventControl(event));
        $('#sCmdName').on('keyup', (event) => Main.keyupEventControl(event));
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch':
                this.search();
                break;
        }
    },

    keyupEventControl: function (event) {
        if(event.keyCode === 13) {//엔터키
            Main.search();
        }
    },

    /** init design */
    initDesign: function () {
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
        HmJqxSplitter.create($('#subSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

        HmBoxCondition.createPeriod('');

        // 명령어 자동실행 이력
        HmGrid.create($commandRunHistGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function(data) {
                        $.extend(data, HmBoxCondition.getPeriodParams());
                        if($('#sCmdName').val().trim().length != 0){
                            data.sCmdName = $('#sCmdName').val();
                        }
                        return data;
                    }
                }
            ),
            sortable: false,
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '명령어 실행이력');
            },
            columns: [
                { text: '명령어번호', datafield: 'cmdNo', cellsalign: 'center', width: 200, hidden: true},
                { text: '실행일시', datafield: 'ymdhmsStr', cellsalign: 'center', width: 200},
                { text: '작업명', datafield: 'cmdName', minwidth: 100},
                { text: '작업자', datafield: 'userId', hidden: true},
                { text: '작업자', datafield: 'userName', cellsalign: 'center', width: 150},
                // { text: '작업자IP', datafield: 'userIp', cellsalign: 'center', width: 100},
                { text: '장비수', datafield: 'totalCnt', width: 150, cellsrenderer: HmGrid.commaNumrenderer},
                { text: '성공/실패', datafield: 'successFailCnt', cellsalign: 'center', width: 150},
            ]
        });

        $commandRunHistGrid.on('rowdoubleclick', function (event) {
            var rowIdx = HmGrid.getRowIdx($commandRunHistGrid, '실행이력을 선택하세요');
            if(rowIdx === false) return;
            var _rowData = HmGrid.getRowData($commandRunHistGrid, rowIdx);

            _ymdhmsStr = _rowData.ymdhmsStr.replace(/[-: ]/gi, '');
            _cmdNo = _rowData.cmdNo;
            Main.searchRunResult();
            Main.searchCommandList();
        });

        // 실패 결과 상세
        HmGrid.create($commandRunResultGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function(data) {
                        data.cmdNo = _cmdNo;
                        data.ymdhms = _ymdhmsStr;
                        data.yyyymmdd = _ymdhmsStr?.substring(0,8);
                        return data;
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '실행결과');
            },
            columns: [
                { text: 'yyyymmdd', datafield: 'yyyymmdd', hidden: true},
                { text: 'ymdhms', datafield: 'ymdhms', hidden: true},
                { text: 'mngNo', datafield: 'mngNo', hidden: true},
                { text: 'cmdNo', datafield: 'cmdNo', hidden: true},
                { text: '그룹명', datafield: 'grpName', cellsalign: 'center'},
                { text: '장비명', datafield: 'disDevName', cellsalign: 'center'},
                { text: '장비IP', datafield: 'devIp', cellsalign: 'center'},
                { text: '실행결과', datafield: 'runStatusStr', cellsalign: 'center'},
                { text : '결과 상세보기', width: 80, columntype: 'button', cellsrenderer: function(row, datafield, value) {
                    return "보기" ;
                },
                    buttonclick: function(row) {
                        var _rowData = $commandRunResultGrid.jqxGrid('getrowdata', row);
                        var params = {};
                        params.yyyymmdd = _rowData.yyyymmdd;
                        params.ymdhms = _rowData.ymdhms;
                        params.cmdNo = _rowData.cmdNo;
                        params.mngNo = _rowData.mngNo;
                        $.post(ctxPath + '/main/popup/env/pCommandRunDetail.do', function(result) {
                            HmWindow.open($('#pwindow'), '명령어실행 상세내용', result, 700, 700, 'pwindow_init', params);
                        });
                    }//buttonClick
                }
            ]
        }, CtxMenu.COMM);


        HmGrid.create($commandListGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function(data) {
                        data.cmdNo = _cmdNo;
                        return data;
                    }
                }
            ),
            sortable: false,
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '작업 실행 명령어');
            },
            columns: [
                { text: '기대문자열', datafield: 'expectStr', width: 120},
                { text: '명령어', datafield: 'command', width: 120},
                { text: '설명', datafield: 'commandDesc'},
                { text: '사용여부', datafield: 'useFlag', columntype: 'checkbox', width: 80},
            ]
        });
    },

	/** init data */
	initData: function () {
	    Main.search();
    },

    /* ==========================================================
		버튼 이벤트
	 ===========================================================*/

    search: function () {
        HmGrid.updateBoundData($commandRunHistGrid, ctxPath + '/main/env/commandRunHist/getCommandRunHist.do');
    },

    searchRunResult: function () {
        HmGrid.updateBoundData($commandRunResultGrid, ctxPath + '/main/env/commandRunHist/getCommandRunResult.do');
    },
    searchCommandList: function () {
        HmGrid.updateBoundData($commandListGrid, ctxPath + '/main/env/commandRunHist/getCommandList.do');
    }
}
$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});