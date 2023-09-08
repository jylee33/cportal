var $scheduleGrid;
var Main = {
    /** variable */
    initVariable: function () {
        $scheduleGrid = $('#scheduleGrid');
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
				this.addSchedule();
				break;
			case 'btnEdit':
				this.editSchedule();
				break;
			case 'btnDel':
				this.delSchedule();
				break;
        }
    },

    /** init design */
    initDesign: function () {
		HmGrid.create($scheduleGrid, {
			source: new $.jqx.dataAdapter(
				{
					datatype: 'json'
				},
				{
					formatData: function(data) {
						var sScheduleNm = $('#sScheduleNm').val();
						if(sScheduleNm.length != 0)
							data.sScheduleNm = sScheduleNm;
						return data;
					}
				}
			),
			selectionmode: 'multiplerowsextended',
			columns: [
				{ text: 'scheType', datafield: 'scheType', hidden: true},
				{ text: 'scheNo', datafield: 'scheNo', hidden: true},
				{ text: '스케줄명', datafield: 'scheduleNm', width: 200},
				// { text: '활성화상태', datafield: 'useFlagStr', width: 100, cellsalign: 'center'},
                { text: '사용여부', datafield: 'useFlag', width: 100, cellsalign: 'center', columntype: 'checkbox'},
				{ text: '최종실행일자', datafield: 'lastRunDtmStr', width: 100, cellsalign: 'center'},
                { text: '다음실행일자', width: 140, cellsalign: 'center', cellsRenderer: HmGrid.getNextExecDate },
				{ text: 'cronType', datafield: 'cronType', hidden: true},
				{ text: '주기구분', datafield: 'cronTypeStr', width: 150, cellsalign: 'center'},
				{ text: '요일', datafield: 'cronWeekStr', width: 150, cellsalign: 'center'},
				{ text: '반복시간', datafield: 'execTimeStr', width: 150},
                { text: '수정자', datafield: 'userName', width: 100, cellsalign: 'center'},
				{ text: '설명', datafield: 'memo', minwidth: 150},
				{ text: 'cmdNoList', datafield: 'cmdNoList', hidden: true},
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
        HmGrid.getNextWeek();
		HmGrid.updateBoundData($scheduleGrid, ctxPath + '/main/env/scheduleMgmt/getScheduleList.do');
    },

	addSchedule: function () {
        $.post(ctxPath + '/main/popup/env/pScheduleAdd.do',
            function(result) {
                HmWindow.open($('#pwindow'), "스케줄 추가", result, 600, 360, 'pwindow_init', null);
            }
        );
    },

	editSchedule: function () {

        var rowIdxes = HmGrid.getRowIdxes($scheduleGrid, '선택한 스케줄러가 없습니다.');
        if(rowIdxes.length > 1){
        	alert('하나만 수정할수 있습니다.');
        	return ;
		}

        var rowData = HmGrid.getRowData($scheduleGrid, rowIdxes[0]);

        $.post(ctxPath + '/main/popup/env/pScheduleEdit.do',
            function(result) {
                HmWindow.open($('#pwindow'), "스케줄 수정", result, 600, 360, 'pwindow_init', rowData);
            }
        );
        
		//HmUtil.createPopup('/main/popup/env/pCommandEdit.do' , $('#hForm'), 'pCommandEdit', 600, 220, rowData);
    },

	delSchedule: function () {
        var _dataList = HmGrid.getRowDataList($scheduleGrid);
        if(_dataList == null) return;

        if(!confirm('[' + _dataList.length +']개의 스케줄을 삭제하시겠습니까?')) return;

        var _cronDelList = [];
        var _reserveDelList = [];
        for(var i = 0 ; i < _dataList.length ; i++){
            var _item = _dataList[i];
            if(_item.useFlag == 1){
				if(_item.scheType == 'C'){
                    _cronDelList.push(_item.scheNo);
				} else {
                    _reserveDelList.push(_item.scheNo);
				}
			}
        }//for end(i)

        var _restParam = {};
        if(_cronDelList.length != 0){
            _restParam.CRON = {
                DELETE: _cronDelList
            }
        }
        if(_reserveDelList.length != 0){
            _restParam.RESERVATION = {
                DELETE: _reserveDelList
            }
        }
        Server.post('/main/env/scheduleMgmt/delScheduleList.do', {
            data: {list: _dataList},
            success: function(result){
                alert('삭제되었습니다.');
                Main.search();
                ServerRest.reqCronTab(_restParam);
            }//success()
        });//Server.post();
    }
}
$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});