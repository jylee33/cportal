var $p_apGrid;

$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});

var PMain = {
    /** variable */
    initVariable: function () {
        $p_apGrid = $('#p_apGrid');
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            PMain.eventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'pbtnSearch':
                this.search();
                break;
        }
    },

    /** init design */
    initDesign: function () {
        HmGrid.create($p_apGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: ctxPath + '/main/nms/apStatus/getApStatusList.do'
                },
                {
                    formatData: function (data) {
                        data.grpType = 'DEFAULT';
                        data.itemKind = 'DEV';
                        data.grpNo = $('#pMngNo').val();
                        data.apBw = 0;
                        return data;
                    }
                }
            ),
            columns:
                [
                    {text: 'AP 명', datafield: 'apName', minwidth: 120, pinned: true, cellsrenderer: PMain.linkrenderer},
                    {text: 'AP Mac', datafield: 'apMac', width: 130, pinned: true},
                    {text: 'AP IP', datafield: 'apIp', width: 120, pinned: true},
                    {text: '접속 Client 수 ', datafield: 'numConn', width: 100, cellsalign: 'right', cellsformat: 'n'},
                    {text: 'AP 모델', datafield: 'apType', width: 130},
                    {text: 'AP 시리얼 번호', datafield: 'apSerial', width: 130},
                    {text: "AP 상태", datafield: "apStatus", width: 80},
                    {text: "AP 구동시간", datafield: "apUptime", width: 140, cellsrenderer: HmGrid.cTimerenderer},
                    {text: "AP 설치 위치", datafield: "apLocation", width: 120},
                    {text: "수신 Byte", datafield: "rxByte", width: 100, cellsrenderer: HmGrid.unit1024renderer},
                    {text: "송신 Byte", datafield: "txByte", width: 100, cellsrenderer: HmGrid.unit1024renderer}
                ]
        }, CtxMenu.AP);
    },

    /** init data */
    initData: function () {
        PMain.search();
    },

    search: function () {
        HmGrid.updateBoundData($p_apGrid);
    },

    linkrenderer: function (row, column, value) {
        return '<div style="margin-left: 2px; margin-top: 2px;"><a href="javascript: PMain.showApDetail(' + row + ')">' + value + '</a></div>';
    },


    showApDetail: function (row) {

        var rowdata = $p_apGrid.jqxGrid('getrowdata', row);


        console.log("AP DETAIL : " + JSON.stringify(rowdata));

        if (rowdata == null) return;
        var params = {
            apNo: rowdata.apNo,
            apName: rowdata.apName
        };
        HmUtil.createPopup('/main/popup/nms/pApDetail.do', $('#hForm'), HmUtil.generateUUID(), 1200, 660, params);
    }

};
