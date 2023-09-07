var $monitConfGrid;

var Main = {
    /** variable */
    initVariable: function() {
        $monitConfGrid = $('#monitConfGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnSearch': Main.search(); break;
            case 'btnSvrMgr': Main.showSvrMgr(); break;
        }
    },

    /** init design */
    initDesign: function() {
        $('#tabs').jqxTabs({width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top'});

        HmGrid.create($monitConfGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'post',
                    contenttype: 'application/json;charset=utf8',
                    datafields: [
                        {name: 'name', type: 'string'},
                        {name: 'status', type: 'string'},
                        {name: 'uptime', type: 'number'},
                        {name: 'cpu_percent', type: 'number'},
                        {name: 'cpu_percenttotal', type: 'number'},
                        {name: 'memory_percent', type: 'number'},
                        {name: 'memory_percenttotal', type: 'number'},
                        {name: 'memory_kilobyte', type: 'number'},
                        {name: 'memory_kilobytetotal', type: 'number'},
                        {name: 'read_count', type: 'string'},
                        {name: 'read_total', type: 'string'},
                        {name: 'write_count', type: 'string'},
                        {name: 'write_total', type: 'string'},
                        {name: 'monitor', type: 'string'},
                        {name: 'monitormode', type: 'string'},
                        {name: 'onreboot', type: 'string'},
                        {name: 'pid', type: 'string'},
                        {name: 'ppid', type: 'string'},
                        {name: 'threads', type: 'string'},
                        {name: 'children', type: 'string'},
                        {name: 'collected_sec', type: 'number'}
                    ]
                },
                {
                    formatData: function(data) {
                        return JSON.stringify(data);
                    }
                }
            ),
            columns:
            [
                {text: 'Process', datafield: 'name', width: '30%'},
                {text: 'Status', datafield: 'status', width: '15%',
                    cellsrenderer: function(row, columnfield, value, defaulthtml) {
                        var div = $(defaulthtml);
                        var _statusText = Main.getMonitStatusText(value);
                        div.html(_statusText);
                        return div[0].outerHTML;
                    }
                },
                {text: 'Uptime', datafield: 'uptime', width: '15%', cellsalign: 'right', filterable: false,
                    cellsrenderer: function(row, columnfield, value, defaulthtml) {
                        var div = $(defaulthtml);
                        div.text((value||'').length==0? '-' : HmUtil.convertCTime(value));
                        return div[0].outerHTML;
                    }
                },
                {text: 'CPU Total', datafield: 'cpu_percenttotal', width: '10%', cellsalign: 'right', filterable: false,
                    cellsrenderer: function(row, columnfield, value, defaulthtml) {
                        var div = $(defaulthtml);
                        div.text(value.length == 0? '-' : value+'%');
                        return div[0].outerHTML;
                    }
                },
                {text: 'Memory Total', datafield: 'memory_percenttotal', width: '10%', cellsalign: 'right', filterable: false,
                    cellsrenderer: function(row, columnfield, value, defaulthtml, columnproperties, rowdata) {
                        if((value||'').length==0) {
                            return "<div style='margin-top: 6.5px; margin-right: 5px' class='jqx-right-align'>-</div>";
                        }
                        else {
                            var _byte = parseInt(rowdata.memory_kilobytetotal) * 1024;
                            _byte = isNaN(_byte)? '-' : HmUtil.convertUnit1024(_byte);
                            var _value = '{0}% [{1}]'.substitute(value, _byte);
                            return "<div style='margin-top: 6.5px;' class='jqx-grid-cell-right-align'>" + _value + "</div>";
                        }
                    }
                },
                {text: 'Read', datafield: 'read_count', width: '10%', cellsalign: 'right',
                    cellsrenderer: function(row, columnfield, value, defaulthtml) {
                        var div = $(defaulthtml);
                        div.text((value||'').length==0? '-' : value + ' B/s');
                        return div[0].outerHTML;
                    }
                },
                {text: 'Write', datafield: 'write_count', width: '10%', cellsalign: 'right',
                    cellsrenderer: function(row, columnfield, value, defaulthtml) {
                        var div = $(defaulthtml);
                        div.text((value||'').length==0? '-' : value + ' B/s');
                        return div[0].outerHTML;
                    }
                }
            ]
        });
        $monitConfGrid.on('rowdoubleclick', Main.showMonitPrcsDtl);

        HmDropDownList.create($('#monit_cbServer'), {
            source: HmDropDownList.getSourceByUrl('/engineer/monitConf/getMonitServerList.do', {}, 'post'),
            displayMember: 'svrNm', valueMember: 'svrNo', selectedIndex: 0, width: 200
        });
    },

    getMonitStatusText: function(status) {
        var _statusText = '';
        switch(status) {
            case '0':
                _statusText = '<span style="color: green">OK</span>';
                break;
            case '4608':
                _statusText = '<span style="color: red">Execution failed</span> | <span style="color: red">Does not exist</span>';
                break;
            case '512':
                _statusText = '<span style="color: red">Does not exist</span>';
                break;
            default: _statusText = status;
        }
        return _statusText;
    },

    /** init data */
    initData: function() {
        this.search();
    },

    search: function () {
        var svrdata = $('#monit_cbServer').jqxDropDownList('getSelectedItem');
        if(svrdata == null) return;

        Server.post('/engineer/monitConf/getStatusList.do', {
            data: {svrNo: svrdata.value},
            success: function(result) {
                HmGrid.setLocalData($monitConfGrid, result.services);
                // set system info
                var svrInfo = result.server;
                $('#monit_sysNm').text(svrInfo.name);
                $('#monit_sysStatus').html(Main.getMonitStatusText(svrInfo.status));
                $('#monit_sysLoad').text('[{0}] [{1}] [{2}]'.substitute(svrInfo.load_avg01, svrInfo.load_avg05, svrInfo.load_avg15));
                $('#monit_sysCpu').text('{0}%us, {1}%sy, {2}%wa'.substitute(svrInfo.cpu_user, svrInfo.cpu_system, svrInfo.cpu_wait));
                $('#monit_sysMemory').text('{0}% [{1}]'.substitute(svrInfo.memory_percent, HmUtil.convertUnit1024(parseInt(svrInfo.memory_kilobyte) * 1024)));
                $('#monit_sysSwap').text('{0}% [{1}]'.substitute(svrInfo.swap_percent, HmUtil.convertUnit1024(parseInt(svrInfo.swap_kilobyte) * 1024)));
            },
            error: function(result) {
                alert(result.errorInfo.message);
                $monitConfGrid.jqxGrid('clear');
            }
        });
    },

    showMonitPrcsDtl: function() {
        var rowdata = HmGrid.getRowData($monitConfGrid);
        if(rowdata == null) return;

        var params = $.extend({svrNo: $('#monit_cbServer').val()}, rowdata);
        $.post('/engineer/popup/pMonitProcessStatus.do', params,
            function(html) {
                HmWindow.openFit($('#pwindow'), 'Process status', html, 800, 400, 'pwindow_init', params);
            }
        );
    },

    /** 서버관리 팝업 */
    showSvrMgr: function () {
        $.post(ctxPath + '/engineer/popup/pMonitSvrMgr.do', function(result) {
            HmWindow.open($('#pwindow'), 'Monit Server Management', result, 650, 500, 'pwindow_init');
        });
    }

};

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});