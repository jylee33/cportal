var $slmStatGrid;

var Main = {

    /** variable */
    initVariable: function () {
        $slmStatGrid = $('#slmStatGrid');
    },

    /** add event */
    observe: function () {

        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });

        $('.searchBox input:text').bind('keyup', function (event) {
            Main.keyupEventControl(event);
        });

    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch':
                this.search();
                break;

            case 'btnExcel':
                this.exportExcel();
                break;
        }
    },

    /** init design */
    initDesign: function () {


        $('#sDate1').jqxDateTimeInput({
            width: 120,
            height: 21,
            theme: jqxTheme,
            // formatString: 'yyyy-MM-dd',
            formatString: 'yyyy',
            culture: 'ko-KR',
            views: ['year', 'decade']
        });

        $('#sDate1').val(new Date());


        HmGrid.create($slmStatGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'post',
                    contenttype: 'application/json;charset=utf8;',
                },
                {
                    formatData: function (data) {
                        $.extend(data, {
                            yyyy: HmDate.getDateStr($("#sDate1"), 'yyyy')
                        });
                        data.filterGroups = [];
                        return JSON.stringify(data);
                    }
                }
            ),
            selectionmode: 'multiplerowsextended',
            columns: [
                {text: '월', datafield: 'month', width: '15%', cellsalign: 'center'},
                {text: '일', datafield: 'days', width: '15%', cellsalign: 'center'},
                {text: '장애 시간', datafield: 'errTime', width: '20%', cellsalign: 'center', cellsrenderer: HmGrid.cTimerenderer, filtertype: 'number'},
                {text: '장애 건수', datafield: 'cnt', width: '10%', cellsalign: 'center'},
                {text: '시스템 수', datafield: 'devCnt', width: '10%', cellsalign: 'center'},
                {text: '평균시스템 운용시간', datafield: 'avgOperateTime', width: '10%', cellsalign: 'center', cellsrenderer: HmGrid.cTimerenderer, filtertype: 'number'},
                {text: '평균 장애 시간', datafield: 'avgErrTime', width: '10%', cellsalign: 'center', cellsrenderer: HmGrid.cTimerenderer, filtertype: 'number'},
                {text: '가용성(%)', datafield: 'useRate', minwidth: '10%', cellsalign: 'center'}
            ]
        }, CtxMenu.COMM);

    },

    /** init data */
    initData: function () {
        this.search();
    },

    /* ==========================================================
        버튼 이벤트
     ===========================================================*/
    search: function () {
        HmGrid.updateBoundData($slmStatGrid, ctxPath + '/main/nms/slmMgmt/getOperUseRate.do');
    },


    exportExcel: function () {

        HmUtil.exportGrid($slmStatGrid, "SLM 가용률 현황", true)

    },


}
$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});