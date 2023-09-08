$(function () {
    PolicyConf.initVariable();
    PolicyConf.observe();
    PolicyConf.initDesign();
    PolicyConf.initData();
});

var PolicyConf = {
    /** Initialize */
    initVariable: function () {

    },

    /** Event Object */
    observe: function () {
        $("#pwdPolicyUseChk, #pwdChgCycleUseChk, #pwdErrPolicyUseChk, #autoLogoutUseChk").bind("change", function (event) {
            PolicyConf.eventControl(event);
        });
        $("img.btnImg").bind("click", function (event) {
            PolicyConf.eventControl(event);
        });
        $('button').bind('click', function (event) {
            PolicyConf.eventControl(event);
        });
    },

    /** Event Control Function */
    eventControl: function (event) {
        var objElement = event.currentTarget;
        switch (objElement.id) {
            case "pwdPolicyUseChk":
                this.changePolicyUse(event);
                break;
            case "pwdChgCycleUseChk":
                this.changePolicyUse(event);
                break;
            case "pwdErrPolicyUseChk":
                this.changePolicyUse(event);
                break;
            case "autoLogoutUseChk":
                this.changePolicyUse(event);
                break;
            case "btnSave":
                this.processSave();
                break;
            case "btnSearch":
                this.processSearch();
                break;
        }
    },

    /** Init Design */
    initDesign: function () {

        //NumberInput생성
        $("#pwdLen").jqxNumberInput({
            width: '150px',
            height: '22px',
            min: 6,
            max: 20,
            digits: 2,
            decimalDigits: 0,
            inputMode: 'simple',
            spinButtons: true
        });
        $("#pwdChgCycle").jqxNumberInput({
            width: '150px',
            height: '22px',
            min: 30,
            max: 99999,
            digits: 5,
            decimalDigits: 0,
            inputMode: 'simple',
            spinButtons: true
        });
        $("#pwdInputCount").jqxNumberInput({
            width: '150px',
            height: '22px',
            min: 1,
            max: 10,
            digits: 2,
            decimalDigits: 0,
            inputMode: 'simple',
            spinButtons: true
        });
        $("#pwdLockTimeout").jqxNumberInput({
            width: '150px',
            height: '22px',
            min: 1,
            max: 10,
            digits: 2,
            decimalDigits: 0,
            inputMode: 'simple',
            spinButtons: true
        });
        $("#pwdSameCount").jqxNumberInput({
            width: '150px',
            height: '22px',
            min: 1,
            max: 10,
            digits: 2,
            decimalDigits: 0,
            inputMode: 'simple',
            spinButtons: true
        });

        // 패스워드 잠금 유형
        $('#pwdLockType').jqxDropDownList({
            width: '150px', height: '21px', selectedIndex: 0, autoDropDownHeight: true,
            source: [{label: '계정잠금', value: 0}, {label: '일시접속제한', value: 1}],
            displayMember: 'label', valueMember: 'value'
        }).on('change', function (event) {
            $("#pwdLockTimeout").jqxNumberInput({disabled: event.args.item.originalItem.value == 0 ? true : false});
        });


    },

    /** Init Data */
    initData: function () {
        this.processSearch();
    },


    /*=======================================================================================
    버튼 이벤트 처리
    ========================================================================================*/
    //정책사용 체크박스 변경이벤트 처리
    changePolicyUse: function (event) {
        var targetId = event.currentTarget.id;
        var isDisabled = !$("#" + targetId).is(":checked");
        switch (targetId) {
            case "pwdPolicyUseChk":
                $("#pwdPolicyTable *").attr("disabled", isDisabled);
                $('#pwdLen').jqxNumberInput({disabled: isDisabled});
                break;
            case "pwdErrPolicyUseChk":
                $("#pwdInputCount").jqxNumberInput({disabled: isDisabled});
                $("#pwdLockType").jqxDropDownList({disabled: isDisabled});

                $("#pwdLockTimeout").jqxNumberInput({disabled: ($("#pwdLockType").val() == 1 && isDisabled == false) == true ?   false : true});

                break;
            case "pwdChgCycleUseChk":
                $("#pwdChgCycle").jqxNumberInput({disabled: isDisabled});
                break;
            case "pwdSameUseChk":
                $("#pwdSameCount").jqxNumberInput({disabled: isDisabled});
                break;
        }
    },

    processSearch: function () {
        $.ajax({
            type: "post",
            url: $('#ctxPath').val() + '/main/env/policyConf/getPolicyConfInfo.do',
            dataType: "json",
            success: function (data) {

                var info = data.resultData;
                console.log(info);
                $("#pwdPolicyUseChk").prop("checked", info.pwdPolicyUse == 1);
                $("#pwdLen").val(info.pwdLen);

                console.log(info)
                $("#pwdNumberUseChk").prop("checked", info.pwdNumberUse == 1);
                $("#pwdUpperLowerUseChk").prop("checked", info.pwdUpperLowerUse == 1);
                $("#pwdSpecialCharUseChk").prop("checked", info.pwdSpecialCharUse == 1);

                $("#pwdChgCycleUseChk").prop("checked", info.pwdChgCycleUse == 1);
                $("#pwdChgCycle").val(info.pwdChgCycle);
                $("#pwdErrPolicyUseChk").prop("checked", info.pwdErrPolicyUse == 1);
                $("#pwdInputCount").val(info.pwdInputCount);

                $("#pwdLockType").val(info.pwdLockType);
                $("#pwdLockTimeout").val(info.pwdLockTimeout);
                $("#pwdLockTimeout").jqxNumberInput({disabled: info.pwdLockType == 0 ? true : false});

                // if (info.pwdLockType==1){
                //     $("#pwdLockTimeout").val(info.pwdLockTimeout);
                //     $("#pwdLockTimeout").jqxDropDownList({disabled :false});
                // }else {
                //     $("#pwdLockTimeout").jqxDropDownList({disabled : true});
                // }


                $("#pwdSameUseChk").prop("checked", info.pwdSameUse == 1);
                $("#pwdSameCount").val(info.pwdSameCount);


                //정책사용여부에 따른 항목을 활성/비활성화
                $("#pwdPolicyUseChk, #pwdChgCycleUseChk, #pwdErrPolicyUseChk, #autoLogoutUseChk, #pwdSameUseChk").change();
            }
        });
    },

    processSave: function () {

        var params = {
            pwdPolicyUse: $("#pwdPolicyUseChk").is(":checked") ? 1 : 0,
            pwdLen: $("#pwdLen").val(),
            pwdNumberUse: $("#pwdNumberUseChk").is(":checked") ? 1 : 0,
            pwdUpperLowerUse: $("#pwdUpperLowerUseChk").is(":checked") ? 1 : 0,
            pwdSpecialCharUse: $("#pwdSpecialCharUseChk").is(":checked") ? 1 : 0,
            pwdChgCycleUse: $("#pwdChgCycleUseChk").is(":checked") ? 1 : 0,
            pwdChgCycle: $("#pwdChgCycle").val(),
            pwdErrPolicyUse: $("#pwdErrPolicyUseChk").is(":checked") ? 1 : 0,
            pwdInputCount: $("#pwdInputCount").val(),
            pwdLockTimeout: $("#pwdLockTimeout").val(),
            pwdSameUse: $("#pwdSameUseChk").is(":checked") ? 1 : 0,
            pwdSameCount: $("#pwdSameCount").val(),
            pwdLockType: $("#pwdLockType").val(),
        };

        Server.post('/main/env/policyConf/savePolicyConf.do', {
            data: params,
            success: function (result) {
                PolicyConf.processSearch();
                alert(result);
            }
        });

    }

};
