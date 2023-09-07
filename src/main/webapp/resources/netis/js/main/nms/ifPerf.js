var TAB = {
    TOP_N: 0,
    BPS: 1,
    BPS_PER: 2,
    PPS: 3,
    CRC: 4,
    ERROR: 5,
    COLLISION: 6,
    UCAST: 7,
    DCARD: 8,
    MCAST: 9,
    BCAST: 10
};
var $ifBpsPerGrid, $ifBpsGrid, $ifPpsGrid, $ifCrcGrid, $ifErrorGrid, $ifCollisionGrid;
var $ifUcastGrid, $ifDcardGrid, $ifMcastGrid, $ifBcastGrid;
var $ifBpsPerChart, $ifBpsChart, $ifPpsChart, $ifCrcChart, $ifErrorChart, $ifCollisionChart,
    $ifUcastChart, $ifDcardChart, $ifMcastChart, $ifBcastChart;
var rowID = -1, timer = null;
var tabInit = [false, false, false, false, false, false, false, false, false, false, false];
var isIfGrpInit = false;

var Main = {
    /** variable */
    initVariable: function () {
        $ifBpsPerGrid = $('#ifBpsPerGrid'), $ifBpsGrid = $('#ifBpsGrid'), $ifPpsGrid = $('#ifPpsGrid');
        $ifCrcGrid = $('#ifCrcGrid'), $ifErrorGrid = $('#ifErrorGrid'), $ifCollisionGrid = $('#ifCollisionGrid');
        $ifUcastGrid = $('#ifUcastGrid'), $ifDcardGrid = $('#ifDcardGrid'), $ifMcastGrid = $('#ifMcastGrid'), $ifBcastGrid = $('#ifBcastGrid');
        $ifBpsPerChart = $('#ifBpsPerChart'), $ifBpsChart = $('#ifBpsChart'), $ifPpsChart = $('#ifPpsChart'), $ifCrcChart = $('#ifCrcChart');
        $ifErrorChart = $('#ifErrorChart'), $ifCollisionChart = $('#ifCollisionChart'), $ifUcastChart = $('#ifUcastChart'), $ifDcardChart = $('#ifDcardChart');
        $ifMcastChart = $('#ifMcastChart'), $ifBcastChart = $('#ifBcastChart');
        this.initCondition();
    },

    initCondition: function () {
        // 기간
        HmBoxCondition.createPeriod('', Main.search, timer);
        // radio 조건
        HmBoxCondition.createRadio($('#sSortType'), HmResource.getResource('cond_perf_val'));
        HmBoxCondition.createRadio($('#sTopN'), HmResource.getResource('cond_topn_cnt'));

        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
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
            case 'btnExceptSearch':
                this.exceptSearch();
                break;
            case 'btnSearch':
                this.search();
                break;
            case 'btnExcel':
                this.exportExcel();
                break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
            Main.search();
        }
    },


    /** init design */
    initDesign: function () {

        HmJqxSplitter.createTree($('#mainSplitter'));

        $('#mainTab').jqxTabs({
            width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function (tab) {
                tabInit[tab] = true;
                switch (tab) {
                    case TAB.TOP_N:
                        HmGrid.create($('#inbpsperGrid'), {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            height: 220,
                            autoheight: true,
                            showtoolbar: true,
                            scrollbarsize: -1,
                            rendertoolbar: function (toolbar) {
                                Main.topNToolbarRenderer(toolbar, 'IN BPS(%)', 'Inbpsper', true);
                            },
                            pageable: false,
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 130},
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '회선별칭', datafield: 'ifAlias', width: 130},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 80,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'BPS(%)',
                                        datafield: 'topVal',
                                        width: 80,
                                        cellsalign: 'right',
                                        cellsrenderer: HmGrid.progressbarrenderer
                                    },
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ]
                        }, CtxMenu.IF, '31');
                        HmGrid.create($('#outbpsperGrid'), {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            height: 220,
                            autoheight: true,
                            showtoolbar: true,
                            scrollbarsize: -1,
                            rendertoolbar: function (toolbar) {
                                Main.topNToolbarRenderer(toolbar, 'OUT BPS(%)', 'Outbpsper', true);
                            },
                            pageable: false,
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 130},
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '회선별칭', datafield: 'ifAlias', width: 130},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 80,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'BPS(%)',
                                        datafield: 'topVal',
                                        width: 80,
                                        cellsalign: 'right',
                                        cellsrenderer: HmGrid.progressbarrenderer
                                    },
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ]
                        }, CtxMenu.IF, '32');
                        HmGrid.create($('#inbpsGrid'), {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            height: 220,
                            autoheight: true,
                            showtoolbar: true,
                            scrollbarsize: -1,
                            rendertoolbar: function (toolbar) {
                                Main.topNToolbarRenderer(toolbar, 'IN BPS', 'Inbps', true);
                            },
                            pageable: false,
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 130},
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '회선별칭', datafield: 'ifAlias', width: 130},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 80,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'BPS',
                                        datafield: 'topVal',
                                        width: 80,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ]
                        }, CtxMenu.IF, '1');
                        HmGrid.create($('#outbpsGrid'), {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            height: 220,
                            autoheight: true,
                            showtoolbar: true,
                            scrollbarsize: -1,
                            rendertoolbar: function (toolbar) {
                                Main.topNToolbarRenderer(toolbar, 'OUT BPS', 'Outbps', true);
                            },
                            pageable: false,
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 130},
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '회선별칭', datafield: 'ifAlias', width: 130},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 80,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'BPS',
                                        datafield: 'topVal',
                                        width: 80,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ]
                        }, CtxMenu.IF, '2');
                        HmGrid.create($('#inppsGrid'), {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            height: 220,
                            autoheight: true,
                            showtoolbar: true,
                            scrollbarsize: -1,
                            rendertoolbar: function (toolbar) {
                                Main.topNToolbarRenderer(toolbar, 'IN PPS', 'Inpps', true);
                            },
                            pageable: false,
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 130},
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '회선별칭', datafield: 'ifAlias', width: 130},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 80,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'PPS',
                                        datafield: 'topVal',
                                        width: 80,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ]
                        }, CtxMenu.IF, '3');
                        HmGrid.create($('#outppsGrid'), {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            height: 220,
                            autoheight: true,
                            showtoolbar: true,
                            scrollbarsize: -1,
                            rendertoolbar: function (toolbar) {
                                Main.topNToolbarRenderer(toolbar, 'OUT PPS', 'Outpps', true);
                            },
                            pageable: false,
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 130},
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '회선별칭', datafield: 'ifAlias', width: 130},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 80,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'PPS',
                                        datafield: 'topVal',
                                        width: 80,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ]
                        }, CtxMenu.IF, '4');
                        HmGrid.create($('#inerrGrid'), {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            height: 220,
                            autoheight: true,
                            showtoolbar: true,
                            scrollbarsize: -1,
                            rendertoolbar: function (toolbar) {
                                Main.topNToolbarRenderer(toolbar, 'IN ERROR', 'Inerr');
                            },
                            pageable: false,
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 130},
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '회선별칭', datafield: 'ifAlias', width: 130},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 80,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {text: 'ERR', datafield: 'topVal', width: 80, cellsalign: 'right'},
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ]
                        }, CtxMenu.IF, '5');
                        HmGrid.create($('#outerrGrid'), {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            height: 220,
                            autoheight: true,
                            showtoolbar: true,
                            scrollbarsize: -1,
                            rendertoolbar: function (toolbar) {
                                Main.topNToolbarRenderer(toolbar, 'OUT ERROR', 'Outerr');
                            },
                            pageable: false,
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 130},
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '회선별칭', datafield: 'ifAlias', width: 130},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 80,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {text: 'ERR', datafield: 'topVal', width: 80, cellsalign: 'right'},
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ]
                        }, CtxMenu.IF, '6');
                        HmGrid.create($('#crcGrid'), {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            height: 220,
                            autoheight: true,
                            showtoolbar: true,
                            scrollbarsize: -1,
                            rendertoolbar: function (toolbar) {
                                Main.topNToolbarRenderer(toolbar, 'CRC', 'Crc');
                            },
                            pageable: false,
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 130},
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '회선별칭', datafield: 'ifAlias', width: 130},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 80,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {text: 'CRC', datafield: 'topVal', width: 80, cellsalign: 'right'},
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ]
                        }, CtxMenu.IF, '7');
                        HmGrid.create($('#collisionGrid'), {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            height: 220,
                            autoheight: true,
                            showtoolbar: true,
                            scrollbarsize: -1,
                            rendertoolbar: function (toolbar) {
                                Main.topNToolbarRenderer(toolbar, 'COLLISION', 'Collision');
                            },
                            pageable: false,
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 130},
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '회선별칭', datafield: 'ifAlias', width: 130},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 80,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {text: 'COLLISION', datafield: 'topVal', width: 80, cellsalign: 'right'},
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ]
                        }, CtxMenu.IF, '8');

                        $('#ckAll').jqxCheckBox()
                            .on('change', function (event) {
                                var ischecked = event.args.checked;
                                try {
                                    $('#ckInbpsper, #ckOutbpsper, #ckInbps, #ckOutbps, #ckInpps, #ckOutpps').jqxCheckBox({checked: ischecked});
                                    if ($('#ckInerr') !== undefined) $('#ckInerr').jqxCheckBox({checked: ischecked});
                                    if ($('#ckOuterr') !== undefined) $('#ckOuterr').jqxCheckBox({checked: ischecked});
                                    if ($('#ckCrc') !== undefined) $('#ckCrc').jqxCheckBox({checked: ischecked});
                                    if ($('#ckCollision') !== undefined) $('#ckCollision').jqxCheckBox({checked: ischecked});
//									if($('#ckInnu') !== undefined) $('#ckInnu').jqxCheckBox({ checked: ischecked });
//									if($('#ckOutnu') !== undefined) $('#ckOutnu').jqxCheckBox({ checked: ischecked });
//									if($('#ckIndcard') !== undefined) $('#ckIndcard').jqxCheckBox({ checked: ischecked });
//									if($('#ckOutdcard') !== undefined) $('#ckOutdcard').jqxCheckBox({ checked: ischecked });
//									if($('#ckInmcast') !== undefined) $('#ckInmcast').jqxCheckBox({ checked: ischecked });
//									if($('#ckOutmcast') !== undefined) $('#ckOutmcast').jqxCheckBox({ checked: ischecked });
//									if($('#ckInbcast') !== undefined) $('#ckInbcast').jqxCheckBox({ checked: ischecked });
//									if($('#ckOutbcast') !== undefined) $('#ckOutbcast').jqxCheckBox({ checked: ischecked });
                                } catch (e) {
                                }
                            });
                        break;
                    case TAB.BPS_PER:
                        HmJqxSplitter.create($('#bpsPerSplitter'), HmJqxSplitter.ORIENTATION_H, [{
                            size: '50%',
                            collapsible: false
                        }, {size: '50%'}], '100%', '100%');
                        HmGrid.create($ifBpsPerGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            columns:
                                [
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        width: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '장비IP', datafield: 'devIp', width: 120},
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '별칭', datafield: 'ifAlias', width: 120},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 120,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {text: '상태', datafield: 'status', width: 120},
                                    {
                                        text: 'In',
                                        columngroup: 'cur',
                                        datafield: 'curInbpsPer',
                                        width: 100,
                                        cellsrenderer: HmGrid.progressbarrenderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'cur',
                                        datafield: 'curOutbpsPer',
                                        width: 100,
                                        cellsrenderer: HmGrid.progressbarrenderer
                                    },
                                    {
                                        text: 'In',
                                        columngroup: 'avg',
                                        datafield: 'avgInbpsPer',
                                        width: 100,
                                        cellsrenderer: HmGrid.progressbarrenderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'avg',
                                        datafield: 'avgOutbpsPer',
                                        width: 100,
                                        cellsrenderer: HmGrid.progressbarrenderer
                                    },
                                    // { text: 'In', columngroup: 'min', datafield: 'minInbpsPer',  width: 100 },
                                    // { text: 'Out', columngroup: 'min', datafield: 'minOutbpsPer', width: 100 },
                                    {
                                        text: 'In',
                                        columngroup: 'max',
                                        datafield: 'maxInbpsPer',
                                        width: 100,
                                        cellsrenderer: HmGrid.progressbarrenderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'max',
                                        datafield: 'maxOutbpsPer',
                                        width: 100,
                                        cellsrenderer: HmGrid.progressbarrenderer
                                    },
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ],
                            columngroups:
                                [
                                    {text: '평균', align: 'center', name: 'avg'},
                                    {text: '최소', align: 'center', name: 'min'},
                                    {text: '최대', align: 'center', name: 'max'},
                                    {text: '현재', align: 'center', name: 'cur'}
                                ],
                            ready: function () {
                                //Main.search();
                            }
                        }, CtxMenu.IF, '26');

                        $ifBpsPerGrid.on('rowselect', function (event) {
                            var row = event.args.row;
                            var rowindex = event.args.rowindex;
                            rowID = $ifBpsPerGrid.jqxGrid('getrowid', rowindex);
                            Main.searchChart($ifBpsPerChart, row.mngNo, row.ifIdx);
                        }).on('bindingcomplete', function (event) {
                            var row = $ifBpsPerGrid.jqxGrid("getrows").length;
                            if (row > 0) rowID = 0;
                            if (rowID == -1) return;
                            var rowindex = $ifBpsPerGrid.jqxGrid("getrowboundindexbyid", rowID);
                            $ifBpsPerGrid.jqxGrid("selectrow", rowindex);
                        });

                        Main.createDefaultHighChart('ifBpsPerChart', IfPerfType.BPSPER);
                        //
                        // $ifBpsPerChart.on('click', function(event) {
                        // 	if(event.args) {
                        // 		var dataItem = $(this).jqxChart('source')[event.args.elementIndex];
                        // 		if(dataItem == null) return;
                        // 		Main.showTrafficData(dataItem);
                        // 	}
                        // });
                        break;
                    case TAB.BPS:
                        HmJqxSplitter.create($('#bpsSplitter'), HmJqxSplitter.ORIENTATION_H, [{
                            size: '50%',
                            collapsible: false
                        }, {size: '50%'}], '100%', '100%');
                        HmGrid.create($ifBpsGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                    /*,id: 'mngNo'*/
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            pagerheight: 27,
                            pagerrenderer: HmGrid.pagerrenderer,
                            columns:
                                [
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        width: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '장비IP', datafield: 'devIp', width: 120},
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '별칭', datafield: 'ifAlias', width: 120},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 120,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {text: '상태', datafield: 'status', width: 120},
                                    {
                                        text: 'In',
                                        columngroup: 'cur',
                                        datafield: 'curInbps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'cur',
                                        datafield: 'curOutbps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'In',
                                        columngroup: 'avg',
                                        datafield: 'avgInbps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'avg',
                                        datafield: 'avgOutbps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Sum',
                                        columngroup: 'avg',
                                        datafield: 'avgBps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer,
                                        hidden: true
                                    },
                                    // { text: 'In', columngroup: 'min', datafield: 'minInbps',  width: 100, cellsrenderer: HmGrid.unit1000renderer },
                                    // { text: 'Out', columngroup: 'min', datafield: 'minOutbps', width: 100, cellsrenderer: HmGrid.unit1000renderer },
                                    {
                                        text: 'In',
                                        columngroup: 'max',
                                        datafield: 'maxInbps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'max',
                                        datafield: 'maxOutbps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Sum',
                                        columngroup: 'max',
                                        datafield: 'maxBps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer,
                                        hidden: true
                                    },
                                    {
                                        text: 'Bps(%)',
                                        datafield: 'bpsPer',
                                        width: 100,
                                        cellsalign: 'right',
                                        hidden: true
                                    },
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ],
                            columngroups:
                                [
                                    {text: '평균', align: 'center', name: 'avg'},
                                    {text: '최소', align: 'center', name: 'min'},
                                    {text: '최대', align: 'center', name: 'max'},
                                    {text: '현재', align: 'center', name: 'cur'}
                                ],
                            ready: function () {
//				    	 		HmGrid.updateBoundData($ifBpsGrid, ctxPath + '/main/nms/ifPerf/getIfPerfBpsList.do');
                            }
                        }, CtxMenu.IF, '17');
                        $ifBpsGrid.on('rowselect', function (event) {
                            var row = event.args.row;
                            var rowindex = event.args.rowindex;
                            rowID = $ifBpsGrid.jqxGrid('getrowid', rowindex);
                            Main.searchChart($ifBpsChart, row.mngNo, row.ifIdx);
                        }).on('bindingcomplete', function (event) {
                            var row = $ifBpsGrid.jqxGrid("getrows").length;
                            if (row > 0) rowID = 0;
                            if (rowID == -1) return;
                            var rowindex = $ifBpsGrid.jqxGrid("getrowboundindexbyid", rowID);
                            $ifBpsGrid.jqxGrid("selectrow", rowindex);
                        });

                        Main.createDefaultHighChart('ifBpsChart', IfPerfType.BPS);


                        // $ifBpsChart.on('click', function(event) {
                        // 	if(event.args) {
                        // 		var dataItem = $(this).jqxChart('source')[event.args.elementIndex];
                        // 		if(dataItem == null) return;
                        // 		Main.showTrafficData(dataItem);
                        // 	}
                        // });

                        break;
                    case TAB.PPS:
                        HmJqxSplitter.create($('#ppsSplitter'), HmJqxSplitter.ORIENTATION_H, [{
                            size: '50%',
                            collapsible: false
                        }, {size: '50%'}], '100%', '100%');
                        HmGrid.create($ifPpsGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            columns:
                                [
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        width: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '장비IP', datafield: 'devIp', width: 120},
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '별칭', datafield: 'ifAlias', width: 120},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 120,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {text: '상태', datafield: 'status', width: 120},
                                    {
                                        text: 'In',
                                        columngroup: 'cur',
                                        datafield: 'curInpps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'cur',
                                        datafield: 'curOutpps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'In',
                                        columngroup: 'avg',
                                        datafield: 'avgInpps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'avg',
                                        datafield: 'avgOutpps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Sum',
                                        columngroup: 'avg',
                                        datafield: 'avgPps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer,
                                        hidden: true
                                    },
                                    // { text: 'In', columngroup: 'min', datafield: 'minInpps',  width: 100, cellsrenderer: HmGrid.unit1000renderer },
                                    // { text: 'Out', columngroup: 'min', datafield: 'minOutpps', width: 100, cellsrenderer: HmGrid.unit1000renderer },
                                    {
                                        text: 'In',
                                        columngroup: 'max',
                                        datafield: 'maxInpps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'max',
                                        datafield: 'maxOutpps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Sum',
                                        columngroup: 'max',
                                        datafield: 'maxPps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer,
                                        hidden: true
                                    },
                                    {
                                        text: 'Pps(%)',
                                        datafield: 'ppsPer',
                                        width: 100,
                                        cellsalign: 'right',
                                        hidden: true
                                    },
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ],
                            columngroups:
                                [
                                    {text: '평균', align: 'center', name: 'avg'},
                                    {text: '최소', align: 'center', name: 'min'},
                                    {text: '최대', align: 'center', name: 'max'},
                                    {text: '현재', align: 'center', name: 'cur'}
                                ],
                            ready: function () {
                                //Main.search();
                            }
                        }, CtxMenu.IF, '18');
                        $ifPpsGrid.on('rowselect', function (event) {
                            var row = event.args.row;
                            var rowindex = event.args.rowindex;
                            rowID = $ifPpsGrid.jqxGrid('getrowid', rowindex);
                            Main.searchChart($ifPpsChart, row.mngNo, row.ifIdx);
                        }).on('bindingcomplete', function (event) {
                            var row = $ifPpsGrid.jqxGrid("getrows").length;
                            if (row > 0) rowID = 0;
                            if (rowID == -1) return;
                            var rowindex = $ifPpsGrid.jqxGrid("getrowboundindexbyid", rowID);
                            $ifPpsGrid.jqxGrid("selectrow", rowindex);
                        });

                        Main.createDefaultHighChart('ifPpsChart', IfPerfType.PPS);
                        break;
                    case TAB.CRC:
                        HmJqxSplitter.create($('#crcSplitter'), HmJqxSplitter.ORIENTATION_H, [{
                            size: '50%',
                            collapsible: false
                        }, {size: '50%'}], '100%', '100%');
                        HmGrid.create($ifCrcGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            pagerheight: 27,
                            pagerrenderer: HmGrid.pagerrenderer,
                            columns:
                                [
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        width: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '장비IP', datafield: 'devIp', width: 120},
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '별칭', datafield: 'ifAlias', width: 120},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 120,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {text: '상태', datafield: 'status', width: 120},
                                    {
                                        text: '현재',
                                        columngroup: 'crc',
                                        datafield: 'curCrc',
                                        width: 100,
                                        cellsalign: 'right'
                                    },
                                    {
                                        text: '평균',
                                        columngroup: 'crc',
                                        datafield: 'avgCrc',
                                        width: 100,
                                        cellsalign: 'right'
                                    },
                                    // { text: '최소', columngroup: 'crc', datafield: 'minCrc', width: 100, cellsalign: 'right' },
                                    {
                                        text: '최대',
                                        columngroup: 'crc',
                                        datafield: 'maxCrc',
                                        width: 100,
                                        cellsalign: 'right'
                                    },
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ],
                            columngroups:
                                [
                                    {text: 'CRC', align: 'center', name: 'crc'}
                                ],
                            ready: function () {
                                //Main.search();
                            }
                        }, CtxMenu.IF, '19');
                        $ifCrcGrid.on('rowselect', function (event) {
                            var row = event.args.row;
                            var rowindex = event.args.rowindex;
                            rowID = $ifCrcGrid.jqxGrid('getrowid', rowindex);
                            Main.searchChart($ifCrcChart, row.mngNo, row.ifIdx);
                        }).on('bindingcomplete', function (event) {
                            var row = $ifCrcGrid.jqxGrid("getrows").length;
                            if (row > 0) rowID = 0;
                            if (rowID == -1) return;
                            var rowindex = $ifCrcGrid.jqxGrid("getrowboundindexbyid", rowID);
                            $ifCrcGrid.jqxGrid("selectrow", rowindex);
                        });

                        Main.createDefaultHighChart('ifCrcChart', IfPerfType.CRC);
                        break;
                    case TAB.ERROR:
                        HmJqxSplitter.create($('#errorSplitter'), HmJqxSplitter.ORIENTATION_H, [{
                            size: '50%',
                            collapsible: false
                        }, {size: '50%'}], '100%', '100%');
                        HmGrid.create($ifErrorGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            columns:
                                [
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        width: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '장비IP', datafield: 'devIp', width: 120},
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '별칭', datafield: 'ifAlias', width: 120},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 120,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {text: '상태', datafield: 'status', width: 120},
                                    {
                                        text: 'In',
                                        columngroup: 'cur',
                                        datafield: 'curInerr',
                                        width: 100,
                                        cellsalign: 'right'
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'cur',
                                        datafield: 'curOuterr',
                                        width: 100,
                                        cellsalign: 'right'
                                    },
                                    {
                                        text: 'In',
                                        columngroup: 'avg',
                                        datafield: 'avgInerr',
                                        width: 100,
                                        cellsalign: 'right'
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'avg',
                                        datafield: 'avgOuterr',
                                        width: 100,
                                        cellsalign: 'right'
                                    },
                                    {
                                        text: 'Sum',
                                        columngroup: 'avg',
                                        datafield: 'avgErr',
                                        width: 100,
                                        cellsalign: 'right',
                                        hidden: true
                                    },
                                    // { text: 'In', columngroup: 'min', datafield: 'minInerr',  width: 100, cellsalign: 'right' },
                                    // { text: 'Out', columngroup: 'min', datafield: 'minOuterr', width: 100, cellsalign: 'right' },
                                    {
                                        text: 'In',
                                        columngroup: 'max',
                                        datafield: 'maxInerr',
                                        width: 100,
                                        cellsalign: 'right'
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'max',
                                        datafield: 'maxOuterr',
                                        width: 100,
                                        cellsalign: 'right'
                                    },
                                    {
                                        text: 'Sum',
                                        columngroup: 'max',
                                        datafield: 'maxErr',
                                        width: 100,
                                        cellsalign: 'right',
                                        hidden: true
                                    },
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ],
                            columngroups:
                                [
                                    {text: '평균', align: 'center', name: 'avg'},
                                    {text: '최소', align: 'center', name: 'min'},
                                    {text: '최대', align: 'center', name: 'max'},
                                    {text: '현재', align: 'center', name: 'cur'}
                                ],
                            ready: function () {
                                //Main.search();
                            }
                        }, CtxMenu.IF, '20');
                        $ifErrorGrid.on('rowselect', function (event) {
                            var row = event.args.row;
                            var rowindex = event.args.rowindex;
                            rowID = $ifErrorGrid.jqxGrid('getrowid', rowindex);
                            Main.searchChart($ifErrorChart, row.mngNo, row.ifIdx);
                        }).on('bindingcomplete', function (event) {
                            var row = $ifErrorGrid.jqxGrid("getrows").length;
                            if (row > 0) rowID = 0;
                            if (rowID == -1) return;
                            var rowindex = $ifErrorGrid.jqxGrid("getrowboundindexbyid", rowID);
                            $ifErrorGrid.jqxGrid("selectrow", rowindex);
                        });

                        Main.createDefaultHighChart('ifErrorChart', IfPerfType.ERR);
                        break;
                    case TAB.COLLISION:
                        HmJqxSplitter.create($('#collisionSplitter'), HmJqxSplitter.ORIENTATION_H, [{
                            size: '50%',
                            collapsible: false
                        }, {size: '50%'}], '100%', '100%');
                        HmGrid.create($ifCollisionGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            pagerheight: 27,
                            pagerrenderer: HmGrid.pagerrenderer,
                            columns:
                                [
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        width: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '장비IP', datafield: 'devIp', width: 120},
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '별칭', datafield: 'ifAlias', width: 120},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 120,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {text: '상태', datafield: 'status', width: 120},
                                    {
                                        text: '현재',
                                        columngroup: 'collision',
                                        datafield: 'curCollision',
                                        width: 100,
                                        cellsalign: 'right'
                                    },
                                    {
                                        text: '평균',
                                        columngroup: 'collision',
                                        datafield: 'avgCollision',
                                        width: 100,
                                        cellsalign: 'right'
                                    },
                                    // { text: '최소', columngroup: 'collision', datafield: 'minCollision', width: 100, cellsalign: 'right' },
                                    {
                                        text: '최대',
                                        columngroup: 'collision',
                                        datafield: 'maxCollision',
                                        width: 100,
                                        cellsalign: 'right'
                                    },
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ],
                            columngroups:
                                [
                                    {text: 'COLLISION', align: 'center', name: 'collision'}
                                ],
                            ready: function () {
                                //Main.search();
                            }
                        }, CtxMenu.IF, '21');
                        $ifCollisionGrid.on('rowselect', function (event) {
                            var row = event.args.row;
                            var rowindex = event.args.rowindex;
                            rowID = $ifCollisionGrid.jqxGrid('getrowid', rowindex);
                            Main.searchChart($ifCollisionChart, row.mngNo, row.ifIdx);
                        }).on('bindingcomplete', function (event) {
                            var row = $ifCollisionGrid.jqxGrid("getrows").length;
                            if (row > 0) rowID = 0;
                            if (rowID == -1) return;
                            var rowindex = $ifCollisionGrid.jqxGrid("getrowboundindexbyid", rowID);
                            $ifCollisionGrid.jqxGrid("selectrow", rowindex);
                        });

                        Main.createDefaultHighChart('ifCollisionChart', IfPerfType.COL);
                        break;
                    case TAB.UCAST:
                        HmJqxSplitter.create($('#ucastSplitter'), HmJqxSplitter.ORIENTATION_H, [{
                            size: '50%',
                            collapsible: false
                        }, {size: '50%'}], '100%', '100%');
                        HmGrid.create($ifUcastGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            columns:
                                [
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        width: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '장비IP', datafield: 'devIp', width: 120},
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '별칭', datafield: 'ifAlias', width: 120},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 120,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {text: '상태', datafield: 'status', width: 120},
                                    {
                                        text: 'In',
                                        columngroup: 'avg',
                                        datafield: 'avgInnupps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'avg',
                                        datafield: 'avgOutnupps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Sum',
                                        columngroup: 'avg',
                                        datafield: 'avgNupps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer,
                                        hidden: true
                                    },
                                    // { text: 'In', columngroup: 'min', datafield: 'minInnupps',  width: 100, cellsrenderer: HmGrid.unit1000renderer },
                                    // { text: 'Out', columngroup: 'min', datafield: 'minOutnupps', width: 100, cellsrenderer: HmGrid.unit1000renderer },
                                    {
                                        text: 'In',
                                        columngroup: 'max',
                                        datafield: 'maxInnupps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'max',
                                        datafield: 'maxOutnupps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Sum',
                                        columngroup: 'max',
                                        datafield: 'maxNupps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer,
                                        hidden: true
                                    },
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ],
                            columngroups:
                                [
                                    {text: '평균', align: 'center', name: 'avg'},
                                    {text: '최소', align: 'center', name: 'min'},
                                    {text: '최대', align: 'center', name: 'max'}
                                ],
                            ready: function () {
                                //Main.search();
                            }
                        }, CtxMenu.IF, '22');
                        $ifUcastGrid.on('rowselect', function (event) {
                            var row = event.args.row;
                            var rowindex = event.args.rowindex;
                            rowID = $ifUcastGrid.jqxGrid('getrowid', rowindex);
                            Main.searchChart($ifUcastChart, row.mngNo, row.ifIdx);
                        }).on('bindingcomplete', function (event) {
                            var row = $ifUcastGrid.jqxGrid("getrows").length;
                            if (row > 0) rowID = 0;
                            if (rowID == -1) return;
                            var rowindex = $ifUcastGrid.jqxGrid("getrowboundindexbyid", rowID);
                            $ifUcastGrid.jqxGrid("selectrow", rowindex);
                        });

                        Main.createDefaultHighChart('ifUcastChart', IfPerfType.NONUNICAST);
                        break;
                    case TAB.DCARD:
                        HmJqxSplitter.create($('#dcardSplitter'), HmJqxSplitter.ORIENTATION_H, [{
                            size: '50%',
                            collapsible: false
                        }, {size: '50%'}], '100%', '100%');
                        HmGrid.create($ifDcardGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            pagerheight: 27,
                            pagerrenderer: HmGrid.pagerrenderer,
                            columns:
                                [
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        width: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '장비IP', datafield: 'devIp', width: 120},
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '별칭', datafield: 'ifAlias', width: 120},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 120,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {text: '상태', datafield: 'status', width: 120},
                                    {
                                        text: 'In',
                                        columngroup: 'avg',
                                        datafield: 'avgIndiscard',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'avg',
                                        datafield: 'avgOutdiscard',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Sum',
                                        columngroup: 'avg',
                                        datafield: 'avgDiscard',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer,
                                        hidden: true
                                    },
                                    // { text: 'In', columngroup: 'min', datafield: 'minIndiscard',  width: 100, cellsrenderer: HmGrid.unit1000renderer },
                                    // { text: 'Out', columngroup: 'min', datafield: 'minOutdiscard', width: 100, cellsrenderer: HmGrid.unit1000renderer },
                                    {
                                        text: 'In',
                                        columngroup: 'max',
                                        datafield: 'maxIndiscard',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'max',
                                        datafield: 'maxOutdiscard',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Sum',
                                        columngroup: 'max',
                                        datafield: 'maxDiscard',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer,
                                        hidden: true
                                    },
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ],
                            columngroups:
                                [
                                    {text: '평균', align: 'center', name: 'avg'},
                                    {text: '최소', align: 'center', name: 'min'},
                                    {text: '최대', align: 'center', name: 'max'}
                                ],
                            ready: function () {
                                //Main.search();
                            }
                        }, CtxMenu.IF, '23');
                        $ifDcardGrid.on('rowselect', function (event) {
                            var row = event.args.row;
                            var rowindex = event.args.rowindex;
                            rowID = $ifDcardGrid.jqxGrid('getrowid', rowindex);
                            Main.searchChart($ifDcardChart, row.mngNo, row.ifIdx);
                        }).on('bindingcomplete', function (event) {
                            var row = $ifDcardGrid.jqxGrid("getrows").length;
                            if (row > 0) rowID = 0;
                            if (rowID == -1) return;
                            var rowindex = $ifDcardGrid.jqxGrid("getrowboundindexbyid", rowID);
                            $ifDcardGrid.jqxGrid("selectrow", rowindex);
                        });

                        Main.createDefaultHighChart('ifDcardChart', IfPerfType.DISCARD);
                        break;
                    case TAB.MCAST:
                        HmJqxSplitter.create($('#mcastSplitter'), HmJqxSplitter.ORIENTATION_H, [{
                            size: '50%',
                            collapsible: false
                        }, {size: '50%'}], '100%', '100%');
                        HmGrid.create($ifMcastGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            columns:
                                [
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        width: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '장비IP', datafield: 'devIp', width: 120},
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '별칭', datafield: 'ifAlias', width: 120},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 120,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {text: '상태', datafield: 'status', width: 120},
                                    {
                                        text: 'In',
                                        columngroup: 'avg',
                                        datafield: 'avgInmcastpps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'avg',
                                        datafield: 'avgOutmcastpps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Sum',
                                        columngroup: 'avg',
                                        datafield: 'avgMcastpps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer,
                                        hidden: true
                                    },
                                    // { text: 'In', columngroup: 'min', datafield: 'minInmcastpps',  width: 100, cellsrenderer: HmGrid.unit1000renderer },
                                    // { text: 'Out', columngroup: 'min', datafield: 'minOutmcastpps', width: 100, cellsrenderer: HmGrid.unit1000renderer },
                                    {
                                        text: 'In',
                                        columngroup: 'max',
                                        datafield: 'maxInmcastpps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'max',
                                        datafield: 'maxOutmcastpps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Sum',
                                        columngroup: 'max',
                                        datafield: 'maxMcastpps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer,
                                        hidden: true
                                    },
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ],
                            columngroups:
                                [
                                    {text: '평균', align: 'center', name: 'avg'},
                                    {text: '최소', align: 'center', name: 'min'},
                                    {text: '최대', align: 'center', name: 'max'}
                                ],
                            ready: function () {
                                //Main.search();
                            }
                        }, CtxMenu.IF, '24');
                        $ifMcastGrid.on('rowselect', function (event) {
                            var row = event.args.row;
                            var rowindex = event.args.rowindex;
                            rowID = $ifMcastGrid.jqxGrid('getrowid', rowindex);
                            Main.searchChart($ifMcastChart, row.mngNo, row.ifIdx);
                        }).on('bindingcomplete', function (event) {
                            var row = $ifMcastGrid.jqxGrid("getrows").length;
                            if (row > 0) rowID = 0;
                            if (rowID == -1) return;
                            var rowindex = $ifMcastGrid.jqxGrid("getrowboundindexbyid", rowID);
                            $ifMcastGrid.jqxGrid("selectrow", rowindex);
                        });

                        Main.createDefaultHighChart('ifMcastChart', IfPerfType.MULTICAST);
                        break;
                    case TAB.BCAST:
                        HmJqxSplitter.create($('#bcastSplitter'), HmJqxSplitter.ORIENTATION_H, [{
                            size: '50%',
                            collapsible: false
                        }, {size: '50%'}], '100%', '100%');
                        HmGrid.create($ifBcastGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    }
                                }
                            ),
                            pagerheight: 27,
                            pagerrenderer: HmGrid.pagerrenderer,
                            columns:
                                [
                                    {
                                        text: '장비명',
                                        datafield: 'disDevName',
                                        width: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '장비IP', datafield: 'devIp', width: 120},
                                    {
                                        text: '회선명',
                                        datafield: 'ifName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.ifNameRenderer
                                    },
                                    {text: '별칭', datafield: 'ifAlias', width: 120},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 120,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {text: '상태', datafield: 'status', width: 120},
                                    {
                                        text: 'In',
                                        columngroup: 'avg',
                                        datafield: 'avgInbcastpps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'avg',
                                        datafield: 'avgOutbcastpps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Sum',
                                        columngroup: 'avg',
                                        datafield: 'avgBcastpps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer,
                                        hidden: true
                                    },
                                    // { text: 'In', columngroup: 'min', datafield: 'minInbcastpps',  width: 100, cellsrenderer: HmGrid.unit1000renderer },
                                    // { text: 'Out', columngroup: 'min', datafield: 'minOutbcastpps', width: 100, cellsrenderer: HmGrid.unit1000renderer },
                                    {
                                        text: 'In',
                                        columngroup: 'max',
                                        datafield: 'maxInbcastpps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'max',
                                        datafield: 'maxOutbcastpps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Sum',
                                        columngroup: 'max',
                                        datafield: 'maxBcastpps',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer,
                                        hidden: true
                                    },
                                    {
                                        text: 'FLOW',
                                        datafield: 'flowPoll',
                                        width: 60,
                                        cellsrenderer: HmGrid.tmsFlowRenderer
                                    }
                                ],
                            columngroups:
                                [
                                    {text: '평균', align: 'center', name: 'avg'},
                                    {text: '최소', align: 'center', name: 'min'},
                                    {text: '최대', align: 'center', name: 'max'}
                                ],
                            ready: function () {
                                //Main.search();
                            }
                        }, CtxMenu.IF, '25');
                        $ifBcastGrid.on('rowselect', function (event) {
                            var row = event.args.row;
                            var rowindex = event.args.rowindex;
                            rowID = $ifBcastGrid.jqxGrid('getrowid', rowindex);
                            Main.searchChart($ifBcastChart, row.mngNo, row.ifIdx);
                        }).on('bindingcomplete', function (event) {
                            var row = $ifBcastGrid.jqxGrid("getrows").length;
                            if (row > 0) rowID = 0;
                            if (rowID == -1) return;
                            var rowindex = $ifBcastGrid.jqxGrid("getrowboundindexbyid", rowID);
                            $ifBcastGrid.jqxGrid("selectrow", rowindex);
                        });

                        Main.createDefaultHighChart('ifBcastChart', IfPerfType.BROADCAST);
                        break;
                }
            }
        });

        HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_GRP_DEFAULT2, Main.selectTree, {devKind1: 'DEV'});
        HmTreeGrid.create($('#sGrpTreeGrid'), HmTree.T_GRP_SEARCH2, Main.selectTree);
        HmTreeGrid.create($('#iGrpTreeGrid'), HmTree.T_GRP_IF2, Main.selectTree);

        $('#leftTab').jqxTabs({
            width: '100%', height: '99.8%', scrollable: true, theme: 'ui-hamon-v1',
            initTabContent: function (tab) {
                if (tab === 0) Main.selectTree();

                // HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_GRP_DEFAULT2);
                // HmTreeGrid.create($('#sGrpTreeGrid'), HmTree.T_GRP_SEARCH2);
                // HmTreeGrid.create($('#iGrpTreeGrid'), HmTree.T_GRP_IF);
            //
            //     // switch (tab) {
            //     //     case 0:
            //     //         HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_GRP_DEFAULT2, Main.selectTree, {devKind1: 'DEV'});
            //     //         break;
            //     //     case 1:
            //     //         HmTreeGrid.create($('#sGrpTreeGrid'), HmTree.T_GRP_SEARCH2, Main.selectTree);
            //     //         break;
            //     //     case 2:
            //     //         HmTreeGrid.create($('#iGrpTreeGrid'), HmTree.T_GRP_IF, Main.selectTree);
            //     //         break;
            //     // }
            }
        }).on('selected', function(event) {
            if (event.args.item === 0 && $('#dGrpTreeGrid').children().length === 0)
                HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_GRP_DEFAULT2, Main.selectTree, {devKind1: 'DEV'});
            else if (event.args.item === 1 && $('#sGrpTreeGrid').children().length === 0)
                HmTreeGrid.create($('#sGrpTreeGrid'), HmTree.T_GRP_SEARCH2, Main.selectTree);
            else if (event.args.item === 2 && $('#iGrpTreeGrid').children().length === 0)
                HmTreeGrid.create($('#iGrpTreeGrid'), HmTree.T_GRP_IF2, Main.selectTree);

            Main.selectTree();
        });

        $('#section').css('display', 'block');
    },

    /** init data */
    initData: function () {

    },

    createDefaultHighChart: function (chartName, itemType) {
        switch (itemType) {
            case IfPerfType.BPS:
                $ifBpsChart = new IfBpsChart(chartName);
                $ifBpsChart.initialize();
                break;
            case IfPerfType.BPSPER:
                $ifBpsPerChart = new IfBpsPerChart(chartName);
                $ifBpsPerChart.initialize();
                break;
            case IfPerfType.PPS:
                $ifPpsChart = new IfPpsChart(chartName);
                $ifPpsChart.initialize();
                break;
            case IfPerfType.CRC:
                $ifCrcChart = new IfCrcChart(chartName);
                $ifCrcChart.initialize();
                break;
            case IfPerfType.ERR:
                $ifErrorChart = new IfErrorChart(chartName);
                $ifErrorChart.initialize();
                break;
            case IfPerfType.COL:
                $ifCollisionChart = new IfCollisionChart(chartName);
                $ifCollisionChart.initialize();
                break;
            case IfPerfType.NONUNICAST:
                $ifUcastChart = new IfNonUnicastChart(chartName);
                $ifUcastChart.initialize();
                break;
            case IfPerfType.DISCARD:
                $ifDcardChart = new IfDiscardChart(chartName);
                $ifDcardChart.initialize();
                break;
            case IfPerfType.MULTICAST:
                $ifMcastChart = new IfMulticastChart(chartName);
                $ifMcastChart.initialize();
                break;
            case IfPerfType.BROADCAST:
                $ifBcastChart = new IfBroadcastChart(chartName);
                $ifBcastChart.initialize();
                break;
        }
    },

    /** TopN 툴바 ... 버튼추가 */
    topNToolbarRenderer: function (toolbar, title, type, isChecked) {
        if (isChecked == null) isChecked = false;
        var container = $('<div style="margin: 5px"></div>');
        var span = $('<span style="float: left; font-weight: bold; margin-top: 2px; margin-right: 4px;">' + title + '</span>');
        toolbar.css('background', '#d0d8de');
        toolbar.empty();
        toolbar.append(container);
        container.append(span);
        // 우측 체크박스
        var ckbox = $('<div id="ck' + type + '" style="float: right; margin-right: 2px"></div>');
        ckbox.jqxCheckBox({checked: isChecked});
        container.append(ckbox);
    },

    /** 공통 파라미터 */
    getCommParams: function () {

        // var treeItem = null, _grpType = 'DEFAULT';
        // switch($('#leftTab').val()) {
        // 	case 0:
        // 		treeItem = HmTreeGrid.getSelectedItem($('#dGrpTreeGrid'));
        // 		_grpType = 'DEFAULT';
        // 		break;
        // 	case 1:
        // 		treeItem = HmTreeGrid.getSelectedItem($('#sGrpTreeGrid'));
        // 		_grpType = 'SEARCH';
        // 		break;
        // 	case 2:
        // 		treeItem = HmTreeGrid.getSelectedItem($('#iGrpTreeGrid'));
        // 		_grpType = 'IF';
        // 		break;
        // }
        // var _grpNo = 0, _grpParent = 0, _itemKind = 'GROUP';
        // if(treeItem != null) {
        // 	_itemKind = treeItem.devKind2;
        // 	_grpNo = _itemKind == 'GROUP'? treeItem.grpNo : treeItem.grpNo.split('_')[1];
        // 	_grpParent = treeItem.grpParent;
        // }
        //
        // var params = {
        // 	grpType: _grpType,
        // 	grpNo: _grpNo,
        // 	grpParent: _grpParent,
        // 	itemKind: _itemKind
        // };
        // $.extend(params, {
        // 	period: $("input[name='cbPeriod']:checked").val(),
        // 	topN: $("input[name='cbTopN']:checked").val(),
        // 	sortCol: $("input[name='cbSortType']:checked").val(),
        // 	date1: HmDate.getDateStr($('#date1')),
        // 	time1: HmDate.getTimeStr($('#date1')),
        // 	date2: HmDate.getDateStr($('#date2')),
        // 	time2: HmDate.getTimeStr($('#date2')),
        // 	sIp: Master.getSrchIp(),
        // 	sDevName:Master.getSrchDevName(),
        // });

        var params = $.extend(Master.getGrpTabParams(), HmBoxCondition.getPeriodParams(), HmBoxCondition.getSrchParams('sSrchType'));
        params.topN = HmBoxCondition.val('sTopN');
        params.sortCol = HmBoxCondition.val('sSortType');
        return params;
    },

    /** 그룹트리 선택 */
    selectTree: function (isCreate) {
        var treeItem = null, _grpType = 'DEFAULT';
        switch ($('#leftTab').val()) {
            case 0:
                treeItem = HmTreeGrid.getSelectedItem($('#dGrpTreeGrid'));
                _grpType = 'DEFAULT';
                break;
            case 1:
                treeItem = HmTreeGrid.getSelectedItem($('#sGrpTreeGrid'));
                _grpType = 'SEARCH';
                break;
            case 2:
                treeItem = HmTreeGrid.getSelectedItem($('#iGrpTreeGrid'));
                _grpType = 'IF';
                break;
        }
        var _grpNo = 0, _grpParent = 0, _itemKind = 'GROUP';
        if (treeItem != null) {
            _itemKind = treeItem.devKind2;
            _grpNo = _itemKind == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1];
            _grpParent = treeItem.grpParent;
        }

        // if (_itemKind == 'GROUP' && _grpType != 'IF') {
        if (_itemKind == 'GROUP') {
            // Main.clearTabData();
            $('#mainTab').find('ul').children(':first').css('display', 'inline');
            $('#mainTab').find('ul').children(':gt(0)').css('visibility', 'collapse');
            $('#sSortType, #sTopN').parent().css('display', 'block');
            /*	$('#sortTypeDiv, #topNDiv').css('display', 'block');*/
            // $('.standard, .tabNumber').css('display', 'block');
            $('#mainTab').jqxTabs('select', 0);
            $('input:radio[name=sPeriod]').eq(0).next().removeClass('hide');
            $('input:radio[name=sPeriod]').eq(0).click();

            //구분 라디오버튼
            // $(".divide").css('width','191px');
            // $("#tab1").val(0);
            // $("#tab2").val(1);
            // $("#tab3").val(7);
            // $("#tab4").val(30);
            // $("#tab5").val(365);
            // $("#label1").text("실시간");
            // $("#label2").text("24H");
            // $("#label2").css('left','72px');
            // $("#label3").text("1W");
            // $("#label3").css('left','101px');
            // $("#label4").text("1M");
            // $("#label4").css('left','130px');
            // $("#label5").text("1Y");
            // $("#label5").css('left','159px');
            // $("#label5").css('border-radius','0 0 0 0');
            // $("#label6").show();
            //
            // $('input:radio[name=cbPeriod]').eq(0).prop("checked", true);
            // //기간 조건 감추고 주기 보여주기.
            // $("#content2").hide();
            // $("#content1").show();
            // Main.chgRefreshCycle();
        }
        else {
            Main.clearTabData();
            $('#mainTab').find('ul').children(':first').css('display', 'none');
            $('#mainTab').find('ul').children(':gt(0)').css('visibility', 'visible');
            // $('.standard, .tabNumber').css('display', 'none');
            $('#sSortType, #sTopN').parent().css('display', 'none');
            $('#mainTab').jqxTabs('select', 1);
            $('input:radio[name=sPeriod]').eq(0).next().addClass('hide');
            $('input:radio[name=sPeriod]').eq(1).click();
            /*	$('#cbPeriod').jqxDropDownList('disableAt', 0);*/

            //구분 라디오버튼
            // $(".divide").css('width','148px');
            // $("#tab1").val(1);
            // $("#tab2").val(7);
            // $("#tab3").val(30);
            // $("#tab4").val(365);
            // $("#tab5").val(-1);
            // $("#label1").text("24H");
            // $("#label2").text("1W");
            // $("#label2").css('left','59px');
            // $("#label3").text("1M");
            // $("#label3").css('left','88px');
            // $("#label4").text("1Y");
            // $("#label4").css('left','117px');
            // $("#label5").text("기간");
            // $("#label5").css('left','146px');
            // $("#label5").css('border-radius','0 3px 3px 0');
            // $("#label6").hide();
            //
            //
            // $('input:radio[name=cbPeriod]').eq(0).prop("checked", true);
            // //기간 조건 보여주고 주기 감추기.
            // $("#content2").show();
            // $("#content1").hide();
            // Master.radioCbPeriodCondition($("input[name='cbPeriod']:checked"), $('#date1'), $('#date2'));
            // $('input:radio[name=cbRefreshCycle]').eq(3).prop("checked", true);
            // Main.chgRefreshCycle();

            // if(_grpType == 'IF') {
            // 	/*$('#cbPeriod').val("7");*/
            // 	$('input:radio[name=cbPeriod]').eq(1).prop("checked", true);
            // }
            // else {
            // 	if($('#cbPeriod').val() == "0") {		// 장비선택이면 '현재'를 비활성화 하고 초기값을 24시로 선택
            // 	/*	$('#cbPeriod').val("1");*/
            // 		$('input:radio[name=cbPeriod]').eq(0).prop("checked", true);
            // 	}
            // }
        }

        Main.search();
    },

    /** 새로고침 주기 변경 */
    chgRefreshCycle: function () {
        var cycle = $("input[name='cbRefreshCycle']:checked").val();
        if (timer != null)
            clearInterval(timer);
        if (cycle > 0) {
            timer = setInterval(function () {
                var curVal = $('#prgrsBar').val();
                if (curVal < 100)
                    curVal += 100 / cycle;
                $('#prgrsBar').val(curVal);
            }, 1000);
        } else {
            $('#prgrsBar').val(0);
        }
    },

    /** 장비 선택시 탭 데이터 초기화 */
    clearTabData: function () {
        rowID = -1;
        var gridArr = [null, $ifBpsGrid, $ifBpsPerGrid, $ifPpsGrid, $ifCrcGrid, $ifErrorGrid, $ifCollisionGrid, $ifUcastGrid, $ifDcardGrid, $ifMcastGrid, $ifBcastGrid];
        var chartArr = [null, $ifBpsChart, $ifBpsPerChart, $ifPpsChart, $ifCrcChart, $ifErrorChart, $ifCollisionChart, $ifUcastChart, $ifDcardChart, $ifMcastChart, $ifBcastChart];
        for (var i = 0; i < tabInit.length; i++) {
            if (tabInit[i]) {
                if (gridArr[i] != null) {
                    gridArr[i].jqxGrid('clear');
                }
                if (chartArr[i] != null) {
                    Main.clearChart(chartArr[i]);
                }
            }
        }
    },

    /** 조회 */
    search: function () {
        /*Master.refreshCbPeriod($cbPeriod);*/
        Main.searchGrid();
    },

    searchGrid: function () {
        switch ($('#mainTab').val()) {
            case TAB.TOP_N:
                if ($('#ckInbpsper').val()) {
                    HmGrid.updateBoundData($('#inbpsperGrid'), ctxPath + '/main/nms/ifPerf/getInbpsperTopNList.do');
                }
                else {
                    var adapter = $('#inbpsperGrid').jqxGrid('source');
                    if (adapter._source.url != null && adapter.records.length > 0) {
                        $('#inbpsperGrid').jqxGrid('source')._source.url = null;
                        $('#inbpsperGrid').jqxGrid('updatebounddata');
                    }
                }
                if ($('#ckOutbpsper').val()) {
                    HmGrid.updateBoundData($('#outbpsperGrid'), ctxPath + '/main/nms/ifPerf/getOutbpsperTopNList.do');
                }
                else {
                    var adapter = $('#outbpsperGrid').jqxGrid('source');
                    if (adapter._source.url != null && adapter.records.length > 0) {
                        $('#outbpsperGrid').jqxGrid('source')._source.url = null;
                        $('#outbpsperGrid').jqxGrid('updatebounddata');
                    }
                }
                if ($('#ckInbps').val()) {
                    HmGrid.updateBoundData($('#inbpsGrid'), ctxPath + '/main/nms/ifPerf/getInbpsTopNList.do');
                }
                else {
                    var adapter = $('#inbpsGrid').jqxGrid('source');
                    if (adapter._source.url != null && adapter.records.length > 0) {
                        $('#inbpsGrid').jqxGrid('source')._source.url = null;
                        $('#inbpsGrid').jqxGrid('updatebounddata');
                    }
                }
                if ($('#ckOutbps').val()) {
                    HmGrid.updateBoundData($('#outbpsGrid'), ctxPath + '/main/nms/ifPerf/getOutbpsTopNList.do');
                }
                else {
                    var adapter = $('#outbpsGrid').jqxGrid('source');
                    if (adapter._source.url != null && adapter.records.length > 0) {
                        $('#outbpsGrid').jqxGrid('source')._source.url = null;
                        $('#outbpsGrid').jqxGrid('updatebounddata');
                    }
                }
                if ($('#ckInpps').val()) {
                    HmGrid.updateBoundData($('#inppsGrid'), ctxPath + '/main/nms/ifPerf/getInppsTopNList.do');
                }
                else {
                    var adapter = $('#inppsGrid').jqxGrid('source');
                    if (adapter._source.url != null && adapter.records.length > 0) {
                        $('#inppsGrid').jqxGrid('source')._source.url = null;
                        $('#inppsGrid').jqxGrid('updatebounddata');
                    }
                }
                if ($('#ckOutpps').val()) {
                    HmGrid.updateBoundData($('#outppsGrid'), ctxPath + '/main/nms/ifPerf/getOutppsTopNList.do');
                }
                else {
                    var adapter = $('#outppsGrid').jqxGrid('source');
                    if (adapter._source.url != null && adapter.records.length > 0) {
                        $('#outppsGrid').jqxGrid('source')._source.url = null;
                        $('#outppsGrid').jqxGrid('updatebounddata');
                    }
                }
                if ($('#ckInerr').val()) {
                    HmGrid.updateBoundData($('#inerrGrid'), ctxPath + '/main/nms/ifPerf/getInerrTopNList.do');
                }
                else {
                    var adapter = $('#inerrGrid').jqxGrid('source');
                    if (adapter._source.url != null && adapter.records.length > 0) {
                        $('#inerrGrid').jqxGrid('source')._source.url = null;
                        $('#inerrGrid').jqxGrid('updatebounddata');
                    }
                }
                if ($('#ckOuterr').val()) {
                    HmGrid.updateBoundData($('#outerrGrid'), ctxPath + '/main/nms/ifPerf/getOuterrTopNList.do');
                }
                else {
                    var adapter = $('#outerrGrid').jqxGrid('source');
                    if (adapter._source.url != null && adapter.records.length > 0) {
                        $('#outerrGrid').jqxGrid('source')._source.url = null;
                        $('#outerrGrid').jqxGrid('updatebounddata');
                    }
                }
                if ($('#ckCrc').val()) {
                    HmGrid.updateBoundData($('#crcGrid'), ctxPath + '/main/nms/ifPerf/getCrcTopNList.do');
                }
                else {
                    var adapter = $('#crcGrid').jqxGrid('source');
                    if (adapter._source.url != null && adapter.records.length > 0) {
                        $('#crcGrid').jqxGrid('source')._source.url = null;
                        $('#crcGrid').jqxGrid('updatebounddata');
                    }
                }
                if ($('#ckCollision').val()) {
                    HmGrid.updateBoundData($('#collisionGrid'), ctxPath + '/main/nms/ifPerf/getCollisionTopNList.do');
                }
                else {
                    var adapter = $('#collisionGrid').jqxGrid('source');
                    if (adapter._source.url != null && adapter.records.length > 0) {
                        $('#collisionGrid').jqxGrid('source')._source.url = null;
                        $('#collisionGrid').jqxGrid('updatebounddata');
                    }
                }
                break;
            case TAB.BPS_PER:
                this.clearChart($ifBpsPerChart);
                HmGrid.updateBoundData($ifBpsPerGrid, ctxPath + '/main/nms/ifPerf/getIfPerfBpsPerList.do');
                break;
            case TAB.BPS:
                this.clearChart($ifBpsChart);
                HmGrid.updateBoundData($ifBpsGrid, ctxPath + '/main/nms/ifPerf/getIfPerfBpsList.do');
                break;
            case TAB.PPS:
                this.clearChart($ifPpsChart);
                HmGrid.updateBoundData($ifPpsGrid, ctxPath + '/main/nms/ifPerf/getIfPerfPpsList.do');
                break;
            case TAB.CRC:
                this.clearChart($ifCrcChart);
                HmGrid.updateBoundData($ifCrcGrid, ctxPath + '/main/nms/ifPerf/getIfPerfCrcList.do');
                break;
            case TAB.ERROR:
                this.clearChart($ifErrorChart);
                HmGrid.updateBoundData($ifErrorGrid, ctxPath + '/main/nms/ifPerf/getIfPerfErrorList.do');
                break;
            case TAB.COLLISION:
                this.clearChart($ifCollisionChart);
                HmGrid.updateBoundData($ifCollisionGrid, ctxPath + '/main/nms/ifPerf/getIfPerfCollisionList.do');
                break;
            case TAB.UCAST:
                this.clearChart($ifUcastChart);
                HmGrid.updateBoundData($ifUcastGrid, ctxPath + '/main/nms/ifPerf/getIfPerfUcastList.do');
                break;
            case TAB.DCARD:
                this.clearChart($ifDcardChart);
                HmGrid.updateBoundData($ifDcardGrid, ctxPath + '/main/nms/ifPerf/getIfPerfDcardList.do');
                break;
            case TAB.MCAST:
                this.clearChart($ifMcastChart);
                HmGrid.updateBoundData($ifMcastGrid, ctxPath + '/main/nms/ifPerf/getIfPerfMcastList.do');
                break;
            case TAB.BCAST:
                this.clearChart($ifBcastChart);
                HmGrid.updateBoundData($ifBcastGrid, ctxPath + '/main/nms/ifPerf/getIfPerfBcastList.do');
                break;
        }
    },

    clearChart: function (chartObj) {
        try {
            chartObj.clearSeriesData();
        } catch (e) {
        }
    },

    /**
     * 차트 조회
     * @param chartObj
     * @param mngNo
     * @param ifIdx
     */
    searchChart: function (chartObj, mngNo, ifIdx) {
        var params = this.getCommParams();
        var _itemType = '';
        switch ($('#mainTab').val()) {
            case TAB.BPS:
                _itemType = IfPerfType.BPS;
                break;
            case TAB.BPS_PER:
                _itemType = IfPerfType.BPSPER;
                break;
            case TAB.PPS:
                _itemType = IfPerfType.PPS;
                break;
            case TAB.CRC:
                _itemType = IfPerfType.CRC;
                break;
            case TAB.ERROR:
                _itemType = IfPerfType.ERR;
                break;
            case TAB.COLLISION:
                _itemType = IfPerfType.COL;
                break;
            case TAB.UCAST:
                _itemType = IfPerfType.NONUNICAST;
                break;
            case TAB.DCARD:
                _itemType = IfPerfType.DISCARD;
                break;
            case TAB.MCAST:
                _itemType = IfPerfType.MULTICAST;
                break;
            case TAB.BCAST:
                _itemType = IfPerfType.BROADCAST;
                break;
            default:
                return;
        }
        params.mngNo = mngNo;
        params.ifIdx = ifIdx;
        params.itemType = _itemType;
        chartObj.searchData(params);
    },

    /** 차트 > 트래픽데이터 연계팝업 */
    showTrafficData: function (dataItem) {
        var ymd = dataItem.ymdhms.replace(/\-/g, '').substr(0, 8);
        var today = $.format.date(new Date(), 'yyyyMMdd');

        var date1 = new Date(ymd.substr(0, 4), ymd.substr(4, 2) - 1, ymd.substr(6, 2));
        var date2 = new Date(today.substr(0, 4), today.substr(4, 2) - 1, today.substr(6, 2));
        var gap = parseInt((date2 - date1) / (1000 * 60 * 60 * 24));

        if (gap > 6) {
            alert('6일 이전 데이터는 트래픽관리에서 조회하세요.');
            return;
        }
        var params = {
            mngNo: dataItem.mngNo,
            ifIdx: dataItem.ifIdx,
            devName: dataItem.devName,
            ifName: dataItem.ifName,
            ymdhms: dataItem.ymdhms.replace(/\-/g, '').replace(/\:/g, '').replace(/\s/g, ''),
            tableCnt: dataItem.tableCnt
        };
        HmUtil.createPopup('/main/popup/tms/pChartTrafficData.do', $('#hForm'), 'pChartTrafficData', 1250, 750, params);
    },

    /** 엑셀 export */
    exportExcel: function () {

        if ($('#gSiteName').val() == 'HCN' || $('#gSiteName').val() == 'KbCard') {

            switch ($('#mainTab').val()) {

                case TAB.TOP_N:


                    var gridInfos = [
                        {chkId: 'Inbps', gridId: 'inbpsGrid', title: 'IN BPS'},
                        {chkId: 'Outbps', gridId: 'outbpsGrid', title: 'OUT BPS'},
                        {chkId: 'Inbpsper', gridId: 'inbpsperGrid', title: 'IN BPS(%)'},
                        {chkId: 'Outbpsper', gridId: 'inbpsperGrid', title: 'OUT BPS(%)'},
                        {chkId: 'Inpps', gridId: 'inppsGrid', title: 'IN PPS'},
                        {chkId: 'Outpps', gridId: 'outppsGrid', title: 'OUT PPS'},
                        {chkId: 'Inerr', gridId: 'inerrGrid', title: 'IN ERROR'},
                        {chkId: 'Outerr', gridId: 'outerrGrid', title: 'OUT ERROR'},
                        {chkId: 'Crc', gridId: 'crcGrid', title: 'CRC'},
                        {chkId: 'Collision', gridId: 'collisionGrid', title: 'COLLISION'}
                    ];

                    var _gridArr = [], _gridTitleArr = [];


                    for (var i = 0; i < gridInfos.length; i++) {
                        var checked = $('#ck' + gridInfos[i].chkId).val();
                        if (checked) {
                            _gridArr.push($('#' + gridInfos[i].gridId));
                            _gridTitleArr.push(gridInfos[i].title);
                        }
                    }

                    console.log(_gridTitleArr);

                    HmUtil.exportGridList(_gridArr, _gridTitleArr, '회선성능TopN', false);


                    return;
                case TAB.BPS:
                    HmUtil.exportGrid($('#ifBpsGrid'), '회선성능TopN_BPS', false);
                    return;
                case TAB.BPS_PER:
                    HmUtil.exportGrid($('#ifBpsPerGrid'), '회선성능TopN_BPS(%)', false);
                    return;
                case TAB.PPS:
                    HmUtil.exportGrid($('#ifPpsGrid'), '회선성능TopN_PPS', false);
                    return;
                case TAB.CRC:
                    HmUtil.exportGrid($('#ifCrcGrid'), '회선성능TopN_CRC', false);
                    return;
                case TAB.ERROR:
                    HmUtil.exportGrid($('#ifErrorGrid'), '회선성능TopN_ERROR', false);
                    return;
                case TAB.COLLISION:
                    HmUtil.exportGrid($('#ifCollisionGrid'), '회선성능TopN_COLLISION', false);
                    return;
                case TAB.UCAST:
                    HmUtil.exportGrid($('#ifUcastGrid'), '회선성능TopN_UNICAST', false);
                    return;
                case TAB.DCARD:
                    HmUtil.exportGrid($('#ifDcardGrid'), '회선성능TopN_DISCARD', false);
                    return;
                case TAB.MCAST:
                    HmUtil.exportGrid($('#ifMcastGrid'), '회선성능TopN_MULTICAST', false);
                    return;
                case TAB.BCAST:
                    HmUtil.exportGrid($('#ifBcastGrid'), '회선성능TopN_BROADCAST', false);
                    return;
            }
        } else {

            var params = this.getCommParams();

            var _tabNm = '';

            switch ($('#mainTab').val()) {
                case TAB.TOP_N:
                    // _tabNm = 'top';


                    var gridInfos = [
                        {chkId: 'Inbps', gridId: 'inbpsGrid', title: 'IN BPS'},
                        {chkId: 'Outbps', gridId: 'outbpsGrid', title: 'OUT BPS'},
                        {chkId: 'Inbpsper', gridId: 'inbpsperGrid', title: 'IN BPS(%)'},
                        {chkId: 'Outbpsper', gridId: 'inbpsperGrid', title: 'OUT BPS(%)'},
                        {chkId: 'Inpps', gridId: 'inppsGrid', title: 'IN PPS'},
                        {chkId: 'Outpps', gridId: 'outppsGrid', title: 'OUT PPS'},
                        {chkId: 'Inerr', gridId: 'inerrGrid', title: 'IN ERROR'},
                        {chkId: 'Outerr', gridId: 'outerrGrid', title: 'OUT ERROR'},
                        {chkId: 'Crc', gridId: 'crcGrid', title: 'CRC'},
                        {chkId: 'Collision', gridId: 'collisionGrid', title: 'COLLISION'}
                    ];

                    var _gridArr = [], _gridTitleArr = [];


                    for (var i = 0; i < gridInfos.length; i++) {
                        var checked = $('#ck' + gridInfos[i].chkId).val();
                        if (checked) {
                            _gridArr.push($('#' + gridInfos[i].gridId));
                            _gridTitleArr.push(gridInfos[i].title);
                        }
                    }

                    console.log(_gridTitleArr);

                    HmUtil.exportGridList(_gridArr, _gridTitleArr, '회선성능TopN',false);
                    break;
                case TAB.BPS:
                    _tabNm = 'bps';
                    params.tabNm = _tabNm;
                    HmUtil.exportExcel(ctxPath + '/main/nms/ifPerf/export.do', params);
                    break;
                case TAB.BPS_PER:
                    _tabNm = 'bpsper';
                    params.tabNm = _tabNm;
                    HmUtil.exportExcel(ctxPath + '/main/nms/ifPerf/export.do', params);

                    break;
                case TAB.PPS:
                    _tabNm = 'pps';
                    params.tabNm = _tabNm;
                    HmUtil.exportExcel(ctxPath + '/main/nms/ifPerf/export.do', params);

                    break;
                case TAB.CRC:
                    _tabNm = 'crc';
                    params.tabNm = _tabNm;
                    HmUtil.exportExcel(ctxPath + '/main/nms/ifPerf/export.do', params);
                    break;
                case TAB.ERROR:
                    _tabNm = 'error';
                    params.tabNm = _tabNm;
                    HmUtil.exportExcel(ctxPath + '/main/nms/ifPerf/export.do', params);
                    break;
                case TAB.COLLISION:
                    _tabNm = 'collision';
                    params.tabNm = _tabNm;
                    HmUtil.exportExcel(ctxPath + '/main/nms/ifPerf/export.do', params);
                    break;
                // case TAB.UCAST: _tabNm = 'ucast'; break;
                case TAB.UCAST:
                    _tabNm = 'ucase';
                    params.tabNm = _tabNm;
                    HmUtil.exportExcel(ctxPath + '/main/nms/ifPerf/export.do', params);
                    break;
                case TAB.DCARD:
                    _tabNm = 'dcard';
                    params.tabNm = _tabNm;
                    HmUtil.exportExcel(ctxPath + '/main/nms/ifPerf/export.do', params);
                    break;
                case TAB.MCAST:
                    _tabNm = 'mcast';
                    params.tabNm = _tabNm;
                    HmUtil.exportExcel(ctxPath + '/main/nms/ifPerf/export.do', params);
                    break;
                case TAB.BCAST:
                    _tabNm = 'bcast';
                    params.tabNm = _tabNm;
                    HmUtil.exportExcel(ctxPath + '/main/nms/ifPerf/export.do', params);
                    break;
            }


        }
    },

    exceptSearch: function () {
        HmUtil.createPopup('/main/popup/nms/pExceptSearchList.do', $('#hForm'), 'pExceptSearchList', 720, 530);
    }

};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});