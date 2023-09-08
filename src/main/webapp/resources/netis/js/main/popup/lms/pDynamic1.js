
var PMain = {
		/** variable */
		initVariable: function() {
			
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { PMain.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
				case 'pbtnAdd': PMain.btnAdd(); break;
				case 'pbtnClose': PMain.btnClose(); break;
				case 'pbtnAddItem': PMain.btnAddItem(); break;
				case 'pbtnEditItem': PMain.btnEditItem(); break;
				case 'pbtnDynamicAdd': PMain.btnDynamicAdd(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmWindow.create($('#p2window'), 100, 100);

			var fixedCols = [];
			HmGrid.create($('#dynamicGrid'), {
				source : new $.jqx.dataAdapter({
					datatype : 'json',
				}, {
					formatData : function(data) {
						$.extend(data, {
							tableKind : 0
						});
						return data;
					},
				}),
				width : '100%',
				height : 100,
				columns : fixedCols,
				pageable: false
			});
			
		},
		
		
		
		/** init data */
		initData: function() {
			PMain.searchDynamic();
		},
			
		searchDynamic: function(){
			Server.get("/main/lms/lineMgmt/getItemList.do", {
				data : {
					tableKind : 0
				},
				success : function(data) {
					var cols = [];
					$.each(data, function(idx, item) {

						if (item.colType == 'NUMBER') {
							cols.push({
								text : item.colCap,
								datafield : item.colNm,
								width : 100,
								cellsalign : 'right',
								columntype : 'numberinput',
								createeditor : function(row, cellvalue, editor) {
									var _max = '';
									for (var i = 0; i < item.colSize; i++) {
										_max += '9';
									}
									editor.jqxNumberInput({
										inputMode : 'simple',
										digits : item.colSize,
										decimalDigits : 0,
										min : 0,
										max : parseInt(_max)
									});
								}
							});
						} else {
							cols.push({
								text : item.colCap,
								datafield : item.colNm,
								width : 100,
								validation : function(cell, value) {
									if (value == '')
										return true;
									if (value.length > item.colSize) {
										return {
											result : false,
											message : item.colSize + '자 이내로 입력하세요.'
										};
									} else
										return true;
								}
							});
						}
					});

					$('#dynamicGrid').jqxGrid('beginupdate', true);
					$('#dynamicGrid').jqxGrid({
						columns : cols
					});
					$('#dynamicGrid').jqxGrid('endupdate');

					var rows = $('#dynamicGrid').jqxGrid('getrows');
					if (rows.length < 1) {
						$('#dynamicGrid').jqxGrid('addrow', 0, {});
					}
				}
			});
		},
		
		extractCols: function() {
				var _paramCols = [];
				var cols = $('#dynamicGrid').jqxGrid("columns");
				for (var i = 0; i < cols.records.length; i++) {
					_paramCols.push({
						datafield : cols.records[i].datafield,
						text : cols.records[i].text
					});
				}
				return _paramCols;
			},
		/* 동적컬럼 세팅 */
		gridSet:function(obj) {
			var items = [];
			$.each(obj, function(idx, item) {
				$('#dynamicGrid').jqxGrid('setcellvaluebyid', 0, idx, item);
				if (item == '') {
					items.push('\''+ '' + '\'');
				} else {
					items.push('\''+ item + '\'');
				}
			});
			$('#addedData').val(items.join(','));
		},
		
		btnDynamicAdd: function(){
			$.post(ctxPath + '/main/popup/lms/pDynamicAdd.do', function(result) {
				HmWindow.open($('#p2window'), '동적컬럼 추가', result, 400, 225, 'p2window_init');
			});
		},
		
		btnAddItem: function(){
			$.post(ctxPath + '/main/popup/lms/pDynamicAdd.do', function(result) {
				HmWindow.open($('#p2window'), '동적컬럼 추가', result, 400, 225, 'p2window_init');
			});
		},
		
		btnEditItem: function(){
			$.post(ctxPath + '/main/popup/lms/pDynamicItem.do', function(result) {
				HmWindow.open($('#p2window'), '동적컬럼 수정', result, 400, 290, 'p2window_init');
			});
		},
		btnAdd: function(){
			
			var cols = $('#dynamicGrid').jqxGrid("columns");
			
			var queryString ='';
			
			for (var i = 0; i < cols.records.length; i++) {
				var dataField = cols.records[i].datafield;
				var value = $('#dynamicGrid').jqxGrid('getcellvalue', 0, dataField);
				if(i <cols.records.length-1){
					if(value ==''){
						queryString = queryString + dataField +' = ' + '\''+ ''+ '\''+', ';
					}else{
						queryString = queryString + dataField +' = ' + '\''+ value+ '\''+', ';
					}
				}else{
					if(value ==''){
						queryString = queryString +dataField +' = ' + '\''+ '' + '\'';
					}else{
						queryString = queryString +dataField +' = ' + '\''+ value + '\'';
					}
				}
				}
			console.log(queryString);
			
			
			Server.post('/main/lms/lineMgmt/addData.do', {
				data: queryString,
				success: function(result) {
					alert('저장되었습니다..');
					parent.search();
					$('#pwindow').jqxWindow('close');
				}
			});
			
			
		},
		btnClose: function(){
			$('#pwindow').jqxWindow('close');
		}
				
};
$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});