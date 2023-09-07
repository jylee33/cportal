var pSnmpTester = function() {
    var p_devInfo = null;

    function initDesign() {
        var self = this;
        // SNMP 설정 Begin
        HmDropDownList.create($('#pQuery_snmpVer'), {
            source: [
                {label: 'Ver1', value: '1'},
                {label: 'Ver2', value: '2'},
                {label: 'Ver3', value: '3'},
            ], autoDropDownHeight: true
        }).on('change', function(event) {
            var val = event.args.item.value;
            var isDisabled = val != 3;
            $('#pQuery_v3Table *').attr('disabled', isDisabled);
            $('#pQuery_secuLevel, #pQuery_authType, #pQuery_encrType').jqxDropDownList('disabled', isDisabled);
        });
        HmDropDownList.create($('#pQuery_secuLevel'), {

            source: [
                {label: 'NoAuthNoPriv', value: 0},
                {label: 'AuthNoPriv', value: 1},
                {label: 'AuthPriv', value: 2}
            ], selectedIndex: 0, autoDropDownHeight: true

        });
        HmDropDownList.create($('#pQuery_authType'), {
            source: [
                {label: 'SHA', value: 1},
                {label: 'MD5', value: 2}
            ], selectedIndex: 0, autoDropDownHeight: true
        });
        HmDropDownList.create($('#pQuery_encrType'), {
            source: [
                {label: 'AES', value: 1},
                {label: 'DES', value: 2},
                {label: 'AES192', value: 3},
                {label: 'AES256', value: 4}
            ], selectedIndex: 0, autoDropDownHeight: true
        });
        $('#pQuery_snmpVer').jqxDropDownList('selectIndex', 1);
        // SNMP 설정 End

        // OUTPUT 그리드
        var contextMenu = $('#pQuery_ctxmenu');
        var ul = $('<ul></ul>');
        ul.append(CtxMenu.getMenuTag('pQuery_ctxmn_clear', 'op_tool', 'Clear'));
        contextMenu.append(ul);
        contextMenu.jqxMenu({
            width: 200, autoOpenPopup: false, mode: 'popup', theme: jqxTheme, popupZIndex: 99999
        })
            .on('itemclick', function(event) {
                clickContextMenu($(event.args)[0].id)
            });
        $('#pQuery_outputGrid').jqxDataTable({
            source: new $.jqx.dataAdapter({
                datatype: 'json',
                localdata: [],
                datafields: [
                    {name: 'time', type: 'string'},
                    {name: 'oid', type: 'string'},
                    //{name: 'oidText', type: 'string'},
                    {name: 'variable', type: 'string'},
                    {name: 'syntaxString', type: 'string'},
                    {name: 'hostInfo', type: 'string'}
                ]
            }),
            width: '100%',
            height: 189,
            // filterable: true,
            // filterMode: 'simple',
            showHeader: false,
            theme: jqxTheme,
            groups: ['time'],
            localization : getLocalization('kr'),
            groupsRenderer: function(value, rowData, level) {
                return 'Sent {0} request to {1} [Response Time: {2}]'.substitute(rowData.data.pduType, rowData.data.hostInfo, rowData.label);
            },
            columns: [
                { text: 'time', datafield: 'time', width: 160, hidden: true },
                //{ text: 'symbol', datafield: 'symbolId', width: 200 },
                { text: 'oid', datafield: 'oid', width: 200 },
                { text: 'variable', datafield: 'variable' }
                // { text: 'syntaxString', datafield: 'syntaxString' }
            ]
        })
            .on('contextmenu', function() { return false; })
            .on('rowClick', function(event) {
                var args = event.args;
                var grid = $(this);
                if(args.originalEvent.button != 2) {
                    contextMenu.jqxMenu('close');
                    return;
                    // grid.jqxDataTable('selectRow', args.boundIndex);
                }
                var posX = parseInt(event.args.originalEvent.clientX) + 5 + $(window).scrollLeft();
                var posY = parseInt(event.args.originalEvent.clientY) + 5 + $(window).scrollTop();
                if($(window).height() < (event.args.originalEvent.clientY + contextMenu.height() + 10)) {
                    posY = $(window).height() - (contextMenu.height() + 10);
                }
                contextMenu.jqxMenu('open', posX, posY);
            });

        // $('#pQuery_walkLimitCnt').jqxNumberInput({ width: 60, height: 21, theme: jqxTheme, value: 100, min: 1, max: 1000,
        //     decimalDigits: 0, inputMode: 'simple'});

        // 버튼 이벤트 등록
        $('#pQuery_btnGet, #pQuery_btnGetNext, #pQuery_btnSnmpWalk').click(get);
        $('#pQuery_btnClear').click(function() {
            $('#sSearchKey').val('');
            clickContextMenu('pQuery_ctxmn_clear');
            $('#pQuery_outputGrid').jqxDataTable('clearFilters');
        });

        $('#sSearchKey').on('keydown', function(e){
            if(e.keyCode == 13){
                if($('#sSearchKey').val() == ''){
                    $('#pQuery_outputGrid').jqxDataTable('clearFilters');
                } else {
                    var filtergroup = new $.jqx.filter();
                    var filter = filtergroup.createfilter('stringfilter', $('#sSearchKey').val(), 'contains');
                    filtergroup.addfilter(1, filter);
                    $('#pQuery_outputGrid').jqxDataTable('addFilter', 'variable', filtergroup);
                    $('#pQuery_outputGrid').jqxDataTable('applyFilters');
                }
            }
        });

        $('#p2btnClose').click(function(){
            window.close();
        })
    }

    // SNMP 호출 (GET, GETNEXT, SNMPWALK)
    function get(event) {
        var pduType = $(event.target).attr('data-pduType');
        var formData = $('#pQuery_snmpForm').serializeObject();
        if(formData.oid.isBlank()) {
            alert('Object ID를 입력하세요.');
            $('#pQuery_oid').focus();
            return;
        }
        if(formData.host.isBlank()) {
            alert('Host를 입력하세요.');
            $('#pQuery_host').focus();
            return;
        }
        if(formData.snmpVer != '3' && formData.community.isBlank()) {
            alert('Community를 입력하세요.');
            $('#pQuery_community').focus();
            return;
        }
        if(formData.snmpVer == '3') {
            if(formData.snmpUserId.isBlank()) {
                alert('SNMP UserID를 입력하세요.');
                $('#pQuery_snmpUserId').focus();
                return;
            }
            if(formData.secuLevel.isBlank()) {
                alert('Security Level을 입력하세요.');
                $('#pQuery_secuLevel').focus();
                return;
            }
            if(formData.secuLevel != '0' && formData.authKey.isBlank()) {
                alert('Auth Key를 입력하세요.');
                $('#pQuery_authKey').focus();
                return;
            }
            if(formData.secuLevel == '2' && formData.encrKey.isBlank()) {
                alert('Encrypt Key를 입력하세요.');
                $('#pQuery_encrKey').focus();
                return;
            }
        }

        /**
         *  Table Index가 존재하지 않으면 .0을 Oid에 추가한다.
         */
        // pduType=GET 인경우 마지막 인덱스가 .0이 아니면 강제로 설정
        formData.pduType = pduType;
        formData.walkLimitCnt = $('#pQuery_walkLimitCnt').val();

        Server.post('/main/com/mibBrowser/execSnmpMgr.do', {
            data: formData,
            success: function(result) {
                if(result.length == 0) {
                    alert('결과 값이 존재하지 않습니다.');
                    return;
                }
                // 응답시간
                var time = $.format.date(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
                var hostInfo = formData.host + ':' + formData.port;
                $.each(result, function(idx, item) {
                    item.time = time;
                    item.pduType = pduType;
                    item.hostInfo = hostInfo;

                    // // 트리노드에서 Oid에 대한 symbolId를 찾아 결과값 출력 데이로 가공
                    // // var _oid = item.oid.endsWith('.0')? item.oid.substring(0, item.oid.lastIndexOf('.')) : item.oid;
                    // var _oid = pduType != 'GET' || item.oid.endsWith('.0')? item.oid.substring(0, item.oid.lastIndexOf('.')) : item.oid;
                    // var treeNode = $('#pQuery_treeGrid').jqxTreeGrid('getRow', _oid.replace(/\./g, '_')); //treeGrid의 id는 Oid에서 dot(.) -> underdash(_)로 변경
                    // if(treeNode != null) {
                    //     item.symbolId = treeNode.symbolId + item.oid.replace(_oid, '');
                    // }
                    // else {
                    //     item.symbolId = null;
                    // }
                    // // item.oid = _oid;
                });

                $('#pQuery_outputGrid').jqxDataTable('beginUpdate');
                $('#pQuery_outputGrid').jqxDataTable('addRow', null, result);
                var rows = $('#pQuery_outputGrid').jqxDataTable('getRows');
                if(rows.length > 1000) {
                    for(var i = 0, n = rows.length-1000; i < n; i++) {
                        $('#pQuery_outputGrid').jqxDataTable('deleteRow', i);
                    }
                }
                $('#pQuery_outputGrid').jqxDataTable('endUpdate');
                $('#pQuery_outputGrid').jqxDataTable('ensureRowVisible', rows.length > 1000? 999 : rows.length-1);

            }
            // TODO SNMP Error발생시 처리는...? outputGrid 출력? alert?
            // error: function(result) {
            //     alert(JSON.stringify(result));
            // }
        });
    }

    // 결과값 ContextMenu Click handler
    function clickContextMenu(menuId) {
        if(menuId == 'pQuery_ctxmn_clear') {
            $('#pQuery_outputGrid').jqxDataTable('beginUpdate');
            $('#pQuery_outputGrid').jqxDataTable('clear');
            $('#pQuery_outputGrid').jqxDataTable('endUpdate');
        }
        else if(menuId == 'pQuery_ctxmn_get') {
            $('#pQuery_btnGet').click();
        }
        else if(menuId == 'pQuery_ctxmn_getnext') {
            $('#pQuery_btnGetNext').click();
        }
        else if(menuId == 'pQuery_ctxmn_snmpwalk') {
            $('#pQuery_btnSnmpWalk').click();
        }
    }

    return {
        initDesign: initDesign
    };
};