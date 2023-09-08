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
	$('div.more_2, #dashboard').bind('click', function(event) {
		Main.eventControl(event);
	});
	$('#btnEditUser').bind('click', function(event) {
		Main.editUser();
	});
},

/** event handler */
eventControl : function(event) {
	var curTarget = event.currentTarget;
	switch (curTarget.id) {
	case 'dashboard':
//		this.showDashboardAdmin(1);
		//Master.gotoNetisDash();
			Master.gotoDashLink();
		break;
	case 'dashboardTotal':
		this.showDashboardTotal(1);
		break;
	case 'netisweb':
		this.showNetisWeb();
		break;
//	case 'manual':
//		alert('준비중입니다.');
//		break;
	case 'tabNoti':
	case 'tabJob':
	case 'tabTech':
		
	case 'tabErr':
		this.clickBoardTab(curTarget.id);
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
		
	case 'cBoard':
		this.showErrorBoard();
		break;
		
	case 'eBoard':
		this.showEvtBoard();
		break;
	}
},

/** init design */
initDesign : function() {
	$('#calendar').jqxCalendar({ width : '210px', height : '200px' });
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
	Main.searchNBoard();
	Main.searchJBoard();
	Main.searchSBoard();
	Main.searchEBoard();
	Main.searchEvtBoard();
	Main.searchTopNBoard();
},

/**
 * Top N
 */
searchTopNBoard : function() {
	$('#schBoardTbody').empty();
	/*
	 * Server.get('/nia/perf/ifPerf/getIfPerfList.do', { success :
	 * function(result) { if (result != null) { $.each(result, function(idx,
	 * value) {
	 *
	 * var cell = ''; switch (value.wireServiceName) { case "KT": cell = "<img
	 * style='padding-right: 5px;' src='" + ctxPath + "/img/MainImg/sl_kt.png'
	 * alt='" + value + "'/>"; break; case "LG": cell = "<img
	 * style='padding-right: 5px;' src='" + ctxPath + "/img/MainImg/sl_lg.png'
	 * alt='" + value + "'/>"; break; case "SK": cell = "<img
	 * style='padding-right: 5px;' src='" + ctxPath + "/img/MainImg/sl_sk.png'
	 * alt='" + value + "'/>"; break; }
	 *
	 * var tr = $('<tr></tr>'); var tr2 = $('<tr></tr>'); tr.append($('<td class="tdBg" rowspan="2">' +
	 * value.state + '</td>')); tr.append($('<td rowspan="2">' + cell + '</td>'));
	 * tr.append($('<td class="tdBg">IN</td>')); tr.append($('<td style="text-align: right; padding-right: 10px">' +
	 * HmUtil.convertUnit1000(value.inBps) + '</td>')); tr.append($('<td class="tdBg" style="text-align: right; padding-right: 10px">' +
	 * HmUtil.convertUnit1000(value.inPps) + '</td>'));
	 * $('#schBoardTbody').append(tr); tr2.append($('<td class="tdBg">OUT</td>'));
	 * tr2.append($('<td style="text-align: right; padding-right: 10px">' +
	 * HmUtil.convertUnit1000(value.outBps) + '</td>')); tr2.append($('<td class="tdBg" style="text-align: right; padding-right: 10px">' +
	 * HmUtil.convertUnit1000(value.outPps) + '</td>')); tr.append(tr2);
	 * $('#schBoardTbody').append(tr2); }); } } });
	 */
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
// 공지사항
searchNBoard : function() {
	$('#nBoardTbody').empty();

	Server.get('/main/oms/noticeBoard/getPostBoardList.do', { success : function(result) {
		if (result != 0) {
			$.each(result, function(idx, value) {
				var tr = $('<tr onclick="Main.showNoticeBoardContent(' + value.boardNo + ')"></tr>');
				var marginImg;
				if (value.fileCount != 0) {
					marginImg = "<img src='../img/popup/file_icon2.png' >";
				} else {
					marginImg = "";
				}

				var titleMsg = value.boardTitle;
				var subLength = 35;
				if(titleMsg.length > subLength){
					titleMsg = titleMsg.substr(0, subLength) + "...";
				}

				tr.append($('<td id = "' + value.boardNo + '">' + titleMsg + '<span style="margin-left: 10px;">' + marginImg + '</span>' + '</td>'));
				tr.append($('<td class="time">' + value.printDate + '</td>'));
				$('#nBoardTbody').append(tr);
			});
		} else {
			var tr = $('<tr></tr>');
			tr.append($('<td colspan="2" style="text-align: center;">등록된 게시물이 없습니다. </td>'));
			$('#nBoardTbody').append(tr);
		}
	} });

},
// 작업이력
searchJBoard : function() {
	$('#jobTbody').empty();
	Server.get('/main/nms/jobHist/getJobHist.do', { success : function(result) {
		if (result != 0) {
			$.each(result, function(idx, value) {
				var cell = '';
				switch (value.jobFlag) {
				case "신청":
					cell = "<img style='padding-right: 5px;' src='" + ctxPath + "/img/Grid/JobFlag/apply.png' alt='" + value + "'/>";
					break;
				case "승인":
					cell = "<img style='padding-right: 5px;' src='" + ctxPath + "/img/Grid/JobFlag/confirm.png' alt='" + value + "'/>";
					break;
				}
				var tr = $('<tr></tr>');
				// var tr = $('<tr
				// onclick="Main.showNoticeBoardContent('+value.boardNo+')"></tr>');
				tr.append($('<td class="apply" id = "' + value.boardNo + '">' + cell + '</td>'));
				tr.append($('<td class="time">' + value.fromYmdhms + '</td>'));
				tr.append($('<td class="time">' + value.toYmdhms + '</td>'));
				tr.append($('<td title="' + value.jobName + '">' + HmUtil.substr(value.jobName, 15) + '</td>'));
				tr.append($('<td title="' + value.devName + '">' + HmUtil.substr(value.devName, 4) + '</td>'));
				$('#jobTbody').append(tr);
			});
		} else {
			var tr = $('<tr></tr>');
			tr.append($('<td colspan="5" style="text-align: center;">등록된 게시물이 없습니다. </td>'));
			$('#jobTbody').append(tr);
		}
	} });

},
// 기술지원 게시판
searchSBoard : function() {
	$('#sBoardTbody').empty();
	Server.get('/main/oms/supportBoard/getPostBoardList.do', { success : function(result) {
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
				var tr = $('<tr onclick="Main.showSupportBoardContent(' + value.boardNo + ')"></tr>');
				tr.append($('<td class="apply" id = "' + value.boardNo + '">' + cell + '</td>'));

				var titleMsg = value.boardTitle;
				var subLength = 28;
				if(titleMsg.length > subLength){
					titleMsg = titleMsg.substr(0, subLength) + "...";
				}

				tr.append($('<td class="">' + titleMsg + '</td>'));
				tr.append($('<td class="time">' + value.printDate + '</td>'));
				$('#sBoardTbody').append(tr);
			});
		} else {
			var tr = $('<tr></tr>');
			tr.append($('<td colspan="3" style="text-align: center;">등록된 게시물이 없습니다. </td>'));
			$('#sBoardTbody').append(tr);
		}
	} });

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
searchEvtBoard : function() {
	Server.get('/main/oms/errStatus/getMainErrStatusList.do', { data : { limitCnt : 5, grpType : 'ETC' }, success : function(result) {
		$('#evtBoardTbody').empty();
		if (result != 0) {
			$.each(result, function(idx, value) {
				var tr = $('<tr></tr>');
				tr.append($('<td class="time" id = "' + value.boardNo + '">' + value.ymdhms + '</td>'));
				tr.append($('<td style="word-wrap: normal" title="' + value.srcInfo + '">' + HmUtil.substr(value.srcInfo, 20) + '</td>'));
				tr.append($('<td style="" title="' + value.evtName + '">' + HmUtil.substr(value.evtName, 18) + '</td>'));
				tr.append($('<td style="" title="' + value.evtLevelStr + '">' + Main.evtLevelRenderer(value.evtLevel) + '</td>'));
				tr.append($('<td>' + HmUtil.convertCTime(value.sumSec) + '</td>'));
				$('#evtBoardTbody').append(tr);
			});
		} else {
			var tr = $('<tr></tr>');
			tr.append($('<td colspan="5" style="text-align: center;">등록된 게시물이 없습니다. </td>'));
			$('#evtBoardTbody').empty().append(tr);
		}
	} });
},

