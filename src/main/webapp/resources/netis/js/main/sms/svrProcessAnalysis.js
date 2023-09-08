var $grpTree, $processGrid;
var $cbPeriod_evtHist;
var timer;

var Main = {
		/** variable */
		initVariable : function() {
			$grpTree = $('#dGrpTreeGrid');
            $processGrid = $('#procGrid');

            $cbPeriod_evtHist = $('#cbPeriod_evtHist');
            this.initCondition();
        },

        initCondition: function() {
            HmBoxCondition.createPeriod('', Main.search, timer);
            HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_process_srch_type'));
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

            $('#cpuPerfOver, #memoryPerfOver').jqxNumberInput({
                width: 70, height: 22,
                min: 0,
                max: 100,
                decimalDigits: 2,
                inputMode: 'simple',
                spinButtons: true,
                theme: jqxTheme
            });

            $('#cpuPerfOver').val(20);
            $('#memoryPerfOver').val(20);


			/** 프로세스분석 그리드 그리기 */
			HmGrid.create($processGrid, {
                source: new $.jqx.dataAdapter(
                    {
                        datatype: 'json'
                    },
                    {
                        formatData: function(data) {
                            var _grpNo = 0, _grpParent = 0, _grpType = 'DEFAULT', _itemKind = 'GROUP';
                            var treeItem = HmTreeGrid.getSelectedItem($grpTree);
                            if(treeItem !== null) {
                                _itemKind = treeItem.devKind2;
                                _grpNo = _itemKind == 'GROUP'? treeItem.grpNo : treeItem.grpNo.split('_')[1];                                _
                            }
                            var period = HmBoxCondition.getPeriodParams();
                            var _refreshCycleCb =  period.period;

                            // if(_refreshCycleCb !== '0'){
                            //     data.date1 = period.date1;
                            //     data.time1 = period.time1;
                            //     data.date2 = period.date2;
                            //     data.time2 = period.time2;
                            // }

                            $.extend(data, {
                                grpType: _grpType,
                                grpNo: _grpNo,
                                grpParent: _grpParent,
                                itemKind: _itemKind,
                                isRealTime: _refreshCycleCb == '0' ? 0 : 1
                            }, HmBoxCondition.getSrchParams());
                            $.extend(data, {}, period);
                            return data;
                        }
                    }
                ),
                columns:
                    [
                        { text: '서버번호', datafield: 'mngNo', width: 80, hidden: true },
                        { text : '그룹명', datafield: 'grpName', width: 150, pinned: true },
                        { text : '서버명', datafield: 'svrName', displayfield: 'disDevName', minwidth: 200, pinned: true, cellsrenderer: HmGrid.devNameRenderer },
                        { text : '일시', datafield : 'ymdhms', minwidth : 150, align:'center',cellsalign:'center'},
                        { text : '감시', datafield : 'mProcName', minwidth : 50, cellsrenderer: Main.mProcRenderer },
                        { text : '프로세스명', datafield : 'name', minwidth : 150  },
                        { text : 'PID', datafield: 'pid',width: 40, align:'center',cellsalign:'center'},
                        { text : 'PPID', datafield: 'ppid', width: 40, align:'center',cellsalign:'center'},
                        { text : '유저명', datafield: 'userName', width: 80, align:'center',cellsalign:'center'},
                        { text : '상태', datafield: 'state', width: 80, align:'center',cellsalign:'center'},
                        { text : '평균', datafield : 'cpuPct', width : 60, align:'center',cellsrenderer: Main.reSetProgressbar, columngroup: 'cpu'},
                        { text : '최대', datafield : 'cpuPctMax', width : 60, align:'center',cellsrenderer: Main.reSetProgressbar, columngroup: 'cpu'},
                        { text : '최소', datafield : 'cpuPctMin', width : 60, align:'center',cellsrenderer: Main.reSetProgressbar, columngroup: 'cpu'},
                        { text : '평균', datafield : 'memPct', width : 60, align:'center',cellsrenderer: Main.reSetProgressbar, columngroup: 'mem'},
                        { text : '최대', datafield : 'memPctMax', width : 60, align:'center',cellsrenderer: Main.reSetProgressbar, columngroup: 'mem'},
                        { text : '최소', datafield : 'memPctMin', width : 60, align:'center',cellsrenderer: Main.reSetProgressbar, columngroup: 'mem'},
                        { text : '평균', datafield : 'memRss', width : 70, cellsrenderer: HmGrid.unit1024renderer, columngroup: 'rssMem' },
                        { text : '최대', datafield : 'memRssMax', width : 70, cellsrenderer: HmGrid.unit1024renderer, columngroup: 'rssMem' },
                        { text : '최소', datafield : 'memRssMin', width : 70, cellsrenderer: HmGrid.unit1024renderer, columngroup: 'rssMem' },
                        { text : '평균', datafield : 'memShare', width : 70, cellsrenderer: HmGrid.unit1024renderer, columngroup: 'shareMem' },
                        { text : '최대', datafield : 'memShareMax', width : 70, cellsrenderer: HmGrid.unit1024renderer, columngroup: 'shareMem' },
                        { text : '최소', datafield : 'memShareMin', width : 70, cellsrenderer: HmGrid.unit1024renderer, columngroup: 'shareMem' },
                        { text : '평균', datafield : 'memSize', width : 70, cellsrenderer: HmGrid.unit1024renderer, columngroup: 'memSize' },
                        { text : '최대', datafield : 'memSizeMax', width : 70, cellsrenderer: HmGrid.unit1024renderer, columngroup: 'memSize' },
                        { text : '최소', datafield : 'memSizeMin', width : 70, cellsrenderer: HmGrid.unit1024renderer, columngroup: 'memSize' },
                        { text : '실행 시간', datafield : 'startTime', width : 160, cellsalign: 'center' },
                        { text : 'CMD', datafield : 'cmdline', width : 500 }
                    ],
                columngroups:
                    [
                        { text: 'CPU', align: 'center', name: 'cpu'},
                        { text: 'Memory(%)', align: 'center', name: 'mem'},
                        { text: 'RSS Memory', align: 'center', name: 'rssMem'},
                        { text: 'Share Memory', align: 'center', name: 'shareMem'},
                        { text: 'Memory', align: 'center', name: 'memSize'}
                    ]
			}, CtxMenu.COMM, 0);

            $processGrid.on('bindingcomplete', function () {
                Main.setProcessValue();
            });

		},

        reSetProgressbar: function (row, column, value) {
		    if (column == 'cpuPctMin' || column == 'cpuPct' || column == 'cpuPctMax') overThresholdValue = $('#cpuPerfOver').val();
		    else if (column == 'memPctMin' || column == 'memPct' || column == 'memPctMax') overThresholdValue = $('#memoryPerfOver').val();

            cellWidth = 100;
            try {
                cellWidth = parseInt($(this)[0].width) - 12;
                cell = '<div  class="jqx-grid-cell-middle-align" style="margin: 5px 6px; padding-bottom: 0; height: 18px; background: #F1F1F1 ;">';

                pColor = '#88caf3';
                if (overThresholdValue && value > overThresholdValue) {
                    pColor = '#FF0000';
                }

                cell += '<div style="background:' + pColor + '; position: relative; width: ' + (cellWidth / 100 * value) + 'px; height: 100%"></div>';
                cell += '<div style="margin-left: 5px; position: relative; top: -16px; color: #282828;">' + value.toString() + ' %' + '</div>';
                cell += '</div>';

            } catch (e) {
            }
            return cell;
        },

        mProcRenderer: function (row, column, value) {
		    console.log("ddddd ==> ", value)
            cell = $('<div></div>', {
                class: 'jqx-grid-cell-middle-align',
                style: 'margin: 5px 6px'
            });
            if (!$.isBlank(value)) status = 'alive';
            else status = 'unset';

            cell.append($('<img></img>', {
                src: '/img/status/{0}.svg'.substitute(HmGrid.getImgByStatus(status)),
                style: 'width: 14px; height: 14px;'
            }));
            return cell[0].outerHTML;

        },

        setProcessValue: function () {
            $('#totalProcessCnt').text(0);
            $('#zombieProcessCnt').text(0);
            $('#cpuProcessCnt').text(0);
            $('#memoryProcessCnt').text(0);

            var rows = $processGrid.jqxGrid('getboundrows');
            if (rows != null && rows.length > 0) {
                var cOver = $('#cpuPerfOver').val();
                var mOver = $('#memoryPerfOver').val();
                var zombieCnt = 0, cpuOverCnt = 0, memoryOverCnt = 0;
                $.each(rows, function (idx, item) {
                    if (item.cpuPctMax > cOver) cpuOverCnt++;
                    if (item.memPctMax > mOver) memoryOverCnt++;
                    if (item.state == 'zombie') zombieCnt++;
                });

                $('#totalProcessCnt').text(HmUtil.commaNum(rows.length));
                $('#zombieProcessCnt').text(HmUtil.commaNum(zombieCnt));
                $('#cpuProcessCnt').text(HmUtil.commaNum(cpuOverCnt));
                if (cpuOverCnt > 0) {
                    $("#cpuProcessCnt").css("color",'#FF0000');
                }
                $('#memoryProcessCnt').text(HmUtil.commaNum(memoryOverCnt));
                if (memoryOverCnt > 0) {
                    $("#memoryProcessCnt").css("color",'#FF0000');
                }

            }
        },

		/** init data */
		initData : function() {

		},

		/** 프로세스 분석 현황 그리드 조회 */
		search : function() {
			HmGrid.updateBoundData($processGrid, ctxPath + '/main/sms/svrPerfAnalysis/getProcessAnalysisList.do');
		},

		/** export Excel */
		exportExcel: function() {
			HmUtil.exportGrid($processGrid, '프로세스 분석 현황', false);
		},


};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});
