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
	/* 부모창이 메인페이지면 목록보기 버튼 보이게 */
	url = $(opener.document).find("#parentPage").val();
	var lastIndex = url.lastIndexOf("/");
	url = url.substring(lastIndex + 1, url.length - 4);
	if (url == "main" || url == "tchMain") {
		$("#btnBoardList").css("display", "inline");
	}
},

/** add event */
observe : function() {

	$('button').bind('click', function(event) {
		Main.eventControl(event);
	});
	$('img').bind('click', function(event) {
		Main.eventControl(event);
	});

	$('#fileUpload').on('uploadEnd', function(event) {
		if (--uploadCnt == 0) {
			location.href = $('#ctxPath').val() + '/main/board/pFaqBoardContents.do?boardNo=' + boardNo;
		}
	});

	$('#fileUpload').on('select', function(event) {
		var fileLength = event.args.owner._fileRows.length;

		if ($('.jqx-file-upload-file-input')[fileLength - 1].files[0].size > $('#uploadFileLength').val()) {
			alert($('#uploadFileLength').val() + "Byte로 용량이 제한되어있습니다.");
			$('#fileUpload').jqxFileUpload('cancelFile', fileLength - 1);
			return;
		}

		if (fileLength > 5) {
			$('#fileUpload').jqxFileUpload('cancelFile', fileLength - 1);
			alert('첨부파일 최대 개수는 5개 입니다.');
		}
	});
},

/** event handler */
eventControl : function(event) {
	var curTarget = event.currentTarget;
	switch (curTarget.id) {
	case 'btnSave':
		this.saveContents();
		break;
	case 'btnBoardList':
		this.boardList();
		break;
	case 'btnClose':
		this.boardClose();
		break;
	case 'btnCancel':
		this.boardList();
		break;
	}
},

/** init design */
initDesign : function() {
	$('#editor').jqxEditor({ height : "420px" });

	$('#fileUpload').jqxFileUpload({ width : '100%', fileInputName : 'fileinput' });
},

/** init data */
initData : function() {
	$('#fileUploadBrowseButton').val("첨부파일");
	$('.boardContent').val("");
},

saveContents : function() {
	if (!this.validateForm())
		return;
	var params = { boardTitle : $('#boardTitle').val(), boardContent : $('#editor').val() };
	Server.post('/main/oms/faqBoard/addBoard.do', { data : params, success : function(result) {
		$('#fileUpload').jqxFileUpload({ uploadUrl : ctxPath + '/file/upload.do?boardNo=' + result });
		if ($('.jqx-file-upload-file-row').length == 0) {
			location.href = $('#ctxPath').val() + '/main/board/pFaqBoardContents.do?boardNo=' + result;
		} else {
			try {
				$('#fileUpload').jqxFileUpload('uploadAll');
			} catch (e) {
				console.log(e);
			}
			boardNo = result;
			uploadCnt = $('.jqx-file-upload-file-row').length;
		}
		window.opener.Main.searchNBoard();
	} });
},

boardList : function() {
	window.location.href = $('#ctxPath').val() + "/main/board/pFaqBoardList.do";
},

validateForm : function() {
	var text = $('#boardTitle').val().length;
	if (text == 0) {
		alert("제목을 입력해주세요.");
		$("#boardTitle").focus();
		return false;
	} else if (text > 100) {
		alert("제목을 100자 이내로 입력해주세요.");
		$("#boardTitle").focus();
		return false;
	}
	text = $('#editor').val();
	if (text == '<br>' || text == '' || text == null) {
		alert("내용을 입력해주세요.");
		$('#editor').focus();
		return false;
	} else if (text.length > 40000) {
		alert("내용을 40000자 이내로 입력해주세요.");
		return false;
	}
	return true;
},

boardClose : function() {
	self.close();
}

};