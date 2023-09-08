var TrfStat = {
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

        HmGrid.create( $("#trafficStatGrid") , {
            source: new $.jqx.dataAdapter({
                    datatype: 'json',
                    datafields: [
                        {name: 'perfType', type: 'number'},
                        {name: 'avgIn', type: 'number'},
                        {name: 'avgOut', type: 'number'},
                        {name: 'maxIn', type: 'number'},
                        {name: 'maxOut', type: 'number'},
                    ]
                }
            ),
            pageable: false,
            columns: [
                { text: '구분', datafield: 'perfType', width: '32%' },
                { text: 'IN', columngroup: 'avg', datafield: 'avgIn', width: '17%', cellsrenderer: HmGrid.unit1000renderer },
                { text: 'OUT', columngroup: 'avg', datafield: 'avgOut', width: '17%', cellsrenderer: HmGrid.unit1000renderer },
                { text: 'IN', columngroup: 'max', datafield: 'maxIn', width: '17%', cellsrenderer: HmGrid.unit1000renderer },
                { text: 'OUT', columngroup: 'max', datafield: 'maxOut', width: '17%', cellsrenderer: HmGrid.unit1000renderer },
            ],
            columnGroups: [
                { text: '평균', name: 'avg', align: 'center' },
                { text: '최대', name: 'max', align: 'center' }
            ]
        });

    },

    /** init data */
    initData: function() {

    },

    /** 조회 */
    search: function(params) {
        if(TrfStat.ajax) {
            TrfStat.ajax.abort();
        }

        TrfStat.ajax = Server.post('/main/tms3/rtTrafficMonit/getTrfStatList.do', {
            data: params,
            success: function(result) {
                if(result.length > 0){
                    TrfStat.searchResult(result);
                }else{
                    $('#trafficStatGrid').jqxGrid('clear');
                }
            }
        }, false);

    },

    searchResult: function(data) {
        HmGrid.setLocalData($('#trafficStatGrid'), data);
    }

};
TrfStat.initVariable();
TrfStat.observe();
TrfStat.initDesign();
TrfStat.initData();