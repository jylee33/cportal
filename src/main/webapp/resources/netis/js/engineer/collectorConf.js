var $collectorFrom = null;
var trIdx = null;
var trObj = null;
var maxId = 0;
var Main = {

	netPollGrpNoList: [],

	/** variable */
	initVariable: function() {
		$collectorFrom = $('#collectorForm').find('tbody').html();
	},

	/** add event */
	observe: function() {
		$('button').bind('click', function(event) {
			Main.eventControl(event);
		});
	},
	/** event handler */
	eventControl: function(event) {
		var curTarget = event.currentTarget;
		switch(curTarget.id) {
			case 'btnAdd' :	this.collectorAdd(); break;
			case 'btnRefresh': this.search(); break;
			case 'btnSave': this.save(); break;
		}

		// if (curTarget.id == '' && curTarget.name == 'collectorDel' && trIdx >= 0) {
		// 	trIdx = $(curTarget).parent().parent().index();
		// 	trObj = $(curTarget).parent().parent();
		// 	this.collectorDel();
		// }

	},

	/** init design */
	initDesign: function() {
		HmDropDownList.create($('.useFlag'), {
			source: [
				{ label: '사용', value: '1' },
				{ label: '미사용', value: '0' }
			], autoDropDownHeight: true, selectedIndex: 0, width: 100
		});
	},

	/** init data */
	initData: function() {
		try {
			Server.get('/code/getCodeListByCodeKind.do', {
				data: {codeKind: 'NET_POLL_GRP_NO'},
				success: function (result) {
					Main.netPollGrpNoList = result;
					HmDropDownList.create($('.codeValue4').eq(0), {
						source: Main.netPollGrpNoList, displayMember: 'codeValue1', valueMember: 'codeId',
						selectedIndex: 0, autoDropDownHeight: true
					});
					Main.search();
				}
			});
		} catch(e) {
			Main.search();
		}
	},

	/* 수집기 추가 */
	collectorAdd: function() {

		var trCnt = $('#collectorForm tr').length;



		var innerHtml = "";
		innerHtml += '<tr>';
		innerHtml += '	<th scope="row"><label class="txtRed">*</label>수집기번호</td>';
		innerHtml += '	<td><input type="text" class="codeId" style="text-align: right" oninput="this.value = this.value.replace(/[^0-9.]/g, \'\').replace(/(\\..*)\\./g, \'$1\');"/></td>';
		innerHtml += '	<th scope="row"><label class="txtRed">*</label>수집기명</td>';
		innerHtml += '	<td><input type="text" class="codeValue1"/></td>';
		innerHtml += '	<th scope="row"><label class="txtRed">*</label>수집기IP</td>';
		innerHtml += '	<td><input type="text" class="codeValue2"/></td>';
		innerHtml += '	<th scope="row"><label class="txtRed">*</label>수집기PORT</td>';
		innerHtml += '	<td><input type="text" class="codeValue3"/></td>';
		innerHtml += '	<th scope="row">망구분</td>';
		innerHtml += '	<td><div class="codeValue4"></div></td>';
		innerHtml += '	<th scope="row">사용여부</td>';
		innerHtml += '	<td><div class="useFlag"></div></td>';
		innerHtml += '	<td class="buttonGroup">';
		innerHtml += '		<button name="collectorDel" type="button" onclick="Main.collectorDel(this)" class="whiteBtn btn_ico_77" style="margin-right:5px; float:right;"></button>';
		innerHtml += '	</td>';
		innerHtml += '</tr>';

		$('#collectorForm > tbody:last').append(innerHtml);
		maxId++;
		$('.codeId').eq(trCnt).val(maxId);
		HmDropDownList.create($('.useFlag').eq(trCnt), {
			source: [
				{ label: '사용', value: '1' },
				{ label: '미사용', value: '0' }
			], autoDropDownHeight: true, selectedIndex: 0, width: 100
		});
		HmDropDownList.create($('.codeValue4').eq(trCnt), {
			source: Main.netPollGrpNoList, displayMember: 'codeValue1', valueMember: 'codeId',
			selectedIndex: 0, autoDropDownHeight: true
		});

		// $('button[name=collectorDel]').bind('click', function(event) {
		// 	trIdx = $(this).parent().parent().index();
		// 	trObj = $(this).parent().parent();
		// 	Main.collectorDel(event);
		// });
	},

	/* 수집기 삭제 */
	collectorDel: function(delBtn) {
		trIdx = $(delBtn).parent().parent().index();
		trObj = $(delBtn).parent().parent();
		var trCnt = $('#collectorForm tr').length;
		console.log("trIdx ==> ", trIdx);
		if (trCnt > 0 && trIdx === 0) {
			alert('최초 수집기는 삭제 불가합니다.');
			return false;
		}
		else {
			/* 수집기 사용여부 체크 */
			var codeId = $('.codeId').eq(trIdx).val();
			if (codeId) {
				codeId = parseInt($('.codeId').eq(trIdx).val());
			}
			else {
				alert('삭제할 수집기번호가 없습니다..');
				$('.codeId').eq(trIdx).focus();
				return false;
			}
			Server.get('/code/getPollGrpNoCheck.do', {
				data: {
					codeKind: 'POLL_GRP_NO',
					codeId: codeId
				},
				success: function(result) {
					if (result.length > 0) {
						alert('사용중인 수집기번호는 삭제할 수 없습니다.');
						return false;
					}
					else {
						if (trIdx > 0 && trObj) {
							trObj.remove();
							Main.collectorDelExec(codeId);
						}
					}
				}
			});
		}

	},

	collectorDelExec: function (codeId) {
		Server.get('/code/deleteCollectorCode.do', {
			data: {
				codeKind: 'POLL_GRP_NO',
				codeId: codeId
			},
			success: function(result) {
				alert('삭제되었습니다.');
			}
		});
	},

	search: function() {
		Server.get('/code/getCodeListByCodeKind.do', {
			data: { codeKind: 'POLL_GRP_NO' },
			success: function(result) {
				$.each(result, function(idx, value) {
					if ($('.codeId').eq(idx).val() == undefined) {
						$('#collectorForm').find('tbody').append($collectorFrom);
						HmDropDownList.create($('.useFlag').eq(idx), {
							source: [
								{ label: '사용', value: '1' },
								{ label: '미사용', value: '0' }
							], autoDropDownHeight: true, selectedIndex: 0, width: 100
						});
						HmDropDownList.create($('.codeValue4').eq(idx), {
							source: Main.netPollGrpNoList, displayMember: 'codeValue1', valueMember: 'codeId',
							selectedIndex: 0, autoDropDownHeight: true
						});
					};
					console.log(value);
					if (parseInt(value.codeId) > maxId) maxId = parseInt(value.codeId);
					$('.codeId').eq(idx).val(value.codeId);
					$('.codeValue1').eq(idx).val(value.codeValue1);
					$('.codeValue2').eq(idx).val(value.codeValue2);
					$('.codeValue3').eq(idx).val(value.codeValue3);
					$('.codeValue4').eq(idx).val(value.codeValue4);
					$('.useFlag').eq(idx).val(value.useFlag);
					// $('button[name=collectorDel]').bind('click', function(event) {
					// 	trIdx = $(this).parent().parent().index();
					// 	trObj = $(this).parent().parent();
					// 	Main.collectorDel();
					// });

				});
			}
		});
	},

	save: function() {
		var _list = [];
		var saveBoolean = true;
		var validCheck = true;
		$.each($('.codeId'), function(idx, value) {

			if ($.isBlank($('.codeId').eq(idx).val())) {
				alert('수집기 번호를 입력해 주세요.');
				$('.codeId').eq(idx).focus();
				saveBoolean = false;
			} else if ($.isBlank( $('.codeValue1').eq(idx).val())) {
				alert('수집기명을 입력해 주세요.');
				$('.codeValue1').eq(idx).focus();
				saveBoolean = false;
			} else if ($.isBlank( $('.codeValue2').eq(idx).val())) {
				alert('수집기IP를 입력해 주세요.');
				$('.codeValue2').eq(idx).focus();
				saveBoolean = false;
			} else if ($.isBlank($('.codeValue3').eq(idx).val())) {
				alert('수집기 Port를 입력해 주세요.');
				$('.codeValue3').eq(idx).focus();
				saveBoolean = false;
			}
			if (!saveBoolean) {
				_list = [];
				return false;
			}

			validCheck = Main.duplicationCheck(idx, $('.codeId').eq(idx).val());
			if ($.isNumeric(validCheck)) {
				$('.codeId').eq(validCheck).focus();
				alert("수집기번호가 중복되었습니다.");
				return false;
			}


			if ($('.codeId').eq(idx).val() != '' && !$.isNumeric(validCheck)) {
				var _map = {};
				_map.codeId = $('.codeId').eq(idx).val();
				_map.codeValue1 = $('.codeValue1').eq(idx).val();
				_map.codeValue2 = $('.codeValue2').eq(idx).val();
				_map.codeValue3 = $('.codeValue3').eq(idx).val();
				_map.codeValue4 = $('.codeValue4').eq(idx).val();
				_map.useFlag = $('.useFlag').eq(idx).val();

				_list.push(_map);
			}
		});


		if (_list.length > 0 && _list.length == $('.codeId').length) {
			Server.post('/code/saveCollectorCode.do', {
				data: { codeKind: 'POLL_GRP_NO', list: _list },
				success: function(result) {
					alert(result);
				}
			});
		}
	},

	duplicationCheck: function (idx, codeId) {
		for (var X = 0; X <= $('.codeId').length; X++ ) {
			if (X != idx && codeId == $('.codeId').eq(X).val()) {
				return X;
			}
		}
		return true;
	}

		
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
	
	$('#collectorForm').on('click', '.p_btnPlus3', function() {
		$(this).parent().parent().parent().append($collectorFrom);
        HmDropDownList.create($(this).parent().parent().parent().find('.useFlag:last'), {
            source: [
                { label: '사용', value: '1' },
                { label: '미사용', value: '0' }
            ], autoDropDownHeight: true, selectedIndex: 0, width: 100
        });
        HmDropDownList.create($(this).parent().parent().parent().find('.codeValue4:last'), {
            source: Main.netPollGrpNoList, displayMember: 'codeValue1', valueMember: 'codeId',
            selectedIndex: 0, autoDropDownHeight: true
        });
	});
	
	$('#collectorForm').on('click', '.p_btnMinus', function() {
		$(this).parent().parent().remove();
		/*
		if (confirm("해당 수집기로 등록된 장비의 수집기정보 또한 삭제됩니다.\n삭제하시겠습니까?")) {
			alert($(this).parent().parent().find('.codeId').val());
			$(this).parent().parent().remove();
		}
		*/
	});
});