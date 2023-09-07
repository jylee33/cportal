var RtEvtStat = {
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

        HmGrid.create($("#rtEvtStatGrid"), {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields:[ // 필터위해 추가
                        { name: '', type: 'number' },
                        { name:'EVT_CNT', type:'int' },
                        { name:'SRC_NAME', type:'string' },
                    ]
                },
            ),
            pageable: false,
            columns:
                [
                    {
                        text: '#', sortable: false, filterable: false, editable: false,
                        groupable: false, draggable: false, resizable: false,
                        datafield: '', columntype: 'number', width: '5%',
                        cellsrenderer: function (row, column, value) {
                            return "<div style='margin-top:11px;text-align: center;'>" + (value + 1) + "</div>";
                        }
                    },
                    { text : '이벤트 구분',  datafield: 'SRC_NAME',  width: '65%' , cellsalign: 'center' },
                    { text : '발생 건수',  datafield: 'EVT_CNT',  width: '30%'  ,cellsalign: 'center' },
                ],

        });
    },

    /** init data */
    initData: function() {

    },

    /** 조회 */
    search: function(params) {
        if(RtEvtStat.ajax) {
            RtEvtStat.ajax.abort();
        }

        RtEvtStat.ajax = Server.post('/main/tms2/rtTrafficMonit/getRtTrfEvtStat.do', {
            data: params,
            success: function(result) {
                if(result.length > 0){
                    RtEvtStat.searchResult(result);
                }else{
                    $('#rtEvtStatGrid').jqxGrid('clear');
                }
            }
        }, false);

    },

    searchResult: function(data) {
        HmGrid.setLocalData($('#rtEvtStatGrid'), data);
    }

};
RtEvtStat.initVariable();
RtEvtStat.observe();
RtEvtStat.initDesign();
RtEvtStat.initData();