/** 작업관리 화면으로 이동 */
showJobHist : function() {
	HmUtil.createPopup('/main/nms/jobHist.do', $('#hForm'), "pNetisWeb", 1280, 800);
},

/** 달력보기 */
showScheduler : function() {
	HmUtil.createPopup('/main/popup/nms/pJobScheduler.do', $('#hForm'), 'pScheduler', 1200, 750);
},

/** 대시보드 */
//showDashboardAdmin : function(type) {
//	var url = location.protocol + '//' + location.hostname + ':' + $('#dashPort').val() + '/netis';
//	HmUtil.createFullPopup(url, $('#hForm'), 'pDashAdmin', { UserId : $('#sUserId').val(), userId : $('#sUserId').val(), inflow : "NetisWeb", MainPage : type });
//},

/** 공지 게시판 */
showNoticeBoard : function() {
	HmUtil.createPopup('/main/board/pNoticeBoardList.do', $('#hForm'), 'pNoticeBoard', 700, 630);
},
/** 공지 게시판 컨텐츠 보기 */
showNoticeBoardContent : function(_boardNo) {
	var params = { boardNo : _boardNo };
	HmUtil.createPopup('/main/board/pNoticeBoardContents.do', $('#hForm'), 'pNoticeBoard', 700, 620, params);
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
	HmUtil.createPopup('/main/board/pSupportBoardList.do', $('#hForm'), 'pSupportBoard', 700, 620);
},
/** 기술지원 게시판 컨텐츠 보기 */
showSupportBoardContent : function(_boardNo) {
	var params = { boardNo : _boardNo };
	HmUtil.createPopup('/main/board/pSupportBoardContents.do', $('#hForm'), 'pSupportBoard', 700, 620, params);
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
