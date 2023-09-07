var Main = {
    /** variable */
    initVariable: function() {

    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnSearch': this.search(); break;
        }
    },

    /** init design */
    initDesign: function() {
        HmGrid.create($('#rptGrid'), {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'post',
                    contenttype: 'application/json;charset=utf8;',
                    datafields: [
                        { name: 'seq', type: 'number' },
                        { name: 'name', type: 'string' },
                        { name: 'path', type: 'string' },
                        { name: 'genDate', type: 'string' },
                        { name: 'cycleType', type: 'string' },
                        { name: 'uuid', type: 'string' }
                    ]
                },
                {
                    formatData: function(data) {
                        return JSON.stringify(data);
                    }
                }
            ),
            columns:
            [
                { text: 'SEQ', datafield: 'seq', width: 100 },
                { text: '파일명', datafield: 'name', minwidth: 200 },
                { text: '생성일시', datafield: 'genDate', width: 200, cellsalign: 'center' },
                { text: '다운로드', width: 130, columntype: 'button', cellsrenderer: function() {return '다운로드';}, buttonclick: Main.download }
            ]
        });
    },

    /** init data */
    initData: function() {
        this.search();
    },

    /** 조회 */
    search: function() {
        HmGrid.updateBoundData($('#rptGrid'), ctxPath + '/hi/rpt/monthlyRpt/getMonthlyRptList.do');
    },

    /* 보고서 다운로드 */
    download: function(row) {
        var rowdata = $('#rptGrid').jqxGrid('getrowdata', row);
        if(!confirm('[{0}] 보고서를 다운로드 하시겠습니까?'.substitute(rowdata.name))) return;

        var params = {
            filePath: $('#gAutoGenRptPath').val() + '/' + rowdata.uuid,
            fileName: rowdata.name.replace('.xlsx','')
        };
        // send request
        $('#hForm').empty();
        if(params !== undefined) {
            $.each(params, function(key, value) {
                $('<input />', { type: 'hidden', id: key, name: key, value: value }).appendTo($('#hForm'));
            });
        }
        $('#hForm').attr('action', ctxPath + '/file/ozFileDown.do');
        $('#hForm').attr('method', 'post');
        $('#hForm').attr('target', 'hFrame');
        $('#hForm').submit();

        // 파일 체크 (was 서버에 존재하지 않으면 DB서버로 부터 다운로드)
        // Server.post('/hi/rpt/monthlyRpt/checkRptFile.do', {
        //     data: {uuid: rowdata.uuid},
        //     success: function(result) {
        //
        //     }
        // });
    }

};


$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});