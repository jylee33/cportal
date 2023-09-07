var UserAdd = {
    /** Initialize */
    initVariable: function () {
    },

    /** Event Object */
    observe: function () {
        $('button').bind('click', function(event) {UserAdd.eventControl(event); });
    },

    /** Event Control Function */
    eventControl: function (event) {
        var objElement = event.currentTarget;
        if (objElement === window) {
            this.resizeWindow();
            return;
        }

        switch (objElement.id) {
	        case "pbtnSave":
	        	this.pSaveUser();
	        	break;
	        case "pbtnClose":
	        	this.pCancelUser();
	        	break;
        }
    },

    /** Init Data */
    initData: function () {

    },
    /*=======================================================================================
    버튼 이벤트 처리
    ========================================================================================*/
   
    pSaveUser: function() {
    	if(!this.validateForm()) return;
    	Server.get('/main/env/userConf/addAccount.do', {
    		data: $("#popupAddForm").serialize(),
    		success: function(data) {
    			alert("계정 신청이 완료되었습니다.");
				UserAdd.pCancelUser();
    			// $('#pwindow').jqxWindow('close');
    		}
    	});
    },
    validateForm: function() {
    	var obj = $("#pUserId");
    	if(obj.val().isBlank()) {
    		alert("아이디를 입력해주세요.");
    		obj.focus();
    		return false;
    	}
		var idReg = /^[a-z0-9_-]{6,20}$/
		if($("#pUserId").val().length < 6 || 20 < $("#pUserId").val().length){
    		alert('아이디는 6~20자리이어야 합니다.');
    		return false;
		}

        if( !idReg.test( $("#pUserId").val() ) ) {
			alert("아이디는 소문자와 숫자, 특수기호(_,-)만 사용 가능합니다.");
			return false;
        }
    	 if(!/^[a-z]/.test($('#pUserId').val())) {
    		 alert("아이디는 영문소문자로 시작해야 합니다.");
    		 return;
    	 }
    	 
    	obj = $("#pUserName");
    	if(obj.val().isBlank()) {
    		alert("이름을 입력해주세요.");
    		obj.focus();
    		return false;
    	}
    	obj = $("#pPassword");
    	if(obj.val().isBlank()) {
    		alert("비밀번호를 입력해주세요.");
    		obj.focus();
    		return false;
    	}
    	obj = $("#pRePassword");
    	if(obj.val().isBlank()) {
    		alert("비밀번호 확인을 입력해주세요.");
    		obj.focus();
    		return false;
    	}
    	if($("#pPassword").val() != $("#pRePassword").val()) {
    		alert("비밀번호가 일치하지 않습니다.");
    		$("#pPassword").focus();
    		return false;
    	}
    	return true;
    },
    // 취소
    pCancelUser: function() {
    	self.close();
    }
};
$(function () {
    UserAdd.initVariable();
    UserAdd.observe();
    UserAdd.initData();
});