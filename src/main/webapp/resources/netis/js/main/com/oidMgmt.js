var $vendorGrid, $oidTmplGrid, $oidInfoGrid;
var _tmplNo = -1;
var Main = {
		/** variable */
		initVariable: function() {
            $vendorGrid = $('#vendorGrid');
            $oidTmplGrid = $('#oidTmplGrid');
            $oidInfoGrid = $('#oidInfoGrid');
		},

		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},

		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnAdd_oidTmpl': this.addOidTmpl(); break;
			case 'btnEdit_oidTmpl': this.editOidTmpl(); break;
			case 'btnDel_oidTmpl': this.delOidTmpl(); break;
			case 'btnAdd_oidInfo': this.addOidInfo(); break;
			case 'btnEdit_oidInfo': this.editOidInfo(); break;
			case 'btnDel_oidInfo': this.delOidInfo(); break;
			case 'btnDel_itemTypeMgmt': this.itemTypeMgmt(); break;
			}
		},

		/** init design */
		initDesign: function() {
			HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

			HmWindow.create($('#pwindow'), 100, 100);

            HmGrid.create($oidTmplGrid, {
                source: new $.jqx.dataAdapter(
                    {
                        datatype: 'json',
						datafields:[
                            { name:'tmplNo', type:'string' },
                            { name:'tmplNm', type:'string' },
                            { name:'vendor', type:'string' },
                            { name:'model', type:'string' },
                            { name:'modifyDate', type:'string' },
						]
                    },
                    {
                        formatData: function(data) {
                            return data;
                        }
                    }
                ),
                showtoolbar: true,
                rendertoolbar: function(toolbar) {
                    HmGrid.titlerenderer(toolbar, '템플릿 설정');
                },
                editmode: 'selectedrow',
                columns:
                    [
                        { text : '템플릿번호', datafield: 'tmplNo', width: 180, editable: false, hidden: true },
                        { text : '템플릿명', datafield: 'tmplNm', minwidth: 180, editable: false},
                        { text : '제조사', datafield: 'vendor', minwidth: 180, editable: false, filtertype: 'checkedlist' },
                        { text : '모델', datafield: 'model', minwidth: 180, editable: false, filtertype: 'checkedlist' },
                        { text : '변경일시', datafield: 'modifyDate', width: 180, editable: false, cellsalign: 'center' }
                    ]
            });
            $oidTmplGrid.on('rowdoubleclick', function(event){
                Main.searchOidInfo();
            });

            HmGrid.create($oidInfoGrid, {
                source: new $.jqx.dataAdapter(
                    {
                        datatype: 'json'
                    },
                    {
                        formatData: function(data) {
                            var rowIdx = HmGrid.getRowIdx($oidTmplGrid);
                            data.tmplNo = rowIdx === false? 0 : $oidTmplGrid.jqxGrid('getrowdata', rowIdx).tmplNo;
                            return data;
                        }
                    }
                ),
                showtoolbar: true,
                rendertoolbar: function(toolbar) {
                    HmGrid.titlerenderer(toolbar, 'OID 설정');
                },
                editmode: 'selectedrow',
                columns:
                    [
                        { text : '템플릿번호', datafield: 'tmplNo', width: 120, hidden: true },
                        { text : '구분', datafield: 'itemType', displayfield: 'disItemType', width: 100 },
                        { text : '세부지표', datafield: 'itemTypeCond', displayfield: 'disItemTypeCond', width: 200 },
                        { text : '항목명', datafield: 'oidNm', minwidth: 150 },
                        { text : '사용자 정의 명칭 유무', datafield: 'useOidNmFlag', width: 160, cellsalign: 'center'},
                        { text : 'OID 종류', datafield: 'oidType', displayfield: 'disOidType', width: 100, cellsalign: 'center'},
                        { text : 'PDU', datafield: 'pduType', width: 80,  cellsalign: 'center'},
                        { text : 'OID', datafield: 'oid', width: 200 },
                        { text : 'SUB OID', datafield: 'subOid', width: 200 },
                        { text : 'OID IDX', datafield: 'idxValType', displayfield: 'disIdxValType', width: 200 },
                        { text : '표현식', datafield: 'expression', width: 300, cellsrenderer: HmGrid.cellHtmlCharacterUnescapes },
                        { text : '변경일시', datafield: 'modifyDate', width: 140, cellsalign: 'center' },
                        { text : 'SUB OID 사용 유무', datafield: 'useSubOidFlag', width: 80, hidden: true },
                        { text : '연결지표', datafield: 'moduleTmplOidSeq', width: 180, hidden: true },
						{ text : 'tmplOidSeq', datafield: 'tmplOidSeq', width: 180, hidden: true },
                    ]
            });
            Main.searchOidTmpl();
		},

		/** init data */
		initData: function() {

		},

		/** OID TMPL */
		addOidTmpl: function() {
			$.get(ctxPath + '/main/popup/com/pComOidTmplAdd.do', function(result) {
				 params = {};
                 HmWindow.openFit($('#pwindow'), '템플릿 등록', result, 300, 200, 'pwindow_init', params);
			});
            var data = {}
            var rowIdx = HmGrid.getRowIdx($oidTmplGrid);
            data.tmplNo = rowIdx === false? 0 : $oidTmplGrid.jqxGrid('getrowdata', rowIdx).tmplNo;

            Server.get('/main/com/oidMgmt/getOidInfoList.do', {
                data: data,
                success: function (result) {
                    console.log('result',result)
                }
            })
		},

		editOidTmpl: function() {
			var rowIdx = HmGrid.getRowIdx($oidTmplGrid);
			if(rowIdx === false){
				alert('템플릿을 선택하세요.');
				return;
			}
			var oidData = $oidTmplGrid.jqxGrid('getrowdata', rowIdx);
			var params ={
					tmplNo : oidData.tmplNo,
					tmplNm: oidData.tmplNm,
					vendor : oidData.vendor,
					model : oidData.model
			};
			$.post(ctxPath + '/main/popup/com/pComOidTmplEdit.do',
                    params,
                    function(result) {
                        HmWindow.openFit($('#pwindow'), '템플릿 수정', result, 300, 200, 'pwindow_init', params);
                    }
                );
		},

		delOidTmpl: function() {
			var rowIdx = HmGrid.getRowIdx($oidTmplGrid, '데이터를 선택해주세요.');
			if(rowIdx === false) return;
			if(!confirm('선택된 데이터를 삭제하시겠습니까?')) return;

			var rowdata = $oidTmplGrid.jqxGrid('getrowdata', rowIdx);
			Server.post('/main/com/oidMgmt/delOidTmpl.do', {
				data: rowdata,
				success: function(result) {
					$oidTmplGrid.jqxGrid('deleterow', $oidTmplGrid.jqxGrid('getrowid', rowIdx));
					alert('삭제되었습니다.');
				}
			});
		},

		/** OID INFO TMPL */
		addOidInfo: function() {
            var rowIdx = HmGrid.getRowIdx($oidTmplGrid);
            if(rowIdx === false){
                alert('템플릿을 선택하세요.');
                return;
            }
            var tmplData = $oidTmplGrid.jqxGrid('getrowdata', rowIdx);
            var params ={
                tmplNo : tmplData.tmplNo
            };

			$.get(ctxPath + '/main/popup/com/pComOidInfoAdd.do', function(result) {
				HmWindow.open($('#pwindow'), 'OID 등록', result, 350, 470, 'pwindow_init', params);
			});
		},

		editOidInfo: function() {
			var rowIdx = HmGrid.getRowIdx($oidInfoGrid);
			if(rowIdx === false){
				alert('OID를 선택하세요.');
				return;
			}
			var oidData = $oidInfoGrid.jqxGrid('getrowdata', rowIdx);
			var params ={
                tmplOidSeq : oidData.tmplOidSeq,
				tmplNo : oidData.tmplNo,
				itemType: oidData.itemType,
				oidType: oidData.oidType,
				oidNm: oidData.oidNm,
				pduType: oidData.pduType,
				oid: oidData.oid,
                useSubOidFlag: oidData.useSubOidFlag,
                idxValType: oidData.idxValType,
                subOid: oidData.subOid,
				useOidNmFlag: oidData.useOidNmFlag,
                moduleTmplOidSeq: oidData.moduleTmplOidSeq,
                itemTypeCond: oidData.itemTypeCond,
                disItemTypeCond: oidData.disItemTypeCond,
				expression: oidData.expression
			};
			$.post(ctxPath + '/main/popup/com/pComOidInfoEdit.do',
				params,
				function(result) {
					HmWindow.open($('#pwindow'), 'OID 수정', result, 350, 470, 'pwindow_init', params);
				}
			);
		},

		delOidInfo: function() {
			var rowIdx = HmGrid.getRowIdx($oidInfoGrid, '데이터를 선택해주세요.');
			if(rowIdx === false) return;
			if(!confirm('선택된 데이터를 삭제하시겠습니까?')) return;

			var rowdata = $oidInfoGrid.jqxGrid('getrowdata', rowIdx);
			Server.post('/main/com/oidMgmt/delOidInfo.do', {
				data: rowdata,
				success: function(result) {
                    $oidInfoGrid.jqxGrid('deleterow', $oidInfoGrid.jqxGrid('getrowid', rowIdx));
					alert('삭제되었습니다.');
				}
			});
		},

    	/** 조회 */
		searchOidTmpl: function() {
			HmGrid.updateBoundData($oidTmplGrid, ctxPath + '/main/com/oidMgmt/getOidTmplList.do');
		},
		searchOidInfo: function() {
			HmGrid.updateBoundData($oidInfoGrid, ctxPath + '/main/com/oidMgmt/getOidInfoList.do');
		},


    /** ITEM_TYPE 코드관리  */
    itemTypeMgmt: function() {
    	var params ={ /*codeKind: 'CHGMGR_ITEM_TYPE'*/ };
		$.get(ctxPath + '/main/popup/com/pCodeMgmt.do', function(result) {
			HmWindow.openFit($('#pwindow'), '구분 관리', result, 400, 400, 'pwindow_init', params);
		});
	}
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});