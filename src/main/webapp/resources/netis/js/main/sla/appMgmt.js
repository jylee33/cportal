var Main = {
    contents: null,

	/** variable */
	initVariable : function() {
		this.contents = $('#contents');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
		$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
		$('#leftMenu > li').bind('click', function(event) {Main.eventControl(event);});
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
            case 'btnSearch': this.search(); break;
            case 'btnAdd': this.add(); break;
            case 'btnDel': this.del(); break;
            case 'btnSave': this.save(); break;
            default:
                if(curTarget.id.startsWith('mn_')) {
                    this.chgContents(curTarget.id.replace('mn_','') + '.do');
                }
                break;
		}
	},
	
	/** keyup event handler */
	keyupEventControl: function(event) {
		if(event.keyCode == 13) {
			Main.search();
		}
	},

	/** init design */
	initDesign : function() {
	    $('#splitter').jqxSplitter({width: '100%', height: '100%', orientation: 'vertical', theme: jqxTheme, splitBarSize: 1,
            panels: [{size: 200, collapsable: false}, {size: '100%'}]});

		this.contents.empty();

        $('#section').css('display', 'block');
	},


	/** init data */
	initData: function() {
	    $('#leftMenu > li:first').click();
	},

	/** 조회 */
	search: function() {
	    HmGrid.updateBoundData(Main.infoGrid);
	},

    /** 추가 */
	add: function() {
        var params = {
            dataType: 'IF',
            callbackFn: 'callbackAddTarget',
            addedIds: []
        };
        HmUtil.createPopup(ctxPath + '/hyundaiCar/popup/nms/pTargetAdd.do', $('#hForm'), 'pTargetAdd', 1000, 600, params);
	},

    /** 삭제 */
	del: function() {
        var rows = HmGrid.getRowDataList(Main.infoGrid);
        if(rows == null) {
            alert('삭제할 데이터를 선택하세요.');
            return;
        }
        if(!confirm('{0}개의 회선을 삭제하시겠습니까?'.substitute(rows.length))) return;
        var delList = [];
        $.each(rows, function(i, v) {
            delList.push({mngNo: v.mngNo, ifIdx: v.ifIdx});
        });

        Server.post('/main/sla/slaMgmt/delSlaIf.do', {
            data: {list: delList},
            success: function(result) {
                var uids = rows.map(function(d) { return d.uid; });
                Main.infoGrid.jqxGrid('deleterow', uids);
                Main.editIds = Main.editIds.filter(function(d) { return $.inArray(d, uids) === -1; });
                alert('삭제되었습니다.');
            }
        });
	},

    save: function() {
        HmGrid.endCellEdit(Main.infoGrid);
        if(Main.editIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }

        var _list = [];
        $.each(Main.editIds, function(i,v) {
            _list.push(Main.infoGrid.jqxGrid('getrowdatabyid', v));
        });

        Server.post('/main/sla/slaMgmt/saveSlaIf.do', {
            data: { list: _list },
            success: function(result) {
                alert('저장되었습니다.');
                Main.editIds.length = 0;
            }
        });
    },

    chgContents: function(pageUrl) {
	    var _url = ctxPath + '/main/sla/subpage/{0}'.substitute(pageUrl);
	    // alert("url : " + _url);
	    this.contents.load(_url, function(result) {
	        // alert(result);
        });
    }

};

$(function() {
	Main.initVariable();
	Main.observe();
    Main.initData();
	Main.initDesign();
});
