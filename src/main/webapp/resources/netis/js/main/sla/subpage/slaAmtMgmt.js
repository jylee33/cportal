var SlaAmtMgmt = function() {
    this.infoGrid = null;
    this.editIds = [];
};

SlaAmtMgmt.prototype = function() {
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
            case 'btnSave': save.call(this); break;
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
        HmDropDownList.create($('#sIspCd'), {
            source: HmDropDownList.getSourceByUrl('/main/sla/slaMgmt/getSlaCodeList.do',
                {cdKind: 'ISP_CD'}, 'post'),
            width: 150, displayMember: 'cdNm', valueMember: 'cdId', selectedIndex: 0
        }).on('bindingComplete', function() {
            $(this).jqxDropDownList('insertAt', {cdNm: '전체', cdId: -1}, 0);
        });

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
                    }
                },
                {
                    formatData: function(data) {
                        var _sIspCdItem = $('#sIspCd').jqxDropDownList('getSelectedItem');
                        data.sIspCd = _sIspCdItem == null? -1 : _sIspCdItem.value;
                        return JSON.stringify(data);
                    },
                    beforeLoadComplete: function(records) {
                        $.each(records, function(i,v) {
                            if(v.cdVal3 != null) v.cdVal3 = parseFloat(v.cdVal3);
                        });
                    },
                    loadComplete: function(records) {
                        _this.editIds.length = 0;
                    }
                }
            ),
            editable: true,
            columns: [
                {text: '코드분류', datafield: 'cdKind', width: 100, hidden: true, editable: false},
                {text: '코드ID', datafield: 'cdId', width: 100, hidden: true, editable: false},
                {text: '통신사업자', datafield: 'ispCdNm', width: 100, editable: false},
                {text: '속도', datafield: 'speedCdNm', width: 150, cellsalign: 'right', editable: false},
                {text: '월 요금', datafield: 'cdVal3', width: 150, cellsalign: 'right',
                    columntype: 'numberinput', cellsformat: 'n',
                    createeditor: function (row, cellvalue, editor) {
                        editor.jqxNumberInput({decimalDigits: 0, min: 0, max: 9999999999999999999, digits: 20});
                    }
                }
            ]
        });
    };

    /** init data */
    var initData = function() {
        search.call(this);
    };

    /** 조회 */
    var search = function() {
        HmGrid.updateBoundData(this.infoGrid, ctxPath + '/main/sla/slaMgmt/getSlaAmtList.do');
    };

    var save = function() {
        HmGrid.endRowEdit(this.infoGrid);
        if(this.editIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }

        var _list = [], _this = this;
        $.each(this.editIds, function(i,v) {
            _list.push(_this.infoGrid.jqxGrid('getrowdatabyid', v));
        });

        Server.post('/main/sla/slaMgmt/saveSlaAmtMgmt.do', {
            data: { list: _list },
            success: function(result) {
                alert('저장되었습니다.');
                _this.editIds.length = 0;
            }
        });
    };

    return {
        initVariable: initVariable,
        observe: observe,
        initDesign: initDesign,
        initData: initData
    }
}();

var slaAmtMgmt = new SlaAmtMgmt();
slaAmtMgmt.initVariable();
slaAmtMgmt.observe();
slaAmtMgmt.initDesign();
slaAmtMgmt.initData();

function callback(fn, params) {
    var fn = slaAmtMgmt[fn];
    if(typeof fn === 'function') {
        if(params === undefined) fn.call(slaAmtMgmt);
        else fn.call(slaAmtMgmt, params);
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
        slaAmtMgmt.infoGrid.jqxGrid('addrow', null, addList);
        var ids = addList.map(function(d) { return d.uniqKey; });
        slaAmtMgmt.editIds.push.apply(slaAmtMgmt.editIds, ids);
    }
}

