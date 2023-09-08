var $authGrpGrid, $addGrid;

var Main = {
		/** variable */
		initVariable: function() {
			$authGrpGrid = $('#authGrpGrid'), $addGrid = $('#addGrid');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSave': this.save(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			$('#splitter').jqxSplitter({ width: '100%', height: '100%', theme: jqxTheme, orientation: 'vertical' });
			HmGrid.create($authGrpGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: ctxPath + '/grp/getAuthGrpList.do',
						}
				),
				pageable: false,
				columns: 
				[
			 		{ text : '그룹명', datafield : 'grpName' }
				]
			});
			
			$addGrid.jqxGrid({
				source: new $.jqx.dataAdapter(
						{
							unboundmode: true,
			                totalrecords: 1000,
			                datafields:
		                	[
		                	 	{ name: 'grpName', type: 'string' }
		                	]
						}
				),
				width: '100%',
				height: '100%',
				editable: true,
				selectionmode: 'multiplecellsadvanced',
				showtoolbar: true,
			    rendertoolbar: function(toolbar) {
			    	HmGrid.titlerenderer(toolbar, '권한그룹 다중등록');
			    },
				columns:
				[
				 	{ text: 'No', width: 60, cellsalign: 'right', editable: false, cellsrenderer: HmGrid.rownumrenderer },
				 	{ text: '그룹명', datafield: 'grpName' }
				]
			});
		},
		
		/** init data */
		initData: function() {
			
		},
		
		save: function() {
			var _boundrows = $addGrid.jqxGrid('getboundrows');
			var _addrows = [];
			$.each(_boundrows, function(idx, value) {
				if(value.grpName.isBlank() == false) {
					_addrows.push(value);
				}
			});
			
			if(_addrows == null || _addrows.length == 0) {
				alert('그룹 데이터가 없습니다.');
				return;
			}
			if(!confirm(_addrows.length + '개의 권한그룹을 추가하시겠습니까?')) return;
			
			Server.post('/engineer/authGrpConf/addAllAuthGrp.do', {
				data: { list: _addrows },
				success: function(result) {
					HmGrid.updateBoundData($authGrpGrid);
					$addGrid.jqxGrid('updateBoundData');
					alert(result);
				}
			});
		}
		
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});