
var $orderGrid;
var $startDate, $endDate;
var Main = {
    /** variable */
    initVariable: function () {
        $orderGrid = $('#orderGrid');
        $startDate = $('#date1');
        $endDate = $('#date2');
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
                Main.search();
                break;
            case 'btnAdd':
                Main.addOrder();
                break;
            case 'btnEdit':
                Main.editOrder();
                break;
            case 'btnDel':
                Main.delOrder();
                break;
            case 'btnExcel':
                Main.excelExport();
                break;
        }
    },

    /** init design */
    initDesign: function () {
        Main.createOrderGrid();
        Main.createSearchType();
    },

    /** init data */
    initData: function () {
        Main.search();
    },

    /* ======================================================================
        버튼 제어
     ====================================================================== */

    search: function () {
        HmGrid.updateBoundData($orderGrid, '/main/nms/spcOrder/getSpcOrderList.do');
    },

	addOrder: function () {
		$.post(ctxPath + '/main/popup/nms/pSpcOrderAdd.do',
            function(result) {
                HmWindow.open($('#pwindow'), '발주서 등록', result, 800, 784);
        });
    },

    editOrder: function () {
        var rowIdx = HmGrid.getRowIdx($orderGrid, '발주서를 선택해주세요.');
        if(rowIdx === false) return;

        var rowData = HmGrid.getRowData($orderGrid, rowIdx);
        var seqNo = rowData.seqNo;
        $.post(ctxPath + '/main/popup/nms/pSpcOrderEdit.do',
            function(result) {
                HmWindow.open($('#pwindow'), '발주서 수정', result, 800, 784, 'pwindow_init', {seqNo:seqNo});
        });
    },

    delOrder: function () {
        var rowIndexes = HmGrid.getRowIdxes($orderGrid, '발주서를 선택해주세요.');
        if(rowIndexes === false) return;

        if(!confirm('발주서를 삭제하시겠습니까?')) return;

        var _list = [];
         rowIndexes.forEach(function (idx) {
            var rowData = HmGrid.getRowData($orderGrid, idx);
            _list.push({seqNo:rowData.seqNo});
        });

        Server.post('/main/nms/spcOrder/delSpcOrder.do', {
            data: {list: _list},
            success: function (message) {
                alert(message);
                Main.search();
            }
        });
    },

    excelExport: function () {
        HmUtil.exportGrid($orderGrid, '발주서목록', false);
    },

    createOrderGrid: function () {
        HmGrid.create($orderGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function (data) {
                        $.extend(data, Main.getSearchParams());
                        return data;
                    },
                }
            ),
            width: '100%',
            editable: false,
            selectionmode: 'multiplerowsextended',
            columns: [
                {text: '번호', datafield: 'seqNo', width: 80, cellsalign: 'center'},
                {text: '소속', datafield: 'company', width: 200, cellsalign: 'center'},
                {text: '양식', datafield: 'companyEtc', width: 200, cellsalign: 'center'},
                {text: '회사구분', datafield: 'applicationForm', width: 200, cellsalign: 'center'},
                {text: '고객사', datafield: 'clientCompany', width: 200, cellsalign: 'center'},
                {text: '제목', datafield: 'name', minwidth: 200, cellsalign: 'center'},
                {text: '신청일자', datafield: 'date', width: 200, cellsalign: 'center'},
            ]
        }, CtxMenu.COMM);

        $orderGrid.on('rowdoubleclick', function (event) {
            var _seqNo = event.args.row.bounddata.seqNo;
            $.post(ctxPath + '/main/popup/nms/pSpcOrderDetail.do',
                function(result) {
                    HmWindow.open($('#pwindow'), '발주서 상세보기', result, 800, 680, 'pwindow_init', {seqNo: _seqNo});
            });
        })
    },

    createSearchType: function () {

        Main.createDropDownList($('#pr_company'), 'SPC_AFFILIATE');
        Main.createDropDownList($('#pr_company_etc'), 'SPC_PROVIDER');
        Main.createDropDownList($('#pr_application_form'), 'SPC_CONTRACTOR');


        $startDate.jqxDateTimeInput({ width: '110px', height: '21px', formatString: 'yyyy-MM-dd', theme: jqxTheme });
        $endDate.jqxDateTimeInput({ width: '110px', height: '21px', formatString: 'yyyy-MM-dd', theme: jqxTheme });

        var currDate = new Date();
        var currYear = currDate.getFullYear();
        var currMonth = currDate.getMonth();
        var currDay = currDate.getDate();

        $startDate.jqxDateTimeInput('setDate', new Date(currYear, currMonth-1, currDay));
        $endDate.jqxDateTimeInput('setDate', new Date(currYear, currMonth, currDay));
    },

    createDropDownList: function ($divId, type) {
        var params = { codeKind: type, useFlag: 1 };
        HmDropDownList.create($divId, {
            source: HmDropDownList.getSourceByUrl('/code/getCodeListByCodeKind.do', params),
            displayMember: 'codeValue1', valueMember: 'codeValue1', width:'120px',
        });
    },

    getSearchParams: function () {
        var params = {};

        params.name = $('#pr_name').val();
        params.company = $('#pr_company').val();
        params.companyEtc = $('#pr_company_etc').val();
        params.applicationForm = $('#pr_application_form').val();
        params.date1 = $startDate.val().replace(/-/g, '');
        params.date2 = $endDate.val().replace(/-/g, '');

        return params;
    },


};

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});