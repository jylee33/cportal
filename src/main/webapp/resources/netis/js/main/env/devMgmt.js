var $grpTree, $devGrid, $ifGrid;
var editDevIds = [], editIfIds = [], editEvtCode_limitIds = [], editEvtCode_statIds = [];
var evtLevel1Text, evtLevel2Text, evtLevel3Text, evtLevel4Text, evtLevel5Text;

var curDevData = null;
var hmDevGrid;

var codeMap = {
    devKindList: [],
    vendorList: [],
    vendorModelList: [],
    profileList: [],
    oidTmplList: [],
    cfgbackTmplList: [],
    devDynamicThrhldList: [{thrhldGrpNo: null, thrhldGrpNm: '미설정'}],
    ifDynamicThrhldList: [{thrhldGrpNo: null, thrhldGrpNm: '미설정'}]
};


var Main = {

    /** variable */
    initVariable: function () {
        $grpTree = $('#grpTree'), $devGrid = $('#devGrid'), $ifGrid = $('#ifGrid');
        this.initCondition();

        evtLevel1Text = $('#sEvtLevel1').val();
        evtLevel2Text = $('#sEvtLevel2').val();
        evtLevel3Text = $('#sEvtLevel3').val();
        evtLevel4Text = $('#sEvtLevel4').val();
        evtLevel5Text = $('#sEvtLevel5').val();
    },

    initCondition: function () {
        // search condition
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_dev_srch_type'));
    },


    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
        $('.searchBox input:text').bind('keyup', function (event) {
            Main.keyupEventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            // group
            case 'btnAdd_grp':
                this.addGrp();
                break;
            case 'btnEdit_grp':
                this.editGrp();
                break;
            case 'btnDel_grp':
                this.delGrp();
                break;
            // dev
            case 'btnAutoAdd_dev':
                this.addAuto();
                break;
            case 'btnMultiAdd_dev':
                this.addMultiDev();
                break;
            case 'btnAdd_dev':
                this.addDev();
                break;
            case 'btnDel_dev':
                this.delDev();
                break;
            case 'btnSave_dev':
                this.saveDev();
                break;
            case 'btnSearch_dev':
                this.searchDev();
                break;
            case 'btnExcel_dev':
                this.exportExcel_dev();
                break;
            case 'btnColConf_dev':
                this.showColConf('CM_DEV10');
                break;
            case 'btnChgMgr_dev':
                this.execChgMgr();
                break;
            case 'btnThresholdConf_dev':
                this.thresholdConf();
                break;

//			case 'btnLWC_if': this.confLineWidth(); break;

            case 'btnSave_dtl':
                this.saveDtl();
                break;
            case 'btnSearch_dtl':
                this.searchDtl();
                break;
            case 'btnExcel_dtl':
                this.exportExcelDtl();
                break;
            // case 'btnDev_restore':
            //     this.devRestore();
            //     break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
            Main.searchDev();
        }
    },

    /** init design */
    initDesign: function () {

        //검색바 호출.
        Master.createSearchBar1('', '', $("#srchBox"));

        HmWindow.create($('#pwindow'), 100, 100, 999);
        HmWindow.create($('#msgbox'), 300, 200, 999);

        HmJqxSplitter.createTree($('#mainSplitter'));

        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{
            size: '50%',
            collapsible: false
        }, {size: '50%'}]);


        $('#dtlTab').jqxTabs({
            width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function (tab) {
                switch (tab) {
                    case 0:

                        HmGrid.create($ifGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    updaterow: function (rowid, rowdata, commit) {
                                        if (editIfIds.indexOf(rowid) == -1)
                                            editIfIds.push(rowid);
                                        commit(true);
                                    }
                                },
                                {
                                    formatData: function (data) {

                                        var rowdata = HmGrid.getRowData($devGrid);
                                        data.mngNo = rowdata == null ? -1 : rowdata.mngNo;
                                        return data;

                                    },

                                    loadComplete: function (records) {
                                        console.log('if records', records);
                                        editIfIds = [];
                                    }

                                }
                            ),
                            selectionmode: 'multiplerowsextended',
                            editable: true,
                            columns: [
                                {
                                    text: '장비번호',
                                    datafield: 'mngNo',
                                    width: 100,
                                    hidden: true,
                                    pinned: true,
                                    editable: false
                                },
                                {
                                    text: '회선번호',
                                    datafield: 'ifIdx',
                                    width: 100,
                                    hidden: true,
                                    pinned: true,
                                    editable: false
                                },
                                {text: '회선명', datafield: 'ifName', minwidth: 150, pinned: true, editable: false},
                                {text: '회선별칭', datafield: 'ifAlias', minwidth: 150, editable: false},
                                {text: '사용자회선명', datafield: 'userIfName', width: 130},
                                {text: '회선IP', datafield: 'ifIp', width: 100, hidden: true},
                                {
                                    text: '유형',
                                    datafield: 'userLineWidthPoll',
                                    displayfield: 'userLineWidthPollStr',
                                    width: 100,
                                    editable: false,
                                    columtype: 'dropdownlist',
                                    createeditor: function (row, value, editor) {
                                        var s = [
                                            {label: '사용대역', value: 1},
                                            {label: '원본대역', value: 0}
                                        ];
                                        editor.jqxDropDownList({source: s, autoDropDownHeight: true});
                                    }
                                },
                                {
                                    text: '대역폭',
                                    datafield: 'lineWidth',
                                    width: 100,
                                    cellsrenderer: HmGrid.unit1000renderer,
                                    cellsalign: 'right',
                                    columntype: 'numberinput',
                                    createeditor: function (row, cellvalue, editor) {
                                        editor.jqxNumberInput({
                                            decimalDigits: 0,
                                            min: 0,
                                            max: 9999999999999999999,
                                            digits: 20
                                        });
                                    },
                                    validation: function (cell, value) {
                                        if (value < 0 || value > 9999999999999999999) {
                                            return {result: false, message: '20자리 이내로 수치값을 입력해주세요.'};
                                        }
                                        return true;
                                    }
                                },
                                {
                                    text: '상태',
                                    datafield: 'status',
                                    width: 80,
                                    cellsrenderer: HmGrid.ifStatusrenderer,
                                    editable: false
                                },
                                {
                                    text: '동적임계치',
                                    width: 120,
                                    datafield: 'thrhldGrpNo',
                                    displayfield: 'thrhldGrpNm',
                                    columntype: 'dropdownlist',
                                    createeditor: function (row, value, editor) {
                                        editor.jqxDropDownList({
                                            source: codeMap.ifDynamicThrhldList,
                                            displayMember: 'thrhldGrpNm',
                                            valueMember: 'thrhldGrpNo',
                                            dropDownWidth: 150
                                        });
                                    }
                                },
                                {
                                    text: '성능수집',
                                    datafield: 'perfPoll',
                                    columngroup: 'poll',
                                    width: 80,
                                    columntype: 'checkbox'
                                },
                                {
                                    text: '성능예측',
                                    datafield: 'aiPoll',
                                    columngroup: 'poll',
                                    width: 80,
                                    columntype: 'checkbox'
                                },
                                {
                                    text: '경보설정',
                                    datafield: 'evtPoll',
                                    columngroup: 'poll',
                                    width: 80,
                                    columntype: 'checkbox'
                                },
                                {
                                    text: '단문자',
                                    datafield: 'isRecvPollSms',
                                    columngroup: 'poll',
                                    width: 80,
                                    columntype: 'checkbox'
                                },
                                {
                                    text: '회선장애',
                                    datafield: 'statPoll',
                                    columngroup: 'watch',
                                    width: 80,
                                    columntype: 'checkbox'
                                },
                                {
                                    text: '헬스체크',
                                    datafield: 'icmpPoll',
                                    columngroup: 'watch',
                                    width: 80,
                                    columntype: 'checkbox'
                                },
                                {
                                    text: '단문자',
                                    datafield: 'isRecvWatchSms',
                                    columngroup: 'watch',
                                    width: 80,
                                    columntype: 'checkbox'
                                },
                                // {
                                //     text: 'bps(%)',
                                //     datafield: 'ctBpsPct',
                                //     columngroup: 'limit',
                                //     width: 80,
                                //     cellsalign: 'right',
                                //     columntype: 'numberinput',
                                //     initeditor: function (row, cellvalue, editor) {
                                //         editor.jqxNumberInput({decimalDigits: 0, min: 0, max: 100});
                                //     },
                                //     validation: function (cell, value) {
                                //         if (value < 0 || value > 100) {
                                //             return {result: false, message: '0~100사이의 수치값을 입력해주세요.'};
                                //         }
                                //         return true;
                                //     }
                                // },
                                // {
                                //     text: 'pps',
                                //     datafield: 'ctPps',
                                //     columngroup: 'limit',
                                //     width: 80,
                                //     cellsalign: 'right',
                                //     columntype: 'numberinput',
                                //     initeditor: function (row, cellvalue, editor) {
                                //         editor.jqxNumberInput({
                                //             decimalDigits: 0,
                                //             min: 0,
                                //             max: 9999999999999999999,
                                //             digits: 20
                                //         });
                                //     },
                                //     validation: function (cell, value) {
                                //         if (value < 0 || value > 9999999999999999999) {
                                //             return {result: false, message: '20자리 이내로 수치값을 입력해주세요.'};
                                //         }
                                //         return true;
                                //     }
                                // },
                                // {
                                //     text: 'CRC',
                                //     datafield: 'ctCrc',
                                //     columngroup: 'limit',
                                //     width: 80,
                                //     cellsalign: 'right',
                                //     columntype: 'numberinput',
                                //     initeditor: function (row, cellvalue, editor) {
                                //         editor.jqxNumberInput({
                                //             decimalDigits: 0,
                                //             min: 0,
                                //             max: 9999999999999999999,
                                //             digits: 20
                                //         });
                                //     },
                                //     validation: function (cell, value) {
                                //         if (value < 0 || value > 9999999999999999999) {
                                //             return {result: false, message: '20자리 이내로 수치값을 입력해주세요.'};
                                //         }
                                //         return true;
                                //     }
                                // },
                                // {
                                //     text: 'ERROR',
                                //     datafield: 'ctErr',
                                //     columngroup: 'limit',
                                //     width: 80,
                                //     cellsalign: 'right',
                                //     columntype: 'numberinput',
                                //     initeditor: function (row, cellvalue, editor) {
                                //         editor.jqxNumberInput({
                                //             decimalDigits: 0,
                                //             min: 0,
                                //             max: 9999999999999999999,
                                //             digits: 20
                                //         });
                                //     },
                                //     validation: function (cell, value) {
                                //         if (value < 0 || value > 9999999999999999999) {
                                //             return {result: false, message: '20자리 이내로 수치값을 입력해주세요.'};
                                //         }
                                //         return true;
                                //     }
                                // },
                                // {
                                //     text: 'COLLISION',
                                //     datafield: 'ctCollision',
                                //     columngroup: 'limit',
                                //     width: 80,
                                //     cellsalign: 'right',
                                //     columntype: 'numberinput',
                                //     initeditor: function (row, cellvalue, editor) {
                                //         editor.jqxNumberInput({
                                //             decimalDigits: 0,
                                //             min: 0,
                                //             max: 9999999999999999999,
                                //             digits: 20
                                //         });
                                //     },
                                //     validation: function (cell, value) {
                                //         if (value < 0 || value > 9999999999999999999) {
                                //             return {result: false, message: '20자리 이내로 수치값을 입력해주세요.'};
                                //         }
                                //         return true;
                                //     }
                                // },
                                // {
                                //     text: 'DROP',
                                //     datafield: 'ctDrop',
                                //     columngroup: 'limit',
                                //     width: 80,
                                //     cellsalign: 'right',
                                //     columntype: 'numberinput',
                                //     initeditor: function (row, cellvalue, editor) {
                                //         editor.jqxNumberInput({
                                //             decimalDigits: 0,
                                //             min: 0,
                                //             max: 9999999999999999999,
                                //             digits: 20
                                //         });
                                //     },
                                //     validation: function (cell, value) {
                                //         if (value < 0 || value > 9999999999999999999) {
                                //             return {result: false, message: '20자리 이내로 수치값을 입력해주세요.'};
                                //         }
                                //         return true;
                                //     }
                                // }
                            ],
                            columngroups: [
                                {text: '성능', align: 'center', name: 'poll'},
                                {text: '회선', align: 'center', name: 'watch'},
                                {text: '임계값', align: 'center', name: 'limit'}
                            ]
                        }, CtxMenu.NONE);

                        $ifGrid.on('sort', function (event) {
                            event.stopPropagation();
                            return false;
                        }).on('contextmenu', function (event) {
                            return false;
                        }).on('rowclick', function (event) {
                            if (event.args.rightclick) {
                                $ifGrid.jqxGrid('selectrow', event.args.rowindex);
                                var rowIdxes = HmGrid.getRowIdxes($ifGrid, '회선을 선택해주세요.');
                                if (rowIdxes.length > 1) {
                                    $('#cm_ifInfoSet').css('display', 'none');
                                }
                                else {
                                    $('#cm_ifInfoSet').css('display', 'block');
                                }

                                var scrollTop = $(window).scrollTop();
                                var scrollLeft = $(window).scrollLeft();
                                $('#ctxmenu_if').jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
                                    parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                                return false;
                            }
                        });
                        break;
                    case 1:
                        HmJqxSplitter.create($('#limitSplitter'), HmJqxSplitter.ORIENTATION_V, [{size: '50%'}, {size: '50%'}]);
                        HmGrid.create($('#evtCode_limitGrid'), {
                            source: new $.jqx.dataAdapter({
                                    datatype: 'json',
                                    type: 'POST',
                                    contenttype: 'application/json; charset=utf-8',
                                    updaterow: function (rowid, rowdata, commit) {
                                        if (editEvtCode_limitIds.indexOf(rowid) == -1)
                                            editEvtCode_limitIds.push(rowid);
                                        commit(true);
                                    }
                                },
                                {
                                    formatData: function (data) {
                                        var rowdata = HmGrid.getRowData($devGrid);
                                        if (rowdata != null) {
                                            data.mngNo = rowdata.mngNo;
                                            data.devKind2 = rowdata.devKind2;
                                        }
                                        else {
                                            data.mngNo = -1;
                                            data.devKind2 = '';
                                        }
                                        return JSON.stringify(data);
                                    },
                                    loadComplete: function (records) {
                                        editEvtCode_limitIds = [];
                                    }
                                }
                            ),
                            showtoolbar: true,
                            rendertoolbar: function (toolbar) {
                                HmGrid.titlerenderer(toolbar, '임계치 이벤트');
                            },
                            editable: true,
                            pageable: false,
                            selectionmode: 'multiplerowsextended',
                            columns: [
                                {text: 'CODE', datafield: 'evtCd', width: 100, hidden: true, editable: false},
                                {text: 'EVTCOND', datafield: 'evtCond', width: 100, hidden: true, editable: false},
                                {text: '항목', datafield: 'evtNm', minwidth: 150, editable: false},
                                {
                                    text: evtLevel1Text,
                                    datafield: 'limitValue1',
                                    width: 100,
                                    columntype: 'numberinput',
                                    cellsalign: 'right',
                                    initeditor: Main.limitInitEditor2
                                },
                                {
                                    text: evtLevel2Text,
                                    datafield: 'limitValue2',
                                    width: 100,
                                    columntype: 'numberinput',
                                    cellsalign: 'right',
                                    initeditor: Main.limitInitEditor2
                                },
                                {
                                    text: evtLevel3Text,
                                    datafield: 'limitValue3',
                                    width: 100,
                                    columntype: 'numberinput',
                                    cellsalign: 'right',
                                    initeditor: Main.limitInitEditor2
                                },
                                {
                                    text: evtLevel4Text,
                                    datafield: 'limitValue4',
                                    width: 100,
                                    columntype: 'numberinput',
                                    cellsalign: 'right',
                                    initeditor: Main.limitInitEditor2
                                },
                                {
                                    text: evtLevel5Text,
                                    datafield: 'limitValue5',
                                    width: 100,
                                    columntype: 'numberinput',
                                    cellsalign: 'right',
                                    initeditor: Main.limitInitEditor2
                                },
                                {text: '사용', datafield: 'useFlag', width: 60, columntype: 'checkbox'}
                            ]
                        // }, CtxMenu.COMM, 'evtCode_limit');
                        }, CtxMenu.EACH_LIMIT_BATCH_SET, 'evtCode_limit');

                        HmGrid.create($('#evtCode_statGrid'), {
                            source: new $.jqx.dataAdapter({
                                    datatype: 'json',
                                    type: 'POST',
                                    contenttype: 'application/json; charset=utf-8',
                                    updaterow: function (rowid, rowdata, commit) {
                                        if (editEvtCode_statIds.indexOf(rowid) == -1)
                                            editEvtCode_statIds.push(rowid);
                                        commit(true);
                                    }
                                },
                                {
                                    formatData: function (data) {
                                        var rowdata = HmGrid.getRowData($devGrid);
                                        if (rowdata != null) {
                                            data.mngNo = rowdata.mngNo;
                                            data.devKind2 = rowdata.devKind2;
                                        }
                                        else {
                                            data.mngNo = -1;
                                            data.devKind2 = '';
                                        }
                                        return JSON.stringify(data);
                                    },
                                    loadComplete: function (records) {
                                        editEvtCode_statIds = [];
                                    }
                                }
                            ),
                            showtoolbar: true,
                            rendertoolbar: function (toolbar) {
                                HmGrid.titlerenderer(toolbar, '상태 이벤트');
                            },
                            editable: true,
                            pageable: false,
                            selectionmode: 'multiplerowsextended',
                            columns: [
                                {text: 'CODE', datafield: 'evtCd', width: 100, hidden: true, editable: false},
                                {text: '항목', datafield: 'evtNm', minwidth: 150, editable: false},
                                { text: '이벤트 등급', datafield: 'evtLevel', displayfield: 'disEvtLevel', width: 120, columntype: 'dropdownlist',
                                    createeditor: function (row, value, editor) {

                                        var s = [
                                            { label: $('#sEvtLevel1').val(), value: 1 },
                                            { label: $('#sEvtLevel2').val(), value: 2 },
                                            { label: $('#sEvtLevel3').val(), value: 3 },
                                            { label: $('#sEvtLevel4').val(), value: 4 },
                                            { label: $('#sEvtLevel5').val(), value: 5 }
                                        ];
                                        editor.jqxDropDownList({
                                            source: s,
                                            autoDropDownHeight: true,
                                            displayMember: 'label',
                                            valueMember: 'value',
                                            selectedIndex: 1
                                        });
                                    }
                                },
                                {
                                    text: 'Count',
                                    datafield: 'limitValue1',
                                    width: 120,
                                    columntype: 'numberinput',
                                    cellsalign: 'right',
                                    initeditor: Main.limitInitEditor, cellbeginedit: Main.isEditable, cellclassname: Main.isEditableClass
                                },
                                {
                                    text: 'Timeout(ms)',
                                    datafield: 'limitValue2',
                                    width: 120,
                                    columntype: 'numberinput',
                                    cellsalign: 'right',
                                    initeditor: Main.limitInitEditor, cellbeginedit: Main.isEditable, cellclassname: Main.isEditableClass
                                },
                                {
                                    text: 'Interval(ms)',
                                    datafield: 'limitValue3',
                                    width: 120,
                                    columntype: 'numberinput',
                                    cellsalign: 'right',
                                    initeditor: Main.limitInitEditor, cellbeginedit: Main.isEditable, cellclassname: Main.isEditableClass
                                },
                                {text: '사용', datafield: 'useFlag', width: 60, columntype: 'checkbox'}
                            ]
                        // }, CtxMenu.COMM, 'evtCode_limit');
                        }, CtxMenu.EACH_LIMIT_BATCH_SET, 'evtCode_limit');
                        break;
                }
            }
        });
        // 탭 클릭시 조회
        $('#dtlTab').on('tabclick', function (event) {
            var tabNo = event.args.item;
            if (tabNo == 0){
                Main.searchIf();
            }else{
                Main.searchDevLimit();
            }
        });

        var dynCols = [];

        try {

            Server.post('/main/popup/dynamicItem/getDynamicItemList.do', {
                data: {tableNm: 'CM_DEV10'},
                success: function (result) {
                    if (result != null && result.length > 0) {
                        $.each(result, function (i, v) {
                            var _type = v.colType == 'VARCHAR' ? 'string' : 'integer';
                            dynCols.push({
                                name: v.camelColNm,
                                type: _type,
                                text: v.colCap,
                                width: v.colDisWidth,
                                editable: false
                            });
                        });
                        console.log('dynCols', dynCols);
                    }
                    Main.initDevGrid(dynCols);
                }
            });
        } catch (e) {
            Main.initDevGrid(dynCols);
        }


        $('#ctxmenu_dev').jqxMenu({width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme})
            .on('itemclick', function (event) {
                Main.selectDevCtxmenu(event);
            });

        $('#ctxmenu_if').jqxMenu({width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme})
            .on('itemclick', function (event) {
                Main.selectIfCtxmenu(event);
            });

    },

    status_cellclassname: function (row, column, value, data) {
        if (value == 'X') {
            return 'critical'
        } else if (value == '-') {
            return 'disabledCell'
        } else {
            return 'normal'
        }
    },

    initDevGrid: function (dynCols) {

        var devAdapter = new HmDataAdapter().create(
            function (data) {
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
                $.extend(data, HmBoxCondition.getSrchParams());
                return data;
            },
            function (records) {
                editDevIds = [];
                curDevData = null;
                $ifGrid.jqxGrid('clear');
                $('#titleIfGrid').text('선택장비 [-]');
            }
        );

        devAdapter.setDataFields([
            {name: 'mngNo', type: 'number', text: '장비번호', hidden: true, editable: false},
            {
                name: 'icmpStatus',
                type: 'string',
                text: 'ICMP',
                width: 60,
                cellclassname: Main.status_cellclassname,
                cellsalign: 'center',
                editable: false,
                filtertype: 'checkedlist'
            },
            {
                name: 'snmpStatus',
                type: 'string',
                text: 'SNMP',
                width: 60,
                cellclassname: Main.status_cellclassname,
                cellsalign: 'center',
                editable: false,
                filtertype: 'checkedlist'
            },
            {name: 'devName', type: 'string', text: '장비명', width: 150, editable: false},
            {name: 'userDevName', type: 'string', text: '사용자장비명', width: 130},
            {name: 'devIp', type: 'string', text: '장비IP', width: 120},
            {
                name: 'devKind2', type: 'string', text: '장비종류', columntype: 'dropdownlist',
                createeditor: function (row, value, editor) {
                    editor.jqxDropDownList({source: codeMap.devKindList, dropDownWidth: 150, searchMode : 'containsignorecase', filterable: true});
                }, filtertype: 'checkedlist'
            },
            {
                name: 'vendor', type: 'string', text: '제조사', columntype: 'dropdownlist',
                createeditor: function (row, value, editor) {
                    editor.jqxDropDownList({source: codeMap.vendorList, dropDownWidth: 150, searchMode : 'containsignorecase', filterable: true});
                }, filtertype: 'checkedlist'
            },
            {
                name: 'model', type: 'string', text: '모델', columntype: 'dropdownlist',
                createeditor: function (row, value, editor) {
                    editor.jqxDropDownList({source: codeMap.vendorModelList, dropDownWidth: 150, searchMode : 'containsignorecase', filterable: true});
                }, filtertype: 'checkedlist'
            },
            {name: 'devLocation', type: 'string', text: '장비 위치', width: 120},
            {
                name: 'maintUser1',
                type: 'string',
                text: '담당자(정)',
                displayfield: 'maintUserName1',
                columngroup: 'muser',
                editable: false
            },
            {name: 'maintUserName1', type: 'string'},
            {
                name: 'maintUser2',
                type: 'string',
                text: '담당자(부)',
                displayfield: 'maintUserName2',
                columngroup: 'muser',
                editable: false
            },
            {name: 'maintUserName2', type: 'string'},
            {name: 'grpName', type: 'string', text: '소속그룹', editable: false},
            {name: 'parentMngNo', type: 'number', text: '상위장비', displayfield: 'parentDevName', editable: false},
            {name: 'parentDevName', type: 'string', editable: false},
            {
                name: 'profileNo',
                type: 'number',
                text: '프로파일',
                displayfield: 'profileNm',
                columntype: 'dropdownlist',
                createeditor: function (row, value, editor) {
                    editor.jqxDropDownList({
                        source: codeMap.profileList,
                        displayMember: 'profileNm',
                        valueMember: 'profileNo',
                        dropDownWidth: 150
                    });
                }
            },
            {name: 'profileNm', type: 'string', editable: false},
            {name: 'perfPoll', type: 'number', text: '성능수집설정', width: 100, columntype: 'checkbox', filtertype: 'bool'},
            {name: 'aiPoll', type: 'number', text: '성능예측', width: 100, columntype: 'checkbox', filtertype: 'bool'},
            {name: 'arpPoll', type: 'number', text: 'IP관리', width: 100, columntype: 'checkbox', filtertype: 'bool'},
            {
                name: 'cfgPoll',
                type: 'number',
                text: 'Config Backup',
                width: 100,
                columntype: 'checkbox',
                filtertype: 'bool'
            },
            {name: 'userMachineVer', type: 'string', text: 'OS버전', width: 120, displayfield: 'disMachineVer'},
            {name: 'disMachineVer', type: 'string', editable: false},
            {
                name: 'netPollGrpNo',
                type: 'number',
                text: '망구분',
                displayfield: 'disNetPollGrpNo',
                width: 100,
                editable: false
            },
            {name: 'disNetPollGrpNo', type: 'string', editable: false},
            {
                name: 'pollGrpNo',
                type: 'number',
                text: '수집기명',
                width: 120,
                displayfield: 'pollGrpNoStr',
                editable: false
            },
            {name: 'pollGrpNoStr', type: 'string', editable: false},
            {
                name: 'isPollGrpNoFix',
                type: 'number',
                text: '수집기 고정',
                width: 80,
                columntype: 'checkbox',
                filtertype: 'bool',
                editable: false
            },
            {
                name: 'pollGrpNoFix',
                type: 'number',
                text: '고정 수집기명',
                width: 120,
                displayfield: 'pollGrpNoFixStr',
                editable: false
            },
            {name: 'pollGrpNoFixStr', type: 'string'},
            {
                name: 'icmpPoll',
                type: 'number',
                text: '헬스체크',
                displayfield: 'disIcmpPoll',
                filtertype: 'list',
                columntype: 'dropdownlist',
                createeditor: function (row, value, editor) {
                    editor.jqxDropDownList({
                        source: HmResource.getResource('icmp_poll_list'),
                        autoDropDownHeight: true
                    });
                }
            },
            {name: 'disIcmpPoll', type: 'string'},
            {
                name: 'snmpVer',
                type: 'number',
                text: 'SNMP Ver',
                displayfield: 'snmpVer',
                columngroup: 'snmp',
                cellsrenderer: HmGrid.snmpVerrenderer,
                editable: false
            },
            {name: 'snmpVerStr', type: 'string'},
            {
                name: 'community',
                type: 'string',
                text: 'RO Community',
                columngroup: 'snmp',
                enabletooltips: false,
                cellsrenderer: HmGrid.secretrenderer,
                editable: false
            },
            {
                name: 'setCommunity',
                type: 'string',
                text: 'RW Community',
                columngroup: 'snmp',
                enabletooltips: false,
                cellsrenderer: HmGrid.secretrenderer,
                editable: false
            },
            {name: 'snmpUserId', type: 'string', text: 'SNMP UserID', columngroup: 'snmp', editable: false},
            {
                name: 'snmpSecurityLevel',
                type: 'number',
                text: 'SNMPSecurityLevel',
                displayfield: 'snmpSecurityLevelStr',
                columngroup: 'snmp',
                editable: false
            },
            {name: 'snmpSecurityLevelStr', type: 'string', editable: false},
            {
                name: 'snmpAuthType',
                type: 'number',
                text: 'SNMPAuthType',
                displayfield: 'snmpAuthTypeStr',
                columngroup: 'snmp',
                editable: false
            },
            {name: 'snmpAuthTypeStr', type: 'string', editable: false},
            {
                name: 'snmpAuthKey',
                type: 'string',
                text: 'SNMPAuthKey',
                columngroup: 'snmp',
                enabletooltips: false,
                cellsrenderer: HmGrid.secretrenderer,
                editable: false
            },
            {
                name: 'snmpEncryptType',
                type: 'number',
                text: 'SNMPEncryptType',
                displayfield: 'snmpEncryptTypeStr',
                columngroup: 'snmp',
                editable: false
            },
            {name: 'snmpEncryptTypeStr', type: 'string', editable: false},
            {
                name: 'snmpEncryptKey',
                type: 'string',
                text: 'SNMPEncryptKey',
                columngroup: 'snmp',
                enabletooltips: false,
                cellsrenderer: HmGrid.secretrenderer,
                editable: false
            },
            {name: 'evtPoll', type: 'number'},
            {name: 'userId', type: 'string', text: '사용자아이디', columngroup: 'connect', editable: false},
            {
                name: 'loginPwd',
                type: 'string',
                text: '패스워드',
                columngroup: 'connect',
                enabletooltips: false,
                cellsrenderer: HmGrid.secretrenderer,
                editable: false
            },
            {
                name: 'enPwd',
                type: 'string',
                text: '2차인증 패스워드',
                columngroup: 'connect',
                enabletooltips: false,
                cellsrenderer: HmGrid.secretrenderer,
                editable: false
            },

            {name: 'confMode', type: 'string', text: 'Connect Mode', columngroup: 'connect', editable: false},

            {name: 'multiOidYn', type: 'string', editable: false},

            {
                name: 'tmplNo', type: 'string', text: 'OID 템플릿', displayfield: 'tmplNm', columntype: 'dropdownlist',
                createeditor: function (row, value, editor) {
                    editor.jqxDropDownList({
                        source: codeMap.oidTmplList,
                        displayMember: 'tmplNm',
                        valueMember: 'tmplNo',
                        dropDownWidth: 150,
                        searchMode : 'containsignorecase', filterable: true
                    });
                }
            },
            {name: 'tmplNm', type: 'string', editable: false},
            {
                name: 'cfgbackTmplNo',
                type: 'number',
                text: 'ConfigBackup 템플릿',
                width: 120,
                displayfield: 'cfgbackTmplNm',
                columntype: 'dropdownlist',
                createeditor: function (row, value, editor) {
                    editor.jqxDropDownList({
                        source: codeMap.cfgbackTmplList,
                        displayMember: 'tmplNm',
                        valueMember: 'tmplNo',
                        dropDownWidth: 150
                    });
                }, hidden: true
            },
            {
                name: 'thrhldGrpNo',
                type: 'number',
                text: '동적임계치',
                width: 120,
                displayfield: 'thrhldGrpNm',
                columntype: 'dropdownlist',
                createeditor: function (row, value, editor) {

                    editor.jqxDropDownList({
                        source: codeMap.devDynamicThrhldList,
                        displayMember: 'thrhldGrpNm',
                        valueMember: 'thrhldGrpNo',
                        dropDownWidth: 150
                    });

                }

            },
            {name: 'thrhldGrpNm', type: 'string', editable: false},
            {name: 'remarks', type: 'string', text: '비고', width: 200}
        ].concat(dynCols));

        hmDevGrid = new HmJqxGrid('devGrid', devAdapter);

        hmDevGrid.create({
            selectionmode: 'multiplerowsextended',
            editable: true,
            editmode: 'selectedcell',
            columngroups: [
                {text: '담당자', align: 'center', name: 'muser'},
                {text: 'SNMP', align: 'center', name: 'snmp'},
                {text: '접속정보', align: 'center', name: 'connect'}
            ]
        }, CtxMenu.NONE);

        $devGrid.on('rowdoubleclick', function (event) {
            var rowIdx = event.args.rowindex;
            var rowdata = $(this).jqxGrid('getrowdata', rowIdx);
            $('#titleIfGrid').text('선택장비 [ ' + rowdata.devName + ' - ' + rowdata.devIp + ' ]');
            curDevData = rowdata;
            if ($('#dtlTab').val() == 0) {
                Main.searchIf();
            }
            else {
                Main.searchDevLimit();
            }
        })
            .on('contextmenu', function (event) {
                return false;
            })
            .on('rowclick', function (event) {

                if (event.args.rightclick) {
                    $devGrid.jqxGrid('selectrow', event.args.rowindex);
                    var rowIdxes = HmGrid.getRowIdxes($devGrid, '장비를 선택해주세요.');
                    if (rowIdxes.length > 1) {
                        $('#cm_devInfoSet, #cm_devInfoCopySet, #cm_chgMgr, #cm_devOidSet, #cm_snmpTester').css('display', 'none');
                    }
                    else {
                        $('#cm_devInfoSet, #cm_devInfoCopySet, #cm_chgMgr, #cm_devOidSet, #cm_snmpTester').css('display', 'block');
                    }

                    var scrollTop = $(window).scrollTop();
                    var scrollLeft = $(window).scrollLeft();
                    $('#ctxmenu_dev').jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
                        parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);

                    return false;

                }
            });

        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.searchDev, {devKind1: 'DEV'});


    },

    /** init data */
    initData: function () {

        Server.post('/combo/getSysoidVendorList.do', {
            success: function (result) {
                codeMap.vendorList = result;
            }
        });
        Server.post('/combo/getSysoidModelList.do', {
            success: function (result) {
                codeMap.vendorModelList = result;
            }
        });
        Server.post('/combo/getSysoidDevKindList.do', {
            success: function (result) {
                codeMap.devKindList = result;
            }
        });


        Server.post('/dev/getOidTmplList.do', {
            success: function (result) {
                codeMap.oidTmplList = result;
            }
        });
        Server.post('/main/nms/alarmMgmt2/getSystemCdProfileList.do', {
            data: { devKind1 : 'DEV'} ,
            success: function (result) {
                codeMap.profileList = result;
            }
        });

        // Server.post('/main/com/cfgbackTmpl/getCfgbackTmplList.do', {
        //     data: {},
        //     success: function (result) {
        //         codeMap.cfgbackTmplList = result;
        //     }
        // });

        Server.post('/main/popup/dynamicThreshold/getDynamicThresholdGrpList.do', {
            data: {devKind1: 'DEV', useFlag: 1},
            success: function (result) {
                $.each(result, function (i, v) {
                    if (v.thrhldKind == 'DEV') {
                        codeMap.devDynamicThrhldList.push(v);
                    } else if (v.thrhldKind == 'IF') {
                        codeMap.ifDynamicThrhldList.push(v);
                    }
                });
            }
        });
    },

    /** 그룹관리 */
    addGrp: function () {
        var treeItem = HmTreeGrid.getSelectedItem($grpTree);
        var _grpParent = 1;
        if (treeItem.devKind2 == 'GROUP') _grpParent = treeItem.grpNo;
        else _grpParent = treeItem.grpParent;

        $.get(ctxPath + '/main/popup/env/pGrpAdd.do', function (result) {
            HmWindow.open($('#pwindow'), '그룹 등록', result, 400, 500, 'pwindow_init', treeItem);
        });
    },

    editGrp: function () {
        var grpSelection = $grpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if (treeItem.devKind2 != 'GROUP') {
            alert('장비는 수정할 수 없습니다.');
            return;
        }
        if (treeItem.grpParent == 0) {
            alert('최상위 그룹을 수정할 수 없습니다.');
            return;
        }

        var _params = {
            grpNo: treeItem.grpNo,
            grpName: treeItem.grpName.substr(0, treeItem.grpName.lastIndexOf('(')),
            grpParent: treeItem.grpParent,
            grpCode: treeItem.grpCode
        };
        $.post(ctxPath + '/main/popup/env/pGrpEdit.do', _params,
        function (result) {
            HmWindow.open($('#pwindow'), '그룹 수정', result, 400, 500, 'pwindow_init', _params);
        }
        );
    },

    delGrp: function () {
        var grpSelection = $grpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if (treeItem.devKind2 != 'GROUP') {
            alert('장비는 삭제할 수 없습니다.');
            return;ge
        }
        if (treeItem.grpParent == 0) {
            alert('최상위 그룹을 삭제할 수 없습니다.');
            return;
        }
        var treeItem = grpSelection[0];
        if (!confirm('[' + treeItem.grpName.substr(0, treeItem.grpName.lastIndexOf('(')) + '] 그룹을 삭제하시겠습니까?')) return;
        Server.post('/grp/delDefaultGrp.do', {
            data: {grpNo: treeItem.grpNo},
            success: function (result) {
                $grpTree.jqxTreeGrid('deleteRow', treeItem.uid);
                $grpTree.jqxTreeGrid('selectRow', $grpTree.jqxTreeGrid('getRows')[0].uid);
                alert('삭제되었습니다.');
            }
        });
    },

    /** 장비 자동 추가 */
    addAuto: function () {

        Server.get('/main/popup/devScan/getRegDevCnt.do', {
            success: function (cnt) {
                if (cnt > 0) {
                    $('#msgbox').jqxWindow({
                        width: 390,
                        title: '<h1>미등록장비 알림</h1>',
                        content: '<div style="text-align: center; line-height:22px;">' +
                        '           <span style="display:inline-block; height:48px; line-height: 48px; font-size:16px; font-weight: bold;">미등록 장비가 존재합니다.</span><br />' +
                        '<b>[등록]</b> 버튼을 선택하시면 미등록 장비를 등록합니다.<br />' + '<b>[장비스캔]</b> 버튼을 선택하시면 미등록 장비를 지우고 다시 스캔합니다.<br /></div>' +
                        '<div style="text-align: center; margin-top:15px;">' +
                        '    <button type="button" id="regBtn" class="btn_A btn_ico_13" click="Main.addMultiDev()">등록</button>' +
                        '    <button type="button" id="scanBtn" class="btn_A btn_ico_20" click="Main.scanDev()">장비스캔</button>' +
                        '</div>',
                        okButton: $('#regBtn'), cancelButton: $('#scanBtn'),
                        initContent: function () {
                            $('#regBtn, #scanBtn').jqxButton();
                            $('#regBtn').on('click', function () {
                                $('#msgbox').jqxWindow('close');
                                Main.addScanMultiDev();
                            });
                            $('#scanBtn').on('click', function () {
                                $('#msgbox').jqxWindow('close');
                                Main.scanDev();
                            });
                        }
                    });

                    $('#msgbox').on('close');
                    $('#msgbox').jqxWindow('open');

                } else {

                    Main.scanDev();

                }
            }
        });


    },

    /** 장비 스캔 */
    scanDev: function () {

        $.get(ctxPath + '/main/popup/env/pDevScan.do', function (result) {
            HmWindow.openFit($('#pwindow'), '장비 자동 등록', result, 600, 281);
        });

    },

    /** 스캔장비 멀티추가 */
    addScanMultiDev: function () {
        HmUtil.createPopup('/main/popup/env/pScanDevAddMulti.do', $('#hForm'), 'pScanMultiAdd', 1400, 700);
    },

    /** 멀티 장비추가 */
    addMultiDev: function () {


        if ($('#gSiteName').val() == 'KoreaBank') {//한국은행 사이트 예외처리
            HmUtil.createPopup('/koreaBank/popup/env/pDevAddMulti.do', $('#hForm'), 'pMultiAdd', 1400, 700);
        } else {
            HmUtil.createPopup('/main/popup/env/pDevAddMulti.do', $('#hForm'), 'pMultiAdd', 1400, 700);
        }

    },

    /** 장비 */
    addDev: function () {

        var _itemKind, _grpNo, _grpParent;

        var treeItem = HmTreeGrid.getSelectedItem($grpTree);

        if (treeItem != null) {
            _itemKind = treeItem.devKind2;
            _grpNo = _itemKind == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1];
            _grpParent = treeItem.grpParent;
        }

        $.get(ctxPath + '/main/popup/env/pDevAdd.do', function (result) {
            HmWindow.openFit($('#pwindow'), '장비 추가', result, 600, 650, 'pwindow_init', _grpNo);
        });

    },

    delDev: function () {

        var rowIdxes = HmGrid.getRowIdxes($devGrid);
        if (rowIdxes === false) {
            alert('선택된 장비가 없습니다.');
            return;
        }

        if (!confirm('[' + rowIdxes.length + ']건의 장비를 삭제하시겠습니까?')) return;

        var _mngNos = [], _uids = [];

        $.each(rowIdxes, function (idx, value) {
            var tmp = $devGrid.jqxGrid('getrowdata', value);
            _mngNos.push(tmp.mngNo);
            _uids.push(tmp.uid);
        });

        Server.post('/dev/delMultiDev.do', {
            data: {mngNos: _mngNos},
            success: function (result) {
                $devGrid.jqxGrid('deleterow', _uids);
                refreshGrp();
                alert('삭제되었습니다.');
            }
        });

    },

    searchDev: function () {
        HmGrid.updateBoundData($devGrid, ctxPath + '/main/env/devMgmt/getDevMgmt2List.do');
    },

    saveDev: function () {

        var _list = hmDevGrid.getEditRows();

        if (_list.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }

        Server.post('/main/env/devMgmt/saveDevMgmt.do', {
            data: {list: _list},
            success: function (result) {
                hmDevGrid.clearEditRowIds();
                if (result == 'SUCCESS') {
                    alert('저장되었습니다.');
                    Main.searchDev();
                } else {
                    alert(result);
                    Main.searchDev();
                }
            }
        });

    },

    /* 전체장비 변경관리 호출 */
    execChgMgr: function () {
        if (!confirm('전체 장비에 대한 변경관리를 수행하시겠습니까?')) return;

        //수집기 번호 얻기

        Server.get('/code/getCodeListByCodeKind.do', {
            data: {codeKind: 'POLL_GRP_NO', useFlag: 1},
            success: function (result) {

                var _pollGrpNoList = result;
                var _runList = {};
                for(var i = 0 ; i < _pollGrpNoList.length ; i++){
                    _runList[_pollGrpNoList[i].codeId] = [];
                }//for end(i)
                var _paramObj = {
                    MSG_SEND: "WEB",//데이터전달위치
                    MSG_YMDHMS: $.format.date(new Date(), 'yyyyMMddHHmmss'),//전달받을 시간
                    RUN_LIST: _runList,
                    DETAIL_INFO: {},//RUN_LIST에서 추가로 사용할 값
                    MSG_BYPASS: 1,
                    MSG_STATUS: "START",//START,END
                    MSG_CYCLE: 0,//초단위 주기적 실행
                    RTN_FLAG: 0,//0:결과과정 전달안함
                    RTN_ID: "",//cupid user id
                    RTN_TARGET: "",//cupid guid
                    RTN_GUID: ""//cupid sessionId
                };

                ServerRest.cupidRest({
                    _REST_PATH: '/nms/perf/chgmgr',
                    _REST_PARAM: _paramObj,
                    _CALLBACK: function(DATA){
                        if(DATA.RESULT == 1){
                            alert("실행했습니다.");
                        } else {
                            alert("호출중 에러가 발생했습니다. 잠시후 다시 시도해주세요");
                        }
                    }
                });
            }//success
        });

        // Server.post('/main/env/devMgmt/execChgMgrEngineForDevAll.do', {
        //     data: {},
        //     success: function (result) {
        //         alert(result);
        //     }
        // });
    },

    /** 회선 */
    searchIf: function () {

        var rowIdx = HmGrid.getRowIdx($devGrid);
        if (rowIdx !== false) {
            curDevData = $devGrid.jqxGrid('getrowdata', rowIdx);
            $('#titleIfGrid').text('선택장비 [ ' + curDevData.devName + ' - ' + curDevData.devIp + ' ]');
        }

        HmGrid.updateBoundData($ifGrid, ctxPath + '/main/env/devMgmt/getIfMgmtList.do');

    },

    /** 대역폭 설정 */
    confLineWidth: function () {
        var params = {
            mngNo: curDevData == null ? 0 : curDevData.mngNo
        };
        $.get(ctxPath + '/main/popup/env/pLineWidthConf.do',
            params,
            function (result) {
                HmWindow.open($('#pwindow'), '대역폭 설정', result, 800, 600);
            }
        );
    },

    saveDtl: function () {
        if ($('#dtlTab').val() == 0) {
            this.saveIf();
        }
        else {
            this.saveDevLimit();
        }
    },

    searchDtl: function () {
        console.log("im in");
        if ($('#dtlTab').val() == 0) {
            console.log("1");
            this.searchIf();
        }
        else {
            console.log("2");
            this.searchDevLimit();
        }
    },

    exportExcelDtl: function () {
        if ($('#dtlTab').val() == 0) {
            this.exportExcel_if();
        }
        else {
            this.exportExcel_devLimit();
        }
    },

    saveIf: function () {

        HmGrid.endRowEdit($ifGrid);

        if (editIfIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }

        var _list = [];
        $.each(editIfIds, function (idx, value) {
            _list.push($ifGrid.jqxGrid('getrowdatabyid', value));
        });

        Server.post('/main/env/devMgmt/saveIfMgmt.do', {
            data: {list: _list, devName: curDevData.devName},
            success: function (result) {
                if (result == 'SUCCESS') {
                    alert('저장되었습니다.');
                    editIfIds = [];
                } else {
                    alert(result);
                    Main.searchIf();
                }
            }
        });


    },

    showDevConfigLog: function (send_data, result) {
        var params = $.parseJSON(send_data);// params를 문자형으로 받음
        if (result != null) {
            $.extend(params, {
                result: result,
                type: 0
            });
        }

        var type = params.type;
        var popTxt = "";
        popTxt = "변경관리 결과";

        $.get(ctxPath + '/main/popup/env/pDevConfLog.do', function (result) {
            HmWindow.open($('#pwindow'), popTxt, result, 350, 120, 'pwindow_init', params);
        });


    },

    /** 장비 임계값 */
    searchDevLimit: function () {
        var rowdata = HmGrid.getRowData($devGrid);

        var params = {};
        if (rowdata != null) {
            params.mngNo = rowdata.mngNo;
            params.devKind2 = rowdata.devKind2;
        }
        else {
            params.mngNo = -1;
            params.devKind2 = '';
        }
        Server.post('/main/env/devMgmt/getDevEvtCodeList.do', {
            data: params,
            success: function (result) {
                var _limitList = [], _statList = [];
                if (result != null) {
                    _limitList = result.filter(function (d) {
                        // return d.codeType == 1;
                        return d.evtCond == 1;
                    });
                    _statList = result.filter(function (d) {
                        // return d.codeType == 0;
                        return d.evtCond == 0;
                    })
                }
                // _statList 배열의 내용이 비어있으면 빈 배열로 변환
                if (_statList.length<2 && _statList[0].code==null && _statList[0].engName==null && _statList[0].evtName==null && _statList[0].evtNm==null) _statList=[];
                HmGrid.setLocalData($('#evtCode_limitGrid'), _limitList);
                HmGrid.setLocalData($('#evtCode_statGrid'), _statList);
            }
        });
    },

    saveDevLimit: function () {
        HmGrid.endRowEdit($('#evtCode_limitGrid'));
        if (editEvtCode_limitIds.length == 0 && editEvtCode_statIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(editEvtCode_limitIds, function (idx, value) {
            var tmp = $('#evtCode_limitGrid').jqxGrid('getrowdatabyid', value);
            tmp.useFlag = tmp.useFlag ? 1 : 0;
            if (tmp.limitValue1 == "null"){ tmp.limitValue1 = 0; }
            else{ tmp.limitValue1  = parseFloat(tmp.limitValue1); }
            if (tmp.limitValue2 == "null"){ tmp.limitValue2 = 0; }
            else{ tmp.limitValue2  = parseFloat(tmp.limitValue2); }
            if (tmp.limitValue3 == "null"){ tmp.limitValue3 = 0; }
            else{ tmp.limitValue3  = parseFloat(tmp.limitValue3); }
            if (tmp.limitValue4 == "null"){ tmp.limitValue4 = 0; }
            else{ tmp.limitValue4  = parseFloat(tmp.limitValue4); }
            if (tmp.limitValue5 == "null"){ tmp.limitValue5 = 0; }
            else{ tmp.limitValue5  = parseFloat(tmp.limitValue5); }
            _list.push(tmp);
        });
        $.each(editEvtCode_statIds, function (idx, value) {
            var tmp = $('#evtCode_statGrid').jqxGrid('getrowdatabyid', value);
            tmp.useFlag = tmp.useFlag ? 1 : 0;
            if (tmp.limitValue1 == "null"){ tmp.limitValue1 = parseInt('0') }
            else{ tmp.limitValue1  = parseInt(tmp.limitValue1); }
            if (tmp.limitValue2 == "null"){ tmp.limitValue2 = parseInt('0') }
            else{ tmp.limitValue2  = parseInt(tmp.limitValue2); }
            if (tmp.limitValue3 == "null"){ tmp.limitValue3 = parseInt('0') }
            else{ tmp.limitValue3  = parseInt(tmp.limitValue3); }
            _list.push(tmp);
        });

        Server.post('/main/env/devMgmt/saveDevEvtCode.do', {
            data: {list: _list},
            success: function (result) {
                alert('저장되었습니다.');
                editEvtCode_limitIds = [];
                editEvtCode_statIds = [];
            }
        });
    },

    /** ContextMenu */
    selectDevCtxmenu: function (event) {
        switch ($(event.args)[0].id) {
            case 'cm_devInfoSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($devGrid, '장비를 선택해주세요.');
                    if (rowIdxes === false) return;

                    var rowdata = $devGrid.jqxGrid('getrowdata', rowIdxes[0]);

                    var params = {
                        mngNo: rowdata.mngNo,
                        action: 'U'
                    };

                    $.post(ctxPath + '/main/popup/env/pDevAdd.do',
                        params,
                        function (result) {
                            HmWindow.openFit($('#pwindow'), '[{0}] 장비정보 변경'.substitute(rowdata.userDevName || rowdata.devName), result, 600, 680);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_chgMgr':
                try {
                    var rowIdx = HmGrid.getRowIdx($devGrid, '장비를 선택해주세요.');
                    if (rowIdx === false) return;
                    if (!confirm('변경관리 엔진을 가동하시겠습니까?')) return;
                    //var _mngNos = [];
                    //var _devIps = []; // 변경관리 엔진이 장비하나 선택-우클릭시에만 나온다는 가정하에.

                    // $.each(rowIdxes, function (idx, value) {
                    //     var oneDt = $devGrid.jqxGrid('getrowdata', value);
                    //     _mngNos.push(oneDt.mngNo);
                    //     _devIps.push(oneDt.devIp);
                    // });

                    // var params = {
                    //     mngNos: _mngNos.join(','),
                    //     devIps: _devIps.join(',')
                    // };
                    //엔진구동
                    // var loader = $('#comLoader');
                    // if (loader.length <= 0) {
                    //     loader = $('<div id="comLoader" style="z-index: 100000"></div>');
                    //     loader.appendTo('body');
                    // }
                    // loader.jqxLoader({
                    //     isModal: false,
                    //     width: 330,
                    //     height: 80,
                    //     theme: jqxTheme,
                    //     text: '변경관리 엔진을 호출중입니다. 잠시만 기다려주세요.'
                    // });
                    // loader.jqxLoader('open');

                    var _rowData = $devGrid.jqxGrid('getrowdata', rowIdx);

                    var _runList = {};
                    _runList[_rowData.pollGrpNo + ""] = [parseInt(_rowData.mngNo)];
                    //{"1" : [17]}
                    var _paramObj = {
                        MSG_SEND: "WEB",//데이터전달위치
                        MSG_YMDHMS: $.format.date(new Date(), 'yyyyMMddHHmmss'),//전달받을 시간
                        RUN_LIST: _runList,
                        DETAIL_INFO: {},//RUN_LIST에서 추가로 사용할 값
                        MSG_BYPASS: 1,
                        MSG_STATUS: "START",//START,END
                        MSG_CYCLE: 0,//초단위 주기적 실행
                        RTN_FLAG: 0,//0:결과과정 전달안함
                        RTN_ID: "",//cupid user id
                        RTN_TARGET: "",//cupid guid
                        RTN_GUID: ""//cupid sessionId
                    };

                    ServerRest.cupidRest({
                        _REST_PATH: '/nms/perf/chgmgr',
                        _REST_PARAM: _paramObj,
                        _CALLBACK: function(DATA){
                            if(DATA.RESULT == 1){
                                alert("실행했습니다.");
                            } else {
                                alert("호출중 에러가 발생했습니다. 잠시후 다시 시도해주세요");
                            }
                        }
                    });

//                     Server.post('/main/env/devMgmt/execChgMgrEngine.do', {
//                         data: params,
//                         success: function (result, send_data) {
//                             loader.jqxLoader('close');
//                             alert(result);
// //							if(result.indexOf("실패")==-1) // 실행결과 실패 아니면 config 결과창 띄움
// //							Main.showDevConfigLog(send_data, result);
//                         },
//                         error: function () {
//                             loader.jqxLoader('close');
//                         }
//                     });
                } catch (e) {
                }
                break;
            case 'cm_devOidSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($devGrid, '장비를 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _mngNo = [];
                    $.each(rowIdxes, function (idx, value) {
                        _mngNo.push($devGrid.jqxGrid('getrowdata', value).mngNo);
                    });
                    var params = {
                        mngNo: _mngNo.join(',')
                    };
                    HmWindow.create($('#pwindow'), 550, 500, 999);
                    $.post(ctxPath + '/main/popup/env/pDevOidSet.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), 'OID 지표설정', result, 550, 395);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_devInfoCopySet':       /* 장보정보 복사 (단일장비 복사) */
                try {
                    var rowIdxes = HmGrid.getRowIdxes($devGrid, '장비를 선택해주세요.');
                    if(rowIdxes === false) return;
                    if ( rowIdxes.length > 1) {
                        alert('단일장비를 선택해주세요.');
                        return;
                    }
                    var rowdata = $devGrid.jqxGrid('getrowdata', rowIdxes[0]);
                    var params = {
                        mngNo: rowdata.mngNo,
                        action: 'C'
                    };
                    $.post(ctxPath + '/main/popup/env/pDevCopy.do',
                        params,
                        function (result) {
                            HmWindow.openFit($('#pwindow'), '[{0}] 장비정보 복사'.substitute(rowdata.userDevName || rowdata.devName), result, 600, 680);
                        }
                    );



                } catch(e) {}
                break;
            case 'cm_devInfoBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($devGrid, '장비를 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _mngNos = [];
                    $.each(rowIdxes, function (idx, value) {
                        _mngNos.push($devGrid.jqxGrid('getrowdata', value).mngNo);
                    });
                    var params = {
                        mngNos: _mngNos.join(',')
                    };
                    $.post(ctxPath + '/main/popup/env/pDevInfoBatchSet.do',
                        params,
                        function (result) {
                            HmWindow.openFit($('#pwindow'), '장비정보 일괄설정', result, 600, 175);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_devCollectBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($devGrid, '장비를 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _mngNos = [], _baseNetPollGrpNo = 0, _isSameNetPollGrpNo = true;
                    $.each(rowIdxes, function (idx, value) {
                        var _tmp = $devGrid.jqxGrid('getrowdata', value);
                        _mngNos.push(_tmp.mngNo);
                        //망구분이 혼합되어 있는지 체크!!
                        if (idx == 0) {
                            _baseNetPollGrpNo = _tmp.netPollGrpNo;
                        }
                        else {
                            if (_baseNetPollGrpNo != _tmp.netPollGrpNo) {
                                _isSameNetPollGrpNo = false;
                            }
                        }
                    });
                    var params = {
                        mngNos: _mngNos.join(','),
                        isSameNetPollGrpNo: _isSameNetPollGrpNo,
                        netPollGrpNo: _baseNetPollGrpNo
                    };
                    HmWindow.create($('#pwindow'), 500, 670, 999);
                    $.post(ctxPath + '/main/popup/env/pDevCollectBatchSet.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '수집정보 일괄설정', result, 500, 696);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_devMaintBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($devGrid, '장비를 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _mngNos = [];
                    $.each(rowIdxes, function (idx, value) {
                        _mngNos.push($devGrid.jqxGrid('getrowdata', value).mngNo);
                    });
                    var params = {
                        mngNos: _mngNos.join(',')
                    };
                    HmWindow.create($('#pwindow'), 300, 150, 999);
                    $.post(ctxPath + '/main/popup/env/pDevMaintBatchSet.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '장비담당자 일괄설정', result, 300, 142);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_devConnBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($devGrid, '장비를 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _mngNos = [];
                    $.each(rowIdxes, function (idx, value) {
                        _mngNos.push($devGrid.jqxGrid('getrowdata', value).mngNo);
                    });
                    var params = {
                        mngNos: _mngNos.join(',')
                    };
                    HmWindow.create($('#pwindow'), 400, 295, 999);
                    $.post(ctxPath + '/main/popup/env/pDevConnBatchSet.do',
                        params,
                        function (result) {
                            HmWindow.openFit($('#pwindow'), '접속정보 일괄설정', result, 600, 310);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_grpMoveBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($devGrid, '장비를 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _mngNos = [];
                    $.each(rowIdxes, function (idx, value) {
                        _mngNos.push($devGrid.jqxGrid('getrowdata', value).mngNo);
                    });
                    var params = {
                        mngNos: _mngNos.join(',')
                    };
                    HmWindow.create($('#pwindow'), 500, 500, 999);
                    $.post(ctxPath + '/main/popup/env/pDevGrpBatchSet.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '장비 그룹이동', result, 400, 376);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_devEvtCodeBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($devGrid, '장비를 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _mngNos = [];
                    var diffProfileChk = true;
                    var tempProfileNo = -1;
                    $.each(rowIdxes, function (idx, value) {
                        _mngNos.push($devGrid.jqxGrid('getrowdata', value).mngNo);
                        if(tempProfileNo==-1){
                            tempProfileNo = $devGrid.jqxGrid('getrowdata', value).profileNo;
                        }else{
                            if( tempProfileNo != $devGrid.jqxGrid('getrowdata', value).profileNo ){
                                diffProfileChk = false;
                            }
                        }
                    });
                    if(!diffProfileChk){
                        alert("같은 프로파일만 일괄설정 가능합니다.");
                        return false;
                    }
                    var params = {
                        mngNos: _mngNos.join(','),
                        profileNo : tempProfileNo
                    };
                    $.post(ctxPath + '/main/popup/env/pDevEvtCodeBatchSet.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '임계치 일괄설정', result, 1240, 500);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_devDynInfoBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($devGrid, '장비를 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _mngNos = [];
                    $.each(rowIdxes, function (idx, value) {
                        _mngNos.push($devGrid.jqxGrid('getrowdata', value).mngNo);
                    });
                    var params = {
                        mngNos: _mngNos.join(',')
                    };
                    $.post(ctxPath + '/main/popup/env/pDevDynInfoBatchSet.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '동적컬럼 일괄설정', result, 400, 175);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_devDynThresholdBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($devGrid, '장비를 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _mngNos = [];
                    $.each(rowIdxes, function (idx, value) {
                        _mngNos.push($devGrid.jqxGrid('getrowdata', value).mngNo);
                    });
                    var params = {
                        devKind1: 'DEV',
                        thrhldKind: 'DEV',
                        mngNos: _mngNos.join(',')
                    };
                    $.post(ctxPath + '/main/popup/env/pDynThresholdBatchSet.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '동적임계치 일괄설정', result, 400, 120, 'pwindow_init', params);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_snmpTester':
                try {
                    var rowidx = HmGrid.getRowIdxes($devGrid, '장비를 선택해주세요.');

                    if (rowidx === false) return;
                    var rowdata = $devGrid.jqxGrid('getrowdata', rowidx[0]);
                    var params = {
                        mngNo: rowdata.mngNo
                    };
                    HmUtil.showSimpleSnmpQueryPopup(params);
                } catch (e) {
                }
                break;
            case 'cm_set':
                var mnId = $(event.args)[0].id;
                switch (mnId) {
                    case 'mnPerfSet':
                        break;
                    case 'mnCfgSet':
                        break;
                }
                break;
            case 'cm_clear':
                var mnId = $(event.args)[0].id;
                switch (mnId) {
                    case 'mnPerfSet':
                        break;
                    case 'mnCfgSet':
                        break;
                }
                break;
            case 'None':
            case 'Both':
            case 'ICMP':
            case 'SNMP':
                break;
            case 'Ver1':
            case 'Ver2':
            case 'Ver3':
                break;
            case 'cm_filter':
                $devGrid.jqxGrid('beginupdate');
                if ($devGrid.jqxGrid('filterable') === false) {
                    $devGrid.jqxGrid({filterable: true});
                }
                setTimeout(function () {
                    $devGrid.jqxGrid({showfilterrow: !$devGrid.jqxGrid('showfilterrow')});
                }, 300);
                $devGrid.jqxGrid('endupdate');
                break;
            case 'cm_filterReset':
                $devGrid.jqxGrid('clearfilters');
                break;
            case 'cm_colsMgr':
                // $.post(ctxPath + '/main/popup/comm/pGridColsMgr.do',
                //     function (result) {
                //         HmWindow.open($('#pwindow'), '컬럼 관리', result, 300, 400, 'pwindow_init', $devGrid);
                //     }
                // );
                $.post(ctxPath + '/main/popup/comm/pGridColsSysMgr.do',
                    function (result) {
                        HmWindow.open($('#pwindow'), '시스템 컬럼 관리', result, 600, 600, 'pwindow_init', $devGrid);
                    }
                );
                break;
        }
    },

    selectIfCtxmenu: function (event) {
        switch ($(event.args)[0].id) {
            case 'cm_ifInfoSet':

                try {
                    var rowIdxes = HmGrid.getRowIdxes($ifGrid, '회선을 선택해주세요.');
                    if (rowIdxes === false) return;
                    var rowdata = $ifGrid.jqxGrid('getrowdata', rowIdxes[0]);
                    var params = {
                        action: 'U',
                        mngNo: rowdata.mngNo,
                        ifIdx: rowdata.ifIdx,
                        profileNo: rowdata.profileNo,
                        devKind2: rowdata.devKind2
                    };
                    $.post(ctxPath + '/main/popup/env/pIfInfoSet.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '회선정보 변경', result, 700, 580);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_ifInfoBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($ifGrid, '회선을 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _ifIdxs = [];
                    var _mngNo;
                    $.each(rowIdxes, function (idx, value) {
                        var _data = $ifGrid.jqxGrid('getrowdata', value);
                        _mngNo = _data.mngNo;
                        _ifIdxs.push(_data.ifIdx);
                    });
                    var params = {
                        mngNo: _mngNo,
                        ifIdxs: _ifIdxs.join(',')
                    };
                    HmWindow.create($('#pwindow'), 500, 500, 999);
                    $.post(ctxPath + '/main/popup/env/pIfInfoBatchSet.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '회선정보 일괄설정', result, 400, 364);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_ifLimitBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($ifGrid, '회선을 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _ifIdxs = [];
                    var _mngNo;
                    $.each(rowIdxes, function (idx, value) {
                        var _data = $ifGrid.jqxGrid('getrowdata', value);
                        _mngNo = _data.mngNo;
                        _ifIdxs.push(_data.ifIdx);
                    });
                    var params = {
                        mngNo: _mngNo,
                        ifIdxs: _ifIdxs.join(',')
                    };
                    HmWindow.create($('#pwindow'), 500, 500, 999);
                    $.post(ctxPath + '/main/popup/env/pIfLimitBatchSet.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '임계치 일괄설정', result, 350, 270);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_ifDynThresholdBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($ifGrid, '회선을 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _ifIdxs = [];
                    var _mngNo;
                    $.each(rowIdxes, function (idx, value) {
                        var _data = $ifGrid.jqxGrid('getrowdata', value);
                        _mngNo = _data.mngNo;
                        _ifIdxs.push(_data.ifIdx);
                    });
                    var params = {
                        devKind1: 'DEV',
                        thrhldKind: 'IF',
                        mngNos: _mngNo,
                        ifIdxs: _ifIdxs.join(',')
                    };
                    HmWindow.create($('#pwindow'), 500, 500, 999);
                    $.post(ctxPath + '/main/popup/env/pDynThresholdBatchSet.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '동적임계치 일괄설정', result, 400, 120, 'pwindow_init', params);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_filter':
                $ifGrid.jqxGrid('beginupdate');
                if ($ifGrid.jqxGrid('filterable') === false) {
                    $ifGrid.jqxGrid({filterable: true});
                }
                setTimeout(function () {
                    $ifGrid.jqxGrid({showfilterrow: !$ifGrid.jqxGrid('showfilterrow')});
                }, 300);
                $ifGrid.jqxGrid('endupdate');
                break;
            case 'cm_filterReset':
                $ifGrid.jqxGrid('clearfilters');
                break;
            case 'cm_colsMgr':
                $.post(ctxPath + '/main/popup/comm/pGridColsMgr.do',
                    function (result) {
                        HmWindow.open($('#pwindow'), '컬럼 관리', result, 300, 400, 'pwindow_init', $ifGrid);
                    }
                );
                break;
        }
    },

    exportExcel_dev: function () {
        HmUtil.exportGrid($devGrid, '장비정보', false);
    },

    exportExcel_if: function () {
        HmUtil.exportGrid($ifGrid, '회선정보', false);
    },

    exportExcel_devLimit: function () {
        // HmUtil.exportGrid($('#evtCode_limitGrid'), '장비 임계치 설정', false);
        var rowdata = HmGrid.getRowData($devGrid);

        var userDevNameStr = '';
        if(rowdata != null){
            userDevNameStr = rowdata.userDevName+' ';
        }

        var grids = [$('#evtCode_limitGrid'), $('#evtCode_statGrid')];
        var titles = ['임계치 이벤트', '상태 이벤트'];
        HmUtil.exportGridList(grids, titles, userDevNameStr + '장비 개별 임계치');

    },

    contain: function (data) {


        var row = $devGrid.jqxGrid('getRowData', data);
        var _tmp = [];

        _tmp = vendorModelList.filter(function (item) {
            return item.value === row.vendor;
        });
        HmGrid.endCellEdit($devGrid);
        return _tmp;
    },

    // 컬럼관리 팝업
    showColConf: function (tblNm) {
        $.post('/main/popup/env/pDynamicItemConf.do',
            {tableNm: tblNm},
            function (result) {
                HmWindow.open($('#pwindow'), '동적 컬럼 관리', result, 800, 600);
            }
        );
    },
    // 동적임계치관리
    thresholdConf: function (tblNm) {
        $.post('/main/popup/env/pDynamicThresholdConf.do',
            {devKind1: 'DEV'},
            function (result) {
                HmWindow.open($('#pwindow'), '동적 임계치 관리', result, 1000, 600);
            }
        );
    },
    // 삭제장비 복원
    devRestore: function () {
        $.post('/main/popup/env/pDevRestore.do',
            function (result) {
                HmWindow.open($('#pwindow'), '장비 복원', result, 900, 600);
            }
        );
    },

    /** 임계치 */
    limitInitEditor: function(row, cellvalue, editor) {
        editor.jqxNumberInput({ decimalDigits: 0, min: 0, max: 9999999999 , theme: jqxTheme, inputMode: 'simple', spinButtons: true, value: cellvalue });

    },
    /** 임계치  소수점 둘째자리 까지 가능하도록 함 */
    limitInitEditor2: function(row, cellvalue, editor) {
        editor.jqxNumberInput({ decimalDigits: 2, min: 0, max: 9999999999 , theme: jqxTheme, inputMode: 'simple', spinButtons: true, value: cellvalue });

    },
    isEditable: function(row) {
        var rowdata = $('#evtCode_statGrid').jqxGrid('getrowdata', row);
        if(rowdata.evtCd.indexOf('ICMP') !== -1 ||rowdata.evtCd.indexOf('SNMP') !== -1 ||rowdata.evtCd.indexOf('TCP') !== -1 ||rowdata.evtCd.indexOf('URL') !== -1 ) {
            return true;
        }
        return false;
    },
    isEditableClass: function (row, column, value, data) {
        var rowdata = $('#evtCode_statGrid').jqxGrid('getrowdata', row);
        if(rowdata.evtCd.indexOf('ICMP') !== -1 ||rowdata.evtCd.indexOf('SNMP') !== -1 ||rowdata.evtCd.indexOf('TCP') !== -1 ||rowdata.evtCd.indexOf('URL') !== -1 ) {
            return null;
        }
        return "disabledCell";
    },
};

function addGrpResult(addData, type) {
    refreshGrp();
    $('#pwindow').jqxWindow('close');
}

function editGrpResult(addData, type) {
    refreshGrp();
    $('#pwindow').jqxWindow('close');
}


function addDevResult() {
    HmGrid.updateBoundData($devGrid);
    refreshGrp();
}

function refreshDev() {
    HmGrid.updateBoundData($devGrid);
}

function refreshIf() {
    HmGrid.updateBoundData($ifGrid);
}

function refreshGrp() {
    HmTreeGrid.updateData($grpTree, HmTree.T_GRP_DEFAULT2, {devKind1: 'DEV'});
}


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});