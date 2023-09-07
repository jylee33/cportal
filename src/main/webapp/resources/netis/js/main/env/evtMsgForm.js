var $infoGrid;

var Main = {
	/** variable */
	initVariable: function() {
		$infoGrid = $('#infoGrid');
	},

	/** add event */
	observe: function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
	},

	/** event handler */
	eventControl: function(event) {
		var curTarget = event.currentTarget;
		switch(curTarget.id) {
		case 'btnSearch': this.search(); break;
		case 'btnEdit': this.editMsgForm(); break;
		}
	},

	/** init design */
	initDesign: function() {
		HmGrid.create($infoGrid, {
			source: new $.jqx.dataAdapter(
				{
					type: 'POST',
                    contenttype: 'application/json; charset=utf-8',
                    datatype: 'json',
					datafields: [
                        {name: 'seqNo', type: 'number'},
                        {name: 'evtType', type: 'string'},
                        {name: 'disEvtType', type: 'string'},
                        {name: 'evtCode', type: 'string'},
                        {name: 'evtName', type: 'string'},
                        {name: 'msgForm', type: 'string'}
					]
                },
				{
                    formatData: function(data) {
						return JSON.stringify(data);
					}
				}
			),
			columns: [
                { text: 'SEQ', datafield: 'seqNo', width: 60, hidden: true },
				{ text: '템플릿유형', datafield: 'evtType', displayfield: 'disEvtType', width: 200, cellsalign: 'center' },
                { text: '이벤트코드', datafield: 'evtCode', width: 200 },
                { text: '이벤트명', datafield: 'evtName', width: 200 },
				{ text: '메시지', datafield: 'msgForm' }
			]
		}, CtxMenu.COMM);
	},

	/** init data */
	initData: function() {
		this.search();
	},

	search: function() {
		HmGrid.updateBoundData($infoGrid, ctxPath + '/main/env/evtMsgForm/getEvtMsgFormList.do');
	},

	editMsgForm: function() {
		var rowdata = HmGrid.getRowData($infoGrid);
		if(rowdata == null) {
			alert('데이터를 선택하세요.');
			return;
		}
		$.post(ctxPath + '/main/popup/env/pEvtMsgFormEdit.do', function(result) {
			HmWindow.open($('#pwindow'), '템플릿 관리', result, 1000, 600, 'pwindow_init', rowdata);
		});
	}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});