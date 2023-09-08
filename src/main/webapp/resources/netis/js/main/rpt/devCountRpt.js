var $evtCodeGrid, $devKindGrid, $modelGrid;

var Main = {
    /** variable */
    initVariable: function () {
        $evtCodeGrid = $('#evtCodeGrid'), $devKindGrid = $('#devKindGrid'), $modelGrid = $('#modelGrid');
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
            case "btnSearch":
                this.search();
                break;
            case "btnExcel":
                this.exportExcel();
                break;
        }
    },

    /** init design */
    initDesign: function () {
        HmJqxSplitter.createTree($('#mainSplitter'));
        Master.createGrpTab(Main.selectTree);

        HmJqxSplitter.create($('#bSplitter'), HmJqxSplitter.ORIENTATION_V, [{size: '40%'}, {size: '60%'}], 'auto', '100%');

        // 좌측
        HmGrid.create($evtCodeGrid, {
            source: new $.jqx.dataAdapter(
                {datatype: 'json'},
                {
                    formatData: function (data) {
                        $.extend(data, Main.getCommParams());
                        return data;
                    }
                }
            ),
            height: '33%',
            pageable: false,
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '장비 종류 별 통계');
            },
            columns:
                [
                    {text: '종류', datafield: 'devKind2'},
                    {text: '장비수', datafield: 'devCnt', width: 80, cellsalign: 'right', cellsformat: 'n'},
                    // {text: '총 장애시간', datafield: 'errTime', width: 120, cellsrenderer: HmGrid.cTimerenderer}
                ]
        }, CtxMenu.NONE);

        HmGrid.create($devKindGrid, {
            source: new $.jqx.dataAdapter(
                {datatype: 'json'},
                {
                    formatData: function (data) {
                        $.extend(data, Main.getCommParams());
                        return data;
                    }
                }
            ),
            height: '33%',
            pageable: false,
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '장비 벤더 별 수량');
            },
            columns:
                [
                    {text: '종류', datafield: 'vendor'},
                    {text: '장비수', datafield: 'devCnt', width: 80, cellsalign: 'right', cellsformat: 'n'},
                ]
        }, CtxMenu.NONE);


        HmGrid.create($modelGrid, {
            source: new $.jqx.dataAdapter(
                {datatype: 'json'},
                {
                    formatData: function (data) {
                        $.extend(data, Main.getCommParams());
                        return data;
                    }
                }
            ),
            height: '33%',
            pageable: false,
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '장비 모델 별 수량');
            },
            columns:
                [
                    {text: '벤더', datafield: 'vendor'},
                    {text: '모델', datafield: 'model'},
                    {text: '장애수', datafield: 'devCnt', width: 80, cellsalign: 'right', cellsformat: 'n'},
                    // {text: '총 장애시간', datafield: 'errTime', width: 120, cellsrenderer: HmGrid.cTimerenderer}
                ]
        }, CtxMenu.NONE);


    },

    /** init data */
    initData: function () {

    },

    getCommParams: function () {
        var params = Master.getGrpTabParams();
        return params;
    },

    selectTree: function () {
        Main.search();
    },


    /** 조회 */
    search: function () {

        HmGrid.updateBoundData($evtCodeGrid, ctxPath + '/main/rpt/devCountRpt/getStatByDevKind.do');
        HmGrid.updateBoundData($devKindGrid, ctxPath + '/main/rpt/devCountRpt/getStatByVendor.do');
        HmGrid.updateBoundData($modelGrid, ctxPath + '/main/rpt/devCountRpt/getStatByModel.do');

    },


    /** export Excel */
    exportExcel: function () {

        var params = Main.getCommParams();
        HmUtil.exportExcel(ctxPath + '/main/rpt/devCountRpt/export.do', params);

    },


};

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});