var $grpTree, $evtGrid;
var $cbPeriod_evtHist;
var timer;

var Main = {
		/** variable */
		initVariable : function() {
			$grpTree = $('#dGrpTreeGrid');
            $evtGrid = $('#evtGrid');

            $cbPeriod_evtHist = $('#cbPeriod_evtHist');
            this.initCondition();
        },

        initCondition: function() {
            HmBoxCondition.createPeriod('', Main.search, timer);
            HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
        },
		/** add event */
		observe : function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });

            $('.searchBox input:text').bind('keyup', function (event) {
                Main.keyupEventControl(event);
            });
		},

		/** event handler */
		eventControl : function(event) {
			var curTarget = event.currentTarget;
			switch (curTarget.id) {
			case "btnSearch": this.search(); break;
			case "btnExcel": this.exportExcel(); break;
			}
		},

        /** keyup event handler */
        keyupEventControl: function (event) {
            if (event.keyCode == 13) {
                Main.search();
            }
        },

		/** init design */
		initDesign : function() {
            HmJqxSplitter.createTree($('#mainSplitter'));
			HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.search, {devKind1 : 'SVR'});


           /* $('#refreshCycleCb').jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
                source: [
                    { label: 'NONE', value: 0 },
                    { label: '10초', value: 10 },
                    { label: '30초', value: 30 },
                    { label: '1분', value: 60 },
                    { label: '2분', value: 120 },
                    { label: '3분', value: 180 },
                    { label: '4분', value: 240 },
                    { label: '5분', value: 300 }
                ],
                displayMember: 'label', valueMember: 'value', selectedIndex: 2
            });*/


			/** 로그이벤트 그리드 그리기 */
			HmGrid.create($evtGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
                            datafields:[
                                { name:'cmLogEvtSeq', type:'number' },
                                { name:'disEvtLevel', type:'number' },
                                { name:'ymdhms', type:'string' },
                                { name:'grpName', type:'string' },
                                { name:'disDevName', type:'string' },
                                { name:'devIp', type:'string' },
                                { name:'mngNo', type:'number' },
                                { name:'devKind1', type:'string' },
                                { name:'devKind2', type:'string' },
                                { name:'perfPoll', type:'number' },
                                { name:'disPerfPoll', type:'string' },
                                { name:'logEvtName', type:'string' },
                                { name:'limitLogCond', type:'string' },
                                { name:'realLogCond', type:'string' },
                                { name:'logText', type:'string' },
                                { name:'freeDate', type:'string' },
                                { name:'freeUser', type:'string' },
                            ]
						},
						{
							formatData: function(data) {
                                var _grpNo = 0, _grpParent = 0, _grpType = 'DEFAULT', _itemKind = 'GROUP';
                                var treeItem = HmTreeGrid.getSelectedItem($grpTree);
                                var grpSelection = $grpTree.jqxTreeGrid('getSelection');
                                if(treeItem != null) {
                                    _itemKind = treeItem.devKind2;
                                    _grpNo = _itemKind == 'GROUP'? treeItem.grpNo : treeItem.grpNo.split('_')[1];
                                    _grpParent = treeItem.grpParent;
                                }

                                var period = HmBoxCondition.getPeriodParams();
                                var _refreshCycleCb =  period.period;

                                if(_refreshCycleCb !== '0'){
                                    data.date1 = period.date1;
                                    data.time1 = period.time1;
                                    data.date2 = period.date2;
                                    data.time2 = period.time2;
                                }

                                $.extend(data, {
                                    grpType: _grpType,
                                    grpNo: _grpNo,
                                    grpParent: _grpParent,
                                    itemKind: _itemKind,
                                    // sIp: $('#sIp').val(),
                                    // sDevName: $('#sName').val(),
                                    isRealTime: _refreshCycleCb == '0' ? 0 : 1
                                }, HmBoxCondition.getSrchParams());
                                return data;
							}
						}
				),
                pagerheight: 27,
                pagerrenderer : HmGrid.pagerrenderer,
				columns:
				[
			 		{ text: 'Log No', datafield: 'cmLogEvtSeq', width: 80, hidden: true },
                    { text : '장애등급', datafield : 'disEvtLevel', width : 70, filtertype: 'checkedlist', cellsrenderer : HmGrid.evtLevelrenderer, cellsalign: 'center',
                        createfilterwidget: function (column, columnElement, widget) {
                            widget.jqxDropDownList({
                                renderer: HmGrid.evtLevelFilterRenderer
                            });
                        }
                    },
                    { text : '일시', datafield : 'ymdhms', width : 140, cellsalign: 'center' },
                    { text: '그룹명', datafield: 'grpName', width: 130 },
                    // { text : '장애종류', datafield : 'srcType', width: 80 },
                    { text : '서버명', datafield : 'disDevName', width : 150, cellsrenderer: HmGrid.devNameRenderer },
                    { text : '서버IP', datafield : 'devIp', width : 120 },
                    { text : '성능수집', datafield : 'perfPoll', displayfield: 'disPerfPoll', width : 100 },
                    { text : '서버번호', datafield : 'mngNo', hidden: true },
                    { text : '타입', datafield : 'devKind1', hidden: true},
                    { text : '종류', datafield : 'devKind2', hidden: true},
                    { text : '이벤트명', datafield : 'logEvtName', width : 140 },
                    { text : '제한 LOG 조건', datafield : 'limitLogCond', width : 140 },
                    { text : '실제 LOG 조건', datafield : 'realLogCond', width : 140 },
                    { text : 'LOG 내용', datafield : 'logText', minwidth : 200 },
                    { text : '해제일시', datafield : 'freeDate', width : 140 },
                    { text : '해제자', datafield : 'freeUser', width : 120 }
			    ]
			}, CtxMenu.COMM, 0);

		},

		/** init data */
		initData : function() {

		},

		/** 서버현황 그리드 조회 */
		search : function() {
			HmGrid.updateBoundData($evtGrid, ctxPath + '/main/sms/logEvtHist/getLogEvtHist.do');
		},

		/** export Excel */
		exportExcel: function() {
			HmUtil.exportGrid($evtGrid, '로그 이벤트 이력', false);
		}


};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});
