var $rptGrid
var Main = {
		/** variable */
		initVariable: function() {
            $rptGrid = $('#rptGrid');
		},

		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},

		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.searchRpt(); break;
			}
		},

		/** init design */
		initDesign: function() {
            // 보고서 유형
            HmDropDownList.create($('#sDrptType'), {
                source: [
                    {label: 'NMS 일일보고서', value: 'NMS_DAILY'},
                    {label: 'NMS 월간보고서', value: 'NMS_MONTHLY'},
                    {label: 'SMS 일일보고서', value: 'SMS_DAILY'},
                    {label: 'SMS 월간보고서', value: 'SMS_MONTHLY'},
                    {label: 'WNMS 일일보고서', value: 'WNMS_DAILY'},
                    {label: 'WNMS 월간보고서', value: 'WNMS_MONTHLY'}
                ], width: 250, selectedIndex: 0
            });
            $('#sDrptType').on('change', function(event) {
                Main.searchDrptList();

                var rptType = $(this).val();
                if(rptType == 'NMS_DAILY') {
                    $('#date1').jqxDateTimeInput({width: 120, height: '21px', formatString: 'yyyy-MM-dd', theme: jqxTheme, culture: 'ko-KR', views: ["year", "month", "decade"]})
                        .val(new Date());
                }
                else {
                    $('#date1').jqxDateTimeInput({width: 120, height: '21px', formatString: 'yyyy-MM', theme: jqxTheme, culture: 'ko-KR', views: ["year", "decade"]});
                }

            });
            HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: 350, min: 150, collapsible: false }, { size: '100%' }], 'auto', '100%');
            $('#date1').jqxDateTimeInput({width: 120, height: '21px', formatString: 'yyyy-MM-dd', theme: jqxTheme, culture: 'ko-KR', views: ["year", "month", "decade"]}).val(new Date());
			// Master.createPeriodCondition($('#cbPeriod'), $('#date1'), $('#date2'));
			HmWindow.create($('#pwindow'), 100, 100);

            // HmGrid.create($rptGrid, {
            //     source: new $.jqx.dataAdapter(
            //         {
            //             datatype: 'json'
            //         },
            //         {
            //             formatData: function(data) {
            //                 return data;
            //             }
            //         }
            //     ),
            //     editmode: 'selectedrow',
            //     columns:
            //         [
            //             { text : '보고서번호', datafield: 'rptNo', width: 180, editable: false, hidden: true },
            //             { text : '보고서명', datafield: 'rptName', minwidth: 180, editable: false},
            //             { text : '보고서 파일명', datafield: 'rptFileName', minwidth: 180, editable: false, hidden: true}
            //         ]
            // });
            HmGrid.create($rptGrid, {
                source: new $.jqx.dataAdapter({
                    datatype: 'json',
                    type: 'post',
                    contenttype: 'application/json',
                    url: ctxPath + '/main/rpt/dynamicRpt/getDRptList.do',
                    id: 'drptNo'
                }, {
                    formatData: function(data) {
                        data.drptType = $('#sDrptType').val();
                        return JSON.stringify(data);
                    }
                }),
                pageable: false,
                sortable: false,
                showheader: true,
                showtoolbar: true,
                rendertoolbar: function(toolbar) {
                    HmGrid.titlerenderer(toolbar, '보고서 목록');
                },
                columns: [
                    { text: '보고서명', datafield: 'drptNm' },
                    { text: '그룹사', datafield: 'grpName' },
                    { text: '스타일 테마', datafield: 'theme', width: 80 }
                ]
            }, CtxMenu.NONE);
            $rptGrid.on('rowselect', function(event) { // 보고서 클릭
                Main.getRptViewer(event.args.row);
            });

            // $rptGrid.jqxGrid('addrow', null, [{rptNo: 1, rptName: '기간테스트', rptFileName: 'rangeTest'},{rptNo: 2, rptName: '테스트', rptFileName: 'NetworkMonthlyOperReport'}]);
            // $rptGrid.on('rowdoubleclick', function(event){
            //    Main.getRptViewer(event.args.row.bounddata);
            // });
		},

		/** init data */
		initData: function() {

		},

        searchDrptList: function() {
            HmGrid.updateBoundData($rptGrid);
        },

    	searchRpt: function(){
             var rowidx = HmGrid.getRowIdx($rptGrid, '선택된 데이터가 없습니다.');
            if(rowidx === false) return;
            var rowdata = $rptGrid.jqxGrid('getrowdata', rowidx);
            Main.getRptViewer(rowdata);

		},
    	getRptViewer: function(data){
			var _rptName = data.drptNm;
            var _rptFileName = 'dynamicReport{0}.rptdesign'.substitute(data.drptNo);
            var _date1 = $('#date1').val('date');
            var _yyyymm = HmDate.getDateStr($('#date1'),'yyyyMM'),
                _fromYmd = null, _toYmd = null;

            _fromYmd = _yyyymm + '01';
            var lastDayOfMonth = new Date(_date1.getFullYear(), _date1.getMonth()+1, 0).getDate();
            _toYmd = _yyyymm + lastDayOfMonth;
            var _list = {
                drptNm: data.drptNm,
                rptGrpNm: data.grpName,
                drptNo: data.drptNo,
                rptGrpNo: data.rptGrpNo,
                topN: data.topCnt,
                yyyymm: _yyyymm,
                ymd: HmDate.getDateStr($('#date1'), 'yyyyMMdd'),
                fromYmd: _fromYmd,
                toYmd: _toYmd
            };

            $('#rptView').load( "/main/com/rptViewer.do", {
                rptName: _rptName,
                rptFileName: _rptFileName ,
                // baseURL: location.origin + '/birt',
                baseURL: location.protocol + '//' + location.hostname + ':' + $('#gBirtServerPort').val() + '/birt',
                //baseURL: 'http://183.109.124.233:44821/birt',
                //baseURL: 'http://10.1.1.212:8080/birt',
                list: JSON.stringify(_list)
            });
		}
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});