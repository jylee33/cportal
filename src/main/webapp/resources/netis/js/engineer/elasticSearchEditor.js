var $url, $status, $tabs, $gridIndices;
var client;

var Main = {
    /** variable */
    initVariable: function() {
        $url = $('#txtUrl');
        $status = $('#lbStatus');
        $tabs = $('#tabs');
        $gridIndices = $('#indeicesGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnStart': this.start(); break;
            case 'btnSearch': this.search(); break;
        }
    },

    /** init design */
    initDesign: function() {
        $tabs.jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top'});
        HmGrid.create($gridIndices, {
            source: new $.jqx.dataAdapter({
                    datatype: 'json'
                }
            ),
            columns: [
                { text: "index", datafield: 'index' }
            ]
        });

        $('#querySplitter').jqxSplitter({
            width: '99.8%',
            height: '99.8%',
            orientation: 'vertical',
            theme: jqxTheme,
            panels: [{size: 304}, {size: '100%'}]
        });

        //$('#paramText').jqxTextArea({ width: '100%', minLength: 1, height: '94.8%' });
        $('#resultText').jqxTextArea({ placeHolder: 'Result', height: '94.8%', width: '100%', minLength: 1 });
    },

    /** init data */
    initData: function() {
        $('#lbEsUse').text('사용설정 여부(' + $('#gEsUse').val() + ')');
        var esIp = $('#gEsIp').val();
        var esPort = $('#gEsPort').val();

        $url.val(esIp + ':' + esPort);
    },

    search: function () {
        if (client === undefined || client === null) {
            alert('접속되어 있지 않습니다.');
            return false;
        }

        var param = {
            index: $('#txtIndices').val(),
            body : JSON.parse($('#paramText').val()),
            from: 0,
            size: 10
        };

        ES.search(null, param, function (error, resp, status) {
            $('#resultText').val(JSON.stringify(resp));
        });
    },

    start: function () {
        client = ES.connect({
            host: $url.val(),
            log: 'trace'
        });

        ES.ping(client, {
                requestTimeout: Infinity
            },
            function (error, resp, status) {
                if (error) {
                    $status.text('not connected');
                    alert('연결 실패 !!');
                } else {
                    ES.catHealth(client, null, function (error, resp, status) {
                        if(error) return false;
                        var cluster = resp[0].cluster;
                        var status = resp[0].status;
                        var pri = Number(resp[0].pri);
                        var shards = Number(resp[0].shards);
                        var unassign = Number(resp[0].unassign);
                        $status.text(status + ' (' + pri + ' of ' + (pri + unassign) + ')');
                    });

                    ES.catIndices(client, { s: 'index:asc'}, function (error, resp, status) {
                        if(error) return false;
                        HmGrid.setLocalData($gridIndices, resp);
                    });
                }
            });

        // client.cat.indices({format: 'json'} , function (a, b, c) {
        //    debugger;
        // });
        //
        //
        // client.ping({
        //    requestTimeout: Infinity
        //  //  hello: 'elasticsearch!'
        // },
        //     function (error) {
        //         if (error) {
        //             alert('fail');
        //         } else {
        //             alert('success');
        //         }
        //     });


        // Server.get($url.val(), {
        //     data : { },
        //     success : function(result) {
        //         alert("삭제되었습니다.");
        //         $treeGrid.jqxTreeGrid('deleteRow', treekey);
        //     }, error: function () {
        //         alert('fail');
        //     }
        // });
    }

};

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});