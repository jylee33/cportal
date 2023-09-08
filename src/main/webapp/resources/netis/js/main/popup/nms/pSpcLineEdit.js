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

        $('#fileUpload').on('uploadEnd', function (event) {
            if (--uploadCnt == 0) {
                alert('저장되었습니다.');
                PMain.close();
            }
        });

        $('#fileUpload').on('select', function (event) {

            var fileLength = event.args.owner._fileRows.length;

            var fileNm = event.args.file,
                fileExt = fileNm.substring(fileNm.lastIndexOf('.') + 1);
            if (HmUtil.checkExecFileExt(fileExt) === false) {
                $('#fileUpload').jqxFileUpload('cancelFile', fileLength - 1);
                return;
            }

            if ($('.jqx-file-upload-file-input')[fileLength - 1].files[0].size > $('#uploadFileLength').val()) {
                alert($('#uploadFileLength').val() + "Byte로 용량이 제한되어있습니다.");
                $('#fileUpload').jqxFileUpload('cancelFile', fileLength - 1);
                return;
            }

            if (fileLength > 2) {
                $('#fileUpload').jqxFileUpload('cancelFile', fileLength - 1);
                alert('첨부파일 최대 개수는 2개 입니다.');
            }
        });
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

        $('#fileUpload').jqxFileUpload({width: '100%', fileInputName: 'fileinput'});

        var $fileBtn = $('#fileUploadBrowseButton');
        $fileBtn.val("첨부파일(MAX:2)");
        $fileBtn.css('width', '100px');
        $fileBtn.css('height', '25px');
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
    },

    saveLine: function () {
        if(!this.validation()) return;

        var params = $('#pForm').serializeObject();
        params.company = $('#p_company').val();
        params.area = $('#p_area').val();
        params.ifSortation = $('#p_ifSortation').val();
        params.ifStatus = $('#p_ifStatus').val();
        params.userTransferred = $('#p_userTransferred').val();
        params.costSortation = $('#p_costSortation').val();
        params.openDate = $('#p_openDate').val();
        params.providers = $('#p_providers').val();
        params.contractor = $('#p_contractor').val();
        params.speed = $('#p_speed').val();
        params.seqNo = $('#seqNo').val();

        Server.post('/main/nms/spcLineMgmt/editSpcLine.do', {
            data: params,
            success: function () {
                PMain.uploadFile();
                Main.search();
            }
        })
    },

    uploadFile: function () {
        var url = '/main/nms/spcLineMgmt/uploadSpcFile.do?seqNo='+ $('#seqNo').val();
        $('#fileUpload').jqxFileUpload({uploadUrl: url});
        if ($('.jqx-file-upload-file-row').length !== 0) {
            try {
                $('#fileUpload').jqxFileUpload('uploadAll');
            } catch (e) {
                console.log(e);
            }
            uploadCnt = $('.jqx-file-upload-file-row').length;
        } else {
            alert('저장되었습니다.');
            PMain.close();
        }
    },

    validation: function () {
        var obj = $('#p_company');
        if($.isBlank(obj.val())) {
            alert('소속을 입력해주세요.');
            return false;
        }
        obj = $('#p_area');
        if($.isBlank(obj.val())) {
            alert('지역을 입력해주세요.');
            return false;
        }
        obj = $('#p_ifSortation');
        if($.isBlank(obj.val())) {
            alert('회선구분을 선택해주세요.');
            return false;
        }
        obj = $('#p_ifStatus');
        if($.isBlank(obj.val())) {
            alert('회선상태를 선택해주세요.');
            return false;
        }
        obj = $('#p_ifNo');
        if($.isBlank(obj.val())) {
            alert('회선번호/ID를 입력해주세요.');
            return false;
        }
        obj = $('#p_speed');
        if($.isBlank(obj.val())) {
            alert('속도/CLOCK를 선택해주세요.');
            return false;
        }

        return true;
    },

    close: function () {
        $('#pwindow').jqxWindow('close');
    },

    getUser: function () {
        $.post(ctxPath + '/main/popup/nms/pSpcLineUser.do', null,
            function(result) {
                HmWindow.openFit($('#p2window'), '작업 이관자 선택', result, 650, 500, 'pwindow_init', null);
            }
        );
    },

    getFileList: function () {
        var prefix = '/main/nms/spcLineMgmt/';
        var downloadUrl = prefix + 'downloadSpcFile.do';
        var deleteUrl = prefix + 'deleteSpcFile.do';

        Server.get('/main/nms/spcLineMgmt/getSpcLineFileList.do', {
            data: { seqNo: $('#seqNo').val() },
            success: function (result) {
                console.log('result',result)
                HmUtil.attachFileListByUrl(result, true, "fileUpload", downloadUrl, deleteUrl);
            }
        })
    }

};
