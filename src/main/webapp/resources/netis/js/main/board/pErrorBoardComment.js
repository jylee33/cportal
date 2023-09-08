var url;

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
			case 'btnComment': this.commentBoard(); break;
			case 'btnBoardList': this.boardList(); break;
			case 'btnClose': this.boardClose(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			 $('#editor').jqxEditor({
	             height: "324px"
	         });
			$.ajax({
				type : "post",
				url :$('#ctxPath').val() + '/main/oms/errorBoard/getBoardContents.do',
				data : "boardNo="+$('#boardNo').val(),
				dataType : "json",
				success : function(jsonData) {
                    $('#boardTitle').val('[RE] ' + jsonData.resultData.contents.boardTitle);
					var  reContente=	"<br>------------------Original Message------------------<br>"
											+"작성자 : "+jsonData.resultData.contents.userId +"<br>" 
											+"작성일 : "+jsonData.resultData.contents.boardRegDate+"<br>" 
											+"제목 : "+jsonData.resultData.contents.boardTitle+"<br>"
											+"내용: "+(jsonData.resultData.contents.boardContent || '').htmlCharacterUnescapes()+
											"<br>------------------------------------------------------<br><br>" ;
					$('.boardContent').val(reContente);
				} 
			});
			
		},
		
		/** init data */
		initData: function() {
			
		},
		
		
		commentBoard: function() {
			var siteName = $('#gSiteName').val();
			if(!this.validateForm()) return;
			var title = $('#boardTitle').val();
			var params={
					boardNo: $('#boardNo').val(),
					boardParentNo: $('#boardParentNo').val(),
					boardTitle: title,
					boardContent: $('#editor').val()
			};
			Server.post('/main/oms/errorBoard/addComment.do', {
				data: params,
				success: function(result) {
					//location.href = $('#ctxPath').val() + '/main/board/pErrorBoardContents.do?boardNo=' + result;
					if(url=="main"){
					
					}else{
						window.opener.Main.searchEBoard();	
					}
					alert("등록 되었습니다");
					Main.boardClose();
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