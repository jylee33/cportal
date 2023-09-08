
var Main = {
	layoutGrid: null,
	ctrlLayerHTML: null,
	zoneCtrlMap: {},
	filterInfos: null,
	timer: null,
	selectWidget: null,

	/** variable */
	initVariable: function() {
		if(model.scondUse == '1') {
			HmBoxCondition.createPeriod();
		}
		else {
			HmBoxCondition.createPeriod('', Main.refreshData, Main.timer);
			$("input[name=sRef]").eq(1).click();
		}

        $("button[name=editMode]").css("display", "none");
        $("button[name=searchMode]").css("display", "inline-block");
	},

	/** add event */
	observe: function () {
		/**
		 * F5 새로고침시 IE에서 경고창 표시를 없애기 위해 이벤트 제어 (우회하여 경고창을 표시하지 않고 새로고침 처리)
		 * 경고창 내용: 웹 페이지를 다시 표시하려면....
		 * 18. 8. 28.   by jjung
		 */
		$('body').on('keydown', function(event) {
			if (event.keyCode == 116) { //f5 key
				var params = {
					menuType: model.menuType, guid: model.guid, scondUse: model.scondUse, menuNo: model.menuNo
				};
				var frm = $('#hForm');
				frm.empty();
				if (params !== undefined && params !== null) {
					$.each(params, function(key, value) {
						$('<input />', { type : 'hidden', id : key, name : key, value : value }).appendTo(frm);
					});
				}
				frm.attr({method: 'POST', target: '_self', action: location.href}).submit();
				frm.submit();
				return false;
			}
			else if(event.keyCode == 27 && model.fullSize == 'true') { //esc key가 눌렸고 최대화모드이면 최소화
				model.fullSize = 'false';
				Main.setFullSize();
			}
		});
		$("#widgetBtn button").on('click', function (event) {
			Main.eventControl(event);
		});

		// $(window).resize(function() {
		// 	var layerW = $('#layerDiv').width(), layerH = $('#layerDiv').height();
		// 	var gsW = $("#gsDiv").width(), gsH = $('#gsDiv').height();
		// 	var sx = layerW / gsW, sy = layerH / gsH;
		// 	console.log("layerDiv", layerW, layerH);
		// 	console.log("gsDiv", gsW, gsH);
		// 	console.log("scale", sx, sy);
		// 	$('#gsDiv').css({
		// 		transformOrigin: 'top left',
		// 		transform: 'scale({0},{1})'.substitute(sx, sy)
		// 	});
		// });
	},

	/** event handler */
	eventControl: function(event) {
		var curTarget = event.currentTarget;
		switch(curTarget.id) {
			case 'btnLayout_L': this.setLayout(); break;	//설정
			case 'btnMaxMin_L': this.toggleScreenMode(); break;	//최대화
			case 'btnFilter': this.setFilter(); break;	//필터
			case 'btnExport_L': this.exportLayout(); break;	//엑셀
			case 'btnRefresh_L': this.refreshData(); break;	//새로고침
			case 'btnWidgetAdd': this.addWidgetItem(); break;	//추가
			case 'btnWidgetFit': this.relayoutGrid(); break;	//재배치
			case 'btnWidgetSave': this.saveWidgetItem(); break;	//저장
			case 'btnWidgetCopy': this.saveWidgetCopy(); break;	//복사
		}
	},
	eventControlLayer: function (event, zoneId) {
		var target = event.currentTarget;
		var widgetZone = $(event.currentTarget).closest('div.widgetZone'),
			zoneId = widgetZone.attr('id'),
			ctrlNo = widgetZone.attr('data-ctrl-no');

		// 위젯 버튼이벤트 처리
		switch (target.className) {
			case 'p_btnRefIcon':
				var ctrl = Main.zoneCtrlMap[zoneId];
				if(ctrl != null) {
					ctrl.refreshData(Main.getCommParams());
				}
				break;
			case 'p_btnExcelIcon':
				var ctrl = Main.zoneCtrlMap[zoneId];
				if(ctrl != null) {
					ctrl.exportExcel();
				}
				break;
			case 'p_btnDelIcon':
				if(Main.getIsEditMode()) {
					var ctrl = Main.zoneCtrlMap[zoneId];
					if (confirm('위젯을 삭제하시겠습니까?')) {
						Main.layoutGrid.removeWidget(widgetZone);
					}
				}
				break;
			case 'p_btnSetIcon':
				if(Main.getIsEditMode()) {
					var _params = { menuType: model.menuType, viewNo: model.viewNo, menuNo: model.menuNo, guid: model.guid, zoneId: zoneId, ctrlNo: ctrlNo };
					$.post('/main/widget/settings/controlSetting.do',
						_params,
						function (html) {
							HmWindow.openFit($('#pwindow'), '위젯 설정', html, 450, 'auto', 'pwindow_init', _params);
						}
					);
				}
				break;
		}
	},

	/** init design */
	initDesign: function() {
		$('#navPage').text(model.pageName);
		$('#navPageGrp').text(model.pageGrpName);
		$('#navPageMenu').add($('#navMenuNm')).text(model.menuName);

		//조건설정
		if(model.scondUse == '1') {
			$('#sdateDiv').css('display', 'block');
		}
		else {
			$('#sdateDiv').css('display', 'none');
		}
		$('input:radio[name=rbMode]').change(function(event) {
			var mode = $(event.currentTarget).val();
			var isEdit = mode == 'edit';
			Main.layoutGrid.enableMove(isEdit, true);
			Main.layoutGrid.enableResize(isEdit, true);
			if (isEdit) {
				$(".ctrlButton").children("button.p_btnRefIcon").css("display", "none");
				$(".ctrlButton").children("button.p_btnExcelIcon").css("display", "none");
				$(".ctrlButton").children("button.p_btnDelIcon").css("display", "inline-block");
				$(".ctrlButton").children("button.p_btnCopyIcon").css("display", "inline-block");
				$(".ctrlButton").children("button.p_btnSetIcon").css("display", "inline-block");

				$("button[name=searchMode]").css("display", "none");
				$("button[name=editMode]").css("display", "inline-block");

			}
			else {
				$(".ctrlButton").children("button.p_btnRefIcon").css("display", "inline-block");
				$(".ctrlButton").children("button.p_btnExcelIcon").css("display", "inline-block");
				$(".ctrlButton").children("button.p_btnDelIcon").css("display", "none");
				$(".ctrlButton").children("button.p_btnCopyIcon").css("display", "none");
				$(".ctrlButton").children("button.p_btnSetIcon").css("display", "none");

				$("button[name=editMode]").css("display", "none");
				$("button[name=searchMode]").css("display", "inline-block");
			}
		});

		// com_menu_widget.view_scope = 'global'인 경우에는 auth='System'인 관리자 계정만 widget 편집이 가능하다.
		if(model.viewScope == 'global' && $('#sAuth').val().toUpperCase() != 'SYSTEM') {
			$('#rbModeBox, #btnWidgetAdd, #btnWidgetFit, #btnWidgetSave, #btnLayout_L').css('display', 'none');
		}
	},

	/** init data */
	initData: function() {
		$.post('/main/widget/layers/controlLayer.do',
			function (html) {
				Main.ctrlLayerHTML = html;
				Main.initLayout();
			}
		);
		// this.setLayoutEnv();
	},

	/** Layout View environment */
	setLayoutEnv: function() {
		Server.post('/layout/getLayoutViewEnv.do', {
			data: {viewKind: model.guid},
			success: function(result) {
				if(result != null) {
					console.log(result);
					model.envMenuNm = result.menuNm || $('#navMenuNm').text();
					model.envRefCycle = result.refCycle.toString() || 120;
					model.envTheme = result.theme || 'gray';
					if($.inArray(model.envTheme, ['gray', 'dark']) == -1) model.envTheme = 'gray';
					// theme적용
					if(model.envTheme != 'gray') updateTheme();

					setMenuNm();
					startTimer();
				}
			}
		});
	},

	/** layout 설정 **/
	setLayout: function () {

		var _params = { menuType: model.menuType, viewNo: model.viewNo, menuNo: model.menuNo, guid: model.guid, menuNm: model.envMenuNm };
		$.post('/main/widget/settings/layoutSetting.do',
			_params,
			function (html) {
				HmWindow.openFit($('#pwindow'), '위젯 환경설정', html, 400, 300, 'pwindow_init', _params);
			}
		);

	},

	/** 전체화면 팝업 **/
	showMaxMin: function () {
		model.fullSize = 'true';
		Main.setFullSize();
		//Master.gotoLayoutPage(model.guid, model.grpType, 'true');
	},

	/** layout 초기화
	 * 기본 Widget Div 생성
	 * **/
	initLayout: function () {
		console.log(model);
		// grid-stack 구성
		Main.layoutGrid = GridStack.init({
			disableOneColumnMode: true, // will manually do 1 column
			verticalMargin: 5,
			cellHeight: '62.5px', //cellHeight속성값으로 grid-stack-item.height 계산
			float: true,
			removable: '#trash',
			removeTimeout: 100,
			acceptWidgets: '.widgetZone',
			disableDrag: true,
			disableResize: true,
			resizable: {handles: 'e, se, s, sw, w'}
		});
		Main.layoutGrid.column(model.gsColumn || 8);

		// 위젯 Layer 생성
		Server.post('/widget/getWidgetViewCtrlList.do', {
			data: {viewNo: model.viewNo},
			success: function(result) {
				if(result.length) {
					Main.layoutGrid.batchUpdate();
					result.forEach(function(node, index) {
						var widget = $('<div></div>', {
							id: 'zone' + node.ctrlNo,
							class: 'widgetZone',
							'data-ctrl-no': node.ctrlNo
						}).append($('<div></div>', {class: "grid-stack-item-content"}).html(Main.ctrlLayerHTML));
						Main.layoutGrid.addWidget(widget[0].outerHTML, {x: node.gsX, y: node.gsY, width: node.gsWidth, height: node.gsHeight});
					});
					Main.layoutGrid.commit();
				}
				addLayoutGridEvent();
				console.log('getWidgetViewCtrlList', result);
				Main.initWidgetCtrl(result);

			}
		});

		function addLayoutGridEvent() {
			// add eventlistener for gridstack
			Main.layoutGrid.on('added', function(event, items) {
				var addedItem = $(items[0].el);
				if(addedItem.attr('id') == 'new') { //[위젯추가] 클릭시
					var addData = {
						viewNo: model.viewNo,
						gsX: addedItem.data('gs-x'),
						gsY: addedItem.data('gs-y'),
						gsWidth: addedItem.data('gs-width'),
						gsHeight: addedItem.data('gs-height')
					};
					Server.post('/widget/addWidgetViewCtrl.do', {
						data: addData,
						success: function (result) {
							addedItem.attr({id: 'zone' + result, 'data-ctrl-no': result});
						}
					});
				}
			});
			Main.layoutGrid.on('removed', function(event, items) {
				var item = $(items[0].el);
				var delData = {viewNo: model.viewNo, ctrlNo: item.data('ctrlNo')};
				Server.post('/widget/delWidgetViewCtrl.do', {
					data: delData,
					success: function (result) {
					}
				});
			});
			Main.layoutGrid.on('gsresizestop', function(event, element) {
				var ctrl = Main.zoneCtrlMap[element.id];
				if(ctrl != null) {
					ctrl.resizeHandler();
				}
			});

			// Main.layoutGrid.on('dragstart', function(event, element) {
			// 	Main.selectWidget = element;
			// });
			//
			// Main.layoutGrid.on('change', function(event, items) {
			// 	Main.selectWidget = items;
			// });

			Main.addEventListenerBtn();
		}

		// window.addEventListener('resize', function () {
			// resizeGrid();
		// });
	},

	/* 위젯 설정값 적용 */
	initWidgetCtrl: function(ctrlList) {
		$.each(ctrlList, function(i, v) {
			console.log('ctrlInfo', i, v);
			var _ctrlId = 'zone' + v.ctrlNo + 'Ctrl';
			$('#zone{0} .ctrlTitle'.substitute(v.ctrlNo)).text(v.ctrlTitle || '>Widget Title');
			$('#zone{0} .ctrlContent'.substitute(v.ctrlNo)).html('<div id="{0}" style="width: 100%; height: 100%; border: none"></div>'.substitute(_ctrlId));
			var ctrl = null;
			ctrl = Main.newWidgetCtrl(v, _ctrlId);
			if(ctrl != null) {
				ctrl.create();
				Main.zoneCtrlMap['zone' + v.ctrlNo] = ctrl;
			}
			$("#zone{0} .ctrlButton".substitute(v.ctrlNo)).find("button.p_btnDelIcon").css("display", "none");
			$("#zone{0} .ctrlButton".substitute(v.ctrlNo)).find("button.p_btnCopyIcon").css("display", "none");
			$("#zone{0} .ctrlButton".substitute(v.ctrlNo)).find("button.p_btnSetIcon").css("display", "none");
		});
		setTimeout(Main.refreshData, 1000);
	},

	/** Widget 생성 **/
	newWidgetCtrl: function(ctrlInfo, _ctrlId) {
		var ctrl = null;
		if(ctrlInfo.ctrlType == 'COM') {
			ctrl = new WidgetComControl(ctrlInfo.ctrlNo, _ctrlId, ctrlInfo.ctrlDisplay, ctrlInfo.ctrlUrl, ctrlInfo.serviceUrl, ctrlInfo.ctxMenu, ctrlInfo.condList);
		}
		else if(ctrlInfo.ctrlType == 'NMS') {
			ctrl = new WidgetNmsControl(ctrlInfo.ctrlNo, _ctrlId, ctrlInfo.ctrlDisplay, ctrlInfo.ctrlUrl, ctrlInfo.serviceUrl, ctrlInfo.ctxMenu, ctrlInfo.condList);
		}
		else if(ctrlInfo.ctrlType == 'SMS') {
			ctrl = new WidgetSmsControl(ctrlInfo.ctrlNo, _ctrlId, ctrlInfo.ctrlDisplay, ctrlInfo.ctrlUrl, ctrlInfo.serviceUrl, ctrlInfo.ctxMenu, ctrlInfo.condList);
		}
		else if(ctrlInfo.ctrlType == 'OMS') {
			ctrl = new WidgetOmsControl(ctrlInfo.ctrlNo, _ctrlId, ctrlInfo.ctrlDisplay, ctrlInfo.ctrlUrl, ctrlInfo.serviceUrl, ctrlInfo.ctxMenu, ctrlInfo.condList);
		}
		else if(ctrlInfo.ctrlType == 'WNMS') {
			ctrl = new WidgetWnmsControl(ctrlInfo.ctrlNo, _ctrlId, ctrlInfo.ctrlDisplay, ctrlInfo.ctrlUrl, ctrlInfo.serviceUrl, ctrlInfo.ctxMenu, ctrlInfo.condList);
		}
		else if(ctrlInfo.ctrlType == 'FMS') {
			ctrl = new WidgetFmsControl(ctrlInfo.ctrlNo, _ctrlId, ctrlInfo.ctrlDisplay, ctrlInfo.ctrlUrl, ctrlInfo.serviceUrl, ctrlInfo.ctxMenu, ctrlInfo.condList);
		}
		else if(ctrlInfo.ctrlType == 'EDB') {
			ctrl = new WidgetEdbControl(ctrlInfo.ctrlNo, _ctrlId, ctrlInfo.ctrlDisplay, ctrlInfo.ctrlUrl, ctrlInfo.serviceUrl, ctrlInfo.ctxMenu, ctrlInfo.condList, ctrlInfo.ctrlUserDefine);
		}
		return ctrl;
	},

	chgWidgetSetting: function(ctrlInfo) {
		console.log("chgWidget ctrlInfo", ctrlInfo);
		var ctrl = Main.zoneCtrlMap['zone' + ctrlInfo.ctrlNo];
		var _ctrlId = 'zone' + ctrlInfo.ctrlNo + 'Ctrl';
		if(ctrl == null) {
			$('#zone{0} .ctrlContent'.substitute(ctrlInfo.ctrlNo)).html('<div id="{0}" style="width: 100%; height: 100%;"></div>'.substitute(_ctrlId));
			ctrl = Main.newWidgetCtrl(ctrlInfo, _ctrlId);
			if(ctrl == null) {
				return;
			}
			ctrl.create();
			Main.zoneCtrlMap['zone'+ctrlInfo.ctrlNo] = ctrl;
		}
		else {
			ctrl.destroy();
			if ($('#' + _ctrlId).length == 0) {
				$('#zone{0} .ctrlContent'.substitute(ctrlInfo.ctrlNo)).html('<div id="{0}" style="width: 100%; height: 100%;"></div>'.substitute(_ctrlId));
			}
			ctrl.ctrlType = ctrlInfo.ctrlType;
			ctrl.ctrlDisplay = ctrlInfo.ctrlDisplay;
			ctrl.ctrlUrl = ctrlInfo.ctrlUrl;
			ctrl.serviceUrl = ctrlInfo.serviceUrl;
			ctrl.ctxMenu = CtxMenu[ctrlInfo.ctxMenu];
			ctrl.condList = ctrlInfo.condList;
			// 외부DB연동(EDB) 위젯컨트롤의 경우 사용자정의 속성 set
			if(ctrl.ctrlType == HmWidgetConst.ctrlType.EDB.type) {
				ctrl.ctrlUserDefine = ctrlInfo.ctrlUserDefine;
			}
			ctrl.create();
		}
		$('#zone{0} .ctrlTitle'.substitute(ctrlInfo.ctrlNo)).text(ctrlInfo.ctrlTitle || '>Widget Title');
		setTimeout(function() {
			ctrl.refreshData(Main.getCommParams());
			// Main.refreshData(ctrl);
		}, 1000);
	},

	/** 화면 편집모드 체크 */
	getIsEditMode: function() {
		var isEdit = $('input:radio[name=rbMode]:checked').val() == 'edit';
		if(!isEdit) {
			alert('화면모드를 [관리]모드로 전환 후 진행하세요.');
		}
		return isEdit;
	},

	/* 위젯 추가 */
	addWidgetItem: function() {
		if(this.getIsEditMode()) {
			var widget = $('<div></div>', {
				id: 'new',
				class: 'widgetZone'
			}).append($('<div></div>', {class: "grid-stack-item-content"}).html(Main.ctrlLayerHTML));
			var addedObj = Main.layoutGrid.addWidget(widget, 0, 0, 2, 3, true);
			Main.addEventListenerBtn();
		}
	},

	/* re-layout Grid */
	relayoutGrid: function() {
		if(this.getIsEditMode()) {
			Main.layoutGrid.compact();
		}
	},

	/* 위젯 저장 */
	saveWidgetItem: function() {
		if(this.getIsEditMode()) {
			console.log('nodes', Main.layoutGrid.engine.nodes);
			var _ctrlList = [];
			Main.layoutGrid.engine.nodes.forEach(function (node) {
				_ctrlList.push({
					viewNo: model.viewNo,
					ctrlNo: $(node.el).data('ctrlNo'),
					gsX: node.x,
					gsY: node.y,
					gsWidth: node.width,
					gsHeight: node.height
				});
			});
			if (_ctrlList.length) {
				Server.post('/widget/saveWidgetViewCtrlPosition.do', {
					data: {ctrlList: _ctrlList},
					success: function (result) {
						alert('저장되었습니다.')
					}
				});
			}
		}
	},

	/**
	 Button 이벤트 등록
	 */
	addEventListenerBtn: function() {
		$('.ctrlButton > button').off('click').on('click', function (event) {
			var target = $(event.currentTarget);
			var zone = target.closest('div.widgetZone');
			Main.eventControlLayer(event, zone.attr('id').replace(/\D/ig,''));
		});

		if(model.viewScope == 'global' && $('#sAuth').val().toUpperCase() != 'SYSTEM') {
			$('.ctrlButton > button.p_btnDelIcon, .ctrlButton > button.p_btnSetIcon, .ctrlButton > button.p_btnCopyIcon').css('display', 'none');
		}
	},

	/** 검색조건 */
	getCommParams: function(addParams) {

		var sysCodes = model.sysCode.split(',');
		var params = {
			isDebugMode: $('#ckDebugMode').is(':checked')? 'true' : 'false',
			scondUse: model.scondUse
		};
		if(model.scondUse == '1') {
			$.extend(params, HmBoxCondition.getPeriodParams());
		}
		// wnms 필터 트리 적용
		if(sysCodes.indexOf('WNMS') !== -1) {
			if (this.filterInfos != null && this.filterInfos.length > 0) {
				var _kinds = [
					{kind: 'GROUP', sKey: 'sApGrpNoList'},
					{kind: 'VENDOR', sKey: 'sVendorList'},
					{kind: 'SSID', sKey: 'sSsidList'},
					{kind: 'STATUS', sKey: 'sStatusList'},
					{kind: 'MODEL', sKey: 'sModelList'}
				];
				for (var x in _kinds) {
					var _kind = _kinds[x].kind, _sKey = _kinds[x].sKey;
					var tmp = this.filterInfos.filter(function (d) {
						return d.devKind2 == _kind;
					});
					var sVal = tmp.map(function (d) {
						return d.grpNo;
					});
					if (_kind == 'STATUS') { // AP상태가 'ALL' or 'UP,DOWN' 동시 체크인 경우 필터조건 제거
						if (sVal.indexOf('ALL') !== -1 || (sVal.indexOf('UP') !== -1 && sVal.indexOf('DOWN') !== -1)) {
							sVal.length = 0;
						}
					}
					params[_sKey] = sVal;
				}
			}
		}
		else { // NMS/SMS 필터
			if (this.filterInfos != null && this.filterInfos.length > 0) {
				params.grpType = 'DEFAULT';
				params.itemKind = 'GROUP';
				params.grpNo = this.filterInfos[0].grpNo;
			}
		}
		if(addParams != null) {
			$.extend(params, addParams);
		}
		// console.log(params);
		return params;
	},

	/** toggle FullScreen */
	toggleScreenMode: function() {
		var mode = HmUtil.toggleFullScreen();
		/**
		 * 최대화모드인 경우, gridstack의 cellHeight속성으로 위젯 높이 재정의
		 * 					메뉴영역'nav' hide.. section.top 조절
		 * cellHeight(val, noUpdate)
		 	Update current cell height. This method rebuilds an internal CSS stylesheet (unless optional noUpdate=true).
		 	Note: You can expect performance issues if call this method too often.
		 */
		setTimeout(function() {
			if(mode == 'Y') {
				$('#nav').css('display', 'none');
				$('#section').css('top', '30px');
				var layerH = $('#layerDiv').height(),
					gsH = $('#gsDiv').height(),
				 	rows = parseInt($('#gsDiv').attr('data-gs-current-row'));
				if(layerH > gsH) {
					Main.layoutGrid.cellHeight(((layerH - (rows) * 5) / rows) + 'px');
					for(var i in Main.zoneCtrlMap) {
						var ctrl = Main.zoneCtrlMap[i];
						if(ctrl != null) {
							ctrl.resizeHandler();
						}
					}
				}
			}
			else {
				$('#nav').css('display', 'inline-block');
				$('#section').css('top', '85px');
				Main.layoutGrid.cellHeight('62.5px');
				for(var i in Main.zoneCtrlMap) {
					var ctrl = Main.zoneCtrlMap[i];
					if(ctrl != null) {
						ctrl.resizeHandler();
					}
				}
			}
		}, 100);
	},

	/** 필터 설정 */
	setFilter: function() {
		var params = {
			viewNo: model.viewNo,
			filterInfos: this.filterInfos
		};
		var sysCodes = model.sysCode.split(',');
		if(sysCodes.indexOf('WNMS') !== -1) {
			$.post('/main/widget/settings/wnmsFilterSetting.do', params,
				function(result) {
					HmWindow.open($('#pwindow'), '필터 설정', result, 600, 700, 'pwindow_init', params);
				});
		}
		else if(sysCodes.indexOf('NMS') !== -1 || sysCodes.indexOf('SMS') !== -1){
			$.post('/main/widget/settings/nmsFilterSetting.do', params,
				function(result) {
					HmWindow.open($('#pwindow'), '필터 설정', result, 600, 700, 'pwindow_init', params);
				});
		}
		else {
			alert('필터 기능을 제공하지 않습니다.');
		}
	},

	setFilterHandler: function(filters) {
		Main.filterInfos = filters;
		Main.refreshData();
	},

	/* 데이터 갱신 */
	refreshData: function(ctrl) {
		// "관리" 모드일때는 화면 갱신하지 않음.
		var isEdit = $('input:radio[name=rbMode]:checked').val() == 'edit';
		if(isEdit) {
			return;
		}
		var params = Main.getCommParams();
		if(ctrl == undefined) {
			$.each(Main.zoneCtrlMap, function(i,v) {
				v.refreshData.call(v, params);
			});
		}
		else {
			ctrl.refreshData.call(ctrl, params);
		}
	},

	/** excel export (전체 control 포함, 시트별 생성) */
	exportLayout: function() {
		var exportParams = [];
		$.each(Main.zoneCtrlMap, function(i, ctrl) {
			try {
				exportParams.push(ctrl.getExcelData !== undefined? ctrl.getExcelData.call(ctrl) : WidgetControlHelper.getExcelData.call(ctrl));
			} catch(e){}
		});
		Server.post('/layout/exportLayout.do', {
			data: { exportList: exportParams },
			success: function(result) {
				HmUtil.fileDown({filePath: result.filePath, fileName: model.menuName});
			}
		});
	}
};

