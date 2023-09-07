var $ipSearchGrid;
var isSearchAll = false;

var Main = {
	/** variable */
	initVariable : function() {
		$ipSearchGrid = $('#ipSearchGrid');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) {
			Main.eventControl(event);
		});
		$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case 'btnSearch': this.searchIpSearch(); break;
		case "btnExcel": this.exportExcel(); break;
		}
	},

	/** keyup event handler */
	keyupEventControl: function(event) {
		if(event.keyCode == 13) {
			Main.searchIpSearch();
		}
	},

	/** init design */
	initDesign : function() {
        HmDate.create($('#p_date1'), $('#p_date2'), 0);

		HmGrid.create($ipSearchGrid, {
			source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						datafields:[
							{ name:'num', type:'number' },
							{ name:'ipassetHostNo', type:'string' },
							{ name:'wbSvrLocCd', type:'string' },
							{ name:'rackNm', type:'string' },
							{ name:'wbSvrKindCd', type:'string' },
							{ name:'wbSvrUseCd', type:'string' },
							{ name:'workNm', type:'string' },
							{ name:'hostNm', type:'string' },
							{ name:'reqUserId', type:'string' },
							{ name:'reqState', type:'string' },
							{ name:'confmState', type:'string' }
						]
					},
					{
						formatData: function(data) {
							data.sIp = $('#sIp').val();
							data.sDevName = $('#sDevName').val();
							return data;
						},
						loadComplete: function(records) {

						}
					}
			),
			selectionmode: 'checkbox',
			showtoolbar: true,
			rendertoolbar: function(toolbar) {
				HmGrid.titlerenderer(toolbar, '');
			},
			columns:
			[
				{ text: 'No', datafield: 'num', width: 100 , hidden:true},
				{ text: 'HOST_NO', datafield: 'ipassetHostNo', width: 150, hidden:true },
				{ text: '요청번호', datafield: 'test1', width: 100 },
				{ text: '처리상태', datafield: 'test2', width: 100 },
				{ text: '처리자', datafield: 'test3', width: 100 },

				{ text: '서버위치', datafield: 'wbSvrLocCd', width: 150, columngroup:'serverGroup' },
				{ text: '랙명칭', datafield: 'rackNm', width: 140 , columngroup:'serverGroup'},
				{ text: '서버종류', datafield: 'wbSvrKindCd', width: 220 , columngroup:'serverGroup'},
				{ text: '서버용도', datafield: 'wbSvrUseCd', width: 130 , columngroup:'serverGroup'},
				{ text: '업무명', datafield: 'workNm', width: 150 , columngroup:'serverGroup'},
				{ text: 'HOSTNAME', datafield: 'hostNm', width: 120 , columngroup:'serverGroup'},
				{ text: '가상화', datafield: 'test4', width: 120 , columngroup:'serverGroup'},
				{ text: '가상화 구분 ID', datafield: 'test5', width: 120 , columngroup:'serverGroup'},
				{ text: 'I/F명', datafield: 'test6', width: 120 , columngroup:'serverGroup'},
				{ text: 'I/F추가정보', datafield: 'test7', width: 120 , columngroup:'serverGroup'},
				{ text: 'NIC 정보', datafield: 'test8', width: 120 , columngroup:'serverGroup'},
				{ text: 'Active/Backup', datafield: 'test9', width: 120 , columngroup:'serverGroup'},
				{ text: 'IP 수량', datafield: 'test10', width: 120 , columngroup:'serverGroup'},
				{ text: 'IP 주소', datafield: 'test11', width: 120 , columngroup:'serverGroup'},
				{ text: '서브넷마스크', datafield: 'test12', width: 120 , columngroup:'serverGroup'},
				{ text: 'Default GW', datafield: 'test13', width: 120 , columngroup:'serverGroup'},
				{ text: '케이블타입', datafield: 'test14', width: 120 , columngroup:'serverGroup'},
				{ text: 'duplex/speed', datafield: 'test15', width: 120 , columngroup:'serverGroup'},
                
				{ text: '랙명칭', datafield: 'test16', width: 120 , columngroup:'networkGroup'},
				{ text: 'HOSTNAME', datafield: 'test17', width: 120 , columngroup:'networkGroup'},
				{ text: '스위치IP', datafield: 'test18', width: 120 , columngroup:'networkGroup'},
				{ text: '포트번호', datafield: 'test19', width: 120 , columngroup:'networkGroup'},
				{ text: '기타', datafield: 'test20', width: 120 , columngroup:'networkGroup'},
				{ text: '저장여부', datafield: 'test21', width: 120 , columngroup:'networkGroup'},


				{ text: '신청인', datafield: 'reqUserId', width: 130 },
				{ text: '요청날짜', datafield: 'reqState', width: 130 },
				{ text: '승인날짜', datafield: 'confmState', width: 130 }
			],
            columngroups:
            [
                { text: '서버정보', align: 'center', name: 'serverGroup'},
                { text: '네트워크정보', align: 'center', name: 'networkGroup'}
            ]
		}, CtxMenu.COMM);

	},

	/** init data */
	initData : function() {
		this.searchIpSearch();
	},

	/** IP 조회 */
	searchIpSearch : function() {
		HmGrid.updateBoundData($ipSearchGrid, ctxPath + '/wooriBank/nms/ipSearch/getIpSearchList.do');
	},

	/** export Excel */
	exportExcel: function() {
		HmUtil.exportGrid($ipSearchGrid, 'IP조회', false);
	}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});