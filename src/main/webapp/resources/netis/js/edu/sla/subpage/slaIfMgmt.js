var SlaIfMgmt = function() {
    this.infoGrid = null;
    this.code_ispCd = [];
    this.code_speedAmtCd = [];
    this.code_discountCd = [];
    this.editIds = [];
};

SlaIfMgmt.prototype = function() {
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
                    updaterow: function (rowid, rowdata, commit) {
                        if (_this.editIds.indexOf(rowid) == -1) {
                            _this.editIds.push(rowid);
                        }
                        commit(true);
                    },
                    id: 'uniqKey'
                },
                {
                    formatData: function(data) {
                        return JSON.stringify(data);
                    },
                    loadComplete: function(records) {
                        _this.editIds.length = 0;
                    }
                }
            ),
            editable: false,
            selectionmode: 'multiplerowsextended',
            columns: [
                {text: '전용회선번호', datafield: 'asgnNo', width: 120, editable: false, cellsalign: 'center', pinned: true},
                {text: '상위 그룹명', datafield: 'upGrpName', width: 150, editable: false},
                {text: '상위 장비명', datafield: 'upDevName', width: 150, editable: false},
                {text: '상위 IP', datafield: 'upDevIp', width: 120, editable: false},
                {text: '하위 링크', datafield: 'upIfName', width: 150, editable: false},
                {text: '상위 회선', datafield: 'upIfIdx', width: 80, editable: false, hidden: true},
                {text: '하위 그룹명', datafield: 'grpName', width: 150, editable: false},
                {text: '하위 장비명', datafield: 'devName', width: 150, editable: false},
                {text: '하위 IP', datafield: 'devIp', width: 120, editable: false},
                {text: '상위 링크', datafield: 'ifName', width: 150, editable: false},
                {text: '하위 회선', datafield: 'ifIdx', width: 80, editable: false, hidden: false},
                {text: '통신사', datafield: 'disIspCd', width: 80},
                {text: '거리', datafield: 'disDistanceCd', width: 80, editable: false, cellsalign: 'center'},
                {text: '요금코드', datafield: 'disSpeedAmtCd', width: 150},
                {text: '계약 대역폭', datafield: 'slaSpeed', width: 120, cellsrenderer: HmGrid.unit1000renderer},
                {text: '할인코드', datafield: 'disDiscountCd', width: 200},
                {text: '할인율(%)', datafield: 'slaDiscountRate', width: 80, cellsalign: 'right'},
                {text: '월 계약요금', datafield: 'slaAmt', width: 120, cellsalign: 'right', cellsformat: 'n'},
                {text: '월 요금(할인적용)', datafield: 'calcSlaAmt', width: 120, cellsalign: 'right', cellsformat: 'n'}
            ]
            // columns: [
            //     {text: '그룹명', datafield: 'grpName', width: 150, editable: false},
            //     {text: '장비명', datafield: 'devName', width: 200, editable: false},
            //     {text: '회선명', datafield: 'ifName', width: 200, editable: false},
            //     {text: '통신사', datafield: 'wireServiceCd', displayfield: 'disWireServiceCd', width: 120, columntype: 'dropdownlist',
            //         createeditor: function(row, value, editor){
            //             editor.jqxDropDownList({source: _this.code_wireServiceCd, displayMember: 'cdNm', valueMember: 'cdId', autoDropDownHeight: true });
            //         }
            //     },
            //     {text: '요금코드', datafield: 'speedAmtCd', displayfield: 'disSpeedAmtCd', width: 150, columntype: 'dropdownlist',
            //         createeditor: function(row, value, editor){
            //             editor.jqxDropDownList({source: _this.code_speedAmtCd, displayMember: 'cdNm', valueMember: 'cdId', autoDropDownHeight: false });
            //         }
            //     },
            //     {text: '계약 대역폭', datafield: 'slaSpeed', width: 120, cellsrenderer: HmGrid.unit1000renderer, cellsalign: 'right', columntype: 'numberinput',
            //         createeditor: function (row, cellvalue, editor) {
            //             editor.jqxNumberInput({decimalDigits: 0, min: 0, max: 9999999999999999999, digits: 20});
            //         },
            //         validation: function (cell, value) {
            //             if (value < 0 || value > 9999999999999999999) {
            //                 return {result: false, message: '20자리 이내로 값을 입력하세요.'};
            //             }
            //             return true;
            //         }
            //     },
            //     {text: '할인코드', datafield: 'discountCd', displayfield: 'disDiscountCd', width: 200, columntype: 'dropdownlist',
            //         createeditor: function(row, value, editor){
            //             editor.jqxDropDownList({source: _this.code_discountCd, displayMember: 'cdNm', valueMember: 'cdId', autoDropDownHeight: false });
            //         }
            //     },
            //     {text: '요금', datafield: 'monthAmt', width: 120, cellsalign: 'right',
            //         columntype: 'numberinput', cellsformat: 'n',
            //         createeditor: function (row, cellvalue, editor) {
            //             editor.jqxNumberInput({decimalDigits: 0, min: 0, max: 9999999999999999999, digits: 20});
            //         }
            //     }
            // ]
        });
    };

    /** init data */
    var initData = function() {
        var _this = this;
        Server.post('/main/sla/slaMgmt/getSlaCodeList.do', {
            data: {cdKind: 'ISP_CD'},
            success: function(result) {
                _this.code_ispCd.push.apply(_this.code_ispCd, result);
            }
        });
        Server.post('/main/sla/slaMgmt/getSlaCodeList.do', {
            data: {cdKind: 'SPEED_AMT_CD'},
            success: function(result) {
                _this.code_speedAmtCd.push.apply(_this.code_speedAmtCd, result);
            }
        });
        Server.post('/main/sla/slaMgmt/getSlaCodeList.do', {
            data: {cdKind: 'DISCOUNT_CD'},
            success: function(result) {
                _this.code_discountCd.push.apply(_this.code_discountCd, result);
            }
        });
        
        search.call(this);
    };

    /** 조회 */
    var search = function() {
        HmGrid.updateBoundData(this.infoGrid, ctxPath + '/main/sla/slaMgmt/getSlaIfMgmtList.do');
    };

    /** 추가 */
    var add = function() {

        var params = {
            action: 'A',
            dataType: 'IF',
            callbackFn: 'callback',
            addedIds: []
        };

        HmUtil.createPopup(ctxPath + '/main/popup/sla/pSlaIfConf.do', $('#hForm'), 'pSlaIfConf', 1000, 630, params);

    };

    /** 삭제 */
    var del = function() {
        var rows = HmGrid.getRowDataList(this.infoGrid);
        if(rows == null) {
            alert('삭제할 데이터를 선택하세요.');
            return;
        }
        if(!confirm('{0}개의 회선을 삭제하시겠습니까?'.substitute(rows.length))) return;
        var delList = [];
        $.each(rows, function(i, v) {
            delList.push({mngNo: v.mngNo, ifIdx: v.ifIdx});
        });

        var _this = this;
        Server.post('/main/sla/slaMgmt/delSlaIfMgmt.do', {
            data: {list: delList},
            success: function(result) {
                var uids = rows.map(function(d) { return d.uid; });
                _this.infoGrid.jqxGrid('deleterow', uids);
                _this.editIds = _this.editIds.filter(function(d) { return $.inArray(d, uids) === -1; });
                alert('삭제되었습니다.');
            }
        });
    };

    var edit = function() {
        var rows = HmGrid.getRowDataList(this.infoGrid);
        if(rows == null) {
            alert('수정할 데이터를 선택하세요.');
            return;
        }
        // if(rows.length > 1) {
        //     alert('수정할 데이터를 1건만 선택하세요.');
        //     return;
        // }

        var _ids = [];
        $.each(rows, function(i, v) {
            _ids.push({mngNo: v.mngNo, ifIdx: v.ifIdx});
        });

        var params = {
            action: 'U',
            dataType: 'IF',
            callbackFn: 'callback',
            addedIds: JSON.stringify(_ids)
        };
        HmUtil.createPopup(ctxPath + '/main/popup/sla/pSlaIfConf.do', $('#hForm'), 'pSlaIfConf', 1000, 630, params);

    };

    return {
        initVariable: initVariable,
        observe: observe,
        initDesign: initDesign,
        initData: initData
    }
}();

