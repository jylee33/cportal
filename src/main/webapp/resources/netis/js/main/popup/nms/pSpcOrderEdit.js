var DesAreaDocnt;
var colorMode;
var $mainStyleContents; //전체 배경을 관련을 제어하는 프레임 메인DIV
var $file;
var uploadCnt = 0;
var styleMode = {
    //색상
    ALL_BG_COLOR: 'allBgColor',
    ALL_BG_PATTERN: 'allBgPattern',
    SELECT_FONT_COLOR: 'selectFontColor',
    SELECT_FONT_BG_COLOR: 'selectFontBgColor',

    //삽입
    ADD_IMG: 'image',
    ADD_HR1: 'hr1',
    ADD_HR2: 'hr2',
    ADD_LINK: 'link',
    ADD_SIGN: 'sign'
};

var mouseMode = {CLICK: 1, OVER: 2};

function pwindow_init(params) {
    $('#seqNo').val(params.seqNo);

    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
}

var PMain = {
    /** variable */
    initVariable: function () {
        $file = $('#fileUpload');
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            PMain.eventControl(event);
        });
        $file.on('click', function (event) { PMain.eventFileControl(); });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSave':
                PMain.save();
                break;
            case 'btnClose':
                PMain.close();
                break;
        }
    },

    /** init design */
    initDesign: function () {

        PMain.createDropDownList($('#p_company'), 'SPC_AFFILIATE');//소속
        PMain.createDropDownList($('#p_company_etc'), 'SPC_PROVIDER');//회사구분
        PMain.createDropDownList($('#p_application_form'), 'SPC_CONTRACTOR');//신청서구분
        PMain.createWorkUserList();//고객사

        PMain.initForm();
        PMain.initFile();
    },

    /** init data */
    initData: function () {

    },

    validation: function () {
        var obj = $('#p_company');
        if ($.isBlank(obj.val())) {
            alert('소속을 선택해주세요.');
            return false;
        }
        obj = $('#p_company_etc');
        if ($.isBlank(obj.val())) {
            alert('회사구분을 선택해주세요');
            return false;
        }
        obj = $('#p_application_form');
        if ($.isBlank(obj.val())) {
            alert('신청서구분을 선택해주세요.');
            return false;
        }
        obj = $('#p_name');
        if ($.isBlank(obj.val())) {
            alert('제목을 입력해주세요.');
            return false;
        }

        return true;
    },

    save: function () {
        if (!this.validation()) return;

        var params = {};
        params.seqNo = $('#seqNo').val();
        params.company = $('#p_company').val();
        params.htmlDesc = DesAreaDocnt.body.innerHTML.replace(/"/g, "\'"); // 파싱 이슈 방지
        params.companyEtc = $('#p_company_etc').val();
        params.applicationForm = $('#p_application_form').val();
        params.clientCompany = $('#p_client_company').val();
        params.name = $('#p_name').val();
        params.memo = $('#p_memo').val();

        Server.post('/main/nms/spcOrder/editSpcOrder.do', {
            data: params,
            success: function (message) {
                // alert(message)
                PMain.uploadFile();
                PMain.close();
                Main.search();
            }
        })
    },

    close: function () {
        $('#pwindow').jqxWindow('close');
    },

    createDropDownList: function ($divId, type) {
        var params = {codeKind: type, useFlag: 1};
        HmDropDownList.create($divId, {
            source: HmDropDownList.getSourceByUrl('/code/getCodeListByCodeKind.do', params),
            displayMember: 'codeValue1', valueMember: 'codeValue1', width: '250px'
        });
    },

    createWorkUserList: function () {
        Server.get('/main/nms/spcWorkUserMgmt/getSpcWorkUserList.do', {
            success: function (result) {
                HmDropDownList.create($('#p_client_company'), {
                    source: result, displayMember: 'deptName', valueMember: 'deptName', width: '250px'
                });
            }
        })
    },

    /*=============================================================
            첨부파일
    =============================================================*/

	initFile: function () {
		$file.jqxFileUpload({width: '100%', fileInputName: 'fileinput'});

        var $fileBtn = $('#fileUploadBrowseButton');
        $fileBtn.val("첨부파일(MAX:2)");
        $fileBtn.css('width', '100px');
        $fileBtn.css('height', '25px');
    },

	uploadFile: function () {
		var url = '/main/nms/spcOrder/uploadSpcFile.do?seqNo='+ $('#seqNo').val();
		$file.jqxFileUpload({uploadUrl: url});
        if ($('.jqx-file-upload-file-row').length !== 0) {
            try {
                $file.jqxFileUpload('uploadAll');
            } catch (e) {
                console.log(e);
            }
            uploadCnt = $('.jqx-file-upload-file-row').length;
        } else {
            alert('저장되었습니다.');
            PMain.close();
        }
    },

	eventFileControl: function () {

		$file.on('uploadEnd', function (event) {
            if (--uploadCnt == 0) {
                alert('저장되었습니다.');
                PMain.close();
            }
        });

		$file.on('select', function (event) {

            var fileLength = event.args.owner._fileRows.length;

            var fileNm = event.args.file;
			var fileExt = fileNm.substring(fileNm.lastIndexOf('.') + 1);
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

    setFiles: function (data) {
	    if(data.length === 0) return;

        var prefix = '/main/nms/spcOrder/';
        var downloadUrl = prefix + 'downloadSpcFile.do';
        var deleteUrl = prefix + 'delSpcFile.do';

        HmUtil.attachFileListByUrl(data, true, "fileUpload", downloadUrl, deleteUrl);
    },

    /*=============================================================
     Form 설정
     =============================================================*/

    initForm: function () {
        PMain.createOrderForm();
        PMain.createColorBox();
        PMain.createSignBox();
    },

    createOrderForm: function () {
        DesAreaDocnt = window.frames.DesignArea.document;
        DesAreaDocnt.designMode = 'On';
        // 저장된 HTML 폼 값 조회
        Server.get('/main/nms/spcOrder/getSpcOrderDetail.do', {
            data: {seqNo: $('#seqNo').val()},
            success: function (result) {
                PMain.setFormData(result.orderDetail);
                PMain.setFiles(result.orderFiles);
                $mainStyleContents = $('#remsize').contents().find('#mainDiv');
            }
        })
    },

    setFormData: function (data) {
        $('#p_company').val(data.company);
        $('#p_company_etc').val(data.companyEtc);
        $('#p_application_form').val(data.applicationForm);
        $('#p_client_company').val(data.clientCompany);
        $('#p_name').val(data.name);
        $('#p_memo').val(data.memo);
        DesAreaDocnt.body.innerHTML = data.htmlDesc;
    },

    /*=============================================================
     Toolbar 세팅
     =============================================================*/

    createSignBox: function () {
        var SignArray = ['<li>', '『 』', '【 】', '◁', '▷', '◀', '▶', '☆', '★', '○', '●', '◎', '◆', '□', '♀', '♂',
            '△', '▲', '→', '←', '↑', '↓', '↔', '≪', '≫', '⇒', '⇔', '♤', '♠', '♡', '♥', '♧', '♣', '⊙', '◈', '▣',
            '◐', '▤', '▥', '▧', '▦', '♨', '☏', '☎', '☜', '☞', '®', '㉿', '㈜', '♬', '♪', '±', '×', '÷', '≠', '≤', '≥', '∽', '￥'];
        var elemDiv = document.createElement('div');
        var elemHTML;
        elemHTML = '<div id=Signtext style="position:absolute; visibility:hidden; z-Index:10; left: 0;right: 0">';
        elemHTML += '<select onchange=PMain.setSign(value)>';
        elemHTML += '<option value="">기호</option>';
        elemHTML += "<option value=''></option><option value='<li>'>dot</option>";

        for (var i = 1; i < SignArray.length; ++i) {
            elemHTML += "<option value='" + SignArray[i] + "'>" + SignArray[i] + "</option>";
        }
        elemHTML += '</select>';
        elemHTML += '</div>';
        elemDiv.innerHTML = elemHTML;
        $('#toolDiv').append(elemDiv);
    },

    createColorBox: function () {
        var colors = [
            '#FFFFFF', '#FFF3EF', '#FFFBEF', '#FFFFEF', '#FFFFEF', '#EFFFF7', '#EFFFFF', '#EFFBFF', '#EFF3FF', '#FFEFFF', '#FFEFFF',
            '#FFEFFF', '#FFEFFF', '#EEEEEE', '#FFD3CE', '#FFEFCE', '#FFFFCE', '#EFFFCE', '#CEFFD6', '#CEFFF7', '#CEF3FF', '#CEDBFF',
            '#E7CFFF', '#EFCFFF', '#FFCFFF', '#FFCFEF', '#BBBBBB', '#FF8E84', '#FFD384', '#FFFF94', '#CEFF84', '#84FF8C', '#84FFEF',
            '#84E3FF', '#849EFF', '#BD86FF', '#D686FF', '#FF86FF', '#FF86CE', '#999999', '#FF3421', '#FFAE21', '#FFFF21', '#A5FF21',
            '#21FF31', '#21FFD6', '#21CBFF', '#2151FF', '#8424FF', '#AD24FF', '#FF24FF', '#FF24A5', '#777777', '#E70C00', '#E79200',
            '#E7E700', '#84E700', '#00E708', '#00E7BD', '#00AEE7', '#0028E7', '#6300E7', '#9500E7', '#E700E7', '#E70084', '#555555',
            '#9C0800', '#9C6100', '#9C9E00', '#5A9E00', '#009E08', '#009E84', '#00799C', '#001C9C', '#42009C', '#63009C', '#9C009C',
            '#9C005A', '#303030', '#5A0500', '#5A3800', '#5A5D00', '#315D00', '#005D00', '#005D4A', '#00495A', '#00105A', '#29005A',
            '#39005A', '#5A005A', '#5A0031', '#000000', '#390000', '#391800', '#393C00', '#213C00', '#003C00', '#003C31', '#003039',
            '#000C39', '#180039', '#210039', '#390039', '#390021'];
        var elemHTML;
        var elemDiv = document.createElement('div');
        elemHTML = '<div id=ColorTableview style="position:absolute; visibility:hidden; z-Index:10;left: 0;right: 0;">';

        for (var i = 0; i < 104; i++) {
            elemHTML += '<a href=javascript:void(0) onClick=PMain.setColor("' + colors[i] + '",1)  onMouseOver=PMain.setColor("' + colors[i] + '",2)>';
            elemHTML += '<span style=background-color:' + colors[i] + ';>&nbsp;	&nbsp;</span></a>';
            if (i % 13 == 12)
                elemHTML += '<br>'
        }
        elemHTML += '</div>';
        elemDiv.innerHTML = elemHTML;
        $('#toolDiv').append(elemDiv);
    },

    /*=============================================================
     Toolbar 제어
     =============================================================*/

    // 정렬 및 밀기
    editAlign: function (exec) {
        var doc = DesignArea.document;

        doc.execCommand(exec);
    },

    // 색상 및 패턴
    editColorAndPattern: function (type, mode) {
        var divId = '';
        if (type === 'color') divId = 'ColorTableview';
        else divId = 'Backimgview';

        PMain.openBox(divId, mode);
    },

    // 배경(패턴)
    editBgPattern: function (value, action, repeat) {
        var imgUrl = '/img/spc/' + value;

        //기존 iframe body에 스타일 적용 -> body 하단 메인 div에 적용으로 변경
        $mainStyleContents.css('background-image', 'url(' + imgUrl + ')');

        if (repeat === 1) {	//배경그림의 연속하지 않음. 중앙에 위치

            //기존 iframe body에 스타일 적용 -> body 하단 메인 div에 적용으로 변경
            $mainStyleContents.css('background-repeat', 'no-repeat');
            $mainStyleContents.css('background-position', '50% 50%');
        } else {
            $mainStyleContents.css('background-repeat', 'repeat');
        }
        if (action === mouseMode.CLICK) {
            Backimgview.opened = false;
            Backimgview.style.visibility = 'hidden';
        }
    },

    // 글자
    editFont: function (exec, value) {
        var doc = DesignArea.document;

        if (value) doc.execCommand(exec, false, value);
        else doc.execCommand(exec);
    },

    // 그 외(이미지, 수평선, 링크)
    editEtc: function (tag, readTag) {
        var o = DesAreaDocnt.body;	//iframe의 body
        var hrColor = '#8888ff';
        var hrWidth = "100%";

        switch (tag) {
            case styleMode.ADD_IMG:
                var imgUrl = prompt("▥▥ 본문에 삽입할 이미지의 URL을 입력하십시오.(예, http://abcd.com/img/abcd.gif)", "http://");
                if (imgUrl !== "http://" && imgUrl) {
                    o.innerHTML += ("<img border=0 src=" + imgUrl + ">");
                    o.focus();
                }
                break;

            case styleMode.ADD_HR1:
                var hrHeight = prompt("◎ 수평선의 두께를 지정하거나 [확인] 버튼을 누르십시오.", hrHeight);
                if (hrHeight) {
                    hrColor = prompt("◎ 수평선의 색상을 지정하거나 [확인] 버튼을 누르십시오.", hrColor);
                }
                if (hrColor) {
                    o.innerHTML += "<hr size=" + hrHeight + "  width=" + hrWidth + "  color=" + hrColor + "><br/>";
                }
                break;

            case styleMode.ADD_HR2:
                var doc = DesignArea.document;
                doc.execCommand(readTag);
                o.innerHTML += "<br/>";
                break;

            case styleMode.ADD_LINK:
                var linkUrl = prompt("▥▥ 본문에 삽입할 링크URL을 입력하십시오.(예, http://abcd.com/abcd/web/abc.html)", "http://");
                if (linkUrl !== "http://" && linkUrl) {
                    var linkText = prompt("▥▥ 링크될 글자(단어)를 입력하십시오. (예, '클릭')", "");
                    if (linkText) {
                        o.innerHTML += ("<a href=" + linkUrl + ">" + linkText + "</a>");
                        o.focus();
                    }
                }
                break;

            case styleMode.ADD_SIGN:
                PMain.openBox('Signtext', 0);
                break;
        }
    },

    clearAll: function () {
        // 배경만 초기화
        $mainStyleContents.css('background', '')
        $mainStyleContents.css('background-color', '')
    },

    // 컬러, 패턴, 기호 box
    openBox: function (divId, mode) {
        colorMode = mode;
        var $obj = $('#' + divId)[0];
        if ($obj.opened) {
            $obj.opened = false;
            $obj.style.visibility = 'hidden';
        }
        else {
            $obj.opened = true;
            // $obj.style.pixelTop = $(divId).clientY + document.body.scrollTop - parseInt(scrollTop);
            // $obj.style.pixelLeft = $(divId).clientX + document.body.scrollLeft + parseInt(scrollLeft);
            $obj.style.visibility = 'visible';
        }
    },

    setSign: function (value) {
        DesAreaDocnt.body.innerHTML += value;
        DesAreaDocnt.body.focus();

        Signtext.opened = false;
        Signtext.style.visibility = 'hidden';
    },

    setColor: function (color, action) {
        switch (colorMode) {
            case styleMode.ALL_BG_COLOR:
                // styleBgColor = "background-color:"+color+";";

                //기존 iframe body에 스타일 적용 -> body 하단 메인 div에 적용으로 변경
                $mainStyleContents.css('background-color', color);
                break;
            case styleMode.SELECT_FONT_COLOR:
                PMain.editFont('ForeColor', color);
                break;
            case styleMode.SELECT_FONT_BG_COLOR:
                PMain.editFont('BackColor', color);
                break;
        }
        if (action === mouseMode.CLICK) {
            ColorTableview.opened = false;
            ColorTableview.style.visibility = 'hidden';
        }
    }
};

