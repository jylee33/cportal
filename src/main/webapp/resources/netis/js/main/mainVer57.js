var timer = null;

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});

var Main = {
    /** variable */
    initVariable : function() {

    },

    /** add event */
    observe : function() {

        $('div.more_2').bind('click', function(event) {
            Main.eventControl(event);
        });

        $('#btnEditUser').bind('click', function(event) {
            Main.editUser();
        });
        $('div.evtProcess2 > div').on('click', function(event) {
            var ticketStateCd = $(event.currentTarget).attr('data-ticketStateCd') || '001';
            Main.showEvtTicket(ticketStateCd);
        });

        $('#jBoard').bind('click', function(event) {
            Main.showScheduler();
        });

        $('#fBoard').bind('click', function(event) {
            Main.showSupportBoard();
        });

        $('#nBoard').bind('click', function(event) {
            Main.showNoticeBoard();
        });
    },

    /** event handler */
    eventControl : function(event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'evtTicket':
                this.showEvtTicket(-1);
                break;
            case 'nBoard':
                this.showNoticeBoard();
                break;

            case 'jBoard':
                this.showScheduler();
                break;

            case 'fBoard':
                this.showSupportBoard();
                break;

            // case 'cBoard':
            //     this.showErrorBoard();
            //     break;
            //
            // case 'eBoard':
            //     this.showEvtBoard();
            //     break;
        }
    },

    /** init design */
    initDesign : function() {

    },

    /** init data */
    initData : function() {
        // 메인화면 새로고침
        if (timer != null)
            clearInterval(timer);
        timer = setInterval(Main.refreshData, 30 * 1000);
        Main.refreshData();
    },

    /* 메인화면 데이터 갱신 */
    refreshData : function() {
        Main.searchEvtTicket();
        Main.searchNBoard();
        Main.searchJBoard();
        Main.searchSBoard();
        // Main.searchEBoard();
        Main.searchEvtBoard();
        // Main.searchTopNBoard();
    },

    /**
     * 공지사항/작업이력/기술지원/장애처리
     */
    clickBoardTab : function(tabId) {
        switch (tabId) {
            case 'tabNoti':
                $('#tabNoti').addClass('title_on');
                $('#tabJob').removeClass('title_on');
                $('#nBoardGrid').css('display', 'block');
                $('#jobGrid').css('display', 'none');
                break;
            case 'tabJob':
                $('#tabJob').addClass('title_on');
                $('#tabNoti').removeClass('title_on');
                $('#jobGrid').css('display', 'block');
                $('#nBoardGrid').css('display', 'none');
                break;
            case 'tabTech':
                $('#tabTech').addClass('title_on_2');
                $('#tabErr').removeClass('title_on_2');
                $('#sBoardGrid').css('display', 'block');
                $('#eBoardGrid').css('display', 'none');
                break;
            case 'tabErr':
                $('#tabErr').addClass('title_on_2');
                $('#tabTech').removeClass('title_on_2');
                $('#eBoardGrid').css('display', 'block');
                $('#sBoardGrid').css('display', 'none');
                break;
        }
    },

//이벤트 티켓
    searchEvtTicket: function() {
        // text/img src 초기화
        $('div.evtProcess2 p').removeClass('activeColor').text('0');
        $('div.evtProcess2 img').each(function(idx, img) {
            img.src = img.src.replace('_ov.png', '.png');
        });

        Server.get('/main/nms/evtTicketMgmt/getTicketCnt.do', {
            data: {period: 'ALL'},
            success: function(result) {
                if(result != 0) {
                    $.each(result, function(key, value) {
                        if(value > 0) {
                            var pObj = $('#ticket_{0}Cnt'.substitute(key));
                            pObj.text(value).addClass('activeColor');
                            var imgObj = pObj.prev();
                            imgObj.attr('src', imgObj.attr('src').replace('.png', '_ov.png'));
                            imgObj.addClass('main-circle');
                        }
                    });
                }
            }
        });
    },

