var Main = {
    initVariable: function () {},

    observe: function () {
        $('button').on('click', function(event){
            Main.eventControl(event)
        });//$('button').on('click');
    },

    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSmsKeySave':

                alert('라이선스 키를 저장하기 전에 DB에 데이터가 있는지 확인해주세요\n[SMS_APPLY, SMS_LICENSE_KEY]');

                if(confirm('sms 라이선스 키를 저장하시겠습니까?')){
                    var smsLicenseKey = $('#txtSmsLicenseKey').val();
                    if(smsLicenseKey.length == 0){
                        alert('키를 입력새주세요');
                        return;
                    }
                    var tmp = $('#smsApply').is(':checked');
                    var smsApply = '';
                    if(tmp){
                        smsApply = 'Y';
                    } else {
                        smsApply = 'N';
                    }
                    Server.post('./engineer/licenseMgmt/setSmsLicenseKey.do',{
                        data: {smsLicenseKey: smsLicenseKey, smsApply: smsApply},
                        success: function(data){
                            alert(data);
                        }
                    });//Server.post()
                }
                break;
            case 'btnNmsKeySave':

                alert('라이선스 키를 저장하기 전에 DB에 데이터가 있는지 확인해주세요\n[NMS_APPLY, NMS_LICENSE_KEY]');

                if(confirm('nms 라이선스 키를 저장하시겠습니까?')){
                    var nmsLicenseKey = $('#txtNmsLicenseKey').val();

                    if(nmsLicenseKey.length == 0){
                        alert('키를 입력해주세요');
                        return ;
                    }

                    var tmp = $('#nmsApply').is(':checked');
                    var nmsApply = '';
                    if(tmp){
                        nmsApply = 'Y';
                    } else {
                        nmsApply = 'N';
                    }
                    Server.post('./engineer/licenseMgmt/setNmsLicenseKey.do',{
                        data: {nmsLicenseKey: nmsLicenseKey, nmsApply: nmsApply},
                        success: function(data){
                            alert(data);
                        }
                    });//Server.post()
                }
                break;
        }
    },

    initDesign: function () {
        $('#splitter').jqxSplitter({
            theme: jqxTheme,
            width: '99.8%', height: '99.8%',
            orientation: 'vertical',
            resizable: false,
            splitBarSize: 0.5,
            panels: [{ size: '50%', collapsible: false }, { size: '100%' }]
        });
    },

    initData: function () {
        Main.search();
    },

    search: function () {

        // Server.post("/engineer/licenseMgmt/getSvrLicense.do", {
        //     data: {}, success: function (result) {
        //          $('#txtSvrLicenseKey').val(result.smsAgentCount);
        //     }
        // });//Server.post()

        Server.post("/engineer/licenseMgmt/getSmsLicenseKey.do", {
            data: {}, success: function (result) {
                console.log('sms', result);
                $('#txtSmsLicenseKey').val(result.smsLicenseKey);
                if(result.smsApply == 'Y'){
                    $('#smsApply').prop('checked', true);
                } else {
                    $('#smsApply').prop('checked', false);
                }
            }
        });//Server.post();

        // Server.post("/engineer/licenseMgmt/getSmsApply.do", {
        //     data: {}, success: function (result) {
        //         console.log('sms',result);
        //         if(result.smsApply == 'Y'){
        //             $('#smsApply').prop('checked', true);
        //         } else {
        //             $('#smsApply').prop('checked', false);
        //         }
        //         $('#txtSmsLicenseKey').val(result.smsLicenseKey);
        //     }
        // });//Server.post();

        Server.post("/engineer/licenseMgmt/getNmsLicenseKey.do", {
            data: {}, success: function (result) {
                console.log('nms', result);
                $('#txtNmsLicenseKey').val(result.nmsLicenseKey);
                if(result.nmsApply == 'Y'){
                    $('#nmsApply').prop('checked', true);
                } else {
                    $('#nmsApply').prop('checked', false);
                }
            }
        });//Server.post();

        // Server.post("/engineer/licenseMgmt/getNmsApply.do", {
        //     data: {}, success: function (result) {
        //         console.log('nms',result);
        //         if(result.nmsApply == 'Y'){
        //             $('#nmsApply').prop('checked', true);
        //         } else {
        //             $('#nmsApply').prop('checked', false);
        //         }
        //     }
        // });//Server.post();
    }
};

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});