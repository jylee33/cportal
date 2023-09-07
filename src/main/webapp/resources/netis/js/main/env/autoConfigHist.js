var $configHistGrid;
var $configHistDetailGrid;
var $cfgCheckGrid;
var _cmdNo, _ymdhmsStr, _mngNo;
var Main = {
    /** variable */
    initVariable: function () {
        $configHistGrid = $('#configHistGrid');
        $configHistDetailGrid = $('#configHistDetailGrid');
        $cfgCheckGrid = $('#cfgCheckGrid');
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
        HmJqxSplitter.create($('#subSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
        HmBoxCondition.createPeriod('');
        // 명령어 자동실행 이력
        HmGrid.create($configHistGrid, {
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
                HmGrid.titlerenderer(toolbar, 'Config점검 실행이력');
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
        });

        $configHistGrid.on('rowdoubleclick', function (event) {
            var rowIdx = HmGrid.getRowIdx($configHistGrid, '작업을 선택하세요');
            if(rowIdx === false) return;
            var _rowData = HmGrid.getRowData($configHistGrid, rowIdx);

            _ymdhmsStr = _rowData.ymdhmsStr.replace(/[-: ]/gi, '');
            _cmdNo = _rowData.cmdNo;
            Main.searchDetail();
        });

        // 실패 결과 상세
        HmGrid.create($configHistDetailGrid, {
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
                { text: '실행일시', datafield: 'ymdhmsStr', cellsalign: 'center'},
                { text: '장비명', datafield: 'devName', cellsalign: 'center'},
                { text: '장비IP', datafield: 'devIp', cellsalign: 'center'},
                { text: '실행결과', datafield: 'runStatusStr', cellsalign: 'center'},
                { text: 'Config점검', datafield: 'configStatus', cellsalign: 'center', cellsrenderer : function (row, datafield, value) {
                    var _result = '';
                    if(value > 0){
                        _result = '검출됨';
                    } else {
                        _result = '_';
                    }
                    return "<div style='margin-top: 6.5px; margin-right: 5px' class='jqx-center-align'>" + _result + "</div>";
                }}
            ]
        }, CtxMenu.AUTO_CMD_HIST);
        $configHistDetailGrid.on('rowdoubleclick', function (event) {
            var rowIdx = HmGrid.getRowIdx($configHistDetailGrid, '작업을 선택하세요');
            if(rowIdx === false) return;
            var _rowData = HmGrid.getRowData($configHistDetailGrid, rowIdx);

            _ymdhmsStr = _rowData.ymdhmsStr.replace(/[-: ]/gi, '');
            _mngNo = _rowData.mngNo;
            Main.searchCfgCheckHist();
        });


        HmGrid.create($cfgCheckGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function(data) {
                        data.cmdNo = _cmdNo;
                        data.ymdhms = _ymdhmsStr;
                        data.mngNo = _mngNo;
                        return data;
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '점검필터정규식 이력');
            },
            columns: [
                { text: '실행일시', datafield: 'ymdhmsStr', cellsalign: 'center', width: 120},
                { text: '점검문자내용', datafield: 'cmdContent', minwidth: 200, cellsrenderer : function (row, datafield, value) {
                    return "<div style='margin-top: 6.5px; margin-right: 5px' class='jqx-left-align'>" + value + "</div>";
                }},
                { text: '이벤트레벨', datafield: 'errTypeStr',width: 80},
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
        HmGrid.updateBoundData($configHistGrid, ctxPath + '/main/env/autoConfigHist/getAutoConfigHistList.do');
    },

    searchDetail: function () {
        HmGrid.updateBoundData($configHistDetailGrid, ctxPath + '/main/env/autoConfigHist/getAutoConfigHistDetailList.do');
    },
    searchCfgCheckHist: function () {
        HmGrid.updateBoundData($cfgCheckGrid, ctxPath + '/main/env/autoConfigHist/getCfgCheckHistList.do');
    }
}
$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});