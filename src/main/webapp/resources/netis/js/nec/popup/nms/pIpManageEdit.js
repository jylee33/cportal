var $addGrid;

$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});

var PMain = {
    /** Initialize */
    initVariable: function () {
        $addGrid = $('#addGrid');
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
            case 'btnSave':
                this.save();
                break;
            case 'btnClose':
                this.close();
                break;
        }
    },
    /** Init Design */
    initDesign: function () {

        // 사용 시작일, 사용 만료일, 승인일자
        var today = new Date();
        today.setMinutes(Math.floor(today.getMinutes() / 5) * 5);
        // $('#useStart , #useEnd , #applyDate').jqxDateTimeInput({width: 180, height: 21, theme: jqxTheme, formatString: 'yyyy-MM-dd HH:mm', culture: 'ko-KR'})
        //     .jqxDateTimeInput('setDate', today);
        $('#useStart , #useEnd , #applyDate').jqxDateTimeInput({width: 180, height: 21, theme: jqxTheme, formatString: 'yyyy-MM-dd HH:mm', culture: 'ko-KR'})
            .jqxDateTimeInput('setDate', '');

    },

    /** Init Data */
    initData: function () {
        PMain.getCodeAll();

        if( $('#pUseStart').val() != '' && $('#pUseStart').val() != '-'){
            var tempUseStart = new Date($('#pUseStart').val());
            $('#useStart').jqxDateTimeInput('setDate', tempUseStart );
        }
        if( $('#pUseEnd').val() != '' && $('#pUseEnd').val() != '-' ){
            var tempUseEnd = new Date($('#pUseEnd').val());
            $('#useEnd').jqxDateTimeInput('setDate', tempUseEnd );
        }
        if( $('#pApplyDate').val() != '' && $('#pApplyDate').val() != '-' ){
            var tempApplyDate = new Date($('#pApplyDate').val());
            $('#applyDate').jqxDateTimeInput('setDate', tempApplyDate );
        }

        // $('#useStart').jqxDateTimeInput('setDate', $('#pUseStart').val());
        // $('#useEnd').jqxDateTimeInput('setDate', $('#pUseEnd').val());
        // $('#applyDate').jqxDateTimeInput('setDate', $('#pApplyDate').val());
    },

    save: function(){

        var ipSeq = $('#ipSeq').val();
        var typeId = $('#typeId').jqxDropDownList('getSelectedItem');
        var netType = $('#netType').jqxDropDownList('getSelectedItem');

        var netIp = $('#netIp').val();
        var netMask = $('#netMask').val();
        var purpose = $('#purpose').val();

        var netName = $('#netName').val();
        var modelName = $('#modelName').val();
        var useYn = $('#useYn').jqxDropDownList('getSelectedItem');
        var ipPurpose = $('#ipPurpose').jqxDropDownList('getSelectedItem');

        var osName = $('#osName').val();
        var useDept = $('#useDept').val();
        var userName = $('#userName').val();
        var useStart = $('#useStart').val();
        var useEnd = $('#useEnd').val();
        var applyDate = $('#applyDate').val();
        var comments = $('#comments').val();


        if( netIp == "" || netMask == "" ){
            alert(" 필수 값을 등록해주세요(* 표시 참고).");
            return false;
        }else{

            var params = {
                ipSeq: ipSeq,
                typeId : typeId.value,
                netType : netType.value,
                netIp : netIp,
                netMask : netMask,
                purpose : purpose,
                netName : netName,
                modelName : modelName,
                useYn : useYn.value,
                ipPurpose : ipPurpose.value,
                osName  : osName,
                useDept : useDept,
                userName : userName,
                useStart : useStart,
                useEnd : useEnd,
                applyDate : applyDate,
                comments : comments,
            };

            Server.post('/nec/nms/ipManage/editIpManage.do', {
                data: params,
                success: function(result) {
                    if(result == 1){
                        alert("수정되었습니다.");
                        PMain.close();
                        opener.parent.Main.search();
                    }
                }
            });

        }


    },

    close : function() {
        self.close();
    },

    getCodeAll : function(){
        Server.get('/nec/nms/ipManage/getIpCodeListAll.do', {
            data: {
                menuSeq : $('#menuSeq').val(),
            },
            success: function(result) {

                // 1 - 분류
                var cnt = 0;
                var source2 = [];
                source2.push({ label: '선택', value: '0' });

                $.each(result,function(idx,item){
                    if(item.codeType == 1 ){
                        source2.push({ label: item.selText , value: item.selValue });
                        cnt++;
                    }
                });

                if(cnt>20){
                    $('#typeId').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 250, selectedIndex : 0, autoDropDownHeight: false,
                        source: source2
                    });
                }else{
                    $('#typeId').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
                        source: source2
                    });
                }

                $("#typeId").jqxDropDownList('selectItem', $('#pTypeId').val() );

                // 2 - 망구분
                cnt = 0;
                source2 = [];
                source2.push({ label: '선택', value: '0' });

                $.each(result,function(idx,item){
                    if(item.codeType == 2 ) {
                        source2.push({label: item.selText, value: item.selValue});
                        cnt++;
                    }
                });


                if(cnt>20){
                    $('#netType').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 250, selectedIndex : 0, autoDropDownHeight: false,
                        source: source2
                    });
                }else{
                    $('#netType').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
                        source: source2
                    });
                }

                $("#netType").jqxDropDownList('selectItem', $('#pNetType').val() );

                // 3 - 사용여부
                cnt = 0;
                source2 = [];
                source2.push({ label: '선택', value: '0' });

                $.each(result,function(idx,item){
                    if(item.codeType == 3 ) {
                        source2.push({label: item.selText, value: item.selValue});
                        cnt++;
                    }
                });

                if(cnt>20){
                    $('#useYn').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 250, selectedIndex : 0, autoDropDownHeight: false,
                        source: source2
                    });
                }else{
                    $('#useYn').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
                        source: source2
                    });
                }

                $("#useYn").jqxDropDownList('selectItem', $('#pUseYn').val() );

                // 4 - IP 용도
                cnt = 0;
                source2 = [];
                source2.push({ label: '선택', value: '0' });

                $.each(result,function(idx,item){
                    if(item.codeType == 4 ) {
                        source2.push({label: item.selText, value: item.selValue});
                        cnt++;
                    }
                });


                if(cnt>20){
                    $('#ipPurpose').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 250, selectedIndex : 0, autoDropDownHeight: false,
                        source: source2
                    });
                }else{
                    $('#ipPurpose').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
                        source: source2
                    });
                }

                $("#ipPurpose").jqxDropDownList('selectItem', $('#pIpPurpose').val() );

            }
        });
    },
};
