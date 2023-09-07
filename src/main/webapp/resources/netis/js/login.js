var ctxPath = '';
$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
    $('#userId').focus();
    var _locale = Main.getCookie("NETIS_LOCALE");
    if (_locale.length == 0) {
        location.href = '/login.do?lang=ko_KR';
    }

    sessionStorage.showLoginOver = 'N';
});

var Main = {
    /** variable */
    initVariable: function () {
        ctxPath = $("#ctxPath").val();
    },

    /** add event */
    observe: function () {
        $('#password').on('keypress', function (event) {
            if (event.keyCode == 13) {
                Main.login();
                return false;
            }
        });
        $('#btnLogin').bind('click', function (event) {
            Main.eventControl(event);
            return false;
        });
        $('#btnEngineer').bind('click', function (event) {
            Main.eventControl(event);
        });
        $('#btnAccount').bind('click', function (event) {
            Main.eventControl(event);
            return false;
        });
        $('#btnGoSubPolice').bind('click', function (event) {
            Main.eventControl(event);
        });
        $('#btnPrivacy').bind('click', function (event) {
            Main.eventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnLogin':
                this.login();
                break;
            case 'btnEngineer':
                this.showEngineerTool();
                break;
            // case 'btnAccount': this.showConfirmPop('showAccount'); break;
            case 'btnAccount':
                this.showAccount();
                break;
            case 'btnPrivacy':
                this.showPrivacy();
                break;
            case 'btnGoSubPolice':
                this.goSubPolice();
                break;
        }
    },

    /** init design */
    initDesign: function () {

        var userInputId = Main.getCookie("userInputId");

        $('#userId').val(userInputId);

        if ($('#userId').val() != "") { // 그 전에 ID를 저장해서 처음 페이지 로딩 시, 입력 칸에 저장된 ID가 표시된 상태라면,
            $("#save").attr("checked", true); // ID 저장하기를 체크 상태로 두기.
        }

        $("#save").change(function () { // 체크박스에 변화가 있다면,
            if ($("#save").is(":checked")) { // ID 저장하기 체크했을 때,
                var userInputId = $('#userId').val();
                Main.setCookie("userInputId", userInputId, 7); // 7일 동안 쿠키 보관
            } else { // ID 저장하기 체크 해제 시,
                Main.deleteCookie("userInputId");
            }
        });

        // ID 저장하기를 체크한 상태에서 ID를 입력하는 경우, 이럴 때도 쿠키 저장.
        $("input[name='id']").keyup(function () { // ID 입력 칸에 ID를 입력할 때,
            if ($("#save").is(":checked")) { // ID 저장하기를 체크한 상태라면,
                var userInputId = $('#userId').val();
                Main.setCookie("userInputId", userInputId, 7); // 7일 동안 쿠키 보관
            }
        });

        /**--------------------- 경찰청 예외처리 시작 --------------------------------
         * 지방청 이동을 위한 링크 추가
         *  - 본청경찰청이면 지방청 이동콤보 생성
         */
        if ($('#gSiteName').val() == 'Police') {

            $('#subPoliceCb').jqxDropDownList({
                source: new $.jqx.dataAdapter({
                    datatype: 'json',
                    url: ctxPath + '/code/getCodeListByCodeKind.do',
                    async: true,
                    data: {codeKind: 'SUB_POLICE_URL', SORT: 'ORDER BY TO_NUMBER(CODE_VALUE3)'},
                }),
                displayMember: 'codeValue1',
                valueMember: 'codeValue2',
                width: 150, height: 21, selectedIndex: 0
            });

        }
        /**---------------------- 경찰청 예외처리 끝 --------------------------------*/
    },

    /** init data */
    initData: function () {

        if ($('#errMsg').val()) {

            setTimeout(function () {
                $("#save").is(":checked") ? $("#password").focus() : $("#userId").focus();
                alert($('#errMsg').val());
            }, 300);

        }

    },

    /** login */
    login: function () {

        var obj = $('#userId');
        if ($.isBlank(obj.val())) {
            alert('ID를 입력해주세요.');
            obj.focus();
            return;
        }

        obj = $('#password');
        if ($.isBlank(obj.val())) {
            alert('Password를 입력해주세요.');
            obj.focus();
            return;
        }

        if ($("#save").is(":checked")) Main.setCookie("userInputId", $('#userId').val(), 7); // 7일 동안 쿠키 보관

        var encryptBase64Pass = btoa($("#password").val());
        //base64 1차 암호화 이후 서버 전달
        $("#password").val(encryptBase64Pass);

        $('#loginForm').submit();
        // Server.post('/login/prcsLogin.do', {
        // 	data: { userId: $('#userId').val(), password: $('#password').val() },
        // 	success: function(data) {
        // 		var mainUrl = null;
        // 		switch(data.siteName) {
        // 		case 'Samsung': // 삼성전자
        // 			mainUrl = '/samsung/main.do'; break;
        // 		case 'HyundaiCar': // 현대차
        //             if($('#gFirstPageType').val() == 'None'){
        //                 mainUrl = '/main/main2.do'; break;
        // 			}else{
        //                 mainUrl = '/main/layout/mainLayout.do'
        //                 break;
        // 			}
        // 		default:
        // 			mainUrl = '/main/nms/devStatus.do';
        // 			break;
        // 		}
        // 		location.href = ctxPath + mainUrl;
        // 	}
        // });
    },

    /** 사용자 계정 팝업 */
    showAccount: function () {
        var mainUrl = $('#gSiteName').val();
        switch (mainUrl) {
            default:
                mainUrl = '/main/popup/env/pAccountAdd.do';
                HmUtil.createPopup(mainUrl, $('#hForm'), 'pAccountAdd', 600, 173);
                break;
        }
        return false;
    },

    showPrivacy: function () {
        HmUtil.createPopup('/main/popup/com/pPrivacyPolicy.do', $('#hForm'), 'pPrivacyPolicy', 980, 800);
    },

    //인증팝업 (return url)
    showConfirmPop: function (callbackFn) {
        var params = {
            callbackFn: callbackFn
        };

        // $.post(ctxPath + '/main/popup/com/pPrivacyPolicyAccount.do', params, function (result) {
        // 	HmWindow.open($('#pwindow'), '개인정보 처리방침 동의여부', result, 900, 1000, 'pwindow_init', params);
        // });
        HmUtil.createPopup('/main/popup/com/pPrivacyPolicyAccount.do', $('#hForm'), 'pPrivacyPolicyAccount', 980, 800, params);
    },

    goSubPolice: function () {
        var url = $('#subPoliceCb').val();
        window.open(url);
    },

    setCookie: function (cookieName, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var cookieValue = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toGMTString());
        document.cookie = cookieName + "=" + cookieValue;

        console.log(document.cookie);

    },

    deleteCookie: function (cookieName) {
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() - 1);
        document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
        console.log(document.cookie);

    },

    getCookie: function (cookieName) {
        cookieName = cookieName + '=';
        var cookieData = document.cookie;
        var start = cookieData.indexOf(cookieName);
        var cookieValue = '';
        if (start != -1) {
            start += cookieName.length;
            var end = cookieData.indexOf(';', start);
            if (end == -1) end = cookieData.length;
            cookieValue = cookieData.substring(start, end);
        }
        return unescape(cookieValue);
    }
};