var slaIfMgmt = new SlaIfMgmt();
slaIfMgmt.initVariable();
slaIfMgmt.observe();
slaIfMgmt.initDesign();
slaIfMgmt.initData();

function callback(fn, params) {
    var fn = slaIfMgmt[fn];
    if(typeof fn === 'function') {
        if(params === undefined) fn.call(slaIfMgmt);
        else fn.call(slaIfMgmt, params);
    }
}

// 대상추가 > 회선 callback
function callbackAddTarget(dataType, list) {
    var addList = [];
    $.each(list, function(i, v) {
        var uniqKey = v.mngNo + '_' + v.ifIdx;
        var data = slaIfMgmt.infoGrid.jqxGrid('getrowdatabyid', uniqKey);
        if(data == null) {
            addList.push({
                uniqKey: uniqKey,
                mngNo: v.mngNo, ifIdx: v.ifIdx, grpName: v.grpName, devName: v.disDevName,
                devIp: v.devIp, ifName: v.ifName
            });
        }
    });
    if(addList.length > 0) {
        slaIfMgmt.infoGrid.jqxGrid('addrow', null, addList);
        var ids = addList.map(function(d) { return d.uniqKey; });
        slaIfMgmt.editIds.push.apply(slaIfMgmt.editIds, ids);
    }
}

