var $boardGrid;

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});

var Main = {
		/** variable */
		initVariable: function() {
			$treeGrid = $('#treeGrid');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
			$('img').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnWrite': this.checkWrite(); break;
			case 'btnBoardList': this.boardList(); break;
			case 'btnClose': this.boardClose(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			// 사이트에 따라 예외처리. 18.04.17
			var checkFlagStr_txt = "처리현황";
			var checkDate_txt = "처리시간";
			var printTime_txt = "작성일자";
			var printTime_val = "printTime";
			var printTime_width = 100;
			if($('#gSiteName').val() != 'Samsung'){
				checkFlagStr_txt = "상태";
				checkDate_txt = "완료처리일시";
				printTime_txt = "작성일시";
				printTime_val = "printDate";
				printTime_width = 130;
			}
			
			var source =
            {
                dataType: "json",
                hierarchy:
                {
                	keyDataField: { name: 'boardNo' },
					parentDataField: { name: 'boardParentNo' }
                },
                id: 'boardNo',
	            url: $('#ctxPath').val() + '/main/oms/errorBoard/getBoardList.do'
            };
            var dataAdapter = new $.jqx.dataAdapter(source);
            // create Tree Grid
            $treeGrid.jqxTreeGrid(
            {
            	width: '100%',
            	height: 510,
                source: dataAdapter,
                theme : jqxTheme,
                pageable: true,
                // pageSize : 100,
                pageSizeOptions : [ "100", "500", "1000" ],
                pagerHeight : 22,
                columnsResize: true,
                columnsHeight: 26,
                sortable : true,
                selectionMode : "singlerow",
				altRows: false,
                columns: [
                          { text: '번호',		datafield: 'boardNo', align: 'center', width: 70 },
                          { text: '제목',		datafield: 'boardTitle', align: 'center',  minwidth: 450,
                        	  cellsrenderer: function(row, column, value, rowData) {
                        		  var marginLeft = 0;
                        		  var marginImg ="";
                        		  if(rowData.level > 0) {
                        			  marginLeft = 10 * rowData.level;
                        			  marginImg="<img src='../../img/popup/answer_icon.png' >";
                        		  }
                        		  return "<div style='margin-top: 0px; margin-left: " + marginLeft + "px;'>" +marginImg+ value + "</div>";
                        	  }
                          },
					      { text : '등급', datafield : 'temp1', align : 'center', width : 70, cellsrenderer : HmTreeGrid.evtLevelrenderer	},
					      { text: checkFlagStr_txt,		datafield: 'checkFlagStr',	align: 'center',	cellsalign: 'center', width: 70, cellsrenderer: HmTreeGrid.boardStatusrenderer  },
                    	  { text : checkDate_txt, datafield : 'checkDate', align : 'center', cellsalign : 'center', width : 130 },
                          { text: '작성자',		datafield: 'userName',	align: 'center', width: 100 , columntype: 'custom',
        					  cellsrenderer: function(row, column, value, rowData) {
        						 var _grpName = rowData.grpName;
        						 if(_grpName != '' &&_grpName != null){
        							 _grpName='(' +_grpName+')';
        						 }else{
        							 _grpName='';
        						 }
        						 
                        		  return "<div style='margin-top: 0px; margin-left: 5px;'>"+ value + "<span>" +_grpName+"</span></div>";
                        	  }
                          },
                          { text: printTime_txt,	datafield: printTime_val,		align: 'center',	cellsalign: 'center',	width: printTime_width },
                          { text: '조회수',		datafield: 'boardHits',	align: 'center',	cellsalign: 'center', width: 50  }
                          ]
            })
            .on('bindingComplete', function(event) {
            	$treeGrid.jqxTreeGrid('expandAll');
            });
            
            //셀값 받아오기
            $treeGrid.on('rowDoubleClick', function (event) {
            	var itemget = event.args.row.boardNo;
            	window.location.href=$('#ctxPath').val() +'/main/board/pErrorBoardContents.do?boardNo='+itemget;
            });
		},
		
		/** init data */
		initData: function() {
			
		},
		checkWrite: function() {
			var result =  $('#sUserId').val();
			var size=result.length;
			if(result != null && size !=0){
				location.href=$('#ctxPath').val() +'/main/board/pErrorBoardWrite.do';
			}else{
				alert("로그인을 하셔야 글쓰기를 할 수 있습니다");
				return;
			}
		},
		
		boardList: function() {	
			$treeGrid.jqxTreeGrid('updateBoundData');
		},
		
		boardClose: function() {
			self.close();
		}
		
};