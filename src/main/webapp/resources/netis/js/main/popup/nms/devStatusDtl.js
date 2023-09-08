var $dtlTab;
var sAuth;
var PMain = {
	/** variable */
	initVariable: function() {
		sAuth = $('#sAuth').val().toUpperCase();
		$dtlTab = $('#dtlTab');
	},

	/** add event */
	observe: function() {
		$('button').bind('click', function(event) { PMain.eventControl(event); });
	},

	/** event handler */
	eventControl: function(event) {
		var curTarget = event.currentTarget;
		switch(curTarget.id) {
			case 'btnChgInfo': this.chgInfo(); break;
		}
	},

	/** init design */
	initDesign: function() {

		if(sAuth != 'SYSTEM' && sAuth != 'ADMIN') {
			$('#btnChgInfo').hide();  // 권한에 따른 설정버튼 숨김
		}

		$dtlTab.jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
			initTabContent: function(tab) {
				switch(tab) {
				case 0: // 요약
					break;
				case 1: // TopN
					pTopnPerf.initDesign();
					pTopnPerf.initData();
					break;
				case 2: // 회선정보
					pIfInfo.initDesign();
					pIfInfo.initData();
					break;
				case 3: // 성능
					pPerf.initDesign();
					pPerf.initData();
					break;
				/** 성능탭 하단에 있던 실시간조회 탭을 성능탭 옆으로 이동(성능탭 이하 장비 Config 탭부터 번호 1씩 증가) **/
				case 4: // 실시간 성능 조회
					pPerfRealtime.initialize();
					pPerfRealtime.initDesign();
					break;
				case 5: // 장비Config
					pDevConf.initDesign();
					pDevConf.initData();
					break;
				case 6: // 장비RoutingConfig
					pDevRoutingConf.initDesign();
					pDevRoutingConf.initData();
					break;
				case 7: // Client 명령어
					cliResult.initDesign();
					cliResult.initData();
					break;
				case 8: // 이벤트
					pEvtInfo.initDesign();
					pEvtInfo.initData();
					break;
				case 9: // 모듈/카드
					pModuleCard.initDesign();
					pModuleCard.initData();
					break;
				case 10: // 변경관리
					pChgHist.initDesign();
					pChgHist.initData();
					break;
				case 11: // 자산
					pAsset.initDesign();
					pAsset.initData();
					break;
				case 12: // portview
					pPortView.initDesign();
					pPortView.initData();
					break;
				case 13: // 성능예측
					pPerfPredict.initDesign();
					pPerfPredict.initData();
					break;
				case 14: // 장애예측
					pErrPredict.initDesign();
					pErrPredict.initData();
					break;
				case 15: // 회선연결정보
					pAutoLink.initDesign();
					pAutoLink.initData();
					break;
				case 16: // 임계치가이드
					pDevPerfThreshold.initDesign();
					pDevPerfThreshold.initData();
					break;
				case 17: // 성능비교
                    pDevPerfCompare.initDesign();
                    pDevPerfCompare.initData();
					break;
				}
			}
		})
		.on('selected', function(event) {
			PMain.search();
		});

        var themeSetting= { theme: "ui-hamon-v1-tab-top" };
        $dtlTab.jqxTabs(themeSetting);

        PMain.resizeCharEventControl();  // 차트 리사이징

	},

	resizeCharEventControl: function () {

		$('#mainSplitter').on('resize', function (event) {
			var dtlTab = $('#dtlTab').val();
			switch (dtlTab) {
				case 3:		//성능
					switch ($('#perfTab').val()) {
						case 0 : if (pPerfCpu) pPerfCpu.resizeChart(); break;
						case 1 : if (pPerfMemory) pPerfMemory.resizeChart(); break;
						case 2 : if (pPerfTemp) pPerfTemp.resizeChart(); break;
						case 3 : if (pPerfResp) pPerfResp.resizeChart(); break;
						case 4 : if (pPerfSession) pPerfSession.resizeChart(); break;
						case 5 : if (pPerfCps) pPerfCps.resizeChart(); break;
						case 6 : if (pPerfDevPeriod) pPerfDevPeriod.resizeChart(); break;
					}
					break;
				case 4: if(pPerfRealtime) pPerfRealtime.resizeChart(); break; //실시간
				case 13:if(pPerfPredict) pPerfPredict.resizeChart(); break; //성능예측
				case 14: if(pErrPredict) pErrPredict.resizeChart(); break; //장애예측
				case 16: if(pDevPerfThreshold) pDevPerfThreshold.resizeChart(); break; //임계치가이드
                case 17: if(pDevPerfCompare) pDevPerfCompare.resizeChart(); break; //성능비교
			}
		});
	},

	/** init data */
	initData: function() {

	},

	search: function() {
		try{
			switch($dtlTab.val()) {
			case 0: // 요약
				pSummary.search();
				break;
			case 1: // TopN
				pTopnPerf.search();
				break;
			case 2: // 회선정보
				pIfInfo.search();
				break;
			case 3: // 성능
				pPerf.search();
				break;
			case 4:	// 실시간성능조회
				//pPerfRealtime.reSetDesign();
				// pPerfRealtime.searchAll();
				break;
			case 5: // 장비Config
				pDevConf.search();
				break;
			case 6: // Routing
				pDevRoutingConf.search();
				break;
			case 7: // Client 명령어
				cliResult.search();
				break;
			case 8: // 이벤트
				pEvtInfo.search();
				break;
			case 9: // 모듈/카드
				pModuleCard.search();
				break;
			case 10: // 변경이력
				pChgHist.search();
				break;
			case 11: // 자산
				pAsset.search();
				break;
			case 12: // portview
				pPortView.search();
				break;
			case 13: // 성능예측
				pPerfPredict.searchAll();
				break;
			case 14: // 장애예측
				pErrPredict.search();
				break;
			case 15: // 회선연결정보
				search.search();
				break;
			case 16: // 임계치가이드
				pDevPerfThreshold.searchAll();
				break;
            case 17: // 성능비교
                pDevPerfCompare.initDesign();
                pDevPerfCompare.initData();
                break;
			}
		}catch(e){}

	},
	chgInfo: function(){
		var params = {
			mngNo: dtl_mngNo,
			action: 'U'
		}
		$.post(ctxPath + '/main/popup/env/pDevAdd.do',
			params,
			function(result) {
				HmWindow.openFit($('#pwindow'), '[{0}] 장비정보 변경'.substitute(dtl_devName), result, 600, 680);
			}
		);
	}
};

function addDevResult() {
	HmGrid.updateBoundData($devGrid);
}

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});
