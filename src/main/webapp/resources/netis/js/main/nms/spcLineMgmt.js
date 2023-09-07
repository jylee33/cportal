var $lineGrid;
var Main = {
    /** variable */
    initVariable: function() {
        $lineGrid = $('#lineGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });

        $('.searchBox').keypress(function(e) {
            if (e.keyCode === 13) Main.search();
        });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case "btnSearch": this.search();	break;
            case 'btnAdd': this.addLine(); break;
            case 'btnEdit': this.editLine(); break;
            case 'btnDel': this.delLine(); break;
            case 'btnExcel': this.excelExport(); break;
        }
    },

    /** init design */
    initDesign: function() {
        HmGrid.create($lineGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        //필터 적용 위해 추가
                        {name: 'company', type: 'string'},
                        {name: 'institution', type: 'string'},
                        {name: 'area', type: 'string'},
                        {name: 'ifSortation', type: 'string'},
                        {name: 'ifStatus', type: 'string'},
                        {name: 'ifNo', type: 'string'},
                        {name: 'ifIp', type: 'string'},
                        {name: 'userNo', type: 'string'},
                        {name: 'user', type: 'string'},
                        {name: 'add', type: 'string'},
                        {name: 'userTransferred', type: 'string'},
                        {name: 'costSortation', type: 'string'},
                        {name: 'providers', type: 'string'},
                        {name: 'contractor', type: 'string'},
                        {name: 'discountRate', type: 'string'},
                        {name: 'cost', type: 'string'},
                        {name: 'openDate', type: 'string'},
                        {name: 'add1', type: 'string'},
                        {name: 'work', type: 'string'},
                        {name: 'npcNo', type: 'string'},
                        {name: 'speed', type: 'string'},
                        {name: 'serialIp', type: 'string'},
                        {name: 'serialIp1', type: 'string'},
                        {name: 'memo', type: 'string'},
                        //grid 에서 따로 표현하지 않는 값
                        {name: 'companyCode', type: 'string'},
                        {name: 'ifSortationCode', type: 'string'},
                        {name: 'areaCode', type: 'string'},
                        {name: 'ifStatusCode', type: 'string'},
                        {name: 'costSortationCode', type: 'string'},
                        {name: 'providersCode', type: 'string'},
                        {name: 'constractorCode', type: 'string'},
                        {name: 'speedCode', type: 'string'},
                        {name: 'seqNo', type: 'number'},
                    ]
                },
                {
                    formatData: function(data) {
                        data.ifIp = $('#s_ifIp').val();
                        data.company = $('#s_company').val();
                        data.area = $('#s_area').val();
                        data.ifSortation = $('#s_ifSortation').val();
                        data.ifSatus = $('#s_ifstatus').val();
                        return data;
                    },
                }
            ),
            width: '100%',
            editable: false,
            selectionmode: 'multiplerowsextended',
            columns: [
                { text: '소속', datafield: 'company', width: 150, cellsalign: 'center' },
                { text: '기관명', datafield: 'institution', width: 150, cellsalign: 'center' },
                { text: '지역', datafield: 'area', width: 150, cellsalign: 'center' },
                { text: '회선구분', datafield: 'ifSortation', width: 150, cellsalign: 'center' },
                { text: '회선상태', datafield: 'ifStatus', width: 150, cellsalign: 'center' },
                { text: '회선번호/ID', datafield: 'ifNo', width: 150, cellsalign: 'center' },
                { text: '회선IP', datafield: 'ifIp', width: 150, cellsalign: 'center' },
                { text: '담당자TEL', datafield: 'userNo', width: 150, cellsalign: 'center' },
                { text: '담당자명', datafield: 'user', width: 150, cellsalign: 'center' },
                { text: '상위국주소', datafield: 'add', width: 300, cellsalign: 'center' },
                { text: '작업이관자', datafield: 'userTransferred', width: 150, cellsalign: 'center' },
                { text: '비용구분', datafield: 'costSortation', width: 150, cellsalign: 'center' },
                { text: '제공사', datafield: 'providers', width: 150, cellsalign: 'center' },
                { text: '계약사', datafield: 'contractor', width: 150, cellsalign: 'center' },
                { text: '할인율(%)', datafield: 'discountRate', width: 150, cellsalign: 'center' },
                { text: '비용[₩]', datafield: 'cost', width: 150, cellsalign: 'center' },
                { text: '개통일자', datafield: 'openDate', width: 150, cellsalign: 'center' },
                { text: '하위국주소', datafield: 'add1', width: 150, cellsalign: 'center' },
                { text: '업무', datafield: 'work', width: 150, cellsalign: 'center' },
                { text: 'NPC번호', datafield: 'npcNo', width: 150, cellsalign: 'center' },
                { text: '속도/CLOCK', datafield: 'speed', width: 150, cellsalign: 'center' },
                { text: 'SERIAL IP', datafield: 'serialIp', width: 150, cellsalign: 'center' },
                { text: 'SERIAL IP(하위)', datafield: 'serialIp1', width: 150, cellsalign: 'center' },
                { text: '비고', datafield: 'memo', width: 150, cellsalign: 'center' },
            ]
        }, CtxMenu.COMM);

        Main.createDropDownList($('#s_company'), 'SPC_AFFILIATE');
        Main.createDropDownList($('#s_area'), 'SPC_LOCATION');
        Main.createDropDownList($('#s_ifSortation'), 'SPC_LINETYPE');
        Main.createDropDownList($('#s_ifStatus'), 'SPC_LINESTATUS');

        $lineGrid.on('rowdoubleclick', function (event) {
            var rowData = event.args.row.bounddata;
            Main.showSpcDetail(rowData);
        })
    },

    /** init data */
    initData: function() {
        Main.search();
    },

    search: function() {
        HmGrid.updateBoundData($lineGrid, '/main/nms/spcLineMgmt/getSpcLineList.do');
    },

    /** 상세 */
    showSpcDetail: function (rowData) {
        $.post(ctxPath + '/main/popup/nms/pSpcLineDetail.do', { seqNo: rowData.seqNo },
            function(result) {
                HmWindow.open($('#pwindow'), '선번 상세', result, 800, 525, 'param_init', rowData);
        });
    },


    /** 추가 */
    addLine: function() {
        $.post(ctxPath + '/main/popup/nms/pSpcLineAdd.do',
            function(result) {
                HmWindow.open($('#pwindow'), '선번 등록', result, 800, 600);
        });
    },

    /** 수정 */
    editLine: function(){
        var rowIdx = HmGrid.getRowIdx($lineGrid, '선번을 선택해주세요.');
        if(rowIdx === false) return;
        var rowData = $lineGrid.jqxGrid('getrowdata', rowIdx);
        $.post(ctxPath + '/main/popup/nms/pSpcLineEdit.do', { seqNo: rowData.seqNo },
            function(result) {
                HmWindow.open($('#pwindow'), '선번 수정', result, 800, 650, 'param_init', rowData);
        });
    },

    /** 삭제 */
    delLine: function(){

        var rowIdxes = HmGrid.getRowIdxes($lineGrid);
        if(rowIdxes === false) {
            alert('선번을 선택해주세요.');
            return;
        }

        if(!confirm('삭제하시겠습니까?')) return;

        var _list = [];
        rowIdxes.forEach(function (item) {
            var rowData = HmGrid.getRowData($lineGrid, item);
            _list.push({seqNo:rowData.seqNo});
        });

        Server.post('/main/nms/spcLineMgmt/delSpcLineList.do', {
            data: {list: _list},
            success: function (result) {
                alert(result);
                Main.search();
            }
        })
    },
    
    excelExport: function () {
        HmUtil.exportGrid($lineGrid, '선번장관리', false);
    },

    /** code list 생성 */
    createDropDownList: function ($divId, type) {
        var params = { codeKind: type, useFlag: 1 };
        HmDropDownList.create($divId, {
            source: HmDropDownList.getSourceByUrl('/code/getCodeListByCodeKind.do', params),
            displayMember: 'codeValue1', valueMember: 'codeId',  width: '100px'
        });
    },
};

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});