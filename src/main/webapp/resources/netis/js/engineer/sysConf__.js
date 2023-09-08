var Main = {
		/** variable */
		initVariable: function() {
		
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnRefresh': this.search(); break;
			case 'btnSave': this.save(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			$('#appWin').jqxExpander({ width: '100%', showArrow: false, toggleMode: 'none', theme: jqxTheme,
				initContent: function() {
                    // $('#SITE_NAME').html('Netis.v3.1');
                    // $('#WEB_SITE_NAME').html('Netis.v3');
					// $('#SITE_NAME').jqxComboBox({
					// 	source: [
					//          { label: 'Netis.v3.1', value: 'Netis.v3.1' }
					// 	]
					// });

                    $('#DASH_TYPE').jqxComboBox({width: 100, height: 21, source: ['None', 'URL', 'Layout'], autoDropDownHeight: true})
						.on('change', function (event) {
							var item = event.args.item;
                            var data = item.originalItem;
                            if (data === 'Layout') {
                            	$('#DASH_PORT').hide();
                                $('#DASH_PORT').parent().hide();
                            	$('#DASH_LAYOUT').show();
							} else if (data === 'URL') {
                                $('#DASH_PORT').show();
                                $('#DASH_PORT').parent().show();
                                $('#DASH_LAYOUT').hide();
							} else {
                                $('#DASH_PORT').hide();
                                $('#DASH_PORT').parent().hide();
                                $('#DASH_LAYOUT').hide();
							}
                        });
                    $('#DASH_TYPE').jqxComboBox('selectIndex', 0);

                    $('#DASH_LAYOUT').jqxDropDownList({
							width: 200, height: 21,
							source: new $.jqx.dataAdapter({
								type: 'GET',
								datatype: 'json',
								contentType: 'application/json; charset=UTF-8',
                                url: '/engineer/popup/getLayoutMenuPage.do'
							}, {
								formatData: function (data) {
									$.extend(data, {
                                        inMenu: true
									});
									return JSON.stringify(data);
                                }
							}),
							displayMember: 'menuName',
							valueMember: 'guid',
							selectedIndex: 0, autoDropDownHeight: true});
					$('#PWD_ENCR_USE').jqxCheckBox({width: 50, height: 21});
					// $('#ORACLE_VER').jqxComboBox({ width: 100, height: 21, autoDropDownHeight: true,
					// 	source: [
					// 	         { label: 'Standard', value: 'standard' },
					// 	         { label: 'Enterprise', value: 'enterprise' }
					// 	]
					// });
					$('#TOPO_AUTH_USE').jqxCheckBox({width: 50, height: 21});
					$('#TOPO_AUTH_TABLE').jqxComboBox({width: 100, height: 21, source: ['TM', 'TOPO'], selectedIndex: 0, autoDropDownHeight: true});
					$('#APP_SEC_UNIT_POPUP_YN').jqxCheckBox({width: 50, height: 21});
					
					$('#CUPID_USE, #CUPID_SEC_UNIT_USE').jqxCheckBox({width: 50, height: 21});
					$('#SYSLOG_LEVEL_COLOR_USE').jqxCheckBox({width: 50, height: 21});
					$('#ELASTIC_SEARCH_USE').jqxCheckBox({width: 50, height: 21});
					
				}
			});
			/*
			$('#delegateWin').jqxExpander({ width: '100%', showArrow: false, toggleMode: 'none', theme: jqxTheme,
				initContent: function() {
				}
			});
			$('#itmonWin').jqxExpander({ width: '100%', showArrow: false, toggleMode: 'none', theme: jqxTheme,
				initContent: function() {
					$('#STARCELL_USE').jqxCheckBox({width: 50, height: 21});
				}
			});	
			*/		
		},
		
		/** init data */
		initData: function() {
			this.search();
		},
		
		search: function() {
			// 새로고침시 체크박스 모두 해제
			$(".pop_combo1").jqxCheckBox('uncheck');
			
			
			Server.get('/code/getCodeListByCodeKind.do', {
				data: { codeKind: 'WEB_CONF' },
				success: function(result) {
					$.each(result, function(idx, value) {
						try {
							switch(value.codeId) {
							case 'PWD_ENCR_USE': case 'TOPO_AUTH_USE':
							case 'STARCELL_USE': case "APP_SEC_UNIT_POPUP_YN": case "CUPID_USE": case "SYSLOG_LEVEL_COLOR_USE": case "CUPID_SEC_UNIT_USE":
							case "ELASTIC_SEARCH_USE":
								$('#' + value.codeId).val(value.codeValue1 == 'Y');
								break;
							case "DASH_PORT":
								if (value.codeValue1 === 'URL') {
									$('#DASH_PORT').val(value.codeValue2);
                                } else if (value.codeValue1 === 'Layout') {
									$('#DASH_LAYOUT').val(value.codeValue2);
								} else {
                                    value.codeValue1 = 'None';
								}
								$('#DASH_TYPE').val(value.codeValue1);
								break;
							default:
								$('#' + value.codeId).val(value.codeValue1);
								break;
							}
						} catch(e) {}
					});
				}
			});
		},
		
		save: function() {
			// 18.06.20] validation
			var obj = $('#UPLOAD_SIZE_LIMIT');
			if(!obj.val().isBlank()) {// 값이 들어가있을때 체크
				if(!obj.val().isNum()) {
					alert('업로드 용량제한은 숫자만 입력가능합니다.');
					obj.focus();
					return;
				}
			}
			obj = $('#CUPID_PORT');
			if(!obj.val().isBlank()) {// 값이 들어가있을때 체크
				if(!obj.val().isNum()) {
					alert('Cupid 접속 포트는 숫자만 입력가능합니다.');
					obj.focus();
					return;
				}
			}
			obj = $('#ELASTIC_SEARCH_PORT');
			if(!obj.val().isBlank()) {// 값이 들어가있을때 체크
				if(!obj.val().isNum()) {
					alert('ElasticSearch 접속 포트는 숫자만 입력가능합니다.');
					obj.focus();
					return;
				}
			}
			
			var _list = [
                { codeId: 'SITE_NAME', codeValue1: $('#SITE_NAME').val().trim() || $('#SITE_NAME').html().trim(), useFlag: 1 },
                { codeId: 'WEB_SITE_NAME', codeValue1: $('#WEB_SITE_NAME').val().trim() || $('#WEB_SITE_NAME').html().trim(), useFlag: 1 },
		             { codeId: 'PWD_ENCR_USE', codeValue1: $('#PWD_ENCR_USE').val()? 'Y' : 'N', useFlag: 1 },
		             //{ codeId: 'ORACLE_VER', codeValue1: $('#ORACLE_VER').val(), useFlag: 1 },
		             { codeId: 'TOPO_AUTH_USE', codeValue1: $('#TOPO_AUTH_USE').val()? 'Y' : 'N', useFlag: 1 },
                	 { codeId: 'TOPO_AUTH_TABLE', codeValue1: $('#TOPO_AUTH_TABLE').val(), useFlag: 1 },
                	 { codeId: 'APP_SEC_UNIT_POPUP_YN', codeValue1: $('#APP_SEC_UNIT_POPUP_YN').val()? 'Y' : 'N', useFlag: 1 },
		             { codeId: 'UPLOAD_PATH', codeValue1: $('#UPLOAD_PATH').val(), useFlag: 1 },
		             { codeId: 'UPLOAD_SIZE_LIMIT', codeValue1: $('#UPLOAD_SIZE_LIMIT').val(), useFlag: 1 },
		             { codeId: 'DELEGATE_IP', codeValue1: $('#DELEGATE_IP').val(), useFlag: 1 },
		             { codeId: 'DELEGATE_PORT', codeValue1: $('#DELEGATE_PORT').val(), useFlag: 1 },
		             { codeId: 'STARCELL_USE', codeValue1: $('#STARCELL_USE').val()? 'Y' : 'N', useFlag: 1 },
		             { codeId: 'STARCELL_SVC_URL', codeValue1: $('#STARCELL_SVC_URL').val(), useFlag: 1 },
		             { codeId: 'EVT_LEVEL', codeValue1: $('#EVT_LEVEL').val()==""?"Action":$('#EVT_LEVEL').val(), useFlag: 1 },
		             { codeId: 'EVT_LEVEL_0', codeValue1: $('#EVT_LEVEL_0').val()==""?"Normality":$('#EVT_LEVEL_0').val(), useFlag: 1 },
		             { codeId: 'EVT_LEVEL_1', codeValue1: $('#EVT_LEVEL_1').val()==""?"Info":$('#EVT_LEVEL_1').val(), useFlag: 1 },
		             { codeId: 'EVT_LEVEL_2', codeValue1: $('#EVT_LEVEL_2').val()==""?"Warning":$('#EVT_LEVEL_2').val(), useFlag: 1 },
		             { codeId: 'EVT_LEVEL_3', codeValue1: $('#EVT_LEVEL_3').val()==""?"Minor":$('#EVT_LEVEL_3').val(), useFlag: 1 },
		             { codeId: 'EVT_LEVEL_4', codeValue1: $('#EVT_LEVEL_4').val()==""?"Major":$('#EVT_LEVEL_4').val(), useFlag: 1 },
		             { codeId: 'EVT_LEVEL_5', codeValue1: $('#EVT_LEVEL_5').val()==""?"Critical":$('#EVT_LEVEL_5').val(), useFlag: 1 },
		             { codeId: 'CUPID_USE', codeValue1: $('#CUPID_USE').val()? 'Y' : 'N', useFlag: 1 },
		             { codeId: 'CUPID_PORT', codeValue1: $('#CUPID_PORT').val(), useFlag: 1 },
		             { codeId: 'CUPID_SEC_UNIT_USE', codeValue1: $('#CUPID_SEC_UNIT_USE').val()? 'Y' : 'N', useFlag: 1 },
		             { codeId: 'SYSLOG_LEVEL_COLOR_USE', codeValue1: $('#SYSLOG_LEVEL_COLOR_USE').val()? 'Y' : 'N', useFlag: 1 },
		             { codeId: 'ELASTIC_SEARCH_USE', codeValue1: $('#ELASTIC_SEARCH_USE').val()? 'Y' : 'N', useFlag: 1 },
		             { codeId: 'ELASTIC_SEARCH_IP', codeValue1: $('#ELASTIC_SEARCH_IP').val(), useFlag: 1 },
		             { codeId: 'ELASTIC_SEARCH_PORT', codeValue1: $('#ELASTIC_SEARCH_PORT').val(), useFlag: 1 }
		             
         	];

			var codeValue2 = '', codeValue3 = '';
			if ($('#DASH_TYPE').val() === 'URL') {
				codeValue2 = $('#DASH_PORT').val();
				if (codeValue2.toUpperCase().indexOf('HTTPS://') > -1) {
					codeValue2 = codeValue2.substring(8, codeValue2.length);
				} else if (codeValue2.toUpperCase().indexOf('HTTP://') > -1) {
                    codeValue2 = codeValue2.substring(7, codeValue2.length);
                }
			} else if ($('#DASH_TYPE').val() === 'Layout') {
				var item = $('#DASH_LAYOUT').jqxDropDownList('getSelectedItem');
                codeValue2 = item.originalItem.guid;
                codeValue3 = item.originalItem.grpType;
			}
			_list.push({ codeId: 'DASH_PORT', codeValue1: $('#DASH_TYPE').val(), codeValue2: codeValue2, codeValue3: codeValue3, useFlag: 1 });


			alert(2);

			// Server.post('/code/saveCodeInfo.do', {
			// 	data: { codeKind: 'WEB_CONF', list: _list },
			// 	success: function(result) {
			// 		alert(result);
			// 	}
			// });
			
		}
		
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});