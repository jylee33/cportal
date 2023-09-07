var PMain = {
    /** variable */
    initVariable: function() {

    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { PMain.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'pbtnAdd': this.addSlot(); break;
            case 'pbtnClose': self.close(); break;
            case 'pbtnSearch_etc': this.searchDevEtc(); break;
            case 'pbtnAdd_etc': this.addDevEtc(); break;
            case 'pbtnEdit_etc': this.editDevEtc(); break;
            case 'pbtnDel_etc': this.delDevEtc(); break;
        }
    },

    /** init design */
    initDesign: function() {
        HmWindow.create($('#p2window'));
        $('#p_tabs').jqxTabs({ width: '100%', height: '100%',theme : 'ui-hamon-v1-tab-top',
            initTabContent: function(tab) {
                switch(tab) {
                    case 0: // 장비
                        HmDropDownBtn.createTreeGrid($('#ddbGrp_dev'), $('#grpTree_dev'), HmTree.T_GRP_DEF_ALL, 200, 22, 300, 250, PMain.searchDev);
                        HmGrid.create($('#p_devGrid'), {
                            height: 509,
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    datafields: [
                                        { name: 'mngNo', type: 'number' },
                                        { name: 'grpNo', type: 'number' },
                                        { name: 'devName', type: 'string' },
                                        { name: 'userDevName', type: 'string' },
                                        { name: 'devIp', type: 'string' },
                                        { name: 'grpName', type: 'string' },
                                        { name: 'model', type: 'string' },
                                        { name: 'vendor', type: 'string' },
                                        { name: 'devKind1', type: 'string' },
                                        { name: 'devKind2', type: 'string' },
                                        { name: 'community', type: 'string' }
                                    ],
                                    deleterow: function(rowid, commit) {
                                        commit(true);
                                    }
                                },
                                {
                                    formatData: function(data) {
                                        var grpSelection = $('#grpTree_dev').jqxTreeGrid('getSelection');
                                        var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
                                        $.extend(data, {
                                            grpType: 'DEFAULT',
                                            grpNo: _grpNo,
                                            rackNo: $('#rackNo').val(),
                                            // devKind1: $('#p_slotKind').val() == 'DEV'? 'DEV' : 'SVR,VSVR'
                                            devKind1: 'DEV,SVR,VSVR'
                                        });
                                        return data;
                                    }
                                }
                            ),
                            pagesize : 100,
                            columns:
                                [
                                    { text: 'mngNo', datafield: 'mngNo', width: 60, hidden: true },
                                    { text: '장비명', datafield: 'devName', minwidth: 150},
                                    { text: '사용자장비명', datafield: 'userDevName', width: 150},
                                    { text: 'IP', datafield: 'devIp', width: 120 },
                                    { text: '타입', datafield: 'devKind1', width: 80 },
                                    { text: '장비종류', datafield: 'devKind2', width: 100 },
                                    { text: '제조사', datafield: 'vendor', width: 120 },
                                    { text: '모델', datafield: 'model', width: 130 }
                                ]
                        }, CtxMenu.COMM, 0);
                        $('#p_devGrid').on('bindingcomplete', function() {
                            // 장착되어 있는 장비 제거
                            var _mngNos = $('#p_mngNos').val().split(',');
                            var _rows = $(this).jqxGrid('getrows');

                            $.each(_mngNos, function (idx, item) {
                                for(var i = 0; i < _rows.length; i++) {
                                    if(item == _rows[i].mngNo) {
                                        $('#p_devGrid').jqxGrid('deleterow', _rows[i].uid);
                                        break;
                                    }
                                }
                            });
                            PMain.refreshPage($('#p_devGrid'));
                        });
                        break;
                    case 1: // ETC
                        HmGrid.create($('#p_etcGrid'), {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    url: ctxPath + '/dev/getDevEtcListNotInRack.do',
                                    datafields: [
                                        { name: 'mngNo', type: 'number' },
                                        { name: 'devName', type: 'string' },
                                        { name: 'devIp', type: 'string' }
                                    ]
                                }
                            ),
                            columns:
                                [
                                    { text: '장비명', datafield: 'devName' },
                                    { text: 'IP', datafield: 'devIp', width: 120 }
                                ]
                        }, CtxMenu.COMM, 1);
                        $('#p_etcGrid').on('bindingcomplete', function() {
                            // 장착되어 있는 장비 제거
                            var _mngNos = $('#p_mngNos').val().split(',');
                            var _rows = $(this).jqxGrid('getrows');

                            $.each(_mngNos, function (idx, item) {
                                for(var i = 0; i < _rows.length; i++) {
                                    if(item == _rows[i].mngNo) {
                                        $('#p_etcGrid').jqxGrid('deleterow', _rows[i].uid);
                                        break;
                                    }
                                }
                            });
                            PMain.refreshPage($('#p_etcGrid'));
                        });
                }
            }
        });

    },

    /** init data */
    initData: function() {

    },

    /**  장비탭 조회 */
    searchDev: function() {
        HmGrid.updateBoundData($('#p_devGrid'), $('#ctxPath').val() + '/dev/getDevListNotInRack.do');
    },

    /** 기타탭 */
    searchDevEtc: function() {
        HmGrid.updateBoundData($('#p_etcGrid'));
    },

    addDevEtc: function() {
        $.post(ctxPath + '/main/popup/env/pDevEtcAdd.do',
            function(result) {
                HmWindow.open($('#p2window'), '기타장비 추가', result, 300, 150);
            }
        );
    },

    editDevEtc: function() {
        var rowdata = HmGrid.getRowData($('#p_etcGrid'));
        if(rowdata == null) {
            alert('장비를 선택해주세요.');
            return;
        }
        $.post(ctxPath + '/main/popup/env/pDevEtcEdit.do',
            function(result) {
                HmWindow.open($('#p2window'), '기타장비 수정', result, 300, 150, 'p2window_init', rowdata);
            }
        );
    },

    delDevEtc: function() {
        var rowdata = HmGrid.getRowData($('#p_etcGrid'));
        if(rowdata == null) {
            alert('장비를 선택해주세요.');
            return;
        }
        if(!confirm('[' + rowdata.devName + '] 장비를 삭제하시겠습니까?')) return;
        Server.post('/dev/delDevEtc.do', {
            data: { mngNo: rowdata.mngNo },
            success: function(result) {
                $('#p_etcGrid').jqxGrid('deleterow', rowdata.uid);
                alert(result);
            }
        });
    },

    /** 추가 */
    addSlot: function() {
        switch($('#p_tabs').val()) {
            case 0:
                var rowdata = HmGrid.getRowData($('#p_devGrid'));
                if(rowdata == null) return;
                var newItem = {
                    slotName: rowdata.devName,
                    slotIp: rowdata.devIp,
                    mngNo: rowdata.mngNo,
                    devKind1: rowdata.devKind1,
                    devKind2: rowdata.devKind2
                };
                if($.isBlank(newItem.slotName)) newItem.slotName = rowdata.userDevName;
                var addResult = opener.addSlotToRack(newItem);
                if(addResult[0]) {
                    $('#p_devGrid').jqxGrid('deleterow', rowdata.uid);
                    $('#pbtnClose').click();
                }
                else {
                    alert(addResult[1]);
                }
                break;
            case 1:
                var rowdata = HmGrid.getRowData($('#p_etcGrid'));
                if(rowdata == null) return;
                var newItem = {
                    slotName: rowdata.devName,
                    slotIp: rowdata.devIp,
                    mngNo: rowdata.mngNo,
                    devKind1: 'DEV_ETC',
                    devKind2: 'DEV_ETC',
                    slotU: Number($('#p_cbSlotU').val()),
                    imgName: $('#p_cbSlotImg').val()
                };
                if($.isBlank(newItem.slotName)) newItem.slotName = rowdata.userDevName;
                var addResult = opener.addSlotToRack(newItem);
                if(addResult[0]) {
                    $('#p_etcGrid').jqxGrid('deleterow', rowdata.uid);
                    $('#pbtnClose').click();
                }
                else {
                    alert(addResult[1]);
                }
                break;
        }
    },

    /**
     * 그리드 하단 paging 강제 변경
     */
    refreshPage: function ($grid) {

        var dataInfo = $grid.jqxGrid('getdatainformation');
        var pageInfo = dataInfo.paginginformation;

        var total = dataInfo.rowscount;
        var startScope = 1 + (pageInfo.pagenum * pageInfo.pagesize);
        var endScope = Math.min(total, (pageInfo.pagenum + 1) * pageInfo.pagesize);

        $grid.find('.jqx-grid-pager-label').text(startScope + '-' + endScope + ' of ' + total);
    }

};

$(function() {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});
