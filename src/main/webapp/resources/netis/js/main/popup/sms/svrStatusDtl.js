var $dtlTab;
var sAuth;
var initColumns, linuxColumns, windowColumns// 정보-서비스 등록 정보 LINUX<->WINDOW 전환용 변수선언
var PMain = {
    /** variable */
    initVariable: function () {
        sAuth = $('#sAuth').val().toUpperCase();
        $dtlTab = $('#dtlTab');
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
            case 'btnChgInfo':
                this.chgInfo();
                break;
        }
    },

    /** init design */
    initDesign: function () {

        if (sAuth != 'SYSTEM' && sAuth != 'ADMIN') {
            $('#btnChgInfo').hide();  // 권한에 따른 설정버튼 숨김
        }

        $dtlTab.jqxTabs({
            width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function (tab) {
                switch (tab) {
                    case 0: // 요약
                        break;

                    case 1:
                        pPerfInfo.initDesign();
                        pPerfInfo.initData();
                        break;

                    case 2: // 이벤트
                        pEvtInfo.initDesign();
                        pEvtInfo.initData();
                        break;
                    case 3: // 감시프로세스
                        pMprocess.initDesign();
                        pMprocess.initData();
                        break;
                    case 4: // 프로세스
                        pProcess.initDesign();
                        pProcess.initData();
                        break;

                    case 5: // 파일시스템
                        pFileSystem.initDesign();
                        pFileSystem.initData();
                        break;
                    case 6: // 디스크
                        pDisk.initDesign();
                        pDisk.initData();
                        break;
                    case 7: // 네트워크
                        pNetwork.initDesign();
                        pNetwork.initData();
                        break;
                    case 8: // 세션
                        pSession.initDesign();
                        pSession.initData();
                        break;
                    case 9: // 자산
                        pAsset.initDesign();
                        pAsset.initData();
                        break;
                    case 10: // WAS
                        pWas.initDesign();
                        pWas.initData();
                        break;
                    case 11: // DBMS
                        pDbms.initDesign();
                        pDbms.initData();
                        break;
                    case 12: //AccessLog
                        pAccessLog.initDesign();
                        pAccessLog.initData();
                        break;
                    case 13: //정보
                        pSvrInfo.initDesign();
                        pSvrInfo.initData();
                        break;

                    case 14: // 기간조회
                        SvrPerfTree.initDesign();
                        SvrPerfChart.initDesign();
                        ProcessGrid.initDesign();
                        break;
                    case 15: // 임계치가이드
                        pSvrPerfThreshold.initDesign();
                        pSvrPerfThreshold.initData();
                        break;
                    case 16: // 실시간
                        pPerfRealtime.initDesign();
                        pPerfRealtime.initData();
                        pPerfRealtime.initialize();
                        break;
                    case 17: // Tcp세션
                        // pTcpSession.search();
                        pTcpSession.initDesign();

                        break;


                }

                // session(세션), 접속로그 Tab은 엔진팀 개발 완료 후 활성화 예정 2022.01.14 숨김처리
                $('#dtlTab .jqx-tabs-title:eq(8)').css('display', 'none');
                $('#dtlTab .jqx-tabs-title:eq(12)').css('display', 'none');

            }

        }).on('selected', function (event) {
            PMain.search();
        });

        PMain.resizeCharEventControl();

    },


    resizeCharEventControl: function () {

        $('#splitter').on('resize', function (event) {

            var dtlTab = $('#dtlTab').val();
            switch (dtlTab) {
                case 1:		//성능
                    switch ($('#perfTabs').val()) {
                        case 0 : if (pPerfCpu) pPerfCpu.resizeChart(); break;
                        case 1 : if (pPerfMem) pPerfMem.resizeChart(); break;
                        case 2 : if (pPerfFs) pPerfFs.resizeChart(); break;
                        case 3 : if (pPerfDisk) pPerfDisk.resizeChart(); break;
                        case 4 : if (pPerfNet) pPerfNet.resizeChart(); break;
                    }
                    break;
                case 15: if(pSvrPerfThreshold) pSvrPerfThreshold.resizeChart(); break; //임계치가이드
                case 17:		//tcp세션
                    switch ($('#tcpTabs').val()) {
                       case 0 : if (tcpState) tcpState.resizeChart(); tcpState.initData(); break;
                       case 1 : if (svcPort) svcPort.resizeChart(); svcPort.initData(); break;
                    }
                    break;

            }
        });
    },

    /** init data */
    initData: function () {

    },

    search: function () {

        var wasDflag = dtl_wasNo ? 'block' : 'none';
        var dbmsDflag = dtl_dbmsNo ? 'block' : 'none';
        $('#dtlTab .jqx-tabs-title:eq(10)').css('display', wasDflag);
        $('#dtlTab .jqx-tabs-title:eq(11)').css('display', dbmsDflag);

        try {
            switch ($dtlTab.val()) {

                case 0: // 요약
                    pSummary.search();
                    break;
                case 1: // 성능
                    pPerfInfo.search();
                    break;
                case 2: // 이벤트
                    pEvtInfo.search();
                    break;
                case 3: // 감시프로세스
                    pMprocess.search();
                    break;
                case 4: // 프로세스
                    pProcess.search();
                    break;
                case 5: // 파일시스템
                    pFileSystem.search();
                    break;
                case 6: // 디스크
                    pDisk.search();
                    break;
                case 7: // 네트워크
                    pNetwork.search();
                    break;
                case 8: // 자산
                    pSession.search();
                    break;
                case 9: // 자산
                    pAsset.search();
                    break;
                case 10: // WAS
                    pWas.search();
                    break;
                case 11: // DBMS
                    pDbms.search();
                    break;
                case 12: // AccessLog
                    pAccessLog.search();
                case 13: // AccessLog
                    pSvrInfo.search();
                case 14:
                    SvrPerfChart.searchCombo();
                    SvrPerfChart.search();
                    break;
                case 15: // 임계치가이드
                    pSvrPerfThreshold.searchAll();
                    break;
                case 16: //실시간
                    pPerfRealtime.searchAll();
                    break;
                case 17: // Tcp세션
                    pTcpSession.search();
                    // pTcpSession.initDesign();
                    break;
                    
            }
        } catch (e) {
        }
    },

    chgInfo: function () {
        var params = {
            mngNo: dtl_mngNo,
            action: 'U'
        };

        HmWindow.createNewWindow('pDtlwindow');
        Server.post(ctxPath + '/svr/getSvrInfo.do', {
            data: {mngNo: dtl_mngNo},
            success: function (data) {
                if (data != null) {
                    $.post(ctxPath + '/main/popup/env/pSvrInfoSet.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pDtlwindow'), '[{0}] 서버정보 변경'.substitute(data.userDevName || data.name), result, 850, 340);
                        }
                    );
                }
            }
        });

    }
};

$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});
