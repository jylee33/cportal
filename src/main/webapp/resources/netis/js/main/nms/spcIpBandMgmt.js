var $ipGrid;
var Main = {
    /** variable */
    initVariable: function() {
        $ipGrid = $('#ipGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case "btnSearch": this.search();	break;
            case 'btnAdd': this.addIp(); break;
            case 'btnEdit': this.editIp(); break;
            case 'btnDel': this.delIp(); break;
            case 'btnExcel': this.excelExport(); break;
        }
    },

    /** init design */
    initDesign: function() {
        HmGrid.create($ipGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        { name:'seqNo', type:'number' },
                        { name:'sortation', type:'string' },
                        { name:'company', type:'string' },
                        { name:'ipAddress', type:'string' },
                        { name:'userNo', type:'string' },
                        { name:'memo', type:'string' },
                        { name:'ipRelevant', type:'number' },
                        { name:'ipAdd', type:'string' },
                        { name:'prefix', type:'string' },
                        { name:'startIp', type:'string' },
                    ]
                },
                {
                    formatData: function(data) {
                        data.seqNo = $('#pSeqNo').val();
                        return data;
                    },
                }
            ),
            width: '100%',
            editable: false,
            selectionmode: 'multiplerowsextended',
            columns: [
                { text: '구분', datafield: 'sortation', width: 200, cellsalign: 'center' },
                { text: 'IP대역명', datafield: 'company', width: 200, cellsalign: 'center' },
                { text: 'IP대역', datafield: 'ipAddress', width: 120, cellsalign: 'center' },
                { text: '담당자', datafield: 'user', width: 120, cellsalign: 'center' },
                { text: '연락처', datafield: 'userNo', width: 120, cellsalign: 'center' },
                { text: '비고', datafield: 'memo', minwidth: 150, cellsalign: 'center' },
                { text: 'IP수량', datafield: 'ipRelevant', width: 80, cellsalign: 'right' },
                { text: 'IP ADD', datafield: 'ipAdd', width: 120, cellsalign: 'center' },
                { text: 'Prefix', datafield: 'prefix', width: 80, cellsalign: 'center' },
                { text: '시작IP', datafield: 'startIp', width: 120, cellsalign: 'center' },
            ]
        }, CtxMenu.COMM);

        $ipGrid.on('rowdoubleclick', function (event) {
            var rowData = event.args.row.bounddata;
            Main.showIpDetail(rowData);
        });
    },

    /** init data */
    initData: function() {
        this.search();
    },

    search: function() {
        HmGrid.updateBoundData($ipGrid, '/main/nms/ipBandMgmt/getIpBandList.do');
    },

    /** 상세 */
    showIpDetail: function (rowData) {
        $.post(ctxPath + '/main/popup/nms/pIpBandDetail.do', { seqNo: rowData.seqNo },
            function(result) {
                HmWindow.open($('#pwindow'), 'IP 대역 상세', result, 950, 600);
        });
    },

    /** 추가 */
    addIp: function() {
        $.post(ctxPath + '/main/popup/nms/pIpBandAdd.do',
            function(result) {
                HmWindow.open($('#pwindow'), 'IP 대역 등록', result, 600, 208);
        });
    },

    /** 수정 */
    editIp: function(){
        var rowIdx = HmGrid.getRowIdx($ipGrid, 'IP 대역을 선택해주세요.');
        if(rowIdx === false) return;
        var rowData = $ipGrid.jqxGrid('getrowdata', rowIdx);

        $.post(ctxPath + '/main/popup/nms/pIpBandEdit.do', { seqNo: rowData.seqNo },
            function(result) {
                HmWindow.open($('#pwindow'), 'IP 대역 수정', result, 600, 208);
        });
    },

    /** 삭제 */
    delIp: function(){

        var rowIdx = HmGrid.getRowIdx($ipGrid, 'IP 대역을 선택해주세요.');
        if(rowIdx === false) return;

        if(!confirm('기존 IP 대역으로 생성된 IP 모두 삭제됩니다.\nIP 대역을 삭제하시겠습니까?')) return;

        var rowData = $ipGrid.jqxGrid('getrowdata', rowIdx);

        Server.post('/main/nms/ipBandMgmt/delIpBand.do', {
            data: { seqNo: rowData.seqNo, pSeqNo: rowData.seqNo },
            success: function (result) {
                alert(result);
                Main.search();
            }
        })
    },
    
    excelExport: function () {
        HmUtil.exportGrid($ipGrid, 'IP대장관리', false);
    },
};

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});