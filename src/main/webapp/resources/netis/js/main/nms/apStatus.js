var $apGrid;
var _apBw = '0';
var dtl_mngNo = -1;
var dtl_apNo = -1;
var dtl_apName = '';
var Main = {
    /** variable */
    initVariable: function () {
        $apGrid = $('#apGrid');
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
                this.search();
                break;
            case 'btnExcel':
                this.exportExcel();
                break;
        }
    },

    /** init design */
    initDesign: function () {
        HmJqxSplitter.createTree($('#mainSplitter'));

        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{
            size: '45%',
            collapsible: false
        }, {size: '55%'}], 'auto', '100%');

        Master.createApGrpTab(Main.selectTree);

        HmGrid.create($apGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        {name: 'grpName', type: 'string'},
                        {name: 'apNo', type: 'number'},
                        {name: 'apMac', type: 'string'},
                        {name: 'apIp', type: 'string'},
                        // { name: 'apIdx', type: 'string' },
                        {name: 'apName', type: 'string'},
                        {name: 'apVer', type: 'string'},
                        {name: 'apModel', type: 'string'},
                        {name: 'apType', type: 'string'},
                        {name: 'apVendor', type: 'string'},
                        {name: 'apSerial', type: 'string'},
                        {name: 'apUptime', type: 'number'},
                        {name: 'apLocation', type: 'string'},
                        {name: 'apStatus', type: 'string'},
                        {name: 'rxByte', type: 'number'},
                        {name: 'txByte', type: 'number'},
                        {name: 'numConn', type: 'number'},
                        {name: 'apCpuLoad', type: 'number'},
                        {name: 'apMemLoad', type: 'number'},
                        {name: 'poeMngNo', type: 'number'},
                        {name: 'poeIfNo', type: 'number'},
                    ]
                },
                {
                    formatData: function (data) {
                        $.extend(data, Master.getApGrpParams());
                        return data;
                    }, beforeLoadComplete: function (records) {
                        var upCnt = 0;
                        var totalCnt = 0;

                        if (records) {
                            totalCnt = records.length;
                            $.each(records, function (i, v) {
                                if (v.apStatus == 'UP')
                                    upCnt++;
                            });
                        }

                        $('#apCnt').html('AP 상태 : <span class="point">' + upCnt + '</span> / <span class="black">' + totalCnt + '</span> ( <span class="point">UP</span> / <span class="black">전체</span> )');
                        return records;

                    }
                }
            ),
            columns:
                [
                    {text: 'POE 장비 번호', datafield: 'poeMngNo', width: 100, hidden: true},
                    {text: 'POE 회선 번호', datafield: 'poeIfNo', width: 100, hidden: true},

                    {text: 'AP 번호', datafield: 'apNo', width: 100, hidden: true},
                    {text: '그룹명', datafield: 'grpName', minwidth: 100, pinned: true},
                    {
                        text: 'AP 명',
                        datafield: 'apName',
                        minwidth: 150,
                        pinned: true,
                        cellsrenderer: HmGrid.apNameRenderer
                    },
                    {text: 'AP Mac', datafield: 'apMac', width: 120, pinned: true},
                    {text: 'AP IP', datafield: 'apIp', width: 100, pinned: true},
                    {text: '접속 Client 수 ', datafield: 'numConn', width: 100, cellsalign: 'right', cellsformat: 'n'},
                    {text: '제조사', datafield: 'apVendor', width: 130, filtertype: 'checkedlist'},
                    {text: '모델', datafield: 'apModel', width: 130, filtertype: 'checkedlist'},
                    {text: 'AP 타입', datafield: 'apType', width: 130, hidden: true},
                    {text: 'AP 시리얼 번호', datafield: 'apSerial', width: 120, hidden: true},
                    {
                        text: "AP 상태",
                        datafield: "apStatus",
                        width: 80,
                        cellsrenderer: HmGrid.apStatusrenderer,
                        filtertype: 'checkedlist'
                    },
                    {text: "AP 구동시간", datafield: "apUptime", width: 140, cellsrenderer: Main.cTimerenderer},
                    {text: "AP 설치 위치", datafield: "apLocation", width: 120},
                    {text: "수신 Byte", datafield: "rxByte", width: 100, cellsrenderer: HmGrid.unit1024renderer},
                    {text: "송신 Byte", datafield: "txByte", width: 100, cellsrenderer: HmGrid.unit1024renderer},
                    {
                        text: "CPU",
                        datafield: "apCpuLoad",
                        width: 100,
                        cellsrenderer: HmGrid.progressbarrenderer,
                        filtertype: "number"
                    },
                    {
                        text: "MEMORY",
                        datafield: "apMemLoad",
                        width: 100,
                        cellsrenderer: HmGrid.progressbarrenderer,
                        filtertype: "number"
                    }
                ]
        }, CtxMenu.AP);

        $apGrid.on('rowdoubleclick', function (event) {
            dtl_mngNo = event.args.row.bounddata.mngNo;
            dtl_apNo = event.args.row.bounddata.apNo;
            // dtl_apIdx = event.args.row.bounddata.apIdx;
            dtl_apName = event.args.row.bounddata.apName;

            Main.searchDtlInfo();

        }).on('bindingcomplete', function (event) {
                try {
                    $(this).jqxGrid('selectrow', 0);
                    dtl_mngNo = $(this).jqxGrid('getcellvalue', 0, 'mngNo');
                    dtl_apNo = $(this).jqxGrid('getcellvalue', 0, 'apNo');
                    // dtl_apIdx = $(this).jqxGrid('getcellvalue', 0, 'apIdx');
                    dtl_apName = $(this).jqxGrid('getcellvalue', 0, 'apName');
                    Main.searchDtlInfo();
                } catch (e) {
                }
            });

        $('#section').css('display', 'block');
    },

    /** init data */
    initData: function () {

    },

    /** 그룹트리 선택이벤트 */
    selectTree: function () {
        Main.search();
    },

    cTimerenderer: function (row, datafield, value) {
        var apVendor = $apGrid.jqxGrid('getcellvalue', row, 'apVendor');
        var result = null;
        if(apVendor == 'SAWWAVE'){
            result = Main.convertCTime_sawwave(value) + 'tt';
        } else {
            result = HmUtil.convertCTime(value);
        }

        return "<div style='margin-top: 6.5px; margin-right: 5px' class='jqx-right-align'>" + result + "</div>";
    },
    convertCTime_sawwave: function (value) {
        var result = '';
        var time = value;
        var year, day, hour, min, result = '';
        if ((60 * 60 * 24 * 100) <= time) {
            year = Math.floor(time / (60 * 60 * 24 * 100));
            time = time - ((60 * 60 * 24 * 100) * year);
            result += year + '년 ';
        }
        if ((60 * 60 * 24) <= time) {
            day = Math.floor(time / (60 * 60 * 24));
            time = time - ((60 * 60 * 24) * day);
            result += day + '일 ';
        }
        if ((60 * 60) <= time) {
            hour = Math.floor(time / (60 * 60));
            time = time - ((60 * 60) * hour);
            result += hour + '시 ';
        }
        if (60 <= time) {
            min = Math.floor(time / 60);
            time = time - (60 * min);
            result += min + '분 ';
        }

        if (time != '' && time != 0) {
            if (isNaN(time)) time = 0;
            if (time < 0) time = 0;
            result += time + '초 ';
        }
        else {
            result += '0초';
        }
        return result;
    },

    /** 조회 */
    search: function () {

        var params = Master.getApGrpParams();
        if (params.grpType == 'FILTER') {
            if (params.filterFlag) {
                Main.searchIf();
            } else {
                alert('선택된 필터가 없습니다.');
                $('#apCnt').html('AP 상태 : <span class="point">0</span> / <span class="black">0</span> ( <span class="point">UP</span> / <span class="black">전체</span> )');
                $apGrid.jqxGrid('clear');
            }
        } else {
            Main.searchIf();
        }

    },
    searchIf: function () {
        HmGrid.updateBoundData($apGrid, ctxPath + '/main/nms/apStatus/getApStatusList.do');
    },

    /** export 엑셀 */
    exportExcel: function () {
        HmUtil.exportGrid($apGrid, 'AP현황', false);
    },
    /** 상세정보 */
    searchDtlInfo: function () {
        PMain.search();
    },
};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});