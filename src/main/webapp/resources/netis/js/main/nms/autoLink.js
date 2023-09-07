var $grpTree, $linkGrid;

var Main = {
	/** variable */
	initVariable : function() {
		$grpTree = $('#dGrpTreeGrid');
		$linkGrid = $('#linkGrid');

	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
		$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
			case 'btnSearch': this.search(); break;
			case 'btnExcel': this.exportExcel(); break;
		}
	},

	/** keyup event handler */
	keyupEventControl: function(event) {
	    alert(1)
		if(event.keyCode == 13) {
			Main.search();
		}
	},

	/** init design */
	initDesign : function() {
		//검색바 호출.
		HmBoxCondition.createRadioInput($('#sSrchType'), searchCategory);

		HmJqxSplitter.createTree($('#mainSplitter'));

		Master.createGrpTab(Main.selectTree, {devKind1: 'DEV'});
		$('#section').css('display', 'block');

		Main.createGrid();
	},


	/** init data */
	initData: function() {
		Server.get('/grp/getDefaultGrpTreeListAll.do', {
			success: function(result) {
				grpList = result;
			}
		});
	},

	selectTree: function() {
		Main.search();
	},

	search: function() {
		HmGrid.updateBoundData($linkGrid, '/main/nms/autoLink/getList.do');
	},

    exportExcel: function() {
         HmUtil.exportGrid($linkGrid, '회선연결정보', false);
    },

	createGrid: function () {
		HmGrid.create($linkGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
							    $.extend(data, Main.getGrpTreeParams());
							    $.extend(data, HmBoxCondition.getSrchParams());
								return data;
							}
						}
				),
				columns:
				[
					{ text: '장비명', datafield: 'devName', minwidth: 150 },
					{ text: '종류', datafield: 'devKind', width: 100 },
					{ text: '회선번호', datafield: 'ifIdx', width: 80, cellsalign: 'center' },
					{ text: '회선명', datafield: 'ifName', width: 105 },
					{ text: 'IP', datafield: 'ifIp', width: 100, cellsalign: 'center' },
					{ text: 'Subnet Mask', datafield: 'ifMask', width: 100, cellsalign: 'center' },
					{ text: 'MAC', datafield: 'ifMac', width: 120, cellsalign: 'center' },
					{ text: '대역폭', datafield: 'lineWidth', width: 70, cellsrenderer: HmGrid.unit1000renderer },
					{ text: '연결장비명', datafield: 'relDevName', width: 150 },
					{ text: '종류', datafield: 'relDevKind', width: 100 },
					{ text: '회선번호', datafield: 'relIfIdx', width: 80, cellsalign: 'center' },
					{ text: '회선명', datafield: 'relIfName', width: 105 },
					{ text: 'IP', datafield: 'relIfIp', width: 100, cellsalign: 'center' },
					{ text: 'Subnet Mask', datafield: 'relIfMask', width: 100, cellsalign: 'center' },
					{ text: 'MAC', datafield: 'relIfMac', width: 120, cellsalign: 'center'},
					{ text: '대역폭', datafield: 'relLineWidth', width: 65, cellsrenderer: HmGrid.unit1000renderer },
			    ],
			}, CtxMenu.NONE);
    },

    getGrpTreeParams: function () {
	    var params = {};
        var treeItem = HmTreeGrid.getSelectedItem($grpTree);
        if(treeItem === null) return;
        if(treeItem.devKind1 === 'DEV') {
            params.mngNo = treeItem.grpNo.split('_')[1];//장비 조회
        } else {
            params.grpNo = treeItem.grpNo;//그룹 조회
        }
        return params;
    },
}

var searchCategory = [
    {label: 'IP', value: 'IP'},
    {label: '장비', value: 'NAME'},
    {label: '종류', value: 'DEVKIND2'}
];
$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});