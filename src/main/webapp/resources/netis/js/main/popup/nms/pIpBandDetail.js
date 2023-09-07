var $ipDetailGrid;
var editIdxList = [];
var PMain = {
    /** variable */
    initVariable: function() {
        $ipDetailGrid = $('#ipDetailGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { PMain.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnSave':
                PMain.save();
                break;
            case 'btnClose':
                PMain.close();
                break;
        }
    },

    /** init design */
    initDesign: function() {
        HmGrid.create($ipDetailGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        { name:'seqNo', type:'number' },
                        { name:'department', type:'string' },
                        { name:'user', type:'string' },
                        { name:'realIp', type:'string' },
                        { name:'natIp', type:'string' },
                        { name:'subnetMask', type:'string' },
                        { name:'sortation', type:'number' },
                        { name:'memo', type:'string' },
                    ],
					updaterow: function (rowid, rowdata, commit) {
                        if(editIdxList.indexOf(rowid) === -1) {
                            editIdxList.push(rowid);
                        }
					    commit(true);
					}
                },
                {
                    formatData: function(data) {
                        data.pSeqNo = $('#seqNo').val();
                        return data;
                    },
                }
            ),
            width: '100%',
            editable: true,
            columns: [
                { text: 'No.', datafield: 'no', width: 50, cellsalign: 'center' , editable: false, cellsrenderer: HmGrid.rownumrenderer, filterable: false},
                { text: '부서', datafield: 'department', width: 100, cellsalign: 'center' },
                { text: '담당자', datafield: 'user', width: 80, cellsalign: 'center' },
                { text: 'IP주소', datafield: 'realIp', width: 150, cellsalign: 'center', editable: false },
                { text: 'Nat IP', datafield: 'natIp', width: 150, cellsalign: 'center' },
                { text: 'Subnet Mask', datafield: 'subnetMask', minwidth: 150, cellsalign: 'center', editable: false },
                { text: '용도', datafield: 'sortation', width: 100, cellsalign: 'center' },
                { text: '비고', datafield: 'memo', width: 150, cellsalign: 'center' }
            ]
        }, CtxMenu.COMM);
    },

    /** init data */
    initData: function() {
        this.search();
    },

    search: function () {
        HmGrid.updateBoundData($ipDetailGrid, '/main/nms/ipBandMgmt/getIpBandDetailList.do');
    },

    save: function () {

        var _list = [];
        $.each(editIdxList, function (idx, item) {
            var rowData = HmGrid.getRowData($ipDetailGrid, item);
            _list.push(rowData);
        });

        Server.post('/main/nms/ipBandMgmt/editIpBandDetail.do', {
            data: { list: _list },
            success: function (result) {
                alert(result);
                PMain.search();
            }
        });
    },

    close: function () {
        $('#pwindow').jqxWindow('close');
    },
};
$(function() {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});