var $boardGrid;
var itemget;

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
		case 'btnWrite':
			this.checkWrite();
			break;
		case 'btnSearch':
			this.searchNBoard();
			break;
		}
	},

	/** init design */
	initDesign : function() {
		// 사이트에 따라 예외처리. 18.04.17
		var printTime_txt = "작성시간";
		var printTime_val = "printTime";
		var printTime_width = 100;
		if($('#gSiteName').val() != 'Samsung'){
			printTime_txt = "작성일시";
			printTime_val = "printDate";
			printTime_width = 130;
		}
		
		HmGrid.create($boardGrid, {
			source : new $.jqx.dataAdapter({
				datatype : 'json',
				url : $('#ctxPath').val() + '/main/oms/noticeBoard/getBoardList.do' ,
                datafields:[
            	{ name: 'boardNo', type: 'int' },
            	{ name: 'boardTitle', type: 'string' },
            	{ name: 'userName', type: 'string' },
            	{ name: 'printDate', type: 'string' },
            	{ name: 'boardHits', type: 'int' },
				{ name: 'fileCount', type: 'int' }
        		]}
			),
			columns : [
					{ text : '번호', datafield : 'boardNo', cellsalign : 'center', width : 50 },
					{ text : '제목', datafield : 'boardTitle', align : 'center', columntype : 'custom', cellsrenderer : function(row, column, value, rowData) {
						var marginImg = $boardGrid.jqxGrid('getcellvalue', row, 'fileCount');
						if (marginImg != 0) {
							marginImg = '<img src="../../img/popup/file_icon2.png">';
						} else {
							marginImg = ''
						}
						return '<div style="margin-top: 4px; margin-left: 5px;">' + value + '<span style="margin-top: 4px; margin-left: 10px;">' + marginImg + '</span></div>';
					} },
					{ text : '작성자', datafield : 'userName', cellsalign : 'center', cellsformat : 'c2', width : 100 },
					{ text : printTime_txt, datafield : printTime_val, cellsalign : 'center', width : printTime_width },
					{ text : '조회수', datafield : 'boardHits', cellsalign : 'center', width : 50 , filtertype:'number'}
			] });

		// 셀값 받아오기
		$boardGrid.on('rowdoubleclick', function(event) {
			var selectedRowIndex = event.args.rowindex;
			itemget = $boardGrid.jqxGrid('getcellvalue', selectedRowIndex, 'boardNo');
			Main.popContents(itemget);
		});

		$('#section').css('display', 'block');
	},

	/** init data */
	initData : function() {

	}, checkWrite : function() {
		var result = $('#sUserId').val();
		var size = result.length;
		if (result != null && size != 0) {
			HmUtil.createPopup('/main/board/pNoticeBoardWrite2.do', $('#hForm'), 'pNoticeBoardWrite2', 700, 565);
		} else {
			alert('로그인을 하셔야 글쓰기를 할 수 있습니다');
			return;
		}
	},

	searchNBoard : function() {
		HmGrid.updateBoundData($boardGrid, $('#ctxPath').val() + '/main/oms/noticeBoard/getBoardList.do');
	},

	popContents : function(_boardNo) {
		var params = { boardNo : _boardNo };
		HmUtil.createPopup('/main/board/pNoticeBoardContents.do', $('#hForm'), 'pNoticeBoardContents', 700, 565, params);
	}

};