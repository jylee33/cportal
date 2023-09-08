var $dtlTab;
var $slaGrid, $inetGrid;
var editSlaIds = [], editinetIds = [];
var $grpTree;
var comboUnit = "D";

var Main = {


    /** variable */
    initVariable: function () {

        $dtlTab = $("#dtlTab");
        $slaGrid = $('#slaGrid');
        $inetGrid = $("#inetGrid");
        $grpTree = $('#grpTree');
        // this.initCondition();

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
            case 'btnSearch':
                this.searchQcMeasure();
                break;

            case 'btnExcel':
                this.exportExcel();
                break;


        }

    },

    /** init design */
    initDesign: function () {

        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.searchQcMeasure, {devKind1: 'DEV'});

        HmBoxCondition.createRadioDate($('#sSrchPeriod'), HmResource.getResource('cond_period_srch_type'));

        $("input[name='sSrchPeriod']").click(function () {
            if ($("input[name='sSrchPeriod']:checked").val().replace(/[0-9]/ig, '') == "D") {
                $("#sQcDate").show();
                $("#sQcDate2").hide();
            } else {
                $("#sQcDate").hide();
                $("#sQcDate2").show();
            }
        });


        var fromDate = new Date();
        fromDate.setTime(fromDate.getTime() - (1 * 24 * 60 * 60 * 1000));

        $("#sQcDate").jqxDateTimeInput({
            width: 90,
            height: '21px',
            formatString: 'yyyy-MM-dd',
            theme: jqxTheme,
            culture: 'ko-KR',
        });

        $("#sQcDate").jqxDateTimeInput('setDate', fromDate);


        $("#sQcDate2").jqxDateTimeInput({
            width: 90,
            height: '21px',
            formatString: 'yyyy-MM',
            theme: jqxTheme,
            culture: 'ko-KR',
            views: ["", "year"]
        });

        fromDate.setDate(fromDate.getMonth());
        $("#sQcDate2").jqxDateTimeInput('setDate', fromDate);
        $("#sQcDate2").hide();


        $('#mainSplitter').jqxSplitter({
            width: '99.8%',
            height: '99.8%',
            orientation: 'vertical',
            theme: jqxTheme,
            panels: [{size: 254, collapsible: true}, {size: '100%'}]
        });

        $dtlTab.jqxTabs({
            width: '100%', height: '100%', theme: jqxTheme,
            initTabContent: function (tab) {
                switch (tab) {

                    case 0:
                        HmGrid.create($inetGrid, {
                            selectionmode: 'multiplerowsextended',
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                },
                                {
                                    formatData: function (data) {

                                        $.extend(data, Main.getCommParams());

                                        return data;
                                    }
                                },
                                {
                                    loadComplete: function (records) {
                                    }
                                }
                            ),
                            editable: false,
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpNo', editable: false, hidden: true},
                                    {text: '날짜', datafield: 'yyyymmdd', editable: false, width: '20%'},
                                    // {text: '이용기관', datafield: 'grpName', editable: false, width: '20%'},
                                    // {text: '장비명', datafield: 'devName', editable: false, width: '20%'},
                                    {text: 'IP', datafield: 'hostIp', editable: false, width: '20%'},
                                    {
                                        text: '서비스대상',
                                        datafield: 'flag',
                                        cellsalign: 'center',
                                        editable: false,
                                        hidden: true
                                    },
                                    {
                                        text: '설명',
                                        datafield: 'desc',
                                        cellsalign: 'center',
                                        editable: false,
                                        hidden: true
                                    },
                                    {
                                        text: '응답시간 평균(ms)',
                                        datafield: 'respAvg',
                                        cellsalign: 'center',
                                        editable: false,
                                        width: '20%'
                                    },
                                    {
                                        text: '응답시간 최소(ms)',
                                        datafield: 'respMin',
                                        cellsalign: 'center',
                                        hidden: true,
                                        width: '10%'
                                    },
                                    {
                                        text: '응답시간 최대(ms)',
                                        datafield: 'respMax',
                                        cellsalign: 'center',
                                        hidden: true,
                                        width: '10%'
                                    },
                                    {
                                        text: '손실율(%)',
                                        datafield: 'lossRate',
                                        cellsalign: 'center',
                                        width: '20%',
                                        cellsrenderer: function (row, datafield, value, defaultHtml) {
                                            var _class = 'jqx-right-align';
                                            return "<div style='margin-top: 7px; margin-right: 5px' class='" + _class + "'>" + parseFloat(value).toFixed(2).format('0,0.00') + "</div>";
                                        }
                                    },
                                    {
                                        text: '응답 상태',
                                        datafield: 'delayYn',
                                        cellsalign: 'center',
                                        width: '20%',
                                    },
                                ]
                        }, CtxMenu.NONE);
                        break;

                    case 1:
                        HmGrid.create($slaGrid, {
                            selectionmode: 'multiplerowsextended',
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    },
                                },
                                {
                                    loadComplete: function (records) {
                                    }
                                }
                            ),
                            editable: true,
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpNo', editable: false, hidden: true},
                                    {text: '날짜', datafield: 'yyyymmdd', editable: false, width: '20%'},
                                    // {text: '이용기관', datafield: 'grpName', editable: false, width: '20%'},
                                    // {text: '장비명', datafield: 'devName', editable: false, width: '20%'},
                                    {text: 'IP', datafield: 'hostIp', editable: false, width: '20%'},
                                    {
                                        text: '서비스대상',
                                        datafield: 'flag',
                                        cellsalign: 'center',
                                        editable: false,
                                        hidden: true
                                    },
                                    {
                                        text: '설명',
                                        datafield: 'desc',
                                        cellsalign: 'center',
                                        editable: false,
                                        hidden: true
                                    },
                                    {
                                        text: '응답시간 평균(ms)',
                                        datafield: 'respAvg',
                                        cellsalign: 'center',
                                        editable: false,
                                        width: '20%'
                                    },
                                    {
                                        text: '응답시간 최소(ms)',
                                        datafield: 'respMin',
                                        cellsalign: 'center',
                                        hidden: true,
                                        width: '20%'
                                    },
                                    {
                                        text: '응답시간 최대(ms)',
                                        datafield: 'respMax',
                                        cellsalign: 'center',
                                        hidden: true,
                                        width: '20%'
                                    },
                                    {
                                        text: '손실율(%)',
                                        datafield: 'lossRate',
                                        cellsalign: 'center',
                                        width: '20%',
                                        cellsrenderer: function (row, datafield, value, defaultHtml) {
                                            var _class = 'jqx-right-align';
                                            return "<div style='margin-top: 7px; margin-right: 5px' class='" + _class + "'>" + parseFloat(value).toFixed(2).format('0,0.00') + "</div>";
                                        }
                                    },
                                    {
                                        text: '응답 상태',
                                        datafield: 'delayYn',
                                        cellsalign: 'center',
                                        width: '20%',
                                    },
                                ]
                        }, CtxMenu.NONE);
                        break;
                }
            }
        });


    },

    /** init data */
    initData: function () {
    },

    getCommParams: function () {

        var treeItem = HmTreeGrid.getSelectedItem($('#grpTree'));

        var params = null;

        if (treeItem != null) {
            params = {
                grpNo: treeItem.grpNo,
                grpParent: treeItem.grpParent,
                qcKind: $dtlTab.val(),
                qcFlag: 1
            };
        } else {
            params = {
                grpNo: 0,
                grpParent: 0,
                qcKind: 0,
                qcFlag: 1
            };
        }

        $.extend(params, {
            comboUnit: $("input[name='sSrchPeriod']:checked").val().replace(/[0-9]/ig, ''),
            date1: $("input[name='sSrchPeriod']:checked").val().replace(/[0-9]/ig, '') == "D" ? HmDate.getDateStr($('#sQcDate')) : HmDate.getDateStr($('#sQcDate2')),
            time1: HmDate.getTimeStr($('#sQcDate'))
        });

        return params
    },

    /** 조회 */
    searchQcMeasure: function () {

        switch ($dtlTab.val()) {
            case 0:
                HmGrid.updateBoundData($inetGrid, ctxPath + '/main/sla/qcMgmt/getQcMeasureList.do');
                break;
            case 1:
                HmGrid.updateBoundData($slaGrid, ctxPath + '/main/sla/qcMgmt/getQcMeasureList.do');
                break;
        }

    },

    exportExcel: function () {

        HmUtil.exportGrid($dtlTab.val() == 0 ? $inetGrid : $slaGrid, '품질 측정');

    }


};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});