// 공지사항
    searchNBoard : function() {

        var tbody = $('#noticeBoardTbody');
        tbody.empty();

        Server.get('/main/oms/noticeBoard/getPostBoardList.do', {
            success : function(result) {
                if(result != 0) {
                    $.each(result, function(idx, item) {
                        var tr = $('<tr></tr>', {
                            on: {
                                click: function (e) {
                                    Main.showNoticeBoardContent(item.boardNo);
                                }
                            }
                        });
                        var titleTd = $('<td></td>', {
                            id: item.boardNo,
                            class: 'left',
                            text: HmUtil.substr(item.boardTitle, 30),
                            title: item.boardTitle
                        });
                        if (item.fileCount != 0) {
                            titleTd.append($('<span style="margin-left: 10px;"><img src="../img/popup/file_icon2.png"></span>'));
                        }
                        tr.append($('<td><img src="../../img/MainImg/icon-notice.png"></td>'));
                        tr.append(titleTd);
                        tr.append($('<td></td>', {text: item.printDate.substring(0, 10)}));
                        tbody.append(tr);
                    });
                }
                else {
                    tbody.append($('<tr></tr>').append($('<td></td>', {
                        colspan: 2,
                        style: 'text-align: center',
                        text: '등록된 게시물이 없습니다.'
                    })));
                }
            }
        });
    },

    // 작업이력
    searchJBoard : function() {
        var tbody = $('#jobTbody');
        tbody.empty();

        Server.get('/main/nms/jobHist/getJobHist.do', {
            success : function(result) {
            if (result != 0) {
                $.each(result, function(idx, item) {
                    //var tr = $('<tr></tr>');
                    var tr = $('<tr></tr>', {
                        on: {
                            click: function (e) {
                                console.log(item);
                                Main.showJobHistContent(item.keyNo, item.jobType, item.mngNo, item.ifIdx);
                                //Main.showJobHist();
                            }
                        }
                    });
                    // var text = item.jobFlag == '승인'? 'CLEARED':'REQUEST';
                    // tr.append($('<td></td>').append($('<div/>', {
                    //     style: 'border-radius:3px;',
                    //     background: (item.jobFlag=='승인'? '#d37800' : '#4db100'),
                    //     text: text,
                    //     alt: item.jobFlag
                    // })));
                    tr.append($('<td></td>').append($('<img/>', {
                        style: 'padding-right: 5px',
                        src: ctxPath + '/img/MainImg/{0}.png'.substitute(item.jobFlag=='승인'? 'clearBtn' : 'requestBtn'),
                        alt: item.jobFlag
                    })));
                    tr.append($('<td></td>', {text: item.fromYmdhms}));
                    tr.append($('<td></td>', {text: item.toYmdhms}));
                    tr.append($('<td></td>', {text: HmUtil.substr(item.jobName, 10), title: item.jobName}));
                    tr.append($('<td></td>', {text: HmUtil.substr(item.devName, 4), title: item.devName}));
                    tbody.append(tr);
                });
            } else {
                tbody.append($('<tr></tr>').append($('<td></td>', {
                    colspan: 5,
                    style: 'text-align: center',
                    text: '등록된 게시물이 없습니다.'
                })));
            }
        }});

    },
// 기술지원 게시판
    searchSBoard : function() {
        var tbody = $('#sBoardTbody');
        tbody.empty();

        Server.get('/main/oms/supportBoard/getPostBoardList.do', { success : function(result) {
            if (result != 0) {
                $.each(result, function (idx, item) {
                    var tr = $('<tr></tr>', {
                        on: {
                            click: function(e) {
                                Main.showSupportBoardContent(item.boardNo)
                            }
                        }
                    });
                    tr.append($('<td></td>').append($('<img/>', {
                        style: 'padding-right: 5px',
                        src: ctxPath + '/img/MainImg/{0}.png'.substitute(item.checkFlagStr == '처리' ? 'clearBtn' : 'requestBtn'),
                        alt: item.checkFlagStr
                    })));
                    tr.append($('<td></td>', {
                        class: 'left',
                        text: HmUtil.substr(item.boardTitle, 20),
                        title: item.boardTitle
                    }));
                    tr.append($('<td></td>', {text: item.printDate.substring(0, 10)}));
                    tbody.append(tr);
                });
            } else {
                tbody.append($('<tr></tr>').append($('<td></td>', {
                    colspan: 3,
                    style: 'text-align: center',
                    text: '등록된 게시물이 없습니다.'
                })));
            }
        }});

    },
