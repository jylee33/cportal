/**
 * GIS토폴로지 컨텍스트 메뉴
 */
var gis_menu = {
    curTarget: null,

    getMenuTag:function (tagId, tagImg, tagText) {
        if(tagImg == null) {
            tagImg = "dtl_info";
        }
        var div = $('<div></div>', {id: tagId})
            .append($('<img/>', {style: 'margin-right: 5px', src: ctxPath + '/img/ctxmenu/{0}.png'.substitute(tagImg)}))
            .append($('<span></span>', {text: tagText}));
        return div[0].outerHTML;
    },

    s_menu_map: [
        {title: '최상위그룹', mnId: 'cm_goto_top', action: gis_menu_action.gotoTop},
        {title: '상위그룹', mnId: 'cm_goto_up', action: gis_menu_action.gotoUp},
        {title: '모드변경', mnId: null, items: [
                {title: '조회모드', mnId: 'cm_mode_search'},
                {title: '관리모드', mnId: 'cm_mode_manage'}
            ]
        },
        {title: '토폴로지보기', mnId: 'cm_view_topology'}
    ],

    m_menu_map: [
        {title: '최상위그룹', mnId: 'cm_goto_top', action: gis_menu_action.gotoTop},
        {title: '상위그룹', mnId: 'cm_goto_up', action: gis_menu_action.gotoUp},
        {title: '모드변경', mnId: null, items: [
                {title: '조회모드', mnId: 'cm_mode_search'},
                {title: '관리모드', mnId: 'cm_mode_manage'}
            ]
        },
        {title: '토폴로지보기', mnId: 'cm_view_topology'},
        {title: '추가', mnId: 'cm_add_dev'},
        {title: '그룹추가', mnId: 'cm_add_grp'},
        {title: '위경도설정', mnId: 'cm_cfg_latlng'},
        {title: '위경도저장', mnId: 'cm_save_item'},
        {title: '지도저장', mnId: 'cm_save_group'}
    ],

    getMenuList: function(target, mapMode) {
        var menulist = [], menuData = null;
        if(target instanceof L.Map) {
            if(mapMode == TopoConst.mapMode.MANAGE) {
                menuData = gis_menu.m_menu_map;
            }
            else {
                menuData = gis_menu.s_menu_map;
            }
        }
        else if(target instanceof L.Marker) {
            console.log(target.options);
            if(target.options.hasOwnProperty("kind") && target.options.kind == 'marker') {
                var devKind1 = target.options.devKind1, devKind2 = target.options.devKind2;
                if(devKind1 != 'GRP') {
                    switch(devKind1) {
                        case 'DEV':
                            menuData = gis_menu.s_menu_dev;
                            break;
                        case 'SVR':
                            menuData = gis_menu.s_menu_svr;
                            break;
                        case 'AP_CONTROLLER':
                            menuData = gis_menu.s_menu_ap;
                            break;
                    }
                }
            }
        }

        // create menu
        if(menuData != null) {
            $.each(menuData, function (i, v) {
                if (v.hasOwnProperty("items")) {
                    var sublist = [];
                    $.each(v.items, function (si, sv) {
                        sublist.push({html: gis_menu.getMenuTag(sv.mnId, null, sv.title)});
                    });
                    menulist.push({html: gis_menu.getMenuTag(v.mnId, null, v.title), items: sublist});
                } else {
                    menulist.push({html: gis_menu.getMenuTag(v.mnId, null, v.title)});
                }
            });
        }
        return menulist;
    },

    s_menu_dev: [
        {title: '장비상세', mnId: 'cm_dtl_dev'}
    ],

    s_menu_svr: [
        {title: '서버상세', mnId: 'cm_dtl_svr'}
    ],

    s_menu_ap: [
        {title: 'AP상세정보', mnId: 'cm_dtl_ap'}
        // {title: 'Client현황', mnId: 'cm_dtl_apClient'}
    ]

};
