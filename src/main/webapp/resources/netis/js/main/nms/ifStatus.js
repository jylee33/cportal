var $ifStatusGrid, dtl_mngNo = -1, dtl_ifIdx = -1;

var Main = {
	/** variable */
	initVariable : function() {
		$ifMgmt = $('#ifStatusGrid');
		this.initCondition();
	},

	initCondition: function() {
		// search condition
		HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_dev_srch_type'));
	},

	/** add event */
	observe : function() {
		$('button').on('click', function(event) {
			Main.eventControl(event);
		});
		$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case "btnSearch":
			this.search();
			break;
		case "btnExcel": this.exportExcel(); break;
		}
	},
	
	/** keyup event handler */
	keyupEventControl: function(event) {
		if(event.keyCode == 13) {
			Main.search();
		}
	},

	/** init design */
	initDesign : function() {
		HmJqxSplitter.createTree($('#mainSplitter'));

		HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '45%', collapsible: false }, { size: '55%' }], 'auto', '100%');
		Master.createGrpTab(Main.selectTree, {devKind1: 'DEV'});

		// 회선성능Grid
		Main.createIfStatusGrid();

		$('#section').css('display', 'block');
	},

	createIfStatusGrid : function() {
		// 본페이지 메인 그리드

        var source = {
            datatype: 'json',
            root: 'rows',
            beforeprocessing: function(data) {
                if(data != null)
                    source.totalrecords = data.resultData != null? data.resultData.totalrecords : 0;
            },
            sort: function() {
                $ifMgmt.jqxGrid('updatebounddata', 'sort');
            },
            filter: function() {
                $ifMgmt.jqxGrid('updatebounddata', 'filter');
            }
        };
        var adapter = new $.jqx.dataAdapter(
            source,
            {
                formatData: function(data) {
					var params = Main.getCommParams();
                    $.extend(data, params);
                    return data;
                }
            }
        );

		HmGrid.create($ifMgmt, {
            source: adapter,
            virtualmode: true,
            rendergridrows: function(params) {
                return adapter.records;
            },
            // pagesize : 2000,
			columns : [
	            { text : '장비번호', datafield : 'mngNo', hidden:true },
	            { text : '그룹', datafield : 'grpName', width : 130 },
	            { text : '장비명', datafield : 'disDevName', minwidth : 150, cellsrenderer: HmGrid.devNameRenderer },
	            { text : '장비IP', datafield : 'devIp', width : 120 },
				{ text : '타입', datafield : 'devKind1', hidden: true },
	            { text : '종류', datafield : 'devKind2', width : 130},
				{ text : '제조사', datafield : 'vendor', width : 130},
	            { text : '모델', datafield : 'model', width : 130},
				{ text : '장비위치', datafield: 'devLocation', width: 130, hidden: true  },
	            { text : '회선번호', datafield : 'ifIdx', cellsalign: 'right', width : 80 },
	            { text : '수집여부', datafield : 'perfPoll', cellsalign: 'center', width : 80 },
// 	            { text : 'FLOW', datafield : 'flowPoll', cellsalign: 'center', width : 80 },
	            { text : '회선명', datafield : 'ifName', width : 150, cellsrenderer: HmGrid.ifNameRenderer},
	            { text : '회선IP', datafield : 'ifIp', width : 120 },
	            { text : '별칭', datafield : 'ifAlias', width : 130 },
	            { text : '대역폭', datafield : 'lineWidth', cellsrenderer: HmGrid.unit1000renderer, width : 80 },
	            { text : '상태', datafield : 'status', width : 80, cellsrenderer: HmGrid.ifStatusrenderer },
	            { text : '최종접속일자', datafield : 'ifStatusUpd', displayfield: 'disIfStatusUpd', hidden: ($('#gSiteName').val() !='HI'), width : 120 },
	            { text : 'Subnet Mask', datafield : 'ifMask', width : 100 }
            ]
		}, CtxMenu.IF);
		$ifMgmt.off('bindingcomplete').on('bindingcomplete', function(event) {
				try {
					$(this).jqxGrid('selectrow', 0);
					dtl_mngNo = $(this).jqxGrid('getcellvalue', 0, 'mngNo');
					dtl_ifIdx = $(this).jqxGrid('getcellvalue', 0, 'ifIdx');
					Main.predictShow($(this).jqxGrid('getcellvalue', 0, 'aiPoll'));
					Main.searchDtlInfo();
				} catch(e) {}
			})
			.off('rowdoubleclick').on('rowdoubleclick', function(event) {
				dtl_mngNo = event.args.row.bounddata.mngNo;
				dtl_ifIdx = event.args.row.bounddata.ifIdx;
				dtl_lineWidth = event.args.row.bounddata.lineWidth;
				Main.predictShow(event.args.row.bounddata.aiPoll);
				Main.searchDtlInfo();
			});
	},

	/** init data */
	initData : function() {
	},
	/** 공통 파라미터 */
	getCommParams: function () {
		var params = Master.getGrpTabParams();
		$.extend(params, HmBoxCondition.getSrchParams());
		return params;
	},

	selectTree: function () {
		Main.search();
	},
	search : function(a) {
        var $grid = $ifMgmt;
        $grid.jqxGrid("gotopage", 0); // jqxgrid의 paginginformation 초기화를 위해 호출
		HmGrid.updateBoundData($ifMgmt, ctxPath + '/main/nms/ifStatus/getIfStatus.do');
	},

	/** 상세정보 */
	searchDtlInfo: function() {
		PMain.search();
	},

	/** aiPoll == 1 이면 성능예측, 장애예측 탭 출력 0인경우 성능예측,장애예측탭 선택시 요약탭으로 변경 eq 11 12 하드코딩.  */
	predictShow: function(aiPoll) {
		var displayFlag = aiPoll == 1 ? 'block' : 'none';
		if(aiPoll == 0){
			if($('#dtlTab').val() == 2 || $('#dtlTab').val() == 3)
				$('#dtlTab').jqxTabs('select', 0);
		}
		$('#dtlTab .jqx-tabs-title:eq(3)').css('display', displayFlag);
		$('#dtlTab .jqx-tabs-title:eq(4)').css('display', displayFlag);
	},
	/** export Excel */
	exportExcel: function() {
         HmUtil.exportGrid($ifMgmt, '회선현황', false);
	}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});