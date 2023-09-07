var $grpTree, $svrGrid, $fsGrid, $memGrid, $hddGrid, $procGrid, $wasGrid, $dbGrid;
var $fileGrid, $fileEvtGrid , $limitGrid , $statGrid;

var $fileMonitGrid, $fileMonitEvtGrid;

var curSvrNo = -1, curProfileNo = -1, curLogNo = -1;
var editSvrIds = [], editCfgIds = [], editProcIds = [], profileList = [], pollList = [], evtLevelList = [], svrList = [], netPollGrpList = [];
var dbmsKindList = [];
var editFileIds = [];
var editWasIds = [];
var editDbIds = [];
var editMonitIds = [];
var editLimitIds = [] , editStatIds = [];
var evtLevel1Text, evtLevel2Text, evtLevel3Text, evtLevel4Text, evtLevel5Text;
var profileCodeList = null;
var limitCodeList = null;
var ctrlEditCell = null;
var ctrlfileEditCell = null;
var ctrlRoCell = null;
var ctrlRwCell = null;
var ctxIdxs = 0;
var limitCodeId = null;
var dbmsProfileList = [];

var codeMap = {
    pollGrpList: []
};


var Main = {

    /** variable */
    initVariable: function () {

        $grpTree = $('#grpTreeGrid');
        $svrGrid = $('#svrGrid'), $fsGrid = $('#fsGrid'), $memGrid = $('#memGrid'), $hddGrid = $('#hddGrid'), $procGrid = $('#procGrid');
        $fileGrid = $('#fileGrid'), $fileEvtGrid = $('#fileEvtGrid') ,  $limitGrid = $('#limitGrid') , $statGrid = $('#statGrid');


        $fileMonitGrid = $('#fileMonitorGrid'), $fileMonitEvtGrid = $('#fileEvt2Grid');

        $wasGrid = $('#wasGrid'), $dbGrid = $('#dbGrid');

        evtLevel1Text = $('#sEvtLevel1').val();
        evtLevel2Text = $('#sEvtLevel2').val();
        evtLevel3Text = $('#sEvtLevel3').val();
        evtLevel4Text = $('#sEvtLevel4').val();
        evtLevel5Text = $('#sEvtLevel5').val();
        profileCodeList = null;
        limitCodeList = null;
        this.initCondition();
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

            case 'btnAdd_grp':
                this.addGrp();
                break;
            case 'btnEdit_grp':
                this.editGrp();
                break;
            case 'btnDel_grp':
                this.delGrp();
                break;

            case 'btnSearch_svr':
                this.searchSvr();
                break;
            case 'btnAdd_svr':
                this.addSvr();
                break;
            case 'btnDel_svr':
                this.delSvr();
                break;
            case 'btnSave_svr':
                this.saveSvr();
                break;
            case 'btnExcel_svr':
                this.exportExcel_svr();
                break;

            case 'btnAdd_cfg':
                this.addConfig();
                break;
            case 'btnDel_cfg':
                this.delConfig();
                break;
            case 'btnSave_cfg':
                this.saveConfig();
                break;
            case 'btnSearch_cfg':
                this.searchConfig();
                break;
            case 'btnMultiAdd_cfg':
                this.saveMprocList();
                break;

            case 'btnGet_file':
                this.getFile();
                break;
            case 'btnSave_file':
                this.saveFile();
                break;
            case 'btnAdd_file':
                this.addFile();
                break;
            case 'btnDel_file':
                this.delFile();
                break;

            case 'btnAdd_evt':
                this.addEvt();
                break;
            case 'btnEdit_evt':
                this.editEvt();
                break;
            case 'btnDel_evt':
                this.delEvt();
                break;

            // case 'btnGet_monit':
            //     this.getFileMonit();
            //     break;

            case 'btnSave_monit':
                this.saveFileMonit();
                break;
            case 'btnAdd_monit':
                this.addFileMonit();
                break;
            case 'btnDel_monit':
                this.delFileMonit();
                break;

            case 'btnAdd_fileEvt':
                this.addFileEvt();
                break;
            case 'btnEdit_fileEvt':
                this.editFileEvt();
                break;
            case 'btnDel_fileEvt':
                this.delFileEvt();
                break;
            // case 'btnSvr_restore':
            //     this.svrRestore();
            //     break;

        }
    },

    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
            Main.searchSvr();
        }
    },

    /** init design */
    initDesign: function () {
        //검색바 호출.
        Master.createSearchBar1('', '', $("#srchBox"));

        // $('#svrMgmtLoader').jqxLoader({ text: "저장 중...", isModal: true, width: 90, height: 60 ,imagePosition: 'top' });

        HmWindow.create($('#pwindow'), 100, 100, 1000);
        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{
            size: '50%',
            collapsible: false
        }, {size: '50%'}], 'auto', '100%');
        $('#cfgTab').jqxTabs({
            width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function (tab) {
                switch (tab) {
                    case 0:
                        $('#cbCpuCode').jqxDropDownList({
                            source: [], placeHolder: "선택하세요.",
                            displayMember: 'evtName', valueMember: 'code', width: 150, height: 22
                        });
                        $('#cbMemCode').jqxDropDownList({
                            source: [], placeHolder: "선택하세요.",
                            displayMember: 'evtName', valueMember: 'code', width: 150, height: 22
                        });

                        HmGrid.create($fsGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    updaterow: function (rowid, rowdata, commit) {
                                        if (editCfgIds.indexOf(rowid) == -1)
                                            editCfgIds.push(rowid);
                                        commit(true);
                                    }
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, {
                                            mngNo: curSvrNo,
                                            profileNo: curProfileNo
                                        });
                                        return data;
                                    },
                                    loadComplete: function (records) {
                                        editCfgIds = [];
                                    }
                                }
                            ),
                            // showtoolbar: true,
                            // rendertoolbar: function(toolbar) {
                            //     HmGrid.titlerenderer(toolbar, '프로파일설정');
                            // },
                            pageable: false,
                            editable: true,
                            editmode: 'selectedrow',
                            columns: [
                                {text: '파일시스템', datafield: 'mountPoint', pinned: true, editable: false},
                                {
                                    text: '프로파일',
                                    datafield: 'code',
                                    displayfield: 'evtName',
                                    width: 200,
                                    columntype: 'dropdownlist',
                                    createeditor: function (row, value, editor) {
                                        var mysource =
                                            {
                                                datatype: "array",
                                                datafields:
                                                    [
                                                        {name: 'code', type: 'string'},
                                                        {name: 'evtName', type: 'string'}
                                                    ],
                                                localdata: profileCodeList.FS
                                            };
                                        var dataAdapter = new $.jqx.dataAdapter(mysource, {
                                            autoBind: true
                                        });
                                        editor.jqxDropDownList({
                                            placeHolder: "선택하세요.",
                                            source: dataAdapter,
                                            displayMember: 'evtName',
                                            valueMember: 'code'
                                        });
                                    },
                                    initeditor: function (row, cellvalue, editor, celltext, pressedChar) {
                                        var rowdata = $svrGrid.jqxGrid('getrowdata', row);
                                    }
                                },
                                {
                                    text: '총량',
                                    datafield: 'totalSize',
                                    width: 200,
                                    editable: false,
                                    cellsrenderer: HmGrid.unit1000renderer,
                                    filtertype: 'number'
                                },
                                {
                                    text: '사용률',
                                    datafield: 'usedPct',
                                    width: 200,
                                    editable: false,
                                    cellsrenderer: HmGrid.progressbarrenderer
                                },
                                {
                                    text: '임계치 설정',
                                    datafield: 'codeId',
                                    displayfield: 'codeValue1',
                                    width: 140,
                                    columntype: 'dropdownlist',
                                    createeditor: function (row, value, editor) {
                                       var mysource =
                                            {
                                                datatype: "array",
                                                datafields:
                                                    [
                                                        {name: 'codeId', type: 'int'},
                                                        {name: 'codeValue1', type: 'string'}
                                                    ],
                                                localdata: limitCodeList

                                            };
                                        var dataAdapter = new $.jqx.dataAdapter(mysource, {
                                            autoBind: true
                                        });
                                        editor.jqxDropDownList({
                                            placeHolder: "선택하세요.",
                                            source: dataAdapter,
                                            displayMember: 'codeValue1',
                                            valueMember: 'codeId',
                                            dropDownWidth : 127,
                                            autoDropDownHeight: true
                                        });
                                    }
                                }
                            ]
                        }, CtxMenu.COMM, ctxIdxs++);
                        $('#btnAdd_cfg, #btnDel_cfg, #btnMultiAdd_cfg').hide();
                        Main.searchConfig();
                        break;

                    case 1:
                        HmGrid.create($procGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    updaterow: function (rowid, rowdata, commit) {
                                        if (editProcIds.indexOf(rowid) == -1)
                                            editProcIds.push(rowid);
                                        commit(true);
                                    }
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, {
                                            mngNo: curSvrNo,
                                            getAllListYn: 'N'
                                        });
                                        return data;
                                    },
                                    loadComplete: function (records) {
                                        editProcIds = [];
                                    }
                                }
                            ),
                            pageable: false,
                            editable: true,
                            editmode: 'selectedrow',
                            columns: [
                                {text: '표시명', datafield: 'userMprocName', width: 300},
                                {text: '프로세스 명', datafield: 'mprocName', width: 300},
                                {text: '명령어', datafield: 'cmdLine', minwidth: 200},
                                {
                                    text: 'CPU 과점유(%)',
                                    datafield: 'cpuOverPct',
                                    width: 140,
                                    columntype: 'numberinput',
                                    cellsalign: 'right',
                                    createeditor: function (row, cellvalue, editor) {
                                        editor.jqxNumberInput({decimalDigits: 2, min: 0.00, max: 100});
                                    },
                                    validation: function (cell, value) {
                                        if (value < 0 || value > 100) {
                                            return {result: false, message: '100% 이내로 수치값을 입력해주세요.'};
                                        }
                                        return true;
                                    }
                                },
                                {
                                    text: 'MEMORY 과점유(%)',
                                    datafield: 'memOverPct',
                                    width: 140,
                                    columntype: 'numberinput',
                                    cellsalign: 'right',
                                    createeditor: function (row, cellvalue, editor) {
                                        editor.jqxNumberInput({decimalDigits: 2, min: 0.00, max: 100});
                                    },
                                    validation: function (cell, value) {
                                        if (value < 0 || value > 100) {
                                            return {result: false, message: '100% 이내로 수치값을 입력해주세요.'};
                                        }
                                        return true;
                                    }
                                },
                                {
                                    text: '비교 조건',
                                    datafield: 'cmpCond',
                                    displayfield: 'disCmpCond',
                                    width: 100,
                                    columntype: 'dropdownlist',
                                    createeditor: function (row, value, editor) {
                                        var s = [
                                            {label: '>', value: '&gt;'},
                                            {label: '>=', value: '&gt;='},
                                            {label: '<', value: '&lt;'},
                                            {label: '<=', value: '&lt;='},
                                            {label: '=', value: '='},
                                            {label: '!=', value: '!='}
                                        ];
                                        editor.jqxDropDownList({
                                            source: s,
                                            displayMember: 'label',
                                            valueMember: 'value',
                                            autoDropDownHeight: true
                                        });
                                    },
                                    cellsrenderer: HmGrid.mprocCmpcondRenderer
                                },
                                {
                                    text: '비교 방법',
                                    datafield: 'equalCond',
                                    displayfield: 'disEqualCond',
                                    width: 100,
                                    columntype: 'dropdownlist',
                                    createeditor: function (row, value, editor) {
                                        var s = [
                                            {label: '프로세스명', value: 0},
                                            {label: '명령어', value: 1},
                                            {label: '특정문자열', value: 2}
                                        ];
                                        editor.jqxDropDownList({
                                            source: s,
                                            displayMember: 'label',
                                            valueMember: 'value',
                                            autoDropDownHeight: true
                                        });
                                    }
                                },
                                {
                                    text: '비교 값',
                                    datafield: 'cmpValue',
                                    width: 100,
                                    cellsrenderer: HmGrid.unit1000renderer,
                                    filtertype: 'number'
                                },
                                {
                                    text: '이벤트 레벨',
                                    datafield: 'evtLevel',
                                    displayfield: 'disEvtLevel',
                                    width: 100,
                                    columntype: 'dropdownlist',
                                    createeditor: function (row, value, editor) {
                                        editor.jqxDropDownList({
                                            source: HmResource.evt_level_list, autoDropDownHeight: true,
                                            displayMember: 'label', valueMember: 'value'
                                        });
                                    }
                                },
                                {text: '사용여부', datafield: 'useFlag', width: 80, columntype: 'checkbox'}
                            ]
                        }, CtxMenu.COMM, ctxIdxs++);
                        $('#btnAdd_cfg, #btnDel_cfg, #btnMultiAdd_cfg').show();
                        Main.searchConfig();
                        break;

                    case 2:

                        HmJqxSplitter.create($('#rbSpiltter'), HmJqxSplitter.ORIENTATION_V, [{
                                size: '50%',
                                collapsible: false
                            }, {size: '50%'}], '100%', '100%',
                            {showSplitBar: false});


                        HmGrid.create($fileGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    updaterow: function (rowid, rowdata, commit) {
                                        if (editFileIds.indexOf(rowid) == -1)
                                            editFileIds.push(rowid);
                                        commit(true);
                                    }
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, {
                                            mngNo: curSvrNo,
                                        });
                                        return data;
                                    },
                                    loadComplete: function (records) {
                                        editFileIds = [];
                                        curLogNo = -1;
                                    }
                                }
                            ),
                            showtoolbar: true,
                            rendertoolbar: function (toolbar) {
                                HmGrid.titlerenderer(toolbar, '로그 파일 설정');
                            },
                            pageable: false,
                            editable: true,
                            editmode: 'selectedrow',
                            columns: [
                                {text: 'LOG NO', datafield: 'logNo', hidden: true},
                                {text: '로그파일명', datafield: 'logFileName', minwidth: 100},
                                {text: '로그명', datafield: 'logName', width: 130},
                                {text: '경로', datafield: 'logPath', minwidth: 100},
                                {
                                    text: '주기(초)',
                                    datafield: 'pollInterval',
                                    width: 80,
                                    columntype: 'numberinput',
                                    cellsalign: 'right',
                                    createeditor: function (row, cellvalue, editor) {
                                        editor.jqxNumberInput({decimalDigits: 0, min: 0, max: 99999});
                                    },
                                    validation: function (cell, value) {
                                        if (value < 0 || value > 99999) {
                                            return {result: false, message: '0~99999사이의 수치값을 입력해주세요.'};
                                        }
                                        return true;
                                    }
                                },
                                {text: '사용여부', datafield: 'useFlag', width: 80, columntype: 'checkbox'}
                            ]
                        }, CtxMenu.COMM, ctxIdxs++);

                        $fileGrid.on('rowselect', function (event) {
                            curLogNo = event.args.row.logNo;
                            Main.searchLogEvtList();
                        });

                        HmGrid.create($fileEvtGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    updaterow: function (rowid, rowdata, commit) {
                                        if (editFileIds.indexOf(rowid) == -1)
                                            editFileIds.push(rowid);
                                        commit(true);
                                    }
                                },
                                {
                                    formatData: function (data) {
                                        data.mngNo = curSvrNo;
                                        data.logNo = curLogNo;
                                        return data;
                                    },
                                    loadComplete: function (records) {
                                        editFileIds = [];
                                    }
                                }
                            ),
                            showtoolbar: true,
                            rendertoolbar: function (toolbar) {
                                HmGrid.titlerenderer(toolbar, '이벤트 설정');
                            },
                            rowdetails: true,
                            initrowdetails: Main.initrowdetails,
                            rowdetailstemplate: {
                                rowdetails: "<div id='conditionGrid' style='margin: 10px; z-index: 998'></div>",
                                rowdetailsheight: 170,
                                rowdetailshidden: true
                            },
                            selectionmode: 'multiplerowsextended',
                            editable: false,
                            pageable: false,
                            editmode: 'selectedrow',
                            columns: [
                                {text: '이벤트명', datafield: 'logEvtCodeNo', hidden: true},
                                {text: '이벤트명', datafield: 'logEvtName', minwidth: 100},
                                {
                                    text: '레벨',
                                    datafield: 'evtLevel',
                                    width: 100,
                                    cellsrenderer: HmGrid.evtLevelrenderer,
                                    cellsalign: 'center'
                                },
                                {
                                    text: '타입',
                                    datafield: 'logType',
                                    width: 150,
                                    cellsrenderer: HmGrid.svrLogTypeRenderer
                                },
                                {text: '자동해제', datafield: 'autoReleaseFlag', width: 100, columntype: 'checkbox'}
                            ]
                        }, CtxMenu.COMM, ctxIdxs++);
                        Main.searchConfig();
                        break;
                    case 3:
                        HmGrid.create($wasGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    updaterow: function (rowid, rowdata, commit) {
                                        if (editWasIds.indexOf(rowid) == -1)
                                            editWasIds.push(rowid);
                                        commit(true);
                                    }
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, {
                                            mngNo: curSvrNo,
                                        });
                                        return data;
                                    },
                                    loadComplete: function (records) {
                                        editWasIds = [];
                                    }
                                }
                            ),
                            pageable: false,
                            editable: true,
                            editmode: 'selectedrow',
                            columns: [
                                {text: '서버번호', datafield: 'mngNo', width: 80, hidden: true},
                                {text: 'WAS NO', datafield: 'wasNo', hidden: true, editable: false},
                                {text: '명칭', datafield: 'wasNm', minwidth: 80},
                                {
                                    text: '종류', datafield: 'wasKind', width: 200, columntype: 'dropdownlist',
                                    createeditor: function (row, value, editor) {
                                        var s = [
                                            {label: 'TOMCAT', value: 'TOMCAT'},
                                            {label: 'IIS', value: 'IIS'}
                                        ];
                                        editor.jqxDropDownList({
                                            source: s,
                                            displayMember: 'label',
                                            valueMember: 'value',
                                            autoDropDownHeight: true
                                        });
                                    }, filtertype: 'checkedlist'
                                },
                                {text: '접속 ID', datafield: 'connId', width: 150},
                                {
                                    text: '접속 암호',
                                    datafield: 'connPwd',
                                    width: 150,
                                    enabletooltips: false,
                                    cellsrenderer: HmGrid.secretrenderer
                                },
                                {text: '접속 포트', datafield: 'connPort', width: 100},
                                {
                                    text: 'SSL 여부', datafield: 'sslYn', width: 120, columntype: 'dropdownlist',
                                    createeditor: function (row, value, editor) {
                                        var s = [
                                            {label: 'Y', value: 'Y'},
                                            {label: 'N', value: 'N'}
                                        ];
                                        editor.jqxDropDownList({
                                            source: s,
                                            displayMember: 'label',
                                            valueMember: 'value',
                                            autoDropDownHeight: true
                                        });
                                    }
                                },
                                {text: '성능수집', datafield: 'perfPoll', width: 120, columntype: 'checkbox'}
                            ]
                        }, CtxMenu.COMM, ctxIdxs++);
                        Main.searchConfig();
                        break;
                    case 4:
                        HmGrid.create($dbGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    updaterow: function (rowid, rowdata, commit) {
                                        if (editDbIds.indexOf(rowid) == -1)
                                            editDbIds.push(rowid);
                                        commit(true);
                                    }
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, {
                                            mngNo: curSvrNo,
                                        });
                                        return data;
                                    },
                                    loadComplete: function (records) {
                                        editDbIds = [];
                                    }
                                }
                            ),
                            pageable: false,
                            editable: true,
                            editmode: 'selectedrow',
                            columns: [
                                {text: '서버번호', datafield: 'mngNo', width: 80, hidden: true},
                                {text: 'DB NO', datafield: 'dbmsNo', hidden: true},
                                {text: '명칭', datafield: 'dbmsNm', width: 350},
                                {
                                    text: '종류',
                                    datafield: 'dbmsKind',
                                    displayfield: 'disDbmsKind',
                                    width: 200,
                                    columntype: 'dropdownlist',
                                    createeditor: function (row, value, editor) {
                                        editor.jqxDropDownList({
                                            source: dbmsKindList, autoDropDownHeight: true,
                                            displayMember: 'codeValue1', valueMember: 'codeId'
                                        });
                                    },
                                    filtertype: 'checkedlist'
                                },
                                {
                                    text: '프로파일',
                                    datafield: 'profileNo',
                                    displayfield: 'disProfileNo',
                                    width: 200,
                                    columntype: 'dropdownlist',
                                    createeditor: function (row, value, editor) {
                                        editor.jqxDropDownList({
                                            source: dbmsProfileList, autoDropDownHeight: true,
                                            displayMember: 'label', valueMember: 'value'
                                        });
                                    },
                                    filtertype: 'checkedlist'
                                },
                                {text: '접속 문자', datafield: 'connSt', minwidth: 300},
                                {text: '접속 포트', datafield: 'dbmsPort', width: 100},
                                {text: '성능수집', datafield: 'perfPoll', width: 120, columntype: 'checkbox'}
                            ]
                        }, CtxMenu.COMM, ctxIdxs++);
                        Main.searchConfig();
                        break;

                    case 5:

                        HmJqxSplitter.create($('#monitorSpiltter'), HmJqxSplitter.ORIENTATION_V, [{
                                size: '50%',
                                collapsible: false
                            }, {size: '50%'}], '100%', '100%',
                            {showSplitBar: false});


                        HmGrid.create($fileMonitGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    updaterow: function (rowid, rowdata, commit) {
                                        if (editMonitIds.indexOf(rowid) == -1)
                                            editMonitIds.push(rowid);
                                        commit(true);
                                    }
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, {
                                            mngNo: curSvrNo,
                                        });
                                        return data;
                                    },
                                    loadComplete: function (records) {
                                        editMonitIds = [];
                                        curLogNo = -1;
                                    }
                                }
                            ),
                            showtoolbar: true,
                            rendertoolbar: function (toolbar) {
                                HmGrid.titlerenderer(toolbar, '파일 감시 설정');
                            },
                            pageable: false,
                            editable: true,
                            editmode: 'selectedrow',
                            columns: [
                                {text: 'LOG NO', datafield: 'fileChkNo', hidden: true},
                                {text: '감시명', datafield: 'fileChkName', width: 130},
                                {text: '감시파일명', datafield: 'fileName', width: 130},
                                {text: '파일경로', datafield: 'filePath', minwidth: 200},
                                {
                                    text: '주기(초)',
                                    datafield: 'pollInterval',
                                    width: 80,
                                    columntype: 'numberinput',
                                    cellsalign: 'right',
                                    createeditor: function (row, cellvalue, editor) {
                                        editor.jqxNumberInput({decimalDigits: 0, min: 0, max: 99999});
                                    },
                                    validation: function (cell, value) {
                                        if (value < 0 || value > 99999) {
                                            return {result: false, message: '0~99999사이의 수치값을 입력해주세요.'};
                                        }
                                        return true;
                                    }
                                },
                                {text: '사용여부', datafield: 'useFlag', width: 80, columntype: 'checkbox'}
                            ]
                        }, CtxMenu.COMM, ctxIdxs++);

                        $fileMonitGrid.on('rowselect', function (event) {
                            curLogNo = event.args.row.fileChkNo;
                            Main.searchMonitEvtList();
                        });


                        HmGrid.create($fileMonitEvtGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    updaterow: function (rowid, rowdata, commit) {
                                        if (editMonitIds.indexOf(rowid) == -1)
                                            editMonitIds.push(rowid);
                                        commit(true);
                                    }
                                },
                                {
                                    formatData: function (data) {
                                        data.fileChkNo = curLogNo;
                                        data.mngNo = curSvrNo;
                                        data.logNo = curLogNo;
                                        return data;
                                    },
                                    loadComplete: function (records) {
                                        editMonitIds = [];
                                    }
                                }
                            ),
                            showtoolbar: true,
                            rendertoolbar: function (toolbar) {
                                HmGrid.titlerenderer(toolbar, '이벤트 설정');
                            },
                            selectionmode: 'multiplerowsextended',
                            editable: false,
                            pageable: false,
                            editmode: 'selectedrow',
                            columns: [
                                {text: '이벤트 코드번호', datafield: 'fileChkEvtCodeNo', hidden: true},
                                {text: '이벤트명', datafield: 'fileChkEvtName', width: '20%'},
                                {
                                    text: '레벨',
                                    datafield: 'evtLevel',
                                    width: '20%',
                                    cellsrenderer: HmGrid.evtLevelrenderer,
                                    cellsalign: 'center'
                                },
                                {
                                    text: '타입',
                                    datafield: 'fileChkType',
                                    width: '20%',
                                    cellsrenderer: HmGrid.svrFileTypeRenderer
                                },
                                {text: '파일크기', datafield: 'condVal', width: '20%', cellsalign: 'center'},
                                {text: 'Byte Type', datafield: 'condKindStr', width: '20%', cellsalign: 'center'},
                                // {text: '자동해제', datafield: 'autoReleaseFlag', width: '16.6%', columntype: 'checkbox'}
                            ]
                        }, CtxMenu.COMM, ctxIdxs++);
                        Main.searchConfig();


                        break;

                    case 6 :

                        HmJqxSplitter.create($('#svrEachSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
                        // 임계치 이벤트
                        HmGrid.create($limitGrid, {
                            source: new $.jqx.dataAdapter({
                                    datatype: 'json',
                                    updaterow: function (rowid, rowdata, commit) {
                                        if (editLimitIds.indexOf(rowid) == -1)
                                            editLimitIds.push(rowid);
                                        commit(true);
                                    }
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, {
                                            mngNo: curSvrNo,
                                            profileNo: curProfileNo,
                                            evtCond: 1
                                        });
                                        return data;
                                    },
                                    loadComplete: function (records) {
                                        editLimitIds = [];
                                    }
                                }
                            ),
                            showtoolbar: true,
                            rendertoolbar: function (toolbar) {
                                HmGrid.titlerenderer(toolbar, '임계치 이벤트');
                            },
                            editable: true,
                            pageable: false,
                            columns: [
                                {text: 'CODE', datafield: 'evtCd', width: 100, hidden: true, editable: false},
                                {text: 'EVTCOND', datafield: 'evtCond', width: 100, hidden: true, editable: false},
                                {text: '항목', datafield: 'evtNm', minwidth: 150, editable: false},
                                {text: '파일 시스템', datafield: 'extraCd', width: 100, editable: false , cellclassname: Main.isEditableClassLimit ,
                                    cellsrenderer: function (row, column, value) {
                                        var str = String(value);
                                        if(str == '-1'){
                                            return "<div style='margin:7px;text-align: left;'></div>";
                                        }else{
                                            return "<div style='margin:7px;text-align: left;'>" + value + "</div>";
                                        }
                                    }
                                },
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
                        }, CtxMenu.COMM, ctxIdxs++);

                        // 상태 이벤트
                        HmGrid.create($statGrid, {
                            source: new $.jqx.dataAdapter({
                                    datatype: 'json',
                                    updaterow: function (rowid, rowdata, commit) {
                                        if (editStatIds.indexOf(rowid) == -1)
                                            editStatIds.push(rowid);
                                        commit(true);
                                    }
                                },
                                {
                                    formatData: function (data) {
                                        $.extend(data, {
                                            mngNo: curSvrNo,
                                            profileNo: curProfileNo,
                                            evtCond: 0
                                        });
                                        return data;
                                    },
                                    loadComplete: function (records) {
                                        editCfgIds = [];
                                    }
                                }
                            ),
                            showtoolbar: true,
                            rendertoolbar: function (toolbar) {
                                HmGrid.titlerenderer(toolbar, '상태 이벤트');
                            },
                            editable: true,
                            pageable: false,
                            columns: [
                                {text: 'CODE', datafield: 'evtCd', width: 100, hidden: true, editable: false},
                                {text: '이벤트명', datafield: 'evtNm', minwidth: 150, editable: false},
                                { text: '이벤트 등급', datafield: 'evtLevel', displayfield: 'disEvtLevel', width: 120, columntype: 'dropdownlist',
                                    createeditor: function (row, value, editor) {

                                        var s = [{ label: $('#sEvtLevel1').val(), value: 1 },
                                            { label: $('#sEvtLevel2').val(), value: 2 },
                                            { label: $('#sEvtLevel3').val(), value: 3 },
                                            { label: $('#sEvtLevel4').val(), value: 4 },
                                            { label: $('#sEvtLevel5').val(), value: 5 }];

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
                        }, CtxMenu.COMM, ctxIdxs++);
                        Main.searchConfig();
                        break;
                }
            }
        }).on('selected', function (event) {
                Main.searchConfig();
            });

        HmGrid.create($svrGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: '',
                    updaterow: function (rowid, rowdata, commit) {
                        if (editSvrIds.indexOf(rowid) == -1)
                            editSvrIds.push(rowid);
                        commit(true);
                    },
                    datafields: [
                        {name: 'name', type: 'string'}, // 서버명
                        {name: 'grpNo', type: 'string'}, // 그룹번호
                        {name: 'mngNo', type: 'string'}, // 장비번호
                        {name: 'displayName', type: 'string'}, // 사용자서버명
                        {name: 'parentMngNo', type: 'int'}, // 상위서버번호
                        {name: 'parentDevName', type: 'string'}, // 상위서버명
                        {name: 'ip', type: 'string'}, // IP
                        {name: 'devKind2', type: 'string'}, // 서버종류
                        {name: 'vendor', type: 'string'}, // 제조사
                        {name: 'model', type: 'string'}, // 모델
                        {name: 'grpName', type: 'string'}, // 소속그룹
                        {name: 'profileNo', type: 'int'}, // 프로파일
                        {name: 'profileName', type: 'string'}, // 프로파일
                        {name: 'perfPoll', type: 'int'}, // 성능수집
                        {name: 'perfPollName', type: 'string'}, // 성능수집

                        {name: 'beats', type: 'int'}, // 감시설정
                        {name: 'beatsName', type: 'string'}, // 감시설정명

                        {name: 'os', type: 'string'}, // OS
                        {name: 'netPollGrpNo', type: 'int'}, // 망구분
                        {name: 'disNetPollGrpNo', type: 'int'}, // 망구분
                        {name: 'pollGrpNo', type: 'int'}, // 수집기명
                        {name: 'pollGrpNoStr', type: 'string'}, // 고정 수집기명
                        {name: 'pollGrpNoFix', type: 'string'}, // 수집기명&&고정수집기명
                        {name: 'guid', type: 'string'}, // GUID
                        {name: 'lastBootTime', type: 'string'}, // 부팅일시
                        {name: 'icmpPoll', type: 'string'}, // 헬스체크
                        {name: 'icmpPollStr', type: 'string'}, // 헬스체크
                        {name: 'snmpVer', type: 'number'}, // SNMP Ver
                        {name: 'snmpVerStr', type: 'string'}, // SNMP Ver
                        {name: 'community', type: 'string'}, // RO Cummunity
                        {name: 'setCommunity', type: 'string'}, // RW Community
                        {name: 'snmpUserId', type: 'string'}, // SNMP UserID
                        {name: 'snmpSecurityLevel', type: 'string'}, // SNMPSecurityLevel
                        {name: 'snmpSecurityLevelStr', type: 'string'}, // SNMPSecurityLevel
                        {name: 'snmpAuthType', type: 'string'}, // SNMPAuthType
                        {name: 'snmpAuthTypeStr', type: 'string'}, // SNMPAuthType
                        {name: 'snmpAuthKey', type: 'string'}, // SNMPAuthKey
                        {name: 'snmpEncryptType', type: 'string'}, // SNMPEncryptType
                        {name: 'snmpEncryptTypeStr', type: 'string'}, // SNMPEncryptType
                        {name: 'snmpEncryptKey', type: 'string'}, // SNMPEncryptKey
                        {name: 'svrDesc', type: 'string'} // 비고

/*
                        {name: 'fileBeats', type: 'int'},
                        {name: 'userId', type: 'string'},
                        {name: 'loginPwd', type: 'string'},
                        {name: 'enPwd', type: 'string'},
                        {name: 'confMode', type: 'string'},
*/
                    ]
                },
                {
                    formatData: function (data) {

                        var _grpNo = 0, _grpParent = 0, _grpType = 'DEFAULT', _itemKind = 'GROUP';
                        var treeItem = HmTreeGrid.getSelectedItem($grpTree);
                        var grpSelection = $grpTree.jqxTreeGrid('getSelection');

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
                    loadComplete: function (records) {
                        editSvrIds = [];
                        curSvrNo = -1;
                    }
                }
            ),
            selectionmode: 'multiplerowsextended',
            editable: true,
            editmode: 'selectedcell',
            columngroups: [
                {text: 'SNMP', align: 'center', name: 'snmp'}
            ],
            columns:
                [
                    {text: '서버명', datafield: 'name', width: 150, pinned: true, editable: false},
                    {text: '그룹번호', datafield: 'grpNo', hidden: true},
                    {text: '장비번호', datafield: 'mngNo', hidden: true},
                    {text: '사용자서버명', datafield: 'displayName', width: 175, pinned: true, editable: false},
                    {text: 'IP', datafield: 'ip', width: 120,
                        validation: function(cell, value) {
                            // if($.isBlank(value)) {
                            //     return { result: false, message: 'IP를 입력해주세요.' };
                            // }
                            if(!$.validateIp(value)) {
                                return { result: false, message: 'IP형식이 유효하지 않습니다.' };
                            }
                            return true;
                        }
                    },
                    {
                        text: '서버종류',
                        datafield: 'devKind2',
                        width: 100,
                        filtertype: 'checkedlist',
                        columntype: 'dropdownlist',
                        createeditor: function (row, value, editor) {
                            var mysource =
                                {
                                    datatype: "array",
                                    datafields:
                                        [
                                            {name: 'label', type: 'string'},
                                            {name: 'value', type: 'string'}
                                        ],
                                    localdata: svrList
                                };

                            var dataAdapter = new $.jqx.dataAdapter(mysource, {
                                autoBind: true
                            });
                            editor.jqxDropDownList({
                                placeHolder: "선택하세요.",
                                source: dataAdapter,
                                displayMember: 'label',
                                valueMember: 'value',
                                searchMode : 'containsignorecase',
                                filterable: true
                            });
                        },
                        initeditor: function (row, cellvalue, editor, celltext, pressedChar) {
//							var rowdata = $svrGrid.jqxGrid('getrowdata', row);
//							editor.jqxDropDownList('selectItem', rowdata.profileNo );
                        }
                    },
                    {text: '제조사', datafield: 'vendor', width: 85, filtertype: 'checkedlist'},
                    {text: '모델', datafield: 'model', width: 85, filtertype: 'checkedlist'},
                    {text: '소속그룹', datafield: 'grpName', width: 150, /*pinned: true,*/ editable: false},
                    {text: '상위장비', datafield: 'parentMngNo', displayfield: 'parentDevName', width: 150, editable: false},
                    {test: '상위서버이름', datafield: 'parentDevName', editable: false, hidden: true},
                    {
                        text: '프로파일',
                        datafield: 'profileNo',
                        displayfield: 'profileName',
                        width: 110,
                        columntype: 'dropdownlist',
                        filtertype: 'checkedlist',
                        createeditor: function (row, value, editor) {
                            var mysource =
                                {
                                    datatype: "array",
                                    datafields:
                                        [
                                            {name: 'label', type: 'string'},
                                            {name: 'value', type: 'string'}
                                        ],
                                    localdata: profileList
                                };
                            var dataAdapter = new $.jqx.dataAdapter(mysource, {
                                autoBind: true
                            });
                            editor.jqxDropDownList({
                                placeHolder: "선택하세요.",
                                source: dataAdapter,
                                displayMember: 'label',
                                valueMember: 'value',
                                searchMode : 'containsignorecase',
                                filterable: true
                            });
                        },
                        initeditor: function (row, cellvalue, editor, celltext, pressedChar) {
//							var rowdata = $svrGrid.jqxGrid('getrowdata', row);
//							editor.jqxDropDownList('selectItem', rowdata.profileNo );
                        }
                    },
                    {
                        text: '성능수집',
                        datafield: 'perfPoll',
                        displayfield: 'perfPollName',
                        width: 100,
                        columntype: 'dropdownlist',
                        filtertype: 'checkedlist',
                        createeditor: function (row, value, editor) {
                            editor.jqxDropDownList({
                                source: pollList,
                                displayMember: 'codeValue1', valueMember: 'codeId', autoDropDownHeight: true
                            })
                        },
                        cellvaluechanging: function (row, datafield, columntype, oldvalue, newvalue) {
                            if (oldvalue != newvalue.label && newvalue.value != 1) {
                                var rowdata = $svrGrid.jqxGrid('getrowdata', row);
                                rowdata.beats = false;
                            }
                        }
                    },

                    {text: '감시 설정', datafield: 'beats', displayfield: 'beatsName', width: 100, columntype: 'dropdownlist',
                        createeditor: function (row, value, editor) {
                            editor.jqxDropDownList({
                                source: [
                                    {codeId : 0, codeValue1 : '사용안함'},
                                    {codeId : 1, codeValue1 : '로그감시'},
                                    {codeId : 2, codeValue1 : '파일체크'},
                                    {codeId : 3, codeValue1 : '모두사용'}
                                ],
                                displayMember: 'codeValue1', valueMember: 'codeId', autoDropDownHeight: true
                            })
                        },
                    },
                    {text: 'OS', datafield: 'os', minWidth: 100/*, editable: false*/},
                    {
                        text: '망구분',
                        datafield: 'netPollGrpNo',
                        displayfield: 'disNetPollGrpNo',
                        width: 100,
                        columntype: 'dropdownlist',
                        filtertype: 'checkedlist',
                        createeditor: function (row, value, editor) {
                            editor.jqxDropDownList({
                                source: netPollGrpList,
                                displayMember: 'codeValue1', valueMember: 'codeId', autoDropDownHeight: true
                            })
                        },
                        cellvaluechanging: function (row, datafield, columntype, oldvalue, newvalue) {
                            if (oldvalue != newvalue.label && newvalue.value != 1) {
                                var rowdata = $svrGrid.jqxGrid('getrowdata', row);
                                rowdata.beats = false;
                            }
                        }
                    },


                    // {
                    //     name: 'pollGrpNo',
                    //     text: '수집기명',
                    //     width: 120,
                    //     editable: true,
                    //     displayfield: 'pollGrpNoStr',
                    //     columntype: 'dropdownlist',
                    //     filtertype: 'checkedlist',
                    //     createeditor: function (row, value, editor) {
                    //
                    //         editor.jqxDropDownList({
                    //             source: codeMap.pollGrpList,
                    //             displayMember: 'codeValue1',
                    //             valueMember: 'codeId',
                    //         })
                    //     },
                    //     initeditor: function (row, cellvalue, editor, celltext, pressedChar) {
                    //         var rowdata = $svrGrid.jqxGrid('getrowdata', row);
                    //     }
                    // },


                    {
                        text: '수집기명',
                        datafield: 'pollGrpNo',
                        displayfield: 'pollGrpNoStr',
                        width: 100,
                        columntype: 'dropdownlist',
                        filtertype: 'checkedlist',
                        createeditor: function (row, value, editor) {
                            editor.jqxDropDownList({
                                source: codeMap.pollGrpList,
                                displayMember: 'codeValue1', valueMember: 'codeId', autoDropDownHeight: true
                            })
                        },
                        cellvaluechanging: function (row, datafield, columntype, oldvalue, newvalue) {
                            if (oldvalue != newvalue.label && newvalue.value != 1) {
                                var rowdata = $svrGrid.jqxGrid('getrowdata', row);
                                // rowdata.beats = false;
                            }
                        }
                    },

                    {
                        text: '고정 수집기명',
                        datafield: 'pollGrpNoFix',
                        displayfield: 'pollGrpNoStr',
                        width: 100,
                        columntype: 'dropdownlist',
                        filtertype: 'checkedlist',
                        createeditor: function (row, value, editor) {
                            editor.jqxDropDownList({
                                source: codeMap.pollGrpList,
                                displayMember: 'codeValue1', valueMember: 'codeId', autoDropDownHeight: true
                            })
                        },
                        cellvaluechanging: function (row, datafield, columntype, oldvalue, newvalue) {
                            if (oldvalue != newvalue.label && newvalue.value != 1) {
                                var rowdata = $svrGrid.jqxGrid('getrowdata', row);
                                // rowdata.beats = false;
                            }
                        }
                    },
                    {text: 'GUID', datafield: 'guid', width: 300, editable: false},
                    {text: '부팅일시', datafield: 'lastBootTime', width: 130, editable: false},

                    {
                        text: '헬스체크',
                        datafield: 'icmpPoll',
                        displayfield: 'icmpPollStr',
                        width: 100,
                        columntype: 'dropdownlist',
                        filtertype: 'checkedlist',
                        createeditor: function (row, value, editor) {
                            var s = [
                                {label: 'NONE', value: 0},
                                {label: 'Both', value: 3},
                                {label: 'ICMP', value: 1},
                                {label: 'SNMP', value: 2}
                            ];
                            editor.jqxDropDownList({
                                source: s,
                                autoDropDownHeight: true,
                                displayMember: 'label',
                                valueMember: 'value',
                                selectedIndex: 2
                            });
                        }
                    },
                    // {text: '파일감시', datafield: 'fileBeats', width: 100, columntype: 'checkbox'},

                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                    {
                        text: 'SNMP Ver',
                        columngroup: 'snmp',
                        datafield: 'snmpVer',
                        displayfield: 'snmpVerStr',
                        width: 100,
                        columntype: 'dropdownlist',
                        filtertype: 'checkedlist',
                        editable: false,
                        createeditor: function (row, value, editor) {
                            var s = [
                                {label: 'Ver1', value: 1},
                                {label: 'Ver2', value: 2},
                                {label: 'Ver3', value: 3}
                            ];
                            editor.jqxDropDownList({
                                source: s,
                                autoDropDownHeight: true,
                                displayMember: 'label',
                                valueMember: 'value'
                            });
                        }
                    },
                    {
                        text: 'RO Community',
                        columngroup: 'snmp',
                        datafield: 'community',
                        width: 100,
                        type: 'string',
                        enabletooltips: false,
                        cellsrenderer: HmGrid.secretrenderer,
                        editable: false
                    },

                    {
                        text: 'RW Community',
                        columngroup: 'snmp',
                        datafield: 'setCommunity',
                        type: 'string',
                        enabletooltips: false,
                        cellsrenderer: HmGrid.secretrenderer,
                        editable: false
                    },
                    {
                        text: 'SNMP UserID',
                        datafield: 'snmpUserId',
                        columngroup: 'snmp',
                        type: 'string',
                        width: 100,
                        editable: false
                    },
                    {
                        text: 'SNMPSecurityLevel',
                        columngroup: 'snmp',
                        datafield: 'snmpSecurityLevel',
                        displayfield: 'snmpSecurityLevelStr',
                        type: 'number',
                        width: 120,
                        editable: false
                    },
                    {datafield: 'snmpSecurityLevelStr', type: 'string', columngroup: 'snmp', editable: false, hidden: true},



                    {
                        text: 'SNMPAuthType',
                        columngroup: 'snmp',
                        datafield: 'snmpAuthType',
                        displayfield: 'snmpAuthTypeStr',
                        type: 'number',
                        width: 120,
                        editable: false
                    },
                    {datafield: 'snmpAuthTypeStr', type: 'string', columngroup: 'snmp', editable: false, hidden: true},
                    {
                        text: 'SNMPAuthKey',
                        datafield: 'snmpAuthKey',
                        columngroup: 'snmp',
                        type: 'string',
                        enabletooltips: false,
                        cellsrenderer: HmGrid.secretrenderer,
                        width: 120,
                        editable: false
                    },
                    {
                        text: 'SNMPEncryptType',
                        columngroup: 'snmp',
                        datafield: 'snmpEncryptType',
                        displayfield: 'snmpEncryptTypeStr',
                        type: 'number',
                        width: 120,
                        editable: false
                    },
                    {datafield: 'snmpEncryptTypeStr', type: 'string', columngroup: 'snmp', editable: false, hidden: true},
                    {
                        text: 'SNMPEncryptKey',
                        columngroup: 'snmp',
                        datafield: 'snmpEncryptKey',
                        type: 'string',
                        enabletooltips: false,
                        cellsrenderer: HmGrid.secretrenderer,
                        width: 120,
                        editable: false
                    },



/*
                    {text: '사용자아이디', datafield: 'userId', width: 100, editable: false},
                    {
                        text: '패스워드',
                        datafield: 'loginPwd',
                        width: 100,
                        columntype: 'custom',
                        enabletooltips: false,
                        editable: false,
                        createeditor: function (row, value, editor) {
                            var element = $('<input type="password" style="width: 100%; height: 100%;" autocomplete="off" />');
                            editor.append(element);
                            element.jqxPasswordInput();
                        },
                        initeditor: function (row, value, editor) {
                            var element = editor.find('input:first');
                            element.jqxPasswordInput('val', value);
                        },
                        geteditorvalue: function (row, value, editor) {
                            var element = editor.find('input:first');
                            return element.val();
                        },
                        cellsrenderer: function (row, columnfield, value) {
                            var hidVal = '';
                            for (var i = 0; i < value.length; i++) {
                                hidVal += '*';
                            }
                            return hidVal;
                        }
                    },
                    {
                        text: '2차인증패스워드',
                        datafield: 'enPwd',
                        width: 100,
                        columntype: 'custom',
                        enabletooltips: false,
                        editable: false,
                        createeditor: function (row, value, editor) {
                            var element = $('<input type="password" style="width: 100%; height: 100%;" autocomplete="off" />');
                            editor.append(element);
                            element.jqxPasswordInput();
                        },
                        initeditor: function (row, value, editor) {
                            var element = editor.find('input:first');
                            element.jqxPasswordInput('val', value);
                        },
                        geteditorvalue: function (row, value, editor) {
                            var element = editor.find('input:first');
                            return element.val();
                        },
                        cellsrenderer: function (row, columnfield, value) {
                            var hidVal = '';
                            for (var i = 0; i < value.length; i++) {
                                hidVal += '*';
                            }
                            return hidVal;
                        }
                    },
                    {
                        text: 'Connect Mode',
                        datafield: 'confMode',
                        width: 100,
                        editable: false
                    },
*/

                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    {text: '비고', datafield: 'svrDesc', width: 120},
                ]
        }, CtxMenu.NONE, ctxIdxs);

        $svrGrid.on('cellbeginedit', function (event) {
            for (var key in event.args.owner.columns.records) {
                var datafield = event.args.owner.columns.records[key].datafield;
                if (datafield == 'community' || datafield == 'snmpVer') {
                    event.args.owner.columns.records[key].editable = (event.args.row.perfPoll == 3);
                }
            }
        });
        $svrGrid.on('rowdoubleclick', function (event) {
            var rowIdx = event.args.rowindex;
            var rowdata = $(this).jqxGrid('getrowdata', rowIdx);
            curSvrNo = rowdata.mngNo;
            curProfileNo = rowdata.profileNo;
            $('#titleSvrGrid').text('선택서버 [ ' + rowdata.name + ' - ' + rowdata.ip + ' ]');

            Main.searchConfig();
        })
            .on('contextmenu', function (event) {
                return false;
            })
            .on('rowclick', function (event) {
                if (event.args.rightclick) {
                    $svrGrid.jqxGrid('selectrow', event.args.rowindex);
                    var rowIdxes = HmGrid.getRowIdxes($svrGrid, '서버를 선택해주세요.');
                    if (rowIdxes.length > 1) {
                        $('#cm_svrInfoSet, #cm_svrInfoCopySet, #cm_chgMgr, #cm_devOidSet').css('display', 'none');
                    }
                    else {
                        $('#cm_svrInfoSet, #cm_svrInfoCopySet, #cm_chgMgr, #cm_devOidSet').css('display', 'block');
                    }

                    var scrollTop = $(window).scrollTop();
                    var scrollLeft = $(window).scrollLeft();
                    $('#ctxmenu_svr').jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
                        parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                    return false;
                }
            });

        // generate contextmenu
        var mnlist = [
            CtxMenu.getMenuTag('cm_svrInfoSet', 'dtl_info', '서버설정'),
            CtxMenu.getMenuTag('cm_grpMoveBatchSet', 'dtl_info', '서버그룹이동'),
            CtxMenu.getSeparatorMenuTag(),
            // CtxMenu.getMenuTag('cm_svrInfoCopySet', 'batch_set', '서버정보 복사'), // 추후 기능 추가, 팝업까지만 완성. 제작시 [장비관리] 페이지 참고
            CtxMenu.getMenuTag('cm_svrInfoBatchSet', 'batch_set', '서버정보 일괄설정'),
            CtxMenu.getMenuTag('cm_svrCollectBatchSet', 'batch_set', '수집정보 일괄설정'),
            // CtxMenu.getMenuTag('cm_svrConnBatchSet', 'batch_set', '접속정보 일괄설정'), // 현재 서버관리에 접속정보 관련 컬럼이 없음. 장비관리에서 그대로 가져왔기 때문에, 추후 사용시 팝업 수정 필요.
            // CtxMenu.getMenuTag('cm_svrMaintBatchSet', 'batch_set', '장비담당자 일괄설정'), // 현재 서버관리에 담당자 관련 컬럼이 없음. 장비관리에서 그대로 가져왔기 때문에, 추후 사용시 팝업 수정 필요.
            CtxMenu.getMenuTag('cm_svrEvtCodeBatchSet', 'batch_set', '임계치 일괄설정'), // 장비관리의 [임계치 일괄설정]팝업을 같이 사용. profileType="SVR"로 구분함.
            // CtxMenu.getMenuTag('cm_svrDynInfoBatchSet', 'batch_set', '동적컬럼 일괄설정'), // 추후 기능 추가. 현재 서버관리에는 동적컬럼 기능이 없음
            CtxMenu.getSeparatorMenuTag(),
            CtxMenu.getCharttoolMenuTag()
        ];
        $('#ctxmenu_svr > ul').empty().append(mnlist);

        $('#ctxmenu_svr').jqxMenu({width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme})
            .on('itemclick', function (event) {
                Main.selectSvrCtxmenu(event);
            });

        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.searchSvr, {devKind1: 'SVR'});

        $('#titleSvrGrid').text('선택서버 [-]');

        $('#section').css('display', 'block');
    },

    /** init data */
    initData: function () {

        Server.post('/combo/getDevKind2List.do', {
            data: {},
            success: function (result) {
                svrList = result;
            }
        });

        Server.get('/code/getCodeListByCodeKind.do', {
            data: {codeKind: 'NET_POLL_GRP_NO', useFlag: 1},
            success: function (result) {
                netPollGrpList = result;
            }
        });

        Server.post('/combo/getProfileList.do', {
            data: {profileType: 'SVR'},
            success: function (result) {
                profileList = result;
            }
        });

        Server.get('/code/getCodeListByCodeKind.do', {
            data: {codeKind: 'PERF_POLL_TYPE'},
            success: function (result) {
                pollList = result;
            }
        });

        Server.get('/code/getCodeListByCodeKind.do', {
            data: {codeKind: 'MPROC_EVT_LEVEL'},
            success: function (result) {
                evtLevelList = result;
            }
        });

        Server.get('/code/getCodeListByCodeKind.do', {
            data: {codeKind: 'DBMS_KIND', useFlag: 1},
            success: function (result) {
                dbmsKindList = result;
            }
        });

        Server.post('/combo/getProfileList.do', {
            data: {profileType: 'DBMS'},
            success: function (result) {
                dbmsProfileList = result;
            }
        });


        Server.get('/code/getCodeListByCodeKind.do', {
            data: {codeKind: 'POLL_GRP_NO', useFlag: 1},
            success: function (result) {
                codeMap.pollGrpList = result;
            }
        });

    },

    /** 서버 그룹 */
    addGrp: function () {
        var treeItem = HmTreeGrid.getSelectedItem($grpTree);
        var _grpParent = 1;
        if (treeItem.devKind2 == 'GROUP') _grpParent = treeItem.grpNo;
        else _grpParent = treeItem.grpParent;

        $.get(ctxPath + '/main/popup/env/pGrpAdd.do', function (result) {
            HmWindow.open($('#pwindow'), '그룹 등록', result, 400, 492, 'pwindow_init', treeItem);
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
            alert('서버는 수정할 수 없습니다.');
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
                HmWindow.open($('#pwindow'), '그룹 수정', result, 400, 492, 'pwindow_init', _params);
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
            return;
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

    /** 서버 */
    searchSvr: function () {
        // HmGrid.updateBoundData($svrGrid, ctxPath + '/svr/getSvrList.do');
        HmGrid.updateBoundData($svrGrid, ctxPath + '/main/env/svrMgmt/getSvrMgmtList.do');
    },


    addSvr: function () {

        var _grpNo = 0;
        var grpSelection = $grpTree.jqxTreeGrid('getSelection');
        if (!$.isEmpty(grpSelection) && grpSelection.length > 0)
            _grpNo = grpSelection[0].grpNo;

        if (_grpNo == 0) {
            alert('그룹을 선택해 주세요.');
            return;
        }

        $.post(ctxPath + '/main/popup/env/pSvrAdd.do',
            {grpNo: _grpNo},
            function (result) {
                HmWindow.openFit($('#pwindow'), '서버 등록', result, 500, 372, 'pwindow_init');
            }
        );

    },

    delSvr: function () {

        var rowIdx = HmGrid.getRowIdx($svrGrid);

        if (rowIdx === false) {
            alert('선택된 서버가 없습니다.');
            return;
        }

        var rowdata = $svrGrid.jqxGrid('getrowdata', rowIdx);

        if (!confirm('[' + rowdata.name + '] 서버를 삭제하시겠습니까?')) return;

        $('body').addClass('wait');

        Server.post('/svr/delSvr.do', {
            data: rowdata,
            success: function (result) {
                $svrGrid.jqxGrid('deleterow', $svrGrid.jqxGrid('getrowid', rowIdx));
                alert('삭제되었습니다.');
            }
        });

    },

    saveSvr: function () {

        HmGrid.endRowEdit($svrGrid);
        if (editSvrIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }

        var _list = [];
        $.each(editSvrIds, function (idx, value) {

            var tmp = $svrGrid.jqxGrid('getrowdatabyid', value);

            tmp.evtProcess = tmp.evtProcess == true || tmp.evtProcess == 1 ? 'Y' : 'N';
            // tmp.beats = tmp.beats == true || tmp.beats == 1 ? 1 : 0;
            // tmp.beats = HmUtil.makeBeat(tmp.fileBeats, tmp.beats);
            /* 고정수집기 부분 임시 2022.12.21 */
            tmp.pollGrpNoFix = tmp.pollGrpNo;
            _list.push(tmp);
        });


        Server.post('/main/env/svrMgmt/saveSvrInfo.do', {
            data: {list: _list },
            success: function (result) {
                if (result == 'SUCCESS') {
                    Main.searchSvr();
                    alert('저장되었습니다.');
                    editSvrIds = [];
                } else {
                    alert(result);
                    Main.searchSvr();
                }
            }
        });

    },

    /** 하단 설정 조회 */
    searchConfig: function () {
        // 검색을 제외한 모든 버튼 숨김 초기화
        $('#btnAdd_cfg, #btnDel_cfg, #btnMultiAdd_cfg, #btnSave_cfg').hide();

        var rowIdx = HmGrid.getRowIdx($svrGrid);

        if(typeof rowIdx === "number"){
            data = $svrGrid.jqxGrid('getrowdata', rowIdx);
            curSvrNo = data.mngNo;
            curProfileNo = data.profileNo;
            $('#titleSvrGrid').text('선택서버 [ ' + data.name + ' - ' + data.ip + ' ]');
        }

        switch ($('#cfgTab').val()) {
            case 0:
                $('#btnAdd_cfg, #btnDel_cfg, #btnMultiAdd_cfg').hide();
                $('#btnSave_cfg').show();

                Server.post('/main/env/svrMgmt/getSvrCodeList.do', {
                    data: {mngNo: curSvrNo, profileNo: curProfileNo},
                    success: function (result) {
                        profileCodeList = result; // cpu, mem 은 선택된 값을 저장, fs값은 fs전체리스트값을 저장

                        // filesystem
                        HmGrid.updateBoundData($fsGrid, ctxPath + '/main/env/svrMgmt/getSvrFsList.do');
                    }
                });
                // 임계치 설정 데이터 적용
                Server.get('/code/getCodeListByInfo.do', {
                    data: {codeKind: 'LIMIT_TYPE', codeId: limitCodeId},
                    success: function (result) {
                        if(result != null) {
                            limitCodeList = result;
                            //HmGrid.updateBoundData($fsGrid, ctxPath + '/main/env/svrMgmt/getSvrFsList.do');

                        }
                    }
                });
                break;
            case 1:
                $('#btnAdd_cfg, #btnDel_cfg, #btnMultiAdd_cfg, #btnSave_cfg').show();
                HmGrid.updateBoundData($procGrid, ctxPath + '/main/env/svrMgmt/getSvrMprocList.do');
                break;
            case 2:
                $fileEvtGrid.jqxGrid('clear');
                HmGrid.updateBoundData($fileGrid, ctxPath + '/main/env/svrMgmt/getSvrLogFileList.do');
                break;
            case 3:
                $('#btnAdd_cfg, #btnDel_cfg, #btnSave_cfg').show();
                HmGrid.updateBoundData($wasGrid, ctxPath + '/main/env/svrMgmt/getSvrWasMonitList.do');
                break;
            case 4:
                $('#btnAdd_cfg, #btnDel_cfg, #btnSave_cfg').show();
                HmGrid.updateBoundData($dbGrid, ctxPath + '/main/env/svrMgmt/getSvrDbMonitList.do');
                break;
            case 5:
                $fileMonitEvtGrid.jqxGrid('clear');
                HmGrid.updateBoundData($fileMonitGrid, ctxPath + '/main/env/svrMgmt/getSvrFileMonitList.do');
                break;
            case 6:
                //개별임계치 조회
                $('#btnSave_cfg').show();
                var rowIdx = HmGrid.getRowIdx($svrGrid);
                if(rowIdx != null){
                    var data = $svrGrid.jqxGrid('getrowdata', rowIdx);
                    if(data != undefined){
                        curSvrNo = data.mngNo;
                        curProfileNo = data.profileNo;
                    }
                }
                HmGrid.updateBoundData($limitGrid, ctxPath + '/main/env/svrMgmt/getSvrEachList.do');
                HmGrid.updateBoundData($statGrid, ctxPath + '/main/env/svrMgmt/getSvrEachList.do');
                break;
        }
    },

    saveConfig: function () {
        var grid = null;
        var url = '/main/env/svrMgmt/';
        var params = {
            mngNo: curSvrNo
        };
        switch ($('#cfgTab').val()) {
            case 0:
                grid = $fsGrid;
                url += 'saveSvrProfileCode.do';
                $.extend(params, {
                    cpu: $('#cbCpuCode').val(),
                    mem: $('#cbMemCode').val()
                });
                HmGrid.endRowEdit(grid);

                if (editCfgIds.length == 0) {
                    alert('변경된 데이터가 없습니다.');
                    return;
                }

                var _list = [];
                if (editCfgIds.length > 0) {
                    $.each(editCfgIds, function (idx, value) {
                        var tmp = grid.jqxGrid('getrowdatabyid', value);
                        _list.push(tmp);
                    });
                }
                
                params.list = _list;
                Server.post(url, {
                    data: params,
                    success: function (result) {
                        alert('저장되었습니다.');
                        editCfgIds = [];
                    }
                });
                break;
            case 1:
                grid = $procGrid;
                url += 'saveSvrMproc.do';
                HmGrid.endRowEdit(grid);
                var _list = [];
                if (editProcIds.length > 0) {
                    $.each(editProcIds, function (idx, value) {
                        var tmp = grid.jqxGrid('getrowdatabyid', value);
                        tmp.cmpCond = Main.escapeCmpCond(tmp.cmpCond);
                        // console.log(tmp);
                        _list.push(tmp);
                    });

                    params.list = _list;
                    Server.post(url, {
                        data: params,
                        success: function (result) {
                            alert('저장되었습니다.');
                            editProcIds = [];
                        }
                    });
                } else {
                    alert('변경된 사항이 없습니다.');
                }
                break;
            case 3:
                grid = $wasGrid;
                url += 'saveSvrWasMonit.do';
                HmGrid.endRowEdit(grid);
                var _list = [];
                if (editWasIds.length > 0) {
                    $.each(editWasIds, function (idx, value) {
                        var tmp = grid.jqxGrid('getrowdatabyid', value);
                        _list.push(tmp);
                    });

                    params.list = _list;
                    Server.post(url, {
                        data: params,
                        success: function (result) {
                            alert('저장되었습니다.');
                            editWasIds = [];
                        }
                    });
                } else {
                    alert('변경된 사항이 없습니다.');
                }
                break;
            case 4:
                grid = $dbGrid;
                url += 'saveSvrDbMonit.do';
                HmGrid.endRowEdit(grid);
                var _list = [];
                if (editDbIds.length > 0) {
                    $.each(editDbIds, function (idx, value) {
                        var tmp = grid.jqxGrid('getrowdatabyid', value);
                        _list.push(tmp);
                    });

                    params.list = _list;

                    Server.post(url, {
                        data: params,
                        success: function (result) {
                            alert('저장되었습니다.');
                            editDbIds = [];
                        }
                    });
                } else {
                    alert('변경된 사항이 없습니다.');
                }
                break;
            case 6:
                url += 'saveSvrEach.do';
                HmGrid.endRowEdit($limitGrid);
                HmGrid.endRowEdit($statGrid);

                if (editLimitIds.length == 0 && editStatIds.length == 0) {
                    alert('변경된 사항이 없습니다.');
                    return;
                }
                var _list = [];
                $.each(editLimitIds, function (idx, value) {
                    var tmp = $limitGrid.jqxGrid('getrowdatabyid', value);
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
                $.each(editStatIds, function (idx, value) {
                    var tmp = $statGrid.jqxGrid('getrowdatabyid', value);
                    tmp.useFlag = tmp.useFlag ? 1 : 0;
                    if (tmp.limitValue1 == "null"){ tmp.limitValue1 = parseInt('0') }
                    else{ tmp.limitValue1  = parseInt(tmp.limitValue1); }
                    if (tmp.limitValue2 == "null"){ tmp.limitValue2 = parseInt('0') }
                    else{ tmp.limitValue2  = parseInt(tmp.limitValue2); }
                    if (tmp.limitValue3 == "null"){ tmp.limitValue3 = parseInt('0') }
                    else{ tmp.limitValue3  = parseInt(tmp.limitValue3); }
                    _list.push(tmp);
                });

                params.list = _list;
                // $('#svrMgmtLoader').jqxLoader('open');
                Server.post(url , {
                    data: params,
                    success: function (result) {
                        // $('#svrMgmtLoader').jqxLoader('close');
                        alert('저장되었습니다.');
                        editLimitIds = [];
                        editStatIds = [];
                    }
                });
                break;
            default:
                return;
        }

    },


    addConfig: function () {
        switch ($('#cfgTab').val()) {
            case 0:
                break;
            case 1:
                var rowIdxes = HmGrid.getRowIdxes($svrGrid, '서버를 선택해주세요.');
                if (rowIdxes === false) return;
                var mngNo = $svrGrid.jqxGrid('getrowdata', rowIdxes).mngNo;

                $.post(ctxPath + '/main/popup/env/pSvrMprocAdd.do',
                    function (result) {
                        HmWindow.open($('#pwindow'), '감시프로세스 등록', result, 500, 407, 'p2window_init', {mngNo: mngNo});
                    }
                );
                break;
            case 3:
                var rowIdxes = HmGrid.getRowIdxes($svrGrid, '서버를 선택해주세요.');
                if (rowIdxes === false) return;
                var mngNo = $svrGrid.jqxGrid('getrowdata', rowIdxes).mngNo;

                $.post(ctxPath + '/main/popup/env/pSvrWasMonitAdd.do',
                    function (result) {
                        HmWindow.open($('#pwindow'), 'WAS 모니터링 등록', result, 500, 303, 'p2window_init', {
                            mngNo: mngNo,
                            action: 'A'
                        });
                    }
                );
                break;
            case 4:
                var rowIdxes = HmGrid.getRowIdxes($svrGrid, '서버를 선택해주세요.');
                if (rowIdxes === false) return;
                var mngNo = $svrGrid.jqxGrid('getrowdata', rowIdxes).mngNo;

                $.post(ctxPath + '/main/popup/env/pSvrDbmsMonitAdd.do',
                    function (result) {
                        HmWindow.open($('#pwindow'), 'DBMS 모니터링 등록', result, 500, 240, 'p2window_init', {
                            mngNo: mngNo,
                            action: 'A'
                        });
                    }
                );
                break;
        }
    },

    delConfig: function () {
        switch ($('#cfgTab').val()) {
            case 0:
                break;
            case 1:
                var rowIdxes = HmGrid.getRowIdxes($svrGrid, '장비를 선택해주세요.');
                if (rowIdxes === false) return;
                var mngNo = $svrGrid.jqxGrid('getrowdata', rowIdxes).mngNo;

                var procRowIdxes = HmGrid.getRowIdxes($procGrid);
                if (procRowIdxes === false) {
                    alert('선택된 데이터가 없습니다.');
                    return;
                }

                var rowdata = $procGrid.jqxGrid('getrowdata', procRowIdxes);

                if (!confirm('[' + rowdata.userMprocName + '] 프로세스를 삭제하시겠습니까?')) return;


                Server.post('/main/env/svrMgmt/delSvrMproc.do', {
                    data: {mprocNo: rowdata.mprocNo, mngNo: mngNo},
                    success: function (result) {
                        alert('삭제되었습니다.');
                        $procGrid.jqxGrid('deleterow', rowdata.uid);
                    }
                });
                break;
            case 3:
                var rowIdxes = HmGrid.getRowIdxes($svrGrid, '장비를 선택해주세요.');
                if (rowIdxes === false) return;
                var mngNo = $svrGrid.jqxGrid('getrowdata', rowIdxes).mngNo;

                var wasRowIdxes = HmGrid.getRowIdxes($wasGrid);
                if (wasRowIdxes === false) {
                    alert('선택된 데이터가 없습니다.');
                    return;
                }

                var rowdata = $wasGrid.jqxGrid('getrowdata', wasRowIdxes);

                if (!confirm('[' + rowdata.wasNm + '] WAS를 삭제하시겠습니까?')) return;


                Server.post('/main/env/svrMgmt/delSvrWasMonit.do', {
                    data: {wasNo: rowdata.wasNo, mngNo: mngNo},
                    success: function (result) {
                        alert('삭제되었습니다.');
                        $wasGrid.jqxGrid('deleterow', rowdata.uid);
                    }
                });
                break;
            case 4:
                var rowIdxes = HmGrid.getRowIdxes($svrGrid, '장비를 선택해주세요.');
                if (rowIdxes === false) return;
                var mngNo = $svrGrid.jqxGrid('getrowdata', rowIdxes).mngNo;

                var dbRowIdxes = HmGrid.getRowIdxes($dbGrid);
                if (dbRowIdxes === false) {
                    alert('선택된 데이터가 없습니다.');
                    return;
                }

                var rowdata = $dbGrid.jqxGrid('getrowdata', dbRowIdxes);

                if (!confirm('[' + rowdata.dbmsNm + '] DB를 삭제하시겠습니까?')) return;


                Server.post('/main/env/svrMgmt/delSvrDbMonit.do', {
                    data: {dbmsNo: rowdata.dbmsNo, mngNo: mngNo},
                    success: function (result) {
                        alert('삭제되었습니다.');
                        $dbGrid.jqxGrid('deleterow', rowdata.uid);
                    }
                });
                break;
        }
    },

    /** ContextMenu */
    selectSvrCtxmenu: function (event) {
        var mnId = $(event.args)[0].id;
        switch (mnId) {
            case 'cm_svrInfoSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($svrGrid, '서버를 선택해주세요.');
                    if (rowIdxes === false) return;

                    var rowdata = $svrGrid.jqxGrid('getrowdata', rowIdxes[0]);
                    // console.log("rowData", rowdata)

                    var params = {
                        mngNo: rowdata.mngNo,
                        action: 'U'
                    };

                    $.post(ctxPath + '/main/popup/env/pSvrAdd.do',
                        params,
                        function (result) {
                            HmWindow.openFit($('#pwindow'), '[{0}] 서버정보 변경'.substitute(rowdata.displayName || rowdata.name), result, 600, 680);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_grpMoveBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($svrGrid, '서버를 선택하세요.');
                    if (rowIdxes === false) return;
                    var _mngNos = [];
                    $.each(rowIdxes, function (idx, value) {
                        _mngNos.push($svrGrid.jqxGrid('getrowdata', value).mngNo);
                    });
                    var params = {
                        mngNos: _mngNos.join(','),
                        isSvr: true
                    };
                    // HmWindow.create($('#pwindow'), 500, 500);
                    $.post(ctxPath + '/main/popup/env/pDevGrpBatchSet.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '서버 그룹이동', result, 400, 376);
                        }
                    );
                } catch (e) {
                }
                break;


            case 'cm_svrInfoCopySet':       /* 서버정보 복사 (단일서버 복사) */
                try {
                    var rowIdxes = HmGrid.getRowIdxes($svrGrid, '장비를 선택해주세요.');
                    if(rowIdxes === false) return;
                    if ( rowIdxes.length > 1) {
                        alert('단일장비를 선택해주세요.');
                        return;
                    }
                    var rowdata = $svrGrid.jqxGrid('getrowdata', rowIdxes[0]);
                    var params = {
                        mngNo: rowdata.mngNo,
                        action: 'C'
                    };
                    $.post(ctxPath + '/main/popup/env/pSvrCopy.do',
                        params,
                        function(result) {
                            HmWindow.open($('#pwindow'), '[{0}] 서버정보 복사'.substitute(rowdata.displayName || rowdata.name), result, 600, 711);
                        }
                    );



                } catch(e) {}
                break;

            case 'cm_svrInfoBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($svrGrid, '서버를 선택하세요.');
                    if (rowIdxes === false) return;
                    var _mngNos = [];
                    $.each(rowIdxes, function (idx, value) {
                        _mngNos.push($svrGrid.jqxGrid('getrowdata', value).mngNo);
                    });
                    var params = {
                        mngNos: _mngNos.join(',')
                    };
                    $.post(ctxPath + '/main/popup/env/pSvrInfoBatchSet.do',
                        params,
                        function (result) {
                            HmWindow.openFit($('#pwindow'), '서버정보 일괄설정', result, 500, 395, 'pwindow_init');
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_svrCollectBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($svrGrid, '서버를 선택하세요.');
                    if (rowIdxes === false) return;
                    var _mngNos = [], _baseNetPollGrpNo = 0, _isSameNetPollGrpNo = true;
                    $.each(rowIdxes, function (idx, value) {
                        var _tmp = $svrGrid.jqxGrid('getrowdata', value);
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
                    $.post(ctxPath + '/main/popup/env/pSvrCollectBatchSet.do',
                        params,
                        function (result) {
                            HmWindow.openFit($('#pwindow'), '수집정보 일괄설정', result, 500, 395, 'pwindow_init');
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_svrConnBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($svrGrid, '서버를 선택하세요.');
                    if (rowIdxes === false) return;
                    var _mngNos = [];
                    $.each(rowIdxes, function (idx, value) {
                        _mngNos.push($svrGrid.jqxGrid('getrowdata', value).mngNo);
                    });
                    var params = {
                        mngNos: _mngNos.join(',')
                    };
                    HmWindow.create($('#pwindow'), 400, 295, 999);
                    $.post(ctxPath + '/main/popup/env/pSvrConnBatchSet.do',
                        params,
                        function (result) {
                            HmWindow.openFit($('#pwindow'), '접속정보 일괄설정', result, 600, 310);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_svrMaintBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($svrGrid, '장비를 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _mngNos = [];
                    $.each(rowIdxes, function (idx, value) {
                        _mngNos.push($svrGrid.jqxGrid('getrowdata', value).mngNo);
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
            case 'cm_svrEvtCodeBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($svrGrid, '장비를 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _mngNos = [];
                    var diffProfileChk = true;
                    var tempProfileNo = -1;
                    $.each(rowIdxes, function (idx, value) {
                        _mngNos.push($svrGrid.jqxGrid('getrowdata', value).mngNo);
                        if(tempProfileNo==-1){
                            tempProfileNo = $svrGrid.jqxGrid('getrowdata', value).profileNo;
                        }else{
                            if( tempProfileNo != $svrGrid.jqxGrid('getrowdata', value).profileNo ){
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
                        profileNo : tempProfileNo,
                        profileType : "SVR"
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
            case 'cm_svrDynInfoBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($svrGrid, '장비를 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _mngNos = [];
                    $.each(rowIdxes, function (idx, value) {
                        _mngNos.push($svrGrid.jqxGrid('getrowdata', value).mngNo);
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

            case 'cm_filter':
            case 'cm_filterReset':
            case 'cm_colsMgr':
            case 'cm_copyCell':
                CtxMenu.itemClick(mnId, $svrGrid, 'grid');
                break;
        }
    },
    escapeCmpCond: function (value) {
        return value.replace('&lt;', '<').replace('&gt;', '>');
    },

    saveMprocList: function () {
        var rowIdxes = HmGrid.getRowIdxes($svrGrid, '장비를 선택해주세요.');
        if (rowIdxes === false) return;
        var rowdata = $svrGrid.jqxGrid('getrowdata', rowIdxes),
            mngNo = rowdata.mngNo,
            devKind2 = rowdata.devKind2;

        $.post(ctxPath + '/main/popup/env/pSvrMprocListAdd.do',
            function (result) {
                HmWindow.open($('#pwindow'), '감시프로세스 상속', result, 600, 500, 'p2window_init', {
                    mngNo: mngNo,
                    type: 'MAIN',
                    devKind2: devKind2
                });
            }
        );
    },

    addFile: function () {
        if (curSvrNo == -1) {
            alert("서버를 선택해주세요");
        } else {
            var params = {
                mngNo: curSvrNo
            };
            $.post(ctxPath + '/main/popup/env/pLogFileAdd.do',
                params,
                function (result) {
                    HmWindow.open($('#pwindow'), '파일추가', result, 400, 175);
                }
            );
        }
    },
    getFile: function () {
        if (curSvrNo == -1) {
            alert("서버를 선택해주세요");
        } else {
            var params = {
                mngNo: curSvrNo,
                type: 'MAIN'
            };
            $.post(ctxPath + '/main/popup/env/pSvrLogFile.do',
                params,
                function (result) {
                    HmWindow.open($('#pwindow'), '가져오기', result, 700, 400, 'p2window_init', params);
                }
            );
        }
    },
    saveFile: function () {
        HmGrid.endCellEdit($fileGrid);
        var rowdata = HmGrid.getRowData($svrGrid);
        if (rowdata == null) {
            alert('선택된 서버 정보가 없습니다.');
            return;
        }
        if (editFileIds.length < 1) {
            alert("변경된 데이터가 없습니다.");
        } else {
            var _list = [];
            $.each(editFileIds, function (idx, value) {
                var tmp = $fileGrid.jqxGrid('getrowdatabyid', value);
                _list.push(tmp);
            });
            Server.post(ctxPath + '/main/env/svrMgmt/editSvrLogFileList.do', {
                data: {mngNo: rowdata.mngNo, list: _list},
                success: function (data) {
                    alert('완료되었습니다.');
                },//success
            });//Server.post
        }

    },
    delFile: function () {
        var selectedIdx = $fileGrid.jqxGrid('selectedrowindex');
        if (selectedIdx == -1) {
            alert("삭제할 로그 파일을 선택해 주세요");
        } else {
            var rowData = $fileGrid.jqxGrid('getrowdata', selectedIdx);
            var params = {
                mngNo: curSvrNo,
                logNo: rowData.logNo
            };//params

            Server.post(ctxPath + '/main/env/svrMgmt/delLogFile.do', {
                data: params,
                success: function (data) {
                    alert('완료되었습니다.');
                    Main.searchConfig();
                }
            })
        }
    },


    addFileMonit: function () {

        if (curSvrNo == -1) {
            alert("서버를 선택해주세요");
        } else {
            var params = {
                mngNo: curSvrNo
            };
            $.post(ctxPath + '/main/popup/env/pMonitFileAdd.do',
                params,
                function (result) {
                    HmWindow.open($('#pwindow'), '파일추가', result, 400, 208);
                }
            );
        }
    },

    getFileMonit: function () {
        if (curSvrNo == -1) {
            alert("서버를 선택해주세요");
        } else {
            var params = {
                mngNo: curSvrNo,
                type: 'MAIN'
            };
            $.post(ctxPath + '/main/popup/env/pSvrLogFile.do',
                params,
                function (result) {
                    HmWindow.open($('#pwindow'), '가져오기', result, 700, 400, 'p2window_init', params);
                }
            );
        }
    },

    saveFileMonit: function () {

        HmGrid.endCellEdit($fileMonitGrid);
        var rowdata = HmGrid.getRowData($svrGrid);
        if (rowdata == null) {
            alert('선택된 서버 정보가 없습니다.');
            return;
        }

        if (editMonitIds.length < 1) {
            alert("변경된 데이터가 없습니다.");
        } else {

            var _list = [];

            $.each(editMonitIds, function (idx, value) {
                var tmp = $fileMonitGrid.jqxGrid('getrowdatabyid', value);
                _list.push(tmp);
            });

            Server.post(ctxPath + '/main/env/svrMgmt/editSvrFileMonitList.do', {
                data: {mngNo: rowdata.mngNo, list: _list},
                success: function (data) {
                    alert('완료되었습니다.');
                },//success
            });//Server.post
        }
    },

    delFileMonit: function () {

        var selectedIdx = $fileMonitGrid.jqxGrid('selectedrowindex');

        if (selectedIdx == -1) {
            alert("삭제할 파일을 선택해 주세요");
        } else {

            var rowData = $fileMonitGrid.jqxGrid('getrowdata', selectedIdx);

            var params = {
                fileChkNo: rowData.fileChkNo,
                mngNo: curSvrNo,
                logNo: rowData.logNo
            };

            Server.post(ctxPath + '/main/env/svrMgmt/delFileMonit.do', {
                data: params,
                success: function (data) {
                    alert('완료되었습니다.');
                    Main.searchConfig();
                }
            });

        }
    },

    initrowdetails: function (index, parentElement, gridElement, record) {
        if (record.logType == 4) {
            var id = record.uid.toString();
            var grid = $($(parentElement).children()[0]);
            var evtGridAdapter = new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: ctxPath + '/main/env/svrMgmt/getLogEvtCondList.do'
                },
                {
                    formatData: function (data) {
                        data.logNo = record.logNo;
                        data.logEvtCodeNo = record.logEvtCodeNo;
                        return data;
                    },
                    loadComplete: function (records) {
                        //console.log(records.resultData);
                    }
                }
            );
            if (grid != null) {
                HmGrid.create(grid, {
                    source: evtGridAdapter,
                    width: '90%',
                    height: 150,
                    pageable: false,
                    columns: [
                        {text: 'COND_SEQ', datafield: 'condSeq', hidden: true},
                        {text: 'LOG_NO', datafield: 'logNo', hidden: true},
                        {text: 'LOG_EVT_CODE_NO', datafield: 'logEvtCodeNo', hidden: true},
                        {
                            text: '조건종류',
                            datafield: 'condKind',
                            width: 100,
                            cellsalign: 'center',
                            filtertype: 'checkedlist',
                            cellsrenderer: function (row, columnfield, value) {
                                var return_val = '';
                                switch (value) {
                                    case 0:
                                    case '0':
                                        return_val = 'CONTAIN';
                                        break;
                                    case 1:
                                    case '1':
                                        return_val = 'NOT CONTAIN';
                                        break;
                                }
                                return '<div style="margin-top: 2px" class="jqx-center-align">' + return_val + '</div>';
                            }
                        },
                        {text: '조건값', datafield: 'condVal', minwidth: 100},
                        {text: '조건', datafield: 'condOpt', width: 100, cellsalign: 'center'}
                    ]
                });//HmGrid.create
            }//if(grid != null)
        }//if(record.logType == 4)
    },

    searchLogEvtList: function () {
        HmGrid.updateBoundData($fileEvtGrid, ctxPath + '/main/env/svrMgmt/getLogEvtList.do');
    },


    /* 이벤트 관련  */
    addEvt: function () {
        if (curLogNo == -1) {
            alert("이벤트를 등록할 파일을 선택해 주세요");
        } else {
            var params = {
                logNo: curLogNo,
                mngNo: curSvrNo
            };//params

            $.post(ctxPath + '/main/popup/env/pLogEvtAdd.do',
                params,
                function (result) {


                    HmWindow.open($('#pwindow'), '추가', result, 500, 392);
                }
            );
        }
    },


    editEvt: function () {

        var selectedIdx = $fileEvtGrid.jqxGrid('selectedrowindex');

        if (curLogNo == -1) {
            alert("이벤트를 등록할 파일을 선택해 주세요");
        } else if (selectedIdx == -1) {
            alert("수정할 이벤트를 선택해주세요");
        } else {

            var rowData = $fileEvtGrid.jqxGrid('getrowdata', selectedIdx);

            var params = {
                mngNo: curSvrNo,
                logNo: curLogNo,
                logEvtCodeNo: rowData.logEvtCodeNo
            };//params

            $.post(ctxPath + '/main/popup/env/pLogEvtEdit.do',
                params,
                function (result) {
                    HmWindow.open($('#pwindow'), '수정', result, 500, 392);
                }
            );
        }
    },


    delEvt: function () {

        var rowIdx = HmGrid.getRowIdx($fileEvtGrid, '데이터를 선택해주세요.');
        if (rowIdx === false) return;
        if (!confirm('선택된 데이터를 삭제하시겠습니까?')) return;

        var rowData = $fileEvtGrid.jqxGrid('getrowdata', rowIdx);

        var params = {
            mngNo: curSvrNo,
            logNo: curLogNo,
            logEvtCodeNo: rowData.logEvtCodeNo
        };//params

        Server.post(ctxPath + '/main/env/svrMgmt/delLogEvt.do', {
            data: params,
            success: function (data) {
                alert('완료되었습니다.');
                Main.searchLogEvtList();
            }
        });

    },


    /* 이벤트 관련  */
    addFileEvt: function () {

        if (curLogNo == -1) {
            alert("이벤트를 등록할 파일을 선택해 주세요");
        } else {
            var params = {
                logNo: curLogNo,
                mngNo: curSvrNo
            };

            $.post(ctxPath + '/main/popup/env/pFileEvtAdd.do',
                params,
                function (result) {
                    HmWindow.open($('#pwindow'), '추가', result, 330, 180);
                }
            );

        }
    },

    editFileEvt: function () {

        var selectedIdx = $fileMonitEvtGrid.jqxGrid('selectedrowindex');

        if (curLogNo == -1) {
            alert("이벤트를 등록할 파일을 선택해 주세요");
        } else if (selectedIdx == -1) {
            alert("수정할 이벤트를 선택해주세요");
        } else {

            var rowData = $fileMonitEvtGrid.jqxGrid('getrowdata', selectedIdx);

            var params = {
                mngNo: curSvrNo,
                logNo: curLogNo,
                logEvtCodeNo: rowData.fileChkEvtCodeNo
            };

            $.post(ctxPath + '/main/popup/env/pFileEvtEdit.do',
                params,
                function (result) {
                    HmWindow.open($('#pwindow'), '수정', result, 330, 180);
                }
            );
        }
    },

    delFileEvt: function () {

        var rowIdx = HmGrid.getRowIdx($fileMonitEvtGrid, '데이터를 선택해주세요.');

        if (rowIdx === false) return;

        if (!confirm('선택된 데이터를 삭제하시겠습니까?')) return;

        var rowData = $fileMonitEvtGrid.jqxGrid('getrowdata', rowIdx);

        var params = {
            mngNo: curSvrNo,
            logNo: curLogNo,
            fileChkNo: rowData.fileChkNo,
            fileChkEvtCodeNo: rowData.fileChkEvtCodeNo
        };

        Server.post(ctxPath + '/main/env/svrMgmt/delFileEvt.do', {
            data: params,
            success: function (data) {
                alert('완료되었습니다.');
                Main.searchMonitEvtList();
            }
        })
    },


    searchMonitEvtList: function () {
        HmGrid.updateBoundData($fileMonitEvtGrid, ctxPath + '/main/env/svrMgmt/getFileEvtList.do');
    },

    exportExcel_svr: function () {
        HmUtil.exportGrid($svrGrid, '서버정보', false);
    },

    /** devMgmt참조 */
    limitInitEditor: function(row, cellvalue, editor) {
        editor.jqxNumberInput({ decimalDigits: 0, min: 0, max: 9999999999 , theme: jqxTheme, inputMode: 'simple', spinButtons: true, value: cellvalue });

    },
    /** 임계치  소수점 둘째자리 까지 가능하도록 함 */
    limitInitEditor2: function(row, cellvalue, editor) {
        editor.jqxNumberInput({ decimalDigits: 2, min: 0, max: 9999999999 , theme: jqxTheme, inputMode: 'simple', spinButtons: true, value: cellvalue });

    },
    isEditable: function(row) {
        var rowdata = $statGrid.jqxGrid('getrowdata', row);
        if(rowdata.evtCd.indexOf('ICMP') !== -1 ||rowdata.evtCd.indexOf('SNMP') !== -1 ) {
            return true;
        }
        return false;
    },
    isEditableClass: function (row, column, value, data) {
        var rowdata = $statGrid.jqxGrid('getrowdata', row);
        if(rowdata.evtCd.indexOf('ICMP') !== -1 ||rowdata.evtCd.indexOf('SNMP') !== -1 ) {
            return null;
        }
        return "disabledCell";
    },
    isEditableClassLimit: function (row, column, value, data) {
        var rowdata = $limitGrid.jqxGrid('getrowdata', row);
        if(String(rowdata.extraCd) === 'null' || String(rowdata.extraCd) === '-1') {
            return "disabledCell";
        }
        return null;
    },

    // 삭제장비 복원
    svrRestore: function () {
        $.post('/main/popup/env/pSvrRestore.do',
            function (result) {
                HmWindow.open($('#pwindow'), '장비 복원', result, 900, 600);
            }
        );
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

function grpResult() {
    HmTreeGrid.updateData($grpTree, HmTree.T_GRP_DEFAULT2, {devKind1: 'SVR'});
}

function svrResult() {
    Main.searchSvr();
}

// 그룹이동 팝업으로 부터 callback 함수
function refreshGrp() {
    grpResult();
}

function refreshDev() {
    Main.searchSvr();
}


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});