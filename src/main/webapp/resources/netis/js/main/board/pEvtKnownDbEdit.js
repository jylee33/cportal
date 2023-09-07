var uploadCnt = 0;
var codeNo;
var url;
var ableFileType = ['XLSX', 'XLS', 'GIF', 'PNG', 'JPEG', 'BMP', 'WEBP', 'DOC', 'PPT', 'PPTX', 'TXT', 'PDF'];

$(function () {
    Main.initVariable();
    Main.initDesign();
    Main.observe();
    Main.initData();
});

var Main = {

    /** variable */
    initVariable: function () {
        /* 부모창이 메인페이지면 목록보기 버튼 보이게 */
    },

    /** add event */
    observe: function () {

        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });


        $('img').bind('click', function (event) {
            Main.eventControl(event);
        });


        $('#fileUpload').on('uploadEnd', function (event) {
            if (--uploadCnt == 0) {
                // location.href = $('#ctxPath').val() + '/main/com/evtDbMgmt/getEvtKnownDbContents.do?codeNo=' + $("#codeNo").val();
                // //첨부 파일이 있을 경우 upgradeBoard 에서 창 닫기를 해버리면 파일 저장이 안되는 현상이 발행하여 수정
                // window.opener.Main.searchNBoard();
                self.close();
            }
        });


        $('#fileUpload').on('select', function (event) {

            var fileLength = event.args.owner._fileRows.length;
            // 업로드, 모두 취소 버튼 숨김
            $('#fileUploadUploadButton').hide();
            $('#fileUploadCancelButton').hide();

            if ($('.jqx-file-upload-file-input')[fileLength - 1].files[0].size > $('#uploadFileLength').val()) {
                alert($('#uploadFileLength').val() + "Byte로 용량이 제한되어있습니다.");
                $('#fileUpload').jqxFileUpload('cancelFile', fileLength - 1);
                return;
            }

            if (fileLength > 2) {
                $('#fileUpload').jqxFileUpload('cancelFile', fileLength - 1);
                alert('첨부파일 최대 개수는 2개 입니다.');
                return;
            }

            var fileName = event.args.file;
            var temp = fileName.split(".");
            var accept = temp[temp.length - 1].toUpperCase();

            if (ableFileType.indexOf(accept) == -1) {
                $('#fileUpload').jqxFileUpload('cancelFile', fileLength - 1);
                alert(ableFileType.join(", ") + " 형식의 파일만 첨부할 수 있습니다.");
            }
        });

    },

    /** event handler */
    eventControl: function (event) {

        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSave':
                this.saveContents();
                break;
            case 'btnClose':
                this.boardClose();
                break;
        }
    },

    /** init design */
    initDesign: function () {

        Server.get('/code/getCodeListByCodeKind.do', {
            data: {codeKind: 'EVT_TYPE'},
            success: function (result) {
                $("#p_evtKind").jqxDropDownList({
                    width: '145px',
                    selectedIndex: 0, theme: jqxTheme,
                    source: result, autoDropDownHeight: true,
                    displayMember: 'codeValue1', valueMember: 'codeId'
                });
            }
        });

        $('#fileUpload').jqxFileUpload({
            width: '100%',
            height: '100px',
            fileInputName: 'fileinput',
            accept: '.xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf'
        });

        $("#jqxLoader").jqxLoader({text: "", isModal: true, width: 60, height: 36, imagePosition: 'top'});


        $.ajax({
            type: "post",
            url: $('#ctxPath').val() + '/main/com/evtDbMgmt/getEvtKnownDbContents.do',
            data: "codeNo=" + $('#codeNo').val(),
            dataType: "json",
            success: function (jsonData) {

                var item = $("#p_evtKind").jqxDropDownList('getItems');
                console.log(item);

                item.forEach(function (value) {
                    if (value.originalItem.codeValue1 == jsonData.resultData.contents.evtKind) {
                        $("#p_evtKind").jqxDropDownList('val', value.originalItem.codeId);
                    }
                });


                $("#p_evtDesc").val(jsonData.resultData.contents.evtDesc);
                $("#p_evtAction").val(jsonData.resultData.contents.action);

                // true : 수정 페이지에서만 첨부파일 옆에 삭제버튼 생성
                HmUtil.attachFileList_evt(jsonData.resultData.attachFile, true, "fileUpload");

            }
        });


    },

    /** init data */
    initData: function () {

        $('#fileUploadBrowseButton').val("첨부파일");
        $('.boardContent').val("");

    },

    saveContents: function () {

        if (!this.validateForm())
            return;

        $('#jqxLoader').jqxLoader('open');

        var params = {
            evtKind: $('#p_evtKind').jqxDropDownList('getSelectedItem').label,
            evtDesc: $('#p_evtDesc').val(),
            action: $("#p_evtAction").val(),
            codeNo: $("#codeNo").val()
        };

        Server.post('/main/com/evtDbMgmt/saveEvtDb.do', {
            data: params, success: function (result) {
                $('#jqxLoader').jqxLoader('close');
                alert('저장되었습니다.');
                $('#fileUpload').jqxFileUpload({uploadUrl: ctxPath + '/main/com/evtDbMgmt/upload.do?codeNo=' + $("#codeNo").val()});
                if ($('.jqx-file-upload-file-row').length == 0) {
                } else {
                    try {
                        $('#fileUpload').jqxFileUpload('uploadAll');
                    } catch (e) {
                        console.log(e);
                    }
                    codeNo = result;
                    uploadCnt = $('.jqx-file-upload-file-row').length;
                }
                window.opener.Main.searchAction();
                self.close();

            }
        });


    },

    validateForm: function () {

        var text = $('#p_evtDesc').val().length;
        if (text == 0) {
            alert("장애 설명을 입력해 주세요.");
            $("#p_evtDesc").focus();
            return false;
        }
        text = $('#p_evtAction').val();

        if (text == '<br>' || text == '' || text == null) {
            alert("조치 방법을 입력해주세요.");
            $('#p_evtAction').focus();
            return false;
        } else if (text.length > 40000) {
            alert("내용을 40000자 이내로 입력해주세요.");
            return false;
        }
        return true;
    },

    boardClose: function () {
        self.close();
    }

};