var url;
var isAdmin = false;
$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});

var Main = {
		/** variable */
		initVariable: function() {
			/*부모창이 메인페이지면 목록보기 버튼 보이게*/
			url=$(opener.document).find("#parentPage").val();
			var lastIndex=url.lastIndexOf("/");
			url=url.substring(lastIndex+1, url.length-4);
			if(url=="main"||url=="tchMain"){
				$("#btnBoardList").css("display","inline");
			}
			/*권한이 admin이나 system이면 true*/
			var auth= $('#sAuth').val().toUpperCase();
			if(auth == 'SYSTEM' || auth == 'ADMIN') isAdmin = true;
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
			case 'btnAppr': this.editAppr(); break;
			case 'btnComment': this.commentBoard(); break;
			case 'btnUpgrade': this.upgradeBoard(); break;
			case 'btnDelete': this.deleteBoard(); break;
			case 'btnBoardList': this.boardList(); break;
			case 'btnClose': this.boardClose(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
	 		$('#editor').jqxEditor({ 
	 			height : "315px",
	 		    editable: false,
	 		    disabled: true,
	 			tools: ''
	 		});
			$.ajax({
				type : "post",
				url :$('#ctxPath').val() + '/main/oms/errorBoard/getBoardContents.do',
				data : "boardNo="+$('#boardNo').val(),
				dataType : "json",
				success : function(jsonData) {
					var resultData = jsonData.resultData.contents;
					var _grpName = resultData.grpName;
					 if(_grpName != '' &&_grpName != null){
						 _grpName=_grpName;
					 }else{
						 _grpName='';
					 }
					/*$('#userName').html(resultData.userName+"("+resultData.userId+")"+_grpName);*/
					$('#userName').val(resultData.userName+"("+_grpName+")");
					$('#boardHits').val(resultData.boardHits);
					$('#boardTitle').val(resultData.boardTitle);
					$('#fullTimeFormat').val(resultData.fullTimeFormat);
                    $('#boardEvtLevel').val(HmUtil.convertEvtLevelToEvtName(resultData.temp1));
					$('#editor').val((resultData.boardContent || '').htmlCharacterUnescapes());
					if ($('#sUserId').val() == resultData.userId || isAdmin) {
						$('#btnUpgrade').css("display","inline");
						$('#btnDelete').css("display","inline");
					}

					if (resultData.checkFlag.toString() === '1') {
						$('#btnAppr').css("display","none");
					}
				} 
			});
			
		},
		
		/** init data */
		initData: function() {
			
		},
		
		upgradeBoard: function() {
			window.location.href=$('#ctxPath').val() +"/main/board/pErrorBoardEdit.do?boardNo="+$('#boardNo').val();
		},
		
		deleteBoard: function() {
			if (confirm("삭제 하시겠습니까?") != true) return;
			$.ajax({
				type : "post",
				url :$('#ctxPath').val() + '/main/oms/errorBoard/delBoard.do',
				data : "boardNo="+$('#boardNo').val(),
				dataType : "json",
				success : function(jsonData) {
					window.opener.Main.searchEBoard();
					if(url=="main"){
						window.location.href=$('#ctxPath').val() +"/main/board/pErrorBoardList.do";
					}else{
						self.close();
					}
					alert("삭제 되었습니다");
				} 
			});
		},
		
		boardList: function() {
			window.location.href=$('#ctxPath').val() +"/main/board/pErrorBoardList.do";
		},

		commentBoard: function() {
			window.location.href=$('#ctxPath').val() +"/main/board/pErrorBoardComment.do?boardNo="+$('#boardNo').val();
		},
		
		boardClose: function() {
			self.close();
		},
		
		/** 게시판 번호로 게시판 글 승인  */
		editAppr: function() {

			if(!confirm('처리 현황을 확인으로 변경합니다.')) return;

			Server.post('/main/oms/errorBoard/editAppr.do', {
				data: { boardNo: $('#boardNo').val() },
				success: function(result) {

					window.opener.Main.searchEBoard();	
					alert('처리 완료되었습니다.');
					Main.boardClose();

				}
			});

		}


};