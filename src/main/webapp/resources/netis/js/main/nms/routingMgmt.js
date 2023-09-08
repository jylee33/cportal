var $histGrid, $termGrid;
var dtl_mngNo = -1;

var Main = {
    /** variable */
    initVariable: function() {
        $histGrid = $('#histGrid');
        $termGrid = $('#termGrid');
        this.initCondition();
    },

    initCondition: function() {
        // 기간
        HmBoxCondition.createPeriod('');
        $("input:radio[name=sPeriod]").eq(3).click();
        // radio 조건
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_dev_srch_type'));
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
        $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnSearch': this.searchHist(); break;
            case 'btnExcel': this.exportExcel(); break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function(event) {
        if(event.keyCode == 13) {
            Main.searchHist();
        }
    },

    /** init design */
    initDesign: function() {
        Master.createGrpTab(Main.searchHist);
        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

        $('#btnWord').click(Main.exportConfig);
        $('#btnDiff').click(Main.diffChar);

        HmGrid.create($termGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'array',
                    localdata: [],
                    datafields: [
                        {name: 'term', type: 'string'}
                    ]
                }
            ),
            pageable: false,
            columns:
                [
                    { text : '기간', datafield : 'term', minwidth : 100, cellsalign:'center' }
                ]
        }, CtxMenu.NONE);
        $termGrid.on('rowdoubleclick', function(event) {
            Main.displayDevRoutingContent();
        }).on('bindingcomplete', function (event) {
            $termGrid.jqxGrid('selectrow', 0);
            Main.displayDevRoutingContent();
        });

        HmGrid.create($histGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        { name: 'grpName', type: 'string' },
                        { name: 'mngNo', type: 'number' },
                        { name: 'grpNo', type: 'number' },
                        { name: 'devName', type: 'string' },
                        { name: 'devIp', type: 'string' },
                        { name: 'devKind1', type: 'string' },
                        { name: 'devKind2', type: 'string' },
                        { name: 'model', type: 'string' },
                        { name: 'vendor', type: 'string' },
                        { name: 'isChange', type: 'string' },
                        { name: 'changeCnt', type: 'number' },
                        { name: 'changeDate', type: 'string' },
                        { name: 'compareDate', type: 'string' }
                    ]
                },
                {
                    formatData: function(data) {
                        $.extend(data, Main.getCommParams());
                        return data;
                    },
                    beforeLoadComplete: function(records) {
                        if(records) {
                            $.each(records, function(i, v) {
                                v.disIsChange = v.isChange == 1? 'Y' : 'N';
                            });
                        }
                        return records;
                    },
                    loadComplete: function(records) {
                        dtl_mngNo = -1;
                    }
                }
            ),
            pagerheight: 27,
            pagerrenderer : HmGrid.pagerrenderer,
            columns:
                [
                    { text : '그룹명', datafield : 'grpName', width : 150 },
                    { text : '장비명', datafield : 'devName', minwidth : 150, cellsrenderer: HmGrid.devNameRenderer },
                    { text : '대표IP', datafield : 'devIp', width : 120 },
                    { text : '타입', datafield : 'devKind1', hidden: true },
                    { text : '종류', datafield : 'devKind2', width : 130 },
                    { text : '제조사', datafield : 'vendor', width : 130 },
                    { text : '모델', datafield : 'model', width : 180 },
                    { text : '변경', datafield : 'isChange', displayfield: 'disIsChange', width : 100, cellsalign: 'center' },
                    { text : '변경횟수', datafield : 'changeCnt', width : 100, cellsalign: 'right', filtertype:'number' },
                    { text : '변경일시', datafield : 'changeDate', width : 150, cellsalign: 'center' },
                    { text : '이전 변경일시', datafield : 'compareDate', width : 150, cellsalign: 'center' },
                    { text : '장비번호', datafield: 'mngNo', width: 80, hidden: true },
                    { text : '그룹번호', datafield: 'grpNo', width: 80, hidden: true }
                ]
        }, CtxMenu.NONE);
        $histGrid.on('rowdoubleclick', function(event) {
            dtl_mngNo = event.args.row.bounddata.mngNo;
            Main.searchDevRoutingDate();
        })
            .on('contextmenu', function(event) {
                return false;
            })
            .on('rowclick', function(event) {
                if(event.args.rightclick) {
                    $histGrid.jqxGrid('selectrow', event.args.rowindex);
                    var rowIdxes = HmGrid.getRowIdxes($histGrid, '장비를 선택해주세요.');

                    var scrollTop = $(window).scrollTop();
                    var scrollLeft = $(window).scrollLeft();
                    $('#ctxmenu_syslog').jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
                        parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                    return false;
                }
            });

        $('#ctxmenu_syslog').jqxMenu({ width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme })
            .on('itemclick', function(event) {
                Main.selectSyslogCtxmenu(event);
            });

        $('#section').css('display', 'block');
    },

    /** init data */
    initData: function() {

    },

    getCommParams: function() {
        var params = Master.getGrpTabParams();
        $.extend(params, HmBoxCondition.getPeriodParams(), HmBoxCondition.getSrchParams());
        return params;
    },

    /** 이력 조회 */
    searchHist: function() {
        Main.clearRoutingDtl();
        HmGrid.updateBoundData($histGrid, ctxPath + '/main/nms/routingMgmt/getDevRoutingList.do');
    },

    /** 장비Config */
    clearRoutingDtl: function() {
        $termGrid.jqxGrid('clear');
        $('#txtRouting1').empty();
    },

    searchDevRoutingDate: function() {
        this.clearRoutingDtl();
        var ridx = HmGrid.getRowIdx($histGrid);
        if(ridx === false) return;
        Server.get('/main/nms/routingMgmt/getDevRoutingDateList.do', {
            data: { mngNo: $histGrid.jqxGrid('getrowdata', ridx).mngNo },
            success: function(data) {
                var bindData = [];
                for (var i = 0; i < data.length; i++) {
                    var row = {};
                    row['term'] = data[i];
                    bindData[i] = row;
                }

                var adapter = $termGrid.jqxGrid('source');
                adapter._source.localdata = bindData;
                $termGrid.jqxGrid('updateBoundData');
            }
        })
    },

    displayDevRoutingContent: function() {
        var rowIdxes = HmGrid.getRowIdxes($termGrid);
        if (rowIdxes === false) return;
        rowidx = $termGrid.jqxGrid('getselectedrowindex');
        var content = $termGrid.jqxGrid('getrowdata', rowidx).term;

        $('#txtRouting1').empty();
        var ridx = HmGrid.getRowIdx($histGrid);
        if(ridx === false) return;
        var tmp = content.replace(/\-/g, '').replace(/\:/g, '').replace(/\s/g, '');
        var _configDate = tmp.substring(0, 8);
        var _configTime = tmp.substr(8);
        Server.get('/main/nms/routingMgmt/getDevRoutingContent.do', {
            data: { mngNo: $histGrid.jqxGrid('getrowdata', ridx).mngNo, routingDate: _configDate, routingTime: _configTime },
            success: function(data) {
                $('#txtRouting1').html(data);
            }
        })
    },


    /** export Excel */
    exportExcel: function() {
        HmUtil.exportGrid($histGrid, 'Routing관리', false);
    },

    exportConfig: function(){
//			saveTextAsFile(fileNameToSaveAs, textToWrite) {
        /* Saves a text string as a blob file*/
        try{
            var fname = 'routing'+$.format.date(new Date(), 'yyyyMMddHHmmssSSS') + '.txt';
            var elHtml = document.getElementById('txtRouting1').innerHTML;

            var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
                ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
                ieEDGE = navigator.userAgent.match(/Edge/g),
                ieVer=(ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));

            if (ie && ieVer<10) {
                console.log("No blobs on IE ver<10");
                alert("IE는 브라우저 버전이 10 이상이여야 합니다.");
                return;
            }

            var textFileAsBlob = new Blob([elHtml], {
                type: 'text/html'
            });

            if (ieVer>-1) {
                window.navigator.msSaveBlob(textFileAsBlob, fname);
            } else {
                var downloadLink = document.createElement("a");
                downloadLink.download = fname;
                downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                downloadLink.onclick = function(e) { document.body.removeChild(e.target); };
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
                downloadLink.click();
            }
        }catch(err){
            console.log(err);
        }
    },

    /** 문자열비교 */
    diffChar: function() {
        if(dtl_mngNo == -1){
            alert('비교할  내용이 없습니다.');
            return;
        }
        var params = {
            mngNo: dtl_mngNo,
            cmdKind: 2
        };
        HmUtil.createFullPopup('/main/popup/nms/pCharDiff.do', $('#hForm'), 'pCharDiff', params);
    },

    /** ContextMenu */
    selectSyslogCtxmenu: function(event) {
        switch($(event.args)[0].id) {
            case 'cm_chgBackup':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($histGrid, '장비를 선택해주세요.');
                    if(rowIdxes === false) return;
                    if(!confirm('ConfigBackup 엔진을 가동하시겠습니까?')) return;
                    var _mngNos = [];
                    var _devIps = []; // 변경관리 엔진이 장비하나 선택-우클릭시에만 나온다는 가정하에.
                    $.each(rowIdxes, function(idx, value) {
                        var oneDt = $histGrid.jqxGrid('getrowdata', value);
                        _mngNos.push(oneDt.mngNo);
                        _devIps.push(oneDt.devIp);
                    });
                    var params = {
                        mngNos: _mngNos.join(','),
                        devIps: _devIps.join(',')
                    };

                    //엔진구동
                    var devConfloader = $('#pDevConfLoader');
                    if(devConfloader.length <= 0) {
                        devConfloader = $('<div id="pDevConfLoader" style="z-index: 100000"></div>');
                        devConfloader.appendTo('body');
                    }
                    devConfloader.jqxLoader({ isModal: false, width: 350, height: 80, theme: jqxTheme, text: 'Config Back 엔진을 호출중입니다. 잠시만 기다려주세요.' });
                    devConfloader.jqxLoader('open');
                    Server.post('/main/env/devMgmt/execRoutingCfgBackEngine.do', {
                        data: params,
                        success: function(result, send_data) {
                            devConfloader.jqxLoader('close');
                            alert(result);
                            //						if(result.indexOf("실패")==-1) // 실행결과 실패 아니면 config 결과창 띄움
//								Main.showDevConfigLog(send_data, result);
                        },
                        error: function() {
                            devConfloader.jqxLoader('close');
                        }
                    });
                } catch(e) {console.log(e);}
                break;
            case 'cm_filter':
                $histGrid.jqxGrid('beginupdate');
                if($histGrid.jqxGrid('filterable') === false) {
                    $histGrid.jqxGrid({ filterable: true });
                }
                setTimeout(function() {
                    $histGrid.jqxGrid({showfilterrow: !$histGrid.jqxGrid('showfilterrow')});
                }, 300);
                $histGrid.jqxGrid('endupdate');
                break;
            case 'cm_filterReset':
                $histGrid.jqxGrid('clearfilters');
                break;
            case 'cm_colsMgr':
                $.post(ctxPath + '/main/popup/comm/pGridColsMgr.do',
                    function(result) {
                        HmWindow.open($('#pwindow'), '컬럼 관리', result, 300, 400, 'pwindow_init', $histGrid);
                    }
                );
                break;
        }
    }
};


$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});