var $ftpFileUploadGrid;

var Main = {
    /** variable */
    initVariable: function () {
        $ftpFileUploadGrid = $('#ftpFileUploadGrid');
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnUpload':
                this.fileUpload();
                break;
            case 'btnSearch':
                this.search();
                break;
            case 'btnSet':
                this.setCode();
                break;
        }
    },

    /** init design */
    initDesign: function () {

        HmWindow.create($('#pwindow'), 100, 100);
        HmGrid.create($ftpFileUploadGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                }
            ),
            editable: false,
            columns:
                [
                    {text: '파일명', datafield: 'fileName', minwidth: 300},
                    {text: '파일경로', datafield: 'fileDir', minwidth: 300, hidden: true},
                    { text: '다운로드', width: 130, columntype: 'button', cellsrenderer: function() {return '다운로드';}, buttonclick: Main.download }
                    // {text: '업로드 경로', datafield: 'ftpDir', minwidth: 300},
                    // {text: '등록자 ID', datafield: 'regUserId', width: 300, hidden: true},
                    // {text: '등록자', datafield: 'regUserName', width: 200},
                    // {text: '등록일시', datafield: 'regDate', displayfield: 'disRegDate', cellsalign:'center', width: 160}
                ]
        }, CtxMenu.COMM);

    },

    /* 보고서 다운로드 */
    download: function(row) {
        var rowdata = $ftpFileUploadGrid.jqxGrid('getrowdata', row);
        if(!confirm('[{0}] 파일을 다운로드 하시겠습니까?'.substitute(rowdata.fileName))) return;

        var params = {
            filePath: rowdata.fileDir,
            fileName: rowdata.fileName
        };
        // send request
        $('#hForm').empty();
        if(params !== undefined) {
            $.each(params, function(key, value) {
                $('<input />', { type: 'hidden', id: key, name: key, value: value }).appendTo($('#hForm'));
            });
        }
        $('#hForm').attr('action', ctxPath + '/main/com/ftpFileUpload/download.do');
        $('#hForm').attr('method', 'post');
        $('#hForm').attr('target', 'hFrame');
        $('#hForm').submit();

    },
    /** init data */
    initData: function () {
        Main.search();
    },
    search: function() {
        HmGrid.updateBoundData($ftpFileUploadGrid, ctxPath + '/main/com/ftpFileUpload/getUploadList.do');
    },

    fileUpload: function() {
        var params = {};

        $.post(ctxPath + '/main/popup/com/pFtpFileUpload.do',
                function(result) {
                    HmWindow.open($('#pwindow'), 'ftp Upload', result, 350, 230, 'pwindow_init', params);
                }
			);
		}
}



$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});