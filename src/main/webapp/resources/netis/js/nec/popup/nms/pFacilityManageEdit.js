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

        $('#manageCoupFl, #tacacsConnFl ,#tacacsManageFl ,#directConnFl , #directManageFl , #syslogFl ').jqxCheckBox({ width: 100, height: 21, disabled: false });

        // 접속방법
        $('div[name="connType"]').jqxCheckBox({ width: 60, height: 25 });

        // 도입일 , Warranty 만기일
        var today = new Date();
        today.setMinutes(Math.floor(today.getMinutes() / 5) * 5);
        $('#installDate , #warrantyExpire').jqxDateTimeInput({width: 180, height: 21, theme: jqxTheme, formatString: 'yyyy-MM-dd HH:mm', culture: 'ko-KR'})
            .jqxDateTimeInput('setDate', today);

    },

    /** Init Data */
    initData: function () {
        PMain.getCodeAll();

        if( $('#pManageCoupFl').val() == 1){
            $('#manageCoupFl').jqxCheckBox('check');
        }
        if( $('#pTacacsConnFl').val() == 1){
            $('#tacacsConnFl').jqxCheckBox('check');
        }
        if( $('#pTacacsManageFl').val() == 1){
            $('#tacacsManageFl').jqxCheckBox('check');
        }
        if( $('#pDirectConnFl').val() == 1){
            $('#directConnFl').jqxCheckBox('check');
        }
        if( $('#pDirectManageFl').val() == 1){
            $('#directManageFl').jqxCheckBox('check');
        }
        if( $('#pSyslogFl').val() == 1){
            $('#syslogFl').jqxCheckBox('check');
        }

        if( $('#pConnType').val() != undefined || $('#pConnType').val() != '' ){

            var tempArr = $('#pConnType').val().split("/");
            var tempId = "connType";
            $.each(tempArr,function(idx,item){
                tempId = "connType";
                if(item != ''){
                    tempId = tempId+""+item;
                    if($('#'+tempId+'').length >0 ){
                       $('#'+tempId+'').jqxCheckBox('check');
                    }
                }
            });


        }
        if( $('#pInstallDate').val() != '' && $('#pInstallDate').val() != '-'  ){
            var tempInstallDate = new Date($('#pInstallDate').val());
            // $('#installDate').jqxDateTimeInput('setDate', $('#pInstallDate').val());
            $('#installDate').jqxDateTimeInput('setDate', tempInstallDate );
        }
        if( $('#pWarrantyExpire').val() != '' && $('#pWarrantyExpire').val() != '-' ){
            var tempWarrantyExpire = new Date($('#pWarrantyExpire').val());
            // $('#warrantyExpire').jqxDateTimeInput('setDate', $('#pWarrantyExpire').val());
            $('#warrantyExpire').jqxDateTimeInput('setDate', tempWarrantyExpire );
        }else{
            $('#warrantyExpire').jqxDateTimeInput('setDate', '' );
        }
    },

    save: function(){
        var fcdbSeq = $('#fcdbSeq').val();
        var typeId = $('#typeId').jqxDropDownList('getSelectedItem');
        var netType = $('#netType').jqxDropDownList('getSelectedItem');
        var areaName = $('#areaName').jqxDropDownList('getSelectedItem');
        var hostName = $('#hostName').val();
        var layer = $('#layer').jqxDropDownList('getSelectedItem');
        var purpose = $('#purpose').val();
        var mType = $('#mType').jqxDropDownList('getSelectedItem');
        var vendorName = $('#vendorName').val();
        var commIp = $('#commIp').val();
        var manageIp = $('#manageIp').val();
        var connTypeSSH = $('#connTypeSSH').val() == true ? "SSH" : "" ;
        var connTypeHTTPS = $('#connTypeHTTPS').val() == true ? "HTTPS" : "" ;
        var connTypeGUI = $('#connTypeGUI').val() == true ? "GUI" : "" ;
        var connTypeCLI = $('#connTypeCLI').val() == true ? "CLI" : "" ;
        var connType = "";
        if(connTypeSSH != "" ){
            connType += connTypeSSH+"/";
        }
        if(connTypeHTTPS != "" ){
            connType += connTypeHTTPS+"/";
        }
        if(connTypeGUI != "" ){
            connType += connTypeGUI+"/";
        }
        if(connTypeCLI != "" ){
            connType += connTypeCLI+"/";
        }
        var manageCoupFl = $('#manageCoupFl').val();
        var tacacsConnFl = $('#tacacsConnFl').val();
        var tacacsManageFl = $('#tacacsManageFl').val();
        var directConnFl = $('#directConnFl').val();
        var directManageFl = $('#directManageFl').val();
        var syslogFl = $('#syslogFl').val();
        var commerceTitle = $('#commerceTitle').val();
        var installDate = $('#installDate').val();
        var warrantyExpire = $('#warrantyExpire').val();
        var serialNo = $('#serialNo').val();
        var durableYears = $('#durableYears').val();
        var historyManage = $('#historyManage').jqxDropDownList('getSelectedItem');
        var manager = $('#manager').val();
        var comments = $('#comments').val();
        var manageCorp = $('#manageCorp').val();
        var manageName = $('#manageName').val();
        var managePhone = $('#managePhone').val();

        if( typeId.value == "0" || netType.value == "0" || areaName.value == "0" || hostName == "" || mType.value == "0" || installDate== "" || historyManage.value == "0" || manager == "" ){
            alert(" 필수 값을 등록해주세요(* 표시 참고).");
            return false;
        }else{

            var params = {
                fcdbSeq: fcdbSeq,
                typeId: typeId.value,
                netType : netType.value,
                areaName : areaName.value,
                hostName : hostName,
                layer : layer.value,
                purpose : purpose,
                mType : mType.value,
                vendorName : vendorName,
                commIp : commIp,
                manageIp : manageIp,
                connType : connType,
                manageCoupFl : manageCoupFl,
                tacacsConnFl : tacacsConnFl,
                tacacsManageFl : tacacsManageFl,
                directConnFl : directConnFl,
                directManageFl : directManageFl,
                syslogFl : syslogFl,
                commerceTitle : commerceTitle,
                installDate : installDate,
                warrantyExpire : warrantyExpire,
                serialNo : serialNo,
                durableYears : durableYears,
                historyManage : historyManage.value,
                manager : manager,
                comments : comments,
                manageCorp : manageCorp,
                manageName : manageName,
                managePhone : managePhone
            };

            Server.post('/nec/nms/facilityManage/editFacilityManage.do', {
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
        Server.get('/nec/nms/facilityManage/getFacilityCodeListAll.do', {
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
                    }
                });

                $('#typeId').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
                    source: source2
                });

                $("#typeId").jqxDropDownList('selectItem', $('#pTypeId').val() );

                // 2 - 망구분
                source2 = [];
                source2.push({ label: '선택', value: '0' });

                $.each(result,function(idx,item){
                    if(item.codeType == 2 ) {
                        source2.push({label: item.selText, value: item.selValue});
                    }
                });

                $('#netType').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
                    source: source2
                });

                $("#netType").jqxDropDownList('selectItem', $('#pNetType').val() );

                // 3 - 지역
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
                    $('#areaName').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 250, selectedIndex : 0, autoDropDownHeight: false,
                        source: source2
                    });
                }else{
                    $('#areaName').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
                        source: source2
                    });
                }
                $("#areaName").jqxDropDownList('selectItem', $('#pAreaName').val() );

                // 4 - 장비종류
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
                    $('#mType').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 250, selectedIndex : 0, autoDropDownHeight: false,
                        source: source2
                    });
                }else{
                    $('#mType').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
                        source: source2
                    });
                }
                $("#mType").jqxDropDownList('selectItem', $('#pMType').val() );

                // 5 - 이력관리
                cnt = 0;
                source2 = [];
                source2.push({ label: '선택', value: '0' });

                $.each(result,function(idx,item){
                    if(item.codeType == 5 ) {
                        source2.push({label: item.selText, value: item.selValue});
                        cnt++;
                    }
                });

                if(cnt>20){
                    $('#historyManage').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 250, selectedIndex : 0, autoDropDownHeight: false,
                        source: source2
                    });
                }else{
                    $('#historyManage').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
                        source: source2
                    });
                }
                $("#historyManage").jqxDropDownList('selectItem', $('#pHistoryManage').val() );

                // 6 - Layer
                cnt = 0;
                source2 = [];
                source2.push({ label: '선택', value: '0' });

                $.each(result,function(idx,item){
                    if(item.codeType == 6 ) {
                        source2.push({label: item.selText, value: item.selValue});
                        cnt++;
                    }
                });

                if(cnt>20){
                    $('#layer').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 250, selectedIndex : 0, autoDropDownHeight: false,
                        source: source2
                    });
                }else{
                    $('#layer').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
                        source: source2
                    });
                }
                $("#layer").jqxDropDownList('selectItem', $('#pLayer').val() );
            }
        });
    },



};
