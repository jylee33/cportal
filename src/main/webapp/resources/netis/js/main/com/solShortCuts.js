var $solGrid, isAdmin = false;
var editUserIds = [];
var userId;
var authGrpList = [], mapInheritList = [];
var Main = {
		/** variable */
		initVariable: function() {
			var auth= $('#sAuth').val().toUpperCase();
			if(auth == 'SYSTEM' || auth == 'ADMIN') isAdmin = true;
			$solGrid = $('#solGrid');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case "btnSave": this.saveSolution(); break;
			case "btnSearch": this.searchSolution(); break;
			case "btnAdd":	this.addSolution(); break;
		    case "btnDel": this.delSolution(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmWindow.create($('#pwindow'), 100, 100);
			HmGrid.create($solGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							updaterow: function(rowid, rowdata, commit) {
								if(editUserIds.indexOf(rowid) == -1)
									editUserIds.push(rowid);
									commit(true);
				            },
							datafields: [
					             { name: 'codeKind', type: 'string' },
					             { name: 'codeId', type: 'string' },
					             { name: 'codeValue1', type: 'string' },
					             { name: 'codeValue2', type: 'string' },
				            ]
						}
				),
				editable: true,
				editmode : 'selectedcell',
				columns: 
				[
					{ text : 'codeKind', datafield : 'codeKind', hidden: true, pinned: true },
					{ text : 'codeId', datafield : 'codeId', hidden: true, pinned: true },
					{ text : '사이트', datafield : 'codeValue1', width : 400, editable: true, pinned: true },
					{ text : 'URL', datafield : 'codeValue2', minwidth: 150, editable: false, pinned: true 
						,cellsrenderer : function(row, datafield, value) {
							return "<div style='margin-top: 2.5px;'>"
									+ "<a href = 'javascript:Main.linkPop("
									+ row
									+ ");'>"
									+ value
									+ " </a></div>";
						}
					},
			    ]						
			});
		},
		
		/** init data */
		initData: function() {
			Main.searchSolution();
		},
	    
	    /*=======================================================================================
	    버튼 이벤트 처리
	    ========================================================================================*/
		searchSolution: function() {
			HmGrid.updateBoundData($solGrid, ctxPath + '/main/com/solShortCuts/getSolutionList.do');
		},
		
	    addSolution: function() {
	    	$.get(ctxPath + '/main/popup/com/pSolutionAdd.do', function(result) {
	    		HmWindow.open($('#pwindow'), '솔루션 등록', result, 600, 200);
			});	
	    },
	    
	    saveSolution: function() {
	    	var rowdata = HmGrid.getRowData($solGrid);
			if(editUserIds.length == 0) {
				alert('변경된 데이터가 없습니다.');
				return;
			}
			if(!confirm('수정하시겠습니까?')) return;
			Server.post('/main/com/solShortCuts/saveSolution.do', {
				data: { codeKind: rowdata.codeKind,
						codeId : rowdata.codeId,
						codeValue1: rowdata.codeValue1,
						codeValue2: rowdata.codeValue2 },
				success: function(data) {
					alert("완료되었습니다.");
					editUserIds = [];
					Main.searchSolution;
				}
			});
	    },
	    
	    delSolution: function() {
	    	var rowdata = HmGrid.getRowData($solGrid);
	    	if(rowdata == null) {
	    		alert('사이트를 선택해 주세요.');
	    		return;
	    	}
	    	if(!confirm('삭제하시겠습니까?')) return;
	    	codeKind = rowdata.codeKind;
	    	codeId = rowdata.codeId;
			Server.get('/main/com/solShortCuts/delSolution.do', {
				data: { codeKind: codeKind,
						codeId : codeId },
				success: function(data) {
					alert("완료되었습니다.");
					$solGrid.jqxGrid('deleterow', rowdata.uid);
				}
			});
	    },
	    
	    linkPop : function(row) {
			var rowdata = $solGrid.jqxGrid('getrowdata', row);
			if (rowdata == null)
				return;
			window.open(rowdata.codeValue2, '_blank');
		},
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});