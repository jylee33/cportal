$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});

var PMain = {
	isNoti: 0,
	sessAuth: null,
	seqNoList: null,
	seqNoIdx: -1,

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
			case 'p_btnAction': this.saveAction(); break;
            case 'p_btnClose': self.close(); break;
			case 'p_btnPrev': this.moveToPrev(); break;
			case 'p_btnNext': this.moveToNext(); break;
		}
	},

	/** init design */
	initDesign: function() {
		HmDropDownList.create($('#p_progressState'), {
            source: ['진행중', '조치중', '완료']
		});
		HmDropDownList.create($('#p_evtCause'), {
			source: HmDropDownList.getSourceByUrl('/combo/getEvtCauseList.do')
		});
		// 통보대상자는 AUTH='Admin'인 사용자 목록(교육청 담당자)
		HmDropDownList.create($('#p_commitUser'), {
			source: HmDropDownList.getSourceByUrl('/main/sla/slaEvt/getActTargetUserList.do', null, 'post'),
            autoDropDownHeight: false, filterable: true, displayMember: 'userName', valueMember: 'userId'
		}).on('change', function(event) {
			var item = event.args.item.originalItem;
			if(item != null) {
                $('#p_commitUserDept').val(item.deptName);
                $('#p_commitUserTel').val(item.cellTel);
			} else {
                $('#p_commitUserDept').val(null);
                $('#p_commitUserTel').val(null);
			}

		});
	},

	/** init data */
	initData: function() {
		PMain.seqNoList = $('#pSeqNoList').val().split(',');
		PMain.seqNoIdx = 0;
		this.setMoveBtnClz();
		setTimeout(PMain.search.bind(this), 500);
	},

	reset: function() {
		$('#p_progressState').jqxDropDownList('clearSelection');
		$('#p_evtCause').jqxDropDownList('clearSelection');
		$('#p_commitUser').jqxDropDownList('clearSelection');
	},

	search: function() {
		this.reset();
        Server.post('/main/sla/slaEvt/getSlaEvtAction.do', {
			data: {seqNo: PMain.seqNoList[PMain.seqNoIdx]},
			success: function(result) {
				$.each(result, function (key, value) {
                    try {
                        if (key == 'isNoti') {
                            PMain.isNoti = value;
                        }
                        else {
                            $('#p_' + key).val(value || '');
                        }
                    } catch (e) {
                    }
                });

                // 통보버튼 색상
                $('#p_btnAction').removeClass('btn-white btn-green').addClass('btn-white');
                if (result.isNoti == 1) {
                    $('#p_btnAction').removeClass('btn-white').addClass('btn-green');
                }

                // 통보버튼 Show/Hide -> 통신사계정(AUTH=USER)만 [통보]버튼 보임
                // if (PMain.sessAuth == 'USER') {
                //     $('#p_btnAction').css('display', 'inline-block');
                // }
                // else {
                //     $('#p_btnAction').css('display', 'none');
                // }

                if((result.evtFreedate || '').length > 0) {
                	// alert('장애가 종료되어 통보 불가합니다.');

				}
            }
		});
	},

	// 장애통보서 저장
	saveAction: function() {
		var _freedate = $('#p_evtFreedate').val() || '';
		if(_freedate.length > 0) {
			alert('종료된 장애는 통보 할 수 없습니다.');
			return;
		}

		var saveData = {
			seqNo: PMain.seqNoList[PMain.seqNoIdx],
			progressState: $('#p_progressState').val(),
			evtCause: $('#p_evtCause').val(),
			receiptMemo: $('#p_receiptMemo').val(),
            commitUser: $('#p_commitUser').val()
		};

		if((saveData.progressState || '').length == 0) {
			alert('장애 상태를 선택하세요.');
            $('#p_progressState').focus();
			return;
		}
        if((saveData.evtCause || '').length == 0) {
            alert('장애 원인을 선택하세요.');
            $('#p_evtCause').focus();
            return;
        }
        if((saveData.receiptMemo || '').length == 0) {
            alert('상세 내용을 작성하세요.');
            $('#p_receiptMemo').focus();
            return;
        }
        if((saveData.commitUser || '').length == 0) {
            alert('통보 대상자를 선택하세요.');
            $('#p_commitUser').focus();
            return;
        }

        if(!confirm('작성된 내용으로 장애통보를 진행하시겠습니까?')) {
			return;
        }

		Server.post('/main/sla/slaEvt/editSlaEvtAction.do', {
			data: saveData,
			success: function(result) {
				PMain.search();
				alert("장애통보가 진행되었습니다.");
			}
		});
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

    callbackState: function(stateVal) {
        try {
            opener.callbackState(PMain.seqNoList[PMain.seqNoIdx], 'slaActionCd', stateVal);
        } catch(e) {
            console.log('error', e);
        }
    }

};