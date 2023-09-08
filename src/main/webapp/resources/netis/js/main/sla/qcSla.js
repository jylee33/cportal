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
			HmJqxSplitter.createTree($('#mainSplitter'));
            Master.createGrpTab2(Main.search);
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
							// 필터위해 미리 추가
							// datafields:[
                             //    { name:'appNo', type:'number' },
                             //    { name:'mngNo', type:'number' },
                             //    { name:'ifIdx', type:'string' },
                             //    { name:'grpName', type:'string' },
                             //    { name:'devName', type:'string' },
                             //    { name:'ifName', type:'string' },
                             //    { name:'disIspCd', type:'string' },
                             //    { name:'slaSpeed', type:'number' },
                             //    { name:'yyyymm', type:'string' },
                             //    { name:'discountSlaAmt', type:'number' },
                             //    { name:'calcSlaCharge', type:'number' },
                             //    { name:'defResp', type:'number' },
                             //    { name:'respAvg', type:'number' },
                             //    { name:'respRewardDay', type:'number' },
                             //    { name:'calcRespCharge', type:'number' },
                             //    { name:'defLossRate', type:'number' },
                             //    { name:'lossRateAvg', type:'number' },
                             //    { name:'lossRateRewardDay', type:'number' },
                             //    { name:'calcLossRateCharge', type:'number' },
							// ]
						},
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return JSON.stringify(data);
							}
						}
				),
                pagerheight: 27,
                pagerrenderer : HmGrid.pagerrenderer,
				columns: 
				[
                    { text : 'APP_NO', datafield : 'appNo', width : 100, hidden: true, pinned: true },
                    { text : 'MNG_NO', datafield : 'mngNo', width : 60, hidden: true, pinned: true },
                    { text : 'IF_IDX', datafield : 'ifIdx', width : 60, hidden: true, pinned: true },
                    { text : '기관명', datafield : 'grpName', width : 150, pinned: true },
                    { text : '장비명', datafield : 'devName', width: 150, pinned: true },
                    { text : '회선명', datafield : 'ifName', minwidth: 150, pinned: true },
                    { text : '통신사', datafield : 'disIspCd', width: 80, cellsalign: 'center' },
                    { text : '신청대역폭', datafield : 'slaSpeed', width: 100, cellsrenderer: HmGrid.unit1000renderer },
					{ text : '대상년월', datafield : 'yyyymm', width: 80, cellsalign: 'center' },
					{ text : '월 이용료', datafield : 'discountSlaAmt', width: 100, cellsalign: 'right', cellsformat: 'n' },
					{ text : '보상금액', datafield : 'calcSlaCharge', width: 100, cellsalign: 'right', cellsformat: 'n' },
                    { text : '기준', datafield : 'defResp', columngroup: 'resp', width: 80, cellsalign: 'center' },
                    { text : '측정', datafield : 'respAvg', columngroup: 'resp', width: 80, cellsalign: 'center' },
                    { text : '보상일', datafield : 'respRewardDay', columngroup: 'resp', width: 80, cellsalign: 'center' },
                    { text : '보상금액', datafield : 'calcRespCharge', columngroup: 'resp', width: 100, cellsalign: 'right', cellsformat: 'n' },
                    { text : '기준', datafield : 'defLossRate', columngroup: 'lossRate', width: 80, cellsalign: 'center' },
					{ text : '측정', datafield : 'lossRateAvg', columngroup: 'lossRate', width: 80, cellsalign: 'center' } ,
					{ text : '보상일', datafield : 'lossRateRewardDay', columngroup: 'lossRate', width: 80, cellsalign: 'center' },
                    { text : '보상금액', datafield : 'calcLossRateCharge', columngroup: 'lossRate', width: 100, cellsalign: 'right', cellsformat: 'n' },
					// { text : '보고서', datafield : 'isAttachFile', width: 80, cellsalign: 'center', editable: false },
					// { text : '등록자', datafield : 'lastUserName', width: 80, cellsalign: 'center', editable: false },
					// { text : '등록일시', datafield : 'lastUpd', width: 150, cellsalign: 'center', editable: false }
			    ],
			    columngroups:
				[
                    { text: '지연(400ms 초과 보상)', align: 'center', name: 'resp' },
					{ text: '손실율(0.1% 이상 보상)', align: 'center', name: 'lossRate' }

				]
			}, CtxMenu.QC_SLA);

			$('#section').css('display', 'block');
		},
		
		/** init data */
		initData: function() {
			// this.search();
		},

		// reportCellclass: function(row, columnfield, value) {
		// 	var row = $slaGrid.jqxGrid('getrowdata', row);
		// 	return row.isAttachFile == 1? 'slaState6' : null;
		// },
		
		getCommParams: function() {
			var params = Master.getGrpTabParams();
            params.sYyyymm = HmDate.getDateStr($('#sDate1'), 'yyyyMM');
			params.sIspCd = $('#sIspCd').val();
            return params;
		},
		
		/** 조회 */
		search: function() {
			HmGrid.updateBoundData($infoGrid, ctxPath + '/main/sla/qcSla/getQcSlaList.do');
		},

		/** export Excel */
		exportExcel: function() {
			HmUtil.exportGrid($infoGrid, '품질관리SLA', false);
		},

		showHelp: function() {
			HmUtil.createPopup('/main/popup/sla/pGNS_qcSlaHelp.do', $('#hForm'), 'pGNS_qcSlaHelp', 1000, 235);
		}

};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});