// 장애처리 게시판
    searchEBoard : function() {
        $('#eBoardTbody').empty();
        Server.get('/main/oms/errorBoard/getPostBoardList.do', { success : function(result) {
                if (result != 0) {
                    $.each(result, function(idx, value) {
                        var cell = '';
                        switch (value.checkFlagStr) {
                            case "요청":
                                cell = "<img style='padding-right: 5px;' src='" + ctxPath + "/img/Grid/apply.png' alt='" + value + "'/>";
                                break;
                            case "처리":
                                cell = "<img style='padding-right: 5px;' src='" + ctxPath + "/img/Grid/check.png' alt='" + value + "'/>";
                                break;
                        }
                        var tr = $('<tr onclick="Main.showErrorBoardContent(' + value.boardNo + ')"></tr>');
                        tr.append($('<td class="apply" id = "' + value.boardNo + '">' + cell + '</td>'));
                        var titleMsg = value.boardTitle;
                        var subLength = 28;
                        if(titleMsg.length > subLength){
                            titleMsg = titleMsg.substr(0, subLength) + "...";
                        }

                        tr.append($('<td class="">' + titleMsg + '</td>'));
                        tr.append($('<td class="time">' + value.printDate + '</td>'));
                        $('#eBoardTbody').append(tr);
                    });
                } else {
                    var tr = $('<tr></tr>');
                    tr.append($('<td colspan="3" style="text-align: center;">등록된 게시물이 없습니다. </td>'));
                    $('#eBoardTbody').append(tr);
                }
            } });
    },

    /** 이벤트 현황 조회 */
    //기존 패키지에서 미사용 부분 재 사용(5.4 + NIA 메인 합친 메인)  장애 현황 카운팅 추가
    searchEvtBoard : function() {
        Server.get('/main/oms/errStatus/getMainErrStatusList.do', { data : { limitCnt : 5, grpType : 'ETC' }, success : function(result) {
                if(result.length > 0){
                    $.each(result, function(idx, value) {
                        var evtCntLv1 = value.evtCntLv1;
                        var evtCntLv2 = value.evtCntLv2;
                        var evtCntLv3 = value.evtCntLv3;
                        var evtCntLv4 = value.evtCntLv4;
                        var evtCntLv5 = value.evtCntLv5;

                        $("#evtTxtLv1").text($("#gEvtTxtInfo").val());
                        $("#evtTxtLv2").text($("#gEvtTxtWarning").val());
                        $("#evtTxtLv3").text($("#gEvtTxtMinor").val());
                        $("#evtTxtLv4").text($("#gEvtTxtMajor").val());
                        $("#evtTxtLv5").text($("#gEvtTxtCritical").val());

                        $("#evtCntLv1").text(evtCntLv1);
                        $("#evtCntLv2").text(evtCntLv2);
                        $("#evtCntLv3").text(evtCntLv3);
                        $("#evtCntLv4").text(evtCntLv4);
                        $("#evtCntLv5").text(evtCntLv5);
                    });
                }


            } });
    },

    /** 작업관리 화면으로 이동 */
    showJobHist : function() {
        HmUtil.createPopup('/main/nms/jobHist.do', $('#hForm'), "pNetisWeb", 1280, 800);
    },

    showJobHistContent: function(keyNo, jobType, mngNo, ifIdx) {
        var jobData = {jobType: jobType, keyNo: keyNo, editYn: 'N'};
        $.post(ctxPath + '/main/popup/nms/pJobDetail.do',
            jobData,
            function(result) {
                HmWindow.openFit($('#pwindow'), '작업 상세', result, 750, 660, 'pwindow_init', jobData);
            }
        );
    },

    /** 달력보기 */
    showScheduler : function() {
        HmUtil.createPopup('/main/popup/nms/pJobScheduler.do', $('#hForm'), 'pScheduler', 1200, 750);
    },

    /** 이벤트 티켓 */
    showEvtTicket : function(ticketStateCd) {
        HmUtil.createPopup('/main/popup/nms/pEvtTicketInfo.do', $('#hForm'), 'pEvtTicketInfo', 1000, 700, {period: 'ALL', ticketStateCd: ticketStateCd});
    },

    /** 공지 게시판 */
    showNoticeBoard : function() {
        HmUtil.createPopup('/main/board/pNoticeBoardList.do', $('#hForm'), 'pNoticeBoard', 700, 500);
    },
    /** 공지 게시판 컨텐츠 보기 */
    showNoticeBoardContent : function(_boardNo) {
        var params = { boardNo : _boardNo };
        HmUtil.createPopup('/main/board/pNoticeBoardContents.do', $('#hForm'), 'pNoticeBoard', 700, 500, params);
    },

    /** 장애처리 게시판 */
    showErrorBoard : function() {
        HmUtil.createPopup('/main/board/pErrorBoardList.do', $('#hForm'), 'pErrBoard', 700, 620);
    },
    /** 장애처리 게시판 컨텐츠 보기 */
    showErrorBoardContent : function(_boardNo) {
        var params = { boardNo : _boardNo };
        HmUtil.createPopup('/main/board/pErrorBoardContents.do', $('#hForm'), 'pErrBoard', 700, 620, params);
    },


    /** 기술지원 게시판 */
    showSupportBoard : function() {
        HmUtil.createPopup('/main/board/pSupportBoardList.do', $('#hForm'), 'pSupportBoard', 700, 450);
    },
    /** 기술지원 게시판 컨텐츠 보기 */
    showSupportBoardContent : function(_boardNo) {
        var params = { boardNo : _boardNo };
        HmUtil.createPopup('/main/board/pSupportBoardContents.do', $('#hForm'), 'pSupportBoard', 700, 450, params);
    },
    /** 이벤트 게시판 */
    showEvtBoard : function() {
        HmUtil.createPopup('/main/board/pEvtBoardList.do', $('#hForm'), 'pEvtBoardList', 700, 620);
    },

    /** 이벤트현황 > 장애등급 */
    evtLevelRenderer : function(value) {
        var cell = "<div style='margin-top: 2px' class='jqx-center-align'>";
        switch (value.toString()) {
            case "-1": case "조치중":
            cell += "<div class='evt processing'><div class='evtName'>" + $('#sEvtLevel').val() + "</div></div>";
            break;
            case "0": case "정상":
            cell += "<div class='evt normal'><div class='evtName'>" + $('#sEvtLevel0').val() + "</div></div>";
            break;
            case "1": case "정보":
            cell += "<div class='evt info'><div class='evtName'>" + $('#sEvtLevel1').val() + "</div></div>";
            break;
            case "2": case "주의":
            cell += "<div class='evt warning'><div class='evtName'>" + $('#sEvtLevel2').val() + "</div></div>";
            break;
            case "3": case "알람":
            cell += "<div class='evt minor'><div class='evtName'>" + $('#sEvtLevel3').val() + "</div></div>";
            break;
            case "4": case "경보":
            cell += "<div class='evt major'><div class='evtName'>" + $('#sEvtLevel4').val() + "</div></div>";
            break;
            case "5": case "장애":
            cell += "<div class='evt critical'><div class='evtName'>" + $('#sEvtLevel5').val() + "</div></div>";
            break;
            default: return;
        }
        cell += "</div>";
        return cell;
    }

};
