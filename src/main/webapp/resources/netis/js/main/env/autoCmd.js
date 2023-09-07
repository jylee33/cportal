var $commandGrid;
var Main = {
    /** variable */
    initVariable: function () {
		$commandGrid = $('#commandGrid');
    },

    /** add event */
    observe: function () {
		$('button').bind('click', function(event) { Main.eventControl(event); });
        $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
        	case 'btnSearch':
        		this.search();
				break;
			case 'btnAdd':
				this.addCommand();
				break;
			case 'btnEdit':
				this.editCommand();
				break;
			case 'btnDel':
				this.delCommand();
				break;
			case 'btnCopy':
				this.copyCommand();
				break;
        }
    },

    /** init design */
    initDesign: function () {
		HmGrid.create($commandGrid, {
			source: new $.jqx.dataAdapter(
				{
					datatype: 'json'
				},
				{
					formatData: function(data) {
						var sAutoCmdNm = $('#sAutoCmdNm').val();
						if(sAutoCmdNm.length != 0)
							data.sAutoCmdNm = sAutoCmdNm;
						return data;
					}
				}
			),
			selectionmode: 'multiplerowsextended',
			columns: [
				{ text: 'autoCmdNo', datafield: 'autoCmdNo', hidden: true},
				{ text: 'autoCmdType', datafield: 'autoCmdType', hidden: true},
				{ text: 'cronType', datafield: 'cronType', hidden: true},
				{ text: '명령어 실행 작업명', datafield: 'autoCmdNm', width: 200},
				{ text: '활성화상태', datafield: 'useFlagStr', width: 100, cellsalign: 'center'},
				{ text: '실행상태', datafield: 'runFlagStr', width: 100, cellsalign: 'center'},
				{ text: '마지막실행일자', datafield: 'lastRunDtmStr', width: 100, cellsalign: 'center'},
				{ text: '주기구분', datafield: 'cronTypeStr', width: 150, cellsalign: 'center'},
				{ text: '요일', datafield: 'cronWeekStr', width: 150, cellsalign: 'center'},
				{ text: '반복시간', datafield: 'execTimeStr', width: 150},
				{ text: '대상장비수', datafield: 'devCnt', width: 150, cellsrenderer: HmGrid.commaNumrenderer },
				{ text: '담당자', datafield: 'managerNm', width: 100},
                { text: '수정자_ID', datafield: 'userId', width: 100},
                { text: '수정자_IP', datafield: 'userIp', width: 100},
				{ text: '설명', datafield: 'memo', minwidth: 150},
          	]
		}, CtxMenu.COMM);
    },

	/** init data */
	initData: function () {
		this.search();
    },

	/* ==========================================================
		버튼 이벤트
	 ===========================================================*/
	search : function () {
		HmGrid.updateBoundData($commandGrid, ctxPath + '/main/env/autoCmd/getAutoCmdList.do');
    },

	addCommand: function () {
        $.post(ctxPath + '/main/popup/env/pCommandAdd.do',
            function(result) {
                HmWindow.open($('#pwindow'), "명령어실행작업추가", result, 800, 502, 'pwindow_init', null);
            }
        );
		//HmUtil.createPopup('/main/popup/env/pCommandAdd.do' , $('#hForm'), 'pCommandAdd', 600, 220);
    },

	editCommand: function () {

        var rowIdxes = HmGrid.getRowIdxes($commandGrid, '선택한 스케줄러가 없습니다.');
        if(rowIdxes.length != 1){
        	alert('하나만 수정할수 있습니다.');
        	return ;
		}

        var rowData = HmGrid.getRowData($commandGrid, rowIdxes[0]);

        $.post(ctxPath + '/main/popup/env/pCommandEdit.do',
            function(result) {
                HmWindow.open($('#pwindow'), "자동명령어 수정", result, 800, 500, 'pwindow_init', rowData);
            }
        );
        
		//HmUtil.createPopup('/main/popup/env/pCommandEdit.do' , $('#hForm'), 'pCommandEdit', 600, 220, rowData);
    },

	delCommand: function () {
        var _dataList = HmGrid.getRowDataList($commandGrid);
        if(_dataList == null) return;

        if(!confirm('[' + _dataList.length +']개의 명령어를 삭제하시겠습니까?')) return;

        var _cronList = [];
        var _reserveList = [];
        for(var i = 0 ; i < _dataList.length ; i++){
            var _item = _dataList[i];
            if(_item.useFlag == 1){
				if(_item.autoCmdType == 'crontab'){
					_cronList.push(_item.autoCmdNo);
				} else {
					_reserveList.push(_item.autoCmdNo);
				}
			}
        }//for end(i)

        var _restParam = {};
        if(_cronList.length != 0){
            _restParam.CRON = {
                DELETE: _cronList
            }
        }
        if(_reserveList.length != 0){
            _restParam.RESERVATION = {
                DELETE: _reserveList
            }
        }

        console.log(_dataList);
        Server.post('/main/com/autoCommon/delAutoCommonList.do', {
            data: {dataList: _dataList},
            success: function(result){
                alert('삭제되었습니다.');
                Main.search();
                ServerRest.reqCronTab(_restParam);
                $('#pbtnClose').click();
            }//success()
        });//Server.post();
    },
    copyCommand: function(){

        var rowIdxes = HmGrid.getRowIdxes($commandGrid, '선택한 스케줄러가 없습니다.');
        if(rowIdxes.length != 1){
            alert('하나만 복사할 수 있습니다.');
            return ;
        }

        var rowData = HmGrid.getRowData($commandGrid, rowIdxes[0]);

        Server.post('/main/comautoCommon/copyAutoCommand.do', {
            data: {jobType: 'cmd_run', jobNo: rowData.jobNo, table: rowData.autoCmdType},
            success: function(result){
                alert('복사되었습니다.');
                Main.search();
                if(rowData.useFlag == 1){
                	var _restParam = {};
                	if(rowData.autoCmdType == 'crontab'){
                        _restParam.CRON = {
                            INSERT: [result.cronNo]
                        }
					} else {
                        _restParam.RESERVATION = {
                            INSERT: [result.reserveNo]
                        }
					}
                	ServerRest.reqCronTab(_restParam);
				}
                $('#pbtnClose').click();
            }//success()
        });//Server.post();
	}

}
$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();

	setInterval(function(){
	    Main.search();
    }, 60 * 1000)
});