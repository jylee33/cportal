var $cmdHistGrid;
var $cmdHistDetailGrid;
var _cmdNo, _ymdhmsStr;
var Main = {
    /** variable */
    initVariable: function () {
        $cmdHistGrid = $('#cmdHistGrid');
        $cmdHistDetailGrid = $('#cmdHistDetailGrid');
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
        $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
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
        if(event.keyCode === 13) {
            Main.search();
        }
    },

    /** init design */
    initDesign: function () {
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
        HmBoxCondition.createPeriod('');
        // 명령어 자동실행 이력
        HmGrid.create($cmdHistGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function(data) {
                        $.extend(data, HmBoxCondition.getPeriodParams());
                        data.sCmdName = $('#sCmdName').val();
                        return data;
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '명령어 자동실행 이력');
            },
            columns: [
                { text: '명령어번호', datafield: 'cmdNo', cellsalign: 'center', width: 200, hidden: true},
                { text: '실행일시', datafield: 'ymdhmsStr', cellsalign: 'center', width: 200},
                { text: '명령어 실행 작업명', datafield: 'cmdName', minwidth: 100},
                { text: '작업자_ID', datafield: 'userId', cellsalign: 'center', width: 100},
                { text: '작업자_IP', datafield: 'userIp', cellsalign: 'center', width: 100},
                { text: '대상장비수', datafield: 'totalCnt', width: 150, cellsrenderer: HmGrid.commaNumrenderer},
                { text: '성공/실패', datafield: 'successFailCnt', cellsalign: 'center', width: 150},
            ]
        }, CtxMenu.AUTO_CMD_HIST);

        $cmdHistGrid.on('rowdoubleclick', function (event) {
            var rowIdx = HmGrid.getRowIdx($cmdHistGrid, '작업을 선택하세요');
            if(rowIdx === false) return;
            var _rowData = HmGrid.getRowData($cmdHistGrid, rowIdx);
            _ymdhmsStr = _rowData.ymdhmsStr.replace(/[-: ]/gi, '');
            _cmdNo = _rowData.cmdNo;
            Main.searchDetail();
        });

        // 실패 결과 상세
        HmGrid.create($cmdHistDetailGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function(data) {
                        data.cmdNo = _cmdNo;
                        data.ymdhms = _ymdhmsStr;
                        return data;
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '실패 결과 상세 정보');
            },
            columns: [
                { text: 'yyyymmdd', datafield: 'yyyymmdd', hidden: true},
                { text: 'ymdhms', datafield: 'ymdhms', hidden: true},
                { text: 'mngNo', datafield: 'mngNo', hidden: true},
                { text: 'cmdNo', datafield: 'cmdNo', hidden: true},
                { text: '실행일시', datafield: 'ymdhmsStr', cellsalign: 'center', width: 200},
                { text: '장비명', datafield: 'devName', cellsalign: 'center', width: 200},
                { text: '장비IP', datafield: 'devIp', cellsalign: 'center', width: 200},
                { text: '실행결과', datafield: 'runStatusStr', cellsalign: 'center', width: 200},
                //{ text: '명령어', datafield: 'command',width: 300},
                //{ text: '상세 Log', datafield: 'errorStr', minwidth: 100},
            ]
        }, CtxMenu.AUTO_CMD_HIST_DETAIL);
    },

	/** init data */
	initData: function () {
	    Main.search();
    },

    /* ==========================================================
		버튼 이벤트
	 ===========================================================*/

    search: function () {
        HmGrid.updateBoundData($cmdHistGrid, ctxPath + '/main/env/autoCmdHist/getAutoCmdHistList.do');
    },

    searchDetail: function () {
        HmGrid.updateBoundData($cmdHistDetailGrid, ctxPath + '/main/env/autoCmdHist/getAutoCmdHistDetailList.do');
    }
}
$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});