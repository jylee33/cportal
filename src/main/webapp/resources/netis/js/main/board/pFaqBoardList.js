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
		case 'btnWrite':
			this.checkWrite();
			break;
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

		// 사이트에 따라 예외처리. 18.04.17
		var printTime_txt = "작성일자";
		var printTime_val = "printTime";
		var printTime_width = 100;
		if($('#gSiteName').val() != 'Samsung'){
			printTime_txt = "작성일시";
			printTime_val = "printDate";
			printTime_width = 130;
		}
		
		HmGrid.create($boardGrid, {
			source : new $.jqx.dataAdapter({ datatype : "json", url : $('#ctxPath').val() + '/main/oms/faqBoard/getBoardList.do' }, { formatData : function(data) {
				$.extend(data, { boardType : 2, userId : $('#sUserId').val() });
				return data;
			} }),
			height : 530,
			columns : [
					{ text : '번호', datafield : 'boardNo', cellsalign : 'right', align : 'center', width : 80 },
					{ text : '제목', datafield : 'boardTitle', align : 'center', columntype : 'custom', cellsrenderer : function(row, column, value, rowData) {

						var marginImg = $boardGrid.jqxGrid('getcellvalue', row, "fileCount");

						if (marginImg != 0) {
							marginImg = "<img src='../../img/popup/file_icon2.png' >";
						} else {
							marginImg = ""
						}
						return "<div style='margin-top: 4px; margin-left: 5px;'>" + value + "<span style='margin-top: 4px; margin-left: 10px;'>" + marginImg + "</span></div>";
					} }, { text : '작성자', datafield : 'userName', align : 'center', width : 100, columntype : 'custom', cellsrenderer : function(row, column, value, rowData) {
						var _grpName = rowData.grpName;
						if (_grpName != '' && _grpName != null) {
							_grpName = '(' + _grpName + ')';
						} else {
							_grpName = '';
						}

						return "<div style='margin-top: 4px; margin-left: 5px;'>" + value + "<span>" + _grpName + "</span></div>";
					} }, { text : printTime_txt, datafield : printTime_val, align : 'center', cellsalign : 'center', width : printTime_width },
					{ text : '조회수', datafield : 'boardHits', align : 'center', cellsalign : 'center', width : 100 }
			] });

		// 셀값 받아오기
		$boardGrid.on('rowdoubleclick', function(event) {
			var selectedRowIndex = event.args.rowindex;
			var itemget = $boardGrid.jqxGrid('getcellvalue', selectedRowIndex, "boardNo");
			window.location.href = $('#ctxPath').val() + '/main/board/pFaqBoardContents.do?boardNo=' + itemget;
		});
	},

	/** init data */
	initData : function() {

	}, checkWrite : function() {
		var result = $('#sUserId').val();
		var size = result.length;
		if (result != null && size != 0) {
			window.location.href = $('#ctxPath').val() + '/main/board/pFaqBoardWrite.do';
		} else {
			alert("로그인을 하셔야 글쓰기를 할 수 있습니다");
			return;
		}
	},

	boardList : function() {
		HmGrid.updateBoundData($boardGrid, $('#ctxPath').val() + '/main/oms/faqBoard/getBoardList.do');
	},

	boardClose : function() {
		self.close();
	}

};