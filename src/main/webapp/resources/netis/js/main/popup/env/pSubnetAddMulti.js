var $p_grid;
var $p_grpTreeGrid;
$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});


var PMain = {
    /** Initialize */
    initVariable: function () {
        $p_grid = $('#p_confGrid');
        $p_grpTreeGrid = $('#p_grpTreeGrid');
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
            case 'pbtnClose':  self.close(); break;
            case 'pbtnExcelUpload': this.uploadExcel(); break;
            case 'pbtnTempDown': this.downTemplate(); break;
        }
    },
    /** Init Design */
    initDesign: function () {
    	$("#devAddMultiLoader").jqxLoader({ text: "", isModal: true, width: 60, height: 36, imagePosition: 'top' });
        HmDropDownBtn.createTreeGrid($('#p_ddbGrp'), $('#p_grpTreeGrid'), HmTree.T_GRP_IP, 220, 22, 218, 220,undefined, undefined, undefined, $('#pGrpNo').val());

        var datafields = [{no: 1}];
        var source =
            {
                unboundmode: true,
                totalrecords: 100,
                datafields: [
                    {name: 'validYn', type: 'string'},
                    {name: 'subName', stype: 'string'},
                    {name: 'ip', type: 'string'},
                    {name: 'subMaskNo', type: 'number'},
                    {name: 'useYn', type: 'number'},
                ],
                updaterow: function (rowid, rowdata, commit) {
                    PMain.validation(rowdata);
                    commit();
                }
            };
        var dataAdapter = new $.jqx.dataAdapter(source);

        HmGrid.create($p_grid, {
            source: dataAdapter,
            editable: true,
            pageable: false,
            columnsresize: true,
            selectionmode: 'multiplecellsadvanced',
            columns: [
                {
                    text: 'No', datafields: 'validYn', width: 60, pinned: true, editable: false, columntype: 'string', cellsrenderer: HmGrid.rownumrenderer,
                    cellclassname: PMain.cellclass_validYn, cellsalign: 'right'
                },
                {text: '이름', datafield: 'subName', width: 270, cellclassname: 'required',
                    validation: function (cell, value) {
                        if ((value || '').isBlank()) {
                            return {result: false, message: '이름을 입력하세요.'};
                        }
                        return true;
                    }
                },
                {text: 'IP', datafield: 'ip', width: 210, cellclassname: 'required',
                    validation: function (cell, value) {
                        if ((value || '').isBlank()) {
                            return {result: false, message: 'IP를 입력하세요.'};
                        }
                        else if (!value.isIPv4()) {
                            return {result: false, message: 'IP를 확인하세요.'};
                        }
                        return true;
                    }
                },
                {text: 'Bit Mask', datafield: 'subMaskNo', width: 180, cellclassname: 'required', columntype: 'numberinput', cellsalign: 'right',
                    initeditor: function(row, cellvalue, editor) {
                        editor.jqxNumberInput({decimalDigits:0, min: 1, max: 32 , value : 1 });
                    },
                    validation: function (cell, value) {
                        if (value < 1 || value > 32) {
                            return {result: false, message: '32이내로 값을 입력하세요.'};
                        }
                        return true;
                    }
                },
                { text : '사용 여부', datafield : 'useYn', width: 150, columntype: 'checkbox' ,
                    cellvaluechanging: function (row, datafield, columntype, oldvalue, newvalue) {
                        if(newvalue==true){
                            $p_grid.jqxGrid('setcellvalue', row , "useYn", "Y");
                        }else{
                            $p_grid.jqxGrid('setcellvalue', row , "useYn", "N");
                        }
                    }
                },
            ]
        }, CtxMenu.NONE);
    },

    /** Init Data */
    initData: function () {

    },

    /* 유효성 컬럼 색상표시 */
    cellclass_validYn: function(row, column, value, data) {
        return (data !== undefined && (data.validYn || 'N') == 'Y')? 'valid' : 'invalid';
    },

    /* check validation */
    validation: function (data, type) {
        var orgValidYn = data.validYn;
        try {
            var _isValid = true;
            if ((data.subName || '').isBlank()) {
                _isValid = false;
            }
            if ((data.ip || '').isBlank() || !data.ip.isIPv4()) {
                _isValid = false;
            }
            if (data.subMaskNo == 0 || data.subMaskNo == '') {
                _isValid = false;
            }
            var newValidYn = _isValid ? 'Y' : 'N';
            if (orgValidYn != newValidYn) {
                if (type == null || type != 1)
                {
                    data.validYn = newValidYn;
                    $p_grid.jqxGrid('refreshdata');
                }
            }
        } catch (e) {
            console.log(e);
        }
    },

    /* 저장 */
    save: function () {
        try {
            HmGrid.endRowEdit($p_grid);
            $('#devAddMultiLoader').jqxLoader('open');

            var rows = $p_grid.jqxGrid('getrows').filter(function (d) {
                return (d.validYn || 'N') == 'Y';
            });
            if (rows.length == 0) {
                alert('유효성을 통과한 데이터가 없습니다.');
                $('#devAddMultiLoader').jqxLoader('close');
                return;
            }

            var grpItem = HmTreeGrid.getSelectedItem($('#p_grpTreeGrid'));
            if(grpItem == null) {
                alert('그룹을 선택하세요.');
                return;
            }
            var _grpNo = grpItem.grpNo;

            if(!confirm('[{0}]그룹에 {1}건의 서브넷을 추가하시겠습니까?'.substitute(grpItem.grpName, rows.length))) return;

            Server.post('/main/env/grpMgmt/addSubnetMulti.do', {
                data: {list: rows, grpNo: _grpNo},
                success: function (result) {
                    $('#devAddMultiLoader').jqxLoader('close');
                    $p_grid.jqxGrid('deleterow', rows.map(function(d) { return d.uid}));
                    window.opener.Main.searchSubnet();
                    alert('추가되었습니다.');
                },
                error: function(err){
                    $('#devAddMultiLoader').jqxLoader('close');
                }
            });
        } catch(e) {
            console.log(e);
        } finally {
            $('#devAddMultiLoader').jqxLoader('close');
        }
    },
    
    /** 엑셀 업로드 */
    uploadExcel: function(){
    	$.post(ctxPath + '/main/popup/env/pDevAddMultiExcel.do', function(result) {
			HmWindow.open($('#pwindow'), '엑셀 업로드', result, 480, 125, 'pwindow_init' );
		});
    }, 
    /** 템플릿 다운로드 */
    downTemplate: function(){
    	var url = ctxPath+'/export/NETIS_DEV_FORMAT.xlsx';
    	window.open(url);
    }

};
