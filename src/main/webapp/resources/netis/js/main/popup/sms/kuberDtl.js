var $dtlTab;
var sAuth;
var pKuberDtlMain = {

	/** variable */
	initVariable: function() {
		sAuth = $('#sAuth').val().toUpperCase();
		$dtlTab = $('#dtlTab');
	},

	/** init design */
	initDesign: function() {

		// if(sAuth != 'SYSTEM' && sAuth != 'ADMIN') {
		// 	$('#btnChgInfo').hide();  // 권한에 따른 설정버튼 숨김
		// }

		$dtlTab.jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
			initTabContent: function(tab) {
				switch(tab) {
				case 0: // 요약
					break;
				case 1: // 노드
					pKubNode.initDesign();
					pKubNode.initData();
					break;
				case 2: // 네임스페이스
					pKubNamespace.initDesign();
					pKubNamespace.initData();
					break;
				case 3: // 파드
					pKubPod.initDesign();
					pKubPod.initData();
					break;
				case 4: // 컨테이너
					pKubContainer.initDesign();
					pKubContainer.initData();
					break;
				}
			}
		})
		.on('selected', function(event) {
			pKuberDtlMain.search();
		});

        var themeSetting= { theme: "ui-hamon-v1-tab-top" };
        $dtlTab.jqxTabs(themeSetting);

		//pKuberDtlMain.resizeCharEventControl();  // 차트 리사이징

	},

	// resizeCharEventControl: function () {
	//
	// 	$('#mainSplitter').on('resize', function (event) {
	// 		var dtlTab = $('#dtlTab').val();
	// 		switch (dtlTab) {
	// 			case 3:		//성능
	// 				switch ($('#perfTab').val()) {
	// 					case 0 : if (pPerfCpu) pPerfCpu.resizeChart(); break;
	// 					case 1 : if (pPerfMemory) pPerfMemory.resizeChart(); break;
	// 					case 2 : if (pPerfTemp) pPerfTemp.resizeChart(); break;
	// 					case 3 : if (pPerfResp) pPerfResp.resizeChart(); break;
	// 					case 4 : if (pPerfSession) pPerfSession.resizeChart(); break;
	// 					case 5 : if (pPerfCps) pPerfCps.resizeChart(); break;
	// 					case 6 : if (pPerfDevPeriod) pPerfDevPeriod.resizeChart(); break;
	// 				}
	// 				break;
	// 			case 4: if(pPerfRealtime) pPerfRealtime.resizeChart(); break; //실시간
	// 			case 13:if(pPerfPredict) pPerfPredict.resizeChart(); break; //성능예측
	// 			case 14: if(pErrPredict) pErrPredict.resizeChart(); break; //장애예측
	// 			case 16: if(pDevPerfThreshold) pDevPerfThreshold.resizeChart(); break; //임계치가이드
    //             case 17: if(pDevPerfCompare) pDevPerfCompare.resizeChart(); break; //성능비교
	// 		}
	// 	});
	// },

	/** init data */
	initData: function() {
	//	pKuberDtlMain.search();
	},

	search: function() {
		try{
			switch($dtlTab.val()) {
			case 0: // 요약
				pSummary.search();
				break;
			case 1: //노드
				pKubNode.search();
				break;
			case 2: // 네임스페이스
				pKubNamespace.search();
				break;
			case 3: // 파드
				pKubPod.search();
				break;
			case 4: // 컨테이너
				pKubContainer.search();
				break;
			}
		}catch(e){}

	}
};

// function addDevResult() {
// 	HmGrid.updateBoundData($devGrid);
// }

$(function() {
	pKuberDtlMain.initVariable();
	//pKuberDtlMain.observe();
	pKuberDtlMain.initDesign();
	pKuberDtlMain.initData();
});
