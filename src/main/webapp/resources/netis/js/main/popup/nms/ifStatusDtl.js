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

		$dtlTab.jqxTabs({ width: '100%', height: '100%', theme: "ui-hamon-v1-tab-top",
			initTabContent: function(tab) {
				switch(tab) {
				case 0: // 요약
					break;
				case 1: // 성능
					pPerf.initDesign();
					pPerf.initData();
					break;
				case 2: // 실시간 성능 조회 (성능 하위 탭에서의 위치 조정)
					pPerfRealtime.initialize();
					pPerfRealtime.initDesign();
					break;
				case 3: // 성능예측
					pPerfPredict.initDesign();
					pPerfPredict.initData();
					break;
				case 4: // 장애예측
					pErrPredict.initDesign();
					pErrPredict.initData();
					break;
				case 5: // 임계치가이드
					pIfPerfThreshold.initDesign();
					pIfPerfThreshold.initData();
					break;
				case 6: //성능비교
					pPerfCompare.initDesign();
					pPerfCompare.initData();
					break;
				}
			}
		});

		PMain.resizeCharEventControl();  // 차트 리사이징
	},

	resizeCharEventControl: function () {
		$('#mainSplitter').on('resize', function (event) {
			var dtlTab = $('#dtlTab').val();

			switch (dtlTab) {
				case 1:		//성능
					switch ($('#perfTab').val()) {
						case 0 : if (pPerfBps) pPerfBps.resizeChart(); break;
						case 1 : if (pPerfPps) pPerfPps.resizeChart(); break;
						case 2 : if (pPerfBpsPer) pPerfBpsPer.resizeChart(); break;
						case 3 : if (pPerfCrc) pPerfCrc.resizeChart(); break;
						case 4 : if (pPerfError) pPerfError.resizeChart(); break;
						case 5 : if (pPerfCollision) pPerfCollision.resizeChart(); break;
						case 6 : if (pPerfNonUnicast) pPerfNonUnicast.resizeChart(); break;
						case 7 : if (pPerfDiscard) pPerfDiscard.resizeChart(); break;
						case 8 : if (pPerfMulticast) pPerfMulticast.resizeChart(); break;
						case 9 : if (pPerfBroadcast) pPerfBroadcast.resizeChart(); break;
						case 10 : if (pPerfDrop) pPerfDrop.resizeChart(); break;
						case 11 : if (pPerfIfPeriod) pPerfIfPeriod.resizeChart(); break;
					}
					break;
				case 2: if(pPerfRealtime) pPerfRealtime.resizeChart(); break; //실시간
                case 3:if(pPerfPredict) pPerfPredict.resizeChart(); break; //성능예측
                case 4: if(pErrPredict) pErrPredict.resizeChart(); break; //장애예측
                case 5:
                    switch ($('#thresholdTab').val()) {
                        case 0 : if (pIfBpsperThreshold) pIfBpsperThreshold.resizeChart(); break;
                        case 1 : if (pIfPpsThreshold) pIfPpsThreshold.resizeChart(); break;
                    }
                    break; //임계치가이드
			}
		});
	},

	/** init data */
	initData: function() {

	},

	search: function() {
		switch($dtlTab.val()) {
		case 0: // 요약
			pSummary.search();
			break;
		case 1: // 성능
			pPerf.search();
			break;
		case 2:	// 실시간성능조회
			pPerfRealtime.reSetDesign();
			break;
		case 3: // 성능예측
			pPerfPredict.searchAll();
			break;
		case 4: // 장애예측
			pErrPredict.search();
			break;
		case 5: // 임계치가이드
            pIfPerfThreshold.searchAll();
			break;
		case 6: //성능비교
            pPerfCompare.initDesign();
            pPerfCompare.initData();
			break;
        }
	},

	chgInfo: function(){
		var rowIdxes = HmGrid.getRowIdxes($ifMgmt, '회선을 선택해주세요.');
		if (rowIdxes === false) return;
		var rowdata = $ifMgmt.jqxGrid('getrowdata', rowIdxes[0]);
		var params = {
			action: 'U',
			mngNo: rowdata.mngNo,
			ifIdx: rowdata.ifIdx
		};
		$.post(ctxPath + '/main/popup/env/pIfInfoSet.do',
			params,
			function(result) {
				// HmWindow.open($('#pwindow'), '[{0}] 장비정보 변경'.substitute(dtl_devName), result, 600, 650);
				HmWindow.open($('#pwindow'), '회선정보 변경', result, 700, 580);
			}
		);
	}
};

function refreshIf() {
	HmGrid.updateBoundData($ifMgmt);
}

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});
