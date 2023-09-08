var $slaGrid;
var editSlaIds = []
var Main = {
    /** variable */
    initVariable: function() {
        $slaGrid = $('#slaGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
        $('#chkDayAll').on('change', function(event) {
            $('#cbFromDay, #cbToDay').jqxDropDownList({ disabled: $(this).is(':checked') });
        });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnSearch': this.searchSLA(); break;
            case 'btnMPlus': this.addMultiSLA(); break;
            case 'btnSave': this.editSLA(); break;
            case "btnExcel": this.exportExcel(); break;
            case 'btnDel': this.delSla(); break;
        }
    },

    /** init design */
    initDesign: function() {

        $('#mainSplitter').jqxSplitter({ width: '99.8%', height: '99.8%', orientation: 'vertical', theme: jqxTheme, panels: [{ size: 254, collapsible: true }, { size: '100%' }] });
        $('#dGrpTreeGrid').on('bindingComplete', function() {
            try {
                $('#dGrpTreeGrid').jqxTreeGrid('setCellValue', 1, 'grpName', '인터넷서비스');
            } catch(e) {}
        });

        Master.createGrpTab2(Main.searchSLA);

        $('#date1').jqxDateTimeInput({ width: 120, height: 21, theme: jqxTheme, formatString: 'yyyy년 MM월', showCalendarButton: false });
        $('#date1').val(new Date());

        var s = [
            { label: '전체',	value: 'ALL' },
            { label: 'KT',	value: 'KT' },
            { label: 'LG',	value: 'LG' },
            { label: 'SK',	value: 'SK' }
        ];

        $('#cbWireless').jqxDropDownList({ selectedIndex: 0, source: s, theme: jqxTheme, width: 100, height: 21,
            autoDropDownHeight: true });
        // $('#sSvcType').jqxDropDownList({selectedIndex: 0, theme: jqxTheme, width: 150, height: 21, autoDropDownHeight: true,
        // 	source: [
        //        {label: '인터넷서비스', value: 'A'},
        //        {label: '회선서비스', value: 'B'},
        //        {label: '무선서비스', value: 'F'},
        //        {label: '응용서비스', value: 'E'}
        // 	]
        // });

        HmGrid.create($slaGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function(data) {
                        $.extend(data, Main.getCommParams());
                        console.log(JSON.stringify(data));

                        return data;
                    },
                    updaterow: function (rowid, rowdata, commit) {
                        Main.compensationCheck(rowdata);

                        if(editSlaIds.indexOf(rowid) == -1){
                            editSlaIds.push(rowid);
                        }
                        commit();
                    }
                }
            ),
            editable: true,
            columns:
                [
                    { text : '교육청', datafield : 'college', width : 150, editable: false },
                    // { text : '지원청', datafield : 'collegeNia', minwidth : 150, editable: false },
                    { text : '기관명', datafield : 'grpName', minwidth : 250, editable: false },
                    // { text : '장비명', datafield : 'devName', minwidth: 130, editable: false },
                    { text : '통신사', datafield : 'wireServiceName', width: 80, cellsalign: 'center', editable: false },
                    { text : '통신사 관리번호', datafield : 'asgnNo', width : 150, cellsalign: 'center',editable: false },
                    { text : '서비스명', datafield : 'disSvcType', width: 100, editable: false },
                    { text : '신청대역폭', datafield : 'userLineWidth', width: 100, editable: false, cellsrenderer: HmGrid.unit1000renderer },
                    { text : '대상년월', datafield : 'month', width: 80, cellsalign: 'center', editable: false },
                    { text : '월 이용료', datafield : 'monthCost', width: 100, cellsalign: 'right', cellsformat: 'n', editable: false  },
                    { text : '보상금액', datafield : 'reward', width: 100, cellsalign: 'right', cellsformat: 'n', editable: false  },
                    { text : '기준', datafield : 'defAvailability', columngroup: 'availability', width: 80, cellsalign: 'center', editable: false },
                    { text : '측정', datafield : 'availability', columngroup: 'availability', width: 80, cellsalign: 'center',
                        cellvaluechanging: function (row, datafield, columntype, oldvalue, newvalue) {
                            if (newvalue == '')
                                return '-';
                        },
                    },
                    { text : '보상일', datafield : 'availabilityDay', columngroup: 'availability', width: 80, cellsalign: 'center', editable: false
                    },
                    { text : '기준', datafield : 'defLossRate', columngroup: 'lossRate', width: 80, cellsalign: 'center', editable: false },
                    { text : '측정', datafield : 'lossRate', columngroup: 'lossRate', width: 80, cellsalign: 'center',
                        cellvaluechanging: function (row, datafield, columntype, oldvalue, newvalue) {
                            if (newvalue == '')
                                return '-';
                        },
                    },
                    { text : '보상일', datafield : 'lossRateDay', columngroup: 'lossRate', width: 80, cellsalign: 'center', editable: false
                    },
                    { text : '기준', datafield : 'defDelay', columngroup: 'delay', width: 80, cellsalign: 'center', editable: false },
                    { text : '측정', datafield : 'delay', columngroup: 'delay', width: 80, cellsalign: 'center',
                        cellvaluechanging: function (row, datafield, columntype, oldvalue, newvalue) {
                            if (newvalue == '')
                                return '-';
                        },
                    },
                    { text : '보상일', datafield : 'delayDay', columngroup: 'delay', width: 80, cellsalign: 'center', editable: false },
                    { text : '보고서', datafield : 'isAttachFile', width: 80, cellsalign: 'center', editable: false,
                        cellsrenderer: function (row, datafield, value) {
                            return '<div id="btnInfo' +  row + '" class="rpt ' + (value > 0? 'rpt_upload' : 'rpt_none') + ' jqx-center-align">' +
                                '<div class="rptText" onclick="Main.reportMgmt('+row+')">보고서</div>' +
                                '</div>';
                        }
                    },
                    { text : '등록자', datafield : 'lastUserName', width: 120, cellsalign: 'center', editable: false },
                    { text : '등록일시', datafield : 'lastUpd', width: 160, cellsalign: 'center', editable: false }
                ],
            columngroups:
                [
                    { text: '가용성(미만 보상)', align: 'center', name: 'availability' },
                    { text: '손실률(초과 보상)', align: 'center', name: 'lossRate' },
                    { text: '지연(초과 보상)', align: 'center', name: 'delay' }
                ]
        }, CtxMenu.COMM);
    },

    /** init data */
    initData: function() {

    },

    reportCellclass: function(row, columnfield, value) {
        var row = $slaGrid.jqxGrid('getrowdata', row);
        return row.isAttachFile == 1? 'slaState6' : null;
    },

    getCommParams: function() {
        var params = Master.getGrpTabParams();
        var yyyy = $.format.date($('#date1').jqxDateTimeInput('getDate'), 'yyyy');
        var mm = $.format.date($('#date1').jqxDateTimeInput('getDate'), 'MM');
        params.wireServiceName = $('#cbWireless').val();
        // params.svcType = $('#sSvcType').val();
        if(mm == '01') {
            params.lastMonth = null;
        }
        else {
            params.lastMonth = parseInt(mm) - 1 < 10? '0' + (parseInt(mm)-1) : parseInt(mm) -1;
        }
        params.yyyy = yyyy;
        params.thisMonth = $.format.date($('#date1').jqxDateTimeInput('getDate'), 'MM');
        return params;
    },

    /** 조회 */
    searchSLA: function() {
        HmGrid.updateBoundData($slaGrid, ctxPath + '/main/sla/qcSla/getQcSlaList.do');
    },


    /** 장애이력에서 잘못 체크한 항목을 삭제하기 위함  */
    delSla : function(){
        var rowData = HmGrid.getRowData($slaGrid);
        if(rowData == null){
            alert('삭제할 SLA를 선택해 주세요.');
            return;
        }
        if(!confirm('정말 삭제하시겠습니까? 입력한 데이터는 모두 삭제됩니다.')) return;


        var params ={
            asgnNo : rowData.asgnNo,
            yyyymm : (rowData.month).replace('-','')
        }
        Server.post('/main/sla/qcSla/delQcSla.do', {
            data: params,
            success: function(result) {
//					$slaGrid.jqxGrid('deleterow', rowData.uid);
                Main.searchSLA();
                alert('삭제되었습니다.');
            }
        });
    },

    /** export Excel */
    exportExcel: function() {
        var params = Main.getCommParams();
        HmUtil.exportExcel(ctxPath + '/main/sla/qcSla/export.do', params);
    },

    editSLA: function(){
        if(editSlaIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(editSlaIds, function(idx, value) {

            var rowData = $slaGrid.jqxGrid('getrowdatabyid', value)
            var params ={
                asgnNo : rowData.asgnNo,
                yyyymm : (rowData.month).replace('-',''),
                availability : rowData.availability,
                lossRate : rowData.lossRate,
                delay : rowData.delay
            }
            _list.push(params);
        });

        Server.post('/main/sla/qcSla/saveQcSla.do', {
            data: { list: _list },
            success: function(data) {
                alert('저장되었습니다.');
                editSlaIds = [];
            }
        });

    },

    addMultiSLA: function(){

        var data = $slaGrid.jqxGrid('getrows');
        var yyyyMM = $.format.date($('#date1').jqxDateTimeInput('getDate'), 'yyyyMM');

        $.post(ctxPath + '/main/popup/sla/pQcSlaMultiAdd.do',
            {month: yyyyMM},
            function(result) {
                HmWindow.open($('#pwindow'), '품질 측정 정보 일괄 입력', result, 700, 600, 'pwindow_init', {cnt: data.length});
            }
        );

    },

    compensationCheck: function(rowdata){
        var monthCost = rowdata.monthCost;

        if(rowdata.availability != '-'){
            if(parseFloat(rowdata.defAvailability) > parseFloat(rowdata.availability)){
                rowdata.availabilityDay = '1일';
            }else{
                rowdata.availabilityDay = '-';
            }
        }
        if(parseFloat(rowdata.defLossRate) < parseFloat(rowdata.lossRate)){
            if(parseFloat(rowdata.defDelay) < parseFloat(rowdata.delay)){
                rowdata.lossRateDay = '-';
            }else{
                rowdata.lossRateDay = '1일';
            }
        }else{
            rowdata.lossRateDay = '-';
        }

        if(rowdata.delay != '-'){
            if(parseFloat(rowdata.defDelay) < parseFloat(rowdata.delay)){
                rowdata.delayDay = '1일'
            }else{
                rowdata.delayDay = '-';
            }
        }


        var aC = rowdata.availabilityDay == '1일' ? 1:0;
        var lC = rowdata.lossRateDay == '1일' ? 1:0;
        var dC = rowdata.delayDay == '1일' ? 1:0;

        if(monthCost == '0'){
            rowdata.reward = 0;
        }else{
            rowdata.reward = (monthCost/30)* (aC+lC+dC);
        }
    },

    reportMgmt: function(row) {
        var data = $slaGrid.jqxGrid('getrowdata', row);

        $.post(ctxPath + '/main/popup/sla/pReportMgmt.do',
            {asgnNo: data.asgnNo, yyyymm: (data.month).replace('-','') },
            function(result) {
                HmWindow.open($('#pwindow'), '품질 측정 보고서 관리', result, 400, 220, 'pwindow_init', {data: data});
            }
        );
    }

};


$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});