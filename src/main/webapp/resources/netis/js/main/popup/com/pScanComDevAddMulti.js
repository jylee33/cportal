var $p_grid;
var grpList = [], profileList = [];

$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    //PMain.initData();
});


var PMain = {
    /** Initialize */
    initVariable: function () {
    	$p_grid = $('#p_grid');
    },

    /** Event Object */
    observe: function () {
        $("button").bind("click", function(event) { PMain.eventControl(event); });
    },

    /** Event Control Function */
    eventControl: function (event) {
        switch (event.currentTarget.id) {
        case 'pbtnRefresh': this.search(); break;
        case 'pbtnOID': this.showOidConf(); break;
        case 'pbtnNDev': this.showUnregDev(); break;
        case 'pbtnDel': this.delRegDev(); break;
        case 'pbtnSave': this.save(); break;
        case 'pbtnClose': self.close(); break;
        }
    },

    /** Init Design */
    initDesign: function () {
    	
         var datafields = [{no: 1}];
         var source =
        {
        	datatype: 'json',
        	url: ctxPath + '/main/popup/devScan/getRegDevList.do',
            unboundmode: true,
            totalrecords: 100,
//            datafields: [
//                 { name: 'validYn' },
//                 { name: 'devName' },
//                 { name: 'userDevName' },
//                 { name: 'devIp' },
//                 { name: 'devKind' },
//                 { name: 'vendor' },
//                 { name: 'model' },
//                 { name: 'grpNo' },
//                 { name: 'grpName' },
//                 { name: 'profileName' },
//                 { name: 'perfPoll' },
//                 { name: 'cfgPoll' },
//                 { name: 'icmpPoll' },
//                 { name: 'arpPoll' },
//                 { name: 'snmpVer' },
//                 { name: 'userId' },
//                 { name: 'loginPwd' },
//                 { name: 'enPwd' },
//                 { name: 'community' },
//                 { name: 'setCommunity' },
//                 { name: 'confMode' },
//                 { name: 'snmpUserId' },
//                 { name: 'snmpAuthType' },
//                 { name: 'snmpAuthKey' },
//                 { name: 'snmpEncryptType' },
//                 { name: 'snmpEncryptKey' }
//            ],
            updaterow: function (rowid, rowdata, commit) {
            	PMain.validation(rowdata);
            }
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
    	
        var columns =  [

			  { text: '종류', datafield: 'devKind1', columntype: 'dropdownlist', width: 70,
				  createeditor: function(row, value, editor) {
                  	editor.jqxDropDownList({ source: [
						{label: '장비', value: 'DEV'},
						{label: '서버', value: 'SVR'}
					], displayMember: 'label', valueMember: 'value', dropDownHeight: 250  });
              }},
              { text: '저장', datafield: 'isSave', columntype: 'checkbox', width: 70 },
	          { text: 'No', datafield: 'validYn', width: 60, editable: false, cellsrenderer: HmGrid.rownumrenderer,
	        	  cellclassname: function(row, columnfield, value) {
	        		  return value == 'Y'? 'valid' : 'invalid';
	        	  }
	          },
			  { text: 'FTP', datafield: 'ftpPortStat', displayfield: 'disFtpPortStat', cellsalign: 'center', editable: false,cellclassname: function(row, column, value, data) {
                      if(data.ftpPortStat == '1'){
                          return 'normal'
                      }else{
                          return 'critical'
                      }
                  }},
			  { text: 'SSH', datafield: 'sshPortStat', displayfield: 'disSshPortStat', cellsalign: 'center',editable: false,cellclassname: function(row, column, value, data) {
                      if(data.sshPortStat == '1'){
                          return 'normal'
                      }else{
                          return 'critical'
                      }
                  }},
			  { text: 'TELNET', datafield: 'telnetPortStat', displayfield: 'disTelnetPortStat', cellsalign: 'center',editable: false,cellclassname: function(row, column, value, data) {
                      if(data.telnetPortStat == '1'){
                          return 'normal'
                      }else{
                          return 'critical'
                      }
                  }},
			  { text: 'SNMP', datafield: 'snmpPortStat', displayfield: 'disSnmpPortStat', cellsalign: 'center',editable: false,cellclassname: function(row, column, value, data) {
                      if(data.snmpPortStat == '1'){
                          return 'normal'
                      }else{
                          return 'critical'
                      }
                  }},
			  { text: 'ICMP', datafield: 'icmpPortStat', displayfield: 'disIcmpPortStat', cellsalign: 'center',editable: false,cellclassname: function(row, column, value, data) {
                      if(data.icmpPortStat == '1'){
                          return 'normal'
                      }else{
                          return 'critical'
                      }
                  }},
	          { text: 'SYSOID', datafield: 'sysObjectid', width: 150 },
	          { text: '* 장비명', datafield: 'devName', width: 100 },
	          { text: '사용자장비명', datafield: 'userDevName', width: 100 },
	          { text: '* 장비IP', datafield: 'devIp', width: 100 },
	          { text: '장비종류', datafield: 'devKind', width: 100 },
	          { text: '제조사', datafield: 'vendor', width: 100 },
	          { text: '모델', datafield: 'model', width: 100 },
	          { text: '* 소속그룹', datafield: 'grpNo', displayfield: 'grpName', width: 150,   columntype: 'dropdownlist',
	        	  createeditor: function(row, value, editor) {
	        		  editor.jqxDropDownList({ source: grpList, displayMember: 'grpName', valueMember: 'grpNo', dropDownHeight: 250  });
	        	  }
	          },
	          // { text: '프로파일명', datafield: 'profileNo', displayfield: 'profileName', width: 100, columntype: 'dropdownlist',
	        	//   createeditor: function(row, value, editor) {
	        	// 	  editor.jqxDropDownList({ source: profileList, autoDropDownHeight: true, displayMember: 'profileName', valueMember: 'profileNo' });
	        	//   }
	          // },
	          // { text: '성능수집', datafield: 'perfPoll', width: 90, columntype: 'checkbox',
	        	//   renderer: function () {
               //        return '<div style="margin-bottom: 7px; margin-top: 7px;"><span>성능수집</span><div id="perfPollheaderChk"></div></div>';
               //  },rendered: function (element) {
               //  	$(element).jqxCheckBox({ width: 16, height: 16, animationShowDelay: 0, animationHideDelay: 0 });
               //  	$(element).on('change', function (event) {
               //          var checked = event.args.checked;
               //          if (checked == null) return;
               //          $p_grid.jqxGrid('beginupdate');
               //          var rows = $p_grid.jqxGrid('getboundrows');
               //      	for(var i = 0; i < rows.length; i++) {
               //      		$p_grid.jqxGrid('setcellvalue', rows[i].boundindex, 'perfPoll', checked);
               //      	}
               //
               //    	  	$p_grid.jqxGrid('endupdate');
               //      });
               //  }
	          // },//
	          // { text: 'Config Backup', datafield: 'cfgPoll', width: 130, columntype: 'checkbox',
	        	//   renderer: function () {
               //        return '<div style="margin-bottom: 7px; margin-top: 7px;"><span>Config Backup</span><div id="cfgPollheaderChk"></div></div>';
               //  },rendered: function (element) {
               //  	$(element).jqxCheckBox({ width: 16, height: 16, animationShowDelay: 0, animationHideDelay: 0 });
               //  	$(element).on('change', function (event) {
               //          var checked = event.args.checked;
               //          if (checked == null) return;
               //          $p_grid.jqxGrid('beginupdate');
               //          var rows = $p_grid.jqxGrid('getboundrows');
               //      	for(var i = 0; i < rows.length; i++) {
               //      		$p_grid.jqxGrid('setcellvalue', rows[i].boundindex, 'cfgPoll', checked);
               //      	}
               //
               //    	  	$p_grid.jqxGrid('endupdate');
               //      });
            	// }
	          // },
	          { text: '헬스체크', datafield: 'icmpPoll', displayfield: 'icmpPollStr', width: 100, columntype: 'dropdownlist',//
	        	  createeditor: function(row, value, editor) {
	        		  var s = [
						         	{ label: 'NONE', value: 0 },
						         	{ label: 'Both', value: 3 },
						         	{ label: 'ICMP', value: 1 },
						         	{ label: 'SNMP', value: 2 }
						         ];
	        		  editor.jqxDropDownList({ source: s, autoDropDownHeight: true, displayMember: 'label', valueMember: 'value' })

	        	  }
	          },
	          { text: 'IP관리', datafield: 'arpPoll', width: 90, columntype: 'checkbox',
	        	  renderer: function () {
                      return '<div style="margin-bottom: 7px; margin-top: 7px;"><span>IP관리</span><div id="arpPollheaderChk"></div></div>';
                },rendered: function (element) {
                	$(element).jqxCheckBox({ width: 16, height: 16, animationShowDelay: 0, animationHideDelay: 0 });
                	$(element).on('change', function (event) {
                        var checked = event.args.checked;
                        if (checked == null) return;
                        $p_grid.jqxGrid('beginupdate');
                        var rows = $p_grid.jqxGrid('getboundrows');
                    	for(var i = 0; i < rows.length; i++) {
                    		$p_grid.jqxGrid('setcellvalue', rows[i].boundindex, 'arpPoll', checked);
                    	}
                        
                  	  	$p_grid.jqxGrid('endupdate');
                    }); 
            	}
	          },
	          { text: 'SNMPVer', datafield: 'snmpVer', displayfield: 'snmpVerStr', width: 100, columntype: 'dropdownlist',//
	        	  	createeditor: function(row, value, editor) {
						var s = [
						         	{ label: 'Ver1', value: 1 },
						         	{ label: 'Ver2', value: 2 },
						         	{ label: 'Ver3', value: 3 }
						         ];
						editor.jqxDropDownList({ source: s, autoDropDownHeight: true, displayMember: 'label', valueMember: 'value' });
					}
	          },
	          { text: '사용자ID', datafield: 'loginUserId', width: 100 },
	          { text: '패스워드', datafield: 'loginPwd', width: 100 },
	          { text: '2차인증패스워드', datafield: 'enPwd', width: 110 },
	          { text: 'Read Community', datafield: 'community', width: 100 },
	          { text: 'Set Community', datafield: 'setCommunity', width: 100 },
	          { text: 'Set Config Mode', datafield : 'confMode', displayfield: 'confModeStr', width: 130, columntype: 'dropdownlist',
					createeditor: function(row, value, editor) {
						var s = [
                            { label: 'SSH', value: 'SSH' },
                            { label: 'SSH|TFTP', value: 'SSH|TFTP' },
                            { label: 'Telnet', value: 'Telnet' },
                            { label: 'Telnet|TFTP', value: 'Telnet|TFTP' }
						         ];
						editor.jqxDropDownList({ source: s, autoDropDownHeight: true, displayMember: 'label', valueMember: 'value' });
					}
	          },
	          { text: 'SNMPUserID', datafield: 'snmpUserId', width: 100 },
	          { text : 'SNMPSecurityLevel', datafield : 'snmpSecurityLevel', displayfield: 'snmpSecurityLevelStr', width: 150, columntype: 'dropdownlist',
					createeditor: function(row, value, editor) {
						var s = [
						         	{ label: 'NoAuthNoPriv', value: 0 },
						         	{ label: 'AuthNoPriv', value: 1 },
						         	{ label: 'AuthPriv', value: 2 }
						         ];
						editor.jqxDropDownList({ source: s, autoDropDownHeight: true, displayMember: 'label', valueMember: 'value' });
					}
	          },
	          { text: 'SNMPAuthType', datafield: 'snmpAuthType', displayfield: 'snmpAuthTypeStr', width: 100, columntype: 'dropdownlist',
					createeditor: function(row, value, editor) {
						var s = [
						         	{ label: 'SHA', value: 1 },
						         	{ label: 'MD5', value: 2 }
						         ];
						editor.jqxDropDownList({ source: s, autoDropDownHeight: true, displayMember: 'label', valueMember: 'value' });
					}
	          },
	          { text: 'SNMPAuthKey', datafield: 'snmpAuthKey', width: 100 },
	          { text: 'SNMPEncryptType', datafield : 'snmpEncryptType', displayfield: 'snmpEncryptTypeStr', width: 100, columntype: 'dropdownlist',
					createeditor: function(row, value, editor) {
						var s = [
						         	{ label: 'AES', value: 1 },
						         	{ label: 'DES', value: 2 },
						         	{ label: 'AES192', value: 3 },
						         	{ label: 'AES256', value: 4 }
						         ];
						editor.jqxDropDownList({ source: s, autoDropDownHeight: true, displayMember: 'label', valueMember: 'value' });
					}
	          },
	          { text: 'SNMPEncryptKey', datafield: 'snmpEncryptKey', width: 100 }
        ];
        // 그리드 헤더텍스트 정렬을 center로.. 처리
        $.each(columns, function(idx, value) {
			value.align = 'center';
		});
        
    	$p_grid.jqxGrid({
    		source: dataAdapter,
    		width: '100%',
    		height: '100%',
    		editable: true,
    		theme: jqxTheme,
    		columnsresize: true,
    		/*selectionmode: 'multiplecellsadvanced',*/
    		selectionmode: 'multiplerowsextended',
    		columns: columns
    	})
    	// .on('bindingcomplete', function(event) {
    	// 	var rows = $(this).jqxGrid('getboundrows');
    	// 	if(rows != null) {
    	// 		$.each(rows, function(idx, value) {
    	// 			PMain.validation(value);
        //
    	// 			if(value.validYn=='Y'){
    	// 				$p_grid.jqxGrid('setcellvalue', idx, "isSave", true);
    	// 			}
    	// 		});
    	// 	}
    	// });
    	$('#p_cbHealthChk').jqxDropDownList(
                {
                    source:  [
						         	{ label: 'NONE', value: 0 },
						         	{ label: 'Both', value: 3 },
						         	{ label: 'ICMP', value: 1 },
						         	{ label: 'SNMP', value: 2 }
						         ],
                    displayMember: 'label',
                    valueMember: 'value',
                    width: '100',
                    height: 22,
                    theme: jqxTheme,
                    selectedIndex: 0
                }).on('change', function(event){
                	var rows = $p_grid.jqxGrid('getboundrows');
                	console.log(rows)
                	$.each(rows, function(idx, value) {
                		$p_grid.jqxGrid('setcellvalue', idx, 'icmpPoll', event.args.item.value);
                		$p_grid.jqxGrid('setcellvalue', idx, 'icmpPollStr', event.args.item.label);
                	});
                });
    },

    /** Init Data */
    initData: function () {
    	Server.get('/grp/getDefaultGrpTreeListAll.do', {
    		success: function(result) {
    			grpList = result;
    		}
    	});
    	
    	Server.post('/main/nms/alarmMgmt/getProfileList.do', {
			success: function(result) {
				profileList = result;
			}
		});
    },
    
    validation: function(data) {
    	var orgValidYn = data.validYn;
    	try {
    		if($.isBlank(data.devName) || $.isBlank(data.devIp) || $.isBlank(data.grpNo) || data.grpNo < 1) {
	    		data.validYn = 'N';
	    	} // check required
	    	else {
	    		if(!$.validateIp(data.devIp)) {
	    			data.validYn = 'N';
	    		}
	    		else {
		    		if(data.snmpVer == 3) {
		    			if($.isBlank(data.snmpUserId)) {
		    				data.validYn = 'N';
		    			}
		    			else {
			    			if(data.snmpSecurityLevel == 1) {
			    				if($.isBlank(data.snmpAuthKey)) {
			    					data.validYn = 'N';
			    				}
			    				else {
			    					data.validYn = 'Y';
			    				}
			    			}
			    			else if(data.snmpSecurityLevel == 2) {
			    				if($.isBlank(data.snmpEncryptKey)) {
			    					data.validYn = 'N';
			    				}
			    				else {
			    					data.validYn = 'Y';
			    				}
			    			}
			    			else {
			    				data.validYn = 'Y';
			    			}
		    			}
		    		} // check snmp3
		    		else {
		    			data.validYn = 'Y';
		    		}
	    		}
	    	}
    		if(orgValidYn != data.validYn) {
    			$p_grid.jqxGrid('refreshdata');
    		}
    	} catch(e) {
    		alert(e);
    	}
    },
    
    /** 조회 */
    search: function() {
    	$('#p_cbHealthChk').jqxDropDownList({'selectedIndex': 0})
    	HmGrid.updateBoundData($p_grid, ctxPath + '/main/popup/devScan/getRegDevList.do');
    },
    
    /** SYSOID 설정 */
    showOidConf: function() {

    	HmUtil.createPopup('/main/popup/env/pSysoid.do', $('#hForm'), 'pSysoid', 700, 600);

    },
    
    /** 미등록 장비 */
    showUnregDev: function() {

    	HmUtil.createPopup('/main/popup/env/pRegDevFail.do', $('#hForm'), 'pRegDevFail', 600, 600);

    },
    
    /** 삭제 */
    delRegDev: function() {
    	var rowIdxes = HmGrid.getRowIdxes($p_grid, '장비를 선택해주세요.');
		if(rowIdxes === false) return;
		if(!confirm('[' + rowIdxes.length + '] 건을 삭제하시겠습니까?')) return;
		var _regNos = [], _uids = [];
		$.each(rowIdxes, function(idx, value) {
			var tmp = $p_grid.jqxGrid('getrowdata', value);
			_regNos.push(tmp.regNo);
			_uids.push(tmp.uid)
		});
		
//    	var rowIdx = HmGrid.getRowIdx($p_grid);
//		if(rowIdx === false) {
//			alert('선택된 장비가 없습니다.');
//			return;
//		}
//		var rowdata = $p_grid.jqxGrid('getrowdata', rowIdx);
//		if(!confirm('[' + rowdata.devName + '] 장비를 삭제하시겠습니까?')) return;
//		
		Server.post('/main/popup/devScan/delRegDev.do', {
			data: { regNos: _regNos },
			success: function(result) {
				$p_grid.jqxGrid('deleterow', _uids);
				alert('삭제되었습니다.');
			}
		});
    },
    
    /** 저장 */
    save: function() {
    	HmGrid.endRowEdit($p_grid);
		var rows = $p_grid.jqxGrid('getrows');
		var _list = [], _rowIds = [];
		$.each(rows, function(idx, value) {
			if(value.validYn == 'Y') {
				if(value.isSave == true) {
					//객체복사..
					var _TMP = JSON.parse(JSON.stringify(value));
					if(_TMP.devKind1 == '서버'){
                        _TMP.devKind1 = 'SVR';
					} else {
                        _TMP.devKind1 = 'DEV';
					}
					_list.push(_TMP);
					_rowIds.push(value.uid);
				}
			}
		});
    	
    	if(_list.length == 0) {
			alert('저장하도록 선택한 장비가 없거나, 유효성검사를 통과한 장비가 없습니다.');
			return;
		}
    	else {
    		$.each(_list, function(idx, value) {
    			if(isNaN(value.perfPoll)) value.perfPoll = 0;
    			if(isNaN(value.cfgPoll)) value.cfgPoll = 0;
    			if(isNaN(value.icmpPoll)) value.icmpPoll = 0;
    			if(isNaN(value.arpPoll)) value.arpPoll = 0;
    			if(isNaN(value.snmpVer)) value.snmpVer = '';
    			if(isNaN(value.snmpSecurityLevel)) value.snmpSecurityLevel = '';
    			if(isNaN(value.snmpAuthType)) value.snmpAuthType = '';
    			if(isNaN(value.snmpEncryptType)) value.snmpEncryptType = '';
    			if(!$.isBlank(value.loginUserId) || !$.isBlank(value.loginPwd) || !$.isBlank(value.enPwd)) value.isTelnet = 1;
    			else value.isTelnet = 0;
    		});
    	}

    	console.log('_list', _list);
		Server.post('/main/popup/devScan/saveRegDevTransfer.do', {
			data: { list: _list },
			success: function(result) {
				if(result == "SUCCESS"){
					alert('저장되었습니다.');
					$('#pbtnClose').click();
				} else {
					alert(result);
				}
			}//success
		});
    }

};
