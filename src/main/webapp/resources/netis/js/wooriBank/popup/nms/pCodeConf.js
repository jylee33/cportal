var $mainCodeGrid, $subCodeGrid;
var selectedMainGridRowIdx;

$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});


var PMain = {
    /** Initialize */
    initVariable: function () {
        $mainCodeGrid = $('#mainCodeGrid');
        $subCodeGrid = $('#subCodeGrid');
    },

    /** Event Object */
    observe: function () {
        $("button").bind("click", function (event) {
            PMain.eventControl(event);
        });
    },

    /** Event Control Function */
    eventControl: function (event) {
        switch (event.currentTarget.id) {
            case 'btnAddMainCode': this.addMainCode(); break;
            case 'btnDelMainCode': this.delMainCode(); break;
            case 'btnAddSubCode': this.addSubCode(); break;
            case 'btnDelSubCode': this.delSubCode(); break;
        }
    },
    /** Init Design */
    initDesign: function () {
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_V, [{size: '50%', collapsible: false}, {size: '50%'}], 'auto', '100%');

        HmGrid.create($mainCodeGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields:[
                        { name:'codeKind', type:'string' },
                        { name:'codeNm', type:'string' },
                        { name:'useFlag', type:'string' }
                    ]
                },
                {
                    formatData: function(data) {
                        return data;
                    },
                    loadComplete: function(records) {

                    }
                }
            ),
            selectionmode: 'multiplerowsextended',
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '우리은행 자산코드');
            },
            columns:
			[
				{ text: 'No', datafield: 'num', width: 100 , hidden:true},
                { text: '코드종류', datafield: 'codeKind', width: 100 },
                { text: '코드명', datafield: 'codeNm' },
                { text: '사용여부', datafield: 'useFlag', width: 100, cellsrenderer: PMain.convertUseFlag}

			]
        }, CtxMenu.COMM);

        $mainCodeGrid.on('rowdoubleclick', function(event) {
            selectedMainGridRowIdx = $mainCodeGrid.jqxGrid('getselectedrowindex');
            PMain.searchSubCode();
        })

        HmGrid.create($subCodeGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields:[
                        { name:'codeKind', type:'string' },
                        { name:'codeNm', type:'string' },
                        { name:'codeId', type:'string' },
                        { name:'useFlag', type:'string' }
                    ]
                },
                {
                    formatData: function(data) {
						data.codeKind = selectedMainGridRowIdx === undefined ? '' : $mainCodeGrid.jqxGrid('getrowdata', selectedMainGridRowIdx).codeKind;
                        return data;
                    },
                    loadComplete: function(records) {

                    }
                }
            ),
            selectionmode: 'checkbox',
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '우리은행 자산세부코드');
            },
            columns:
                [
                    { text: 'No', datafield: 'num', width: 100 , hidden:true},
                    { text: '코드종류', datafield: 'codeKind', width: 100 },
                    { text: 'codeId', datafield: 'codeId' , hidden:true},
                    { text: '코드명', datafield: 'codeNm' },
                    { text: '사용여부', datafield: 'useFlag', width: 100 , cellsrenderer: PMain.convertUseFlag}
                ]
        }, CtxMenu.COMM);
    },

    /** Init Data */
    initData: function () {
        this.searchMainCode();
    },

    searchMainCode : function() {
        HmGrid.updateBoundData($mainCodeGrid, ctxPath + '/wooriBank/nms/ipMgmt/getMainCodeList.do');
    },

    searchSubCode : function() {
        HmGrid.updateBoundData($subCodeGrid, ctxPath + '/wooriBank/nms/ipMgmt/getSubCodeList.do');
    },

	//메인코드 추가
    addMainCode: function () {
        $.post(ctxPath + '/wooriBank/popup/nms/pCodeAdd.do',
            function(result) {
                HmWindow.open($('#pwindow'), '메인코드추가', result, 300, 150, 'p2window_init', {area:"mainGrid"});
            }
        );
	},

    //메인코드 삭제
    delMainCode: function () {
        var rowIdxes = HmGrid.getRowIdxes($mainCodeGrid, '선택된 데이터가 없습니다.');
        if(rowIdxes === false) return;
        if(!confirm('[' + rowIdxes.length + ']건의 데이터를 삭제하시겠습니까?')) return;
        var _mainCodeKinds = [];
        $.each(rowIdxes, function(idx,value){
            var tmp = $mainCodeGrid.jqxGrid('getrowdata', value);
            _mainCodeKinds.push(tmp.codeKind);
        });

        console.log(_mainCodeKinds)

        Server.post('/wooriBank/nms/ipMgmt/delMainCode.do', {
            data : { mainCodeKinds: _mainCodeKinds },
            success : function(result) {
                alert('삭제되었습니다.');
                HmGrid.updateBoundData($mainCodeGrid, ctxPath + '/wooriBank/nms/ipMgmt/getMainCodeList.do');
            }
        });
	},


    //메인코드 추가
    addSubCode: function () {
    	if(selectedMainGridRowIdx === undefined || selectedMainGridRowIdx === -1){
            alert('자산코드가 선택되지 않았습니다.');
            return;
		}

		var codeKind = $mainCodeGrid.jqxGrid('getrowdata', selectedMainGridRowIdx).codeKind;
        $.post(ctxPath + '/wooriBank/popup/nms/pCodeAdd.do',
            function(result) {
                HmWindow.open($('#pwindow'), '자산세부코드추가', result, 300, 150, 'p2window_init', {area:'subGrid', mainCodeKind : codeKind });
            }
        );
    },

    //서브코드 삭제
    delSubCode: function () {
        var rowIdxes = HmGrid.getRowIdxes($subCodeGrid, '선택된 자산코드가 없습니다.');
        if(rowIdxes === false) return;
        if(!confirm('[' + rowIdxes.length + ']건의 데이터를 삭제하시겠습니까?')) return;
        var _subCodeIds = [];
        $.each(rowIdxes, function(idx,value){
            var tmp = $subCodeGrid.jqxGrid('getrowdata', value);
            _subCodeIds.push(tmp.codeId);
        });

        Server.post('/wooriBank/nms/ipMgmt/delSubCode.do', {
            data : { mainCodeKind: $mainCodeGrid.jqxGrid('getrowdata', selectedMainGridRowIdx).codeKind, subCodeIds: _subCodeIds },
            success : function(result) {
                alert('삭제되었습니다.');
                HmGrid.updateBoundData($subCodeGrid, ctxPath + '/wooriBank/nms/ipMgmt/getSubCodeList.do');
            }
        });
    },

    /** 사용, 미사용 */
    convertUseFlag: function (row, column, value) {
        var cell = '<div style="text-align: center; overflow: hidden; padding-bottom: 2px; margin-top: 4px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
        cell += (value == 1)? '사용' : '미사용';
        cell += '</div>';
        return cell;
    },

};
