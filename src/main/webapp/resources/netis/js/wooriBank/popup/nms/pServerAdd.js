var $p_grid;

$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});


var PMain = {
    /** Initialize */
    initVariable: function () {
    },

    /** Event Object */
    observe: function () {
        $("button").bind("click", function (event) {
            PMain.eventControl(event);
        });
    },

    /** Event Control Function */
    eventControl: function (event) {
        switch (event.currentTarget.id) {
            case 'pbtnSave': this.save(); break;
        }
    },
    /** Init Design */
    initDesign: function () {
        // 서버위치 콤보
        HmDropDownList.create($('#p_wbSvrLocCd'), {
            source: HmDropDownList.getSourceByUrl('/wooriBank/nms/ipSearch/combo/getCodeDataList.do', {mainCodeKind : 'SVR_LOC'}),
            autoDropDownHeight: true, selectedIndex: 0
        });

        // 서버종류 콤보
        HmDropDownList.create($('#p_wbSvrKindCd'), {
            source: HmDropDownList.getSourceByUrl('/wooriBank/nms/ipSearch/combo/getCodeDataList.do', {mainCodeKind : 'SVR_KIND'}),
            autoDropDownHeight: true, selectedIndex: 0
        })

        // 서버용도 콤보
        HmDropDownList.create($('#p_wbSvrUseCd'), {
            source: HmDropDownList.getSourceByUrl('/wooriBank/nms/ipSearch/combo/getCodeDataList.do', {mainCodeKind : 'SVR_USE'}),
            autoDropDownHeight: true, selectedIndex: 0
        })
    },

    /** Init Data */
    initData: function () {

    },

    save: function () {
        var addData = {
            wbSvrLocCd: $('#p_wbSvrLocCd').val(),
            rackNm: $('#p_rackNm').val(),
            wbSvrKindCd: $('#p_wbSvrKindCd').val(),
            wbSvrUseCd: $('#p_wbSvrUseCd').val(),
            workNm: $('#p_workNm').val(),
            hostNm: $('#p_hostNm').val()
        };

        var obj = $('#p_wbSvrLocCd');
        if ($.isBlank(obj.val())) {
            alert('서버위치를 선택해 주세요.');
            obj.focus();
            return;
        }

        obj = $('#p_rackNm');
        if ($.isBlank(obj.val())) {
            alert('랙명칭을 입력해 주세요.');
            obj.focus();
            return;
        }
        
        obj = $('#p_wbSvrKindCd');
        if ($.isBlank(obj.val())) {
            alert("서버종류를 선택해 주세요.");
            obj.focus();
            return false;
        }
        
        obj = $('#p_wbSvrUseCd');
        if ($.isBlank(obj.val())) {
            alert("서버용도를 선택해 주세요.");
            obj.focus();
            return false;
        }
        
        obj = $('#p_workNm');
        if ($.isBlank(obj.val())) {
            alert("업무명을 입력해 주세요.");
            obj.focus();
            return false;
        }

        obj = $('#p_hostNm');
        if ($.isBlank(obj.val())) {
            alert("HOSTNAME을 입력해 주세요.");
            obj.focus();
            return false;
        }

        Server.post('/wooriBank/nms/ipApply/saveServer.do', {
            data: addData, success: function (result) {
                alert('저장되었습니다.');
                self.close();
                opener.parent.$('#ipApplyGrid').jqxGrid('updatebounddata');
            }
        });
        
    }

};
