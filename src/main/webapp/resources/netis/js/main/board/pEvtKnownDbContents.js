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


    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {

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

        $.ajax({
            type: "post",
            url: $('#ctxPath').val() + '/main/com/evtDbMgmt/getEvtKnownDbContents.do',
            data: "codeNo=" + $('#codeNo').val(),
            dataType: "json",
            success: function (jsonData) {

                $("#p_evtKind").val(jsonData.resultData.contents.evtKind);
                $("#p_evtDesc").val(jsonData.resultData.contents.evtDesc);
                $("#p_evtAction").val(jsonData.resultData.contents.action);

                // true : 수정 페이지에서만 첨부파일 옆에 삭제버튼 생성
                HmUtil.attachFileList_evt(jsonData.resultData.attachFile, false);

            }
        });


    },

    /** init data */
    initData: function () {

    },

    boardClose: function () {
        self.close();
    }

};