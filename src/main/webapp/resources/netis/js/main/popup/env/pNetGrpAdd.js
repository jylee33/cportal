$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
	$(window).resize();
});

var PMain =
	{
		/** Initialize */
		initVariable : function() {
		},

		/** Event Object */
		observe : function() {
			$('button').bind('click', function(event) {
				PMain.eventControl(event);
			});

			$('#listGrid').on('dbclick')
		},

		/** Event Control Function */
		eventControl : function(event) {
			var objElement = event.currentTarget;
			if (objElement === window) {
				this.resizeWindow();
				return;
			}

			switch (objElement.id) {
			case "pbtnClose":
				PMain.processCancel();
				break;
			case "pbtnAdd":
				PMain.processRowAdd();
				break;
			case "pbtnSave":
				PMain.processSave();
				break;
			}
		},

		/** Init Design */
		initDesign : function() {
			HmGrid.create($('#listGrid'),
				{
					source : new $.jqx.dataAdapter(
						{ datatype : 'json' },
						{ formatData : function(data) {
							return data;
						} }),
					height : 370,
					editable: true,
					columns : [
						{
							text : '그룹명',
							datafield : 'grpName' } ] });

			$('#pbtnSave').click(function() {

			});

			HmDropDownBtn.createTreeGrid($('#ddbGrp'), $('#grpTree'), HmTree.T_GRP_DEF_ALL, 200, 22, 300, 350);
		},

		/** Init Data */
		initData : function() {

		},
		processRowAdd : function() {
			$('#listGrid').jqxGrid('addrow', $('#listGrid').jqxGrid('getrows').length, {});
		},
		processSave : function() {
			//, grpRef : $('#grpTree').jqxTreeGrid('getSelection')[0].grpNo 
			var gridList = $('#listGrid').jqxGrid('getrows');
			Server.post('/main/popup/networkGroup/saveNetworkGrp.do',
					{
						data : { list : gridList, grpRef : $('#grpTree').jqxTreeGrid('getSelection')[0].grpNo },
						success : function(result) {
							alert(result + '건을 추가 하였습니다.');
							opener.parent.$groupGrid.jqxGrid('updatebounddata');
							self.close();
						} });
		},
		// 취소
		processCancel : function() {
			self.close();
		}

	};
