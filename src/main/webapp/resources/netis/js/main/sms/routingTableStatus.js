var $routingTableGrid;
var editUserIds = [];
var userId;
var userName;
var routingTableStatus = {

    initialize : function() {
        this.initVariable();
        this.observe();
        this.initDesign();
        this.initData();
    },

    /** variable */
    initVariable: function() {
        $routingTableGrid = $('#routingTableGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { routingTableStatus.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        // var curTarget = event.currentTarget;
        // switch(curTarget.id) {
        //     case "btnSearch": this.searchRoutingTable(); break;
        //     case "btnExcel": this.exportExcel(); break;
        // }
    },

    /** init design */
    initDesign: function() {
        HmGrid.create($('#routingTableGrid'), {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    updaterow: function(rowid, rowdata, commit) {
                        if(editUserIds.indexOf(rowid) == -1)
                            editUserIds.push(rowid);
                        commit(true);
                    },
                    // datafields: [
                    //     { name: 'userId', type: 'string' },
                    //     { name: 'notiCnt', type: 'int' }
                    // ]
                },
                {
                    formatData: function (data) {
                        $.extend(data, {
                            mngNo: dtl_mngNo
                        });
                        return data;
                    }
                },
                {
                    beforeLoadComplete: function(records) {
                        if(records != null) {
                            $.each(records, function(idx, value) {
                                if(value.topoAuthGrpNo == 0) { //토폴로지권한 미설정표시
                                    value.topoAuthGrpNm = $i18n.map["com.word.noSet"];//미설정
                                }
                            });
                        }
                        return records;
                    }
                }
            ),
            height: 200,
            autoheight: true,
            showtoolbar: true,
            scrollbarsize: -1,
            pageable: false,
            rendertoolbar: function (toolbar) {
                pSvrInfo.topNToolbarRenderer(toolbar, 'Routing 테이블', 'routingTable', false);
            },
            columns:
                [
                    { text : 'Destination', datafield : 'destination', minwidth : 120, /*editable: false, pinned: true*/ },
                    { text : 'Gateway', datafield : 'gateway', width: 120, /*pinned: true */},
                    { text : 'Netmask', datafield : 'netmask', width : 200 },
                    { text : '플래그', datafield : 'flags', width : 200 },
                    { text : '인터페이스', datafield : 'iface', width : 200 }
                ]
        } , CtxMenu.NONE );
    },

    /** init data */
    initData: function() {
        routingTableStatus.searchRoutingTable();
    },

    /*=======================================================================================
    버튼 이벤트 처리
    ========================================================================================*/
    searchRoutingTable: function() {
        console.log("routingTable")
        HmGrid.updateBoundData($('#routingTableGrid'), ctxPath + '/main/sms/routingTableStatus/getRoutingTableList.do');
    },
    /** export Excel */
    exportExcel: function() {
        console.log("routingTable")
        HmUtil.exportGrid($('#routingTableGrid'), '라우팅 테이블', false);
    }
};


// $(function() {
//     routingTableStatus.initVariable();
//     routingTableStatus.observe();
//     routingTableStatus.initDesign();
//     routingTableStatus.initData();
// });