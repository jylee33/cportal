var evtLevel1Text, evtLevel2Text, evtLevel3Text, evtLevel4Text, evtLevel5Text;

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});

var Main = {
		/** variable */
		initVariable: function() {
			/*메인페이지면 목록보기 버튼 보이게*/
			var url=$(opener.document).find("#parentPage").val();
			var lastIndex=url.lastIndexOf("/");
			url=url.substring(lastIndex+1, url.length-4);
			if(url=="main"||url=="tchMain"){
				$("#btnBoardList").css("display","inline");
			}

            evtLevel1Text = $("#sEvtLevel1").val();
            evtLevel2Text = $("#sEvtLevel2").val();
            evtLevel3Text = $("#sEvtLevel3").val();
            evtLevel4Text = $("#sEvtLevel4").val();
            evtLevel5Text = $("#sEvtLevel5").val();
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
			case 'btnUpgrade': this.upgradeBoard(); break;
			case 'btnBoardList': this.boardList(); break;
			case 'btnClose': this.boardClose(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			 $('#editor').jqxEditor({
	             height: "324px"
	         });

            $('#boardEvtLevel').jqxDropDownList({ width: '80px', height: 30, autoDropDownHeight: true,theme:jqxTheme, placeHolder: '선택', selectedIndex: 0,
                source: [ { label: evtLevel1Text, value: 1 }, { label: evtLevel2Text, value: 2 }, { label: evtLevel3Text, value: 3 }, { label: evtLevel4Text, value: 4 }, { label: evtLevel5Text, value: 5 } ]
            });

			$.ajax({
				type : "post",
				url :$('#ctxPath').val() + '/main/oms/errorBoard/getBoardContents.do',
				data : "boardNo="+$('#boardNo').val(),
				dataType : "json",
				success : function(jsonData) {
					$('#boardTitle').val(jsonData.resultData.contents.boardTitle);
					$('.boardContent').val((jsonData.resultData.contents.boardContent || '').htmlCharacterUnescapes());
                    $('#boardEvtLevel').val(jsonData.resultData.contents.temp1);
				} 
			});
			
		},
		
		/** init data */
		initData: function() {
			
		},
		
		
		upgradeBoard: function() {
			if(!this.validateForm()) return;
			var params={
					boardNo: $('#boardNo').val() ,
					boardTitle: $('#boardTitle').val() ,
					boardContent: $('#editor').val(),
                	temp1 : $('#boardEvtLevel').val()
			};
			Server.post('/main/oms/errorBoard/editBoard.do', {
				data: params,
				success: function(result) {
					window.opener.Main.searchEBoard();	
					location.href = $('#ctxPath').val() + '/main/board/pErrorBoardContents.do?boardNo=' +$('#boardNo').val();
					alert("수정 되었습니다");
				}
			});
		},
		
		boardList: function() {
			window.location.href=$('#ctxPath').val() +"/main/board/pErrorBoardList.do";
		},
		

		validateForm: function() {
			var text  = $('#boardTitle').val().length;
	    	if(text==0) {
	    		alert("제목을 입력해주세요.");
	    		$("#boardTitle").focus();
	    		return false;
	    	}else if(text > 100 ){
	    		alert("제목을 100자 이내로 입력해주세요.");
	    		$("#boardTitle").focus();
	    		return false;
	    	}
	    	text  = $('#editor').val();
	    	if(text=='<br>' || text=='' || text==null) {
	    		alert("내용을 입력해주세요.");
	    		$('#editor').focus();
	    		return false;
	    	}else if(text.length > 40000 ){
	    		alert("내용을 40000자 이내로 입력해주세요.");
	    		return false;
	    	}
	    	return true;
	    },
		
		boardClose: function() {
			self.close();
		}
};