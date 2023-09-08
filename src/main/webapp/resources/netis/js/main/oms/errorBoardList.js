var $treeGrid;
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
		$treeGrid = $('#treeGrid');
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
			case 'btnAppr':
				this.editAppr();
				break;
			case 'btnWrite':
				this.checkWrite();
				break;
			case 'btnSearch':
				this.searchEBoard();
				break;
			case 'btnDelete':
				this.delBoard();
				break;
		}
	},

	/** init design */
	initDesign : function() {
		// 사이트에 따라 예외처리. 18.04.17
		var checkFlagStr_txt = "처리현황";
		var checkDate_txt = "처리시간";
		var printTime_txt = "작성시간";
		var printTime_val = "printTime";
		var printTime_width = 100;
		if($('#gSiteName').val() != 'Samsung'){
			checkFlagStr_txt = "상태";
			checkDate_txt = "완료처리일시";
			printTime_txt = "작성일시";
			printTime_val = "printDate";
			printTime_width = 130;
		}
		
		
		var source = { dataType : "json", hierarchy : { keyDataField : { name : 'boardNo' }, parentDataField : { name : 'boardParentNo' } }, id : 'boardNo',
			url : $('#ctxPath').val() + '/main/oms/errorBoard/getBoardList.do' };
		var dataAdapter = new $.jqx.dataAdapter(source);
		// create Tree Grid
		$treeGrid.jqxTreeGrid(
				{
					width : '100%',
					height : '100%',
					source : dataAdapter,
					theme : jqxTheme,
					pageable : true,
					// pageSize : 100,
					pageSizeOptions : [
							"100", "500", "1000"
					],
					columnsResize : true,
					columnsHeight : 26,
					sortable : true,
                    localization : getLocalization('kr'),
					selectionMode : "singlerow",
					altRows : false,
					columns : [
							{ text : '번호', datafield : 'boardNo', align : 'center', width : 100 },
							{ text : '제목', datafield : 'boardTitle', align : 'center', cellsrenderer : function(row, column, value, rowData) {
								var marginLeft = 0;
								var marginImg = "";
								if (rowData.level > 0) {
									marginLeft = 10 * rowData.level;
									marginImg = "<img src='../../img/popup/answer_icon.png' >";
								}
								return "<div style='margin-top: 2px; margin-bottom: 2px; margin-left: " + marginLeft + "px;'>" + marginImg + value + "</div>";
							} },
                        	{ text : '등급', datafield : 'temp1', align : 'center', width : 80, cellsrenderer : HmTreeGrid.evtLevelrenderer	},
							{ text : checkFlagStr_txt, datafield : 'checkFlagStr', align : 'center', width : 80, cellsrenderer : HmTreeGrid.boardStatusrenderer	},
                        	{ text : checkDate_txt, datafield : 'checkDate', align : 'center', cellsalign : 'center', width : 130 },
							{ text : '작성자', datafield : 'userName', align : 'center', width : 100, columntype : 'custom', cellsrenderer : function(row, column, value, rowData) {
								var _grpName = rowData.grpName;
								if (_grpName != '' && _grpName != null) {
									_grpName = '(' + _grpName + ')';
								} else {
									_grpName = '';
								}
								return "<div style='margin-top: 2px; margin-bottom: 2px; margin-left: 5px; margin:0 auto; text-align:center;'>" + value + "<span>" + _grpName + "</span></div>";
							} },
							{ text : printTime_txt, datafield : printTime_val, align : 'center', cellsalign : 'center', width : printTime_width },
							{ text : '조회수', datafield : 'boardHits', align : 'center', cellsalign : 'center', width : 50 }
					] }).on('bindingComplete', function(event) {
			$treeGrid.jqxTreeGrid('expandAll');
		});

		// 셀값 받아오기
		$treeGrid.on('rowDoubleClick', function(event) {
			itemget = event.args.row.boardNo;
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
			HmUtil.createPopup('/main/board/pErrorBoardWrite.do', $('#hForm'), 'pErrorBoardWrite', 700, 590);
		} else {
			alert("로그인을 하셔야 글쓰기를 할 수 있습니다");
			return;
		}
	},

	delBoard: function () {
        if (HmTreeGrid.getSelectedItem($treeGrid)) {
            var rowdata = HmTreeGrid.getSelectedItem($treeGrid);
            if (confirm("삭제 하시겠습니까?") != true) return;
            $.ajax({
                type : "post",
                url :$('#ctxPath').val() + '/main/oms/errorBoard/delBoard.do',
                data : { boardNo : rowdata.boardNo },
                dataType : "json",
                success : function(jsonData) {
                    var grpSelection = $treeGrid.jqxTreeGrid('getSelection');
                    var treeItem = grpSelection[0];
                    $treeGrid.jqxTreeGrid('deleteRow', treeItem.uid)
                    alert("삭제 되었습니다");
                }
            });
        } else {
            alert("게시물을 선택해주세요");
            return false;
        }
    },

	searchEBoard : function() {
		$treeGrid.jqxTreeGrid('updateBoundData');
	},

	popContents : function(_boardNo) {
		var params = { boardNo : _boardNo };
		HmUtil.createPopup('/main/board/pErrorBoardContents.do', $('#hForm'), 'pErrorBoardContents', 700, 450, params);
	},

	/** 게시판 번호로 게시판 글 승인 */
	editAppr : function() {
		if (HmTreeGrid.getSelectedItem($treeGrid)) {
			var rowdata = HmTreeGrid.getSelectedItem($treeGrid);
			if (rowdata.checkFlag.toString() === '1') {
                alert('이미 처리 완료되었습니다.');
                return;
			}
			if (!confirm('처리 현황을 확인으로 변경합니다'))
				return;
			Server.post('/main/oms/errorBoard/editAppr.do', { data : { boardNo : rowdata.boardNo }, success : function(result) {
				$treeGrid.jqxTreeGrid('updateBoundData');
				alert('처리 완료되었습니다.');
			} });
		} else {
			alert("게시물을 선택해주세요");
			return false;
		}
	}

};