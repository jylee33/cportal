var RtEvt = {
    ajax: null,

    /** variable */
    initVariable: function() {

    },

    /** add event */
    observe: function() {

    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
        }
    },

    /** init design */
    initDesign: function() {


        HmGrid.create($("#rtEvtGrid"), {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields:[ // 필터위해 추가
                        { name: '', type: 'number' },
                        { name:'SEQ_NO', type:'int' },
                        { name:'GRP_NAME', type:'string' },
                        { name:'SRC_NAME', type:'string' },
                        { name:'SRC_IP', type:'string' },
                        { name:'SRC_TYPE', type:'int' }, //구분 (동일, 학습)
                        { name:'SRC_TYPE_STR', type:'int' }, //구분 (동일, 학습)
                        { name:'PROGRESS_STATE', type:'string' }, //방향 IN OUT
                        { name:'EVT_CAUSE', type:'string' }, //이벤트분류
                        { name:'RECEIPT_MEMO', type:'string' }, //공격량
                        { name:'STATUS', type:'string' }, //상태
                        { name:'YMDHMS', type:'string' }, //탐지 시각

                        // { name:'detectPriorty', type:'int' },
                        // { name:'evtCause', type:'int' }, //프로토콜 타입
                        // { name:'custSpeedPer', type:'string' }, //대역폭


                    ]
                },
            ),
            pagerheight: 27,
            selectionmode: 'multiplerowsadvanced',
            pagerrenderer : HmGrid.pagerrenderer,
            rowsheight : 37,
            columns:
                [
                    {
                        text: '#', sortable: false, filterable: false, editable: false,
                        groupable: false, draggable: false, resizable: false,
                        datafield: '', columntype: 'number', width: 35,
                        cellsrenderer: function (row, column, value) {
                            return "<div style='margin-top:11px;text-align: center;'>" + (value + 1) + "</div>";
                        }
                    },
                    // { text : '순위',  datafield: 'detectPriorty', width: 50  },
                    { text : '이벤트 번호',  datafield: 'SEQ_NO', width: 100  , hidden : true },
                    { text : '그룹 이름',  datafield: 'GRP_NAME', width: 150 ,  cellsalign: 'center' },
                    { text : '이벤트명',  datafield: 'SRC_NAME', width: 140 , cellsalign: 'center' },
                    { text : '타켓 IP',  datafield: 'SRC_IP', width: 140 , cellsalign: 'center' },
                    { text : '구분',  datafield: 'SRC_TYPE_STR', width: 140 , cellsalign: 'center' },
                    { text : '방향',  datafield: 'PROGRESS_STATE', width: 140 , cellsalign: 'center' },
                    { text : '이벤트 분류',  datafield: 'EVT_CAUSE', width: 140 , cellsalign: 'center' }, //프로토콜 타입
                    { text : '공격량',  datafield: 'RECEIPT_MEMO', width: 140 , cellsalign: 'center' ,
                        cellsrenderer: function(row, column, value, rowData) {
                            var cell = '<div style="text-align: center; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
                            cell += (value == null || value.length == 0) ? value : HmUtil.convertUnit1000(value);
                            cell += '</div>';
                            return cell;
                        }
                    },
                    // { text : '대역폭',  datafield: 'custSpeedPer', width: 120 , cellsalign: 'center' },
                    { text : '상태',  datafield: 'STATUS', width: 140 , cellsalign: 'center' },
                    { text : '탐지 시각',  datafield: 'YMDHMS', cellsalign: 'center' },

                ],

        }, CtxMenu.COMM);
        // }, CtxMenu.RTMS);
    },

    /** init data */
    initData: function() {

    },

    /** 조회 */
    search: function(params) {
        if(RtEvt.ajax) {
            RtEvt.ajax.abort();
        }

        RtEvt.ajax = Server.post('/main/tms3/rtTrafficMonit/getRtTrfEvt.do', {
            data: params,
            success: function(result) {
                if(result.length > 0){
                    RtEvt.searchResult(result);
                }else{
                    $('#rtEvtGrid').jqxGrid('clear');
                }
            }
        }, false);

    },

    searchResult: function(data) {
        HmGrid.setLocalData($('#rtEvtGrid'), data);
    }

};
RtEvt.initVariable();
RtEvt.observe();
RtEvt.initDesign();
RtEvt.initData();