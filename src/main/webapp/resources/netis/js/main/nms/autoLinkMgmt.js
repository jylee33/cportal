var $autoLinkGrid;
var Main = {
	/** variable */
	initVariable : function() {//변수 초기화
        $autoLinkGrid = $('#autoLinkGrid');
	},

	/** add event */
	observe : function() { //이벤트 동작,실행
		$('button').on('click', function(event) { Main.eventControl(event); });
	},

	/** event handler */
	eventControl : function(event) { //이벤트 처리
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
			case 'btnSearch': this.search(); break;
			case 'btnAdd': this.addAutoLink(); break;
			case 'btnEdit': this.editAutoLink(); break;
			case 'btnDel': this.delAutoLink(); break;
		}
	},

	/** init design */
	initDesign : function() {
		HmGrid.create($autoLinkGrid, {
			source : new $.jqx.dataAdapter({
				datatype: 'json',
			}),
			selectionmode : 'singlerow',
			columns : [

				{text: '장비번호', columngroup: 'base', datafield: 'mngNo',hidden: true},
				{text: '장비명', columngroup: 'base', datafield: 'devName'},
				{text: '종류', columngroup: 'base', datafield: 'devKind2', cellsalign: 'center', width: 100},
				{text: '회선번호', columngroup: 'base', datafield: 'ifIdx', cellsalign: 'center', width: 80},
				{text: '회선명', columngroup: 'base', datafield: 'ifName'},

				{text: 'seq_no', columngroup: 'rel', datafield: 'seqNo', hidden: true},
				{text: '장비명', columngroup: 'rel', datafield: 'relDevName'},
				{text: '종류', columngroup: 'rel', datafield: 'relDevKind', cellsalign: 'center', width: 100},
				{text: '회선번호', columngroup: 'rel', datafield: 'relIfIdx', cellsalign: 'center', width: 80},
				{text: '회선명', columngroup: 'rel', datafield: 'relIfName'},
			],
			columngroups: [
				{ text: '장비', align: 'center', name: 'base' },
				{ text: '연결장비', align: 'center', name: 'rel' },
			]
		}, CtxMenu.COMM);
	},

	/** init data */
	initData: function() {
		Main.search();
	},

	search: function() {
	 	HmGrid.updateBoundData($autoLinkGrid, ctxPath + '/main/nms/autoLinkMgmt/getAutoLinkRelationList.do');
	},


	addAutoLink : function() {
		$.post(ctxPath + '/main/popup/nms/pAutoLinkMgmtAdd.do' , function(result) {
			HmWindow.open($('#pwindow'), '회선연결관리 추가', result, 1500, 700, 'pwindow_init', null );
		});
	},

	editAutoLink : function() {

		var rowIdxes = HmGrid.getRowIdxes($autoLinkGrid, '수정할 작업 선택하세요.');

		if(!rowIdxes){
			return;
		} else if(rowIdxes.length != 1){
			alert('하나의 작업만 수정할 수 있습니다.');
			return ;
		}

		var rowData = HmGrid.getRowData($autoLinkGrid, rowIdxes[0]);

		$.post(ctxPath + '/main/popup/nms/pAutoLinkMgmtEdit.do' ,function(result) {
			HmWindow.open($('#pwindow'), '회선연결관리 수정', result,1500, 700 ,'pwindow_init', rowData);
		});
	},

	delAutoLink : function() {

        if (!confirm('삭제하시겠습니까?')) return;

		var rowIdxes = HmGrid.getRowIdxes($autoLinkGrid);

		var rowData = HmGrid.getRowData($autoLinkGrid, rowIdxes[0]);

		Server.post('/main/nms/autoLinkMgmt/delAutoLinkRelation.do', {
			data: {
				seqNo :rowData.seqNo
			},
			success: function(result) {
				Main.search();
			}
		});
	},
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});
