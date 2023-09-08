var $ipApplyGrid;
var isSearchAll = false;
var codeMap = {
    virtlFlagList: [],
    ifNmList: [],
    dplxFlagList: [],
    cableTypeList: [],
    speedList: []
};

var Main = {
	/** variable */
	initVariable : function() {
		$ipApplyGrid = $('#ipApplyGrid');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) {
			Main.eventControl(event);
		});
		$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case 'btnSearch': this.searchIpApply(); break;
		case 'btnAdd': this.addServer(); break;
		case 'btnDel': this.delServer(); break;
		case "btnSave": this.applyServer(); break;
		}
	},

	/** keyup event handler */
	keyupEventControl: function(event) {
		if(event.keyCode == 13) {
			Main.searchIpApply();
		}
	},

	/** init design */
	initDesign : function() {
        Server.get('/wooriBank/nms/ipSearch/combo/getCodeDataList.do', {
            data: { mainCodeKind : 'VIRTL_FLAG' },
            success: function(result) {
                codeMap.virtlFlagList = result;
            }
        });
        Server.get('/wooriBank/nms/ipSearch/combo/getCodeDataList.do', {
            data: { mainCodeKind : 'IF_NM' },
            success: function(result) {
                codeMap.ifNmList = result;
            }
        });
        Server.get('/wooriBank/nms/ipSearch/combo/getCodeDataList.do', {
            data: { mainCodeKind : 'DPLX_FLAG' },
            success: function(result) {
                codeMap.dplxFlagList = result;
            }
        });
        Server.get('/wooriBank/nms/ipSearch/combo/getCodeDataList.do', {
            data: { mainCodeKind : 'CABLE_TYPE' },
            success: function(result) {
                codeMap.cableTypeList = result;
            }
        });
        Server.get('/wooriBank/nms/ipSearch/combo/getCodeDataList.do', {
            data: { mainCodeKind : 'SPEED' },
            success: function(result) {
                codeMap.speedList = result;
            }
        });

        console.log(codeMap);


		HmGrid.create($ipApplyGrid, {
			source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						datafields:[
							{ name:'num', type:'number' },
							{ name:'ipassetHostNo', type:'string' },
							{ name:'wbSvrLocCd', type:'string' },
							{ name:'rackNm', type:'string' },
							{ name:'wbSvrKindCd', type:'string' },
							{ name:'wbSvrUseCd', type:'string' },
							{ name:'workNm', type:'string' },
							{ name:'hostNm', type:'string' },
							{ name:'reqUserId', type:'string' },
							{ name:'reqState', type:'string' },
							{ name:'confmState', type:'string' }
						]
					},
					{
						formatData: function(data) {
							data.sIp = $('#sIp').val();
							data.sDevName = $('#sDevName').val();
							return data;
						},
						loadComplete: function(records) {

						}
					}
			),
			rowdetails: true,
			initrowdetails: Main.initrowdetails,
			rowdetailstemplate: {
				rowdetails: "<div style='display: block; margin-left: 10px; '><button id='btnAdd_if' class='btn_A btn_ico_07'>추가</button><button id='btnDel_if' class='btn_A btn_ico_09'>삭제</button><button id='btnSave_if' class='btn_A btn_ico_06'>저장</button></div><div id='ifGrid' style='margin: 10px; margin-top: 0px;'></div>",
				rowdetailsheight: 300,
				rowdetailshidden: true
			},
			selectionmode: 'checkbox',
			showtoolbar: true,
			rendertoolbar: function(toolbar) {
				HmGrid.titlerenderer(toolbar, '');
			},
			columns:
			[
				{ text: 'No', datafield: 'num', width: 100 },
				{ text: 'HOST_NO', datafield: 'ipassetHostNo', width: 150, hidden:true },
				{ text: '서버위치', datafield: 'wbSvrLocCd', width: 150 },
				{ text: '랙명칭', datafield: 'rackNm', width: 140 },
				{ text: '서버종류', datafield: 'wbSvrKindCd', width: 220 },
				{ text: '서버용도', datafield: 'wbSvrUseCd', width: 130 },
				{ text: '업무명', datafield: 'workNm', width: 150 },
				{ text: 'HOSTNAME', datafield: 'hostNm', width: 120 },
				{ text: '신청인', datafield: 'reqUserId', width: 130 },
				{ text: '신청상태', datafield: 'reqState', width: 130 },
				{ text: '승인상태', datafield: 'confmState', width: 130 }
			]
		}, CtxMenu.COMM);
	},

	initrowdetails: function (index, parentElement, gridElement, record) {
		var id = record.uid.toString();
		var btn = $($(parentElement).children()[0]);
		var grid = $($(parentElement).children()[1]);
        grid[0].id = 'ifGrid_' + record.ipassetHostNo;

		var ifGridAdapter = new $.jqx.dataAdapter(
			{
				datatype: 'json',
				url: ctxPath + '/wooriBank/nms/ipApply/getIfList.do'
			},
			{
				formatData: function(data) {
					data.ipassetHostNo = record.ipassetHostNo;
					return data;
				},
				loadComplete: function(records) {
					// console.log(records.resultData);
				}
			}
		);
		if (grid != null) {
			HmGrid.create(grid, {
				source: ifGridAdapter,
				width: '98%',
				height: 230,
				selectionmode: 'checkbox',
				editable:true,
				columns: [
					{ text: 'ipassetHostNo', datafield: 'ipassetHostNo', width: 100, cellsalign: 'right', hidden: true },
					{ text: 'ipassetIfNo', datafield: 'ipassetIfNo', width: 100, cellsalign: 'right', hidden: true },
					{ text: 'No', datafield: 'num', width: 50, cellsalign: 'center' },
					{ text: '가상화', datafield: 'virtlFlag', width: 100,  columntype: 'dropdownlist',
                        createeditor: function(row, value, editor){
                            editor.jqxDropDownList({source: codeMap.virtlFlagList, displayMember: 'label', valueMember: 'value', dropDownWidth: 150, autoDropDownHeight: true, placeHolder: "선택하세요."});
						},
                        geteditorvalue: function (row, cellvalue, editor) {return editor.val();},
                        cellsrenderer: function(row, column, value) {
                            var primaryitem = codeMap.virtlFlagList.find(function(item)  {return item.value == value ? true : false;});
                            if (primaryitem) {return '<div class="jqx-grid-cell-left-align" style="margin-top: 6.5px;">' + primaryitem.label + '</div>';}
                            else {return '<div class="jqx-grid-cell-left-align" style="margin-top: 6.5px;">' + '선택하세요.' + '</div>';}
                        }
					},
					{ text: '가상화 구분 ID', datafield: 'virtlIdNm', width: 150 },
					{ text: 'I/F명', datafield: 'wbIfNmCd', width: 120, columntype: 'dropdownlist',
                        createeditor: function(row, value, editor){
                            editor.jqxDropDownList({source: codeMap.ifNmList, displayMember: 'label', valueMember: 'value', dropDownWidth: 150, autoDropDownHeight: true, placeHolder: "선택하세요."});
						},
                        geteditorvalue: function (row, cellvalue, editor) {return editor.val();},
                        cellsrenderer: function(row, column, value) {
                            var primaryitem = codeMap.ifNmList.find(function(item)  {return item.value == value ? true : false;});
                            if (primaryitem) {return '<div class="jqx-grid-cell-left-align" style="margin-top: 6.5px;">' + primaryitem.label + '</div>';}
                            else {return '<div class="jqx-grid-cell-left-align" style="margin-top: 6.5px;">' + '선택하세요.' + '</div>';}
                        }
					},
					{ text: 'I/F 추가정보', datafield: 'ifDesc', width: 120 },
					{ text: 'IP 수량', datafield: 'ipCnt', width: 120 },
					{ text: '이중화구성', datafield: 'dplxFlag', width: 120 , columntype: 'dropdownlist',
                        createeditor: function(row, value, editor){
                            editor.jqxDropDownList({source: codeMap.dplxFlagList, displayMember: 'label', valueMember: 'value', dropDownWidth: 150, autoDropDownHeight: true, placeHolder: "선택하세요."});
						},
                        geteditorvalue: function (row, cellvalue, editor) {return editor.val();},
                        cellsrenderer: function(row, column, value) {
                            var primaryitem = codeMap.dplxFlagList.find(function(item)  {return item.value == value ? true : false;});
                            if (primaryitem) {return '<div class="jqx-grid-cell-left-align" style="margin-top: 6.5px;">' + primaryitem.label + '</div>';}
                            else {return '<div class="jqx-grid-cell-left-align" style="margin-top: 6.5px;">' + '선택하세요.' + '</div>';}
                        }
					},
					{ text: '케이블타입', datafield: 'wbCableTypeCd', width: 100, columntype: 'dropdownlist',
                        createeditor: function(row, value, editor){
                            editor.jqxDropDownList({source: codeMap.cableTypeList, displayMember: 'label', valueMember: 'value', dropDownWidth: 150, autoDropDownHeight: true, placeHolder: "선택하세요."});
						},
                        geteditorvalue: function (row, cellvalue, editor) {return editor.val();},
                        cellsrenderer: function(row, column, value) {
                            var primaryitem = codeMap.cableTypeList.find(function(item)  {return item.value == value ? true : false;});
                            if (primaryitem) {return '<div class="jqx-grid-cell-left-align" style="margin-top: 6.5px;">' + primaryitem.label + '</div>';}
                            else {return '<div class="jqx-grid-cell-left-align" style="margin-top: 6.5px;">' + '선택하세요.' + '</div>';}
                        }
                    },
					{ text: 'duplex/speed', datafield: 'wbSpeedCd', width: 100 , columntype: 'dropdownlist',
                        createeditor: function(row, value, editor){
                            editor.jqxDropDownList({source: codeMap.speedList, displayMember: 'label', valueMember: 'value', dropDownWidth: 150, autoDropDownHeight: true, placeHolder: "선택하세요."});
						},
                        geteditorvalue: function (row, cellvalue, editor) {return editor.val();},
                        cellsrenderer: function(row, column, value) {
                            var primaryitem = codeMap.speedList.find(function(item)  {return item.value == value ? true : false;});
                            if (primaryitem) {return '<div class="jqx-grid-cell-left-align" style="margin-top: 6.5px;">' + primaryitem.label + '</div>';}
                            else {return '<div class="jqx-grid-cell-left-align" style="margin-top: 6.5px;">' + '선택하세요.' + '</div>';}
                        }
                    },
					{ text: '저장여부', datafield: 'chkSave', width: 100 }
				]
			}, CtxMenu.NONE);
		}

		//전체 영역 선택되는 버그 FIX
        grid.on('cellbeginedit', function (event) {
            var gridCells = grid.find('.jqx-grid-cell');
            gridCells.jqxDragDrop({disabled:true});
        });
        grid.on('cellendedit', function (event) {
            var gridCells = grid.find('.jqx-grid-cell');
            gridCells.jqxDragDrop({disabled:false});
        });
        grid.jqxGrid({ enablebrowserselection: false});
		btn.jqxDragDrop({disabled:true});
        //전체 영역 선택되는 버그 FIX


		//I/F 추가 버튼 클릭 이벤트 생성
		$('#btnAdd_if').on('click', function(){
            $('#ifGrid_'+record.ipassetHostNo).jqxGrid('addrow', $('#ifGrid_'+record.ipassetHostNo).jqxGrid('getrows').length,
				{num: $('#ifGrid_'+record.ipassetHostNo).jqxGrid('getrows').length +1, chkSave:"저장전"});
        });

        //I/F 삭제 버튼 클릭 이벤트 생성
        $('#btnDel_if').on('click', function(){
        	var selectedIfGrid = $('#ifGrid_'+record.ipassetHostNo);
            var rowIdxes = HmGrid.getRowIdxes(selectedIfGrid, '선택된 데이터가 없습니다.');
            if(rowIdxes === false) return;
            if(!confirm('[' + rowIdxes.length + ']건의 데이터를 삭제하시겠습니까?')) return;

            $.each(rowIdxes, function(idx, item){
                selectedIfGrid.jqxGrid('deleterow', item);
            })
            selectedIfGrid.jqxGrid('clearselection');
        });

        //I/F 삭제 버튼 클릭 이벤트 생성
        $('#btnSave_if').on('click', function(){
            var selectedIfGrid = $('#ifGrid_'+record.ipassetHostNo);

            var rowIdxes = HmGrid.getRowIdxes(selectedIfGrid, '선택된 데이터가 없습니다.');
            if(rowIdxes === false) return;
            if(!confirm('[' + rowIdxes.length + ']건의 데이터를 저장하시겠습니까?')) return;
            var _selectedDatas = [];
            $.each(rowIdxes, function(idx,value){
                var tmp = selectedIfGrid.jqxGrid('getrowdatabyid', value);
                _selectedDatas.push(tmp);
            });

            Server.post('/wooriBank/nms/ipApply/saveIf.do', {
                data : { ipassetHostNo: record.ipassetHostNo , list:_selectedDatas},
                success : function(result) {
                    alert('저장되었습니다.');
                    HmGrid.updateBoundData(selectedIfGrid, ctxPath + '/wooriBank/nms/ipApply/getIfList.do');
                }
            });
        });
	},

	/** init data */
	initData : function() {
		this.searchIpApply();


	},

	/** 네트워크 조회 */
	searchIpApply : function() {
		HmGrid.updateBoundData($ipApplyGrid, ctxPath + '/wooriBank/nms/ipApply/getIpApplyList.do');
	},

	/** 서버 추가 */
	addServer : function() {
		HmUtil.createPopup('/wooriBank/popup/nms/pServerAdd.do', $('#hForm'), 'pServerAdd', 500, 250);
	},

	/** 서버 삭제 */
	delServer : function() {
		var rowIdxes = HmGrid.getRowIdxes($ipApplyGrid, '선택된 데이터가 없습니다.');
		if(rowIdxes === false) return;
		if(!confirm('[' + rowIdxes.length + ']건의 데이터를 삭제하시겠습니까?')) return;
		var _ipassetHostNos = [];
		$.each(rowIdxes, function(idx,value){
			var tmp = $ipApplyGrid.jqxGrid('getrowdata', value);
			_ipassetHostNos.push(tmp.ipassetHostNo);
		});

		Server.post('/wooriBank/nms/ipApply/delServer.do', {
			data : { ipassetHostNos: _ipassetHostNos },
			success : function(result) {
				alert('삭제되었습니다.');
				HmGrid.updateBoundData($ipApplyGrid, ctxPath + '/wooriBank/nms/ipApply/getIpApplyList.do');
			}
		});
	},

	/** 서버 신청 */
    applyServer : function(rowIdx) {
        var rowIdxes = HmGrid.getRowIdxes($ipApplyGrid, '선택된 데이터가 없습니다.');
        if(rowIdxes === false) return;
        if(!confirm('[' + rowIdxes.length + ']건의 데이터를 신청하시겠습니까?')) return;
        var _ipassetHostNos = [];
        $.each(rowIdxes, function(idx,value){
            var tmp = $ipApplyGrid.jqxGrid('getrowdata', value);
            _ipassetHostNos.push(tmp.ipassetHostNo);
        });

        Server.post('/wooriBank/nms/ipApply/saveServerApply.do', {
            data : { ipassetHostNos: _ipassetHostNos },
            success : function(result) {
                alert('신청되었습니다.');
                HmGrid.updateBoundData($ipApplyGrid, ctxPath + '/wooriBank/nms/ipApply/getIpApplyList.do');
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