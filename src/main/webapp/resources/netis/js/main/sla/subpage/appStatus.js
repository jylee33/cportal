var AppStatus = function() {
    this.infoGrid = null;
    this.code_wireServiceCd = [];
    this.code_speedAmtCd = [];
    this.code_discountCd = [];
    this.editIds = [];
};

AppStatus.prototype = function() {
    var initVariable = function() {
        this.infoGrid = $('#infoGrid');
    };

    var observe = function() {
        $('#contents button').bind('click', eventControl.bind(this));
        $('#contents .searchBox input:text').bind('keyup', keyupEventControl.bind(this));
    };

    /** event handler */
    var eventControl = function(event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch': search.call(this); break;
            case 'btnAdd': add.call(this); break;
            case 'btnDel': del.call(this); break;
            case 'btnEdit': edit.call(this); break;
            case 'btnExcel': exportExcel.call(this); break;
        }
    };

    /** keyup event handler */
    var keyupEventControl = function(event) {
        if(event.keyCode == 13) {
            search();
        }
    };

    /** init design */
    var initDesign = function() {
        var _this = this;
        HmGrid.create(this.infoGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'post',
                    contentType: 'application/json',
                    id: 'uniqKey',
                    datafields: [
                        {type: 'string', name: 'appNo'},
                        {type: 'string', name: 'disIspCd'},
                        {type: 'string', name: 'agncNm'},
                        {type: 'string', name: 'asgnNo'},
                        {type: 'string', name: 'appYmd'},
                        {type: 'string', name: 'endYmd'},
                        // {type: 'string', name: ''},
                        {type: 'string', name: 'disAppKindCd'},
                        {type: 'string', name: 'disAppStatCd'},
                        {type: 'string', name: 'disSpeedAmtCd'},
                        {type: 'string', name: 'slaSpeed'},
                        {type: 'number', name: 'ispSpeed'},
                        {type: 'string', name: 'disDistanceCd'}
                    ]
                },
                {
                    formatData: function(data) {
                        return JSON.stringify(data);
                    }
                }
            ),
            editable: false,
            pagerheight: 27,
            pagerrenderer : HmGrid.pagerrenderer,
            columns: [
                {text: 'No.', datafield: '', width: 50, cellsrenderer: HmGrid.rownumrenderer2, cellsalign: 'right',
                    columntype: 'number', sortable: false, filterable: false},
                {text: '신청번호', datafield: 'appNo', width: 150, cellsalign: 'center'},
                {text: '통신사업자', datafield: 'disIspCd', width: 100},
                {text: '이용기관', datafield: 'agncNm', width: 200},
                {text: '전용회선번호', datafield: 'asgnNo', width: 120, cellsalign: 'center'},
                {text: '신청일', datafield: 'appYmd', width: 130, cellsalign: 'center'},
                {text: '개통(해지)일', datafield: 'endYmd', width: 130, cellsalign: 'center'},
                {text: '사용종료일', width: 130, cellsalign: 'center'},
                {text: '신청분류', datafield: 'disAppKindCd', width: 100, cellsalign: 'center'},
                {text: '처리상태', datafield: 'disAppStatCd', width: 130, cellsalign: 'center'},
                // {text: '회선상태', width: 100},
                {text: '서비스명', datafield: 'disSpeedAmtCd', width: 150},
                {text: '속도', width: 90, datafield: 'slaSpeed', cellsrenderer: HmGrid.unit1000renderer},
                {text: '속도(사업자)', datafield: 'ispSpeed', width: 90, cellsrenderer: HmGrid.unit1000renderer},
                {text: '거리', datafield: 'disDistanceCd', width: 70, cellsalign: 'center'}
            ]
        });
    };

    /** init data */
    var initData = function() {
        var _this = this;
        // Server.post('/main/sla/slaMgmt/getSlaCodeList.do', {
        //     data: {cdKind: 'WIRE_SERVICE_CD'},
        //     success: function(result) {
        //         _this.code_wireServiceCd.push.apply(_this.code_wireServiceCd, result);
        //     }
        // });
        // Server.post('/main/sla/slaMgmt/getSlaCodeList.do', {
        //     data: {cdKind: 'SPEED_AMT_CD'},
        //     success: function(result) {
        //         _this.code_speedAmtCd.push.apply(_this.code_speedAmtCd, result);
        //     }
        // });
        // Server.post('/main/sla/slaMgmt/getSlaCodeList.do', {
        //     data: {cdKind: 'DISCOUNT_CD'},
        //     success: function(result) {
        //         _this.code_discountCd.push.apply(_this.code_discountCd, result);
        //     }
        // });
        
        search.call(this);
    };

    /** 조회 */
    var search = function() {
        HmGrid.updateBoundData(this.infoGrid, ctxPath + '/main/sla/appMgmt/getSlaAppList.do');
    };

    /** 추가 */
    var add = function() {
        var params = {
            action: 'A'
        };
        $.post(ctxPath + '/main/popup/sla/pSlaAppAdd.do', params,
            function(result) {
                HmWindow.open($('#pwindow'), '이용신청', result, 1000, 700);
            }
        );
    };

    /** 삭제 */
    var del = function() {
        var rowdata = HmGrid.getRowData(this.infoGrid);
        if(rowdata == null) {
            alert('삭제할 데이터를 선택하세요.');
            return;
        }
        if(!confirm('선택된 신청관리를 삭제하시겠습니까?')) return;
        var _this = this;
        Server.post('/main/sla/appMgmt/delSlaApp.do', {
            data: {appNo: rowdata.appNo},
            success: function(result) {
                _this.infoGrid.jqxGrid('deleterow', rowdata.uid);
                alert('삭제되었습니다.');
            }
        });
    };

    var edit = function() {
        var rowdata = HmGrid.getRowData(this.infoGrid);
        if(rowdata == null) {
            alert('수정할 데이터를 선택하세요.');
            return;
        }

        var params = {
            action: 'U',
            callbackFn: 'callback',
            appNo: rowdata.appNo
        };

        $.post(ctxPath + '/main/popup/sla/pSlaAppAdd.do', params,
            function(result) {
                HmWindow.open($('#pwindow'), '이용신청', result, 1000, 700);
            }
        );
    };

    var exportExcel = function() {
        HmUtil.exportGrid(this.infoGrid, '이용신청현황', false);
    };

    return {
        initVariable: initVariable,
        observe: observe,
        initDesign: initDesign,
        initData: initData
    }
}();

var appStatus = new AppStatus();
appStatus.initVariable();
appStatus.observe();
appStatus.initDesign();
appStatus.initData();

function callback(fn, params) {
    var fn = appStatus[fn];
    if(typeof fn === 'function') {
        if(params === undefined) fn.call(appStatus);
        else fn.call(appStatus, params);
    }
}
