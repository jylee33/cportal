
var SlaCodeMgmt = function() {
    this.infoGrid = null;
    this.editIds = [];
};

SlaCodeMgmt.prototype = function() {

    /** variable */
	var initVariable = function() {

	    console.log("main/ initVariable");

	    this.infoGrid = $('#infoGrid');

	};

	/** add event */
	var observe = function() {
	    $('#contents button').bind('click', eventControl.bind(this));
		$('#contents .searchBox input:text').bind('keyup', keyupEventControl.bind(this));
	};

	/** event handler */
	var eventControl = function(event) {

	    var curTarget = event.currentTarget;

		switch (curTarget.id) {
            case 'btnSearch': search.call(this); break;
            case 'btnAdd': add.call(this); break;
            case 'btnEdit': edit.call(this); break;
		}

	};
	
	/** keyup event handler */
	var keyupEventControl = function(event) {

		if(event.keyCode == 13) {
			search();
		}

	};

	/** init design */
	var initDesign = function() {

	    console.log("main/slaCodeMgmt");

		HmGrid.create(this.infoGrid, {
		    source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'post',
                    contentType: 'application/json',
                    datafields:[
                        {name: 'cdKind', type:'string'},
                        {name: 'cdId', type:'int'},
                        {name:'cdNm', type:'string'},
                        {name:'cdUseYn', type:'string'},
                        {name:'cdDesc', type:'string'},
                        {name:'cdVal1', type:'string'},
                        {name: 'cdVal2', type:'string'},
                        {name: 'cdVal3', type:'string'},
                        {name: 'cdVal4', type:'string'},
                        {name: 'disCdVal2', type:'string'}
                    ]
                },
                {
                    formatData: function(data) {
                        data.cdKind = $('#sCodeKind').val();
                        return JSON.stringify(data);
                    }
                }
            ),
            pagerheight: 27,
            pagerrenderer : HmGrid.pagerrenderer,
		    columns: []
        });

        // 검색조건
        var _this = this;

        HmDropDownList.create($('#sCodeKind'), {
            source: [
                {label: '통신사업자', value: 'ISP_CD'},
                {label: '이용요금', value: 'SPEED_AMT_CD'},
                {label: '할인코드', value: 'DISCOUNT_CD'}
            ], width: 250
        })
            .on('change', function() {
                setGridColumns.call(_this);
                search.call(_this);
            });

    };

	/** init data */
	var initData = function() {

        setTimeout(function() {
            $('#sCodeKind').jqxDropDownList('selectIndex', 0 );
        }, 300);

	};

	/** 코드 그리드 컬럼 생성 */
	var setGridColumns = function() {
	    var _codeKind = $('#sCodeKind').val();
	    var _columns = [
            {text: '분류', datafield: 'cdKind', width: 150, cellsalign: 'center'},
            {text: '코드ID', datafield: 'cdId', width: 100, cellsalign: 'right'},
            {text: '코드', datafield: 'cdNm', width: 200},
            {text: '사용', datafield: 'cdUseYn', width: 100, columntype: 'checkbox'},
            {text: '코드 설명', datafield: 'cdDesc', width: 250}
        ];

	    if(_codeKind == 'ISP_CD') {
            _columns.splice(3, 0,
                {text: '통신사',    datafield: 'cdVal1',  width: 200})
            _columns[2].text = '코드명(통신사)';
        } else if(_codeKind == 'SPEED_AMT_CD') {

	        console.log("main");
            _columns.splice(3, 0,
                {text: '통신사', datafield: 'cdVal1',  displayfield: 'disCdVal2', width: 200},
                {text: '계약대역폭', datafield: 'cdVal2', width: 200, cellsrenderer: HmGrid.unit1000renderer},
                {text: '이용요금(전용회선)', datafield: 'cdVal3', width: 200, cellsrenderer: HmGrid.commaNumrenderer},
                {text: '이용요금(인터넷회선)', datafield: 'cdVal4', width: 200, cellsrenderer: HmGrid.commaNumrenderer});
        } else if(_codeKind == 'DISCOUNT_CD') {
            _columns[2].text = '코드명(할인명)';
            _columns.splice(3, 0,
                {text: '통신사', datafield: 'cdVal1', displayfield: 'disCdVal1', width: 200},
                {text: '할인코드', datafield: 'cdVal2', width: 200, cellsalign: 'center'},
                {text: '할인율(%)', datafield: 'cdVal3', width: 200, cellsalign: 'right'});
        }

        $.each(_columns, function(i,v) {
            v.align = 'center';
        });
        this.infoGrid.jqxGrid('beginupdate');
	    this.infoGrid.jqxGrid({columns: _columns});
        this.infoGrid.jqxGrid('endupdate');
    };

	/** 조회 */
	var search = function() {

	    console.log("main slaCOdeMgmt : search");

	    HmGrid.updateBoundData(this.infoGrid, ctxPath + '/main/sla/slaMgmt/getSlaCodeList.do');

	};

    /** 추가 */
	var add = function() {
	    var _cdKind = $('#sCodeKind').val();
	    if(_cdKind.isBlank()) {
	        alert('분류를 선택하세요.');
            $('#sCodeKind').focus();
	        return;
        }
        var params = {
            action: 'A',
            cdKind: _cdKind,
            callbackFn: 'callback'
        };
        if(_cdKind == 'ISP_CD') {

            $.post(ctxPath + '/main/popup/sla/pSlaCode_ispCd.do',
                params,
                function(result) {
                    HmWindow.open($('#pwindow'), '통신사 추가', result, 400, 234, 'pwindow_init', params);
                }
            );

        }
        else if(_cdKind == 'SPEED_AMT_CD') {

            $.post(ctxPath + '/main/popup/sla/pSlaCode_speedAmtCd.do',
                params,
                function(result) {
                    HmWindow.open($('#pwindow'), '이용요금 추가', result, 400, 290, 'pwindow_init', params);
                }
            );

        }
        else if(_cdKind == 'DISCOUNT_CD') {
            $.post(ctxPath + '/main/popup/sla/pSlaCode_discountCd.do',
                params,
                function(result) {
                    HmWindow.open($('#pwindow'), '할인코드 추가', result, 400, 290, 'pwindow_init', params);
                }
            );
        }
	};

    /** 수정 */
	var edit = function() {

        var row = HmGrid.getRowData(this.infoGrid);

        if(row == null) {
            alert('데이터를 선택하세요.');
            return;
        }

        var _cdKind = $('#sCodeKind').val();

        var params = {
            action : 'U',
            cdKind: row.cdKind,
            cdId: row.cdId,
            callbackFn: 'callback'
        };

        if(_cdKind == 'ISP_CD') {

            $.post(ctxPath + '/main/popup/sla/pSlaCode_ispCd.do',
                params,
                function(result) {
                    HmWindow.open($('#pwindow'), '통신사 수정', result, 400, 234, 'pwindow_init', params);
                }
            );

        }
        else if(_cdKind == 'SPEED_AMT_CD') {

            $.post(ctxPath + '/main/popup/sla/pSlaCode_speedAmtCd.do',
                params,
                function(result) {
                    HmWindow.open($('#pwindow'), '이용요금 수정', result, 400, 290, 'pwindow_init', params);
                }
            );

        }
        else if(_cdKind == 'DISCOUNT_CD') {
            $.post(ctxPath + '/main/popup/sla/pSlaCode_discountCd.do',
                params,
                function(result) {
                    HmWindow.open($('#pwindow'), '할인코드 수정', result, 400, 290, 'pwindow_init', params);
                }
            );
        }
	};

	var save = function() {
        HmGrid.endCellEdit(this.infoGrid);
        if(this.editIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }

        var _list = [];
        var _this = this;
        $.each(this.editIds, function(i,v) {
            _list.push(_this.infoGrid.jqxGrid('getrowdatabyid', v));
        });
        Server.post('/main/sla/slaMgmt/saveSlaIf.do', {
            data: { list: _list },
            success: function(result) {
                alert('저장되었습니다.');
                _this.editIds.length = 0;
            }
        });
    };

    return {
        initVariable: initVariable,
        observe: observe,
        initDesign: initDesign,
        initData: initData,
        search: search
    }

}();

var slaCodeMgmt = new SlaCodeMgmt();
slaCodeMgmt.initVariable();
slaCodeMgmt.observe();
slaCodeMgmt.initData();
slaCodeMgmt.initDesign();

function callback(fn, params) {
    var fn = slaCodeMgmt[fn];
    if(typeof fn === 'function') {
        if(params === undefined) fn.call(slaCodeMgmt);
        else fn.call(slaCodeMgmt, params);
    }
}