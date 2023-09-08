var TAB = {
    TOP_N: 0,
    DEV_CPU: 1,
    DEV_MEM: 2,
    DEV_FILESYSTEM: 3,
    DEV_NETWORK: 4,
    DEV_DISK: 5
};

var $devCpuGrid, $devMemGrid, $devFileGrid, $devNetworkGrid, $devDiskGrid;
var $cpuChart, $memChart, $fileChart, $networkChart, $diskChart;
var rowID = -1, timer = null;
var tabInit = [false, false, false, false, false, false];
var $grpTree;

var Main = {
    /** variable */
    initVariable: function () {
        $devCpuGrid = $('#devCpuGrid'), $devMemGrid = $('#devMemGrid'), $devFileGrid = $('#devFileGrid');
        $devNetworkGrid = $('#devNetworkGrid');
        $devDiskGrid = $('#devDiskGrid');
        $cpuChart = $('#cpuChart'), $memChart = $('#memChart'), $fileChart = $('#fileChart'), $networkChart = $('#networkChart'), $diskChart = $('#diskChart');
        $grpTree = $('#dGrpTreeGrid');
        this.initCondition();
    },

    initCondition: function () {
        HmBoxCondition.createPeriod('', Main.search, timer);
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
        //검색바호출.
        // Master.createSearchBar2($("#periodBox"),$("#cycleBox"),$("#dateBox"),$("#sortBox"),$("#topnBox"),$("#srchBox"));
        //
        // //구분버튼 클릭 이벤트
        // $("input:radio[name=cbPeriod]").click(function(){
        // 	if($("input[name='cbPeriod']:checked").val() == "0"){
        // 		//기간 조건 감추고 주기 보여주기.
        // 		$("#content2").hide();
        // 		$("#content1").show();
        // 		Main.chgRefreshCycle();
        // 	}else{
        // 		if(timer != null) {
        // 			clearInterval(timer);
        // 			timer = null;
        // 		}
        // 		$('#prgrsBar').val(0);
        // 		//기간 조건 보여주고 주기 감추기.
        // 		$("#content2").show();
        // 		$("#content1").hide();
        // 	}
        // });
        //
        // //주기 바.
        // Master.getProgressBar(Main.search);
        //
        // //주기 클릭 이벤트
        // $("input:radio[name=cbRefreshCycle]").click(function(){
        // 	Main.chgRefreshCycle();
        // });

        //세부지표
        $('#cbPerfKind').jqxDropDownList({
            source: HmResource.getResource('svr_cpuKind_list'),
            width: '100px',
            height: '21px',
            autoDropDownHeight: true,
            theme: jqxTheme,
            selectedIndex: 7
        });

        //파일시스템
        HmDropDownList.create($('#cbPFilesystem'), {
            width: 150,
            source: HmDropDownList.getSourceByUrl('/main/popup/svrDetail/getSummary_fileSystemInfo.do', {mngNo: 0}),
            displayMember: 'mountPoint', valueMember: 'mountPoint', selectedIndex: 0
        });

        //네트워크
        HmDropDownList.create($('#cbPNetwork'), {
            width: 150,
            source: HmDropDownList.getSourceByUrl('/main/popup/svrDetail/getSummary_networkInterfaceInfo.do', {mngNo: 0}),
            displayMember: 'name', valueMember: 'name', selectedIndex: 0
        });
        //DISK
        HmDropDownList.create($('#cbPDisk'), {
            width: 150,
            source: HmDropDownList.getSourceByUrl('/main/popup/svrDetail/getDiskDetailList.do', {mngNo: 0}),
            displayMember: 'diskName', valueMember: 'diskName', selectedIndex: 0
        });

        HmJqxSplitter.createTree($('#mainSplitter'));
        Master.createGrpTab(Main.selectTree, {devKind1: 'SVR'});


        $('#mainTab').jqxTabs({
            width: '100%', height: '100%', theme: jqxTheme,
            initTabContent: function (tab) {
                tabInit[tab] = true;
                switch (tab) {
                    case TAB.TOP_N:
                        HmGrid.create($('#cpuGrid'), {
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
                            pageable: false,
                            showtoolbar: true,
                            rendertoolbar: function (toolbar) {
                                HmGrid.titlerenderer(toolbar, 'CPU');
                            },
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 140},
                                    {
                                        text: '서버명',
                                        datafield: 'disDevName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '서버IP', datafield: 'devIp', width: 120},
                                    {
                                        text: 'CPU',
                                        datafield: 'topVal',
                                        width: 100,
                                        cellsrenderer: HmGrid.progressbarrenderer
                                    }
                                ]
                        }, CtxMenu.SVR, '1');
                        HmGrid.create($('#memGrid'), {
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
                            pageable: false,
                            showtoolbar: true,
                            rendertoolbar: function (toolbar) {
                                HmGrid.titlerenderer(toolbar, 'MEMORY');
                            },
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 140},
                                    {
                                        text: '서버명',
                                        datafield: 'disDevName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '서버IP', datafield: 'devIp', width: 120},
                                    {
                                        text: 'MEM',
                                        datafield: 'topVal',
                                        width: 100,
                                        cellsrenderer: HmGrid.progressbarrenderer
                                    }
                                ]
                        }, CtxMenu.SVR, '2');

                        HmGrid.create($('#netWorkInGrid'), {
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
                            pageable: false,
                            showtoolbar: true,
                            rendertoolbar: function (toolbar) {
                                HmGrid.titlerenderer(toolbar, 'BPS IN');
                            },
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 140},
                                    {
                                        text: '서버명',
                                        datafield: 'disDevName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '서버IP', datafield: 'devIp', width: 120},
                                    {
                                        text: 'IN',
                                        datafield: 'topVal',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    }
                                ]
                        }, CtxMenu.SVR, '3');
                        HmGrid.create($('#netWorkOutGrid'), {
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
                            pageable: false,
                            showtoolbar: true,
                            rendertoolbar: function (toolbar) {
                                HmGrid.titlerenderer(toolbar, 'BPS OUT');
                            },
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 140},
                                    {
                                        text: '서버명',
                                        datafield: 'disDevName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '서버IP', datafield: 'devIp', width: 120},
                                    {
                                        text: 'OUT',
                                        datafield: 'topVal',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    }
                                ]
                        }, CtxMenu.SVR, '4');


                        HmGrid.create($('#diskReadGrid'), {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        data.diskIoType = 'READ';
                                        return data;
                                    }
                                }
                            ),
                            height: 220,
                            autoheight: true,
                            showtoolbar: true,
                            scrollbarsize: -1,
                            pageable: false,
                            showtoolbar: true,
                            rendertoolbar: function (toolbar) {
                                HmGrid.titlerenderer(toolbar, 'DISK READ');
                            },
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 140},
                                    {
                                        text: '서버명',
                                        datafield: 'disDevName',
                                        minwidth: 120,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '디스크명', datafield: 'diskName', width: 200},
                                    {text: '서버IP', datafield: 'devIp', width: 120},
                                    {
                                        text: 'READ',
                                        datafield: 'topVal',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1024renderer
                                    }
                                ]
                        }, CtxMenu.SVR, '5');


                        HmGrid.create($('#diskWriteGrid'), {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, Main.getCommParams());
                                        data.diskIoType = 'WRITE';
                                        return data;
                                    }
                                }
                            ),
                            height: 220,
                            autoheight: true,
                            showtoolbar: true,
                            scrollbarsize: -1,
                            pageable: false,
                            showtoolbar: true,
                            rendertoolbar: function (toolbar) {
                                HmGrid.titlerenderer(toolbar, 'DISK WRITE');
                            },
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 140},
                                    {
                                        text: '서버명',
                                        datafield: 'disDevName',
                                        minwidth: 120,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '디스크명', datafield: 'diskName', width: 200},
                                    {text: '서버IP', datafield: 'devIp', width: 120},
                                    {
                                        text: 'WRITE',
                                        datafield: 'topVal',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1024renderer
                                    }
                                ]
                        }, CtxMenu.SVR, '6');

                        HmGrid.create($('#fileSystemGrid'), {
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
                            pageable: false,
                            showtoolbar: true,
                            rendertoolbar: function (toolbar) {
                                HmGrid.titlerenderer(toolbar, 'FILESYSTEM');
                            },
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 140},
                                    {
                                        text: '서버명',
                                        datafield: 'disDevName',
                                        minwidth: 120,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '경로', datafield: 'mountPoint', width: 200},
                                    {text: '서버IP', datafield: 'devIp', width: 120},
                                    {
                                        text: '사용률',
                                        datafield: 'topVal',
                                        width: 100,
                                        cellsrenderer: HmGrid.progressbarrenderer
                                    }
                                ]
                        }, CtxMenu.SVR, '7');

                        break;
                    case TAB.DEV_CPU:
                        HmJqxSplitter.create($('#cpuSplitter'), HmJqxSplitter.ORIENTATION_H, [{
                            size: 100,
                            collapsible: false
                        }, {size: '100%'}], '100%', '100%', {showSplitBar: false});
                        HmGrid.create($devCpuGrid, {
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
                            pageable: false,
                            scrollbarsize: -1,
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 140},
                                    {
                                        text: '서버명',
                                        datafield: 'disDevName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '서버IP', datafield: 'devIp', width: 120},
                                    {text: '종류', datafield: 'devKind2', width: 130},
                                    {text: '모델', datafield: 'model', width: 130},
                                    {
                                        text: '현재',
                                        columngroup: 'cpu',
                                        datafield: 'curVal',
                                        width: 100,
                                        cellsalign: 'right'
                                    },
                                    {
                                        text: '평균',
                                        columngroup: 'cpu',
                                        datafield: 'avgVal',
                                        width: 100,
                                        cellsalign: 'right'
                                    },
                                    {
                                        text: '최대',
                                        columngroup: 'cpu',
                                        datafield: 'maxVal',
                                        width: 100,
                                        cellsalign: 'right'
                                    }
                                ],
                            columngroups:
                                [
                                    {text: 'CPU', align: 'center', name: 'cpu'}
                                ],
                            ready: function () {
                            }
                        }, CtxMenu.SVR, '6');
                        $devCpuGrid.on('rowselect', function (event) {
                            var row = event.args.row;
                            var rowindex = event.args.rowindex;
                            rowID = $devCpuGrid.jqxGrid('getrowid', rowindex);
                            Main.searchChart($cpuChart, row.mngNo, DevPerfType.CPU);
                        }).on('bindingcomplete', function (event) {
                            var row = $devCpuGrid.jqxGrid("getrows").length;
                            if (row > 0) rowID = 0;
                            if (rowID == -1) return;
                            var rowindex = $devCpuGrid.jqxGrid("getrowboundindexbyid", rowID);
                            $devCpuGrid.jqxGrid("selectrow", rowindex);
                        });

                        //	Main.createDefaultHighChart('cpuChart', DevPerfType.CPU);
                        break;
                    case TAB.DEV_MEM:
                        HmJqxSplitter.create($('#memSplitter'), HmJqxSplitter.ORIENTATION_H, [{
                            size: 100,
                            collapsible: false
                        }, {size: '100%'}], '100%', '100%', {showSplitBar: false});
                        HmGrid.create($devMemGrid, {
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
                            pageable: false,
                            scrollbarsize: -1,
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 140},
                                    {
                                        text: '서버명',
                                        datafield: 'disDevName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '서버IP', datafield: 'devIp', width: 120},
                                    {text: '종류', datafield: 'devKind2', width: 130},
                                    {text: '모델', datafield: 'model', width: 130},
                                    {
                                        text: '현재',
                                        columngroup: 'mem',
                                        datafield: 'curVal',
                                        width: 100,
                                        cellsalign: 'right',
                                        cellsrenderer: Main.perfRenderer
                                    },
                                    {
                                        text: '평균',
                                        columngroup: 'mem',
                                        datafield: 'avgVal',
                                        width: 100,
                                        cellsalign: 'right',
                                        cellsrenderer: Main.perfRenderer
                                    },
                                    {
                                        text: '최대',
                                        columngroup: 'mem',
                                        datafield: 'maxVal',
                                        width: 100,
                                        cellsalign: 'right',
                                        cellsrenderer: Main.perfRenderer
                                    }
                                    // { text : '최소', columngroup: 'mem', datafield: 'minVal', width: 100, cellsalign: 'right' }
                                ],
                            columngroups:
                                [
                                    {text: 'MEMORY', align: 'center', name: 'mem'}
                                ],
                            ready: function () {
                                //Main.search();
                            }
                        }, CtxMenu.SVR, '7');
                        $devMemGrid.on('rowselect', function (event) {
                            var row = event.args.row;
                            var rowindex = event.args.rowindex;
                            rowID = $devMemGrid.jqxGrid('getrowid', rowindex);
                            Main.searchChart($memChart, row.mngNo, DevPerfType.MEMORY);
                        }).on('bindingcomplete', function (event) {
                            var row = $devMemGrid.jqxGrid("getrows").length;
                            if (row > 0) rowID = 0;
                            if (rowID == -1) return;
                            var rowindex = $devMemGrid.jqxGrid("getrowboundindexbyid", rowID);
                            $devMemGrid.jqxGrid("selectrow", rowindex);
                        });

                        //	Main.createDefaultHighChart('memChart', DevPerfType.MEMORY);
                        break;
                    case TAB.DEV_FILESYSTEM:
                        HmJqxSplitter.create($('#tempSplitter'), HmJqxSplitter.ORIENTATION_H, [{
                            size: 100,
                            collapsible: false
                        }, {size: '100%'}], '100%', '100%', {showSplitBar: false});
                        HmGrid.create($devFileGrid, {
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
                            pageable: false,
                            scrollbarsize: -1,
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 140},
                                    {
                                        text: '서버명',
                                        datafield: 'disDevName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '서버IP', datafield: 'devIp', width: 120},
                                    {text: '종류', datafield: 'devKind2', width: 130},
                                    {text: '모델', datafield: 'model', width: 130},
                                    {
                                        text: '현재',
                                        columngroup: 'file',
                                        datafield: 'curVal',
                                        width: 100,
                                        cellsalign: 'right',
                                        cellsrenderer: Main.perfRenderer
                                    },
                                    {
                                        text: '평균',
                                        columngroup: 'file',
                                        datafield: 'avgVal',
                                        width: 100,
                                        cellsalign: 'right',
                                        cellsrenderer: Main.perfRenderer
                                    },
                                    /* { text : '최대', columngroup: 'temp', datafield: 'maxVal', width: 100, cellsalign: 'right' }*/
                                    // { text : '최소', columngroup: 'temp', datafield: 'minVal', width: 100, cellsalign: 'right' }
                                ],
                            columngroups:
                                [
                                    {text: '파일시스템', align: 'center', name: 'file'}
                                ],
                            ready: function () {
                                // Main.search();
                            }
                        }, CtxMenu.SVR, '8');
                        $devFileGrid.on('rowselect', function (event) {
                            var row = event.args.row;
                            var rowindex = event.args.rowindex;
                            rowID = $devFileGrid.jqxGrid('getrowid', rowindex);
                            Main.searchChart($fileChart, row.mngNo, 3);
                        }).on('bindingcomplete', function (event) {
                            var row = $devFileGrid.jqxGrid("getrows").length;
                            if (row > 0) rowID = 0;
                            if (rowID == -1) return;
                            var rowindex = $devFileGrid.jqxGrid("getrowboundindexbyid", rowID);
                            $devFileGrid.jqxGrid("selectrow", rowindex);
                        });

                        break;
                    case TAB.DEV_NETWORK:
                        HmJqxSplitter.create($('#restimeSplitter'), HmJqxSplitter.ORIENTATION_H, [{
                            size: 100,
                            collapsible: false
                        }, {size: '100%'}], '100%', '100%', {showSplitBar: false});
                        HmGrid.create($devNetworkGrid, {
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
                            pageable: false,
                            scrollbarsize: -1,
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 140},
                                    {
                                        text: '서버명',
                                        datafield: 'disDevName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '서버IP', datafield: 'devIp', width: 120},
                                    {text: '종류', datafield: 'devKind2', width: 130},
                                    {text: '모델', datafield: 'model', width: 130},
                                    {
                                        text: 'In',
                                        columngroup: 'cur',
                                        datafield: 'curInVal',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'cur',
                                        datafield: 'curOutVal',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'In',
                                        columngroup: 'avg',
                                        datafield: 'avgInVal',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'avg',
                                        datafield: 'avgOutVal',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'In',
                                        columngroup: 'max',
                                        datafield: 'maxInVal',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'max',
                                        datafield: 'maxOutVal',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                ],
                            columngroups:
                                [
                                    {text: '현재', align: 'center', name: 'cur'},
                                    {text: '평균', align: 'center', name: 'avg'},
                                    {text: '최대', align: 'center', name: 'max'},

                                ],
                            ready: function () {
                                //	Main.search();
                            }
                        }, CtxMenu.SVR, '9');
                        $devNetworkGrid.on('rowselect', function (event) {
                            var row = event.args.row;
                            var rowindex = event.args.rowindex;
                            rowID = $devNetworkGrid.jqxGrid('getrowid', rowindex);
                            Main.searchChart($networkChart, row.mngNo, 4);
                        }).on('bindingcomplete', function (event) {
                            var row = $devNetworkGrid.jqxGrid("getrows").length;
                            if (row > 0) rowID = 0;
                            if (rowID == -1) return;
                            var rowindex = $devNetworkGrid.jqxGrid("getrowboundindexbyid", rowID);
                            $devNetworkGrid.jqxGrid("selectrow", rowindex);
                        });
                        break;
                    case TAB.DEV_DISK:
                        HmJqxSplitter.create($('#diskSplitter'), HmJqxSplitter.ORIENTATION_H, [{
                            size: 100,
                            collapsible: false
                        }, {size: '100%'}], '100%', '100%', {showSplitBar: false});
                        HmGrid.create($devDiskGrid, {
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
                            pageable: false,
                            scrollbarsize: -1,
                            columns:
                                [
                                    {text: '그룹', datafield: 'grpName', width: 140},
                                    {
                                        text: '서버명',
                                        datafield: 'disDevName',
                                        minwidth: 150,
                                        cellsrenderer: HmGrid.devNameRenderer
                                    },
                                    {text: '서버IP', datafield: 'devIp', width: 120},
                                    {text: '종류', datafield: 'devKind2', width: 130},
                                    {text: '모델', datafield: 'model', width: 130},
                                    {
                                        text: 'In',
                                        columngroup: 'cur',
                                        datafield: 'curInVal',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'cur',
                                        datafield: 'curOutVal',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'In',
                                        columngroup: 'avg',
                                        datafield: 'avgInVal',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'avg',
                                        datafield: 'avgOutVal',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'In',
                                        columngroup: 'max',
                                        datafield: 'maxInVal',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {
                                        text: 'Out',
                                        columngroup: 'max',
                                        datafield: 'maxOutVal',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                ],
                            columngroups:
                                [
                                    {text: '현재', align: 'center', name: 'cur'},
                                    {text: '평균', align: 'center', name: 'avg'},
                                    {text: '최대', align: 'center', name: 'max'},

                                ],
                            ready: function () {
                                //	Main.search();
                            }
                        }, CtxMenu.SVR, '10');
                        $devDiskGrid.on('rowselect', function (event) {
                            var row = event.args.row;
                            var rowindex = event.args.rowindex;
                            rowID = $devDiskGrid.jqxGrid('getrowid', rowindex);
                            Main.searchChart($diskChart, row.mngNo, 5);
                        }).on('bindingcomplete', function (event) {
                            var row = $devDiskGrid.jqxGrid("getrows").length;
                            if (row > 0) rowID = 0;
                            if (rowID == -1) return;
                            var rowindex = $devDiskGrid.jqxGrid("getrowboundindexbyid", rowID);
                            $devDiskGrid.jqxGrid("selectrow", rowindex);
                        });
                        break;
                }
            }
        });

        $('#mainTab').on('selecting', function (tab) {
            var tab = tab.args.item;
            switch (tab) {
                case TAB.DEV_CPU:
                    $('#sFsPDiv').css('display', 'none');
                    $('#sNwPDiv').css('display', 'none');
                    $('#sDiskIoPDiv').css('display', 'none');
                    $('#cbPerfKind').jqxDropDownList({
                        source: HmResource.getResource('svr_cpuKind_list'),
                        selectedIndex: 7
                    });
                    break;
                case TAB.DEV_MEM:
                    $('#sFsPDiv').css('display', 'none');
                    $('#sNwPDiv').css('display', 'none');
                    $('#sDiskIoPDiv').css('display', 'none');
                    $('#cbPerfKind').jqxDropDownList({
                        source: HmResource.getResource('svr_memoryKind_list'),
                        selectedIndex: 0
                    });
                    break;
                case TAB.DEV_FILESYSTEM:
                    $('#sFsPDiv').css('display', 'block');
                    $('#sNwPDiv').css('display', 'none');
                    $('#sDiskIoPDiv').css('display', 'none');
                    $('#cbPerfKind').jqxDropDownList({
                        source: HmResource.getResource('svr_filesystemKind_list'),
                        selectedIndex: 0
                    });
                    break;
                case TAB.DEV_NETWORK:
                    $('#sFsPDiv').css('display', 'none');
                    $('#sNwPDiv').css('display', 'block');
                    $('#sDiskIoPDiv').css('display', 'none');
                    $('#cbPerfKind').jqxDropDownList({
                        source: HmResource.getResource('svr_networkKind_list'),
                        selectedIndex: 0
                    });
                    break;
                case TAB.DEV_DISK:
                    $('#sFsPDiv').css('display', 'none');
                    $('#sNwPDiv').css('display', 'none');
                    $('#sDiskIoPDiv').css('display', 'block');
                    $('#cbPerfKind').jqxDropDownList({
                        source: HmResource.getResource('svr_diskKind_list'),
                        selectedIndex: 0
                    });
                    break;
            }
        });

        $('#section').css('display', 'block');
    },

    /** init data */
    initData: function () {
        /* 구간성능 탭 임시로 삭제 */
        // $('#mainTab').jqxTabs('removeLast');
    },

    createDefaultHighChart: function (chartName, itemType) {
        var cbPerfKind = $('#cbPerfKind').jqxDropDownList('getSelectedItem');
        var orgItem = cbPerfKind.originalItem;
        switch (itemType) {
            case DevPerfType.CPU:
                $cpuChart = new SvrCpuChart(chartName, orgItem);
                $cpuChart.initialize();
                break;
            case DevPerfType.MEMORY:
                $memChart = new SvrMemoryChart(chartName, orgItem);
                $memChart.initialize();
                break;
            case 3:
                $fileChart = new SvrFileSystemChart(chartName, orgItem);
                $fileChart.initialize();
                break;
            case 4:
                $networkChart = new SvrNetworkChart(chartName, orgItem);
                $networkChart.initialize();
                break;
            case 5:
                $diskChart = new SvrDiskChart(chartName, orgItem);
                $diskChart.initialize();
                break;
        }
    },

    /*		/!** TopN 툴바 ... 버튼추가 *!/
            topNToolbarRenderer: function(toolbar, title, type, isChecked) {
                if(isChecked == null) isChecked = false;
                var container = $('<div style="margin: 5px"></div>');
                var span = $('<span style="float: left; font-weight: bold; margin-top: 5px; margin-right: 4px;">' + title + '</span>');
                toolbar.empty();
                toolbar.append(container);
                container.append(span);
                // 우측 체크박스
                var ckbox = $('<div id="ck' + type + '" style="float: right; margin-right: 2px"></div>');
                ckbox.jqxCheckBox({ checked: isChecked });
                container.append(ckbox);
            },*/

    /** 공통 파라미터 */
    getCommParams: function () {
        var params = Main.getSvrGrpParams();
        $.extend(params, HmBoxCondition.getPeriodParams(), HmBoxCondition.getSrchParams(),
            {
                topN: HmBoxCondition.val('sTopN'),
                sortCol: HmBoxCondition.val('sSortType'),
                svrPerfKind: $('#cbPerfKind').val(),
                filesystem: $('#cbPFilesystem').val(),
                network: $('#cbPNetwork').val(),
                diskName: $('#cbPDisk').val(),
            }
        );
        return params;
    },
    getSvrGrpParams: function () {
        var _grpNo = 0, _grpParent = 0, _grpType = 'DEFAULT', _itemKind = 'GROUP';
        var treeItem = HmTreeGrid.getSelectedItem($grpTree);
        if (treeItem != null) {
            _itemKind = treeItem.devKind2;
            _grpNo = _itemKind == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1];
            _grpParent = treeItem.grpParent;
        }
        return {
            grpType: _grpType,
            grpNo: _grpNo,
            grpParent: _grpParent,
            itemKind: _itemKind,
        };
    },
    /** 그룹트리 선택이벤트 */
    selectTree: function () {
        var params = Main.getSvrGrpParams();
        if (params.itemKind == 'GROUP') {
            $('#mainTab').find('ul').children(':first').css('display', 'block');
            $('#mainTab').find('ul').children(':gt(0)').css('display', 'none');
            // $('#sortTypeDiv, #topNDiv').css('display', 'block');
            $('#cbKindDiv').css('display', 'none');
            $('#sFsPDiv').css('display', 'none');
            $('#sNwPDiv').css('display', 'none');
            $('#sSortType, #sTopN').parent().css('display', 'block');
            $('#mainTab').jqxTabs('select', 0);
            $('input:radio[name=sPeriod]').eq(0).next().removeClass('hide');
            $('input:radio[name=sPeriod]').eq(0).click();
        }
        else {
            Main.clearTabData();
            $('#mainTab').find('ul').children(':first').css('display', 'none');
            $('#mainTab').find('ul').children(':gt(0)').css('display', 'block');
            $('#mainTab').find('ul').children(':gt(0)').find('.jqx-tabs-titleWrapper').css("margin-top", "0px");
            // $('#sortTypeDiv, #topNDiv').css('display', 'none');
            $('#cbKindDiv').css('display', 'block');
            $('#sFsPDiv').css('display', 'none');
            $('#sNwPDiv').css('display', 'none');
            $('#sDiskIoPDiv').css('display', 'none');
            $('#sSortType, #sTopN').parent().css('display', 'none');
            $('#mainTab').jqxTabs('select', 1);
            $('input:radio[name=sPeriod]').eq(0).next().addClass('hide');
            $('input:radio[name=sPeriod]').eq(1).click();


            Server.get("/main/popup/svrDetail/getSummary_fileSystemInfo.do", {
                data: {mngNo: params.grpNo},
                success: function (result) {
                    $('#cbPFilesystem').jqxDropDownList('clear');
                    $('#cbPFilesystem').jqxDropDownList({source: result, selectedIndex: 0});
                }
            });

            Server.get("/main/popup/svrDetail/getSummary_networkInterfaceInfo.do", {
                data: {mngNo: params.grpNo},
                success: function (result) {
                    $('#cbPNetwork').jqxDropDownList('clear');
                    $('#cbPNetwork').jqxDropDownList({source: result, selectedIndex: 0});
                }
            });

            Server.get("/main/popup/svrDetail/getDiskDetailList.do", {
                data: {mngNo: params.grpNo},
                success: function (result) {
                    $('#cbPDisk').jqxDropDownList('clear');
                    $('#cbPDisk').jqxDropDownList({source: result, selectedIndex: 0});
                }
            });
        }
        Main.search();
    },

    /** 장비 선택시 탭 데이터 초기화 */
    clearTabData: function () {
        rowID = -1;
        var gridArr = [null, $devCpuGrid, $devMemGrid, $devFileGrid, $devNetworkGrid, null];
        var chartArr = [null, $cpuChart, $memChart, $fileChart, $networkChart, null];
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
        // Master.refreshCbPeriod($cbPeriod);
        switch ($('#mainTab').val()) {
            case TAB.TOP_N:
                HmGrid.updateBoundData($('#cpuGrid'), ctxPath + '/main/sms/svrPerf/getLastCpuTopNList.do');
                HmGrid.updateBoundData($('#memGrid'), ctxPath + '/main/sms/svrPerf/getLastMemoryTopNList.do');
                HmGrid.updateBoundData($('#netWorkInGrid'), ctxPath + '/main/sms/svrPerf/getLastNetWorkInTopNList.do');
                HmGrid.updateBoundData($('#netWorkOutGrid'), ctxPath + '/main/sms/svrPerf/getLastNetWorkOutTopNList.do');
                HmGrid.updateBoundData($('#diskReadGrid'), ctxPath + '/main/sms/svrPerf/getLastDiskIoTopNList.do');
                HmGrid.updateBoundData($('#diskWriteGrid'), ctxPath + '/main/sms/svrPerf/getLastDiskIoTopNList.do');
                HmGrid.updateBoundData($('#fileSystemGrid'), ctxPath + '/main/sms/svrPerf/getLastFileSystemTopNList.do');
                break;
            case TAB.DEV_CPU:
                //this.clearChart($cpuChart);
                var chart = $('#cpuChart').highcharts();
                if (chart !== undefined) {
                    chart.destroy();
                }
                Main.createDefaultHighChart('cpuChart', DevPerfType.CPU);
                HmGrid.updateBoundData($devCpuGrid, ctxPath + '/main/sms/svrPerf/getLastCpuTopNList.do');
                break;
            case TAB.DEV_MEM:
                //this.clearChart($memChart);
                var chart = $('#memChart').highcharts();
                if (chart !== undefined) {
                    chart.destroy();
                }
                Main.createDefaultHighChart('memChart', DevPerfType.MEMORY);
                HmGrid.updateBoundData($devMemGrid, ctxPath + '/main/sms/svrPerf/getLastMemoryTopNList.do');
                break;
            case TAB.DEV_FILESYSTEM:
                //	this.clearChart($fileChart);
                var chart = $('#fileChart').highcharts();
                if (chart !== undefined) {
                    chart.destroy();
                }
                Main.createDefaultHighChart('fileChart', 3);
                HmGrid.updateBoundData($devFileGrid, ctxPath + '/main/sms/svrPerf/getFileSystemPerfList.do');
                break;
            case TAB.DEV_NETWORK:
                //this.clearChart($networkChart);
                var chart = $('#networkChart').highcharts();
                if (chart !== undefined) {
                    chart.destroy();
                }
                Main.createDefaultHighChart('networkChart', 4);
                HmGrid.updateBoundData($devNetworkGrid, ctxPath + '/main/sms/svrPerf/getNetWorkPerfList.do');
                break;
            case TAB.DEV_DISK:
                //this.clearChart($networkChart);
                var chart = $('#diskChart').highcharts();
                if (chart !== undefined) {
                    chart.destroy();
                }
                Main.createDefaultHighChart('diskChart', 5);
                HmGrid.updateBoundData($devDiskGrid, ctxPath + '/main/sms/svrPerf/getDiskIoPerfList.do');
                break;
        }
    },

    clearChart: function (chartObj) { // 차트 초기화
        try {
            chartObj.clearSeriesData();
        } catch (e) {
        }
    },

    /** 차트 조회 */
    searchChart: function (chartObj, mngNo, itemType) {
        var params = Main.getCommParams();
        params.mngNo = mngNo;
        if (itemType == 1) {
            params.itemType = 'CPU';
        } else if (itemType == 2) {
            params.itemType = 'MEM';
        } else if (itemType == 3) {
            params.itemType = 'FS';
        } else if (itemType == 4) {
            params.itemType = 'NETWORK';
        } else if (itemType == 5) {
            params.itemType = 'DISK';
        }
        console.log(chartObj)
        chartObj.searchData(params);
    },

    /** 차트 저장 후 엑셀 출력시 사용*/
    exportExcel_after: function (params) {
        HmUtil.exportExcel(ctxPath + '/main/sms/svrPerf/export.do', params);
    },

    exportExcel: function () {

        var params = this.getCommParams();
        var _tabNm = '', _fname = '';

        switch ($('#mainTab').val()) {

            case TAB.TOP_N:
                _tabNm = 'top';
                params.tabNm = _tabNm;
                HmUtil.exportExcel(ctxPath + '/main/sms/svrPerf/export.do', params);
                break;
            case TAB.DEV_CPU:
                params.tabNm = 'cpu';
                HmUtil.saveHighchart($('#cpuChart').highcharts(), Main.exportExcel_after, params);
                break;
            case TAB.DEV_MEM:
                params.tabNm = 'mem';
                HmUtil.saveHighchart($('#memChart').highcharts(), Main.exportExcel_after, params);
                break;
            case TAB.DEV_FILESYSTEM:
                params.tabNm = 'fileSystem';
                HmUtil.saveHighchart($('#fileChart').highcharts(), Main.exportExcel_after, params);
                break;
            case TAB.DEV_NETWORK:
                params.tabNm = 'network';
                HmUtil.saveHighchart($('#networkChart').highcharts(), Main.exportExcel_after, params);
                break;
            case TAB.DEV_DISK:
                params.tabNm = 'disk';
                HmUtil.saveHighchart($('#diskChart').highcharts(), Main.exportExcel_after, params);
                break;
        }
    },

    customChartData: function (chartData) {
        var series = chartData.series;
        var dateArr = [];

        for (var i = 0; i < series.length; i++) {
            var one_seri = series[i];
            var name = one_seri.name;
            var data = one_seri.data;
            for (var k = 0; k < data.length; k++) {
                var oneDt = data[k];
                var x = oneDt.x;
                var y = oneDt.y; //val
                var tmp_date = new Date(x);
                var ymdhms = HmHighchart.getConvertTime(tmp_date, "-", " ", ":");

                dateArr.push({ymdhms: ymdhms, time: x, val: y});
            }
        }

        // 정렬
        function custonSort(a, b) {
            if (a.ymdhms == b.ymdhms) {
                return 0
            }
            return a.ymdhms > b.ymdhms ? 1 : -1;
        }

        dateArr.sort(custonSort);

        return dateArr;
    },
    perfRenderer: function (row, column, value) {
        var type = $('#cbPerfKind').val();
        if (type == "PHYSICAL_USED_SIZE" || type == "USED_SIZE") {
            var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
            cell += (value == null || value.length == 0) ? value : HmUtil.convertUnit1000(value);
            cell += '</div>';
            return cell;
        } else if (type == "PHYSICAL_USED_PCT" || type == "USED_PCT") {
            var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
            cell += value;
            cell += '</div>';
            return cell;
        } else if (type == "SWAP_USED_SIZE") {
            var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
            cell += (value == null || value.length == 0) ? value : HmUtil.convertUnit1000(value);
            cell += '</div>';
            return cell;
        } else if (type == "SWAP_USED_PCT") {
            var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
            cell += value;
            cell += '</div>';
            return cell;
        }
    },
};

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});