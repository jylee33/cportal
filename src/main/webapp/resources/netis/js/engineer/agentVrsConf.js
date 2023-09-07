var $agentGrid;

var Main = {
		/** variable */
		initVariable: function() {
			$agentGrid = $('#agentGrid');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnAdd': this.add(); break;
			case 'btnSearch': this.search(); break;
			case 'btnSave': this.saveConf(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmGrid.create($agentGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						}
				),
				columns:
				[
				 	{ text: '번호', datafield: 'verNo', width: '5%', cellsalign: 'right' },
				 	{ text: 'ORG 파일명', datafield: 'orgFileNm', width: '15%' },
				 	{ text: 'UPLOAD 파일명', datafield: 'fileNm', width: '20%' },
				 	{ text: '파일버전', datafield: 'fileVer', width: '10%', cellsalign: 'center' },
                    { text: '파일구분', datafield: 'fileGubun', width: '10%', cellsalign: 'center' },
				 	{ text: '파일비트', datafield: 'agentOsBitCd', displayfield: 'disAgentOsBitCd', columntype: 'dropdownlist', width: '5%', cellsalign: 'center' },
				 	{ text: '종류', datafield: 'agentOsKindCd', displayfield: 'disAgentOsKindCd', columntype: 'dropdownlist', width: '10%', cellsalign: 'center' },
				 	{ text: '확장정보', datafield: 'extInfo', width: '15%' },
				 	{ text: '등록일시', datafield: 'regDate', width: '10%', cellsalign: 'center' }
				]
			});
		},
		
		/** init data */
		initData: function() {
			this.searchConf();
			this.search();
		},
		
		search: function() {
			HmGrid.updateBoundData($agentGrid, ctxPath + '/engineer/agentVrsConf/getAgentVerList.do');
		},
		
		add: function() {
			$.get(ctxPath + '/engineer/popup/pAgentVerAdd.do', function(result) {
                HmWindow.open($('#pwindow'), '에이전트버전 추가', result, 450, 280);
			});
		},
		
		del: function() {
			var rowIdxes = HmGrid.getRowIdxes($agentGrid, '선택된  데이터가 없습니다.');
			if(rowIdxes === false) return;
			
			if(!confirm('선택된 데이터를 삭제하시겠습니까?')) return;
			
			var rowData = $agentGrid.jqxGrid('getrowdata', rowIdxes);
			Server.post('/svr/delAgent.do', {
				data: { 
					verNo: rowData.verNo
				},
				success: function(result) {
					$agentGrid.jqxGrid('updateBoundData');
					alert(result);
				}
			});
		},

		searchConf: function() {
            Server.get('/code/getCodeListByCodeKind.do', {
                data: { codeKind: 'WEB_CONF' },
                success: function(result) {
                    $.each(result, function(idx, value) {
                        try {
                            switch(value.codeId) {
								case 'AGENT_VERFILE_UPLOAD_IP':
									$('#avf_uploadIp').val(value.codeValue1 || $('#gAgentVerFileUploadIp').val());
                                    $('#gAgentVerFileUploadIp').val(value.codeValue1 || $('#gAgentVerFileUploadIp').val());
									break;
								case 'AGENT_VERFILE_UPLOAD_PORT':
									$('#avf_uploadPort').val(value.codeValue1 || $('#gAgentVerFileUploadPort').val());
                                    $('#gAgentVerFileUploadPort').val(value.codeValue1 || $('#gAgentVerFileUploadPort').val());
									break;
                            }
                        } catch(e) {}
                    });
                }
            });
		},

		saveConf: function() {
			if($.isBlank($('#avf_uploadIp').val())) {
                alert("IP를 입력해주세요.");
                $('#avf_uploadIp').focus();
                return;
            }
            if($.isBlank($('#avf_uploadPort').val())) {
                alert("PORT를 입력해주세요.");
                $('#avf_uploadPort').focus();
                return;
            }
            var _list = [
                { codeId: 'AGENT_VERFILE_UPLOAD_IP', codeValue1: $('#avf_uploadIp').val(), useFlag: 1 },
                { codeId: 'AGENT_VERFILE_UPLOAD_PORT', codeValue1: $('#avf_uploadPort').val(), useFlag: 1 }
            ];

            Server.post('/code/saveCodeInfo.do', {
                data: { codeKind: 'WEB_CONF', list: _list },
                success: function(result) {
                    $('#gAgentVerFileUploadIp').val($('#avf_uploadIp').val());
                    $('#gAgentVerFileUploadPort').val($('#avf_uploadPort').val());
                    alert(result);
                }
            });
		}
		
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});