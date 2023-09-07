var pClusterNo, pClusterNm, pInitArea;
var $cbPeriod_evtHist, $cbPeriod_evtActionHist, $evtHistGrid, $evtActionHistGrid;
var $dtlTab, $ifGrid, $evtGrid, $moduleGrid, $cardGrid, $cmDevGrid, $cmIfGrid, $eventTabs;
var $topnInUse, $topnOutUse, $topnUse, $topnInBps, $topnOutBps, $topnBps;
var sAuth;
var pgSiteName;
var dtlTabIndex;

$(function () {
    pKuberDetailMain.initVariable();
    pKuberDetailMain.observe();
    pKuberDetailMain.initDesign();
    pKuberDetailMain.initData();
});

var pKuberDetailMain = {
    /** variable */
    initVariable: function () {
        pClusterNo = $('#clusterNo').val();
        pClusterNm = $('#clusterNm').val();
        $dtlTab = $('#dtlTab');
        //sAuth = $('#sAuth').val().toUpperCase();
       // pgSiteName = $('#gSiteName').val();

    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            PMain.eventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            // case 'btnSearch':
            //     this.searchSummary();
            //     break;
            // case 'btnSearch_dtl':
            //     this.searchDtlInfo();
            //     break;
            // case 'btnSave_dtl':
            //     this.saveDtlInfo();
            //     break;
            // case 'btnChgInfo':
            //     this.chgInfo();
            //     break;
            case 'pbtnClose':
                self.close();
                break;
        }
    },

    /** init design */
    initDesign: function () {
        // 메인텝
        $dtlTab.jqxTabs({
            width: '99.8%', height: '99%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function (tab) {
                switch (tab) {
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
                // var displayFlag = $('#aiPoll').val() == '1' ? 'block' : 'none';
                // $('#dtlTab .jqx-tabs-title:eq(3)').css('display', displayFlag);
                // $('#dtlTab .jqx-tabs-title:eq(4)').css('display', displayFlag);
            }
        })
            .on('selected', function (event) {
               // console.log('d:',event);
//				PMain.searchDtlInfo();
                var selectedTab = event.args.item;
                if (selectedTab == 0) {
                    // pSummary_evtStatus.resizeSvg();
                }
            });


        // $(window).on('resize', function () {
        //     setTimeout(function () {
        //         // if(pSummary_evtStatus.vars.svg != null){
        //         // 	pSummary_evtStatus.resizeSvg();
        //         // }
        //     }, 100)
        // });

    },

    /** init data */
    initData: function () {
        $('.p_content_layer').css('display', 'block');
    },

    /** 상세정보 */
    searchDtlInfo: function () {
    },


};

// function refreshIf() {
// }



