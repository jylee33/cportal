var $sessStatusGrid;
var editUserIds = [];
var userId;
var userName;
var sessStatus = {

    initialize : function() {
        this.initVariable();
        this.observe();
        this.initDesign();
        this.initData();
    },

    /** variable */
    initVariable: function() {
        $sessStatusGrid = $('#sessStatusGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { sessStatus.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case "btnSearch_sess": this.searchSessStatus(); break;
        }
    },

    /** init design */
    initDesign: function() {

        HmGrid.create($sessStatusGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    updaterow: function(rowid, rowdata, commit) {
                        if(editUserIds.indexOf(rowid) == -1)
                            editUserIds.push(rowid);
                        commit(true);
                    },
                },
                {
                    formatData: function (data) {
                        $.extend(data, {
                            mngNo: dtl_mngNo
                        });
                        return data;
                    }
                },
            ),
            height: 200,
            autoheight: true,
            showtoolbar: false,
            scrollbarsize: -1,
            pageable: false,
            columns:
                [
                    {
                        text: '프로토콜',
                        datafield: 'PROTOCOL',
                        width: '16.6%',
                        align: 'center'
                    },
                    {
                        text: 'IP',
                        datafield: 'LOCAL_ADDRESS',
                        width: '16.6%',
                        align: 'center'
                    },
                    {
                        text: '포트',
                        datafield: 'LOCAL_PORT',
                        width: '16.7%',
                        filtertype: 'number',
                    },
                    {
                        text: '외부 IP',
                        datafield: 'FOREIGN_ADDRESS',
                        width: '16.7%',
                        filtertype: 'number',
                    },
                    {
                        text: '외부 포트',
                        datafield: 'FOREIGN_PORT',
                        width: '16.7%',
                        filtertype: 'number'
                    },
                    {
                        text: '상태',
                        datafield: 'STATE',
                        width: '16.7%',
                        filtertype: 'number'
                    }
                ]
        } , CtxMenu.NONE );

    },

    /** init data */
    initData: function() {
        sessStatus.searchSessStatus();
    },

    /*=======================================================================================
    버튼 이벤트 처리
    ========================================================================================*/
    searchSessStatus: function() {
        HmGrid.updateBoundData($sessStatusGrid, ctxPath + '/main/sms/tcpSess/getSessStatusList.do');
    },

};
