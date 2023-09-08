var $dbCollectGrid;

var dbCollectMgmt = {

    initialize : function() {
        this.initVariable();
        this.observe();
        this.initDesign();
        this.initData();
    },

    /** variable */
    initVariable: function() {
        $dbCollectGrid = $('#dbCollectGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { dbCollectMgmt.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        // var curTarget = event.currentTarget;
        // switch(curTarget.id) {
        //     case 'btnSearch_dbCollect': this.searchDbCollect(); break;
        //     case 'btnAdd_dbCollect': this.addDbCollect(); break;
        //     case 'btnEdit_dbCollect': this.editDbCollect(); break;
        //     case 'btnDel_dbCollect': this.delDbCollect(); break;
        //     case 'btnExcel': this.exportExcel(); break;
        // }
    },

    /** init design */
    initDesign: function() {
        HmGrid.create($dbCollectGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    contenttype: 'application/json',
                    type: 'post',
                    datafields:[
                        { name:'engCode', type:'string' },
                        { name:'srcDbName', type:'string' },
                        { name:'dstDbName', type:'string' },
                        { name:'dstUseLocal', type:'string' },
                        { name:'engType', type:'string' },
                        { name:'engCycleType', type:'string' },
                        { name:'engCycle', type:'string' },
                        { name:'logLevel', type:'string' },
                        { name:'logLevelStr', type:'string' },
                        { name:'lastUpd', type:'string' }
                    ]
                },
                {
                    formatData: function(collectData) {
                        return JSON.stringify(collectData);
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, 'DB 수집 설정');
            },
            editmode: 'selectedrow',
            columns:
                [
                    { text : 'DB2DB', datafield: 'engCode', width: 120, editable: false},
                    { text : '소스 DB 서비스', datafield: 'srcDbName', minwidth: 180, editable: false, cellsalign: 'center' /*,hidden: true*/ },
                    { text : '로컬 NETIS DB 사용', datafield: 'dstUseLocal', width: 180, editable: false, columntype: 'checkbox' },
                    { text : '목적지 DB 서비스', datafield: 'dstDbName', minwidth: 180, editable: false, cellsalign: 'center' },
                    { text : '동작 방식', datafield: 'engType', width: 180, editable: false, cellsrenderer: dbCollectMgmt.operTypeRenderer },
                    { text : '동작 주기 유형', datafield: 'engCycleType', width: 180, editable: false, cellsrenderer: dbCollectMgmt.cycleTypeRenderer },
                    { text : '동작 주기', datafield: 'engCycle', width: 180, editable: false, cellsalign: 'center' },
                    { datafield: 'logLevel', width: 180, editable: false, hidden: true },
                    { text : '로그 레벨', datafield: 'logLevelStr', width: 180, editable: false },
                    { text : '수정 일시', datafield: 'lastUpd', width: 180, editable: false, cellsalign: 'center' },
                ]
        });
        $dbCollectGrid.on('rowselect', function(event){
            // setTimeout(dbCollectMgmt.searchCmd, 100);
        });
    },

    /** init data */
    initData: function() {
        this.searchDbCollect();
    },

    /** btn */
    addDbCollect: function() {
        Server.post('/main/env/dbSvrMgmt/getDb2dbNm.do', {
            success: function(result) {
                var returnCheck = result.length;
                if (!returnCheck) {
                    alert('설정할 DB2DB가 없습니다.');
                    return;
                }
                $.post(ctxPath + '/main/popup/env/dbMgmt/pDbCollectAdd.do', function(result) {
                    HmWindow.openFit($('#pwindow'), 'DB 수집 설정 추가', result, 500, 440, 'pwindow_init');
                });
            }
        });
    },

    editDbCollect: function() {
        var rowdata = HmGrid.getRowData($dbCollectGrid);
        if(rowdata == null){
            alert('수정할 설정을 선택하세요.');
            return;
        }
        console.log("this is edit", rowdata);

        $.post(ctxPath + '/main/popup/env/dbMgmt/pDbCollectEdit.do',
            rowdata,
            function(result) {
                HmWindow.openFit($('#pwindow'), 'DB 수집 설정 수정', result, 500, 440, 'pwindow_init', rowdata);
            }
        );
    },

    delDbCollect: function() {
        var rowdata = HmGrid.getRowData($dbCollectGrid);
        if(rowdata == null){
            alert('삭제할 설정을 선택하세요.');
            return;
        }
        if(!confirm('[{0}] 설정을 삭제하시겠습니까?'.substitute(rowdata.engCode))) return;

        Server.post('/main/env/dbSvrMgmt/delDbCollect.do', {
            data: rowdata,
            success: function(result) {
                $dbCollectGrid.jqxGrid('deleterow', rowdata.uid);
                alert(result);
            }
        });
    },

    /** 조회 */
    searchDbCollect: function() {
        HmGrid.updateBoundData($dbCollectGrid, ctxPath + '/main/env/dbSvrMgmt/getDbCollectMgmtList.do');
    },

    /** export Excel */
    exportExcel: function() {
        HmUtil.exportGrid($dbCollectGrid, "DB 수집 설정", false);
    },

    cycleTypeRenderer: function (row, datafield, value) {
        var cell = "<div style='margin-top: 6.5px; margin-left: 5px' class='jqx-center-align'>";
        switch (value.toString()) {
            case "0":
                cell += "분";
                break;
            case "1":
                cell += "초";
                break;
        }
        cell += "</div>";
        return cell;
    },

    operTypeRenderer: function (row, datafield, value) {
        var cell = "<div style='margin-top: 6.5px; margin-left: 5px' class='jqx-center-align'>";
        switch (value.toString()) {
            case "C":
                cell += "Cron";
                break;
            case "M":
                cell += "Monit";
                break;
        }
        cell += "</div>";
        return cell;
    },

};


/*
$(function() {
    dbCollectMgmt.initVariable();
    dbCollectMgmt.observe();
    dbCollectMgmt.initDesign();
    dbCollectMgmt.initData();
});*/
