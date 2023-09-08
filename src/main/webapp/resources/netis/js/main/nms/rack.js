var $grpTree, $rackGrid;

var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#dGrpTreeGrid'), $rackGrid = $('#rackGrid');
			this.initCondition();
		},

		initCondition: function() {
			// search condition
			HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
			$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.searchRack(); break;
			case "btnExcel": this.exportExcel(); break;
			}
		},
		
		/** keyup event handler */
		keyupEventControl: function(event) {
			if(event.keyCode == 13) {
				Main.searchRack();
			}
		},
		
		/** init design */
		initDesign: function() {
			//검색바 호출.
			Master.createSearchBar1('','',$("#srchBox"));

			HmJqxSplitter.createTree($('#mainSplitter'));
			HmTreeGrid.create($grpTree, HmTree.T_GRP_SERVER, Main.searchRack, null, ['grpName']);
			
			HmGrid.create($rackGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields:[
                                { name: 'grpName', type: 'string' },
                                { name: 'rackName', type: 'string' },
                                { name: 'rackNo', type: 'number' },
                                { name: 'rackU', type: 'number' },
                                { name: 'unusedU', type: 'number' },
                                { name: 'vendor', type: 'string' },
                                { name: 'model', type: 'string' },
                                { name: 'rackIp', type: 'string' },
                                { name: 'rackPort', type: 'string' },
                                { name: 'ymd', type: 'string' },
                                { name: 'width', type: 'number' },
                                { name: 'height', type: 'number' },
                                { name: 'rackType', type: 'string' },
							]
						},
						{
							formatData: function(data) {
								var _grpNo = 0;
								var treeItem = HmTreeGrid.getSelectedItem($grpTree);
								if(treeItem != null) _grpNo = treeItem.grpNo;
								$.extend(data, {
									grpNo: _grpNo
								});
								$.extend(data, HmBoxCondition.getSrchParams());
								return data;
							}
						}
				),
				rowdetails: true,
				initrowdetails: Main.initrowdetails,
				rowdetailstemplate: {
					rowdetails: "<div id='slotGrid' style='margin: 10px;'></div>", 
					rowdetailsheight: 250, 
					rowdetailshidden: true 
				},
				columns:
				[
					{ text : '그룹명', datafield : 'grpName', width : 150 },
                    { text: '타입', datafield: 'rackType', width: 60, cellsrenderer: function (row, datafield, value) {
							var txt = value === 'SINGLE' ? '단면' : '양면';
							return '<div style="height: 100%; margin-top:6.5px; text-align: center">' + txt + '</div>';
                    	}
                    },
					{ text : 'Rack명', datafield : 'rackName', minwidth : 150 },
                    { text : 'Rack번호', datafield : 'rackNo', hidden: true },
					{ text : '전체', columngroup: 'unit', datafield : 'rackU', width : 80, cellsalign: 'right', filtertype:'number' },
					{ text : '미사용', columngroup: 'unit', datafield : 'unusedU', width : 80, cellsalign: 'right', filtertype:'number' },
					{ text : '제조사', datafield : 'vendor', width : 120, filtertype: 'checkedlist' },
					{ text : '모델', datafield : 'model', width : 120, filtertype: 'checkedlist' },
                    { text : 'IP', datafield : 'rackIp', width : 90 },
                    { text : 'Port', datafield : 'rackPort', width : 60, cellsalign: 'right' },
                    { text : '설치일', datafield : 'ymd', width : 80, cellsalign: 'center' },
					{ text : '가로(cm)', datafield : 'width', width : 80, cellsalign: 'right', filtertype:'number' },
					{ text : '세로(cm)', datafield : 'height', width : 80, cellsalign: 'right', filtertype:'number' }
			    ],
			    columngroups: [
                   { text: 'Unit수', align: 'center', name: 'unit' }
                ]
			},CtxMenu.RACK);
			// 기본롤이 더블클릭을 하지 않아서 제거
            // $rackGrid.on('rowdoubleclick', function(event) {
            //     debugger;
            //     var selectedRowIndex = event.args.rowindex;
            //     if(selectedRowIndex === false) return;
            //     var rowdata = $(this).jqxGrid('getrowdata', selectedRowIndex);
            //     params = {};
            //     params.rackU = rowdata.rackU;
            //     params.rackName = rowdata.rackName;
            //     params.width = rowdata.width;
            //     params.height = rowdata.height;
            //     params.rackNo = rowdata.rackNo;
            //     params.grpNo = rowdata.grpNo;
            //     params.ymd = rowdata.ymd;
            //     params.model = rowdata.model;
            //     params.vendor = rowdata.vendor;
            //     HmUtil.createPopup('/main/popup/rack/pRackInfo.do', $('#hForm'), 'pRackInfo', 510, 700, params);
            //});

			$('#section').css('display', 'block');
		},
		
		 initrowdetails: function (index, parentElement, gridElement, record) {
            var id = record.uid.toString();
            var grid = $($(parentElement).children()[0]);
            var slotGridAdapter = new $.jqx.dataAdapter(
            		{
            			datatype: 'json',
            			url: ctxPath + '/main/env/rackConf/getRackSlotList.do'
            		},
            		{
            			formatData: function(data) {
            				data.grpNo = record.grpNo;
            				data.rackNo = record.rackNo;
            				return data;
            			}
            		}
            );
            if (grid != null) {
            	HmGrid.create(grid, {
            		 source: slotGridAdapter,
                     width: '98%',
                     height: 230,
                     columns: [
                         { text: 'Unit', datafield: 'slotNo', width: 100, cellsalign: 'right', hidden: true },
                         {text: '구분', datafield: 'rackSection', width: 60 ,
                             cellsrenderer: function (row, datafield, value) {
                                 var txt = value === 'F' ? '앞면' : '뒷면';
                                 return '<div style="height: 100%; margin-top:6.5px; text-align: center">'+ txt + '</div>';
                             }
                         },
                         { text: 'Unit 시작번호', datafield: 'descSlotNo', width: 100, cellsalign: 'right' },
                         { text: 'Slot종류', datafield: 'slotKind', width: 100,
                             cellsrenderer: function (row, datafield, value) {
                                 var cell = "<div style='margin-top: 6.5px; margin-left: 4px;'>";
                                 switch(value.toString()) {
                                     case "DEV": cell += "장비"; break;
                                     case "SVR": cell += "서버"; break;
                                     case "VSVR": cell += "가상서버"; break;
                                     case "BSVR": cell += "블레이드서버"; break;
                                     case "BLD": cell += "블레이드"; break;
                                 }
                                 cell += "</div>";
                                 return cell;
                             }
                         },
						 { text: 'Slot명', datafield: 'slotName', minwidth: 150 },
                         { text: 'IP', datafield: 'slotIp', width: 120 },
                         { text: '종류', datafield: 'devKind2', width: 120, filtertype: 'checkedlist' },
                         { text: '모델', datafield: 'model', width: 120, filtertype: 'checkedlist' },
                         { text: '벤더', datafield: 'vendor', width: 120, filtertype: 'checkedlist' },
                         { text: 'Unit수', datafield: 'slotU', width: 100, cellsalign: 'right' },
                         { text: '타입', datafield: 'devKind1', width: 100, filtertype: 'checkedlist' }
                    ]
            	});

                grid.on('rowdoubleclick', function () {
                    var rackMngNo = HmGrid.getRowData(grid).mngNo;
                    $.get(ctxPath + '/main/popup/env/pRackVmInfo.do', function (result) {
                        HmWindow.openFit($('#pwindow'), 'VM 서버정보', result, 600, 452, 'pwindow_init', rackMngNo);

                    });
                })
            }
        },
		
		/** init data */
		initData: function() {
			
		},
		
		/** RACK */
		searchRack: function() {
			HmGrid.updateBoundData($rackGrid, ctxPath + '/main/env/rackConf/getRackConfList.do');
		},

		/** export Excel */
		exportExcel: function() {
			HmUtil.exportGrid($rackGrid, 'Rack', false);
			// var params = Master.getGrpTabParams();
			// var _grpNo = 0;
			// var treeItem = HmTreeGrid.getSelectedItem($grpTree);
			// if(treeItem != null) _grpNo = treeItem.grpNo;
			// $.extend(params, {
			// 	grpNo: _grpNo,
			// 	sIp: $('#sIp').val(),
			// 	sDevName: $('#sDevName').val()
			// });
			// HmUtil.exportExcel(ctxPath + '/main/env/rackConf/export.do', params);
		}
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});