var $manageGrid ,  $historyGrid , $dtlTab;

var Main = {
	/** variable */
	initVariable : function() {
		$manageGrid = $('#ipManageGrid');
		$historyGrid = $('#historyGrid');
		$dtlTab = $('#dtlTab');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) {
			Main.eventControl(event);
		});
		// $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });

		$('.searchBox').bind('keyup', function (event) {
			Main.keyupEventControl(event);
		});
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
			case 'btnIpRange2Cidr': this.ipRange2Cidr(); break;
			case 'btnIpRange': this.ipSubneting(); break;
			case 'btnSearch': this.search(); break;
			case 'btnAdd': this.addManage(); break;
			case 'btnEdit': this.editManage(); break;
			case 'btnDel': this.delManage(); break;
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

		$('#tabDIV').val('P');

		// selIpSort
		var sortItem = [
			{ label: '선택' , value: '' },
			{ label: '오름차순' , value: 'ASC' },
			{ label: '내림차순' , value: 'DESC' },
		];
		$('#selIpSort').jqxDropDownList({width:'70', height: '23px', dropDownHeight: 40, selectedIndex : 1, autoDropDownHeight: true,
			source: sortItem
		});

		$dtlTab.jqxTabs({//전체탭
			width: '100%', height: '100%', theme: jqxTheme,
			initTabContent: function (tab) {
				switch (tab) {
					case 0:
						HmGrid.create($manageGrid, {
							source: new $.jqx.dataAdapter(
								{
									datatype: 'json',
									url: ctxPath + '/nec/nms/ipManage/getIpManageList.do',
									datafields: [
										{ name: '', type: 'number' },
										{ name: 'ipSeq', type: 'int' },
										{ name: 'typeId', type: 'int' },
										{ name: 'typeIdStr', type: 'String' },
										{ name: 'netType', type: 'int' },
										{ name: 'netTypeStr', type: 'String' },
										{ name: 'netIp', type: 'string' },
										{ name: 'netMask', type: 'String' },
										{ name: 'purpose', type: 'String' },
										{ name: 'netName', type: 'string' },
										{ name: 'modelName', type: 'string' },
										{ name: 'useYn', type: 'int' },
										{ name: 'useYnStr', type: 'string' },
										{ name: 'ipPurpose', type: 'int' },
										{ name: 'ipPurposeStr', type: 'string' },
										{ name: 'osName', type: 'string' },
										{ name: 'useDept', type: 'string' },
										{ name: 'userName', type: 'string' },
										{ name: 'useStart', type: 'string' },
										{ name: 'useEnd', type: 'string' },
										{ name: 'applyDate', type: 'string' },
										{ name: 'comments', type: 'string' },
										{ name: 'iporder', type: 'string' },
										{ name: 'createDate', type: 'string' },
										{ name: 'updateDate', type: 'string' },
										{ name: 'createUser', type: 'string' },
										{ name: 'updateUser', type: 'string' },
										{ name: 'hisSeq', type: 'int' },
									]
								},
								{
									formatData: function(data) {

										var selTypeId = $('#selTypeId').jqxDropDownList('getSelectedItem');
										var selNetType = $('#selNetType').jqxDropDownList('getSelectedItem');
										var selUseYn = $('#selUseYn').jqxDropDownList('getSelectedItem');
										var selIpPurpose = $('#selIpPurpose').jqxDropDownList('getSelectedItem');
										var selIpSort = $('#selIpSort').jqxDropDownList('getSelectedItem'); //2022.09.16
										var typeId , netType , useYn , ipPurpose , ipSort;

										if(selTypeId!==undefined){
											typeId = selTypeId.value;
										}

										if(selNetType!==undefined){
											netType = selNetType.value;
										}

										if(selUseYn!==undefined){
											useYn = selUseYn.value;
										}

										if(selIpPurpose!==undefined){
											ipPurpose = selIpPurpose.value;
										}

										if(selIpSort!==undefined){
											ipSort = selIpSort.value; //2022.09.16
										}

										$.extend(data, {
											menuSeq : $('#menuSeq').val(),
											typeId : typeId,
											netType : netType,
											useYn : useYn,
											ipPurpose : ipPurpose,
											ipSort : ipSort, //2022.09.16
											searchText : $('#searchText').val()
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
							rowsheight : 37,
							sortable : true,
							columns:
								[
									{
										text: 'No', sortable: false, filterable: false, editable: false,
										groupable: false, draggable: false, resizable: false,
										datafield: '', columntype: 'number', width: 45,
										cellsrenderer: function (row, column, value) {
											return "<div style='margin:7px;text-align: center;'>" + (value + 1) + "</div>";
										}
									},
									{ text : '분류', datafield: 'typeId', displayfield: 'typeIdStr' ,  cellsalign: 'center' , width : 105 },
									{ text : '망구분', datafield: 'netType', displayfield: 'netTypeStr' ,  cellsalign: 'center' , width : 105 },
									{ text : '아이피', datafield: 'netIp', cellsalign: 'center' , width : 120 },
									{ text : 'Prefix(Mask bit)', datafield: 'netMask',  cellsalign: 'center' ,  width : 105 },
									{ text : '용도(부서)', datafield: 'purpose',  cellsalign: 'center' },
									{ text : '장비명(사용자)', datafield: 'netName',  cellsalign: 'center' },
									{ text : '모델명', datafield: 'modelName',  cellsalign: 'center' , width : 105 },
									{ text : '사용여부', datafield: 'useYn', displayfield: 'useYnStr' ,  cellsalign: 'center' , width : 105 },
									{ text : 'IP 용도', datafield: 'ipPurpose', displayfield: 'ipPurposeStr' ,  cellsalign: 'center' ,  width : 180 },
									{ text : 'OS', datafield: 'osName',  cellsalign: 'center' , hidden: true },
									{ text : '사용부서', datafield: 'useDept',  cellsalign: 'center' , hidden: true },
									{ text : '사용자', datafield: 'userName',  cellsalign: 'center' , hidden: true },
									{ text : '사용 시작일', datafield: 'useStart',  cellsalign: 'center' , hidden: true },
									{ text : '사용 만료일', datafield: 'useEnd',  cellsalign: 'center' ,  hidden: true },
									{ text : '승인일자', datafield: 'applyDate',  cellsalign: 'center' ,  hidden: true },
									{ text : '비고', datafield: 'comments',  cellsalign: 'center' , hidden: true },
									{ text : '생성일', datafield: 'createDate',  cellsalign: 'center' , hidden: true },
									{ text : '수정일', datafield: 'updateDate',  cellsalign: 'center' , hidden: true },
									{ text : '생성자', datafield: 'createUser',  cellsalign: 'center' , hidden: true },
									{ text : '수정자', datafield: 'updateUser',  cellsalign: 'center' , hidden: true },
									{ text : 'hisSeq', datafield: 'hisSeq',  cellsalign: 'center' , hidden: true },
									{ text : '상세조회', datafield: 'ipSeq', width: 60 , columntype: 'button' , cellclassname: "editCellBtn", cellsalign: 'center' ,
										cellsrenderer: function () {
											return "상세";
										}, buttonclick: function (row) {
											editrow = row;
											var dataRecord = $manageGrid.jqxGrid('getrowdata', editrow);
											var params = dataRecord;
											HmUtil.createPopup('/nec/popup/nms/pIpManageDetail.do', $('#hForm'), 'IP DB 상세조회', 700, 700 , params);
										}
									},
								],
						}, CtxMenu.COMM);

						$manageGrid.on('cellclick', function (event) {
							// 우클릭일 경우 선택한 row id를 찾아서 unselect 처리
							// console.dir(event.args.rightclick);
							// console.dir(event.args.rowindex);
							if(event.args.rightclick){
								$manageGrid.jqxGrid('unselectrow', event.args.rowindex );
							}
						});

						break;
					case 1:
						HmGrid.create($historyGrid, {
							source: new $.jqx.dataAdapter(
								{
									datatype: 'json',
									url: ctxPath + '/nec/nms/ipManage/getIpManageHistoryList.do',
									datafields: [
										{ name: '', type: 'number' },
										{ name: 'ipSeq', type: 'int' },
										{ name: 'typeId', type: 'int' },
										{ name: 'typeIdStr', type: 'String' },
										{ name: 'netType', type: 'int' },
										{ name: 'netTypeStr', type: 'String' },
										{ name: 'netIp', type: 'string' },
										{ name: 'netMask', type: 'String' },
										{ name: 'purpose', type: 'String' },
										{ name: 'netName', type: 'string' },
										{ name: 'modelName', type: 'string' },
										{ name: 'useYn', type: 'int' },
										{ name: 'useYnStr', type: 'string' },
										{ name: 'ipPurpose', type: 'int' },
										{ name: 'ipPurposeStr', type: 'string' },
										{ name: 'osName', type: 'string' },
										{ name: 'useDept', type: 'string' },
										{ name: 'userName', type: 'string' },
										{ name: 'useStart', type: 'string' },
										{ name: 'useEnd', type: 'string' },
										{ name: 'applyDate', type: 'string' },
										{ name: 'comments', type: 'string' },
										{ name: 'iporder', type: 'string' },
										{ name: 'createDate', type: 'string' },
										{ name: 'updateDate', type: 'string' },
										{ name: 'createUser', type: 'string' },
										{ name: 'updateUser', type: 'string' },
										{ name: 'hisSeq', type: 'int' },
										{ name: 'memo', type: 'string' },

									]
								},
								{
									formatData: function(data) {

										var selTypeId = $('#selTypeId').jqxDropDownList('getSelectedItem');
										var selNetType = $('#selNetType').jqxDropDownList('getSelectedItem');
										var selUseYn = $('#selUseYn').jqxDropDownList('getSelectedItem');
										var selIpPurpose = $('#selIpPurpose').jqxDropDownList('getSelectedItem');
										var selIpSort = $('#selIpSort').jqxDropDownList('getSelectedItem'); //2022.09.16
										var typeId , netType , useYn , ipPurpose, ipSort;

										if(selTypeId!==undefined){
											typeId = selTypeId.value;
										}

										if(selNetType!==undefined){
											netType = selNetType.value;
										}

										if(selUseYn!==undefined){
											useYn = selUseYn.value;
										}

										if(selIpPurpose!==undefined){
											ipPurpose = selIpPurpose.value;
										}

										if(selIpSort!==undefined){
											ipSort = selIpSort.value; //2022.09.16
										}

										$.extend(data, {
											menuSeq : $('#menuSeq').val(),
											typeId : typeId,
											netType : netType,
											useYn : useYn,
											ipPurpose : ipPurpose,
											ipSort : ipSort, //2022.09.16
											searchText : $('#searchText').val()
										});

										return data;
									}
								}
							),
							selectionmode: 'singleRow',
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
										text: 'No', sortable: false, filterable: false, editable: false,
										groupable: false, draggable: false, resizable: false,
										datafield: '', columntype: 'number', width: 45,
										cellsrenderer: function (row, column, value) {
											return "<div style='margin:7px;text-align: center;'>" + (value + 1) + "</div>";
										}
									},
									{ text : '분류', datafield: 'typeId', displayfield: 'typeIdStr' ,  cellsalign: 'center' , width : 105 },
									{ text : '망구분', datafield: 'netType', displayfield: 'netTypeStr' ,  cellsalign: 'center' , width : 105 },
									{ text : '아이피', datafield: 'netIp', cellsalign: 'center' ,  width : 120 },
									{ text : 'Prefix(Mask bit)', datafield: 'netMask',  cellsalign: 'center' , width : 105 },
									{ text : '용도(부서)', datafield: 'purpose',  cellsalign: 'center' },
									{ text : '장비명(사용자)', datafield: 'netName',  cellsalign: 'center' },
									{ text : '모델명', datafield: 'modelName',  cellsalign: 'center' , width : 105 },
									{ text : '사용여부', datafield: 'useYn', displayfield: 'useYnStr' ,  cellsalign: 'center' , width : 105 },
									{ text : 'IP 용도', datafield: 'ipPurpose', displayfield: 'ipPurposeStr' ,  cellsalign: 'center' ,  width : 180 },
									{ text : 'OS', datafield: 'osName',  cellsalign: 'center' ,  hidden: true },
									{ text : '사용부서', datafield: 'useDept',  cellsalign: 'center' ,  hidden: true },
									{ text : '사용자', datafield: 'userName',  cellsalign: 'center' ,  hidden: true },
									{ text : '사용 시작일', datafield: 'useStart',  cellsalign: 'center' ,  hidden: true },
									{ text : '사용 만료일', datafield: 'useEnd',  cellsalign: 'center' ,  hidden: true },
									{ text : '승인일자', datafield: 'applyDate',  cellsalign: 'center' ,  hidden: true },
									{ text : '비고', datafield: 'comments',  cellsalign: 'center' ,  hidden: true },
									{ text : '생성일', datafield: 'createDate',  cellsalign: 'center' , hidden: true },
									{ text : '수정일', datafield: 'updateDate',  cellsalign: 'center' , hidden: true },
									{ text : '생성자', datafield: 'createUser',  cellsalign: 'center' , hidden: true },
									{ text : '수정자', datafield: 'updateUser',  cellsalign: 'center' , hidden: true },
									{ text : '이력', datafield: 'memo',  cellsalign: 'center' ,  width : 180 },
									{ text : '상세조회', datafield: 'hisSeq', width: 60 , columntype: 'button' , cellclassname: "editCellBtn", cellsalign: 'center' ,
										cellsrenderer: function () {
											return "상세";
										}, buttonclick: function (row) {
											editrow = row;
											var dataRecord = $historyGrid.jqxGrid('getrowdata', editrow);
											var params = dataRecord;
											HmUtil.createPopup('/nec/popup/nms/pIpManageDetail.do', $('#hForm'), 'IP DB 상세조회', 700, 700 , params);
										}
									},
								],
						}, CtxMenu.COMM);

						$historyGrid.on('cellclick', function (event) {
							// 우클릭일 경우 선택한 row id를 찾아서 unselect 처리
							// console.dir(event.args.rightclick);
							// console.dir(event.args.rowindex);
							if(event.args.rightclick){
								$historyGrid.jqxGrid('unselectrow', event.args.rowindex );
							}
						});

						break;
				}

			}
		}).on('selected', function(event){
			var selectedTab = event.args.item;
			switch (selectedTab) {
				case 0:
					$('#tabDIV').val('P');
					// 이력아닐때는 해당 버튼 보이게함 btnEdit , btnDel
					$('#btnEdit').show();
					$('#btnDel').show();
					$('#btnIpRange2Cidr').show();
					$('#btnIpRange').show();
					break;
				case 1:
					$('#tabDIV').val('H');
					// 이력에서는 해당 버튼 숨김처리 btnEdit , btnDel
					$('#btnEdit').hide();
					$('#btnDel').hide();
					$('#btnIpRange2Cidr').hide();
					$('#btnIpRange').hide();
					break;
			}
			// Main.search();
		});

	},

	/** init data */
	initData : function() {
		Main.getSelTypeId();
		Main.getSelNetType();
		Main.getSelUseYn();
		Main.getSelIpPurpose();
	},

	getSelTypeId : function(){
		//분류
		Server.get('/nec/nms/ipManage/getIpCodeList.do', {
			data: {
				menuSeq : $('#menuSeq').val(),
				codeType : 1
			},
			success: function(result) {

				var cnt = 0;
				var source2 = [];
				source2.push({ label: '선택', value: '' });

				$.each(result,function(idx,item){
					source2.push({ label: item.selText , value: item.selValue });
					cnt++;
				});

				if(cnt>20){
					$('#selTypeId').jqxDropDownList({width:'150', height: '23px', dropDownHeight: 500, selectedIndex : 0, autoDropDownHeight: false,
						source: source2
					});
				}else{
					$('#selTypeId').jqxDropDownList({width:'150', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
						source: source2
					});
				}
			}
		});
	},

	getSelNetType : function(){
		//망구분
		Server.get('/nec/nms/ipManage/getIpCodeList.do', {
			data: {
				menuSeq : $('#menuSeq').val(),
				codeType : 2
			},
			success: function(result) {

				var cnt = 0;
				var source2 = [];
				source2.push({ label: '선택', value: '' });

				$.each(result,function(idx,item){
					source2.push({ label: item.selText , value: item.selValue });
					cnt++;
				});

				if(cnt>20){
					$('#selNetType').jqxDropDownList({width:'160', height: '23px', dropDownHeight: 500, selectedIndex : 0, autoDropDownHeight: false,
						source: source2
					});
				}else{
					$('#selNetType').jqxDropDownList({width:'160', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
						source: source2
					});
				}
			}
		});
	},

	getSelUseYn : function(){
		//사용여부
		Server.get('/nec/nms/ipManage/getIpCodeList.do', {
			data: {
				menuSeq : $('#menuSeq').val(),
				codeType : 3
			},
			success: function(result) {
				var cnt = 0;
				var source2 = [];
				source2.push({ label: '선택', value: '' });

				$.each(result,function(idx,item){
					source2.push({ label: item.selText , value: item.selValue });
					cnt++;
				});

				if(cnt>20){
					$('#selUseYn').jqxDropDownList({width:'120', height: '23px', dropDownHeight: 500, selectedIndex : 0, autoDropDownHeight: false,
						source: source2
					});
				}else{
					$('#selUseYn').jqxDropDownList({width:'120', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
						source: source2
					});
				}
			}
		});
	},

	getSelIpPurpose : function(){
		//사용여부
		Server.get('/nec/nms/ipManage/getIpCodeList.do', {
			data: {
				menuSeq : $('#menuSeq').val(),
				codeType : 4
			},
			success: function(result) {

				var cnt = 0;
				var source2 = [];
				source2.push({ label: '선택', value: '' });

				$.each(result,function(idx,item){
					source2.push({ label: item.selText , value: item.selValue });
					cnt++;
				});

				if(cnt>20){
					$('#selIpPurpose').jqxDropDownList({width:'195', height: '23px', dropDownHeight: 500, selectedIndex : 0, autoDropDownHeight: false,
						source: source2
					});
				}else{
					$('#selIpPurpose').jqxDropDownList({width:'195', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
						source: source2
					});
				}

			}
		});
	},


	search: function() {
		if( $('#tabDIV').val() == 'P'){
			HmGrid.updateBoundData( $manageGrid , ctxPath + '/nec/nms/ipManage/getIpManageList.do' );
		}else{
			HmGrid.updateBoundData( $historyGrid , ctxPath + '/nec/nms/ipManage/getIpManageHistoryList.do' );
		}
	},

	addManage: function(){
		HmUtil.createPopup('/nec/popup/nms/pIpManageAdd.do', $('#hForm'), 'IP DB 추가', 700, 760);
	},

	editManage : function(){

		var rowindexes = $manageGrid.jqxGrid('getselectedrowindexes');
		if(rowindexes.length < 1 ){
			alert("수정할 항목을 선택해주세요.");
			return false;
		}
		var temp;
		var cnt = 0;

		$.each(rowindexes,function(idx,item){
			temp = $manageGrid.jqxGrid('getrowdata', item);
			cnt++;
		});

		if(cnt > 1 ){
			alert("수정은 한 번에 하나씩 할 수 있습니다.\n하나만 체크해주세요.");
		}else{
			HmUtil.createPopup('/nec/popup/nms/pIpManageEdit.do', $('#hForm'), 'IP DB 수정', 700, 700 , temp);
		}

	},

	delManage: function(){
		var rowindexes = $manageGrid.jqxGrid('getselectedrowindexes');

		if(rowindexes.length == 0) {
			alert('삭제할 데이터를 선택하세요.');
			return;
		}
		var delList = [];
		$.each(rowindexes, function(idx, index) {
			var tempRow = $manageGrid.jqxGrid('getrowdata', index);
			delList.push(tempRow.ipSeq);
		});

		if (confirm('선택된 데이터 '+delList.length+'개 를 삭제하시겠습니까?')){
			Server.post('/nec/nms/ipManage/delIpManage.do', {
				data: { delList : delList },
				success: function(result) {
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
		var selTypeId = $('#selTypeId').jqxDropDownList('getSelectedItem');
		var selNetType = $('#selNetType').jqxDropDownList('getSelectedItem');
		var selUseYn = $('#selUseYn').jqxDropDownList('getSelectedItem');
		var selIpPurpose = $('#selIpPurpose').jqxDropDownList('getSelectedItem');
		var typeId , netType , useYn , ipPurpose;

		if(selTypeId!==undefined){
			typeId = selTypeId.value;
		}

		if(selNetType!==undefined){
			netType = selNetType.value;
		}

		if(selUseYn!==undefined){
			useYn = selUseYn.value;
		}

		if(selIpPurpose!==undefined){
			ipPurpose = selIpPurpose.value;
		}

		var params = {
			menuSeq : $('#menuSeq').val(),
			typeId : typeId,
			netType : netType,
			useYn : useYn,
			ipPurpose : ipPurpose,
			searchText : $('#searchText').val(),
			tabDiv : $('#tabDIV').val()
		};

		HmUtil.exportExcel(ctxPath + '/nec/nms/ipManage/export.do', params);

	},


	uploadExcel : function(){
		var param = {};
		HmUtil.createPopup('/nec/popup/nms/pIpManageUpload.do', $('#hForm'), 'IP DB 다중추가', 950, 560);
	},

	ipRange2Cidr : function(){
		//최소 2개 선택했는지, 3개 이상 선택하지는 않았는지 확인하기 ==> 합치는 2개까지만 가능하기 땜누에 
		//2개 선택이면 합치기 가능한지 service로 보내서 확인하기

		var rowindexes = $manageGrid.jqxGrid('getselectedrowindexes');
		if(rowindexes.length < 1 ){
			alert("선택된 항목이 없습니다.");
			return false;
		}
		var temp;
		var cnt = 0;

		var ipList = [];

		$.each(rowindexes,function(idx,item){
			temp = $manageGrid.jqxGrid('getrowdata', item);
			ipList.push(temp);
			cnt++;
		});

		if( cnt > 2 ){
			alert("IP대역합치기는 두 개만 가능 합니다.");
			return false;
		}else if( cnt == 1 ) {
			alert("합치고자 하는 항목을 두 개 선택해주세요.");
			return false;
		}
		else{
			//동일한 prefix만 허용함
			console.log("드디어 합치기 할 수 있음");

			var tempNetMask;
			var TF = true;
			$.each(ipList,function(idx,item){
				console.dir(item);
				console.dir(item.netMask);
				console.log(tempNetMask);
				if( tempNetMask == null || tempNetMask == '' ){
					tempNetMask = item.netMask;
				}else{
					if( tempNetMask != item.netMask ){
						TF = false;
					}
				}
			});

			if(!TF){
				alert("다른 Prefix bit를 가진 대역끼리는 합치기가 불가합니다.");
				return false;
			}

			Server.post('/nec/nms/ipManage/ipRange2Cidr.do', {
				data: { ipList : ipList },
				success: function(result) {
					console.dir(result);
					alert(result);
					Main.search();
				}
			});

		}


	},

	ipSubneting : function(){
		console.log("IP 대역폭 나누기~");

		var rowindexes = $manageGrid.jqxGrid('getselectedrowindexes');
		if(rowindexes.length < 1 ){
			alert("나누기 할 항목을 선택해주세요.");
			return false;
		}
		var temp;
		var cnt = 0;

		$.each(rowindexes,function(idx,item){
			temp = $manageGrid.jqxGrid('getrowdata', item);
			cnt++;
		});

		if(cnt > 1 ){
			alert("대역 나누기는 하나만 할 수 있습니다.\n하나만 체크해주세요.");
		}else{
			console.log("대역 나누기 선택한 값 확인");
			console.dir(temp);
			// HmUtil.createPopup('/nec/popup/nms/pIpManageEdit.do', $('#hForm'), 'IP DB 수정', 700, 700 , temp);
			//대역폭 나누기 팝업창
			HmUtil.createPopup('/nec/popup/nms/pIpSubneting.do', $('#hForm'), 'IP대역 나누기', 700, 600, temp);
		}

	}


};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});