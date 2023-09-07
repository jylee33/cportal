/**
 * 토폴로지 컨텍스트 메뉴
 */
"use strict";
var topo_menu = {
    m_menu_back: [
        {
            local_burette: "rMenu_highest",
            title: "최상위그룹",
            hotKey: "Alt+T",
            icon: 'list_icon',
            action: topo_menu_action.gotoTop
        },
        {
            local_burette: "rMenu_high",
            title: "상위그룹",
            hotKey: "Alt+U",
            action: topo_menu_action.gotoUp
        },
        {
            local_burette: "rMenu_mode",
            title: "모드변경",
            children_burette: "mode",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "조회모드",
                    hotKey: "Ctrl+E",
                    action: topo_menu_action.modechg_search
                },
                {
                    title: "관리모드",
                    hotKey: "Ctrl+E",
                    action: topo_menu_action.modechg_manage
                }
            ]
        },
        {
            local_burette: "rMenu_search",
            title: "장비찾기",
            hotKey: "Alt+F",
            action: topo_menu_action.findDev
        },
        {
            local_burette: "rMenu_add",
            title: "추가",
            children_burette: "add",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "그룹추가",
                    action: topo_menu_action.add_grp
                },
                {
                    title: "등록그룹추가",
                    action: topo_menu_action.add_regGrp
                },
                {
                    title: "등록장비추가",
                    action: topo_menu_action.add_regDev
                },
                {
                    title: "등록서버추가",
                    action: topo_menu_action.add_regSvr
                },
                {
                    title: "등록센서추가",
                    action: topo_menu_action.add_regSensor
                },
                {
                    title: "등록RACK추가",
                    action: topo_menu_action.add_regRack
                },
                {
                    title: "등록AP추가",
                    action: topo_menu_action.add_regAp
                },
                {
                    title: "등록Was추가",
                    action: topo_menu_action.add_regWas
                },
                {
                    title: "등록DBMS추가",
                    action: topo_menu_action.add_regDbms
                },
                {
                    title: "임의장비추가",
                    action: topo_menu_action.add_etcDev
                }
            ]
        },
        {
            local_burette: "rMenu_change",
            title: "변경",
            children_burette: "change",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "배경이미지변경",
                    action: topo_menu_action.chg_bgImg
                }
            ]
        },
        {
            local_burette: "rMenu_image",
            title: "Image 관리",
            children_burette: "image",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "모델별 이미지 관리",
                    action: topo_menu_action.chgImg_byModel
                },
                {
                    title: "배경 이미지 관리",
                    action: topo_menu_action.mgmtImg_bg
                },
                {
                    title: "아이콘 이미지 관리",
                    action: topo_menu_action.mgmtImg_icon
                }
            ]
        },
        {
            local_burette: "rMenu_draw",
            title: "그리기도구",
            children_burette: "draw",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "사각형",
                    action: topo_menu_action.add_shapeRectangle
                },
                {
                    title: "둥근사각형",
                    action: topo_menu_action.add_shapeRoundedRectangle
                },
                {
                    title: "원",
                    action: topo_menu_action.add_shapeCircle
                },
                {
                    title: "선",
                    action: topo_menu_action.add_splinePath
                },
                {
                    title: "텍스트",
                    action: topo_menu_action.add_shapeText
                },
                {
                    title: "내용",
                    action: topo_menu_action.add_shapeTextArea
                }
            ]
        },
        {
            local_burette: "rMenu_save",
            title: "저장",
            hotKey: "Ctrl+S",
            action: topo_menu_action.save_map
        },
        {
            local_burette: "rMenu_setting",
            title: "환경설정",
            hotKey: "Ctrl+Alt+S",
            action: topo_menu_action.save_envSetting
        },
        {
            local_burette: "rMenu_ruler",
            title: "눈금",
            children_burette: "ruler",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "눈금자표시/숨기기",
                    action: topo_menu_action.view_gridaxis
                },
                {
                    title: "눈금선표시/숨기기",
                    action: topo_menu_action.view_gridline
                }
            ]
        },
        {
            local_burette: "rMenu_guide",
            title: "안내선",
            children_burette: "guide",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "안내선표시/숨기기",
                    action: topo_menu_action.view_helpLine
                },
                {
                    title: "세로안내선 추가",
                    action: topo_menu_action.add_vHelpline
                },
                {
                    title: "가로안내선 추가",
                    action: topo_menu_action.add_hHelpline
                }//,
                // {
                //     title: "안내선색상 변경",
                //     action: topo_menu_action.chg_helpLine_color
                // }

            ]
        },
        // {
        //     title: "장비자동배치",
        //     action: topo_menu_action.autoItemArrangement
        // },
        {
            local_burette: "rMenu_auto",
            title: "회선자동연결",
            action: topo_menu_action.autoLinkRelation
        },
        {
            local_burette: "rMenu_reset",
            title: "초기화",
            children_burette: "reset",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "맵초기화",
                    action: topo_menu_action.init_map
                },
                {
                    title: "위치초기화",
                    action: topo_menu_action.init_pos
                }
            ]
        }//,
        // {
        //     title: "토폴로지 Import",
        //     action: topo_menu_action.importMap
        // },
        // {
        //     title: "토폴로지 Tools",
        //     action: function (elm, d, i) {
        //     },
        //     childrenItems: [
        //         {
        //             title: "토폴로지 백업",
        //             action: topo_menu_action.dumpToXML
        //         },
        //         {
        //             title: "토폴로지 복원",
        //             action: topo_menu_action.restoreFromDumpXML
        //         },
        //         {
        //             title: "토폴로지 복원이력",
        //             action: topo_menu_action.restoreHist
        //         }
        //     ]
        // }
    ],
    m_menu_item: [
        {
            local_burette: "rMenu_moveGroup",
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
        {
            local_burette: "rMenu_devCopy",
            title: "장비복사",
            action: topo_menu_action.copyDev
        },
        {
            local_burette: "rMenu_change",
            title: "변경",
            children_burette: "icon",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: '아이콘정보변경',
                    action: topo_menu_action.chg_iconInfo
                },
                {
                    title: "아이콘이미지변경",
                    action: topo_menu_action.chg_iconImg
                },
                {
                    title: "타입변경",
                    action: topo_menu_action.chg_iconType
                }
            ]
        },
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            hotKey: "Ctrl+D",
            action: topo_menu_action.del_icon
        },
        {
            local_burette: "rMenu_memo",
            title: "메모",
            action: topo_menu_action.memo
        },
        {
            local_burette: "rMenu_urlSet",
            title: "URL설정",
            children_burette: "urlTem",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: 'URL탬플릿설정',
                    action: topo_menu_action.url_templet_set
                },
                // {
                //     title: "URL탬플릿지정",
                //     action: topo_menu_action.url_templet_add
                // },

            ]
        },

    ],
    m_menu_grp: [
        {
            local_burette: "rMenu_moveGroup",
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
        {
            local_burette: "rMenu_groupCopy",
            title: "그룹복사",
            action: topo_menu_action.copyGrp
        },
        {
            local_burette: "rMenu_change",
            title: "변경",
            children_burette: "icon",
            action: function (elm, d, i) {
            },
            childrenItems: [
                // {
                //     title: "그룹명변경",
                //     action: topo_menu_action.chg_grpNm
                // },
                // {
                //     title: "별칭변경",
                //     action: topo_menu_action.chg_alias
                // },
                // {
                //     title: "아이콘크기변경",
                //     action: topo_menu_action.chg_iconSize
                // },
                // {
                //     title: "폰트크기변경",
                //     action: topo_menu_action.chg_fontSize
                // },
                {
                    title: '아이콘정보변경',
                    action: topo_menu_action.chg_iconInfo
                },
                {
                    title: "아이콘이미지변경",
                    action: topo_menu_action.chg_iconImg
                }
            ]
        },
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            hotKey: "Ctrl+D",
            action: topo_menu_action.del_icon
        },
        {
            local_burette: "rMenu_memo",
            title: "메모",
            action: topo_menu_action.memo
        }
    ],
    m_menu_rack: [
        {
            local_burette: "rMenu_moveGroup",
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
        {
            local_burette: "rMenu_change",
            title: "변경",
            children_burette: "icon",
            action: function (elm, d, i) {
            },
            childrenItems: [
                // {
                //     title: "별칭변경",
                //     action: topo_menu_action.chg_alias
                // },
                // {
                //     title: "아이콘크기변경",
                //     action: topo_menu_action.chg_iconSize
                // },
                // {
                //     title: "폰트크기변경",
                //     action: topo_menu_action.chg_fontSize
                // },
                {
                    title: '아이콘정보변경',
                    action: topo_menu_action.chg_iconInfo
                },
                {
                    title: "아이콘이미지변경",
                    action: topo_menu_action.chg_iconImg
                }
            ]
        },
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            hotKey: "Ctrl+D",
            action: topo_menu_action.del_icon
        },
        {
            local_burette: "rMenu_memo",
            title: "메모",
            action: topo_menu_action.memo
        }
    ],
    m_menu_svr: [
        {
            local_burette: "rMenu_moveGroup",
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
        {
            local_burette: "rMenu_change",
            title: "변경",
            children_burette: "icon",
            action: function (elm, d, i) {
            },
            childrenItems: [
                // {
                //     title: "별칭변경",
                //     action: topo_menu_action.chg_alias
                // },
                // {
                //     title: "아이콘크기변경",
                //     action: topo_menu_action.chg_iconSize
                // },
                // {
                //     title: "폰트크기변경",
                //     action: topo_menu_action.chg_fontSize
                // },
                {
                    title: '아이콘정보변경',
                    action: topo_menu_action.chg_iconInfo
                },
                {
                    title: "아이콘이미지변경",
                    action: topo_menu_action.chg_iconImg
                },
                {
                    title: "타입변경",
                    action: topo_menu_action.chg_iconType
                }
            ]
        },
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            hotKey: "Ctrl+D",
            action: topo_menu_action.del_icon
        },
        {
            local_burette: "rMenu_memo",
            title: "메모",
            action: topo_menu_action.memo
        }
    ],
    m_menu_point: [
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            hotKey: "Ctrl+D",
            action: topo_menu_action.del_point
        }
    ],
    m_menu_etc: [
        {
            local_burette: "rMenu_moveGroup",
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
        {
            local_burette: "rMenu_change",
            title: "변경",
            children_burette: "icon",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "임의장비속성변경",
                    action: topo_menu_action.chg_etcDevAttr
                },
                // {
                //     title: "별칭변경",
                //     action: topo_menu_action.chg_alias
                // },
                // {
                //     title: "아이콘크기변경",
                //     action: topo_menu_action.chg_iconSize
                // },
                // {
                //     title: "폰트크기변경",
                //     action: topo_menu_action.chg_fontSize
                // },
                {
                    title: '아이콘정보변경',
                    action: topo_menu_action.chg_iconInfo
                },
                {
                    title: "아이콘이미지변경",
                    action: topo_menu_action.chg_iconImg
                },
                {
                    title: "타입변경",
                    action: topo_menu_action.chg_iconType
                }
            ]
        },
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            hotKey: "Ctrl+D",
            action: topo_menu_action.del_icon
        },
        {
            local_burette: "rMenu_memo",
            title: "메모",
            action: topo_menu_action.memo
        }
    ],
    m_menu_ap: [
        {
            local_burette: "rMenu_moveGroup",
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
        {
            local_burette: "rMenu_change",
            title: "변경",
            children_burette: "icon",
            action: function (elm, d, i) {
            },
            childrenItems: [
                // {
                //     title: "별칭변경",
                //     action: topo_menu_action.chg_alias
                // },
                // {
                //     title: "아이콘크기변경",
                //     action: topo_menu_action.chg_iconSize
                // },
                // {
                //     title: "폰트크기변경",
                //     action: topo_menu_action.chg_fontSize
                // },
                {
                    title: '아이콘정보변경',
                    action: topo_menu_action.chg_iconInfo
                },
                {
                    title: "아이콘이미지변경",
                    action: topo_menu_action.chg_iconImg
                }
            ]
        },
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            hotKey: "Ctrl+D",
            action: topo_menu_action.del_icon
        },
        {
            local_burette: "rMenu_memo",
            title: "메모",
            action: topo_menu_action.memo
        }
    ],
    m_menu_multi_link: [
        // {
        //    local_burette: "rMenu_point",
        //     title: "Point추가",
        //     action: topo_menu_action.addPoint
        // },
        {
            local_burette: "rMenu_ifStyle",
            title: "회선스타일 변경",
            action: topo_menu_action.chg_linkStyle
        },
        /* TODO 추후 개발 진행
        {
            title: "멀티회선폴링",
            action: topo_menu_action.polling_multiLink
        },
        */
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            action: topo_menu_action.del_link
        }
    ],
    m_menu_curve_multi_link : [
        {
            local_burette: "rMenu_ifStyle",
            title: "회선스타일 변경",
            action: topo_menu_action.chg_linkStyle
        },
        // {
        //     title: "곡선편집",
        //     action: topo_menu_action.link_editCurveBegin
        // },
        /* TODO 추후 개발 진행
        {
            title: "멀티회선폴링",
            action: topo_menu_action.polling_multiLink
        },
        */
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            action: topo_menu_action.del_link
        }
    ],
    m_menu_link: [
        {
            local_burette: "rMenu_point",
            title: "Point추가",
            action: topo_menu_action.addPoint
        },
        {
            local_burette: "rMenu_ifStyle",
            title: "회선스타일 변경",
            action: topo_menu_action.chg_linkStyle
        },
        {
            local_burette: "rMenu_ifpoling",
            title: "회선폴링",
            action: topo_menu_action.polling_link
        },
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            action: topo_menu_action.del_link
        }
    ],
    m_menu_spline : [
        {
            title: "선 스타일 변경",
            action: topo_menu_action.chg_splineStyle
        },
        {
            local_burette: "rMenu_point",
            title: "Point추가",
            action: topo_menu_action.add_splinePoint
        },
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            action: topo_menu_action.del_splineTool
        }
    ],
    m_menu_spline_point_del : [
        {
            local_burette: "rMenu_polDelete",
            title: "Point삭제",
            action: topo_menu_action.del_splinePoint
        }
    ],
    m_menu_curve_link : [
        {
            local_burette: "rMenu_ifStyle",
            title: "회선스타일 변경",
            action: topo_menu_action.chg_linkStyle
        },
        {
            title: "곡선편집",
            action: topo_menu_action.link_editCurveBegin
        },
        {
            local_burette: "rMenu_ifpoling",
            title: "회선폴링",
            action: topo_menu_action.polling_link
        },
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            action: topo_menu_action.del_link
        }
    ],
    m_menu_two_item: [
        {
            local_burette: "rMenu_moveGroup",
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
        {
            local_burette: "rMenu_devCopy",
            title: "장비복사",
            action: topo_menu_action.copyDev
        },
        {
            local_burette: "rMenu_circuitAdd",
            title: "회선추가",
            action: topo_menu_action.add_link
        },
        {
            local_burette: "rMenu_change",
            title: "변경",
            children_burette: "icon",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: '아이콘정보변경',
                    action: topo_menu_action.chg_iconInfo
                },
                // {
                //     title: "아이콘크기변경",
                //     action: topo_menu_action.chg_iconSize
                // },
                // {
                //     title: "폰트크기변경",
                //     action: topo_menu_action.chg_fontSize
                // },
                {
                    title: "아이콘이미지변경",
                    action: topo_menu_action.chg_iconImg
                },
                // {
                //     title: "명칭위치변경",
                //     action: topo_menu_action.chg_labelPosition
                // }
            ]
        },
        {
            local_burette: "rMenu_array",
            title: "정렬",
            children_burette: "align",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "왼쪽맞춤",
                    action: topo_menu_action.align_vertical_left
                },
                {
                    title: "가운데맞춤",
                    action: topo_menu_action.align_vertical_center
                },
                {
                    title: "오른쪽맞춤",
                    action: topo_menu_action.align_vertical_right
                },
                {
                    title: "위쪽맞춤",
                    action: topo_menu_action.align_horizontal_top
                },
                {
                    title: "중간맞춤",
                    action: topo_menu_action.align_horizontal_middle
                },
                {
                    title: "아래쪽맞춤",
                    action: topo_menu_action.align_horizontal_bottom
                }
            ]
        },
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            hotKey: "Ctrl+D",
            action: topo_menu_action.del_multiIcon
        }
    ],
    m_menu_multi_item: [
        {
            local_burette: "rMenu_moveGroup",
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
        {
            local_burette: "rMenu_devCopy",
            title: "장비복사",
            action: topo_menu_action.copyDev
        },
        {
            local_burette: "rMenu_change",
            title: "변경",
            children_burette: "icon",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: '아이콘정보변경',
                    action: topo_menu_action.chg_iconInfo
                },
                // {
                //     title: "아이콘크기변경",
                //     action: topo_menu_action.chg_iconSize
                // },
                // {
                //     title: "폰트크기변경",
                //     action: topo_menu_action.chg_fontSize
                // },
                {
                    title: "아이콘이미지변경",
                    action: topo_menu_action.chg_iconImg
                },
                // {
                //     title: "명칭위치변경",
                //     action: topo_menu_action.chg_labelPosition
                // }
            ]
        },
        {
            local_burette: "rMenu_array",
            title: "정렬",
            children_burette: "align",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "왼쪽맞춤",
                    action: topo_menu_action.align_vertical_left
                },
                {
                    title: "가운데맞춤",
                    action: topo_menu_action.align_vertical_center
                },
                {
                    title: "오른쪽맞춤",
                    action: topo_menu_action.align_vertical_right
                },
                {
                    title: "위쪽맞춤",
                    action: topo_menu_action.align_horizontal_top
                },
                {
                    title: "중간맞춤",
                    action: topo_menu_action.align_horizontal_middle
                },
                {
                    title: "아래쪽맞춤",
                    action: topo_menu_action.align_horizontal_bottom
                },
                {
                    title: "가로간격동일",
                    action: topo_menu_action.align_horizontalDivision
                },
                {
                    title: "세로간격동일",
                    action: topo_menu_action.align_verticalDivision
                }
            ]
        },
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            hotKey: "Ctrl+D",
            action: topo_menu_action.del_multiIcon
        }
    ],
    m_menu_other: [
        {
            local_burette: "rMenu_moveGroup",
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
        {
            local_burette: "rMenu_change",
            title: "변경",
            children_burette: "icon",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: '아이콘정보변경',
                    action: topo_menu_action.chg_iconInfo
                },
                {
                    title: "아이콘이미지변경",
                    action: topo_menu_action.chg_iconImg
                }
            ]
        },
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            hotKey: "Ctrl+D",
            action: topo_menu_action.del_icon
        },
        {
            local_burette: "rMenu_memo",
            title: "메모",
            action: topo_menu_action.memo
        }
    ],
    m_menu_shape_default: [
        {
            local_burette: "rMenu_orderChg",
            title: '표시순서변경',
            children_burette: "order",
            childrenItems: [
                {
                    title: '앞으로 가져오기',
                    action: topo_menu_action.moveToFront
                },
                {
                    title: '맨 앞으로 가져오기',
                    action: topo_menu_action.bringToFront
                },
                {
                    title: '뒤로 보내기',
                    action: topo_menu_action.moveToBack
                },
                {
                    title: '맨 뒤로 보내기',
                    action: topo_menu_action.bringToBack
                }
            ]
        },
        {
            local_burette: "rMenu_imgCopy",
            title: "도형복사",
            action: topo_menu_action.copyDraw
        },
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            hotKey: "Ctrl+D",
            action: topo_menu_action.del_drawTool
        }
    ],
    m_menu_shape: [
        {
            local_burette: "rMenu_imgStyle",
            title: '도형스타일',
            action: topo_menu_action.showDrawShapeTool
        },
        // {
        //     title: '도형텍스트',
        //     action: topo_menu_action.drawShapeText
        // },
        {
            local_burette: "rMenu_orderChg",
            title: '표시순서변경',
            children_burette: "order",
            childrenItems: [
                {
                    title: '앞으로 가져오기',
                    action: topo_menu_action.moveToFront
                },
                {
                    title: '맨 앞으로 가져오기',
                    action: topo_menu_action.bringToFront
                },
                {
                    title: '뒤로 보내기',
                    action: topo_menu_action.moveToBack
                },
                {
                    title: '맨 뒤로 보내기',
                    action: topo_menu_action.bringToBack
                }
            ]
        },
        {
            local_burette: "rMenu_imgCopy",
            title: "도형복사",
            action: topo_menu_action.copyDraw
        },
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            hotKey: "Ctrl+D",
            action: topo_menu_action.del_drawTool
        }
    ],
    m_menu_shape_multi: [
        {
            local_burette: "rMenu_imgStyle",
            title: '도형스타일',
            action: topo_menu_action.showDrawShapeTool
        },
        {
            local_burette: "rMenu_array",
            title: "정렬",
            code: "align",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "왼쪽맞춤",
                    action: topo_menu_action.align_vertical_left
                },
                {
                    title: "가운데맞춤",
                    action: topo_menu_action.align_vertical_center
                },
                {
                    title: "오른쪽맞춤",
                    action: topo_menu_action.align_vertical_right
                },
                {
                    title: "위쪽맞춤",
                    action: topo_menu_action.align_horizontal_top
                },
                {
                    title: "중간맞춤",
                    action: topo_menu_action.align_horizontal_middle
                },
                {
                    title: "아래쪽맞춤",
                    action: topo_menu_action.align_horizontal_bottom
                },
                {
                    title: "가로간격동일",
                    action: topo_menu_action.align_horizontalDivision
                },
                {
                    title: "세로간격동일",
                    action: topo_menu_action.align_verticalDivision
                }
            ]
        },
        {
            local_burette: "rMenu_orderChg",
            title: '표시순서변경',
            children_burette: "order",
            childrenItems: [
                {
                    title: '앞으로 가져오기',
                    action: topo_menu_action.moveToFront
                },
                {
                    title: '맨 앞으로 가져오기',
                    action: topo_menu_action.bringToFront
                },
                {
                    title: '뒤로 보내기',
                    action: topo_menu_action.moveToBack
                },
                {
                    title: '맨 뒤로 보내기',
                    action: topo_menu_action.bringToBack
                }
            ]
        },
        {
            local_burette: "rMenu_imgCopy",
            title: "도형복사",
            action: topo_menu_action.copyDraw
        },
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            hotKey: "Ctrl+D",
            action: topo_menu_action.del_drawTool
        }
    ],
    m_menu_text: [
        {
            title: '텍스트스타일',
            action: topo_menu_action.showDrawTextTool
        },
        {
            local_burette: "rMenu_orderChg",
            title: '표시순서변경',
            children_burette: "order",
            childrenItems: [
                {
                    title: '앞으로 가져오기',
                    action: topo_menu_action.moveToFront
                },
                {
                    title: '맨 앞으로 가져오기',
                    action: topo_menu_action.bringToFront
                },
                {
                    title: '뒤로 보내기',
                    action: topo_menu_action.moveToBack
                },
                {
                    title: '맨 뒤로 보내기',
                    action: topo_menu_action.bringToBack
                }
            ]
        },
        {
            local_burette: "rMenu_imgCopy",
            title: "도형복사",
            action: topo_menu_action.copyDraw
        },
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            hotKey: "Ctrl+D",
            action: topo_menu_action.del_drawTool
        }
    ],
    m_menu_text_multi: [
        {
            title: '텍스트스타일',
            action: topo_menu_action.showDrawTextTool
        },
        {
            local_burette: "rMenu_array",
            title: "정렬",
            code: "align",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "왼쪽맞춤",
                    action: topo_menu_action.align_vertical_left
                },
                {
                    title: "가운데맞춤",
                    action: topo_menu_action.align_vertical_center
                },
                {
                    title: "오른쪽맞춤",
                    action: topo_menu_action.align_vertical_right
                },
                {
                    title: "위쪽맞춤",
                    action: topo_menu_action.align_horizontal_top
                },
                {
                    title: "중간맞춤",
                    action: topo_menu_action.align_horizontal_middle
                },
                {
                    title: "아래쪽맞춤",
                    action: topo_menu_action.align_horizontal_bottom
                },
                {
                    title: "가로간격동일",
                    action: topo_menu_action.align_horizontalDivision
                },
                {
                    title: "세로간격동일",
                    action: topo_menu_action.align_verticalDivision
                }
            ]
        },
        {
            local_burette: "rMenu_orderChg",
            title: '표시순서변경',
            children_burette: "order",
            childrenItems: [
                {
                    title: '앞으로 가져오기',
                    action: topo_menu_action.moveToFront
                },
                {
                    title: '맨 앞으로 가져오기',
                    action: topo_menu_action.bringToFront
                },
                {
                    title: '뒤로 보내기',
                    action: topo_menu_action.moveToBack
                },
                {
                    title: '맨 뒤로 보내기',
                    action: topo_menu_action.bringToBack
                }
            ]
        },
        {
            local_burette: "rMenu_imgCopy",
            title: "도형복사",
            action: topo_menu_action.copyDraw
        },
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            hotKey: "Ctrl+D",
            action: topo_menu_action.del_drawTool
        }
    ],
    m_menu_text_area: [
        {
            title: '텍스트스타일',
            action: topo_menu_action.showDrawTextAreaTool
        },
        {
            local_burette: "rMenu_orderChg",
            title: '표시순서변경',
            children_burette: "order",
            childrenItems: [
                {
                    title: '앞으로 가져오기',
                    action: topo_menu_action.moveToFront
                },
                {
                    title: '맨 앞으로 가져오기',
                    action: topo_menu_action.bringToFront
                },
                {
                    title: '뒤로 보내기',
                    action: topo_menu_action.moveToBack
                },
                {
                    title: '맨 뒤로 보내기',
                    action: topo_menu_action.bringToBack
                }
            ]
        },
        {
            local_burette: "rMenu_imgCopy",
            title: "도형복사",
            action: topo_menu_action.copyDraw
        },
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            hotKey: "Ctrl+D",
            action: topo_menu_action.del_drawTool
        }
    ],
    m_menu_text_area_multi: [
        {
            title: '텍스트스타일',
            action: topo_menu_action.showDrawTextAreaTool
        },
        {
            local_burette: "rMenu_array",
            title: "정렬",
            code: "align",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "왼쪽맞춤",
                    action: topo_menu_action.align_vertical_left
                },
                {
                    title: "가운데맞춤",
                    action: topo_menu_action.align_vertical_center
                },
                {
                    title: "오른쪽맞춤",
                    action: topo_menu_action.align_vertical_right
                },
                {
                    title: "위쪽맞춤",
                    action: topo_menu_action.align_horizontal_top
                },
                {
                    title: "중간맞춤",
                    action: topo_menu_action.align_horizontal_middle
                },
                {
                    title: "아래쪽맞춤",
                    action: topo_menu_action.align_horizontal_bottom
                },
                {
                    title: "가로간격동일",
                    action: topo_menu_action.align_horizontalDivision
                },
                {
                    title: "세로간격동일",
                    action: topo_menu_action.align_verticalDivision
                }
            ]
        },
        {
            local_burette: "rMenu_orderChg",
            title: '표시순서변경',
            children_burette: "order",
            childrenItems: [
                {
                    title: '앞으로 가져오기',
                    action: topo_menu_action.moveToFront
                },
                {
                    title: '맨 앞으로 가져오기',
                    action: topo_menu_action.bringToFront
                },
                {
                    title: '뒤로 보내기',
                    action: topo_menu_action.moveToBack
                },
                {
                    title: '맨 뒤로 보내기',
                    action: topo_menu_action.bringToBack
                }
            ]
        },
        {
            local_burette: "rMenu_imgCopy",
            title: "도형복사",
            action: topo_menu_action.copyDraw
        },
        {
            local_burette: "rMenu_polDelete",
            title: "삭제",
            hotKey: "Ctrl+D",
            action: topo_menu_action.del_drawTool
        }
    ],
    m_menu_gridline: [
        {
            title: "눈금자표시/숨기기",
            action: topo_menu_action.view_gridaxis
        },
        {
            title: "눈금선표시/숨기기",
            action: topo_menu_action.view_gridline
        }
    ],
    m_menu_helpline: [
        {
            title: "안내선표시/숨기기",
            action: topo_menu_action.view_helpLine
        },
        {
            title: "세로안내선 추가",
            action: topo_menu_action.add_vHelpline
        },
        {
            title: "가로안내선 추가",
            action: topo_menu_action.add_hHelpline
        },
        // {
        //     title: "안내선색상 변경",
        //     action: topo_menu_action.chg_helpLine_color
        // },
        {
            title: "안내선 삭제",
            action: topo_menu_action.del_helpLine
        }

    ],
    m_menu_clock: [
        {
            title: "시계스타일변경",
            action: topo_menu_action.chg_digitClock
        }
    ],
    s_menu_ap: [
        {
            title: "AP상세정보",
            action: topo_menu_action.view_apDetail
        },
        {
            title: "Client현황",
            action: topo_menu_action.view_apClientStatus
        },
        {
            title: "AP 리셋",
            action: topo_menu_action.apResetStart
        }

    ],
    s_menu_sensor: [
        {
            title: "장비구성정보",
            action: topo_menu_action.view_devCpst
        }
    ],
    s_menu_was: [
        {
            title: "WAS상세정보",
            action: topo_menu_action.view_wasDetail
        }
    ],
    s_menu_dbms: [
        {
            title: "DBMS상세정보",
            action: topo_menu_action.view_dbmsDetail
        }
    ],
    s_menu_link: [
        {
            local_burette: "rMenu_polingIf",
            title: "폴링회선보기",
            action: topo_menu_action.view_ifView
        }
    ],
    s_menu_back: [
        {
            local_burette: "rMenu_highest",
            title: "최상위그룹",
            hotKey: "Alt+T",
//                icon: 'dtl_info',
            action: topo_menu_action.gotoTop
        },
        {
            local_burette: "rMenu_high",
            title: "상위그룹",
            hotKey: "Alt+U",
            action: topo_menu_action.gotoUp
        },
        {
            local_burette: "rMenu_mode",
            title: "모드변경",
            children_burette: "mode",
            action: function (elm, d, i) {

            },
            childrenItems: [
                {
                    title: "조회모드",
                    hotKey: "Ctrl+E",
                    action: topo_menu_action.modechg_search
                },
                {
                    title: "관리모드",
                    hotKey: "Ctrl+E",
                    action: topo_menu_action.modechg_manage
                }
            ]
        },
        {
            local_burette: "rMenu_group",
            title: "그룹보기",
            hotKey: "Alt+G",
            action: topo_menu_action.view_grp
        },
        {
            local_burette: "rMenu_gis",
            title: 'GIS보기',
            action: topo_menu_action.view_gis
        },
        {
            local_burette: "rMenu_devSearch",
            title: "장비찾기",
            hotKey: "Alt+F",
            action: topo_menu_action.findDev
        },
        {
            local_burette: "rMenu_imgSave",
            title: "이미지 저장",
            action: topo_menu_action.save_screenshot
        },
        {
            local_burette: "rMenu_clock",
            title: "디지털시계",
            hotKey: "Alt+D",
            action: topo_menu_action.view_digitClock
        },
        {
            local_burette: "rMenu_sound",
            title: "사운드On/Off",
            hotKey: "Alt+S",
            action: topo_menu_action.soundOnOff
        },
        {
            local_burette: "rMenu_slide",
            title: "슬라이드",
            hotKey: "Alt+V",
            action: topo_menu_action.slideGrpSet
        }//,
        // {
        //     local_burette: "rMenu_topoEx",
        //     title: "토폴로지 Export",
        //     action: topo_menu_action.exportMap
        // }
    ],
    s_menu_grp: [
        {
            local_burette: "rMenu_goGroup",
            title: "그룹들어가기",
            action: topo_menu_action.chgGrp
        },
        {
            local_burette: "rMenu_groupEvent",
            title: "그룹이벤트현황",
            action: topo_menu_action.view_grpEventList
        }

    ],
    s_menu_switch: [
        {
            title: "장비상세정보",
            action: function (elm, d, i) {
            },
            childrenItems: []
        },
        {
            title: "장비구성정보",
            action: function (elm, d, i) {
            },
            childrenItems: []
        },
        {
            title: "장애발생이력",
            action: function (elm, d, i) {
            },
            childrenItems: []
        },
        {
            title: "실시간이벤트",
            action: function (elm, d, i) {
            },
            childrenItems: []
        },
        {
            title: "운영도구",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "Ping",
                    action: topo_menu_action.tool_ping
                },
                {
                    title: "Tracert",
                    action: topo_menu_action.tool_tracert
                },
                // {
                //     title: "Telnet",
                //     action: topo_menu_action.tool_telnet
                // },
                {
                    title: "SSH",
                    action: topo_menu_action.tool_ssh
                },
                {
                    title: "Http",
                    action: topo_menu_action.tool_http
                },
                {
                    title: "Https",
                    action: topo_menu_action.tool_https
                }
            ]
        }
    ],
    s_menu_dev: [
        {
            title: "장비상세정보",
            action: topo_menu_action.view_devDetail
        },
        {
            title: "장비구성정보",
            action: topo_menu_action.view_devCpst
        },
        {
            title: "운영도구",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "Ping",
                    action: topo_menu_action.tool_ping
                },
                {
                    title: "Tracert",
                    action: topo_menu_action.tool_tracert
                },
                // {
                //     title: "Telnet",
                //     action: topo_menu_action.tool_telnet
                // },
                {
                    title: "SSH",
                    action: topo_menu_action.tool_ssh
                },
                {
                    title: "Http",
                    action: topo_menu_action.tool_http
                },
                {
                    title: "Https",
                    action: topo_menu_action.tool_https
                },
            ]
        },
    ],
    s_menu_svr: [
        {
            title: "서버상세정보",
            action: topo_menu_action.view_svrDetail
        },
        {
            title: "운영도구",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "Ping",
                    action: topo_menu_action.tool_ping
                },
                {
                    title: "Tracert",
                    action: topo_menu_action.tool_tracert
                },
                // {
                //     title: "Telnet",
                //     action: topo_menu_action.tool_telnet
                // },
                {
                    title: "SSH",
                    action: topo_menu_action.tool_ssh
                },
                {
                    title: "Http",
                    action: topo_menu_action.tool_http
                },
                {
                    title: "Https",
                    action: topo_menu_action.tool_https
                }
            ]
        }
    ],
    s_menu_ap_controller: [
        {
            title: "장비상세정보",
            action: function (elm, d, i) {
            },
            childrenItems: []
        },
        {
            title: "장비구성정보",
            action: function (elm, d, i) {
            },
            childrenItems: []
        },
        {
            title: "AP현황",
            action: function (elm, d, i) {
            },
            childrenItems: []
        },
        {
            title: "Client현황",
            action: function (elm, d, i) {
            },
            childrenItems: []
        },
        {
            title: "장애발생이력",
            action: function (elm, d, i) {
            },
            childrenItems: []
        },
        {
            title: "실시간이벤트",
            action: function (elm, d, i) {
            },
            childrenItems: []
        },
        {
            title: "운영도구",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "Ping",
                    action: topo_menu_action.tool_ping
                },
                {
                    title: "Tracert",
                    action: topo_menu_action.tool_tracert
                },
                // {
                //     title: "Telnet",
                //     action: topo_menu_action.tool_telnet
                // },
                {
                    title: "SSH",
                    action: topo_menu_action.tool_ssh
                },
                {
                    title: "Http",
                    action: topo_menu_action.tool_http
                },
                {
                    title: "Https",
                    action: topo_menu_action.tool_https
                }
            ]
        }
    ],
    s_menu_rack: [
        {
            title: "RACK정보",
            action: topo_menu_action.view_rackInfo
        }
    ],
    l_menu: [
        {
            title: "곡선편집종료",
            action: topo_menu_action.link_editCurveEnd
        }
    ],
    s_menu_none: [
        {
            title: "none",
            action: "none"
        }
    ],
    checkActionList: [
        {action: "add_grp", title: "그룹추가"},
        {action: "add_regGrp", title: "등록그룹추가"},
        {action: "add_regDev", title: "등록장비추가"},
        {action: "add_regSvr", title: "등록서버추가"},
        {action: "add_regSensor", title: "등록센서추가"},
        {action: "add_regRack", title: "등록RACK추가"},
        {action: "add_regAp", title: "등록AP추가"},
        {action: "add_regWas", title: "등록Was추가"},
        {action: "add_regDbms", title: "등록DBMS추가"},
        {action: "add_etcDev", title: "임의장비추가"},
        {action: "chg_bgImg", title: "배경이미지변경"},
        {action: "chgImg_byModel", title: "모델별 이미지 관리"},
        {action: "mgmtImg_bg", title: "배경 이미지 관리"},
        {action: "mgmtImg_icon", title: "아이콘 이미지 관리"},
        {action: "save_envSetting", title: "환경설정"},
        {action: "autoLinkRelation", title: "회선자동연결"},
        {action: "moveGrp", title: "그룹이동"},
        {action: "copyDev", title: "장비복사"},
        {action: "chg_iconInfo", title: "아이콘정보변경"},
        {action: "chg_iconType", title: "타입변경"},
        {action: "chg_iconImg", title: "아이콘이미지변경"},
        {action: "memo", title: "메모"},
        {action: "url_templet_set", title: "URL탬플릿설정"},
        {action: "copyGrp", title: "그룹복사"},
        {action: "chg_etcDevAttr", title: "임의장비속성변경"},
        {action: "chg_linkStyle", title: "회선스타일 변경"},
        {action: "polling_multiLink", title: "멀티회선폴링"},
        {action: "link_editCurveBegin", title: "곡선편집"},
        {action: "polling_link", title: "회선폴링"},
        {action: "chg_splineStyle", title: "선 스타일 변경"},
        {action: "add_link", title: "회선추가"},
        {action: "chg_iconSize", title: "아이콘크기변경"},
        {action: "chg_fontSize", title: "폰트크기변경"},
        {action: "chg_labelPosition", title: "명칭위치변경"},
        {action: "copyDraw", title: "도형복사"},
        {action: "showDrawShapeTool", title: "도형스타일"},
        // {action: "drawShapeText", title: "도형텍스트"},
        {action: "showDrawTextTool", title: "텍스트스타일"},
        {action: "showDrawTextAreaTool", title: "텍스트스타일(TextArea)"},
        {action: "chg_digitClock", title: "시계스타일변경"}
    ]

};
