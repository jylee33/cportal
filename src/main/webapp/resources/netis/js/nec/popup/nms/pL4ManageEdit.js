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

    },

    /** Init Data */
    initData: function () {
        PMain.getCodeAll();
        PMain.getSelHostname();

    },

    save: function(){
        var l4Seq = $('#l4Seq').val();
        var netType = $('#netType').jqxDropDownList('getSelectedItem');
        // var netType = $('#netType').val();
        var hostname = $('#hostname').jqxDropDownList('getSelectedItem');
        // var hostname = $('#hostname').val();
        var l4Vip = $('#l4Vip').val();
        var vipPurpose = $('#vipPurpose').val();
        var realPort = $('#realPort').val();

        var protocol = $('#protocol').val();
        var lbMethod = $('#lbMethod').val();
        var health = $('#health').val();
        var stickyTime = $('#stickyTime').val();
        var serverParm = $('#serverParm').jqxDropDownList('getSelectedItem');

        var useDept = $('#useDept').val();
        var manager = $('#manager').val();
        var dbConnInfo = $('#dbConnInfo').val();
        var firewallPolicy = $('#firewallPolicy').val();
        var networkConnPolicy = $('#networkConnPolicy').val();
        var comments = $('#comments').val();
        var slbName = $('#slbName').val();
        var vipPort = $('#vipPort').val();

        var realIp = $('#realIp').val();
        var serverPurpose = $('#serverPurpose').val();
        var serverHostname = $('#serverHostname').val();
        var useYn = $('#useYn').jqxDropDownList('getSelectedItem');


        if( l4Vip == "" || lbMethod == "" || stickyTime == "" || serverParm == "" || slbName == "" || useYn.value == 0 ){
            alert(" 필수 값을 등록해주세요(* 표시 참고).");
            return false;
        }else{

            var params = {
                l4Seq : l4Seq,
                netType : netType.value,
                fcdbSeq : ( hostname.value == '' ) ? 0 : hostname.value,
                hostname : ( hostname.value == '' ) ? '' : hostname.label,
                l4Vip : l4Vip,
                vipPurpose : vipPurpose,
                realPort : realPort,
                protocol : protocol,
                lbMethod : lbMethod,
                health  : health,
                serverParm : serverParm.value,
                stickyTime : stickyTime,
                useDept : useDept,
                manager : manager,
                dbConnInfo : dbConnInfo,
                firewallPolicy : firewallPolicy,
                networkConnPolicy : networkConnPolicy,
                comments : comments,
                slbName : slbName,
                vipPort : vipPort,
                realIp : realIp,
                serverPurpose : serverPurpose,
                serverHostname : serverHostname,
                useYn : useYn.value,
            };

            Server.post('/nec/nms/l4Manage/editL4Manage.do', {
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
        Server.get('/nec/nms/l4Manage/getL4CodeListAll.do', {
            data: {
                menuSeq : $('#menuSeq').val(),
            },
            success: function(result) {

                // 1 - 망구분
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
                    $('#netType').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 250, selectedIndex : 0, autoDropDownHeight: false,
                        source: source2
                    });
                }else{
                    $('#netType').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
                        source: source2
                    });
                }

                $("#netType").jqxDropDownList('selectItem', $('#pNetType').val() );

                // 2 - 서버팜 용도
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
                    $('#serverParm').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 250, selectedIndex : 0, autoDropDownHeight: false,
                        source: source2
                    });
                }else{
                    $('#serverParm').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
                        source: source2
                    });
                }

                $("#serverParm").jqxDropDownList('selectItem', $('#pServerParm').val() );

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

            }
        });
    },

    getSelHostname : function(){
        Server.get('/nec/nms/l4Manage/getL4HostnameList.do', {
            data: {
                menuSeq : 2,
                codeType : 6,
            },
            success: function(result) {
                var cnt = 0;
                var source2 = [];
                source2.push({ label: '선택', value: '' });

                $.each(result,function(idx,item){
                    source2.push({ label: item.hostName , value: item.fcdbSeq });
                    cnt++;
                });

                if(cnt>20){
                    $('#hostname').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 500, selectedIndex : 0, autoDropDownHeight: false,
                        source: source2
                    });
                }else{
                    $('#hostname').jqxDropDownList({width:'300', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
                        source: source2
                    });
                }

                $("#hostname").jqxDropDownList('selectItem', $('#pFcdbSeq').val() );
            }
        });
    },



};
