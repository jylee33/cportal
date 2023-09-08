$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});

var PMain = {
    SLA_STATE_CD: {
        //NONE -> 소명신청 -> 검토중 -> 반려 -> 보완완료(재요청) -> 소명거부 -> 소명완료
        NONE: 0, REQ: 1, CHECK: 2,  RETURN: 3, REREQ: 4, REJECT: 5, APPROVE: 6
    },

	slaStateCd: null,
	sessAuth: null,
	seqNoList: null,
	seqNoIdx: -1,
	dbData: null,

	/** variable */
	initVariable: function() {
		this.sessAuth = $('#sAuth').val().toUpperCase();
	},

	/** add event */
	observe: function() {
		$('button').bind('click', function(event) { PMain.eventControl(event); });
	},

	/** event handler */
	eventControl: function(event) {
		var curTarget = event.currentTarget;
		switch(curTarget.id) {
			case 'p_btnSave': this.saveRpt(); break;
            case 'p_btnSlaReq': this.saveRptState(PMain.SLA_STATE_CD.REQ); break;
            case 'p_btnSlaReReq': this.saveRptState(PMain.SLA_STATE_CD.REREQ); break;
            case 'p_btnSlaAppr': this.saveRptState(PMain.SLA_STATE_CD.APPROVE); break;
            case 'p_btnSlaRet': this.saveRptState(PMain.SLA_STATE_CD.RETURN); break;
			case 'p_btnFile': this.fileAttach(); break;
			case 'p_btnPrint': this.printRpt(); break;
			case 'p_btnDown': this.downRpt(); break;
			case 'p_btnPrev': this.moveToPrev(); break;
			case 'p_btnNext': this.moveToNext(); break;
			case 'p_btnSlaCancel': this.cancelSlaAppr(); break;
		}
	},

	/** init design */
	initDesign: function() {

	},

	/** init data */
	initData: function() {
		PMain.seqNoList = $('#pSeqNoList').val().split(',');
		PMain.seqNoIdx = 0;
        this.setMoveBtnClz();
		this.search();
	},

    search: function() {
		// 이동 버튼을 제외한 모든버튼 hidden
        $('button:not(#p_btnPrev,#p_btnNext)').css('display', 'none');

        // 소명서 조회
		Server.post('/main/sla/errMgmtSla/getSlaEvtReport.do', {
			data: {seqNo: PMain.seqNoList[PMain.seqNoIdx]},
			success: function(result) {
				if(result == null) return;
				PMain.dbData = result;
				$.each(result, function(key, value) {
					try {
						if(key == 'slaStateCd') {
							PMain.slaStateCd = value;
						}
						else if(key == 'slaSumSec') {
							$('#p_' + key).val(value == null? '-' : HmUtil.convertCTime(value));
                            $('#p_' + key).attr("data-sumsec", value);
						}
						else if(key == 'excSlaSumSec') {
							$('#p_' + key).val((value || 0) / 60);
						}
						else {
							$('#p_' + key).val(value || '');
						}
					} catch(e) {}
				});

                /**
				 * 권한적용
				 * 1. SLA 시간 재산정 프로시저가 호출되지 않았으면 소명불가
				 * 2. 소명단계가 "승인"인 경우 내용변경 불가
				 *
                 */
                // SLA 프로시저 호출전 (소명불가)
                if(PMain.dbData.slaSeqNo == null) {
                    $('#pForm *').attr('readonly', 'readonly');
                    // alert('소명은 종료된 장애만 가능하며, 금일 종료된 장애는 익일부터 소명 가능합니다.');
                    return;
				}
				// else {
                 //    $('button').css('display', 'inline-block');
				// }


				//승인단계가 아니면 상세 내용 수정 가능
                if(PMain.slaStateCd == PMain.SLA_STATE_CD.APPROVE) {
                    $('#pForm *').attr('readonly', 'readonly');
                    // //통신사 계정일때는 버튼 제거
					// if(PMain.sessAuth == 'USER') {
                     //    $('#p_btnSlaReq, #p_btnSlaReReq, #p_btnSlaAppr, #p_btnSlaRet, #p_btnSave').css('display', 'none');
                     //    return;
					// }
                }
                else {
                    $('#pForm *').removeAttr('readonly');
                    $('#p_btnSave').css('display', 'inline-block');
                    // 소명 진행중인 경우 User, System 권한만 상세 내용 수정이 가능함.
                    // if($.inArray(PMain.sessAuth, ['USER','SYSTEM']) === -1) {
					 //    $('#p_slaMemo').attr('readonly', 'readonly');
                    // }
				}

				// 첨부파일 유무에 따른 색상표현 (유: 파란색, 무: 흰색)
                $('#p_btnFile').removeClass('btn-white btn-blue');
				$('#p_btnFile').attr('data-slaFileNo', result.slaFileNo || 0);
				if((result.slaFileNo || 0) > 0) {
                    $('#p_btnFile').addClass('btn-blue');
				}
				else {
                    $('#p_btnFile').addClass('btn-white');
				}

				// 소명 진행전이면 내용 저장만 가능
				if(PMain.slaStateCd == null) {
					$('#p_btnSlaReq, #p_btnSlaReReq, #p_btnSlaAppr, #p_btnSlaRet').css('display', 'none');
                    $('#p_btnSlaCancel').closest('div').css('display', 'none');
				}
				// 소명 진행중 (CM_EVT_SLA_RPT 테이블에 데이터 존재)
				else {
					// 버튼색상 변경
                    $('#p_btnSlaReq, #p_btnSlaReReq, #p_btnSlaAppr, #p_btnSlaRet').removeClass('btn-white btn-green').addClass('btn-white');

                    // 진행상태에 따른 버튼 표시 및 색상 표현
					if(PMain.slaStateCd == PMain.SLA_STATE_CD.REQ) {
                        $('#p_btnSlaReq').removeClass('btn-white').addClass('btn-green');
					}
					else if(PMain.slaStateCd == PMain.SLA_STATE_CD.RETURN) {
                        $('#p_btnSlaRet').removeClass('btn-white').addClass('btn-green');
					}
                    else if(PMain.slaStateCd == PMain.SLA_STATE_CD.REREQ) {
                        $('#p_btnSlaReReq').removeClass('btn-white').addClass('btn-green');
                    }
                    else if(PMain.slaStateCd == PMain.SLA_STATE_CD.APPROVE) {
                        $('#p_btnSlaAppr').removeClass('btn-white').addClass('btn-green');
                    }

                    // 버튼 Show/Hide
                    $('#p_btnSlaReq, #p_btnSlaAppr, #p_btnSlaRet').css('display', 'inline-block');
					// if(PMain.sessAuth == 'USER') { //통신사
						// 반려상태이면 [재신청] 가능하도록
						// if($.inArray(PMain.slaStateCd, [PMain.SLA_STATE_CD.RETURN, PMain.SLA_STATE_CD.REREQ]) !== -1) {
                         //    $('#p_btnSlaReq').css('display', 'none');
                         //    $('#p_btnSlaReReq').css('display', 'inline-block')
						// }
						// // 반려상태 외에는 [신청] 버튼 show
						// else {
                         //    $('#p_btnSlaReq').css('display', 'inline-block');
                         //    $('#p_btnSlaReReq').css('display', 'none')
						// }
                        //
						// // [신청]상태일때는 소명취소 가능
						// if(PMain.slaStateCd == PMain.SLA_STATE_CD.REQ) {
                         //    $('#p_btnSlaCancel').closest('div').css('display', 'inline-block');
                         //    $('#p_btnSlaCancel').text('소명 신청 취소');
						// }
						// else {
                         //    $('#p_btnSlaCancel').closest('div').css('display', 'none');
						// }
                        // $('#p_btnSlaAppr, #p_btnSlaRet').css('display', 'inline-block');
					// }
					// else { // 교육청 계정
                     //    if ($.inArray(PMain.slaStateCd, [1, 3, 4, 6]) !== -1) {
                     //        $('#p_btnSlaReReq').css('display', 'none');
                     //    	$('#p_btnSlaReq, #p_btnSlaReReq').css('display', 'none');
                     //        $('#p_btnSlaAppr, #p_btnSlaRet').css('display', 'inline-block');
					// 	}
					// 	else {
                     //        $('#p_btnSlaReq, #p_btnSlaAppr, #p_btnSlaRet').css('display', 'inline-block');
					// 	}
                    //
                     //    // [소명 승인 취소] 버튼은 System,Admin권한의 사용자이고 "소명승인"상태일때만 show
                     //    if($.inArray(PMain.sessAuth, ['ADMIN','SYSTEM']) !== -1 && PMain.slaStateCd == PMain.SLA_STATE_CD.APPROVE) {
                     //        $('#p_btnSlaCancel').closest('div').css('display', 'inline-block');
                     //        $('#p_btnSlaCancel').text('소명 승인 취소');
                     //    }
                     //    else {
                     //        $('#p_btnSlaCancel').closest('div').css('display', 'none');
                     //    }
					// }
				}
			}
		});
	},

	// 보고서 저장
	saveRpt: function() {
		var saveData = {
			seqNo: PMain.seqNoList[PMain.seqNoIdx],
			slaStateCd: PMain.slaStateCd == null? 0 : PMain.slaStateCd,
			slaMemo: $('#p_slaMemo').val(),
			excSlaSumSec: ($('#p_excSlaSumSec').val() || 0) * 60,
			slaFileNo: $('#p_btnFile').attr('data-slaFileNo')
		};

		var _sumsec = parseFloat($('#p_slaSumSec').attr('data-sumsec')),
			_excSumsec = parseFloat(saveData.excSlaSumSec);
		if(_excSumsec > 0 && _excSumsec > _sumsec) {
			alert('입력하신 SLA 소명 요청 시간이  SLA 지속시간을 초과합니다.');
			$('#p_excSlaSumSec').focus();
			return;
		}

        if((saveData.slaMemo || '').length == 0) {
            alert('상세 내용을 작성하세요.');
            $('#p_slaMemo').focus();
            return;
        }

        /**
		 * [반려]상태의 보고서는 상세내용을 수정해야만 재신청이 가능하다.
         */
		if(PMain.slaStateCd == PMain.SLA_STATE_CD.RETURN) {
			if(saveData.slaMemo == PMain.dbData.slaMemo) {
				alert('반려된 보고서는 상세 내용을 수정해야만 재신청이 가능합니다.');
				$('#p_slaMemo').focus();
				return;
			}
		}

        if(!confirm('소명보고서를 저장하시겠습니까?')) {
        	return;
        }

		Server.post('/main/sla/errMgmtSla/addSlaEvtReport.do', {
			data: saveData,
			success: function(result) {
				PMain.search();
				alert("저장되었습니다.");
			}
		});
	},

	// 소명상태 저장
    saveRptState: function(stateCd) {
		//상태값이 이전값과 같을때 리턴
		if(stateCd == PMain.slaStateCd) return;

		if(stateCd == 1) {
			if(!confirm('작성된 내용으로 소명신청합니다.')) return;
		}
		else if(stateCd == 6) {
            if(!confirm('소명보고서에 대한 내용을 소명 승인합니다.')) return;
		}
        else if(stateCd == 3) {
            if(!confirm('소명보고서에 대한 내용을 소명 반려합니다.')) return;
        }
        else if(stateCd == PMain.SLA_STATE_CD.REREQ) {
            if(PMain.slaStateCd == PMain.SLA_STATE_CD.RETURN && PMain.dbData.isUpdSlaMemo == 0) {
                alert('반려된 보고서는 상세 내용을 수정해야만 재신청이 가능합니다.');
                $('#p_slaMemo').focus();
                return;
            }
			if(!confirm('작성된 내용으로 소명 재신청을 합니다.')) return;
		}

        Server.post('/main/sla/errMgmtSla/editSlaEvtReportState.do', {
        	data: {
        		seqNo: PMain.seqNoList[PMain.seqNoIdx],
				slaStateCd: stateCd
			},
			success: function(result) {
                var msg = '처리되었습니다.';
        		if(stateCd == 1) msg = '신청되었습니다.';
        		else if(stateCd == 3) msg = '반려되었습니다.';
        		else if(stateCd == 6) msg = '승인되었습니다.';

        		alert(msg);
                PMain.search();
                PMain.callbackState(stateCd);
			}
		})
	},

	// 첨부파일
	fileAttach: function() {
		var param = {
			seqNo: PMain.seqNoList[PMain.seqNoIdx],
			slaStateCd: PMain.slaStateCd,
			sessAuth: PMain.sessAuth,
			limitCnt: 1,
			sendParam: { seqNo: PMain.seqNoList[PMain.seqNoIdx], boardNo: 0, slaStateCd: PMain.slaStateCd, slaFileNo: $('#p_btnFile').attr('data-slaFileNo') }
		};
		$.post(ctxPath + '/main/popup/sla/pSlaEvtReportAttFile.do',
			param,
			function(result) {
				HmWindow.open($('#pwindow'), '소명 보고서 관리', result, 400, 220, 'pwindow_init', param);
			}
		);
	},

	// 인쇄
	printRpt: function() {
		// 보고서 인쇄화면에서 상단우측 보고서 관련 버튼은 hidden처리
		$('#p_rptDateDiv').css('width', '100%');
		$('#p_rptBtnDiv').css('display', 'none');
		var win = window.print();
        $('#p_rptDateDiv').css('width', '70%');
		$('#p_rptBtnDiv').css('display', 'block');
	},

	// 다운로드
	downRpt: function() {
        $('#hForm').empty();
        var params = {
        	seqNo: PMain.seqNoList[PMain.seqNoIdx]
		};
		$.each(params, function(key, value) {
			$('<input />', { type: 'hidden', id: key, name: key, value: value }).appendTo($('#hForm'));
		});
        $('#hForm').attr('action', ctxPath + '/main/sla/errMgmtSla/exportSlaRpt.do');
        $('#hForm').attr('method', 'post');
        $('#hForm').attr('target', 'hFrame');
        $('#hForm').submit();
	},

    //이전
    moveToPrev: function() {
        if(PMain.seqNoIdx <= 0) {
            return;
        }
        PMain.seqNoIdx--;
        this.setMoveBtnClz();
        this.search();
    },

    //다음
    moveToNext: function() {
        var lastIdx = PMain.seqNoList.length - 1;
        if(PMain.seqNoIdx >= lastIdx) {
            return;
        }
        PMain.seqNoIdx++;
        this.setMoveBtnClz();
        this.search();
    },

    // 이동버튼 스타일 적용(활성/비활성)
    setMoveBtnClz: function() {
        if(PMain.seqNoIdx == 0) {
            $("#p_btnPrev").addClass('btn-disabled');
        }
        else {
            $('#p_btnPrev').removeClass('btn-disabled');
        }

        if(PMain.seqNoIdx == (PMain.seqNoList.length-1)) {
            $("#p_btnNext").addClass('btn-disabled');
        }
        else {
            $('#p_btnNext').removeClass('btn-disabled');
        }
    },

	/**
	 * SLA 소명승인을 취소처리
	 * 	USER 권한은 소명신청상태일때만 소명신청취소 가능
	 * 	관리자 권한은 소명승인 상태일때만 소명취소 가능
     */
    cancelSlaAppr: function() {
		var stateText = '승인';
            if(PMain.sessAuth == 'USER') {
                if(PMain.slaStateCd != PMain.SLA_STATE_CD.REQ) {
                    alert('소명 신청 취소는 소명신청 상태일때만 가능합니다.');
                    return;
                }
                stateText = '신청';
            }
            else {
                if($.inArray(PMain.sessAuth, ['ADMIN', 'SYSTEM']) === -1) {
                    alert('권한이 없습니다.');
                    return;
                }
                else if(PMain.slaStateCd != PMain.SLA_STATE_CD.APPROVE) {
                    alert('소명 승인 상태일때만 가능합니다.');
                    return;
                }
                stateText = '승인';
            }

        if(!confirm('소명 ' + stateText + '을 취소 하시겠습니까?\n(소명 ' + stateText + '을 전부 취소합니다.)')) return;

        Server.post('/main/sla/errMgmtSla/delSlaEvtReport.do', {
            data: {seqNo: PMain.seqNoList[PMain.seqNoIdx]},
            success: function(result) {
                PMain.search();
                alert('소명 ' + stateText + '이 취소되었습니다.');
                PMain.callbackState(null);
            }
        });
	},

	callbackState: function(stateVal) {
        try {
            opener.callbackState(PMain.seqNoList[PMain.seqNoIdx], 'slaStateCd', stateVal);
        } catch(e) {
            console.log('error', e);
        }
	}

};

function uploadEndCallback(fileNo) {
	PMain.search();
}