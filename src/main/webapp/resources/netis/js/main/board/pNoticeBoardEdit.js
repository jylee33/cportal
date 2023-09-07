var uploadCnt = 0;
var boardNo;
var url;
var ableFileType = ['XLSX', 'XLS', 'GIF','PNG','JPEG','BMP','WEBP', 'DOC', 'PPT', 'PPTX', 'TXT', 'PDF'];

$(function () {
    if ($('#errMsg').val() != '') {
        alert($('#errMsg').val());
        try {
            self.close();
        } catch (e) {
        } finally {
            return;
        }
    }

    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});

var Main = {
    /** variable */
    initVariable: function () {
        /* 메인페이지면 목록보기 버튼 보이게 */
        var url = $(opener.document).find("#parentPage").val();
        var lastIndex = url.lastIndexOf("/");
        url = url.substring(lastIndex + 1, url.length - 4);
        if (url == "main" || url == "tchMain") {
            $("#btnBoardList").css("display", "inline");
        }
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
                location.href = $('#ctxPath').val() + '/main/board/pNoticeBoardContents.do?boardNo=' + boardNo;
                //첨부 파일이 있을 경우 upgradeBoard 에서 창 닫기를 해버리면 파일 저장이 안되는 현상이 발행하여 수정
                window.opener.Main.searchNBoard();
                self.close();
            }
        });

        $('#fileUpload').on('select', function (event) {
            var totallength = event.args.owner._fileRows.length + $('#attachFileList > li').length;
            var fileLength = event.args.owner._fileRows.length;
            // 업로드, 모두 취소 버튼 숨김
            $('#fileUploadUploadButton').hide();
            $('#fileUploadCancelButton').hide();

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



            if (totallength > 2) {
                $('#fileUpload').jqxFileUpload('cancelFile', fileLength - 1);
                alert('첨부파일 최대 개수는 2개 입니다.');
            }
            var fileName = event.args.file;
            var temp = fileName.split(".");
            var accept = temp[temp.length-1].toUpperCase();

            if(ableFileType.indexOf(accept) == -1){
                $('#fileUpload').jqxFileUpload('cancelFile', fileLength-1);
                alert(ableFileType.join(", ") + " 형식의 파일만 첨부할 수 있습니다.");
            }

        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSave':
                this.upgradeBoard();
                break;
            case 'btnBoardList':
                this.boardList();
                break;
            case 'btnClose':
                this.boardClose();
                break;
        }
    },

    /** init design */
    initDesign: function () {
        $('#editor').jqxEditor({height: "315px"});
        $('#fileUpload').jqxFileUpload({width: '100%', height: '100px', fileInputName: 'fileinput'});
        $("#jqxLoader").jqxLoader({text: "", isModal: true, width: 60, height: 36, imagePosition: 'top'});

        $.ajax({
            type: "post",
            url: $('#ctxPath').val() + '/main/oms/noticeBoard/getBoardContents.do',
            data: "boardNo=" + $('#boardNo').val(),
            dataType: "json",
            success: function (jsonData) {
                $('#userName').val(jsonData.resultData.contents.userName);
                $('#fullTimeFormat').val(jsonData.resultData.contents.fullTimeFormat);

                $('#boardTitle').val(jsonData.resultData.contents.boardTitle/*.htmlCharacterUnescapes()*/); // 꺽쇠 표시되도록 변경
                $('.boardContent').val((jsonData.resultData.contents.boardContent || '')/*.htmlCharacterUnescapes()*/); // 꺽쇠 표시되도록 변경
                // true : 수정 페이지에서만 첨부파일 옆에 삭제버튼 생성
                HmUtil.attachFileList(jsonData.resultData.attachFile, true, "fileUpload");

            }
        });

    },

    /** init data */
    initData: function () {
        $('#fileUploadBrowseButton').val("첨부파일 업로드");
    },

    upgradeBoard: function () {

        if (!this.validateForm())
            return;

        $('#jqxLoader').jqxLoader('open');

        var params = {
                boardNo: document.writeForm.boardNo.value,
                boardTitle: $('#boardTitle').val(),
                boardContent: $('#editor').val()
        }; // pNoticeBoardWrite와 같은 방식으로 파라미터를 넘기도록 변경

        Server.post('/main/oms/noticeBoard/editBoard.do', {
            data: params, /* $('#writeForm').serializeObject(), */
                // {
                //     boardNo: document.writeForm.boardNo.value,
                //     boardTitle: document.writeForm.boardTitle.value/*.htmlCharacterEscapes()*/, // 꺽쇠 표시하도록 변경
                //     boardContent: $('.boardContent').val()
                // },
            success: function (result) {

                $('#jqxLoader').jqxLoader('close');
                alert('저장되었습니다.');


                $('#fileUpload').jqxFileUpload({uploadUrl: ctxPath + '/file/upload.do?boardNo=' + result.boardNo});

                if ($('.jqx-file-upload-file-row').length == 0) {
                    location.href = $('#ctxPath').val() + '/main/board/pNoticeBoardContents.do?boardNo=' + result.boardNo;
                    window.opener.Main.searchNBoard();
                    self.close();
                } else {
                    try {
                        $('#fileUpload').jqxFileUpload('uploadAll');
                    } catch (e) {
                        console.log(e);
                    }
                    boardNo = result.boardNo;
                    uploadCnt = $('.jqx-file-upload-file-row').length;
                }
            }
        });
    },

    boardList: function () {
        window.location.href = $('#ctxPath').val() + "/main/board/pNoticeBoardList.do";
    },

    validateForm: function () {
        var text = $('#boardTitle').val().length;
        if (text == 0) {
            alert("제목을 입력해주세요.");
            $("#boardTitle").focus();
            return false;
        } else if (text > 100) {
            alert("제목을 100자 이내로 입력해주세요.");
            $("#boardTitle").focus();
            return false;
        }
        text = $('#editor').val();
        if (text == '<br>' || text == '' || text == null) {
            alert("내용을 입력해주세요.");
            $('#editor').focus();
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