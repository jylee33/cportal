var $infoGrid;


var Main = {
    /** variable */
    initVariable: function () {

        $infoGrid = $("#infoGrid");

        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_nps_srch_type2'));

    },

    /** add event */
    observe: function () {

        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });

    },


    /** event handler */
    eventControl: function (event) {

        var curTarget = event.currentTarget;

        switch (curTarget.id) {

            case 'btnSearch':
                this.search();
                break;

            case 'btnExcel':
                this.exportExcel();
                break;

        }
    },

    /** init design */
    initDesign: function () {


        HmDate.create($('#sDate1'), $('#sDate2'), HmDate.DAY, 14, HmDate.FS_SHORT);


        HmGrid.create($infoGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'POST',
                    contentType: 'application/json; charset=UTF-8',
                    updaterow: function (rowid, rowdata, commit) {
                        if (editSubsIds.indexOf(rowid) == -1)
                            editSubsIds.push(rowid);
                        commit(true);
                    },
                },
                {
                    formatData: function (data) {
                        $.extend(data, Main.getCommParams());

                        console.dir(data);

                        return JSON.stringify(data);
                    }
                }
            ),
            columns:
                [
                    {
                        text: 'No.',
                        datafield: '',
                        width: 50,
                        cellsrenderer: HmGrid.rownumrenderer,
                        cellsalign: 'right',
                        columntype: 'number'
                    },
                    {text: '신청번호', datafield: 'appNo', cellsAlign: 'center', width: '15%'},
                    {text: '이용기관', datafield: 'agncNm', minwidth: '10%'},
                    {text: '주소', datafield: 'agncAddr', cellsAlign: 'center', width: '15%'},
                    {text: '신청일', datafield: 'appYmd', cellsAlign: 'center', width: '10%'},
                    {text: '개통희망일', datafield: 'wishYmd', cellsAlign: 'center', width: '10%'},
                    {text: '개통완료일', datafield: 'endYmd', cellsAlign: 'center', width: '10%'},
                    {
                        text: '신청구분',
                        datafield: 'appKindCd',
                        displayfield: 'disAppKindCd',
                        cellsAlign: 'center',
                        width: '10%'
                    },
                    {text: '처리상태', datafield: 'appStatCd', displayfield: 'disAppStatCd', width: '10%'}
                    // { text : '속도', datafield : 'svcLineSpeed', displayfield: 'disSvcLineSpeed', cellsrenderer: HmGrid.unit1000renderer, width : 120}
                ]
        });

        HmGrid.updateBoundData($infoGrid, ctxPath + '/edu/sla/appMgmt/getSlaAppList.do');
    },

    /** init data */
    initData: function () {
    },


    search: function () {

        HmGrid.updateBoundData($infoGrid, ctxPath + '/edu/sla/appMgmt/getSlaAppList.do');

    },

    /** export Excel */
    exportExcel: function () {

        HmUtil.exportGrid($infoGrid, 'SLA 개통 현황', false);

    },

    getCommParams: function () {

        var params = {
            period: 'true',
            date1: HmDate.getDateStr($('#sDate1')),
            date2: HmDate.getDateStr($('#sDate2')),
        };

        $.extend(params, HmBoxCondition.getCamelCaseSrchParams());

        return params;
    },


};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});