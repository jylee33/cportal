var $evtGrid, $devGrid, $filterGrid;
var evtIndex;
var Main = {

	/** variable */
	initVariable : function() {
        $evtGrid = $('#trapEvtGrid');
        $devGrid = $('#trapDevGrid');
        $filterGrid = $('#trapFilterGrid');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
        $('.searchBox').bind('keyup', function(event) { Main.keyupEventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
			case "btnSearch": this.search(); break;
			case "btnAdd":	this.addEvtConf(); break;
			case "btnEdit":	this.editEvtConf(); break;
			case "btnDel":	this.delEvtConf(); break;
            case "btnAdd_filter":	this.addFilter(); break;
            case "btnEdit_filter":	this.editFilter(); break;
            case "btnDel_filter":	this.delFilter(); break;
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
        var searchType = [
            { label: '이벤트명', value: 'sEvtName' },
            { label: '등급', value: 'sEvtLevelStr' }
        ];
        HmBoxCondition.createRadioInput($("#sSrchType"), JSON.parse(JSON.stringify(searchType)));

		HmJqxSplitter.createTree($('#mainSplitter'));
		Master.createGrpTab(Main.search, {devKind1: 'DEV,SVR'});
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
        HmJqxSplitter.create($('#v_splitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '64%', collapsible: false }, { size: '36%' }], 'auto', '100%');

		Main.createEvtGrid();
        Main.createDevGrid();
		Main.createFilterGrid();

        $('#section').css('display', 'block');
	},

	/** init data */
	initData : function() {

	},
	selectTree: function() {
		Main.search();
	},

    search: function() {
		HmGrid.updateBoundData($evtGrid, '/main/nms/trap/mgmt/getTrapEvtConfList.do')
	},

    searchDev: function () {
        HmGrid.updateBoundData($devGrid, '/main/nms/trap/mgmt/getTrapEvtDevList.do')
    },

    searchConfFilter: function () {
        HmGrid.updateBoundData($filterGrid, '/main/nms/trap/mgmt/getTrapEvtFilterList.do')
    },

    addEvtConf: function () {
        $.post(ctxPath + '/main/popup/nms/pTrapEvtConfAdd.do',
            function(result) {
                HmWindow.openFit($('#pwindow'), 'Trap 이벤트 등록', result, 665, 407, 'pwindow_init');
            }
        );
    },

    editEvtConf: function () {
        var rowData = HmGrid.getRowData($evtGrid);
        var devList = $devGrid.jqxGrid('getrows');
        if(rowData == null) {
            alert('이벤트를 선택해주세요.');
            return;
        }
        rowData.devList = devList;
        $.post(ctxPath + '/main/popup/nms/pTrapEvtConfEdit.do', {}, function(result) {
            HmWindow.openFit($('#pwindow'), 'Trap 이벤트 수정', result, 665, 700, 'pwindow_init', rowData);
        });
    },

    delEvtConf: function () {
        var rowData = HmGrid.getRowData($evtGrid);
        if(rowData == null) {
            alert('이벤트를 선택해주세요.');
            return;
        }

        if(!confirm('해당 이벤트를 삭제하시겠습니까?')) return;

	    Server.post('/main/nms/trap/mgmt/delTrapEvtConf.do',{
	        data: { evtNo: rowData.evtNo },
            success: function (msg) {
	            Main.search();
                alert(msg);
                evtIndex = 0;
            }
        })
    },

    addFilter: function () {
        var rowData = HmGrid.getRowData($evtGrid);
        if(rowData == null) {
            alert('이벤트를 선택해주세요.');
            return;
        }

        $.post(ctxPath + '/main/popup/nms/pTrapEvtFilterAdd.do',  {},
            function(result) {
                HmWindow.openFit($('#pwindow'), 'Trap 이벤트 필터 추가', result, 500, 407, 'pwindow_init', rowData);
            }
        );
    },

    editFilter: function () {
        var rowData = HmGrid.getRowData($filterGrid);
        if(rowData === null) {
            alert('필터를 선택해주세요.');
            return;
        }

        $.post(ctxPath + '/main/popup/nms/pTrapEvtFilterEdit.do',  {},
            function(result) {
                HmWindow.openFit($('#pwindow'), 'Trap 이벤트 필터 수정', result, 500, 407, 'pwindow_init', rowData);
            }
        );
    },

    delFilter: function () {
        var rowData = HmGrid.getRowData($filterGrid);
        if(rowData === null) {
            alert('필터를 선택해주세요.');
            return;
        }

        if(!confirm('해당 필터를 삭제하시겠습니까?')) return;

        Server.post('/main/nms/trap/mgmt/delTrapEvtFilter.do', {
            data: rowData,
            success: function (msg) {
                alert(msg);
                Main.searchConfFilter();
            }
        })
    },

	createEvtGrid: function () {
        HmGrid.create($evtGrid, {
            source : new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function(data) {
                        $.extend(data, Main.getSrchParams());
                        return data;
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, 'Trap 이벤트');
            },
            columns :
                [
                    { text : '번호', datafield : 'evtNo' , hidden:true, pinned: true, width: '5%'},
                    { text : '이벤트명', datafield : 'evtNm' , width:'50%', pinned: true },
                    { text : '등급', datafield : 'evtLevel', width: '10%', cellsrenderer: HmGrid.evtLevelRenderer },
                    { text : '대상 장비 수', datafield : 'devCnt' , width: '10%' , cellsrenderer: HmGrid.commaNumrenderer },
                    { text : '자동 해제여부', datafield : 'eventFreeFlag' , width: '10%',  columntype: 'checkbox'},
                    { text : '자동 해제시간(분)', datafield : 'eventFreeMin' , width: '10%' },
                    { text : '사용여부', datafield : 'useFlag' , width: '10%',  columntype: 'checkbox'}
                ]
        });

        $evtGrid.on('bindingcomplete', function (event) {
            $evtGrid.jqxGrid('selectrow', 0)
        });

        $evtGrid.on('rowselect', function (event) {
            if(event.args.row) evtIndex = event.args.row.boundindex;
            Main.searchDev();
            Main.searchConfFilter();
        })
    },

    createDevGrid: function () {
        HmGrid.create($devGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function(data) {
                        var evtInfo = HmGrid.getRowData($evtGrid, evtIndex);
                        if(evtInfo) {
                            data.workerNo = evtInfo.evtNo;
                        }
                        return data;
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '대상 장비');
            },
            selectionmode: 'singlerow',
            columns:
                [
                    { text: '그룹', datafield: 'grpName', width: 130, hidden: true},
                    { text: '장비명', datafield: 'disDevName', width: '35%' },
                    { text: '장비IP', datafield: 'devIp', width: '20%' },
                    { text: '장비종류', datafield: 'devKind2', width: '15%', filtertype: 'checkedlist'  },
                    { text: '제조사', datafield: 'vendor', width: '15%', filtertype: 'checkedlist'  },
                    { text: '모델', datafield: 'model', width: '15%', filtertype: 'checkedlist'  }
                ],
        });
    },

	createFilterGrid: function () {

        HmGrid.create($filterGrid, {
            source : new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function (data) {
                        var evtInfo = HmGrid.getRowData($evtGrid, evtIndex);
                        if(evtInfo) data.workerNo = evtInfo.evtNo;
                        return data;
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '이벤트 발생 규칙<span style="font-size: 11px"> (*필터는 AND 조건으로 동작합니다.)</span>');
            },
			pageable: false,
            columns :
                [
                    { text : '필터종류', datafield : 'filterType' , width: 150, cellsrenderer: Main.filterTypeRenderer},
                    { text : '필터명', datafield : 'filterName' , width: 150},
                    { text : '발생/해제 조건', datafield : 'usingCond' , width: 150, cellsrenderer: Main.usingCondRenderer },
                    { text : '문자열/정규식', datafield : 'filterForm' , minwidth: 150 },
                    { text : '대소문자구분', datafield : 'caseIgnore' , width: 100, columntype: 'checkbox'},
                ]
        });
    },

    getSrchParams: function(radioNm) {
        if(radioNm === undefined) {
            radioNm = 'sSrchType';
        }
        var type = $("input:radio[name={0}]:checked".substitute(radioNm)).val();
        var text = $('#{0}_input'.substitute(radioNm)).val();

        var evtLevel;
        if(type === 'sEvtLevelStr') {
            switch (text) {
                case '정보' : evtLevel = 1; break;
                case '주의' : evtLevel = 2; break;
                case '알람' : evtLevel = 3; break;
                case '경보' : evtLevel = 4; break;
                case '장애' : evtLevel = 5; break;
                default: evtLevel = 0;
            }
        }

        return {
            sEvtName: type === 'sEvtName'? text : null,
            sEvtLevelStr: type === 'sEvtLevelStr'? text : null,
            sEvtLevel: type === 'sEvtLevelStr'? evtLevel : null
        };
    },

    filterTypeRenderer: function (row, column, value) {
        var txt = value === 0 ? '문자열' : '정규식';
        return '<div style="margin: 6.5px 0 0 4px">' + txt +'</div>';
    },

    usingCondRenderer: function (row, column, value) {
        var txt = value === 0 ? '발생' : '해제';
        return '<div style="margin: 6.5px 0 0 4px">' + txt +'</div>';
    }
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});