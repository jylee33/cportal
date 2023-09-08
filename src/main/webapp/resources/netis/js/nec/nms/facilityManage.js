var $facilityManageGrid ,  $historyGrid , $dtlTab;

var Main = {
	/** variable */
	initVariable : function() {
		$facilityManageGrid = $('#facilityManageGrid');
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
		case 'btnSearch': this.search(); break;
		case 'btnAdd': this.addFacilityManage(); break;
		case 'btnEdit': this.editFacilityManage(); break;
		case 'btnDel': this.delFacilityManage(); break;
		case 'btnMultiAdd_code':  this.uploadExcel(); break;
		case 'btnExcel': this.exportExcel(); break;
		}
	},

	/** keyup event handler */
	keyupEventControl: function(event) {
		if(event.keyCode == 13) {
			console.log("엔터누름");
			Main.search();
		}
	},

	/** init design */
	initDesign : function() {
		$('#selTypeId').jqxDropDownList({width:'150', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
			source: [
				{ label: '선택', value: '' },			]
		});

		$('#tabDIV').val('P');

		$dtlTab.jqxTabs({//전체탭
			width: '100%', height: '100%', theme: jqxTheme,
			initTabContent: function (tab) {
				switch (tab) {
					case 0:
						HmGrid.create($facilityManageGrid, {
							source: new $.jqx.dataAdapter(
								{
									datatype: 'json',
									url: ctxPath + '/nec/nms/facilityManage/getFacilityManageList.do',
									datafields: [
										{ name: '', type: 'number' },
										{ name: 'fcdbSeq', type: 'int' },
										{ name: 'typeId', type: 'int' },
										{ name: 'typeIdStr', type: 'String' },
										{ name: 'netType', type: 'int' },
										{ name: 'netTypeStr', type: 'String' },
										{ name: 'areaName', type: 'int' },
										{ name: 'areaNameStr', type: 'String' },
										{ name: 'hostName', type: 'string' },
										{ name: 'layer', type: 'int' },
										{ name: 'layerStr', type: 'String' },
										{ name: 'purpose', type: 'string' },
										{ name: 'mType', type: 'int' },
										{ name: 'mTypeStr', type: 'String' },
										{ name: 'vendorName', type: 'string' },
										{ name: 'commIp', type: 'string' },
										{ name: 'manageIp', type: 'string' },
										{ name: 'connType', type: 'string' },
										{ name: 'manageCoupFl', type: 'int' },
										{ name: 'manageCoupFlStr', type: 'String' },
										{ name: 'tacacsConnFl', type: 'int' },
										{ name: 'tacacsConnFlStr', type: 'String' },
										{ name: 'tacacsManageFl', type: 'int' },
										{ name: 'tacacsManageFlStr', type: 'String' },
										{ name: 'directConnFl', type: 'int' },
										{ name: 'directConnFlStr', type: 'String' },
										{ name: 'directManageFl', type: 'int' },
										{ name: 'directManageFlStr', type: 'String' },
										{ name: 'syslogFl', type: 'int' },
										{ name: 'syslogFlStr', type: 'String' },
										{ name: 'commerceTitle', type: 'string' },
										{ name: 'installDate', type: 'string' },
										{ name: 'warrantyExpire', type: 'string' },
										{ name: 'serialNo', type: 'string' },
										{ name: 'durableYears', type: 'string' },
										{ name: 'historyManage', type: 'int' },
										{ name: 'historyManageStr', type: 'String' },
										{ name: 'manager', type: 'string' },
										{ name: 'comments', type: 'string' },
										{ name: 'manageCorp', type: 'string' },
										{ name: 'manageName', type: 'string' },
										{ name: 'managePhone', type: 'string' },
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
										var selAreaName = $('#selAreaName').jqxDropDownList('getSelectedItem');
										var selMType = $('#selMType').jqxDropDownList('getSelectedItem');
										var selHisManage = $('#selHisManage').jqxDropDownList('getSelectedItem');
										var typeId , netType , areaName , mType , historyManage ;

										if(selTypeId!==undefined){
											typeId = selTypeId.value;
										}
										if(selNetType!==undefined){
											netType = selNetType.value;
										}
										if(selAreaName!==undefined){
											areaName = selAreaName.value;
										}
										if(selMType!==undefined){
											mType = selMType.value;
										}
										if(selHisManage!==undefined){
											historyManage = selHisManage.value;
										}

										$.extend(data, {
											menuSeq : $('#menuSeq').val(),
											typeId : typeId,
											netType : netType,
											areaName : areaName,
											mType : mType,
											historyManage : historyManage,
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
							sortable : true,
							rowsheight : 37,
							columns:
								[
									{
										text: 'No', sortable: false, filterable: false, editable: false,
										groupable: false, draggable: false, resizable: false,
										datafield: '', columntype: 'number', width: 35,
										cellsrenderer: function (row, column, value) {
											return "<div style='margin:7px;text-align: center;'>" + (value + 1) + "</div>";
										}
									},
									{ text : '분류', datafield: 'typeId',  displayfield: 'typeIdStr' , cellsalign: 'center' , width : 65 },
									{ text : '망구분', datafield: 'netType', displayfield: 'netTypeStr' ,  cellsalign: 'center' , width : 155 },
									{ text : '지역', datafield: 'areaName', displayfield: 'areaNameStr' ,  cellsalign: 'center' , width : 160 },
									{ text : 'Hostname', datafield: 'hostName',  cellsalign: 'center' , width : 200  },
									{ text : 'Layer', datafield: 'layer', displayfield: 'layerStr' ,  cellsalign: 'center' , width : 70  },
									{ text : '용도', datafield: 'purpose',  cellsalign: 'center' , width : 180 },
									{ text : '장비종류', datafield: 'mType', displayfield: 'mTypeStr' ,  cellsalign: 'center' , width : 135 },
									{ text : '제조사', datafield: 'vendorName',  cellsalign: 'center' , width : 85 },
									{ text : '통신IP', datafield: 'commIp',  cellsalign: 'center' , width : 90 },
									{ text : '관리망 IP', datafield: 'manageIp',  cellsalign: 'center' , width : 90 },
									{ text : '접속방법', datafield: 'connType',  cellsalign: 'center' , width : 120 ,
										cellsrenderer: function (row, column, value) {
											if(value.charAt(value.length - 1) == '/'){
												var renderHtml = "<div style='margin:11px;text-align: center;'>"+value.slice(0, -1)+"</div>";
											}else{
												var renderHtml = "<div style='margin:11px;text-align: center;'>"+value+"</div>";
											}
											return renderHtml;
										}
									},
									{ text : '관리망 연동', datafield: 'manageCoupFl', displayfield: 'manageCoupFlStr' ,  cellsalign: 'center' , hidden: true },
									{ text : '통신', datafield: 'tacacsConnFl', displayfield: 'tacacsConnFlStr' ,  cellsalign: 'center' , width : 62 ,columngroup: 'tacacs'  },
									{ text : '관리', datafield: 'tacacsManageFl', displayfield: 'tacacsManageFlStr' ,  cellsalign: 'center' ,  width : 62 , columngroup: 'tacacs' },
									{ text : '통신', datafield: 'directConnFl', displayfield: 'directConnFlStr' ,  cellsalign: 'center' ,  width : 62 , columngroup: 'direct' },
									{ text : '관리', datafield: 'directManageFl', displayfield: 'directManageFlStr' ,  cellsalign: 'center' , width : 62 , columngroup: 'direct' },
									{ text : 'Syslog 수집', datafield: 'syslogFl', displayfield: 'syslogFlStr' ,  cellsalign: 'center' , hidden: true },
									{ text : '사업명', datafield: 'commerceTitle',  cellsalign: 'center' , width : 180 },
									{ text : '도입일', datafield: 'installDate',  cellsalign: 'center' , hidden: true },
									{ text : 'Warranty 만기일', datafield: 'warrantyExpire',  cellsalign: 'center' , hidden: true },
									{ text : 'Serial No', datafield: 'serialNo',  cellsalign: 'center' , hidden: true },
									{ text : '내용연수', datafield: 'durableYears',  cellsalign: 'center' , width : 70 },
									{ text : '이력관리', datafield: 'historyManage', displayfield: 'historyManageStr' ,  cellsalign: 'center' , hidden: true },
									{ text : '직원담당자', datafield: 'manager',  cellsalign: 'center' , width : 80 },
									{ text : '비고', datafield: 'comments',  cellsalign: 'center' , hidden: true },
									{ text : '(유지보수)회사', datafield: 'manageCorp',  cellsalign: 'center' , hidden: true },
									{ text : '(유지보수)담당자', datafield: 'manageName',  cellsalign: 'center' , hidden: true },
									{ text : '(유지보수)전화번호', datafield: 'managePhone',  cellsalign: 'center' , hidden: true },
									{ text : '생성일', datafield: 'createDate',  cellsalign: 'center' , hidden: true },
									{ text : '수정일', datafield: 'updateDate',  cellsalign: 'center' , hidden: true },
									{ text : '생성자', datafield: 'createUser',  cellsalign: 'center' , hidden: true },
									{ text : '수정자', datafield: 'updateUser',  cellsalign: 'center' , hidden: true },
									{ text : 'hisSeq', datafield: 'hisSeq',  cellsalign: 'center' , hidden: true },
									{ text : '상세조회', datafield: 'fcdbSeq', width: 60 , columntype: 'button' , cellclassname: "editCellBtn", cellsalign: 'center' ,
										cellsrenderer: function () {
											return "상세";
										}, buttonclick: function (row) {
											editrow = row;
											var dataRecord = $facilityManageGrid.jqxGrid('getrowdata', editrow);
											var params = dataRecord;
											HmUtil.createPopup('/nec/popup/nms/pFacilityManageDetail.do', $('#hForm'), '시설DB 상세조회', 650, 700 , params);
										}
									},
								],
							columngroups: [
								{text: 'TACACS 계정접속', align: 'center', name: 'tacacs'},
								{text: '직접접속', align: 'center', name: 'direct'}
							]
						}, CtxMenu.COMM);

						$facilityManageGrid.on('cellclick', function (event) {
							// 우클릭일 경우 선택한 row id를 찾아서 unselect 처리
							// console.dir(event.args.rightclick);
							// console.dir(event.args.rowindex);
							if(event.args.rightclick){
								$facilityManageGrid.jqxGrid('unselectrow', event.args.rowindex );
							}
						});
						break;
					case 1:
						HmGrid.create($historyGrid, {
							source: new $.jqx.dataAdapter(
								{
									datatype: 'json',
									url: ctxPath + '/nec/nms/facilityManage/getFacilityManageHistoryList.do',
									datafields: [
										{ name: '', type: 'number' },
										{ name: 'fcdbSeq', type: 'int' },
										{ name: 'typeId', type: 'int' },
										{ name: 'typeIdStr', type: 'String' },
										{ name: 'netType', type: 'int' },
										{ name: 'netTypeStr', type: 'String' },
										{ name: 'areaName', type: 'int' },
										{ name: 'areaNameStr', type: 'String' },
										{ name: 'hostName', type: 'string' },
										{ name: 'layer', type: 'int' },
										{ name: 'layerStr', type: 'String' },
										{ name: 'purpose', type: 'string' },
										{ name: 'mType', type: 'int' },
										{ name: 'mTypeStr', type: 'String' },
										{ name: 'vendorName', type: 'string' },
										{ name: 'commIp', type: 'string' },
										{ name: 'manageIp', type: 'string' },
										{ name: 'connType', type: 'string' },
										{ name: 'manageCoupFl', type: 'int' },
										{ name: 'manageCoupFlStr', type: 'String' },
										{ name: 'tacacsConnFl', type: 'int' },
										{ name: 'tacacsConnFlStr', type: 'String' },
										{ name: 'tacacsManageFl', type: 'int' },
										{ name: 'tacacsManageFlStr', type: 'String' },
										{ name: 'directConnFl', type: 'int' },
										{ name: 'directConnFlStr', type: 'String' },
										{ name: 'directManageFl', type: 'int' },
										{ name: 'directManageFlStr', type: 'String' },
										{ name: 'syslogFl', type: 'int' },
										{ name: 'syslogFlStr', type: 'String' },
										{ name: 'commerceTitle', type: 'string' },
										{ name: 'installDate', type: 'string' },
										{ name: 'warrantyExpire', type: 'string' },
										{ name: 'serialNo', type: 'string' },
										{ name: 'durableYears', type: 'string' },
										{ name: 'historyManage', type: 'int' },
										{ name: 'historyManageStr', type: 'String' },
										{ name: 'manager', type: 'string' },
										{ name: 'comments', type: 'string' },
										{ name: 'manageCorp', type: 'string' },
										{ name: 'manageName', type: 'string' },
										{ name: 'managePhone', type: 'string' },
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
										var selAreaName = $('#selAreaName').jqxDropDownList('getSelectedItem');
										var selMType = $('#selMType').jqxDropDownList('getSelectedItem');
										var selHisManage = $('#selHisManage').jqxDropDownList('getSelectedItem');
										var typeId , netType , areaName , mType , historyManage ;

										if(selTypeId!==undefined){
											typeId = selTypeId.value;
										}
										if(selNetType!==undefined){
											netType = selNetType.value;
										}
										if(selAreaName!==undefined){
											areaName = selAreaName.value;
										}
										if(selMType!==undefined){
											mType = selMType.value;
										}
										if(selHisManage!==undefined){
											historyManage = selHisManage.value;
										}

										$.extend(data, {
											menuSeq : $('#menuSeq').val(),
											typeId : typeId,
											netType : netType,
											areaName : areaName,
											mType : mType,
											historyManage : historyManage,
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
										datafield: '', columntype: 'number', width: 35,
										cellsrenderer: function (row, column, value) {
											return "<div style='margin:7px;text-align: center;'>" + (value + 1) + "</div>";
										}
									},
									{ text : '분류', datafield: 'typeId',  displayfield: 'typeIdStr' , cellsalign: 'center' , width : 65 },
									{ text : '망구분', datafield: 'netType', displayfield: 'netTypeStr' ,  cellsalign: 'center' , width : 155 },
									{ text : '지역', datafield: 'areaName', displayfield: 'areaNameStr' ,  cellsalign: 'center' , width : 160 },
									{ text : 'Hostname', datafield: 'hostName',  cellsalign: 'center' , width : 200  },
									{ text : 'Layer', datafield: 'layer', displayfield: 'layerStr' ,  cellsalign: 'center' , width : 70 },
									{ text : '용도', datafield: 'purpose',  cellsalign: 'center' , width : 180 },
									{ text : '장비종류', datafield: 'mType', displayfield: 'mTypeStr' ,  cellsalign: 'center' ,  width : 135 },
									{ text : '제조사', datafield: 'vendorName',  cellsalign: 'center' , width : 85 },
									{ text : '통신IP', datafield: 'commIp',  cellsalign: 'center' , width : 90 },
									{ text : '관리망 IP', datafield: 'manageIp',  cellsalign: 'center' , width : 90 },
									{ text : '접속방법', datafield: 'connType',  cellsalign: 'center' , width : 120 ,
										cellsrenderer: function (row, column, value) {
											var renderHtml = "<div style='margin:11px;text-align: center;'>"+value.slice(0, -1)+"</div>";
											return renderHtml;
										}
									},
									{ text : '관리망 연동', datafield: 'manageCoupFl', displayfield: 'manageCoupFlStr' ,  cellsalign: 'center' , hidden: true },
									{ text : '통신', datafield: 'tacacsConnFl', displayfield: 'tacacsConnFlStr' ,  cellsalign: 'center' , width : 62 , columngroup: 'tacacs'  },
									{ text : '관리', datafield: 'tacacsManageFl', displayfield: 'tacacsManageFlStr' ,  cellsalign: 'center' , width : 62  , columngroup: 'tacacs' },
									{ text : '통신', datafield: 'directConnFl', displayfield: 'directConnFlStr' ,  cellsalign: 'center' , width : 62  , columngroup: 'direct' },
									{ text : '관리', datafield: 'directManageFl', displayfield: 'directManageFlStr' ,  cellsalign: 'center' , width : 62  , columngroup: 'direct' },
									{ text : 'Syslog 수집', datafield: 'syslogFl', displayfield: 'syslogFlStr' ,  cellsalign: 'center' , hidden: true },
									{ text : '사업명', datafield: 'commerceTitle',  cellsalign: 'center' , width : 180 },
									{ text : '도입일', datafield: 'installDate',  cellsalign: 'center' , hidden: true },
									{ text : 'Warranty 만기일', datafield: 'warrantyExpire',  cellsalign: 'center' , hidden: true },
									{ text : 'Serial No', datafield: 'serialNo',  cellsalign: 'center' , hidden: true },
									{ text : '내용연수', datafield: 'durableYears',  cellsalign: 'center' , width : 70 },
									{ text : '이력관리', datafield: 'historyManage', displayfield: 'historyManageStr' ,  cellsalign: 'center' , hidden: true },
									{ text : '직원담당자', datafield: 'manager',  cellsalign: 'center' , width : 80 },
									{ text : '비고', datafield: 'comments',  cellsalign: 'center' , hidden: true },
									{ text : '(유지보수)회사', datafield: 'manageCorp',  cellsalign: 'center' , hidden: true },
									{ text : '(유지보수)담당자', datafield: 'manageName',  cellsalign: 'center' , hidden: true },
									{ text : '(유지보수)전화번호', datafield: 'managePhone',  cellsalign: 'center' , hidden: true },
									{ text : '생성일', datafield: 'createDate',  cellsalign: 'center' , hidden: true },
									{ text : '수정일', datafield: 'updateDate',  cellsalign: 'center' , hidden: true },
									{ text : '생성자', datafield: 'createUser',  cellsalign: 'center' , hidden: true },
									{ text : '수정자', datafield: 'updateUser',  cellsalign: 'center' , hidden: true },
									{ text : '이력', datafield: 'memo',  cellsalign: 'center' , width : 180 },
									{ text : '상세조회', datafield: 'hisSeq', width: 60 , columntype: 'button' , cellclassname: "editCellBtn", cellsalign: 'center' ,
										cellsrenderer: function () {
											return "상세";
										}, buttonclick: function (row) {
											editrow = row;
											var dataRecord = $historyGrid.jqxGrid('getrowdata', editrow);
											var params = dataRecord;
											// console.log('히스토리 상세조회');
											HmUtil.createPopup('/nec/popup/nms/pFacilityManageDetail.do', $('#hForm'), '시설DB 상세조회', 650, 700 , params);
										}
									},
								],
							columngroups: [
								{text: 'TACACS 계정접속', align: 'center', name: 'tacacs'},
								{text: '직접접속', align: 'center', name: 'direct'}
							]
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
					break;
				case 1:
					$('#tabDIV').val('H');
					// 이력에서는 해당 버튼 숨김처리 btnEdit , btnDel
					$('#btnEdit').hide();
					$('#btnDel').hide();
					break;
			}
			// Main.search();
		});
	},

	/** init data */
	initData : function() {
		Main.getSelTypeId();
		Main.getSelNetType();
		Main.getSelAreaName();
		Main.getSelMType();
		Main.getSelHisManage();
	},

	getSelTypeId : function(){
		Server.get('/nec/nms/facilityManage/getFacilityCodeList.do', {
			data: {
				menuSeq : $('#menuSeq').val(),
				codeType : 1
			},
			success: function(result) {
				var source2 = [];
				source2.push({ label: '선택', value: '' });

				$.each(result,function(idx,item){
					source2.push({ label: item.selText , value: item.selValue });
				});

				$('#selTypeId').jqxDropDownList({width:'100', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
					source: source2
				});
			}
		});
	},

	getSelNetType : function(){
		Server.get('/nec/nms/facilityManage/getFacilityCodeList.do', {
			data: {
				menuSeq : $('#menuSeq').val(),
				codeType : 2
			},
			success: function(result) {
				var source2 = [];
				source2.push({ label: '선택', value: '' });

				$.each(result,function(idx,item){
					source2.push({ label: item.selText , value: item.selValue });
				});

				$('#selNetType').jqxDropDownList({width:'175', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
					source: source2
				});
			}
		});
	},

	getSelAreaName : function(){
		Server.get('/nec/nms/facilityManage/getFacilityCodeList.do', {
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
					$('#selAreaName').jqxDropDownList({width:'195', height: '23px', dropDownHeight: 500, selectedIndex : 0, autoDropDownHeight: false,
						source: source2
					});
				}else{
					$('#selAreaName').jqxDropDownList({width:'195', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
						source: source2
					});
				}
			}
		});
	},

	getSelMType : function(){
		Server.get('/nec/nms/facilityManage/getFacilityCodeList.do', {
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
					$('#selMType').jqxDropDownList({width:'175', height: '23px', dropDownHeight: 500, selectedIndex : 0, autoDropDownHeight: false,
						source: source2
					});
				}else{
					$('#selMType').jqxDropDownList({width:'175', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
						source: source2
					});
				}
			}
		});
	},

	getSelHisManage : function(){
		Server.get('/nec/nms/facilityManage/getFacilityCodeList.do', {
			data: {
				menuSeq : $('#menuSeq').val(),
				codeType : 5
			},
			success: function(result) {
				var source2 = [];
				source2.push({ label: '선택', value: '' });

				$.each(result,function(idx,item){
					source2.push({ label: item.selText , value: item.selValue });
				});

				$('#selHisManage').jqxDropDownList({width:'120', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
					source: source2
				});
			}
		});
	},

	search: function() {
		if( $('#tabDIV').val() == 'P'){
			HmGrid.updateBoundData( $facilityManageGrid , ctxPath + '/nec/nms/facilityManage/getFacilityManageList.do' );
		}else{
			HmGrid.updateBoundData( $historyGrid , ctxPath + '/nec/nms/facilityManage/getFacilityManageHistoryList.do' );
		}
	},

	addFacilityManage: function(){
		HmUtil.createPopup('/nec/popup/nms/pFacilityManageAdd.do', $('#hForm'), '시설DB 추가', 650, 700);
	},

	editFacilityManage : function(){

		var rowindexes = $facilityManageGrid.jqxGrid('getselectedrowindexes');
		if(rowindexes.length < 1 ){
			alert("수정할 항목을 선택해주세요.");
			return false;
		}
		var temp;
		var cnt = 0;

		$.each(rowindexes,function(idx,item){
			temp = $facilityManageGrid.jqxGrid('getrowdata', item);
			cnt++;
		});

		if(cnt > 1 ){
			alert("수정은 한 번에 하나씩 할 수 있습니다.\n하나만 체크해주세요.");
		}else{
			HmUtil.createPopup('/nec/popup/nms/pFacilityManageEdit.do', $('#hForm'), '시설DB 수정', 650, 700 , temp);
		}

	},

	delFacilityManage: function(){
		var rowindexes = $facilityManageGrid.jqxGrid('getselectedrowindexes');

		if(rowindexes.length == 0) {
			alert('삭제할 데이터를 선택하세요.');
			return;
		}
		var delList = [];
		$.each(rowindexes, function(idx, index) {
			var tempRow = $facilityManageGrid.jqxGrid('getrowdata', index);
			delList.push(tempRow.fcdbSeq);
		});

		if (confirm('선택된 데이터 '+delList.length+'개 를 삭제하시겠습니까?')){
			Server.post('/nec/nms/facilityManage/delFacilityManage.do', {
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

		var selTypeId = $('#selTypeId').jqxDropDownList('getSelectedItem');
		var selNetType = $('#selNetType').jqxDropDownList('getSelectedItem');
		var selAreaName = $('#selAreaName').jqxDropDownList('getSelectedItem');
		var selMType = $('#selMType').jqxDropDownList('getSelectedItem');
		var selHisManage = $('#selHisManage').jqxDropDownList('getSelectedItem');
		var typeId , netType , areaName , mType , historyManage ;

		if(selTypeId!==undefined){
			typeId = selTypeId.value;
		}
		if(selNetType!==undefined){
			netType = selNetType.value;
		}
		if(selAreaName!==undefined){
			areaName = selAreaName.value;
		}
		if(selMType!==undefined){
			mType = selMType.value;
		}
		if(selHisManage!==undefined){
			historyManage = selHisManage.value;
		}

		var params = {
			menuSeq : $('#menuSeq').val(),
			typeId : typeId,
			netType : netType,
			areaName : areaName,
			mType : mType,
			historyManage : historyManage,
			searchText : $('#searchText').val(),
			tabDiv : $('#tabDIV').val()
		};

		HmUtil.exportExcel(ctxPath + '/nec/nms/facilityManage/export.do', params);

	},


	uploadExcel : function(){
		var param = {};
		HmUtil.createPopup('/nec/popup/nms/pFacilityManageUpload.do', $('#hForm'), '시설DB 다중추가', 950, 560);
	},

};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});