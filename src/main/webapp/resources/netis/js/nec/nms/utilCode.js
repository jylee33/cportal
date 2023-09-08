var $utilCodeGrid;

var Main = {
	/** variable */
	initVariable : function() {
		$utilCodeGrid = $('#utilCodeGrid');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) {
			Main.eventControl(event);
		});
		// $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
		$('.searchBox').bind('keyup', function(event) { Main.keyupEventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case 'btnSearch': this.search(); break;
		case 'btnAdd': this.addUtilCode(); break;
		case 'btnEdit': this.editUtilCode(); break;
		case 'btnDel': this.delUtilCode(); break;
		case 'btnMultiAdd_code':  this.uploadExcel(); break;
		case 'btnExcel': this.exportExcel(); break;
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
		$('#codeType').jqxDropDownList({width:'150', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
			source: [
				{ label: '선택', value: '' },			]
		});

		$('#menuType').on('change', function(event) {
			Main.getCodeType();
		});

		HmGrid.create($utilCodeGrid, {
			source: new $.jqx.dataAdapter(
				{
					datatype: 'json',
					url: ctxPath + '/nec/nms/utilCode/getUtilCodeList.do',
					datafields: [
						{ name: '', type: 'number' },
						{ name: 'codeSeq', type: 'int' },
						{ name: 'menuSeq', type: 'int' },
						{ name: 'codeType', type: 'int' },
						{ name: 'selValue', type: 'int' },
						{ name: 'menuName', type: 'string' },
						{ name: 'codeName', type: 'string' },
						{ name: 'selText', type: 'string' },
					]
				},
				{
					formatData: function(data) {

						var selectMenuType = $('#menuType').jqxDropDownList('getSelectedItem');
						var selectCodeType = $('#codeType').jqxDropDownList('getSelectedItem');
						var menuSeq , codeType , codeText='';
						if(selectMenuType!==undefined){
							menuSeq = selectMenuType.value;
						}

						if(selectCodeType!==undefined){
							codeType = selectCodeType.value;
						}

						$.extend(data, {
							menuSeq: menuSeq,
							codeType: codeType,
							codeText: $('#codeText').val(),
						});

						return data;
					}
				}
			),
			selectionmode: 'checkbox',
			altrows: false,
			pageable: true,
			pagesize : 500,
			pagerheight: 27,
			pagerrenderer : HmGrid.pagerrenderer,
			sortable : true,
			rowsheight : 37,
			columns:
				[
					{
						text: '#', sortable: false, filterable: false, editable: false,
						groupable: false, draggable: false, resizable: false,
						datafield: '', columntype: 'number', width: 45,
						cellsrenderer: function (row, column, value) {
							return "<div style='margin:7px;text-align: center;'>" + (value + 1) + "</div>";
						}
					},
					{ text : 'codeSeq', datafield: 'codeSeq', hidden: true },
					{ text : 'menuSeq', datafield: 'menuSeq', hidden: true },
					{ text : 'codeType', datafield: 'codeType', hidden: true  },
					{ text : 'selValue', datafield: 'selValue', hidden: true },
					{ text : '메뉴', datafield: 'menuName',  cellsalign: 'center' },
					{ text : '코드분류', datafield: 'codeName', cellsalign: 'center'},
					{ text : '코드명', datafield: 'selText', cellsalign: 'center'},
				]
		}, CtxMenu.COMM);

		$utilCodeGrid.on('cellclick', function (event) {
			// 우클릭일 경우 선택한 row id를 찾아서 unselect 처리
			// console.dir(event.args.rightclick);
			// console.dir(event.args.rowindex);
			if(event.args.rightclick){
				$utilCodeGrid.jqxGrid('unselectrow', event.args.rowindex );
			}
		});

		

	},

	/** init data */
	initData : function() {
		Main.getMenuType();
	},

	getMenuType : function(){
		Server.post('/nec/nms/utilCode/getMenuTypeList.do', {
			data: {},
			success: function(result) {
				var source2 = [];
				source2.push({ label: '선택', value: '' });

				$.each(result,function(idx,item){
					source2.push({ label: item.menuName , value: item.menuSeq });
				});

				$('#menuType').jqxDropDownList({width:'150', height: '22', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
					source: source2
				});
			}
		});
	},

	getCodeType : function(){
		var selectMenuType = $('#menuType').jqxDropDownList('getSelectedItem');

		Server.get('/nec/nms/utilCode/getCodeTypeList.do', {
			data: {menuSeq : selectMenuType.value},
			success: function(result) {

				var source2 = [];
				source2.push({ label: '선택', value: '' });

				$.each(result,function(idx,item){
					source2.push({ label: item.codeName , value: item.codeType });
				});

				$('#codeType').jqxDropDownList({width:'150', height: '22', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
					source: source2
				});
			}
		});
	},

	search: function() {
		HmGrid.updateBoundData( $utilCodeGrid , ctxPath + '/nec/nms/utilCode/getUtilCodeList.do' );
	},

	addUtilCode: function(){
		HmUtil.createPopup('/nec/popup/nms/pUtilCodeAdd.do', $('#hForm'), '코드 추가', 510, 350);
	},

	editUtilCode : function(){

		var rowindexes = $utilCodeGrid.jqxGrid('getselectedrowindexes');
		if(rowindexes.length < 1 ){
			alert("수정할 항목을 선택해주세요.");
			return false;
		}
		var temp;
		var cnt = 0;

		$.each(rowindexes,function(idx,item){
			temp = $utilCodeGrid.jqxGrid('getrowdata', item);
			cnt++;
		});

		if(cnt > 1 ){
			alert("수정은 한 번에 하나씩 할 수 있습니다.\n하나만 체크해주세요.");
		}else{
			var param = {
				codeSeq  : temp.codeSeq,
				menuSeq  : temp.menuSeq,
				codeType : temp.codeType,
				menuName : temp.menuName,
				codeName : temp.codeName,
				selValue : temp.selValue,
				selText  : temp.selText
			};
			console.dir(param);
			HmUtil.createPopup('/nec/popup/nms/pUtilCodeEdit.do', $('#hForm'), '코드 추가', 510, 350 , param);
		}

	},

	delUtilCode: function(){
		var rowindexes = $utilCodeGrid.jqxGrid('getselectedrowindexes');

		if(rowindexes.length == 0) {
			alert('삭제할 데이터를 선택하세요.');
			return;
		}
		var delList = [];
		$.each(rowindexes, function(idx, index) {
			var tempRow = $utilCodeGrid.jqxGrid('getrowdata', index);
			delList.push(tempRow.codeSeq);
		});

		if (confirm('선택된 데이터 '+delList.length+'개 를 삭제하시겠습니까?')){
			Server.post('/nec/nms/utilCode/delUtilCode.do', {
				data: { delList : delList },
				success: function(result) {
					//완전히 delete 하지 않고 del_yn 상태를 변경한다
					//삭제될 경우 코드를 기반으로 등록되어있는 데이터가 꼬이거나 오류를 뱉을 가능성이 있기 때문이다
					if(result == 1 ){
						alert("삭제되었습니다.");
						Main.search();
					}
				}
			});
				
		}else{
			return false;
		}

	},

	exportExcel : function(){
		// var grids = [$utilCodeGrid];
		// var titles = ['메뉴', '코드분류', '코드명'];
		// HmUtil.exportGridList(grids, titles, '코드관리');

		var selectMenuType = $('#menuType').jqxDropDownList('getSelectedItem');
		var selectCodeType = $('#codeType').jqxDropDownList('getSelectedItem');
		var menuSeq , codeType , codeText='';
		if(selectMenuType!==undefined){
			menuSeq = selectMenuType.value;
		}

		if(selectCodeType!==undefined){
			codeType = selectCodeType.value;
		}

		var params = {
			menuSeq: menuSeq,
			codeType: codeType,
			codeText: $('#codeText').val(),
		};

		HmUtil.exportExcel(ctxPath + '/nec/nms/utilCode/export.do', params);
	},


	uploadExcel : function(){
		var param = {};
		HmUtil.createPopup('/nec/popup/nms/pUtilCodeUpload.do', $('#hForm'), '코드 다중추가', 950, 560);
	},

};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});