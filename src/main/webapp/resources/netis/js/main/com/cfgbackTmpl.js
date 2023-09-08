var $tmplGrid, $cmdGrid;

var Main = {
		/** variable */
		initVariable: function() {
            $tmplGrid = $('#tmplGrid'), $cmdGrid = $('#cmdGrid');
		},

		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},

		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
				case 'btnSearch_tmpl': this.searchTmpl(); break;
				case 'btnAdd_tmpl': this.addTmpl(); break;
				case 'btnEdit_tmpl': this.editTmpl(); break;
				case 'btnDel_tmpl': this.delTmpl(); break;
                case 'btnSearch_cmd': this.searchCmd(); break;
				case 'btnAdd_cmd': this.addCmd(); break;
				case 'btnEdit_cmd': this.editCmd(); break;
				case 'btnDel_cmd': this.delCmd(); break;
			}
		},

		/** init design */
		initDesign: function() {

			HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

            HmGrid.create($tmplGrid, {
                source: new $.jqx.dataAdapter(
                    {
                        datatype: 'json',
						contenttype: 'application/json',
						type: 'post',
						datafields:[
							{ name:'tmplNo', type:'string' },
							{ name:'tmplNm', type:'string' },
							{ name:'vendor', type:'string' },
							{ name:'loginFormat', type:'string' },
							{ name:'pwdFormat', type:'string' },
							{ name:'endChar', type:'string' },
							{ name:'enPwdFormat', type:'string' },
							{ name:'enEndChar', type:'string' },
							{ name:'timeout', type:'string' },
							{ name:'enStr', type:'string' },
							{ name:'modifyDate', type:'string' }
						]
                    },
                    {
                        formatData: function(data) {
                            return JSON.stringify(data);
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
					{ text : '템플릿번호', datafield: 'tmplNo', width: 100, editable: false, hidden: true },
					{ text : '템플릿명', datafield: 'tmplNm', minwidth: 180, editable: false},
					{ text : '제조사', datafield: 'vendor', width: 180, editable: false },
                    { text : 'Login형식', datafield: 'loginFormat', width: 180, editable: false },
                    { text : 'Password형식', datafield: 'pwdFormat', width: 180, editable: false },
                    { text : '완료문자', datafield: 'endChar', width: 180, editable: false },
					{ text : 'Timeout', datafield: 'timeout', width: 180, editable: false },
					{ text : 'En Command', datafield: 'enStr', width: 180, editable: false },
					{ text : 'En Password형식', datafield: 'enPwdFormat', width: 180, editable: false },
					{ text : 'En 완료문자', datafield: 'enEndChar', width: 180, editable: false },
					{ text : '변경일시', datafield: 'modifyDate', width: 180, editable: false, cellsalign: 'center' }
				]
            });
            $tmplGrid.on('rowselect', function(event){
                setTimeout(Main.searchCmd, 100);
            });

            HmGrid.create($cmdGrid, {
                source: new $.jqx.dataAdapter(
                    {
                        datatype: 'json',
                        contenttype: 'application/json',
                        type: 'post',
						datafields:[
                            { name:'tmplNo', type:'string' },
                            { name:'cmdNo', type:'string' },
                            { name:'commandFlag', type:'string' },
                            { name:'disCommandFlag', type:'string' },
                            { name:'command', type:'string' },
                            { name:'moreFormat', type:'string' },
                            { name:'commandDesc', type:'string' },
                            { name:'modifyDate', type:'string' },
                            { name:'withoutPauseCommand', type:'string' },
						]
                    },
                    {
                        formatData: function(data) {
							var tmpldata = HmGrid.getRowData($tmplGrid);
							data.tmplNo = tmpldata != null? tmpldata.tmplNo : -1;
                        	return JSON.stringify(data);
                        }
                    }
                ),
                showtoolbar: true,
                rendertoolbar: function(toolbar) {
                    HmGrid.titlerenderer(toolbar, '템플릿 명령어 설정');
                },
                editmode: 'selectedrow',
                columns:
                    [
                        { text : '템플릿번호', datafield: 'tmplNo', width: 100, editable: false, hidden: true },
                        { text : '명령어번호', datafield: 'cmdNo', width: 100, editable: false, hidden: true },
                        { text : 'Command 종류', datafield: 'commandFlag', displayfield: 'disCommandFlag', width: 180, editable: false },
                        { text : '진행 문자열', datafield: 'moreFormat', width: 180, editable: false },
                        { text : 'Terminal Length Zero Command', datafield: 'withoutPauseCommand', width: 180, editable: false },
						{ text : 'Command', datafield: 'command', minwidth: 180, editable: false },
                        // { text : 'More format', datafield: 'moreFormat', minwidth: 180, editable: false, hidden: true },
						{ text : 'Command 설명', datafield: 'commandDesc', width: 250, editable: false },
                        { text : '변경일시', datafield: 'modifyDate', width: 180, editable: false, cellsalign: 'center' }
                    ]
            });
		},

		/** init data */
		initData: function() {
			this.searchTmpl();
		},

		/** OID TMPL */
		addTmpl: function() {
			$.post(ctxPath + '/main/popup/com/pCfgbackTmplAdd.do', function(result) {
                 HmWindow.openFit($('#pwindow'), '템플릿 추가', result, 400, 310, 'pwindow_init', {});
			});
		},

		editTmpl: function() {
			var rowdata = HmGrid.getRowData($tmplGrid);
			if(rowdata == null){
				alert('템플릿을 선택하세요.');
				return;
			}

			$.post(ctxPath + '/main/popup/com/pCfgbackTmplEdit.do',
                    rowdata,
                    function(result) {
                        HmWindow.openFit($('#pwindow'), '템플릿 수정', result, 400, 310, 'pwindow_init', rowdata);
                    }
                );
		},

		delTmpl: function() {
            var rowdata = HmGrid.getRowData($tmplGrid);
            if(rowdata == null){
                alert('템플릿을 선택하세요.');
                return;
            }
			if(!confirm('[{0}] 템플릿을 삭제하시겠습니까?'.substitute(rowdata.tmplNm))) return;

			Server.post('/main/com/cfgbackTmpl/delCfgbackTmpl.do', {
				data: rowdata,
				success: function(result) {
					$tmplGrid.jqxGrid('deleterow', rowdata.uid);
					alert('삭제되었습니다.');
				}
			});
		},


		/** Command */
		addCmd: function() {
            var rowdata = HmGrid.getRowData($tmplGrid);
            if(rowdata == null){
                alert('템플릿을 선택하세요.');
                return;
            }

			$.post(ctxPath + '/main/popup/com/pCfgbackTmplCmdAdd.do',
				rowdata,
				function(result) {
					HmWindow.open($('#pwindow'), '템플릿 명령어 추가', result, 600, 455, 'pwindow_init', rowdata);
				}
			);
		},

		editCmd: function() {
            var rowdata = HmGrid.getRowData($cmdGrid);
            if(rowdata == null){
                alert('명령어를 선택하세요.');
                return;
            }
			
			$.post(ctxPath + '/main/popup/com/pCfgbackTmplCmdEdit.do',
				rowdata,
				function(result) {
					HmWindow.open($('#pwindow'), '템플릿 명령어 수정', result, 600, 455, 'pwindow_init', rowdata);
				}
			);
		},

		delCmd: function() {
            var rowdata = HmGrid.getRowData($cmdGrid);
            if(rowdata == null){
                alert('명령어를 선택하세요.');
                return;
            }
            if(!confirm('선택된 명령어를 삭제하시겠습니까?')) return;

            Server.post('/main/com/cfgbackTmpl/delCfgbackTmplCmd.do', {
                data: rowdata,
                success: function(result) {
                    $cmdGrid.jqxGrid('deleterow', rowdata.uid);
                    alert('삭제되었습니다.');
                }
            });
		},

    	/** 조회 */
		searchTmpl: function() {
			HmGrid.updateBoundData($tmplGrid, ctxPath + '/main/com/cfgbackTmpl/getCfgbackTmplList.do');
		},
		searchCmd: function() {
			HmGrid.updateBoundData($cmdGrid, ctxPath + '/main/com/cfgbackTmpl/getCfgbackTmplCmdList.do');
		}
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});