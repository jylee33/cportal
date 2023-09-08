var ctxmenuIdx = 1;


var WeeklyRpt = {

    $weeklyGrid: null,
    $grpTree: null,

    /** variable */
    initialize: function () {
        this.initVariable();
        this.observe();
        this.initDesign();
        this.initData();
    },

    initVariable: function () {
        this.$weeklyGrid = $("#weeklyGrid");
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            WeeklyRpt.eventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearchWeekly':
                WeeklyRpt.search();
                break;
            case 'btnExcelWeekly':
                WeeklyRpt.exportExcel();
                break;
        }
    },


    /** init design */
    initDesign: function () {


        HmJqxSplitter.createTree($('#mainSplitter_weekly'));

        $('#sDate1_weekly').jqxDateTimeInput({
            width: 120,
            height: 21,
            theme: jqxTheme,
            formatString: 'yyyy-MM-dd',
            culture: 'ko-KR',
            views: ['month', 'year', 'decade']
        });
        $('#sDate1_weekly').val(new Date());


        Master.createGrpTab(WeeklyRpt.search(), {devKind1: 'DEV'});


        HmGrid.create(WeeklyRpt.$weeklyGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'post',
                    contenttype: 'application/json;charset=utf8;',
                    datafields: [ // 필터위해 추가
                        {name: 'grpName', type: 'string'},
                        {name: 'mngNo', type: 'string'},
                        {name: 'devName', type: 'string'},
                        {name: 'devIp', type: 'string'},
                        {name: 'devKind1', type: 'string'},
                        {name: 'devKind2', type: 'string'},
                        {name: 'vendor', type: 'string'},
                        {name: 'model', type: 'string'},

                        {name: 'cpuMon', type: 'number'},
                        {name: 'cpuTue', type: 'number'},
                        {name: 'cpuWed', type: 'number'},
                        {name: 'cpuThu', type: 'number'},
                        {name: 'cpuFri', type: 'number'},
                        {name: 'cpuSat', type: 'number'},
                        {name: 'cpuSun', type: 'number'},

                        {name: 'memMon', type: 'number'},
                        {name: 'memTue', type: 'number'},
                        {name: 'memWed', type: 'number'},
                        {name: 'memThu', type: 'number'},
                        {name: 'memFri', type: 'number'},
                        {name: 'memSat', type: 'number'},
                        {name: 'memSun', type: 'number'},

                        {name: 'ifMon', type: 'number'},
                        {name: 'ifTue', type: 'number'},
                        {name: 'ifWed', type: 'number'},
                        {name: 'ifThu', type: 'number'},
                        {name: 'ifFri', type: 'number'},
                        {name: 'ifSat', type: 'number'},
                        {name: 'ifSun', type: 'number'}


                    ]
                },
                {
                    formatData: function (data) {
                        $.extend(data, Master.getGrpTabParams(), {
                            rfDate: HmDate.getDateStr($('#sDate1_weekly'))
                        });
                        return JSON.stringify(data);
                    },
                    loadComplete: function (records) {
                    }
                }
            ),
            columns:
                [
                    {text: '장비번호', columngroup: 'devInfo', datafield: 'mngNo', width: 100, hidden: true},
                    {text: 'IP', columngroup: 'devInfo', datafield: 'devIp', width: 80},
                    {
                        text: '장비명',
                        columngroup: 'devInfo',
                        datafield: 'devName',
                        width: 120,
                        cellsrenderer: HmGrid.devNameRenderer
                    },
                    {
                        text: '장비종류',
                        columngroup: 'devInfo',
                        datafield: 'devKind2',
                        width: 100,
                        filtertype: 'checkedlist'
                    },
                    {text: '모델', columngroup: 'devInfo', datafield: 'model', width: 110, filtertype: 'checkedlist'},
                    {text: '그룹', columngroup: 'devInfo', datafield: 'grpName', width: 100},
                    {text: '타입', columngroup: 'devInfo', datafield: 'devKind1', width: 100, hidden: true},
                    {
                        text: '제조사',
                        columngroup: 'devInfo',
                        datafield: 'vendor',
                        width: 130,
                        filtertype: 'checkedlist',
                        hidden: true
                    },
                    // { text:  '장비위치', columngroup: 'devInfo', datafield: 'devLocation', width: 150, hidden: true  },

                    {
                        text: '월',
                        columngroup: 'cpu',
                        datafield: 'cpuMon',
                        width: 70,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '화',
                        columngroup: 'cpu',
                        datafield: 'cpuTue',
                        width: 70,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '수',
                        columngroup: 'cpu',
                        datafield: 'cpuWed',
                        width: 70,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '목',
                        columngroup: 'cpu',
                        datafield: 'cpuThu',
                        width: 70,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '금',
                        columngroup: 'cpu',
                        datafield: 'cpuFri',
                        width: 70,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '토',
                        columngroup: 'cpu',
                        datafield: 'cpuSat',
                        width: 70,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },


                    {
                        text: '월',
                        columngroup: 'mem',
                        datafield: 'memMon',
                        width: 70,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '화',
                        columngroup: 'mem',
                        datafield: 'memTue',
                        width: 70,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '수',
                        columngroup: 'mem',
                        datafield: 'memWed',
                        width: 70,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '목',
                        columngroup: 'mem',
                        datafield: 'memThu',
                        width: 70,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '금',
                        columngroup: 'mem',
                        datafield: 'memFri',
                        width: 70,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '토',
                        columngroup: 'mem',
                        datafield: 'memSat',
                        width: 70,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },

                    {
                        text: '월',
                        columngroup: 'crc',
                        datafield: 'ifMon',
                        width: 70,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '화',
                        columngroup: 'crc',
                        datafield: 'ifTue',
                        width: 70,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '수',
                        columngroup: 'crc',
                        datafield: 'ifWed',
                        width: 70,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '목',
                        columngroup: 'crc',
                        datafield: 'ifThu',
                        width: 70,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '금',
                        columngroup: 'crc',
                        datafield: 'ifFri',
                        width: 70,
                        cellsrenderer: HmGrid.progressbarrenderer
                    },
                    {
                        text: '토',
                        columngroup: 'crc',
                        datafield: 'ifSat',
                        width: 70,
                        cellsrenderer: HmGrid.progressbarrenderer
                    }
                ],
            columngroups:
                [
                    {text: '장비정보', align: 'center', name: 'devInfo'},
                    {text: 'CPU(MAX)', align: 'center', name: 'cpu'},
                    {text: 'MEMORY(MAX)', align: 'center', name: 'mem'},
                    {text: 'CRC', align: 'center', name: 'crc', hidden: false},
                ]
        }, CtxMenu.DEV, ctxmenuIdx++);


    },

    /** init data */
    initData: function () {

    },

    /** 주간 성능 데이터 (MAX) 조회 */
    search: function () {

        HmGrid.updateBoundData(WeeklyRpt.$weeklyGrid, ctxPath + '/main/rpt/dailyInspRpt/getWeeklyPerfList.do');

        // Server.post('/main/rpt/dailyInspRpt/getWeeklyPerfList.do', {
        //     data: {rfDate: HmDate.getDateStr($("#sDate1_weekly"))},
        //     success: function (result) {
        //         console.log(result)
        //     }
        // });

    },

    exportExcel: function () {

        HmUtil.exportGrid(WeeklyRpt.$weeklyGrid , '주간성능', false);

    }

};