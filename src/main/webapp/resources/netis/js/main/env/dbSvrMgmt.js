var $dbSvrGrid;

var dbSvrMgmt = {

    initialize : function() {
        this.initVariable();
        this.observe();
        this.initDesign();
        this.initData();
    },

    /** variable */
    initVariable: function() {
        $dbSvrGrid = $('#dbSvrGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { dbSvrMgmt.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        // var curTarget = event.currentTarget;
        // switch(curTarget.id) {
        //     case 'btnSearch_dbSvr': this.searchDbSvr(); break;
        //     case 'btnAdd_dbSvr': this.addDbSvr(); break;
        //     case 'btnEdit_dbSvr': this.editDbSvr(); break;
        //     case 'btnDel_dbSvr': this.delDbSvr(); break;
        //     case 'btnExcel': this.exportExcel(); break;
        // }
    },

    /** init design */
    initDesign: function() {
        HmGrid.create($dbSvrGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    contenttype: 'application/json',
                    type: 'post',
                    datafields:[
                        { name:'serviceName', type:'string' },
                        { name:'idx', type:'int' },
                        { name:'dbType', type:'string' },
                        { name:'host', type:'string' },
                        { name:'port', type:'int' },
                        { name:'dbname', type:'string' },
                        { name:'userid', type:'string' },
                        { name:'pwd', type:'string' },
                        { name:'charset', type:'string' },
                        { name:'tnsname', type:'string' },
                        { name:'dsn', type:'string' },
                        { name:'protocol', type:'string' },
                        { name:'currUse', type:'int' },
                        { name:'retryCnt', type:'int' },
                        { name:'maxRetryCnt', type:'int' },
                        { name:'lastUpd', type:'string' }
                    ]
                },
                {
                    formatData: function(data) {
                        return JSON.stringify(data);
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, 'DB 서버 설정');
            },
            editmode: 'selectedrow',
            columns:
                [
                    { text : 'DB 서비스명', datafield: 'serviceName', minwidth: 150, editable: false/*, hidden: true*/ },
                    { text : '순번', datafield: 'idx', width: 80, editable: false, cellsalign: 'center' },
                    { text : 'DB 유형', datafield: 'dbType', width: 120, editable: false },
                    { text : 'IP', datafield: 'host', width: 120, editable: false, cellsalign: 'center' },
                    { text : 'Port', datafield: 'port', width: 120, editable: false, cellsalign: 'center' },
                    { text : 'DB명', datafield: 'dbname', width: 120, editable: false },
                    { text : 'ID', datafield: 'userid', width: 120, editable: false },
                    { text : 'Password', datafield: 'pwd', width: 80, editable: false, hidden: true },
                    { text : '캐릭터셋', datafield: 'charset', width: 120, editable: false },
                    //ORACLE일때만
                    { text : 'Oracle TNS', datafield: 'tnsname', width: 120, editable: false },
                    //ODBC일때
                    { text : 'ODBC명', datafield: 'dsn', width: 120, editable: false },
                    //DB2일때
                    { text : 'DB2프로토콜', datafield: 'protocol', width: 120, editable: false },
                    { text : 'reCnt', datafield: 'retryCnt', width: 120, editable: false, hidden: true },
                    { text : '접속 시도횟수', datafield: 'maxRetryCnt', width: 120, editable: false, cellsalign: 'center' },
                    { text : '사용여부', datafield: 'currUse', width: 120, editable: false, columntype: 'checkbox' },
                    { text : '수정일시', datafield: 'lastUpd', width: 160, editable: false, cellsalign: 'center' }
                ]
        }, CtxMenu.NONE);
        $dbSvrGrid.on('sort', function (event) {
            event.stopPropagation();
            return false;
        }).on('contextmenu', function (event) {
            return false;
        }).on('rowclick', function (event) {
            if (event.args.rightclick) {
                $dbSvrGrid.jqxGrid('selectrow', event.args.rowindex);
                var rowIdxes = HmGrid.getRowIdxes($dbSvrGrid, 'DB를 선택해주세요.');

                var scrollTop = $(window).scrollTop();
                var scrollLeft = $(window).scrollLeft();
                $('#ctxmenu_db2dbSvr').jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
                    parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                return false;
            }
        });

        $('#ctxmenu_db2dbSvr').jqxMenu({width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme})
            .on('itemclick', function (event) {
                dbSvrMgmt.selectDb2dbSvrCtxmenu(event);
            });

    },

    /** init data */
    initData: function() {
        this.searchDbSvr();
    },

    /** Btn */
    addDbSvr: function() {

        $.post(ctxPath + '/main/popup/env/dbMgmt/pDbSvrAdd.do', function(result) {
            HmWindow.open_new($('#pwindow'), 'DB 서버 등록', result, {w:500, h:405}, 'pwindow_init');
        });

    },

    editDbSvr: function() {
        var rowdata = HmGrid.getRowData($dbSvrGrid);
        if(rowdata == null){
            alert('수정할 DB를 선택하세요.');
            return;
        }

        $.post(ctxPath + '/main/popup/env/dbMgmt/pDbSvrEdit.do', function(result) {
            HmWindow.open_new($('#pwindow'), 'DB 서버 수정', result, {w:500, h:405}, 'pwindow_init', rowdata);
        });
    },

    delDbSvr: function() {
        var rowdata = HmGrid.getRowData($dbSvrGrid);
        if(rowdata == null){
            alert('삭제할 DB 서비스를 선택하세요.');
            return;
        }
        if(!confirm('[{0}] 서비스를 삭제하시겠습니까?'.substitute(rowdata.serviceName))) return;

        Server.post('/main/env/dbSvrMgmt/delDbSvr.do', {
            data: rowdata,
            success: function(result) {
                // $dbSvrGrid.jqxGrid('deleterow', rowdata.uid);
                dbSvrMgmt.searchDbSvr();
                alert(result); // 삭제 or 삭제방지문구
            }
        });
    },

    /** 조회 */
    searchDbSvr: function() {
        HmGrid.updateBoundData($dbSvrGrid, ctxPath + '/main/env/dbSvrMgmt/getDbSvrMgmtList.do');
    },

    /** export Excel */
    exportExcel: function() {
        HmUtil.exportGrid($dbSvrGrid, "DB 서버 설정", false);
    },

    /** ContextMenu */
    selectDb2dbSvrCtxmenu: function (event) {
        switch ($(event.args)[0].id) {
            case 'db2db_svc_duplication':
                try {

                    var rowdata = HmGrid.getRowData($dbSvrGrid);
                    if(rowdata == null){
                        alert('등록할 서비스를 선택하세요.');
                        return;
                    }
                    $.post(ctxPath + '/main/popup/env/dbMgmt/pDbSvcDuplication.do', function (result) {
                        HmWindow.open($('#pwindow'), 'DB 서비스 이중화 등록', result, 600, 440, 'pwindow_init', rowdata);
                    }
                    );
                } catch (e) {
                }
                break;
            case 'db2db_svc_edit':
                try {
                    var rowdata = HmGrid.getRowData($dbSvrGrid);
                    if(rowdata == null){
                        alert('수정할 서비스를 선택하세요.');
                        return;
                    }
                    $.post(ctxPath + '/main/popup/env/dbMgmt/pDbSvcNmEdit.do', function (result) {
                        HmWindow.open($('#pwindow'), 'DB 서비스명 변경', result, 300, 145, 'pwindow_init', rowdata);
                    }
                    );
                } catch (e) {
                }
                break;
        }
    },

};


/*
$(function() {
    dbSvrMgmt.initVariable();
    dbSvrMgmt.observe();
    dbSvrMgmt.initDesign();
    dbSvrMgmt.initData();
});*/
