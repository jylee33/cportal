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
initVariable : function() {
	/* 부모창이 메인페이지면 목록보기 버튼 보이게 */
	url = $(opener.document).find("#parentPage").val();
	var lastIndex = url.lastIndexOf("/");
	url = url.substring(lastIndex + 1, url.length - 4);
	if (url == "main" || url == "tchMain") {
		$("#btnBoardList").css("display", "inline");
	}

	/* 권한이 admin이나 system이면 true */
	var auth = $('#sAuth').val().toUpperCase();
	if (auth == 'SYSTEM' || auth == 'ADMIN')
		isAdmin = true;
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
	case 'btnUpgrade':
		this.upgradeBoard();
		break;
	case 'btnDelete':
		this.deleteBoard();
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
	$('#editor').jqxEditor({ height : "440px", editable : false, disabled : true, tools : '' });
	$.ajax({ type : "post", url : $('#ctxPath').val() + '/main/oms/faqBoard/getBoardContents.do', data : "boardNo=" + $('#boardNo').val(), dataType : "json", success : function(jsonData) {
		var contents = jsonData.resultData.contents;

		$('#userName').html(contents.userName + "(" + contents.userId + ")");
		$('#boardHits').html(contents.boardHits);
		$('#boardTitle').html(contents.boardTitle);
		$('#fullTimeFormat').html(contents.fullTimeFormat);
		$('#editor').val(contents.boardContent);
		if ($('#sUserId').val() == contents.userId || isAdmin) {
			$('#btnUpgrade').css("display", "inline");
			$('#btnDelete').css("display", "inline");
		}

		HmUtil.attachFileList(jsonData.resultData.attachFile, false);
	} });

},

/** init data */
initData : function() {

},

upgradeBoard : function() {
	window.location.href = $('#ctxPath').val() + "/main/board/pFaqBoardEdit.do?boardNo=" + $('#boardNo').val();
},

deleteBoard : function() {
	if (confirm("삭제 하시겠습니까?") != true)
		return;
	$.ajax({ type : "post", url : $('#ctxPath').val() + '/main/oms/faqBoard/delBoard.do', data : "boardNo=" + $('#boardNo').val(), dataType : "json", success : function(jsonData) {
	} });

	$.ajax({ type : "post", url : $('#ctxPath').val() + '/file/delete.do', data : { boardNo : $('#boardNo').val() }, dataType : "json", success : function(jsonData) {
		window.opener.Main.searchNBoard();
		if (url == "main") {
			window.location.href = $('#ctxPath').val() + "/main/board/pFaqBoardList.do";
		} else {
			self.close();
		}
		alert("삭제 되었습니다");
	} });

},

boardList : function() {
	window.location.href = $('#ctxPath').val() + "/main/board/pFaqBoardList.do";
},

boardClose : function() {
	self.close();
}

};