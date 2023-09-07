var $grpTree, $svrGrid, $cmdGrid;
var $cbPeriod;
var curSvrNo = -1;
var editSvrIds = [];

var Main = {
    /** variable */
    initVariable: function() {
        $grpTree = $('#dGrpTreeGrid');
        $svrGrid = $('#svrGrid');
        $cmdGrid = $('#cmdGrid');
        $cbPeriod = $('#cbPeriod');
        this.initCondition();
    },

    initCondition: function() {
        // 기간
        HmBoxCondition.createPeriod('');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnSearch_svr': this.searchSvr(); break;
            case 'btnSave_svr': this.saveSvr(); break;
            case 'btnShutdown_svr': this.shutdown(); break;

            case 'btnCancel_ctrl': this.saveCtrl(); break;
            case 'btnSearch_ctrl': this.searchCtrl(); break;
        }
    },

    /** init design */
    initDesign: function() {
        HmWindow.create($('#pwindow'), 100, 100);
        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
        HmJqxSplitter.create($('#ctrlSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '70%', collapsible: false }, { size: '30%' }], 'auto', '100%');

        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.searchCommon);

        HmGrid.create($svrGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: '',
                    updaterow: function(rowid, rowdata, commit) {
                        if(editSvrIds.indexOf(rowid) == -1)
                            editSvrIds.push(rowid);
                        commit(true);
                    }
                },
                {
                    formatData: function(data) {
                        var _grpNo = 0, _grpParent = 0, _grpType = 'DEFAULT', _itemKind = 'GROUP';
                        var treeItem = HmTreeGrid.getSelectedItem($grpTree);
                        var grpSelection = $grpTree.jqxTreeGrid('getSelection');
                        if(treeItem != null) {
                            _itemKind = treeItem.devKind2;
                            _grpNo = _itemKind == 'GROUP'? treeItem.grpNo : treeItem.grpNo.split('_')[1];
                            _grpParent = treeItem.grpParent;
                        }
                        $.extend(data, {
                            grpType: _grpType,
                            grpNo: _grpNo,
                            grpParent: _grpParent,
                            itemKind: _itemKind,
                            sIp: $('#sIp').val(),
                            sDevName: $('#sDevName').val()
                        });
                        return data;
                    },
                    loadComplete: function(records) {
                        editSvrIds = [];
                        curSvrNo = -1;
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '서버 정보');
            },
            selectionmode: 'multiplerowsextended',
            editable: true,
            editmode: 'selectedrow',
            columns:
                [
                    { text: '그룹번호', datafield: 'grpNo', hidden: true},
                    { text: '장비번호', datafield: 'mngNo', hidden: true},
                    { text: '그룹명', datafield: 'grpName', width: 150, pinned: true, editable: false },
                    { text: '서버명', datafield: 'displayName', minwidth: 150, pinned: true, editable: false },
                    { text: 'IP', datafield: 'devIp', width: 120, editable: false  },
                    { text: '종류', datafield: 'devKind2', width: 100, editable: false, filtertype: 'checkedlist'  },
                    { text: '제조사', datafield: 'vendor', width: 130, editable: false, filtertype: 'checkedlist'  },
                    { text: '모델', datafield: 'model', width: 130, editable: false, filtertype: 'checkedlist'  },
                    { text: '접속형식', datafield: 'confMode', width: 100, columntype: 'dropdownlist',
                        createeditor: function (row, value, editor) {
                            var s = [
                                { label: 'SSH', value: 'SSH' },
                                { label: 'SSH|TFTP', value: 'SSH|TFTP' },
                                { label: 'Telnet', value: 'Telnet' },
                                { label: 'Telnet|TFTP', value: 'Telnet|TFTP' }
                            ];
                            editor.jqxDropDownList({ source: s, autoDropDownHeight: true, displayMember: 'label', valueMember: 'value' });
                        }
                    },
                    { text: '사용자아이디', datafield: 'loginId', width: 130 },
                    { text: '패스워드', datafield: 'loginPwd', width: 130, columntype: 'custom',
                        createeditor: function(row, value, editor) {
                            var element = $('<input type="password" style="width: 100%; height: 100%;" autocomplete="off" />');
                            editor.append(element);
                            element.jqxPasswordInput();
                        },
                        initeditor: function(row, value, editor) {
                            var element = editor.find('input:first');
                            element.jqxPasswordInput('val', value);
                        },
                        geteditorvalue: function(row, value, editor) {
                            var element = editor.find('input:first');
                            return element.val();
                        },
                        cellsrenderer: function(row, columnfield, value) {
                            var hidVal = '';
                            for(var i = 0; i < value.length; i++) {
                                hidVal += '*';
                            }
                            return hidVal;
                        }
                    },
                    { text: '2차인증패스워드', datafield: 'enPwd', width: 130, columntype: 'custom',
                        createeditor: function(row, value, editor) {
                            var element = $('<input type="password" style="width: 100%; height: 100%;" autocomplete="off" />');
                            editor.append(element);
                            element.jqxPasswordInput();
                        },
                        initeditor: function(row, value, editor) {
                            var element = editor.find('input:first');
                            element.jqxPasswordInput('val', value);
                        },
                        geteditorvalue: function(row, value, editor) {
                            var element = editor.find('input:first');
                            return element.val();
                        },
                        cellsrenderer: function(row, columnfield, value) {
                            var hidVal = '';
                            for(var i = 0; i < value.length; i++) {
                                hidVal += '*';
                            }
                            return hidVal;
                        }
                    }
                ]
        }, CtxMenu.SVR);

        HmGrid.create($cmdGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: ''
                },
                {
                    formatData: function(data) {
                        var _grpNo = 0, _grpParent = 0, _grpType = 'DEFAULT', _itemKind = 'GROUP';
                        var treeItem = HmTreeGrid.getSelectedItem($grpTree);
                        var grpSelection = $grpTree.jqxTreeGrid('getSelection');
                        if(treeItem != null) {
                            _itemKind = treeItem.devKind2;
                            _grpNo = _itemKind == 'GROUP'? treeItem.grpNo : treeItem.grpNo.split('_')[1];
                            _grpParent = treeItem.grpParent;
                        }
                        $.extend(data, {
                            grpType: _grpType,
                            grpNo: _grpNo,
                            grpParent: _grpParent,
                            itemKind: _itemKind,
                            sIp: $('#sIp').val(),
                            sDevName: $('#sDevName').val()
                        },HmBoxCondition.getPeriodParams());
                        return data;
                    },
                    loadComplete: function(records) {
                        editSvrIds = [];
                        curSvrNo = -1;
                    }
                }
            ),
            editmode: 'selectedrow',
            pagerheight: 27,
            pagerrenderer : HmGrid.pagerrenderer,
            columns:
                [
                    { text: '그룹번호', datafield: 'grpNo', hidden: true},
                    { text: '장비번호', datafield: 'mngNo', hidden: true},
                    { text: '제어일시', datafield: 'ymdhms', width: 120 },
                    { text: '그룹명', datafield: 'grpName', width: 150 },
                    { text: '서버명', datafield: 'displayName', minwidth: 150 },
                    { text: 'IP', datafield: 'devIp', width: 120 },
                    { text: '진행단계', datafield: 'disCmdStep', width: 80},
                    { text: 'cmdStep', datafield: 'cmdStep', hidden: true},
                    { text: 'resultMsg', datafield: 'resultMsg', hidden: true},
                    { text: '상태', datafield: 'status', width: 80   },
                    { text: '등록자', datafield: 'userName', width: 90 },
                    { text: '업데이트일시', datafield: 'lastUpd', width: 130 }
                ]
        }, CtxMenu.NONE);

        $cmdGrid.on('rowclick', function(event) {
            $cmdGrid.jqxGrid('selectrow', event.args.rowindex);
            var rowIdx = HmGrid.getRowIdx($cmdGrid);
            if(rowIdx === false) {
                return;
            }
            var rowdata = $cmdGrid.jqxGrid('getrowdata', rowIdx);
            $('#txtCtrlResult').val(rowdata.resultMsg);
        });
    },

    /** init data */
    initData: function() {
        Server.post('/combo/getProfileList.do', {
            data: { profileType: 'SVR' },
            success: function(result) {
                profileList = result;
            }
        });
    },

    /** 트리 조회 callback */
    searchCommon: function () {
      Main.searchSvr();
      Main.searchCtrl();
    },

    /** 서버 */
    searchSvr: function() {
        HmGrid.updateBoundData($svrGrid, ctxPath + '/main/sms/svrCtrl/getSvrInfoList.do');
    },

    shutdown: function() {
        var rowIdxes = HmGrid.getRowIdxes($svrGrid);
        if(rowIdxes === false) {
            alert('선택된 서버가 없습니다.');
            return;
        }

        if(!confirm(rowIdxes.length + '개의 서버를 종료하시겠습니까?')) return;

        var _mngNos = [];
        $.each(rowIdxes, function(idx, value) {
            _mngNos.push($svrGrid.jqxGrid('getrowdata', value).mngNo);
        });
        var params = {
            mngNos: _mngNos.join(',')
        };

        Server.post('/main/sms/svrCtrl/addSvrCmd.do', {
            data: params,
            success: function(result) {
                alert('제어 목록에 추가 되었습니다.');
                Main.searchCtrl();
            }
        });
    },

    saveSvr: function() {
        HmGrid.endRowEdit($svrGrid);
        if(editSvrIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(editSvrIds, function(idx, value) {
            var tmp = $svrGrid.jqxGrid('getrowdatabyid', value);
            tmp.encryptionFlag = $("#gEncryptionFlag").val();
            _list.push(tmp);
        });
        Server.post('/main/sms/svrCtrl/saveSvrInfo.do', {
            data: { list: _list },
            success: function(result) {
                alert('저장되었습니다.');
                editSvrIds = [];
            }
        });
    },

    /** 하단 조회 */
    searchCtrl: function() {
        HmGrid.updateBoundData($cmdGrid, ctxPath + '/main/sms/svrCtrl/getSvrCtrlList.do');
    },

    saveCtrl: function() {
        var rowIdx = HmGrid.getRowIdx($cmdGrid);
        if(rowIdx === false) {
            alert('선택된 데이터가 없습니다.');
            return;
        }
        var rowdata = $cmdGrid.jqxGrid('getrowdata', rowIdx);
        if(!confirm('[' + rowdata.name + '] 제어를 취소하시겠습니까?')) return;
        Server.post('/main/sms/svrCtrl/saveSvrCtrlCancel.do', {
            data: rowdata,
            success: function(result) {
                alert('취소되었습니다.');
                Main.searchCtrl();
            }
        });
    }
};

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});