var $infoGrid;


var Main = {
    /** variable */
    initVariable: function () {

        $infoGrid = $("#infoGrid");

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

            case 'btnAprCfm':
                this.aprConfirm();
                break;

            case 'btnIfConf':
                this.setIfConf();
                break;

            case 'btnComplete':
                this.openSvc();
                break;

            // case 'btnChgAppr':
            //     this.changeSvc();
            //     break;

            case 'btnChange':
                this.change();
                break;

            case 'btnCancel':
                this.cancel();
                break;

            case 'btnAdd':
                this.add();
                break;

            case 'btnDel':
                this.del();
                break;

            // case 'btnEdit':
            //     this.edit();
            //     break;

            case 'btnExcel':
                this.exportExcel();
                break;

        }
    },

    /** init design */
    initDesign: function () {

        HmDate.create($('#sDate1'), $('#sDate2'), HmDate.DAY, 14, HmDate.FS_SHORT);

        HmGrid.create($infoGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'post',
                    contentType: 'application/json',
                    id: 'uniqKey',
                    datafields: [
                        {type: 'string', name: 'agncCd'},
                        {type: 'string', name: 'appNo'},
                        {type: 'string', name: 'asgnNo'},
                        {type: 'string', name: 'disIspCd'},
                        {type: 'string', name: 'ispCd'},
                        {type: 'string', name: 'svcNo'},
                        {type: 'string', name: 'agncNms'},
                        {type: 'string', name: 'zipNm'},
                        {type: 'string', name: 'appYmd'},
                        {type: 'string', name: 'endYmd'},
                        {type: 'string', name: 'wishYmd'},
                        {type: 'string', name: 'appKnd'},
                        {type: 'string', name: 'disAppKindCd'},
                        {type: 'string', name: 'appStat'},
                        {type: 'string', name: 'disAppStatCd'},
                        {type: 'string', name: 'disSpeedAmtCd'},
                        {type: 'string', name: 'speed'},
                        {type: 'string', name: 'speedAmtCd'},
                        {type: 'string', name: 'amt'},
                        {type: 'string', name: 'dist'},
                        {type: 'string', name: 'disDistanceCd'},
                        {type: 'string', name: 'distanceCd'}
                    ]
                },
                {
                    formatData: function (data) {

                        $.extend(data, Main.getCommParams());
                        return JSON.stringify(data);

                    }
                }
            ),
            editable: false,
            selectionmode: 'multiplerowsextended',
            pagerheight: 27,
            pagerrenderer: HmGrid.pagerrenderer,
            columns: [
                {
                    text: 'No.',
                    datafield: '',
                    width: 50,
                    cellsrenderer: HmGrid.rownumrenderer2,
                    cellsalign: 'right',
                    columntype: 'number',
                    sortable: false,
                    filterable: false
                },
                {text: '신청번호', datafield: 'appNo', width: 200, cellsalign: 'center'},
                {text: '서비스 정보', datafield: 'svcNo', width: 200, cellsalign: 'center'},
                {text: '전용회선번호', datafield: 'asgnNo', width: 200, cellsalign: 'center'},
                {text: '통신사업자', datafield: 'disIspCd', width: 200, cellsalign: 'center'},
                {text: 'ISP_CD', datafield: 'ispCd', width: 200, cellsalign: 'center', hidden: true},
                {text: '이용기관코드', datafield: 'agncCd', width: 400, hidden: true},
                {text: '이용기관', datafield: 'agncNms', width: 400},
                {text: '주소', datafield: 'zipNm', width: 400, cellsalign: 'center'},
                {text: '신청일', datafield: 'appYmd', width: 150, cellsalign: 'center'},
                {text: '개통 희망일', datafield: 'wishYmd', width: 150, cellsalign: 'center'},
                {text: '개통 완료일', datafield: 'endYmd', width: 150, cellsalign: 'center'},
                {text: '신청분류', datafield: 'disAppKindCd', width: 100, cellsalign: 'center'},
                {text: '처리상태', datafield: 'disAppStatCd', width: 150, cellsalign: 'center'},
                {text: '속도', datafield: 'speed', width: 150, cellsalign: 'center'},
                {text: 'SPEED_CD', datafield: 'speedAmtCd', width: 150, cellsalign: 'center', hidden: true},
                {text: '요금', datafield: 'amt', width: 150, cellsrenderer: HmGrid.commaNumrenderer},
                // {text: '거리', datafield: 'disDistanceCd', width: 150, cellsalign: 'center'},
                {text: 'DIS_CD', datafield: 'distanceCd', width: 150, cellsalign: 'center', hidden: true}
            ]
        });

        HmGrid.updateBoundData($infoGrid, ctxPath + '/edu/sla/slaMgmt/getSlaMgmtList.do');

    },

    /** init data */
    initData: function () {
    },


    search: function () {
        HmGrid.updateBoundData($infoGrid, ctxPath + '/edu/sla/slaMgmt/getSlaMgmtList.do');
    },


    aprConfirm: function () {

        var rowIdx = HmGrid.getRowIdx($infoGrid, "이용신청 항목을 선택해주세요.");

        if (rowIdx < 0) {
            return false;
        }

        var rowData = HmGrid.getRowData($infoGrid, rowIdx);

        var params = {
            action: 'U',
            callbackFn: 'callback',
            appNo: rowData.appNo,
            appYmd: rowData.appYmd.replace(/\-/g, ''),
            asgnNo: rowData.asgnNo,
            agncNm: rowData.agncNms,
            agncAddr: rowData.zipNm,
            agncUserNm: null,
            upperAgncNm: null,
            upperAgncUserNm: null,
            upperAgncAddr: null,
            upperPlace: null,
            lowerAgncNm: null,
            lowerAgncUserNm: null,
            lowerAgncAddr: null,
            lowerPlace: null,
            payAgncNm: null,
            payAgncUserNm: null,
            payAgncAddr: null,
            ispSpeed: null,
            ispCd: rowData.ispCd,
            appKindCd: rowData.appKnd,
            appStatCd: '0003',
            speedAmtCd: rowData.speedAmtCd,
            distanceCd: rowData.distanceCd,
            wishYmd: rowData.wishYmd.replace(/\-/g, '')
        };

        if (rowData.appStat != '0007') {
            alert("이용신청 접수 대상이 아닙니다.");
            return false;
        }

        if (rowData.appKnd == 'A001') {
            $.post(ctxPath + '/edu/popup/sla/pSlaAprCfm.do', params,
                function (result) {
                    HmWindow.open($('#pwindow'), '이용신청 접수일', result, 400, 150);
                }
            );
        } else {
            alert("접수 대상이 아닙니다.");
        }

    },

    setIfConf: function () {

        var rowIdx = HmGrid.getRowIdx($infoGrid, "신청항목을 선택해주세요.");

        if (rowIdx < 0) {
            return false;
        }

        var rowData = HmGrid.getRowData($infoGrid, rowIdx);


        if (rowData.appStat != '0003') {
            alert('이용 신청 접수가 완료된 항목이 아닙니다.')
            return false;
        }


        var params = {
            appNo: rowData.appNo,
            wishYmd: rowData.wishYmd.replace(/\-/g, ''),
            action: 'U',
            dataType: 'IF',
            callbackFn: 'callback',
            agncCd: rowData.agncCd,
            asgnNo: rowData.asgnNo,
            ispCd: rowData.ispCd
        };

        HmUtil.createPopup(ctxPath + '/edu/popup/sla/pSlaIfConf.do', $('#hForm'), 'pSlaIfConf', 1000, 350, params);

    },


    openSvc: function () {

        var rowIdx = HmGrid.getRowIdx($infoGrid, "신청항목을 선택해주세요.");
        if (rowIdx < 0) {
            return false;
        }

        var rowData = HmGrid.getRowData($infoGrid, rowIdx);

        var params = {

            callbackFn: 'callback',
            appNo: rowData.appNo,
            appYmd: rowData.appYmd.replace(/\-/g, ''),
            asgnNo: rowData.asgnNo,
            agncNm: rowData.agncNms,
            agncAddr: rowData.zipNm,

            agncUserNm: null,
            upperAgncNm: null,
            upperAgncUserNm: null,
            upperAgncAddr: null,
            upperPlace: null,

            lowerAgncNm: null,
            lowerAgncUserNm: null,
            lowerAgncAddr: null,
            lowerPlace: null,
            payAgncNm: null,

            payAgncUserNm: null,
            payAgncAddr: null,

            ispSpeed: null,
            ispCd: rowData.ispCd,

            appKindCd: rowData.appKnd,
            appStatCd: '0006',

            speedAmtCd: rowData.speedAmtCd,
            distanceCd: rowData.distanceCd,
            wishYmd: rowData.wishYmd.replace(/\-/g, ''),

            // endYmd: rowData.endYmd.replace(/\-/g, '')

        };


        if (rowData.appStat == '0007' || rowData.asgnNo == null) {
            alert("회선설정을 완료해주세요.");
            return false;
        }

        if (rowData.appStat == '0006') {
            alert("개통완료 처리된 신청내역입니다.");
            return false;
        }


        if (rowData.appKnd == 'A001') {
            $.post(ctxPath + '/edu/popup/sla/pSlaAppr.do', params,
                function (result) {
                    HmWindow.open($('#pwindow'), '개통완료일', result, 400, 150);
                }
            );
        } else if (rowData.appKnd == 'A002') {

            if (!confirm('변경대상을 승인하시겠습니까?')) return;

            $.extend(params, {
                appStatCd: '0005',
                endYmd: rowData.endYmd.replace(/\-/g, '')
            });

            Server.post('/edu/sla/slaMgmt/saveSlaApp.do', {
                data: params,
                success: function (result) {
                    try {
                        if (!confirm('승인되었습니다.')) return;
                        Main.search();

                    } catch (e) {
                        console.log(e);
                    }
                }
            });
        } else {

            if (!confirm("해지 승인하시겠습니까?")) return;

            $.extend(params, {
                appStatCd: '0009',
                endYmd: rowData.endYmd.replace(/\-/g, '')
            });

            Server.post('/edu/sla/slaMgmt/saveSlaApp.do', {
                data: params,
                success: function (result) {
                    try {
                        $('#pbtnClose').click();
                        Main.search();
                    } catch (e) {
                        console.log(e);
                    }
                }
            });

        }

    },


    changeSvc: function () {

        var rowIdx = HmGrid.getRowIdx($infoGrid, "신청항목을 선택해주세요.");

        if (rowIdx < 0) {
            return false;
        }

        var rowData = HmGrid.getRowData($infoGrid, rowIdx);

        var params = {

            appNo: rowData.appNo,
            appYmd: rowData.appYmd.replace(/\-/g, ''),
            asgnNo: rowData.asgnNo,
            agncNm: rowData.agncNms,
            agncAddr: rowData.zipNm,

            agncUserNm: null,
            upperAgncNm: null,
            upperAgncUserNm: null,
            upperAgncAddr: null,
            upperPlace: null,

            lowerAgncNm: null,
            lowerAgncUserNm: null,
            lowerAgncAddr: null,
            lowerPlace: null,
            payAgncNm: null,

            payAgncUserNm: null,
            payAgncAddr: null,

            ispSpeed: null,
            ispCd: null,

            appKindCd: rowData.appKnd,
            appStatCd: '0006',
            speedAmtCd: rowData.speedAmtCd,
            distanceCd: rowData.dist,
            wishYmd: rowData.wishYmd.replace(/\-/g, ''),
            endYmd: rowData.endYmd.replace(/\-/g, ''),
        };


        if (rowData.appStat == '0007' && rowData.asgnNo == null) {
            alert("회선설정을 완료해주세요.");
            return false;
        }

        if (rowData.appKnd != 'A002') {
            alert("변경승인 대상이 아닙니다");
            return false;
        }

        if (rowData.appStat == '0006') {
            alert("변경완료된 내역입니다.");
            return false;
        }

        if (!confirm('변경대상을 승인하시겠습니까?')) return;

        Server.post('/edu/sla/slaMgmt/saveSlaApp.do', {
            data: params,
            success: function (result) {
                try {
                    if (!confirm('승인되었습니다.')) return;
                } catch (e) {
                    console.log(e);
                }
            }
        });

    },


    /** 추가 */
    add: function () {

        var params = {
            action: 'A',
            callbackFn: 'callback',
        };

        $.post(ctxPath + '/edu/popup/sla/pSlaAppAdd.do', params,
            function (result) {
                HmWindow.open($('#pwindow'), '이용신청', result, 1200, 250);
            }
        );

    },


    /** 삭제 */
    del: function () {

        var rowindexes = HmGrid.getRowIdxes($infoGrid, "대상을 선택해주세요.");
        var rowData = HmGrid.getRowDataList($infoGrid, rowindexes);

        var _list = [];

        for (var prop in rowData) {
            _list.push(rowData[prop]);
        }

        if (_list.length == 0) {
            alert('삭제할 데이터를 선택하세요.');
            return;
        }

        if (!confirm('선택된 신청관리를 삭제하시겠습니까?')) return;
        Server.post('/edu/sla/slaMgmt/delSlaIf.do', {
            data: {list: _list},
            success: function (result) {
                for (var i = 0; i < rowData.length; i++) {
                    $infoGrid.jqxGrid('deleterow', rowData[i].uid);
                }
                alert('삭제되었습니다.');
            }
        });

    },

    edit: function () {

        var rowdata = HmGrid.getRowData($infoGrid);

        if (rowdata == null) {
            alert('수정할 데이터를 선택하세요.');
            return;
        }

        var params = {
            action: 'U',
            callbackFn: 'callback',
            appNo: rowdata.appNo
        };

        $.post(ctxPath + '/edu/popup/sla/pSlaAppEdit.do', params,
            function (result) {
                HmWindow.open($('#pwindow'), '이용신청 수정', result, 1000, 300);
            }
        );

    },


    change: function () {

        var rowdata = HmGrid.getRowData($infoGrid);

        if (rowdata == null) {
            alert('변경 신청 할 대상을 선택하세요.');
            return;
        }

        if (rowdata.appStat != '0006') {
            alert("처리 완료된 내역만 변경신청 가능 합니다.");
            return false;
        }

        var params = {
            action: 'U',
            callbackFn: 'callback',
            appNo: rowdata.appNo
        };

        $.post(ctxPath + '/edu/popup/sla/pSlaAppChg.do', params,
            function (result) {
                HmWindow.open($('#pwindow'), '변경신청', result, 1000, 300);
            }
        );

    },


    cancel: function () {

        var rowdata = HmGrid.getRowData($infoGrid);

        if (rowdata == null) {
            alert('해지 신청할 대상을 선택하세요.');
            return;
        }

        if (rowdata.appStat == '0006' || rowdata.appStat == '0005') {

        } else {
            alert("처리 완료된 내역만 해지신청 가능 합니다.");
            return false;
        }

        var params = {
            action: 'U',
            callbackFn: 'callback',
            appNo: rowdata.appNo
        };

        $.post(ctxPath + '/edu/popup/sla/pSlaAppCancel.do', params,
            function (result) {
                HmWindow.open($('#pwindow'), '해지신청', result, 1000, 300);
            }
        );

    },

    /** export Excel */
    exportExcel: function () {

        HmUtil.exportGrid($infoGrid, '이용신청현황', false);

    },

    getCommParams: function () {

        var params = {
            period: 'true',
            date1: HmDate.getDateStr($('#sDate1')),
            date2: HmDate.getDateStr($('#sDate2')),
        };

        return params;

    }
};

function callback(fn, params) {
    var fn = appStatus[fn];
    if (typeof fn === 'function') {
        if (params === undefined) fn.call(appStatus);
        else fn.call(appStatus, params);
    }
}


function refreshSlaApp() {
    HmGrid.updateBoundData($infoGrid, ctxPath + '/edu/sla/slaMgmt/getSlaMgmtList.do');
}


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});