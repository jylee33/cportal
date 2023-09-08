var $infoGrid;
var Main = {
		/** variable */
		initVariable: function() {
			$infoGrid = $('#infoGrid');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
				case 'btnSearch': this.search(); break;
				case 'btnExcel': this.exportExcel(); break;
				case 'btnHelp': this.showHelp(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
            // $('#mainSplitter').jqxSplitter({ width: '99.8%', height: '99.8%', orientation: 'vertical', theme: jqxTheme, panels: [{ size: 254, collapsible: true }, { size: '100%' }] });
            // Master.createGrpTab2(Main.search);
			$('#sDate1').jqxDateTimeInput({ width: 120, height: 21, theme: jqxTheme, formatString: 'yyyy년 MM월', culture: 'ko-KR', views: ['year','decade'] });
			$('#sDate1').val(new Date());


            HmDropDownList.create($('#sIspCd'), {
                source: HmDropDownList.getSourceByUrl('/main/sla/slaMgmt/getSlaCodeList.do',
                    {cdKind: 'ISP_CD'}, 'post'),
                displayMember: 'cdNm', valueMember: 'cdId', width: 120, selectedIndex: 0
            })
				.on('bindingComplete', function() {
					$(this).jqxDropDownList('insertAt', {cdId: null, cdNm: '전체'}, 0);
				});

			HmGrid.create($infoGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
                            type: 'POST',
                            contentType: 'application/json; charset=UTF-8',
                            // datafields: [
                             //    {name: 'appNo', type: 'string'},
                             //    {name: 'appStatCd', type: 'string'},
                             //    {name: 'yyyymm', type: 'string'},
                             //    {name: 'agncNm', type: 'string'},
                             //    {name: 'appKindCd', type: 'string'},
                             //    {name: 'disAppKindCd', type: 'string'},
                             //    {name: 'ispCd', type: 'string'},
                             //    {name: 'disIspCd', type: 'string'},
                             //    {name: 'speedAmtCd', type: 'string'},
                             //    {name: 'disSpeedAmtCd', type: 'string'},
                             //    {name: 'distanceCd', type: 'string'},
                             //    {name: 'disDistanceCd', type: 'string'},
                             //    {name: 'discountCd', type: 'string'},
                             //    {name: 'disDiscountCd', type: 'string'},
                             //    {name: 'slaSpeed', type: 'number'},
                             //    {name: 'slaAmt', type: 'number'},
                             //    {name: 'discountSlaAmt', type: 'number'},
                             //    {name: 'appYmd', type: 'string'},
                            //    {name: 'wishYmd', type: 'string'},
                            //    {name: 'endYmd', type: 'string'},
                             //    {name: 'slaEndYmd', type: 'string'},
                             //    {name: 'rewardDay', type: 'number'},
                             //    {name: 'calcSlaCharge', type: 'number'}
							// ]
						},
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return JSON.stringify(data);
							}
						}
				),
                showstatusbar: true,
                statusbarheight: 25,
                showaggregates: true,
                pagerheight: 27,
                pagerrenderer : HmGrid.pagerrenderer,
				columns: 
				[
                    { text : 'APP_NO', datafield : 'appNo', width : 100, hidden: true },
                    { text : '신청분류', datafield : 'disAppKindCd', width : 120, cellsalign: 'center',
                        aggregatesrenderer: function () {
							return "<div style='margin-top: 4px;' class='jqx-center-align'>합계</div>";
						}
					},
                    { text : '기준월', datafield : 'yyyymm', width : 100, cellsalign: 'center' },
                    { text : '보상요금', datafield : 'calcSlaCharge', width : 120, cellsrenderer: Main.suffixRenderer,
                        aggregates: ['sum'], aggregatesrenderer: Main.agg_sumrenderer},
                    { text : '기관명', datafield : 'agncNm', minwidth : 150 },
                    { text : '통신사', datafield : 'disIspCd', width: 100, cellsalign: 'center' },
                    { text : '신청일', datafield : 'appYmd', width: 100, cellsalign: 'center' },
					{ text : '기준일', datafield : 'slaEndYmd', width: 100, cellsalign: 'center' },
                    { text : '완료일', datafield : 'endYmd', width: 100, cellsalign: 'center' },
                    { text : '희망일', datafield : 'wishYmd', width: 100, cellsalign: 'center' },
                    { text : '월 이용료', datafield : 'discountSlaAmt', width: 120, cellsrenderer: Main.suffixRenderer,
                        aggregates: ['sum'], aggregatesrenderer: Main.agg_sumrenderer},
                    { text : '보상대상', datafield : 'rewardDay', width: 100, cellsrenderer: Main.suffixRenderer,
                        aggregates: ['sum'], aggregatesrenderer: Main.agg_sumrenderer}
				]
			}, CtxMenu.COMM);

			$('#section').css('display', 'block');
		},
		
		/** init data */
		initData: function() {
			this.search();
		},

		getCommParams: function() {
			// var params = Master.getGrpTabParams();
			var params = {};
            params.sYyyymm = HmDate.getDateStr($('#sDate1'), 'yyyyMM');
			params.sIspCd = $('#sIspCd').val();
            return params;
		},

		agg_sumrenderer: function(aggregates, column) {
			var value = aggregates['sum'];
			var suffix = '';
			if($.inArray(column.datafield, ['rewardDay']) !== -1) {
				suffix = ' 일';
			}
			else {
				suffix = ' 원';
			}
			if(value === undefined) value = 0;

			if(isNaN(value)) {
				return '<div style="float: right; margin: 4px; overflow: hidden;">' + (value || 0) + suffix + '</div>';
			}
			else {
				return '<div style="float: right; margin: 4px; overflow: hidden;">' + HmUtil.commaNum(value || 0) + suffix + '</div>';
			}
		},

		suffixRenderer: function (row, datafield, value) {
			var _suffix = '';
			if($.inArray(datafield, ['rewardDay']) !== -1) {
				_suffix = ' 일';
			}
			else if($.inArray(datafield, ['calcSlaCharge', 'discountSlaAmt']) !== -1) {
				_suffix = ' 원';
			}
			if(value === undefined) return null;

			var cell = "<div style='margin-top: 4px; margin-right: 2px;' class='jqx-right-align'>";
			cell += value == 0? "-" : HmUtil.commaNum(value) + _suffix;
			cell += "</div>";
			return cell;
		},
	
		// dateformatRenderer: function(row, column, value) {
		// 	if ((value || '') == '') {
		// 		return null;
		// 	}
		// 	else {
		// 		var tmp = value.match(/^(\d{4})(\d{2})(\d{2})$/);
		// 		return '<div class="jqx-grid-cell-middle-align" style="margin-top: 6px;">{0}</div>'.substitute(tmp[1] + '-' + tmp[2] + '-' + tmp[3]);
		// 	}
		// },
		
		/** 조회 */
		search: function() {
			HmGrid.updateBoundData($infoGrid, ctxPath + '/main/sla/appSla/getAppSlaList.do');
		},

		/** export Excel */
		exportExcel: function() {
			HmUtil.exportGrid($infoGrid, '신청관리SLA', false);
		},

		showHelp: function() {
			HmUtil.createPopup('/main/popup/sla/pGNS_appSlaHelp.do', $('#hForm'), 'pGNS_appSlaHelp', 1000, 430);
		}

};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});