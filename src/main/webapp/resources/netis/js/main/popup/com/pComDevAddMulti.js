var $p_grid;

$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});


var PMain = {
    /** Initialize */
    initVariable: function () {
        $p_grid = $('#p_grid');
    },

    /** Event Object */
    observe: function () {
        $("button").bind("click", function (event) {
            PMain.eventControl(event);
        });
    },

    /** Event Control Function */
    eventControl: function (event) {
        switch (event.currentTarget.id) {
            case 'pbtnSave': this.save(); break;
            case 'pbtnExcelUpload': this.uploadExcel(); break;
            case 'pbtnTempDown': this.downTemplate(); break;
        }
    },
    /** Init Design */
    initDesign: function () {
    	HmWindow.create($('#pwindow'));
    	$("#devAddMultiLoader").jqxLoader({ text: "", isModal: true, width: 60, height: 36, imagePosition: 'top' });
    	
        $('#p_cbPollGrp').jqxDropDownList(
            {
                source: new $.jqx.dataAdapter({datatype: 'json', url: ctxPath + '/combo/getPollGrpList.do'}),
                displayMember: 'label',
                valueMember: 'value',
                width: '200',
                height: 22,
                theme: jqxTheme,
                selectedIndex: 0
            });

        var datafields = [{no: 1}];
        var source =
            {
                unboundmode: true,
                totalrecords: 1000,
                datafields: [
                    {name: 'validYn'},
                    {name: 'devName'},
                    {name: 'userDevName'},
                    {name: 'devIp'},
                    {name: 'devKind2'},
                    {name: 'vendor'},
                    {name: 'model'},
                    {name: 'grpName'},
                    {name: 'profileName'},
                    {name: 'perfPoll'},
                    {name: 'cfgPoll'},
                    {name: 'icmpPoll'},
                    {name: 'arpPoll'},
                    {name: 'snmpVer'},
                    {name: 'userId'},
                    {name: 'loginPwd'},
                    {name: 'enPwd'},
                    {name: 'community'},
                    {name: 'setCommunity'},
                    {name: 'confMode'},
                    {name: 'snmpUserId'},
                    {name: 'snmpAuthType'},
                    {name: 'snmpAuthKey'},
                    {name: 'snmpEncryptType'},
                    {name: 'snmpEncryptKey'}
                ],
                updaterow: function (rowid, rowdata, commit) {
                    PMain.validation(rowdata);
                    commit();
                }
            };
        var dataAdapter = new $.jqx.dataAdapter(source);

        $p_grid.jqxGrid({
            source: dataAdapter,
            width: '100%',
            height: '100%',
            editable: true,
            columnsresize: true,
            selectionmode: 'multiplecellsadvanced',
            columns: [
                {
                    text: 'No', datafield: 'validYn', width: 60, pinned: true, editable: false, cellsrenderer: HmGrid.rownumrenderer,
                    cellclassname: function (row, columnfield, value) {
                        return value == 'Y' ? 'valid' : 'invalid';
                    }, align: 'center'
                },
                {text: '장비IP', datafield: 'devIp', width: 100, cellclassname: 'required', align: 'center'},
//                {text: '장비명', datafield: 'devName', width: 100, cellclassname: 'required', align: 'center'},
                {text: '사용자장비명', datafield: 'userDevName', width: 100, align: 'center'},
                {text: '장비종류', datafield: 'devKind2', width: 100, align: 'center'},
                {text: '제조사', datafield: 'vendor', width: 100, align: 'center'},
                {text: '모델', datafield: 'model', width: 100, align: 'center'},
                {text: '소속그룹명', datafield: 'grpName', width: 100, align: 'center'},
                // {text: '프로파일명', datafield: 'profileName', width: 100, align: 'center'},
                // {text: '성능수집[0:해제, 1:설정]', datafield: 'perfPoll', width: 150, align: 'center'},
                // {text: 'Config Backup[0:해제, 1:설정]', datafield: 'cfgPoll', width: 170, align: 'center'},
                {text: '헬스체크[0:NONE,1:ICMP,2:SNMP,3:Both]', datafield: 'icmpPoll', width: 240, align: 'center'},
                {text: 'IP관리[0:해제, 1:설정]', datafield: 'arpPoll', width: 150, align: 'center'},
                {text: 'SNMPVer[1:Ver1,2:Ver2,3:Ver3]', datafield: 'snmpVer', width: 180, align: 'center'},
                {text: '사용자ID', datafield: 'userId', width: 100, align: 'center'},
                {text: '패스워드', datafield: 'loginPwd', width: 100, align: 'center'},
                {text: '2차인증패스워드', datafield: 'enPwd', width: 110, align: 'center'},
                {text: 'isEnable', datafield: 'isEnable', width: 110, align: 'center', hidden: true},
                {text: 'RO Community', datafield: 'community', width: 100, align: 'center'},
                {text: 'RW Community', datafield: 'setCommunity', width: 100, align: 'center'},
                {text: 'Connect Mode[Telnet, SSH]', datafield: 'confMode', width: 200, align: 'center'},
                {text: 'SNMPUserID', datafield: 'snmpUserId', width: 100, align: 'center'},
                {
                    text: 'SNMPSecurityLevel[0:NoAuthNoPriv, 1:AuthNoPriv, 2: AuthPriv]',
                    datafield: 'snmpSecurityLevel',
                    width: 300, align: 'center'
                },
                {text: 'SNMPAuthType[1:SHA, 2:MD5]', datafield: 'snmpAuthType', width: 200, align: 'center'},
                {text: 'SNMPAuthKey', datafield: 'snmpAuthKey', width: 100, align: 'center'},
                {text: 'SNMPEncryptType[1:AES, 2:DES, 3: AES192, 4: AES256]', datafield: 'snmpEncryptType', width: 200, align: 'center'},
                {text: 'SNMPEncryptKey', datafield: 'snmpEncryptKey', width: 120, align: 'center'}
            ]
        });

        HmDropDownBtn.createTreeGrid($('#p_ddbGrp'), $('#p_grpTreeGrid'), HmTree.T_GRP_DEFAULT, 265, 22, 300, 350);
    },

    /** Init Data */
    initData: function () {

    },
    /**
     * 18.06.07]다중 추가시 설정된 입력값을 제대로 적었는지 확인하는 용
     * 해당 값들은 필수가 아니기 때문에 값이 들어가 있을 때만 체크함.
     */
	validation_set: function(data){

		if (!$.isBlank(data.perfPoll)) { // 성능수집[0:해제, 1:설정]
			var chkFlag = 0;
			var chkDt = data.perfPoll;
			var chkArr = ['0','1'];
			for(var i=0; i<chkArr.length; i++){
				if(chkArr[i]==chkDt){chkFlag = 1; break;}
			}
			if(chkFlag==0){
				return 0;
			}
		}

		if (!$.isBlank(data.cfgPoll)) { // Config Backup[0:해제, 1:설정]
			var chkFlag = 0;
			var chkDt = data.cfgPoll;
			var chkArr = ['0','1'];
			for(var i=0; i<chkArr.length; i++){
				if(chkArr[i]==chkDt){chkFlag = 1; break;}
			}
			if(chkFlag==0){
				return 0;
			}
		}
		
		if (!$.isBlank(data.icmpPoll)) { // 헬스체크[0:NONE,1:ICMP,2:SNMP,3:Both]
			var chkFlag = 0;
			var chkDt = data.icmpPoll;
			var chkArr = ['0','1','2','3'];
			for(var i=0; i<chkArr.length; i++){
				if(chkArr[i]==chkDt){chkFlag = 1; break;}
			}
			if(chkFlag==0){
				return 0;
			}
		}
		if (!$.isBlank(data.arpPoll)) {// IP관리[0:해제, 1:설정]
			var chkFlag = 0;
			var chkDt = data.arpPoll;
			var chkArr = ['0','1'];
			for(var i=0; i<chkArr.length; i++){
				if(chkArr[i]==chkDt){chkFlag = 1; break;}
			}
			if(chkFlag==0){
				return 0;
			}
		}
		if (!$.isBlank(data.snmpVer)) {// SNMPVer[1:Ver1,2:Ver2,3:Ver3]
			var chkFlag = 0;
			var chkDt = data.snmpVer;
			var chkArr = ['1','2','3'];
			for(var i=0; i<chkArr.length; i++){
				if(chkArr[i]==chkDt){chkFlag = 1; break;}
			}
			if(chkFlag==0){
				return 0;
			}
		}
		if (!$.isBlank(data.confMode)) {// Connect Mode[Telnet, SSH]
			var chkFlag = 0;
			var chkDt = data.confMode;
			var chkArr = ['Telnet','SSH'];
			for(var i=0; i<chkArr.length; i++){
				if(chkArr[i]==chkDt){chkFlag = 1; break;}
			}
			if(chkFlag==0){
				return 0;
			}
		}
		if (!$.isBlank(data.snmpSecurityLevel)) {// SNMPSecurityLevel[0:NoAuthNoPriv, 1:AuthNoPriv, 2: AuthPriv]
			var chkFlag = 0;
			var chkDt = data.snmpSecurityLevel;
			var chkArr = ['0','1','2'];
			for(var i=0; i<chkArr.length; i++){
				if(chkArr[i]==chkDt){chkFlag = 1; break;}
			}
			if(chkFlag==0){
				return 0;
			}
		}
		if (!$.isBlank(data.snmpAuthType)) {// SNMPAuthType[1:SHA, 2:MD5]
			var chkFlag = 0;
			var chkDt = data.snmpAuthType;
			var chkArr = ['1','2'];
			for(var i=0; i<chkArr.length; i++){
				if(chkArr[i]==chkDt){chkFlag = 1; break;}
			}
			if(chkFlag==0){
				return 0;
			}
		}
		if (!$.isBlank(data.snmpEncryptType)) {// SNMPEncryptType[1:AES, 2:DES, 3: AES192, 4: AES256]
			var chkFlag = 0;
			var chkDt = data.snmpEncryptType;
			var chkArr = ['1','2','3','4'];
			for(var i=0; i<chkArr.length; i++){
				if(chkArr[i]==chkDt){chkFlag = 1; break;}
			}
			if(chkFlag==0){
				return 0;
			}
		}
		return 1;
	},
    validation: function (data, type) { // 18.06.05]  type 추가(엑셀업로드시 validation할때 사용)
        var orgValidYn = data.validYn;
        try {
            if ( $.isBlank(data.devIp)) {
                data.validYn = 'N';
            } // check required
            else {
                if (!$.validateIp(data.devIp)) {
                    data.validYn = 'N';
                }
                else {
                	// 18.06.07] 값존재시 제대로 값 넣었는지 체크
                	var setFlag = PMain.validation_set(data);
                	
                	if(setFlag == 0){
                		data.validYn = 'N';
                		
                	}else { 
	                	// 18.06.07] 헬스체크가 2,3, 일때 snmpVer 없으면 N
	                	if (!$.isBlank(data.icmpPoll)) {
	                		if ((data.icmpPoll == 2||data.icmpPoll == 3) && $.isBlank(data.snmpVer)==true) {
	                			setFlag= 0;
	                			data.validYn = 'N';
	                		}
	                	}
	                	if(setFlag != 0){
		                    if (data.snmpVer == 3) {
		                        if ($.isBlank(data.snmpUserId)) {
		                            data.validYn = 'N';
		                        }
		                        else {
		                            if (data.snmpSecurityLevel == 1) {
		                                if ($.isBlank(data.snmpAuthKey)) {
		                                    data.validYn = 'N';
		                                }
		                                else {
		                                    data.validYn = 'Y';
		                                }
		                            }
		                            else if (data.snmpSecurityLevel == 2) {
		                                if ($.isBlank(data.snmpEncryptKey)) {
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
		                    else if(data.snmpVer == 1 || data.snmpVer == 2){
		                    	if ($.isBlank(data.community)) {
		                            data.validYn = 'N';
		                        }else
		                        	data.validYn = 'Y';
		                    } // check snmp1, snmp2
		                    else {
	                        	data.validYn = 'Y';
		                    }
	                	}
                	}
                }
            }
            if (orgValidYn != data.validYn) {
            	if(type==null || type!=1)
            		$p_grid.jqxGrid('refreshdata');
            }
        } catch (e) {
            alert(e);
        }
    },

    save: function () {
        HmGrid.endRowEdit($p_grid);
        
        $('#devAddMultiLoader').jqxLoader('open');
        
        var rows = $p_grid.jqxGrid('getrows');
        var _list = [], _rowIds = [];
        $.each(rows, function (idx, value) {
            if (value.validYn == 'Y') {
                _list.push(value);
                _rowIds.push(value.uid);
            }
        });

        if (_list.length == 0) {
            alert('유효성검사를 통과한 데이터가 없습니다.');
            $('#devAddMultiLoader').jqxLoader('close');
            return;
        }
        else {
            $.each(_list, function (idx, value) {
                if (isNaN(value.perfPoll)) value.perfPoll = 0;
                if (isNaN(value.cfgPoll)) value.cfgPoll = 0;
                if (isNaN(value.icmpPoll)) value.icmpPoll = 0;
                if (isNaN(value.arpPoll)) value.arpPoll = 0;
                if (isNaN(value.snmpVer)) value.snmpVer = '';
                if (isNaN(value.snmpSecurityLevel)) value.snmpSecurityLevel = '';
                if (isNaN(value.snmpAuthType)) value.snmpAuthType = '';
                if (isNaN(value.snmpEncryptType)) value.snmpEncryptType = '';
                if(!$.isBlank(value.enPwd)) value.isEnable = 1;
                else value.isEnable = 0;
                if (!$.isBlank(value.userId) || !$.isBlank(value.loginPwd) || !$.isBlank(value.enPwd)) value.isTelnet = 1;
                else value.isTelnet = 0;

                value.pollGrpNo = $('#p_cbPollGrp').val();
            });
        }

        var _topGrpNo = 1;
        var treeItem = HmTreeGrid.getSelectedItem($('#p_grpTreeGrid'));
        if (treeItem != null) {
            _topGrpNo = treeItem.grpNo;
        }
        
        Server.post('/dev/addMultiDev.do', {
            data: {list: _list, topGrpNo: _topGrpNo},
            success: function (result) {
                $('#devAddMultiLoader').jqxLoader('close');
                if(result == "SUCCESS") {
                    $p_grid.jqxGrid('deleterow', _rowIds);

                    alert('저장되었습니다.');
                } else {
                    alert(result);
                }
            },
            error: function(err){
            	$('#devAddMultiLoader').jqxLoader('close');
            }
        });
    },
    
    /** 엑셀 업로드 */
    uploadExcel: function(){
    	$.post(ctxPath + '/main/popup/env/pComDevAddMultiExcel.do', function(result) {
			HmWindow.open($('#pwindow'), '엑셀 업로드', result, 480, 125, 'pwindow_init' );
		});
    }, 
    /** 템플릿 다운로드 */
    downTemplate: function(){
    	var url = ctxPath+'/export/NETIS_COM_DEV_FORMAT.xlsx';
    	window.open(url);
    }

};
