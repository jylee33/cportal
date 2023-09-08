var $manageGrid ,  $historyGrid , $dtlTab;

var Main = {
	/** variable */
	initVariable : function() {
		$manageGrid = $('#l4ManageGrid');
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

		$dtlTab.jqxTabs({//전체탭
			width: '100%', height: '100%', theme: jqxTheme,
			initTabContent: function (tab) {
				switch (tab) {
					case 0:
						HmGrid.create($manageGrid, {
							source: new $.jqx.dataAdapter(
								{
									datatype: 'json',
									url: ctxPath + '/nec/nms/l4Manage/getL4ManageList.do',
									datafields: [
										{ name: '', type: 'number' },
										{ name: 'l4Seq', type: 'int' },
										{ name: 'netType', type: 'int' },
										{ name: 'netTypeStr', type: 'String' },
										{ name: 'fcdbSeq', type: 'int' },
										{ name: 'hostname', type: 'String' },
										{ name: 'l4Vip', type: 'string' },
										{ name: 'vipPurpose', type: 'String' },
										{ name: 'realPort', type: 'String' },
										{ name: 'protocol', type: 'string' },
										{ name: 'lbMethod', type: 'string' },
										{ name: 'health', type: 'String' },
										{ name: 'stickyTime', type: 'string' },
										{ name: 'serverParm', type: 'int' },
										{ name: 'serverParmStr', type: 'string' },
										{ name: 'useDept', type: 'string' },
										{ name: 'manager', type: 'string' },
										{ name: 'dbConnInfo', type: 'string' },
										{ name: 'firewallPolicy', type: 'string' },
										{ name: 'networkConnPolicy', type: 'string' },
										{ name: 'comments', type: 'string' },
										{ name: 'slbName', type: 'string' },
										{ name: 'vipPort', type: 'string' },
										{ name: 'realIp', type: 'string' },
										{ name: 'serverPurpose', type: 'string' },
										{ name: 'serverHostname', type: 'string' },
										{ name: 'useYn', type: 'int' },
										{ name: 'useYnStr', type: 'string' },
										{ name: 'createDate', type: 'string' },
										{ name: 'updateDate', type: 'string' },
										{ name: 'createUser', type: 'string' },
										{ name: 'updateUser', type: 'string' },
										{ name: 'hisSeq', type: 'int' },
									]
								},
								{
									formatData: function(data) {

										var selNetType = $('#selNetType').jqxDropDownList('getSelectedItem');
										var selServerParm = $('#selServerParm').jqxDropDownList('getSelectedItem');
										var selUseYn = $('#selUseYn').jqxDropDownList('getSelectedItem');
										var selHostname = $('#selHostname').jqxDropDownList('getSelectedItem');
										var netType , serverParm , useYn , hostname;

										if(selNetType!==undefined){
											netType = selNetType.value;
										}
										if(selServerParm!==undefined){
											serverParm = selServerParm.value;
										}
										if(selUseYn!==undefined){
											useYn = selUseYn.value;
										}
										if(selHostname!==undefined){
											hostname = selHostname.value;
										}

										$.extend(data, {
											menuSeq : $('#menuSeq').val(),
											netType : netType,
											serverParm : serverParm,
											useYn : useYn,
											hostname : hostname,
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
							// sortable : false,
							// autorowheight: true,
							cellhover: function(tableCell, x, y)
							{
								var cell = $manageGrid.jqxGrid('getcellatposition', x, y);

								if(cell.column == 'vipPurpose' || cell.column == 'realPort' || cell.column == 'protocol' ||cell.column == 'slbName' ||cell.column == 'vipPort'||cell.column == 'realIp'||cell.column == 'serverPurpose' ||cell.column == 'serverHostname' ){

									var obj = $(tableCell.innerHTML);
									// console.log("hover 할 때 확인하기");
									// console.log(obj.text());

									if(obj.text() != ''){

										var tempArr = obj.text().split(',');
										var tempHtml = "";

										if(tempArr.length > 1){
											$.each(tempArr, function(idx, value) {
												tempHtml += value + "<br>";
											});
										}
										else{
											tempHtml = obj.text();
										}

										$manageGrid.jqxTooltip({ content: "<div style='width:100%;height:100%;font-size: 15px;'>"+tempHtml+"</div>" });
										// open tooltip.
										if( x + 100 > window.innerWidth &&  y + 100 > window.innerHeight ){
											var tempX = (x + 100)-window.innerWidth;
											var tempY = (y + 100)-window.innerHeight;
											$manageGrid.jqxTooltip('open', x - 100 - tempX  , y - 38);
										}
										else if( x + 100 > window.innerWidth ){
											var temp = (x + 100)-window.innerWidth;
											$manageGrid.jqxTooltip('open', x - 100 - temp , y + 38);
										}
										else if(y + 100 > window.innerHeight  ){
											var tempY = (y + 100)-window.innerHeight;
											$manageGrid.jqxTooltip('open', x + 20 , y - 38);
										}
										else{
											$manageGrid.jqxTooltip('open', x + 20, y + 38);
										}
									}else{
										$manageGrid.jqxTooltip('destroy');
									}

								}
							},
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
									{ text : '망구분', datafield: 'netType', displayfield: 'netTypeStr' ,  cellsalign: 'center' , width : 170 },
									{ text : 'Hostname', datafield: 'fcdbSeq', displayfield: 'hostname' ,  cellsalign: 'center' , width : 100 },

									{ text : 'L4 VIP', datafield: 'l4Vip', cellsalign: 'center' , width : 100},

									{ text : 'VIP Port', datafield: 'vipPort',  cellsalign: 'center' , width : 140 },
									{ text : 'VIP 용도', datafield: 'vipPurpose',  cellsalign: 'center' , width : 200  },
									{ text : 'Protocol', datafield: 'protocol',  cellsalign: 'center' , width : 75 },
									{ text : 'LB Method', datafield: 'lbMethod',  cellsalign: 'center' , width : 75 },
									{ text : 'Health', datafield: 'health',  cellsalign: 'center' , width : 75 },
									{ text : 'Sticky Time', datafield: 'stickyTime',  cellsalign: 'center' , width : 75 },
									{ text : '서버팜 용도', datafield: 'serverParm', displayfield: 'serverParmStr' ,  cellsalign: 'center' , width : 75 },
									{ text : '사용부서', datafield: 'useDept',  cellsalign: 'center' , width : 95 },
									{ text : '담당자', datafield: 'manager',  cellsalign: 'center' ,  width : 75 },

									{ text : 'DB연동정보', datafield: 'dbConnInfo',  cellsalign: 'center' ,  width : 75 },
									{ text : '방화벽정책', datafield: 'firewallPolicy',  cellsalign: 'center' ,  width : 75 },
									{ text : '망연계정책', datafield: 'networkConnPolicy',  cellsalign: 'center' ,  width : 75 },

									{ text : '비고', datafield: 'comments',  cellsalign: 'center' ,  width : 75 },
									{ text : 'SLB Name', datafield: 'slbName',  cellsalign: 'center', width : 140 ,  columngroup: 'slb'  },

									{ text : 'Real IP', datafield: 'realIp',  cellsalign: 'center' , width : 140 , columngroup: 'slb' ,
										// cellsrenderer: function (row, column, value) {
										//
										// 	var tempArr = value.split(',');
										// 	var tempHtml = "";
										// 	if(tempArr.length > 1){
										// 		var tempArr = value.split(',');
										// 		var strArr = "";
										// 		$.each(tempArr, function(idx, value) {
										// 			console.log(idx + " // " +value);
										// 			strArr += value + "<br>";
										// 		});
										// 		tempHtml = "<div style='float: left;width:100%;height:7px;' title=''></div><div style='float:left;width:100%;height:100%;' title=''><div style='text-align: center;'>";
										// 		tempHtml += strArr;
										// 		tempHtml += "</div></div>";
										//
										// 	}else{
										// 		tempHtml = "<div style='float: left;width:100%;height:7px;' title=''></div><div style='float:left;width:100%;height:100%;' title=''><div style='text-align: center;'>" + value + "</div></div>";
										// 	}
										// 	return tempHtml;
										// }
									},
									{ text : 'Real Port', datafield: 'realPort',  cellsalign: 'center' , width : 95 ,columngroup: 'slb' },
									{ text : '서버 용도', datafield: 'serverPurpose',  cellsalign: 'center' , width : 140 ,columngroup: 'slb' ,

										// cellsrenderer: function (row, column, value) {
										//
										// 	var tempArr = value.split(',');
										// 	var tempHtml = "";
										// 	if(tempArr.length > 1){
										// 		var tempArr = value.split(',');
										// 		var strArr = "";
										// 		$.each(tempArr, function(idx, value) {
										// 			console.log(idx + " // " +value);
										// 			strArr += value + "<br>";
										// 		});
										// 		tempHtml = "<div style='float: left;width:100%;height:7px;' title=''></div><div style='float:left;width:100%;height:100%;' title=''><div style='text-align: center;'>";
										// 		tempHtml += strArr;
										// 		tempHtml += "</div></div>";
										//
										// 	}else{
										// 		tempHtml = "<div style='float: left;width:100%;height:7px;' title=''></div><div style='float:left;width:100%;height:100%;' title=''><div style='text-align: center;'>" + value + "</div></div>";
										// 	}
										// 	return tempHtml;
										// }

									},
									{ text : '서버 Hostname', datafield: 'serverHostname',  cellsalign: 'center' , width : 140 , columngroup: 'slb' ,
										// cellsrenderer: function (row, column, value) {
										//
										// 	var tempArr = value.split(',');
										// 	var tempHtml = "";
										// 	if(tempArr.length > 1){
										// 		var tempArr = value.split(',');
										// 		var strArr = "";
										// 		$.each(tempArr, function(idx, value) {
										// 			console.log(idx + " // " +value);
										// 			strArr += value + "<br>";
										// 		});
										// 		tempHtml = "<div style='float: left;width:100%;height:7px;' title=''></div><div style='float:left;width:100%;height:100%;' title=''><div style='text-align: center;'>";
										// 		tempHtml += strArr;
										// 		tempHtml += "</div></div>";
										//
										// 	}else{
										// 		tempHtml = "<div style='float: left;width:100%;height:7px;' title=''></div><div style='float:left;width:100%;height:100%;' title=''><div style='text-align: center;'>" + value + "</div></div>";
										// 	}
										// 	return tempHtml;
										// }

									},
									{ text : '사용여부', datafield: 'useYn', displayfield: 'useYnStr' ,  cellsalign: 'center' , width : 70 , columngroup: 'slb' },
									{ text : '생성일', datafield: 'createDate',  cellsalign: 'center' , hidden: true },
									{ text : '수정일', datafield: 'updateDate',  cellsalign: 'center' , hidden: true },
									{ text : '생성자', datafield: 'createUser',  cellsalign: 'center' , hidden: true },
									{ text : '수정자', datafield: 'updateUser',  cellsalign: 'center' , hidden: true },
									{ text : 'hisSeq', datafield: 'hisSeq',  cellsalign: 'center' , hidden: true },
									{ text : '상세조회', datafield: 'l4Seq', width: 60 , columntype: 'button' , cellclassname: "editCellBtn", cellsalign: 'center' ,
										cellsrenderer: function () {
											return "상세";
										}, buttonclick: function (row) {
											editrow = row;
											var dataRecord = $manageGrid.jqxGrid('getrowdata', editrow);
											var params = dataRecord;
											HmUtil.createPopup('/nec/popup/nms/pL4ManageDetail.do', $('#hForm'), 'L4 상세조회', 700, 700 , params);
										}
									},
								],
							columngroups: [
								{text: 'SLB설정항목', align: 'center', name: 'slb'},
							]
						}, CtxMenu.COMM);
						// }, CtxMenu.COMM);

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
									url: ctxPath + '/nec/nms/l4Manage/getL4ManageHistoryList.do',
									datafields: [
										{ name: '', type: 'number' },
										{ name: 'l4Seq', type: 'int' },
										{ name: 'netType', type: 'int' },
										{ name: 'netTypeStr', type: 'String' },
										{ name: 'fcdbSeq', type: 'int' },
										{ name: 'hostname', type: 'String' },
										{ name: 'l4Vip', type: 'string' },
										{ name: 'vipPurpose', type: 'String' },
										{ name: 'realPort', type: 'String' },
										{ name: 'protocol', type: 'string' },
										{ name: 'lbMethod', type: 'string' },
										{ name: 'health', type: 'String' },
										{ name: 'stickyTime', type: 'string' },
										{ name: 'serverParm', type: 'int' },
										{ name: 'serverParmStr', type: 'string' },
										{ name: 'useDept', type: 'string' },
										{ name: 'manager', type: 'string' },
										{ name: 'dbConnInfo', type: 'string' },
										{ name: 'firewallPolicy', type: 'string' },
										{ name: 'networkConnPolicy', type: 'string' },
										{ name: 'comments', type: 'string' },
										{ name: 'slbName', type: 'string' },
										{ name: 'vipPort', type: 'string' },
										{ name: 'realIp', type: 'string' },
										{ name: 'serverPurpose', type: 'string' },
										{ name: 'serverHostname', type: 'string' },
										{ name: 'useYn', type: 'int' },
										{ name: 'useYnStr', type: 'string' },
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

										var selNetType = $('#selNetType').jqxDropDownList('getSelectedItem');
										var selServerParm = $('#selServerParm').jqxDropDownList('getSelectedItem');
										var selUseYn = $('#selUseYn').jqxDropDownList('getSelectedItem');
										var selHostname = $('#selHostname').jqxDropDownList('getSelectedItem');
										var netType , serverParm , useYn , hostname;

										if(selNetType!==undefined){
											netType = selNetType.value;
										}
										if(selServerParm!==undefined){
											serverParm = selServerParm.value;
										}
										if(selUseYn!==undefined){
											useYn = selUseYn.value;
										}
										if(selHostname!==undefined){
											hostname = selHostname.value;
										}

										$.extend(data, {
											menuSeq : $('#menuSeq').val(),
											netType : netType,
											serverParm : serverParm,
											useYn : useYn,
											hostname : hostname,
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
							rowsheight : 37,
							sortable : true,
							// cellhover: function(tableCell, x, y)
							// {
							// 	var cell = $manageGrid.jqxGrid('getcellatposition', x, y);
							//
							// 	if(cell.column == 'vipPurpose' || cell.column == 'realPort' || cell.column == 'protocol' ||cell.column == 'slbName' ||cell.column == 'vipPort'||cell.column == 'realIp'||cell.column == 'serverPurpose' ||cell.column == 'serverHostname' ){
							//
							// 		var obj = $(tableCell.innerHTML);
							// 		// console.log("hover 할 때 확인하기");
							// 		// console.log(obj.text());
							//
							// 		var tempArr = obj.text().split(',');
							// 		var tempHtml = "";
							//
							// 		if(tempArr.length > 1){
							// 			$.each(tempArr, function(idx, value) {
							// 				tempHtml += value + "<br>";
							// 			});
							// 		}
							// 		else{
							// 			tempHtml = obj.text();
							// 		}
							//
							// 		$historyGrid.jqxTooltip({ content: "<div style='width:100%;height:100%;font-size: 15px;'>"+tempHtml+"</div>" });
							// 		// open tooltip.
							// 		if( x + 100 > window.innerWidth &&  y + 100 > window.innerHeight ){
							// 			var tempX = (x + 100)-window.innerWidth;
							// 			var tempY = (y + 100)-window.innerHeight;
							// 			$historyGrid.jqxTooltip('open', x - 100 - tempX  , y - 38);
							// 		}
							// 		else if( x + 100 > window.innerWidth ){
							// 			var temp = (x + 100)-window.innerWidth;
							// 			$historyGrid.jqxTooltip('open', x - 100 - temp , y + 38);
							// 		}
							// 		else if(y + 100 > window.innerHeight  ){
							// 			var tempY = (y + 100)-window.innerHeight;
							// 			$historyGrid.jqxTooltip('open', x + 20 , y - 38);
							// 		}
							// 		else{
							// 			$historyGrid.jqxTooltip('open', x + 20, y + 38);
							// 		}
							// 	}
							// },
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
									{ text : '망구분', datafield: 'netType', displayfield: 'netTypeStr' ,  cellsalign: 'center' , width : 170 },
									{ text : 'Hostname', datafield: 'fcdbSeq', displayfield: 'hostname' ,  cellsalign: 'center'  ,  width : 100 },

									{ text : 'L4 VIP', datafield: 'l4Vip', cellsalign: 'center' , width : 100},
									{ text : 'VIP 용도', datafield: 'vipPurpose',  cellsalign: 'center' , width : 200  },

									{ text : 'Real Port', datafield: 'realPort',  cellsalign: 'center' , width : 95 },
									{ text : 'Protocol', datafield: 'protocol',  cellsalign: 'center' ,  width : 75 },
									{ text : 'LB Method', datafield: 'lbMethod',  cellsalign: 'center' , width : 75 },
									{ text : 'Health', datafield: 'health',  cellsalign: 'center' ,  width : 75 },
									{ text : 'Sticky Time', datafield: 'stickyTime',  cellsalign: 'center' ,  width : 75 },
									{ text : '서버팜 용도', datafield: 'serverParm',  displayfield: 'serverParmStr' ,  cellsalign: 'center' , width : 75 },
									{ text : '사용부서', datafield: 'useDept',  cellsalign: 'center' ,  width : 95 },
									{ text : '담당자', datafield: 'manager',  cellsalign: 'center' ,  width : 75 },
									{ text : 'DB연동정보', datafield: 'dbConnInfo',  cellsalign: 'center' ,  width : 75 },
									{ text : '방화벽정책', datafield: 'firewallPolicy',  cellsalign: 'center' ,  width : 75 },
									{ text : '망연계정책', datafield: 'networkConnPolicy',  cellsalign: 'center' ,  width : 75 },
									{ text : '비고', datafield: 'comments',  cellsalign: 'center' ,  width : 75 },

									{ text : 'SLB Name', datafield: 'slbName',  cellsalign: 'center' , width : 140 , columngroup: 'slb'  },
									{ text : 'VIP Port', datafield: 'vipPort',  cellsalign: 'center' , width : 140 , columngroup: 'slb'  },
									{ text : 'Real IP', datafield: 'realIp',  cellsalign: 'center' , width : 140 , columngroup: 'slb' },

									{ text : '서버 용도', datafield: 'serverPurpose',  cellsalign: 'center' , width : 140  , columngroup: 'slb' },
									{ text : '서버 Hostname', datafield: 'serverHostname',  cellsalign: 'center' , width : 140 , columngroup: 'slb' },
									{ text : '사용여부', datafield: 'useYn', displayfield: 'useYnStr' ,  cellsalign: 'center' , width : 70 , columngroup: 'slb' },

									{ text : '이력', datafield: 'memo',  cellsalign: 'center' , width : 180 },
									{ text : '상세조회', datafield: 'hisSeq', width: 60 , columntype: 'button' , cellclassname: "editCellBtn", cellsalign: 'center' ,
										cellsrenderer: function () {
											return "상세";
										}, buttonclick: function (row) {
											editrow = row;
											var dataRecord = $historyGrid.jqxGrid('getrowdata', editrow);
											var params = dataRecord;
											// console.log('히스토리 상세조회');
											HmUtil.createPopup('/nec/popup/nms/pL4ManageDetail.do', $('#hForm'), 'L4 상세조회', 700, 700 , params);
										}
									},
								],
							columngroups: [
								{text: 'SLB설정항목', align: 'center', name: 'slb'},							]
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
		Main.getSelNetType();
		Main.getSelServerParm();
		Main.getSelUseYn();
		Main.getSelHostname();
	},

	getSelNetType : function(){
		Server.get('/nec/nms/l4Manage/getL4CodeList.do', {
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

				$('#selNetType').jqxDropDownList({width:'175', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
					source: source2
				});
			}
		});
	},

	getSelServerParm : function(){
		Server.get('/nec/nms/l4Manage/getL4CodeList.do', {
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

				$('#selServerParm').jqxDropDownList({width:'100', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
					source: source2
				});
			}
		});
	},


	getSelUseYn : function(){
		Server.get('/nec/nms/l4Manage/getL4CodeList.do', {
			data: {
				menuSeq : $('#menuSeq').val(),
				codeType : 3
			},
			success: function(result) {
				var source2 = [];
				source2.push({ label: '선택', value: '' });

				$.each(result,function(idx,item){
					source2.push({ label: item.selText , value: item.selValue });
				});

				$('#selUseYn').jqxDropDownList({width:'100', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
					source: source2
				});
			}
		});
	},

	getSelHostname : function(){
		Server.get('/nec/nms/l4Manage/getL4HostnameList.do', {
			data: {
				menuSeq : $('#fcMenuSeq').val(), //이 값은 시설DB에서 가져와야해서 다르다
				codeType : 6,
			},
			success: function(result) {
				console.dir(result);
				var cnt = 0;
				var source2 = [];
				source2.push({ label: '선택', value: '' });

				$.each(result,function(idx,item){
					source2.push({ label: item.hostName , value: item.fcdbSeq });
					cnt++;
				});

				if(cnt>20){
					$('#selHostname').jqxDropDownList({width:'175', height: '23px', dropDownHeight: 500, selectedIndex : 0, autoDropDownHeight: false,
						source: source2
					});
				}else{
					$('#selHostname').jqxDropDownList({width:'175', height: '23px', dropDownHeight: 40, selectedIndex : 0, autoDropDownHeight: true,
						source: source2
					});
				}
			}
		});
	},

	search: function() {
		if( $('#tabDIV').val() == 'P'){
			HmGrid.updateBoundData( $manageGrid , ctxPath + '/nec/nms/l4Manage/getL4ManageList.do' );
		}else{
			HmGrid.updateBoundData( $historyGrid , ctxPath + '/nec/nms/l4Manage/getL4ManageHistoryList.do' );
		}
	},

	addManage: function(){
		HmUtil.createPopup('/nec/popup/nms/pL4ManageAdd.do', $('#hForm'), 'L4 추가', 700, 700);
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
			HmUtil.createPopup('/nec/popup/nms/pL4ManageEdit.do', $('#hForm'), 'L4 수정', 700, 700 , temp);
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
			delList.push(tempRow.l4Seq);
		});


		if (confirm('선택된 데이터 '+delList.length+'개 를 삭제하시겠습니까?')){
			Server.post('/nec/nms/l4Manage/delL4Manage.do', {
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

		var selNetType = $('#selNetType').jqxDropDownList('getSelectedItem');
		var selServerParm = $('#selServerParm').jqxDropDownList('getSelectedItem');
		var selUseYn = $('#selUseYn').jqxDropDownList('getSelectedItem');
		var selHostname = $('#selHostname').jqxDropDownList('getSelectedItem');
		var netType , serverParm , useYn , hostname;

		if(selNetType!==undefined){
			netType = selNetType.value;
		}
		if(selServerParm!==undefined){
			serverParm = selServerParm.value;
		}
		if(selUseYn!==undefined){
			useYn = selUseYn.value;
		}
		if(selHostname!==undefined){
			hostname = selHostname.value;
		}

		var params = {
			menuSeq : $('#menuSeq').val(),
			netType : netType,
			serverParm : serverParm,
			useYn : useYn,
			hostname : hostname,
			searchText : $('#searchText').val(),
			tabDiv : $('#tabDIV').val()
		};

		HmUtil.exportExcel(ctxPath + '/nec/nms/l4Manage/export.do', params);

	},


	uploadExcel : function(){
		var param = {};
		HmUtil.createPopup('/nec/popup/nms/pL4ManageUpload.do', $('#hForm'), 'L4 다중추가', 950, 560);
	},

};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});