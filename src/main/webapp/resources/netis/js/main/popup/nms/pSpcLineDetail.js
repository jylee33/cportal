var uploadCnt = 0;
var data;

function param_init(params) {
    data = params;
    PMain.initVariable();
    PMain.initDesign();
    PMain.observe();
    PMain.initData();
}

var PMain = {
    /** variable */
    initVariable: function() {

    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { PMain.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnSave':
                PMain.saveLine();
                break;
            case 'btnClose':
                PMain.close();
                break;
        }
    },

    /** init design */
    initDesign: function() {

        PMain.createDropDownList($('#p_company'), 'SPC_AFFILIATE', data.companyCode); //소속
        PMain.createDropDownList($('#p_ifSortation'), 'SPC_LINETYPE', data.ifSortationCode); //회선구분
        PMain.createDropDownList($('#p_area'), 'SPC_LOCATION', data.areaCode); //지역
        PMain.createDropDownList($('#p_ifStatus'), 'SPC_LINESTATUS', data.ifStatusCode); //회선상태
        PMain.createDropDownList($('#p_costSortation'), 'SPC_COSTTYPE', data.costSortationCode); //비용구분
        PMain.createDropDownList($('#p_providers'), 'SPC_PROVIDER', data.providersCode); //제공사
        PMain.createDropDownList($('#p_contractor'), 'SPC_CONTRACTOR',data.constractorCode); //계약사
        PMain.createDropDownList($('#p_speed'), 'SPC_LINESPEED',data.speedCode); //속도

        $('#p_openDate').jqxDateTimeInput({ width: 145, height: 21, theme: jqxTheme, formatString: 'yyyy-MM-dd', culture: 'ko-KR' });

    },

    /** init data */
    initData: function() {

        $('#p_institution').val(data.institution);
        $('#p_ifNo').val(data.ifNo);
        $('#p_ifIp').val(data.ifIp);
        $('#p_userNo').val(data.userNo);
        $('#p_user').val(data.user);
        $('#p_add').val(data.add);
        $('#p_userTransferred').val(data.userTransferred);
        $('#p_openDate').val(data.openDate);//
        $('#p_cost').val(data.cost);
        $('#p_discountRate').val(data.discountRate);
        $('#p_add1').val(data.add1);
        $('#p_work').val(data.work);
        $('#p_npcNo').val(data.npcNo);
        $('#p_serialIp').val(data.serialIp);
        $('#p_serialIp1').val(data.serialIp1);
        $('#p_memo').val(data.memo);
        $('#p_ifSortation').val(data.ifSortationCode);

        this.getFileList();
    },

    /** code list 생성 */
    createDropDownList: function ($divId, type, selected) {
        var params = { codeKind: type, useFlag: 1 };
        HmDropDownList.create($divId, {
            source: HmDropDownList.getSourceByUrl('/code/getCodeListByCodeKind.do', params),
            displayMember: 'codeValue1', valueMember: 'codeId'
        });

        $divId.on('bindingComplete', function () { $divId.val(selected) });
        // $divId.jqxDropDownList({ disabled: true });
    },

    close: function () {
        $('#pwindow').jqxWindow('close');
    },

    getFileList: function () {
        var prefix = '/main/nms/spcLineMgmt/';
        var downloadUrl = prefix + 'downloadSpcFile.do';
        var deleteUrl = prefix + 'deleteSpcFile.do';

        Server.get('/main/nms/spcLineMgmt/getSpcLineFileList.do', {
            data: { seqNo: $('#seqNo').val() },
            success: function (result) {
                HmUtil.attachFileListByUrl(result, false, "fileUpload", downloadUrl, deleteUrl);
            }
        })
    }

};
