var $recvGrpGrid;
var editRecvGrpIds = [];
var $recvUserGrid, $recvDevGrid, $grpTree, $devGrid, $recvStatEvtGrid, $recvLimitEvtGrid;
var evtLevel1Text, evtLevel2Text, evtLevel3Text, evtLevel4Text, evtLevel5Text;
var evtLevelList = [];
var editRecvStatEvtIds = [];
var editRecvLimitEvtIds = [];
var currRecvGrpNo = -1;
var Main = {
    /** variable */
    initVariable: function () {
        $recvGrpGrid = $('#recvGrpGrid');
        $recvUserGrid = $('#recvUserGrid');
        $recvDevGrid = $('#recvDevGrid');
        $grpTree = $('#grpTree');
        $devGrid = $('#devGrid');
        $recvStatEvtGrid = $('#recvStatEvtGrid');
        $recvLimitEvtGrid = $('#recvLimitEvtGrid');
        evtLevel1Text = $('#sEvtLevel1').val();
        evtLevel2Text = $('#sEvtLevel2').val();
        evtLevel3Text = $('#sEvtLevel3').val();
        evtLevel4Text = $('#sEvtLevel4').val();
        evtLevel5Text = $('#sEvtLevel5').val();
        evtLevelList = [{label: evtLevel1Text, value: 1}, {label: evtLevel2Text, value: 2}, {
            label: evtLevel3Text,
            value: 3
        }, {label: evtLevel4Text, value: 4}, {label: evtLevel5Text, value: 5}];
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
        $('#btn_move').bind('click', function (event) {
            Main.eventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnAdd_grp':
                this.addRecvGrp();
                break;
            case 'btnEdit_grp':
                this.editRecvGrp();
                break;
            case 'btnDel_grp':
                this.delRecvGrp();
                break;
            case 'btnAdd_user':
                this.addRecvUser();
                break;
            case 'btnDel_user':
                this.delRecvUser();
                break;
            case 'btn_move_dev':
                this.addRecvDev();
                break;
            case 'btnDel_dev':
                this.delRecvDev();
                break;
            case 'btnSave_evt':
                this.editRecvEvt();
                break;
//			case 'btnSave_evt': this.saveAlarm(); break;
        }
    },

    /** init design */
    initDesign: function () {
        HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_V, [{
            size: 350,
            min: 150,
            collapsible: false
        }, {size: '100%'}], 'auto', '100%');

        HmJqxSplitter.create($('#recvDev_mainSplitter'), HmJqxSplitter.ORIENTATION_H, [{
            size: '50%',
            collapsible: false
        }, {size: '50%'}], 'auto', '100%');
        HmJqxSplitter.create($('#recvDev_subSplitter'), HmJqxSplitter.ORIENTATION_V, [{
            size: 250,
            min: 150,
            collapsible: false
        }, {size: '100%'}], 'auto', '100%');
        HmJqxSplitter.create($('#recvEvt_mainSplitter'), HmJqxSplitter.ORIENTATION_V, [{
            size: '50%',
            collapsible: false
        }, {size: '50%'}], 'auto', '96.5%');

        HmWindow.create($('#pwindow'), 100, 100);
        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.searchDev/*, { devKind1 : 'DEV' }*/);
        HmGrid.create($recvGrpGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: ctxPath + '/main/com/recvGrpMgmt/getRecvGrpList.do',
                    updaterow: function (rowid, rowdata, commit) {
                        if (editRecvGrpIds.indexOf(rowid) == -1)
                            editRecvGrpIds.push(rowid);
                        commit(true);
                    },
                    addrow: function (rowid, rowdata, commit) {
                        Server.post('/main/com/recvGrpMgmt/addRecvGrp.do', {
                            data: rowdata,
                            success: function () {
                                HmGrid.updateBoundData($recvGrpGrid);
                                $('#pwindow').jqxWindow('close');
                                alert('추가되었습니다.');
                            }
                        });
                        commit(true);
                    }
                },
                {
                    loadComplete: function (records) {
                        editRecvGrpIds = [];
                        $('#titleGrid').text('그룹 [-]');
                    }
                }
            ),
            editmode: 'selectedrow',
            ready: function () {
                // $recvGrpGrid.jqxGrid('selectrow', 0);
                Main.search();
            },
            columns:
                [
                    {text: '그룹번호', datafield: 'recvGrpNo', hidden: true},
                    {text: '그룹명', datafield: 'recvGrpName', width:100},
                    {text: '발신번호', datafield: 'recvCallerTel', width:120, cellsalign: 'center'},
                    {text: '표시 순서', datafield: 'sortIdx', width: 70, cellsalign: 'right'},
                    {text: '권한', datafield: 'isAuth', columnType: 'checkbox', rendered: function(header){
                        var $header = $(header.html()).text();//header안에 html 태그;

                        header.html($header + '<img src="/img/tooltip.svg" class="pop_tooltip01" id="isAuth_tooltip">');
                        setTimeout(function(){
                            $('#isAuth_tooltip').jqxTooltip({
                                content: '사용자 계정의 권한그룹에<br>대해서만<br>문자가발송됩니다.',
                                position: 'top',
                            });
                        }, 500);
                    }}
                ]
        });

        $recvGrpGrid.on('rowselect', function (event) {
            currRecvGrpNo = event.args.row.recvGrpNo;
            $('#titleGrid').text('그룹 [ ' + event.args.row.recvGrpName + ' ]');
            Main.search();
        });
        $('#mainTabs').jqxTabs({
            width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function (tab) {
                switch (tab) {
                    case 0:
                        HmGrid.create($recvUserGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
//										url: ctxPath + '/main/com/recvGrpMgmt/getRecvUserList.do'
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, {
                                            recvGrpNo: currRecvGrpNo
                                        });
                                        return data;
                                    }
                                }
                            ),
                            selectionmode: 'multiplerowsextended',
                            columns:
                                [
                                    {text: '아이디', datafield: 'userId', width: 150, editable: false},
                                    {text: '이름', datafield: 'userName', width: 200, editable: false},
                                    {text: '소속', datafield: 'deptName', minwidth: 200, editable: false},
                                    {text: '휴대폰', datafield: 'cellTel', width: 120, editable: false, hidden: true}
                                ]
                        });
                        Main.search();
                        break;
                    case 1:
                        HmGrid.create($recvDevGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    url: ctxPath + '/main/com/recvGrpMgmt/getRecvDevList.do'
                                },
                                {
                                    formatData: function (data) {
                                        // var rowIdx = HmGrid.getRowIdx($recvGrpGrid);
                                        // if(rowIdx === false) return;
                                        $.extend(data, {
                                            recvGrpNo: currRecvGrpNo
                                        });
                                        return data;
                                    }
                                }
                            ),
                            selectionmode: 'multiplerowsextended',
                            columns:
                                [
                                    {text: '장비번호', datafield: 'mngNo', hidden: true},
                                    {text: '그룹명', datafield: 'grpName'},
                                    {text: '장비명', datafield: 'devName'},
                                    {text: '대표IP', datafield: 'devIp'},
                                    {text: '종류', datafield: 'devKind2', filtertype: 'checkedlist'},
                                    {text: '모델', datafield: 'model', filtertype: 'checkedlist'},
                                    {text: '제조사', datafield: 'vendor', filtertype: 'checkedlist'}
                                ]
                        });
                        HmGrid.create($devGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        var _grpNo = 0, _grpParent = 0, _grpType = 'DEFAULT', _itemKind = 'GROUP';
                                        var treeItem = HmTreeGrid.getSelectedItem($grpTree);
                                        if (treeItem != null) {
                                            _itemKind = treeItem.devKind2;
                                            _grpNo = _itemKind == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1];
                                            _grpParent = treeItem.grpParent;
                                        }
                                        $.extend(data, {
                                            grpType: _grpType,
                                            grpNo: _grpNo,
                                            grpParent: _grpParent,
                                            itemKind: _itemKind
                                        });

                                        // var rowIdx = HmGrid.getRowIdx($recvGrpGrid);
                                        // if(rowIdx === false) return;
                                        $.extend(data, {
                                            recvGrpNo: currRecvGrpNo
                                        });
                                        return data;
                                    }
                                }
                            ),
                            selectionmode: 'multiplerowsextended',
                            pagerheight: 27,
                            pagerrenderer: HmGrid.pagerrenderer,
                            columns:
                                [
                                    {text: '그룹명', datafield: 'grpName'},
                                    {text: '장비명', datafield: 'devName'},
                                    {text: '대표IP', datafield: 'devIp'},
                                    {text: '종류', datafield: 'devKind2', filtertype: 'checkedlist'},
                                    {text: '모델', datafield: 'model', filtertype: 'checkedlist'},
                                    {text: '제조사', datafield: 'vendor', filtertype: 'checkedlist'}
                                ]
                        });
                        Main.search();
                        break;
                    case 2:
                        HmGrid.create($recvStatEvtGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    updaterow: function (rowid, rowdata, commit) {
                                        if (editRecvStatEvtIds.indexOf(rowid) == -1)
                                            editRecvStatEvtIds.push(rowid);
                                        commit(true);
                                    },
                                },
                                {
                                    formatData: function (data) {
                                        // var rowIdx = HmGrid.getRowIdx($recvGrpGrid);
                                        // if(rowIdx === false) return;
                                        $.extend(data, {
                                            recvGrpNo: currRecvGrpNo,
                                            codeType: 0,
                                            chkDEV : $("#chkDEV").val() ? 1 : 0 ,
                                            chkIF : $("#chkIF").val() ? 1 : 0 ,
                                            chkSVR : $("#chkSVR").val() ? 1 : 0 ,
                                            chkRTU : $("#chkRTU").val() ? 1 : 0 ,
                                            chkUPS : $("#chkUPS").val() ? 1 : 0 ,
                                            chkSYSLOG : $("#chkSYSLOG").val() ? 1 : 0 ,
                                            chkTRAP : $("#chkTRAP").val() ? 1 : 0 ,
                                            chkLOG : $("#chkLOG").val() ? 1 : 0 ,
                                            chkFILECHK : $("#chkFILECHK").val() ? 1 : 0 ,
                                        });
                                        return data;
                                    },
                                    loadComplete: function (records) {
                                        editRecvStatEvtIds = [];
                                    }
                                }
                            ),
                            showtoolbar: true,
                            rendertoolbar: function (toolbar) {
                                HmGrid.titlerenderer(toolbar, '발송 이벤트(상태)');
                            },
                            editable: true,
                            selectionmode: 'multiplerowsextended',
                            columns:
                                [
                                    {text: '그룹번호', datafield: 'recvGrpNo', editable: false, hidden: true},
                                    {text: '구분', datafield: 'gubun', editable: false},
                                    {text: '이벤트명', datafield: 'evtName', editable: false},
                                    {
                                        text: '등급',
                                        datafield: 'evtLevel',
                                        displayfield: 'disEvtLevel',
                                        width: 100,
                                        columntype: 'dropdownlist',
                                        filtertype: 'checkedlist',
                                        createeditor: function (row, value, editor) {
                                            editor.jqxDropDownList({
                                                source: evtLevelList, autoDropDownHeight: true,
                                                displayMember: 'label', valueMember: 'value'
                                            });
                                        }
                                    },
                                    {text: 'SMS', datafield: 'isRecvSms', columnType: 'checkbox'},
                                    {text: 'Mail', datafield: 'isRecvEmail', columnType: 'checkbox'},
                                    {text: 'Push', datafield: 'isRecvPush', columnType: 'checkbox'}
                                ]
                        }, CtxMenu.NONE);

                        $recvStatEvtGrid.on('contextmenu', function (event) {
                            return false;
                        }).on('rowclick', function (event) {
                            if (event.args.rightclick) {
                                var scrollTop = $(window).scrollTop();
                                var scrollLeft = $(window).scrollLeft();
                                $('#ctxmenu_stat').jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
                                    parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                                return false;
                            }
                        });

                        $('#ctxmenu_stat').jqxMenu({width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme})
                            .on('itemclick', function (event) {
                                Main.selectRecvCtxmenu(event);
                            });

                        HmGrid.create($recvLimitEvtGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    updaterow: function (rowid, rowdata, commit) {
                                        if (editRecvLimitEvtIds.indexOf(rowid) == -1)
                                            editRecvLimitEvtIds.push(rowid);
                                        commit(true);
                                    },
                                },
                                {
                                    formatData: function (data) {
                                        // var rowIdx = HmGrid.getRowIdx($recvGrpGrid);
                                        // if(rowIdx === false) return;
                                        $.extend(data, {
                                            recvGrpNo: currRecvGrpNo,
                                            codeType: 1,
                                            chkDEV : $("#chkDEV").val() ? 1 : 0 ,
                                            chkIF : $("#chkIF").val() ? 1 : 0 ,
                                            chkSVR : $("#chkSVR").val() ? 1 : 0 ,
                                            chkRTU : $("#chkRTU").val() ? 1 : 0 ,
                                            chkUPS : $("#chkUPS").val() ? 1 : 0 ,
                                            chkSYSLOG : $("#chkSYSLOG").val() ? 1 : 0 ,
                                            chkTRAP : $("#chkTRAP").val() ? 1 : 0 ,
                                            chkLOG : $("#chkLOG").val() ? 1 : 0 ,
                                            chkFILECHK : $("#chkFILECHK").val() ? 1 : 0 ,
                                        });
                                        return data;
                                    },
                                    loadComplete: function (records) {
                                        editRecvLimitEvtIds = [];
                                    }
                                }
                            ),

                            showtoolbar: true,
                            rendertoolbar: function (toolbar) {
                                HmGrid.titlerenderer(toolbar, '발송 이벤트(임계치)');
                            },
                            editable: true,
                            selectionmode: 'multiplerowsextended',
                            columns:
                                [
                                    {text: '그룹번호', datafield: 'recvGrpNo', editable: false, hidden: true},
                                    {text: '구분', datafield: 'gubun', editable: false},
                                    {text: '이벤트명', datafield: 'evtName', editable: false},
                                    {
                                        text: '등급',
                                        datafield: 'evtLevel',
                                        displayfield: 'disEvtLevel',
                                        width: 100,
                                        columntype: 'dropdownlist',
                                        filtertype: 'checkedlist',
                                        // cellsrenderer: HmGrid.evtLevelrenderer,
                                        createeditor: function (row, value, editor) {
                                            editor.jqxDropDownList({
                                                source: evtLevelList, autoDropDownHeight: true,
                                                displayMember: 'label', valueMember: 'value'
                                            });
                                        }
                                    },
                                    {text: 'SMS', datafield: 'isRecvSms', columnType: 'checkbox'},
                                    {text: 'Mail', datafield: 'isRecvEmail', columnType: 'checkbox'},
                                    {text: 'Push', datafield: 'isRecvPush', columnType: 'checkbox'}
                                ]
                        }, CtxMenu.NONE);

                        $recvLimitEvtGrid.on('contextmenu', function (event) {
                            return false;
                        }).on('rowclick', function (event) {
                            if (event.args.rightclick) {
                                var scrollTop = $(window).scrollTop();
                                var scrollLeft = $(window).scrollLeft();
                                $('#ctxmenu_limit').jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
                                    parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                                return false;
                            }
                        });

                        $('#chkDEV , #chkIF , #chkSVR , #chkRTU , #chkUPS , #chkTRAP').jqxCheckBox({width: 52, height: 22 , checked: true});
                        $('#chkSYSLOG').jqxCheckBox({width: 62, height: 22 , checked: true});

                        $('#chkDEV , #chkIF , #chkSVR , #chkRTU , #chkUPS , #chkSYSLOG , #chkTRAP').on('change', function(event)
                        {
                            Main.search();

                        });

                        $('#ctxmenu_limit').jqxMenu({width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme})
                            .on('itemclick', function (event) {
                                Main.selectRecvCtxmenu(event);
                            });
                        Main.search();
                        break;
                }
            }
        }).on('selected', function (event) {
            Main.search();
        });
    },

    /** init data */
    initData: function () {

    },

    selectRecvCtxmenu: function (event) {
        switch ($(event.args)[0].id) {
            case 'cm_statBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($recvStatEvtGrid, '이벤트 임계치을 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _recvGrpNo;
                    var _codes = [];
                    $.each(rowIdxes, function (idx, value) {
                        var _data = $recvStatEvtGrid.jqxGrid('getrowdata', value);
                        _recvGrpNo = _data.recvGrpNo;
                        _codes.push({code: _data.code, sysCode: _data.sysCode});
                    });
                    var params = {
                        recvGrpNo: _recvGrpNo,
                        codes: _codes,
                        codeType: 0,
                        evtLevelList: evtLevelList
                    };

                    HmWindow.create($('#pwindow'), 500, 500);
                    $.post(ctxPath + '/main/popup/com/pRecvEvtBatchSet.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '임계치이벤트 일괄설정', result, 300, 200, 'pwindow_init', params);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_limitBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($recvLimitEvtGrid, '이벤트 임계치을 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _recvGrpNo;
                    var _codes = [];
                    $.each(rowIdxes, function (idx, value) {
                        var _data = $recvLimitEvtGrid.jqxGrid('getrowdata', value);
                        _recvGrpNo = _data.recvGrpNo;
                        _codes.push({code: _data.code, sysCode: _data.sysCode});
                    });
                    var params = {
                        recvGrpNo: _recvGrpNo,
                        codes: _codes,
                        codeType: 1,
                        evtLevelList: evtLevelList
                    };

                    HmWindow.create($('#pwindow'), 500, 500);
                    $.post(ctxPath + '/main/popup/com/pRecvEvtBatchSet.do',
                        function (result) {
                            HmWindow.open($('#pwindow'), '임계치이벤트 일괄설정', result, 300, 200, 'pwindow_init', params);
                        }
                    );
                } catch (e) {
                }
                break;
        }
    },

    /** 수신자 그룹 */
    addRecvGrp: function () {

        var _grpRows = $('#recvGrpGrid').jqxGrid('getrows');
        var _max = 0;
        for(var i = 0 ; i < _grpRows.length ; i++){
            if(_max < _grpRows[i].sortIdx){
                _max = _grpRows[i].sortIdx;
            }
        }//for end(i)

        $.get(ctxPath + '/main/popup/com/pRecvGrpAdd.do', function (result) {
            //$('#pwindow').jqxWindow({ width: 300, height: 150, title: '<h1>수신자 그룹 등록</h1>', content: result, position: 'center', resizable: false });
            //$('#pwindow').jqxWindow('open');
            HmWindow.openFit($('#pwindow'), '수신자 그룹 등록', result, 300, 180, 'pwindow_init', {max: _max + 1});
        });
    },

    delRecvGrp: function () {
        var rowIdx = HmGrid.getRowIdx($recvGrpGrid, '데이터를 선택해주세요.');
        if (rowIdx === false) return;
        if (!confirm('선택된 데이터를 삭제하시겠습니까?')) return;

        var rowdata = $recvGrpGrid.jqxGrid('getrowdata', rowIdx);
        Server.post('/main/com/recvGrpMgmt/delRecvGrp.do', {
            data: rowdata,
            success: function (result) {
                $recvGrpGrid.jqxGrid('deleterow', $recvGrpGrid.jqxGrid('getrowid', rowIdx));
                alert('삭제되었습니다.');
            }
        });
    },

    editRecvGrp: function () {

        var rowIdx = HmGrid.getRowIdx($recvGrpGrid);
        if (rowIdx === false) {
            alert('수신자 그룹을 선택하세요.');
            return;
        }
        var recvGrpData = $recvGrpGrid.jqxGrid('getrowdata', rowIdx);
        var params = {
            recvGrpNo: recvGrpData.recvGrpNo,
            recvGrpName: recvGrpData.recvGrpName,
            recvCallerTel: recvGrpData.recvCallerTel,
            sortIdx: recvGrpData.sortIdx,
            isAuth: recvGrpData.isAuth
        };
        $.post(ctxPath + '/main/popup/com/pRecvGrpEdit.do',
            params,
            function (result) {
                HmWindow.openFit($('#pwindow'), '수신자 그룹 수정', result, 300, 180, 'pwindow_init', params);
            }
        );
    },

    addRecvUser: function () {
        var rowIdx = HmGrid.getRowIdx($recvGrpGrid);
        if (rowIdx === false) {
            alert('수신자 그룹을 선택하세요.');
            return;
        }
        var recvGrpData = $recvGrpGrid.jqxGrid('getrowdata', rowIdx);
        var params = {
            recvGrpNo: recvGrpData.recvGrpNo,
            recvGrpName: recvGrpData.recvGrpName,
            isAuth: recvGrpData.isAuth
        };
        $.post(ctxPath + '/main/popup/com/pRecvUserAdd.do',
            params,
            function (result) {
                HmWindow.openFit($('#pwindow'), '[' + recvGrpData.recvGrpName + '] 그룹 수신자 등록', result, 650, 500, 'pwindow_init', params);
            }
        );
    },

    delRecvUser: function () {
        var rowIdx = HmGrid.getRowIdx($recvGrpGrid);
        if (rowIdx === false) {
            alert('수신자 그룹을 선택하세요.');
            return;
        }
        var recvGrpData = $recvGrpGrid.jqxGrid('getrowdata', rowIdx);

        var rowIdxes = HmGrid.getRowIdxes($recvUserGrid);
        if (rowIdxes === false) {
            alert('수신자를 선택하세요.');
            return;
        }

        if (confirm("선택한 수신자를 삭제하시겠습니까?") != true) return;

        var _list = [], _uids = [];
        $.each(rowIdxes, function (idx, value) {
            var rowdata = $recvUserGrid.jqxGrid('getrowdata', value);
            _list.push({userId: rowdata.userId});
            _uids.push(rowdata.uid);

        });

        if (_list.length > 0) {
            Server.post('/main/com/recvGrpMgmt/delRecvUser.do', {
                data: {list: _list, recvGrpNo: recvGrpData.recvGrpNo},
                success: function (result) {
                    $recvUserGrid.jqxGrid('deleterow', _uids);
                    alert('삭제되었습니다.');
                }
            });
        }
        // Server.post('/main/com/recvGrpMgmt/delRecvUser.do', {
        // 	data: rowdata,
        // 	success: function(result) {
        // 		$recvUserGrid.jqxGrid('deleterow', $recvUserGrid.jqxGrid('getrowid', rowIdx));
        // 		alert('삭제되었습니다.');
        // 	}
        // });

    },
    addRecvDev: function () {
        var rowIdx = HmGrid.getRowIdx($recvGrpGrid);
        if (rowIdx === false) {
            alert('수신자 그룹을 선택하세요.');
            return;
        }
        var recvGrpData = $recvGrpGrid.jqxGrid('getrowdata', rowIdx);

        var rowIdx = HmGrid.getRowIdx($devGrid);
        if (rowIdx === false) {
            alert('등록할 장비를 선택하세요.');
            return;
        }


        var rowIdxes = HmGrid.getRowIdxes($devGrid, '선택된  데이터가 없습니다.');
        if (rowIdxes === false) return;

        var _list = [];
        $.each(rowIdxes, function (idx, value) {
            var data = $devGrid.jqxGrid('getrowdata', value);
            _list.push({mngNo: data.mngNo});
        });


        var params = {
            recvGrpNo: recvGrpData.recvGrpNo,
            list: _list
        };

        Server.post('/main/com/recvGrpMgmt/addRecvDev.do', {
            data: {recvGrpNo: recvGrpData.recvGrpNo, list: _list},
            success: function (result) {
                alert('저장되었습니다.');
                Main.searchDev();
                $recvDevGrid.jqxGrid('updateBoundData');
            }
        });

    },

    delRecvDev: function () {

        var rowIdxes = HmGrid.getRowIdxes($recvDevGrid, '장비를 선택해주세요.');

        var rowIdx = HmGrid.getRowIdx($recvGrpGrid);
        if (rowIdx === false) {
            alert('수신자 그룹을 선택하세요.');
            return;
        }
        var recvGrpData = $recvGrpGrid.jqxGrid('getrowdata', rowIdx);

        var _mngNos = [], _uids = [];
        $.each(rowIdxes, function (idx, value) {
            _mngNos.push($recvDevGrid.jqxGrid('getrowdata', value).mngNo);
            _uids.push($recvDevGrid.jqxGrid('getrowdata', value).uid);
        });

        if (confirm("선택한 수신장비를 삭제하시겠습니까?") != true) return;

        Server.post('/main/com/recvGrpMgmt/delRecvDev.do', {
            data: {mngNos: _mngNos, recvGrpNo: recvGrpData.recvGrpNo},
            success: function (result) {
                $recvDevGrid.jqxGrid('deleterow', _uids);
                alert('삭제되었습니다.');
            }
        });

    },

    editRecvEvt: function () {
        var rowIdx = HmGrid.getRowIdx($recvGrpGrid);
        if (rowIdx === false) {
            alert('수신자 그룹을 선택하세요.');
            return;
        }
        var recvGrpData = $recvGrpGrid.jqxGrid('getrowdata', rowIdx);


        var _statList = [];
        $.each(editRecvStatEvtIds, function (idx, value) {
            var tmp = $recvStatEvtGrid.jqxGrid('getrowdatabyid', value);
            if (tmp !== undefined) {
                $.extend(tmp, {codeType: 0});
                _statList.push(tmp);
            }
        });

        var _limitList = [];
        $.each(editRecvLimitEvtIds, function (idx, value) {
            var tmp = $recvLimitEvtGrid.jqxGrid('getrowdatabyid', value);
            if (tmp !== undefined) {
                $.extend(tmp, {codeType: 1});
                _limitList.push(tmp);
            }
        });


        var _list = _statList.concat(_limitList);

        if (_list.length == 0) {
            alert('변경된 내용이 없습니다.');
            return
        }
//			
        Server.post('/main/com/recvGrpMgmt/editRecvEvt.do', {
            data: {recvGrpNo: recvGrpData.recvGrpNo, list: _list},
            success: function (result) {
                alert('저장되었습니다.');
                Main.search();
            }
        });

    },

    searchDev: function () {
//			HmGrid.updateBoundData($devGrid, ctxPath + '/main/com/devMgmt/getDevMgmtList.do');
        HmGrid.updateBoundData($devGrid, ctxPath + '/main/com/recvGrpMgmt/getDevList.do');
    },
    /** 조회 */
    search: function () {
        switch ($('#mainTabs').val()) {
            case 0:
//				HmGrid.updateBoundData($recvUserGrid);
                HmGrid.updateBoundData($recvUserGrid, ctxPath + '/main/com/recvGrpMgmt/getRecvUserList.do');
                break;
            case 1:
                HmGrid.updateBoundData($recvDevGrid);
                HmTreeGrid.updateData($grpTree, HmTree.T_GRP_DEFAULT2);
                break;
            case 2:
                HmGrid.updateBoundData($recvStatEvtGrid, ctxPath + '/main/com/recvGrpMgmt/getRecvEvtList.do');
                HmGrid.updateBoundData($recvLimitEvtGrid, ctxPath + '/main/com/recvGrpMgmt/getRecvEvtList.do');
                break;
        }
    }
};

function addGrpResult(addData) {
    $recvGrpGrid.jqxGrid('addrow', null, addData);
}

function addUserResult(addData) {
    $recvUserGrid.jqxGrid('updateBoundData');
}

function editGrpResult() {
    $recvGrpGrid.jqxGrid('updateBoundData');
}

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});