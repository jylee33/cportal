var $db2dbGrid, $envVarGrid;

var db2dbMgmt = {

    initialize : function() {
        this.initVariable();
        this.observe();
        this.initDesign();
        this.initData();
    },

    /** variable */
    initVariable: function() {
        $db2dbGrid = $('#db2dbGrid'), $envVarGrid = $('#envVarGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { db2dbMgmt.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnSearch_db2db': this.searchDb2db(); break;
            case 'btnAdd_db2db': this.addDb2db(); break;
            case 'btnEdit_db2db': this.editDb2db(); break;
            case 'btnDel_db2db': this.delDb2db(); break;
            case 'btnExcel_db2db': this.exportExcel(curTarget.id); break;

            case 'btnSearch_envVar': this.searchEnvVar(); break;
            case 'btnAdd_envVar': this.addEnvVar(); break;
            case 'btnEdit_envVar': this.editEnvVar(); break;
            case 'btnDel_envVar': this.delEnvVar(); break;
            case 'btnExcel_envVar': this.exportExcel(curTarget.id); break;
        }
    },

    /** init design */
    initDesign: function() {
        HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '60%', collapsible: false }, { size: '40%' }], 'auto', '100%');

        HmGrid.create($db2dbGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    contenttype: 'application/json',
                    type: 'post',
                    datafields:[
                        { name:'engCode', type:'string' },
                        { name:'querySequence', type:'string' },
                        { name:'srcQuery', type:'string' },
                        { name:'dstQuery', type:'string' },
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
                HmGrid.titlerenderer(toolbar, 'DB to DB');
            },
            editmode: 'selectedrow',
            columns:
                [
                    { text : 'DB2DB', datafield: 'engCode', width: 100, editable: false/*, hidden: true*/ },
                    { text : '순번', datafield: 'querySequence', width: 80, editable: false, cellsalign: 'center' },
                    { text : '소스 DB Query', datafield: 'srcQuery', minwidth: 180, editable: false },
                    { text : '목적지 DB Query', datafield: 'dstQuery', minwidth: 180, editable: false },
                    { text : '수정일시', datafield: 'lastUpd', width: 160, editable: false, cellsalign: 'center' }
                ]
        }, CtxMenu.NONE);
        $db2dbGrid.on('sort', function (event) {
            event.stopPropagation();
            return false;
        }).on('contextmenu', function (event) {
            return false;
        }).on('rowclick', function (event) {
            if (event.args.rightclick) {
                $db2dbGrid.jqxGrid('selectrow', event.args.rowindex);
                var rowIdxes = HmGrid.getRowIdxes($db2dbGrid, 'DB2DB를 선택해주세요.');

                var scrollTop = $(window).scrollTop();
                var scrollLeft = $(window).scrollLeft();
                $('#ctxmenu_db2db').jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
                    parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                return false;
            }
        }).on('rowselect', function(event){
            setTimeout(db2dbMgmt.searchEnvVar, 100);
        });

        HmGrid.create($envVarGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
/*
                    contenttype: 'application/json',
*/
                    type: 'post',
                    datafields:[
                        { name:'engCode', type:'string' },
                        { name:'envSequence', type:'string' },
                        { name:'query', type:'string' },
                        { name:'lastUpd', type:'string' }
                    ]
                },
                {
                    formatData: function(data) {
                        var _engCode = null;
                        var rowIdx = HmGrid.getRowIdx($db2dbGrid);
                        if (rowIdx !== false) _engCode = $db2dbGrid.jqxGrid('getrowdata', rowIdx).engCode;

                        $.extend(data, {
                            engCode: _engCode
                        });

                        return data;
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '환경변수');
            },
            editmode: 'selectedrow',
            columns:
                [
                    { text : 'DB2DB', datafield: 'engCode', width: 100, editable: false, hidden: true },
                    { text : '순번', datafield: 'envSequence', width: 80, editable: false, cellsalign: 'center' },
                    { text : '환경변수 Query', datafield: 'query', minwidth: 180, editable: false },
                    { text : '수정일시', datafield: 'lastUpd', width: 160, editable: false, cellsalign: 'center' }
                ]
        });

        $('#ctxmenu_db2db').jqxMenu({width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme})
            .on('itemclick', function (event) {
                db2dbMgmt.selectDb2dbSvrCtxmenu(event);
            });

    },

    /** init data */
    initData: function() {
        this.searchDb2db();
    },

    /** OID Db2db */
    addDb2db: function() {
        $.post(ctxPath + '/main/popup/env/dbMgmt/pDb2dbAdd.do', function(result) {
            HmWindow.open($('#pwindow'), 'DB2DB 추가', result, 600, 395, 'pwindow_init');
        });
    },

    editDb2db: function() {
        var rowdata = HmGrid.getRowData($db2dbGrid);
        if(rowdata == null){
            alert('수정할 DB를 선택하세요.');
            return;
        }

        $.post(ctxPath + '/main/popup/env/dbMgmt/pDb2dbEdit.do',
            rowdata,
            function(result) {
                HmWindow.open($('#pwindow'), 'DB2DB 수정', result, 600, 429, 'pwindow_init', rowdata);
            }
        );
    },

    delDb2db: function() {
        var rowdata = HmGrid.getRowData($db2dbGrid);
        if(rowdata == null){
            alert('삭제할 DB2DB를 선택하세요.');
            return;
        }
        if(!confirm('[{0}]({1}) DB2DB를 삭제하시겠습니까?'.substitute(rowdata.engCode, rowdata.querySequence))) return;

        Server.post('/main/env/dbSvrMgmt/delDb2db.do', {
            data: rowdata,
            success: function(result) {
                // $db2dbGrid.jqxGrid('deleterow', rowdata.uid);
                db2dbMgmt.searchDb2db();
                alert(result); // 삭제 or 삭제방지문구
            }
        });
    },


    /** Command */
    addEnvVar: function() {
        var rowdata = HmGrid.getRowData($db2dbGrid);
        if(rowdata == null){
            alert('환경변수를 추가할 DB2DB를 선택하세요.');
            return;
        }

        $.post(ctxPath + '/main/popup/env/dbMgmt/pDb2dbEnvAdd.do',
            rowdata,
            function(result) {
                HmWindow.open($('#pwindow'), '환경변수 추가', result, 600, 255, 'pwindow_init', rowdata);
            }
        );
    },

    editEnvVar: function() {
        var rowdata = HmGrid.getRowData($envVarGrid);
        if(rowdata == null){
            alert('수정할 환경변수를 선택하세요.');
            return;
        }

        $.post(ctxPath + '/main/popup/env/dbMgmt/pDb2dbEnvEdit.do',
            rowdata,
            function(result) {
                HmWindow.open($('#pwindow'), '환경변수 수정', result, 600, 285, 'pwindow_init', rowdata);
            }
        );
    },

    delEnvVar: function() {
        var rowdata = HmGrid.getRowData($envVarGrid);
        if(rowdata == null){
            alert('환경변수를 선택하세요.');
            return;
        }
        if(!confirm('선택된 환경변수를 삭제하시겠습니까?')) return;

        Server.post('/main/env/dbSvrMgmt/delDb2dbEnv.do', {
            data: rowdata,
            success: function(result) {
                $envVarGrid.jqxGrid('deleterow', rowdata.uid);
                alert(result);
            }
        });
    },

    /** 조회 */
    searchDb2db: function() {
        HmGrid.updateBoundData($db2dbGrid, ctxPath + '/main/env/dbSvrMgmt/getDb2dbQueryMgmtList.do');
    },
    searchEnvVar: function() {
        HmGrid.updateBoundData($envVarGrid, ctxPath + '/main/env/dbSvrMgmt/getDb2dbEnvMgmtList.do');
    },

    /** export Excel */
    exportExcel: function(param) {
        switch (param) {
            case 'btnExcel_db2db': HmUtil.exportGrid($db2dbGrid, "DB to DB", false); break;
            case 'btnExcel_envVar': HmUtil.exportGrid($envVarGrid, "DB환경변수", false); break;
        }
    },

    /** ContextMenu */
    selectDb2dbSvrCtxmenu: function (event) {
        switch ($(event.args)[0].id) {
            case 'db2db_query_add':
                try {
                    var rowdata = HmGrid.getRowData($db2dbGrid);
                    if(rowdata == null){
                        alert('쿼리를 등록할 DB2DB를 선택하세요.');
                        return;
                    }
                    $.post(ctxPath + '/main/popup/env/dbMgmt/pDb2dbQueryAdd.do', function (result) {
                            HmWindow.open($('#pwindow'), 'DB2DB Query 추가 등록', result, 600, 440, 'pwindow_init', rowdata);
                        }
                    );
                } catch (e) {
                    console.log("fail")
                }
                break;
        }
    },

};


/*
$(function() {
    db2dbMgmt.initVariable();
    db2dbMgmt.observe();
    db2dbMgmt.initDesign();
    db2dbMgmt.initData();
});*/
