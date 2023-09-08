var $boardGrid;

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});

var Main = {
	/** variable */
	initVariable : function() {
		$boardGrid = $('#boardGrid');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) {
			Main.eventControl(event);
		});
		$('img').bind('click', function(event) {
			Main.eventControl(event);
		});
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case 'btnBoardList':
			this.boardList();
			break;
		case 'btnClose':
			this.boardClose();
			break;
		}
	},

	/** init design */
	initDesign : function() {
		HmGrid.create($boardGrid, {
			source : new $.jqx.dataAdapter({ datatype : "json", url : $('#ctxPath').val() + '/main/oms/errStatus/getMainErrStatusList.do' }, { formatData : function(data) {
				$.extend(data, {});
				return data;
			} }),
			height : 520,
			columns : [
					{ text : '발생일시', datafield : 'ymdhms', cellsalign : 'right', align : 'center', width : 80 }, { text : '그룹', datafield : 'grpName', width : 150 },
					{ text : '장애종류', datafield : 'srcTypeStr', cellsalign: 'center', width : 80 },
					{ text : '장애대상', datafield : 'srcInfo', minwidth : 400 }, 
					{ text : '이벤트명', datafield : 'evtName', width : 140 },
					{ text : '장애등급', datafield : 'evtLevelStr', width : 100, filtertype : 'checkedlist', cellsrenderer : HmGrid.evtLevelrenderer },
					{ text : '지속시간', datafield : 'sumSec', width : 150, cellsrenderer : HmGrid.cTimerenderer },
					{ text : '장애상태', datafield : 'status', align : 'center', cellsalign : 'center', width : 100 },
					{ text : '진행상태', datafield : 'progressState', align : 'center', cellsalign : 'center', width : 100 },
					{ text : '조치내역', datafield : 'receiptMemo', align : 'center', cellsalign : 'right', width : 100 },
					{ text : '이벤트설명', datafield : 'limitDesc', align : 'center', cellsalign : 'right', width : 100 }
			] });

	},

	/** init data */
	initData : function() {

	},

	boardList : function() {
		HmGrid.updateBoundData($boardGrid, $('#ctxPath').val() + '/main/oms/noticeBoard/getBoardList.do');
	},

	boardClose : function() {
		self.close();
	}

};