$(function () {
	Main.initVariable();
	Main.observe();

	if(model.envTheme != 'gray') {
		updateTheme();
	}

	Main.initDesign();
	Main.initData();

	CtxMenu_Evt.create('status');
});

function setMenuNm() {
	$('#navMenuNm, #navPageMenu, #layoutMaxTitle').text(model.envMenuNm);
}

/** 환경설정 > 테마값에 따른 스타일파일 교체 */
function updateTheme() {

	var linkArr = $('link');
	$.each(linkArr, function(idx, link) {
		if(/jqx\.ui\-hamon.*?\.css$/.test(link.href)) {
			$(link).remove();
		}
		else if(/highcharts\-.*?\.css$/.test(link.href)) {
			$(link).remove();
		}
	});
	var theme = model.envTheme;
	var _protocol = location.protocol.replace(/[^a-zA-Z]/ig, '');

	var jqwidget_link = $('<link></link>', {
		rel: 'stylesheet', type: 'text/css', href: location.origin + '/css/v5.0.1/jqx.ui-hamon-' + theme + '.css'
	});

	var highchart_link = $('<link></link>', {
		rel: 'stylesheet', type: 'text/css', href: location.origin + '/css/v5.0.1/highcharts-' + theme + '.css'
	});

	$('head').append(jqwidget_link);
	$('head').append(highchart_link);

}
