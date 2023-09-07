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
		case 'btnExcel': this.exportExcel(); break;
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
                        {name: 'pollGrpNo', type: 'number'},
                        {name: 'pollGrpNm', type: 'string'},
                        {name: 'totDevCnt', type: 'number'},
                        {name: 'totIfCnt', type: 'number'},
                        {name: 'icmpDevCnt', type: 'number'},
                        {name: 'perfDevCnt', type: 'number'},
                        {name: 'perfIfCnt', type: 'number'}
					]
                },
				{
                    formatData: function(data) {
						return JSON.stringify(data);
					}
				}
			),
			columns: [
                { text: '수집기', datafield: 'pollGrpNo', displayfield: 'pollGrpNm', width: '25%' },
                { text: '장비수', columngroup: 'reg', datafield: 'totDevCnt', width: '15%', cellsalign: 'right', cellsformat: 'n' },
                { text: '회선수', columngroup: 'reg', datafield: 'totIfCnt', width: '15%', cellsalign: 'right', cellsformat: 'n' },
				{ text: 'ICMP수집 장비수', columngroup: 'mon', datafield: 'icmpDevCnt', width: '15%', cellsalign: 'right', cellsformat: 'n' },
                { text: '성능수집 장비수', columngroup: 'mon', datafield: 'perfDevCnt', width: '15%', cellsalign: 'right', cellsformat: 'n' },
                { text: '성능수집 회선수', columngroup: 'mon', datafield: 'perfIfCnt', width: '15%', cellsalign: 'right', cellsformat: 'n' }
			],
			columngroups: [
				{ text: '전체 등록 수량', align: 'center', name: 'reg' },
                { text: '모니터링 수량', align: 'center', name: 'mon' }
			]
		}, CtxMenu.COMM);
	},

	/** init data */
	initData: function() {
		this.search();
	},

	search: function() {
		HmGrid.updateBoundData($infoGrid, ctxPath + '/main/com/pollGrpMon/getPollGrpMonList.do');
	},

	exportExcel: function() {
        HmUtil.exportGrid($infoGrid, '수집기 모니터링', false);
	}

};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});