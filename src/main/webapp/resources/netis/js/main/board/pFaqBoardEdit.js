var uploadCnt = 0;
var boardNo;
var url;

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});

var Main = {
	/** variable */
	initVariable : function() {
		/*메인페이지면 목록보기 버튼 보이게*/
		var url=$(opener.document).find("#parentPage").val();
		var lastIndex=url.lastIndexOf("/");
		url=url.substring(lastIndex+1, url.length-4);
		if(url=="main"||url=="tchMain"){
			$("#btnBoardList").css("display","inline");
		}
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
		$('img').bind('click', function(event) { Main.eventControl(event); });
		
		$('#fileUpload').on('uploadEnd', function(event) {
			if (--uploadCnt == 0) {
				location.href = $('#ctxPath').val() + '/main/board/pFaqBoardContents.do?boardNo=' + boardNo;
			}
		});
		
		$('#fileUpload').on('select', function(event) {
			var totallength = event.args.owner._fileRows.length + $('#attachFileList > li').length;
			var fileLength = event.args.owner._fileRows.length;



			if($('.jqx-file-upload-file-input')[fileLength-1].files[0].size > $('#uploadFileLength').val()){
				alert($('#uploadFileLength').val() + "Byte로 용량이 제한되어있습니다.");
				$('#fileUpload').
				jqxFileUpload('cancelFile', fileLength-1);
				return;
			}
			
			if(totallength > 5){
				$('#fileUpload').jqxFileUpload('cancelFile', fileLength-1);
				alert('첨부파일 최대 개수는 5개 입니다.');
			}
		});
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case 'btnUpgrade': this.upgradeBoard(); break;
		case 'btnBoardList': this.boardList(); break;
		case 'btnClose': this.boardClose(); break;
		}
	},

	/** init design */
	initDesign : function() {
		$('#editor').jqxEditor({
			height : "420px"
		});
		$('#fileUpload').jqxFileUpload({
			width : '100%',
			fileInputName : 'fileinput'
		});

		$.ajax({
			type : "post",
			url :$('#ctxPath').val() + '/main/oms/faqBoard/getBoardContents.do',
			data : "boardNo=" + $('#boardNo').val(),
			dataType : "json",
			success : function(jsonData) {
				$('#boardTitle').val(jsonData.resultData.contents.boardTitle);
				$('.boardContent').val(jsonData.resultData.contents.boardContent);
				// true : 수정 페이지에서만 첨부파일 옆에 삭제버튼 생성
				HmUtil.attachFileList(jsonData.resultData.attachFile, true);
				
			}
		});

	},

	/** init data */
	initData : function() {
		$('#fileUploadBrowseButton').val("첨부파일");
	},

	upgradeBoard : function() {
		if(!this.validateForm()) return;
		Server.post('/main/oms/faqBoard/editBoard.do', {
				data : /*$('#writeForm').serializeObject(),*/
				{ 
					boardNo : document.writeForm.boardNo.value,
					boardTitle : document.writeForm.boardTitle.value,
					boardContent : $('.boardContent').val()
				},
				success : function(result) {
					window.opener.Main.searchNBoard();	
					$('#fileUpload').jqxFileUpload({
						uploadUrl : ctxPath + '/file/upload.do?boardNo=' + result.boardNo
					});
					if ($('.jqx-file-upload-file-row').length == 0) {
						location.href = $('#ctxPath').val() + '/main/board/pFaqBoardContents.do?boardNo=' + result.boardNo;
					} else {
						try{
							$('#fileUpload').jqxFileUpload('uploadAll');
						}catch (e) {
							console.log(e);
						}
						boardNo = result.boardNo;
						uploadCnt = $('.jqx-file-upload-file-row').length;
					}
				}
			});
	},

	boardList : function() {
		window.location.href=$('#ctxPath').val() +"/main/board/pFaqBoardList.do";
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