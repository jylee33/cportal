var HmTree = {
    T_GRP_DEFAULT: 1,
    T_GRP_DEFAULT2: 101,
    T_GRP_DEFAULT_IMPALA: 102,
    T_GRP_DEFAULT_GYEONGI: 104,
    T_AP_GRP_DEFAULT: 21,
    T_AP_GRP_SUB_DEFAULT: 24,
    T_AP_FILTER_GRP: 'AP_FILTER',
    T_AP_POE_INTERFACE: 33,
    T_L4_GRP_DEFAULT: 301,
    T_GRP_SERVICE: 2,
    T_GRP_MANG: 3,
    T_GRP_MANG2: 103,
    T_GRP_MANGFLOW: 5,
    T_GRP_MANGFLOW2: 105,
    T_GRP_SERVER: 7,
    T_GRP_SERVER2: 107,
    T_GRP_IF: 8,
    T_GRP_IF2: 88,
    T_GRP_SEARCH: 11,
    T_GRP_SEARCH2: 111,
    T_GRP_AUTHCONF: 12,
    T_GRP_DEF_ALL: 13,
    T_GRP_NETWORK: 99,
    T_GRP_NETWORKFLOW: 98,
    T_GRP_AS: 4,
    T_GRP_APP: 6,
    T_SVR_PERF: 'SVR_PERF',
    T_GRP_WAS: 'GRP_WAS',
    T_GRP_DBMS: 'GRP_DBMS',
    T_SVR_WAS_PERF: 'SVR_WAS_PERF',
    T_SVR_DBMS_PERF: 'SVR_DBMS_PERF',
    T_GRP_SVCPORT: 222,
    T_GRP_TOPO: 11111,
    T_GRP_D3TOPO: 3333,
    T_GRP_SVC: 20,
    T_GRP_TOPO_AUTHCONF: 14,
    T_GRP_TMS: 30,
    T_GRP_AUTH_RACK_CONF: 'DEFAULT_RACK',
    T_GRP_AUTH_AP_CONF: 'DEFAULT_AUTH_AP',
    T_AUTH_MENU: 501,
    T_GRP_FW: 'FIREWALL',
    T_GRP_EXTENSION: 50, //내선번호
    T_GRP_LINE: 'LINE',
    T_GRP_FLOW_IF: 22,
    T_GRP_TMS_FLOW_IF: 25,
    T_GRP_SENSOR: 23,
    T_GRP_IP: 91,
    T_GRP_IP2: 92,
    T_L4_F5_GRP_DEFAULT: 302,


    /** type에 따른 요청 url을 리턴.
     @param    type    Tree Type
     */
    getUrlByType: function (type) {
        var url = undefined;
        switch (type) {
            case HmTree.T_GRP_DEFAULT_IMPALA:
                url = '/grp/getDefaultGrpTreeList_impala.do';
                break;
            case HmTree.T_GRP_DEFAULT_GYEONGI:
                url = '/grp/getDefaultGrpTreeList_Gyeongischool4.do';
                break;
            case HmTree.T_GRP_DEFAULT:
            case HmTree.T_GRP_DEFAULT2:
                url = '/grp/getDefaultGrpTreeList.do';
                break;
            case HmTree.T_L4_GRP_DEFAULT: //L4
                url = '/grp/getL4DefaultGrpTreeList.do';
                break;
            case HmTree.T_AP_GRP_DEFAULT: // AP건수를 표시
                url = '/grp/getApDefaultGrpTreeList.do';
                break;
            case HmTree.T_AP_GRP_SUB_DEFAULT: // AP 그룹(개수) 및 AP 항목
                url = '/grp/getApGrpWithSubTreeList.do';
                break;
            case HmTree.T_AP_POE_INTERFACE: // 표시
                url = '/grp/getApPoeGrpTreeList.do';
                break;

            case HmTree.T_AP_FILTER_GRP: // AP filter
                url = '/grp/getApFilterGrpTreeList.do';
                break;
            case HmTree.T_GRP_SEARCH:
            case HmTree.T_GRP_SEARCH2:
                url = '/grp/getSearchGrpTreeList.do';
                break;
            case HmTree.T_GRP_AUTHCONF:
                url = '/grp/getAuthConfDefaultGrpTreeListAll.do';
                break;
            case HmTree.T_GRP_DEF_ALL:
                url = '/grp/getDefaultGrpTreeListAll.do';
                break;
            case HmTree.T_GRP_IF:
            case HmTree.T_GRP_IF2:
                url = '/grp/getIfGrpTreeList.do';
                break;
            case HmTree.T_GRP_SERVER:
            case HmTree.T_GRP_SERVER2:
                url = '/grp/getServerGrpTreeList.do';
                break;
            case HmTree.T_GRP_MANG:
            case HmTree.T_GRP_MANG2:
                url = '/grp/getMangGrpTreeList.do';
                break;
            case HmTree.T_GRP_MANGFLOW:
            case HmTree.T_GRP_MANGFLOW2:
                url = '/grp/getMangFlowGrpTreeList.do';
                break;
            case HmTree.T_GRP_NETWORK: // auth group
                url = '/grp/getNetworkGrpAuthTreeList.do';
                break;
            case HmTree.T_GRP_SERVICE:
                url = '/grp/getServiceGrpTreeList.do';
                break;
            case HmTree.T_GRP_AS:
                url = '/grp/getAsGrpTreeList.do';
                break;
            case HmTree.T_GRP_APP:
                url = '/grp/getAppGrpTreeList.do';
                break;
            case HmTree.T_SVR_PERF:
                url = '/grp/getServerPerfTreeList.do';
                break;
            case HmTree.T_SVR_WAS_PERF:
                url = '/grp/getSvrWasPerfTreeList.do';
                break;
            case HmTree.T_SVR_DBMS_PERF:
                url = '/grp/getSvrDbmsPerfTreeList.do';
                break;
            case HmTree.T_GRP_TOPO:
                url = '/grp/getTopoGrpTreeList.do';
                break;
            case HmTree.T_GRP_D3TOPO:
                url = '/grp/getD3TopoGrpTreeList.do';
                break;
            case HmTree.T_GRP_SVC:
                url = "/grp/getSvcPortGrpList.do";
                break;
            case HmTree.T_GRP_TOPO_AUTHCONF:
                url = "/grp/getTopoAuthGrpConfListAll.do";
                break;
            case HmTree.T_GRP_TMS:
                url = '/grp/getTmsGrpTreeList.do';
                break;
            case HmTree.T_GRP_AUTH_RACK_CONF:
                url = '/grp/getDefaultRackGrpTreeList.do';
                break;
            case HmTree.T_GRP_AUTH_AP_CONF:
                url = '/grp/getAuthConfApDefaultGrpTreeList.do';
                break;
            case HmTree.T_GRP_FW:
                url = '/grp/getFwTreeList.do';
                break;
            case HmTree.T_GRP_EXTENSION:
                url = '/grp/getExtensionGrpTreeList.do';
                break;
            case HmTree.T_GRP_FLOW_IF:
                url = '/grp/getFlowIfGrpList.do';
                break;
            case HmTree.T_GRP_TMS_FLOW_IF:
                url = '/grp/getTmsFlowIfGrpList.do';
                break;
            case HmTree.T_GRP_LINE:
                url = '/grp/getLineGrpTreeList.do';
                break;
            case HmTree.T_GRP_WAS:
                url = '/grp/getWasGrpTreeList.do';
                break;
            case HmTree.T_GRP_DBMS:
                url = '/grp/getDbmsGrpTreeList.do';
                break;
            case HmTree.T_GRP_SENSOR:
                url = '/grp/getSensorGrpTreeList.do';
                break;
            case HmTree.T_GRP_IP:
                url = '/grp/getIpGrpTreeList.do';
                break;
            case HmTree.T_GRP_IP2:
                url = '/grp/getIpGrpTreeList2.do';
                break;
            case HmTree.T_L4_F5_GRP_DEFAULT:
                url = '/grp/getL4F5GrpTreeList.do';
                break;
            default:
                break;
        }
        return url;
    },


    /**
     * 트리생성시 명칭옆에 장비대수 카운팅 표시
     * @param $tree
     * @param type
     * @param fnSelect
     * @param params
     */
    create: function ($tree, type, fnSelect, params, theme) {
        var url = undefined;
        if (theme === undefined) theme = jqxTheme;
        if ($.isEmpty(params)) params = {};
        switch (type) {
            case HmTree.T_GRP_DEFAULT:
                url = '/grp/getDefaultGrpTreeList.do';
                break;
            case HmTree.T_GRP_SEARCH:
                url = '/grp/getSearchGrpTreeList.do';
                break;
            case HmTree.T_GRP_AUTHCONF:
                url = '/grp/getAuthConfDefaultGrpTreeListAll.do';
                break;
            case HmTree.T_GRP_DEF_ALL:
                url = '/grp/getDefaultGrpTreeListAll.do';
                break;
            case HmTree.T_GRP_IF:
            case HmTree.T_GRP_IF2:
                url = '/grp/getIfGrpTreeList.do';
                break;
            case HmTree.T_GRP_SERVER:
                url = '/grp/getServerGrpTreeList.do';
                break;
            case HmTree.T_GRP_MANG:
                url = '/grp/getMangGrpTreeList.do';
                break;
            case HmTree.T_GRP_MANGFLOW:
                url = '/grp/getMangFlowGrpTreeList.do';
                break;
            case HmTree.T_GRP_SERVICE:
                url = '/grp/getServiceGrpTreeList.do';
                break;
            case HmTree.T_AP_FILTER_GRP:
                url = '/grp/getApDefaultGrpTreeList.do';
                break;
            case HmTree.T_AP_GRP_DEFAULT:
                url = '/grp/getApFilterGrpTreeList.do';
                break;
            case HmTree.T_AP_GRP_SUB_DEFAULT:
                url = '/grp/getApGrpWithSubTreeList.do';
                break;
            case HmTree.T_GRP_AUTH_RACK_CONF:
                url = '/grp/getDefaultRackGrpTreeList.do';
                break;
            case HmTree.T_GRP_AUTH_AP_CONF:
                url = '/grp/getAuthConfApDefaultGrpTreeList.do';
                break;
            case HmTree.T_GRP_EXTENSION:
                url = '/grp/getExtensionGrpTreeList.do';
                break;
            case HmTree.T_GRP_LINE:
                url = '/grp/getLineGrpTreeList.do';
                break;
            case HmTree.T_GRP_FLOW_IF:
                url = '/grp/getFlowIfGrpList.do';
                break;
            case HmTree.T_GRP_TMS_FLOW_IF:
                url = '/grp/getTmsFlowIfGrpList.do';
                break;
            case HmTree.T_L4_F5_GRP_DEFAULT:
                url = '/grp/getL4F5GrpTreeList.do';
                break;
        }
        var adapter = new $.jqx.dataAdapter(
            {
                datatype: 'json',
                root: 'resultData',
                url: null
            },
            {
                autoBind: false,
                async: false,
                formatData: function (data) {
                    $.extend(data, params);
                    return data;
                },
                loadComplete: function (records) {
                    // set icon img
                    $.each(records.resultData, function (idx, obj) {
                        obj.icon = ctxPath + '/img/folder.png';
                    });
                    adapter.records = records.resultData;
                }
            }
        );
        adapter._source.url = ctxPath + url;
        adapter.dataBind();
        var records = adapter.getRecordsHierarchy('grpNo', 'grpParent', 'items', [{
            name: 'grpName',
            map: 'label'
        }, {name: 'grpNo', map: 'value'}]);
        $tree.on('initialized', function (event) {
            $(this).jqxTree('expandItem', $(this).jqxTree('getItems')[0]);
            $(this).jqxTree('selectItem', $(this).jqxTree('getItems')[0]);
        })
            .on('select', function (event) {
                if (fnSelect !== undefined && fnSelect !== null) fnSelect(event);
            });

        if (type == HmTree.T_GRP_AUTHCONF)
            $tree.jqxTree({
                source: records,
                width: '100%',
                height: '99.8%',
                theme: theme,
                allowDrag: false,
                hasThreeStates: true,
                checkboxes: true
            });
        else
            $tree.jqxTree({source: records, width: '100%', height: '99.8%', theme: theme, allowDrag: false});
    },

    /**
     * 트리데이터 갱신
     * @param $tree
     * @param type
     * @param boolean selectClear < 초기화시 트리 선택을 최상위로 바꿀것인지
     */
    updateData: function ($tree, type, params, isClearSelection) {
        var url = undefined;
        if (isClearSelection === undefined) isClearSelection = false;
        if ($.isEmpty(params)) params = {};
        var selectItem = $tree.jqxTree('getSelectedItem');
        switch (type) {
            case HmTree.T_GRP_DEFAULT:
                url = '/grp/getDefaultGrpTreeList.do';
                break;
            case HmTree.T_GRP_SEARCH:
                url = '/grp/getSearchGrpTreeList.do';
                break;
            case HmTree.T_GRP_AUTHCONF:
                url = '/grp/getAuthConfDefaultGrpTreeListAll.do';
                break;
            case HmTree.T_GRP_DEF_ALL:
                url = '/grp/getDefaultGrpTreeListAll.do';
                break;
            case HmTree.T_GRP_IF:
            case HmTree.T_GRP_IF2:
                url = '/grp/getIfGrpTreeList.do';
                break;
            case HmTree.T_GRP_SERVER:
                url = '/grp/getServerGrpTreeList.do';
                break;
            case HmTree.T_GRP_MANG:
                url = '/grp/getMangGrpTreeList.do';
                break;
            case HmTree.T_GRP_MANGFLOW:
                url = '/grp/getMangFlowGrpTreeList.do';
                break;
            case HmTree.T_GRP_SERVICE:
                url = '/grp/getServiceGrpTreeList.do';
                break;
            case HmTree.T_AP_FILTER_GRP:
                url = '/grp/getApDefaultGrpTreeList.do';
                break;
            case HmTree.T_AP_GRP_DEFAULT:
                url = '/grp/getApFilterGrpTreeList.do';
                break;
            case HmTree.T_GRP_AUTH_RACK_CONF:
                url = '/grp/getDefaultRackGrpTreeList.do';
                break;
            case HmTree.T_GRP_AUTH_AP_CONF:
                url = '/grp/getAuthConfApDefaultGrpTreeList.do';
                break;
            case HmTree.T_GRP_EXTENSION:
                url = '/grp/getExtensionGrpTreeList.do';
                break;
            case HmTree.T_GRP_LINE:
                url = '/grp/getLineGrpTreeList.do';
                break;
            case HmTree.T_GRP_FLOW_IF:
                url = '/grp/getFlowIfGrpList.do';
                break;
            case HmTree.T_GRP_TMS_FLOW_IF:
                url = '/grp/getTmsFlowIfGrpList.do';
                break;
            default:
                return;
        }
        var adapter = new $.jqx.dataAdapter(
            {
                datatype: 'json',
                root: 'resultData',
                url: null
            },
            {
                autoBind: false,
                async: false,
                formatData: function (data) {
                    $.extend(data, params);
                    return data;
                },
                loadComplete: function (records) {
                    // set icon img
                    $.each(records.resultData, function (idx, obj) {
                        obj.icon = ctxPath + '/img/folder.png';
                    });
                    adapter.records = records.resultData;
                }
            }
        );
        adapter._source.url = ctxPath + url;
        adapter.dataBind();
        var records = adapter.getRecordsHierarchy('grpNo', 'grpParent', 'items', [{
            name: 'grpName',
            map: 'label'
        }, {name: 'grpNo', map: 'value'}]);
        $tree.jqxTree({source: records});
        if (isClearSelection) {
            $tree.jqxTree('expandItem', $tree.jqxTree('getItems')[0]);
            $tree.jqxTree('selectItem', $tree.jqxTree('getItems')[0]);
        } else {
            var itemList = $tree.jqxTree('getItems');
            for (var i in itemList) {
                if (itemList[i].value == selectItem.value) {
                    $tree.jqxTree('selectItem', $tree.jqxTree('getItems')[i]);
                    break;
                }
            }
        }
    }
};