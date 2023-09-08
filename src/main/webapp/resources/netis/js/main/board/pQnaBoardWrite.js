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
	$('#editor').jqxEditor({ height : "490px" });
},

/** init data */
initData : function() {
	$('.boardContent').val("");
},

saveContents : function() {
	if (!this.validateForm())
		return;
	var params = { boardTitle : $('#boardTitle').val(), boardContent : $('#editor').val() };
	Server.post('/main/oms/qnaBoard/addBoard.do', { data : params, success : function(result) {
		window.opener.Main.searchQBoard();
		location.href = $('#ctxPath').val() + '/main/board/pQnaBoardContents.do?boardNo=' + result;
	} });
},

boardList : function() {
	window.location.href = $('#ctxPath').val() + "/main/board/pQnaBoardList.do";
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