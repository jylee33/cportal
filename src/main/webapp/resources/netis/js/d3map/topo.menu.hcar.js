/**
 * 토폴로지 컨텍스트 메뉴
 */
var topo_menu = {
    m_menu_back: [
        {
            title: "최상위그룹",
            icon: 'list_icon',
            action: topo_menu_action.gotoTop
        },
        {
            title: "상위그룹",
            action: topo_menu_action.gotoUp
        },
        {
            title: "모드변경",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "조회모드",
                    action: topo_menu_action.modechg_search
                },
                {
                    title: "관리모드",
                    action: topo_menu_action.modechg_manage
                }
            ]
        },
        {
            title: "장비찾기",
            action: topo_menu_action.findDev
        },
        // {
        //     title: "초기화",
        //     action: function (elm, d, i) {
        //     },
        //     childrenItems: [
        //         {
        //             title: "맵초기화",
        //             action: topo_menu_action.init_map
        //         },
        //         {
        //             title: "위치초기화",
        //             action: topo_menu_action.init_pos
        //         }
        //     ]
        // },
        {
            title: "추가",
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
                    title: "임의장비추가",
                    action: topo_menu_action.add_etcDev
                }
            ]
        },
        {
            title: "변경",
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
            title: "Image 관리",
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
            title: "저장",
            action: topo_menu_action.save_map
        },
        {
            title: "환경설정",
            action: topo_menu_action.save_envSetting
        },
        {
            title: "토폴로지 Import",
            action: topo_menu_action.importMap
        },
        {
            title: "토폴로지 Tools",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "토폴로지 백업",
                    action: topo_menu_action.dumpToXML
                },
                {
                    title: "토폴로지 복원",
                    action: topo_menu_action.restoreFromDumpXML
                },
                {
                    title: "토폴로지 복원이력",
                    action: topo_menu_action.restoreHist
                }
            ]
        }
    ],
    m_menu_item: [
        {
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
        {
            title: "변경",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "별칭변경",
                    action: topo_menu_action.chg_alias
                },
                {
                    title: "아이콘크기변경",
                    action: topo_menu_action.chg_iconSize
                },
                {
                    title: "폰트크기변경",
                    action: topo_menu_action.chg_fontSize
                },
                {
                    title: "타입변경",
                    action: topo_menu_action.chg_iconType
                },
                {
                    title: "아이콘이미지변경",
                    action: topo_menu_action.chg_iconImg
                }
            ]
        },
        {
            title: "삭제",
            action: topo_menu_action.del_icon
        },
        {
            title: "메모",
            action: topo_menu_action.memo
        }
    ],
    m_menu_svr: [
        {
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
        {
            title: "변경",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "별칭변경",
                    action: topo_menu_action.chg_alias
                },
                {
                    title: "아이콘크기변경",
                    action: topo_menu_action.chg_iconSize
                },
                {
                    title: "폰트크기변경",
                    action: topo_menu_action.chg_fontSize
                },
                {
                    title: "타입변경",
                    action: topo_menu_action.chg_iconType
                },
                {
                    title: "아이콘이미지변경",
                    action: topo_menu_action.chg_iconImg
                }
            ]
        },
        {
            title: "삭제",
            action: topo_menu_action.del_icon
        },
        {
            title: "메모",
            action: topo_menu_action.memo
        }
    ],
    m_menu_grp: [
        {
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
        {
            title: "변경",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "그룹명변경",
                    action: topo_menu_action.chg_grpNm
                },
                {
                    title: "별칭변경",
                    action: topo_menu_action.chg_alias
                },
                {
                    title: "아이콘크기변경",
                    action: topo_menu_action.chg_iconSize
                },
                {
                    title: "폰트크기변경",
                    action: topo_menu_action.chg_fontSize
                },
                {
                    title: "아이콘이미지변경",
                    action: topo_menu_action.chg_iconImg
                }
            ]
        },
        {
            title: "명칭표시",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "ON",
                    action: topo_menu_action.chg_itemNmOn
                },
                {
                    title: "OFF",
                    action: topo_menu_action.chg_itemNmOff
                }
            ]
        },
        {
            title: "삭제",
            action: topo_menu_action.del_icon
        },
        {
            title: "메모",
            action: topo_menu_action.memo
        }
    ],
    m_menu_rack: [
        {
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
        {
            title: "변경",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "별칭변경",
                    action: topo_menu_action.chg_alias
                },
                {
                    title: "아이콘크기변경",
                    action: topo_menu_action.chg_iconSize
                },
                {
                    title: "폰트크기변경",
                    action: topo_menu_action.chg_fontSize
                },
                {
                    title: "아이콘이미지변경",
                    action: topo_menu_action.chg_iconImg
                }
            ]
        },
        {
            title: "삭제",
            action: topo_menu_action.del_icon
        },
        {
            title: "메모",
            action: topo_menu_action.memo
        }
    ],
    m_menu_multi_link: [
        {
            title: "Point추가",
            action: topo_menu_action.addPoint
        },
        {
            title: "회선스타일 변경",
            action: topo_menu_action.chg_linkStyle
        },
        {
            title: "멀티회선폴링",
            action: topo_menu_action.polling_multiLink
        },
        {
            title: "삭제",
            action: topo_menu_action.del_link
        }
    ],
    m_menu_curve_multi_link : [
        {
            title: "회선스타일 변경",
            action: topo_menu_action.chg_linkStyle
        },
        {
            title: "곡선편집",
            action: topo_menu_action.link_editCurveBegin
        },
        {
            title: "멀티회선폴링",
            action: topo_menu_action.polling_multiLink
        },
        {
            title: "삭제",
            action: topo_menu_action.del_link
        }
    ],
    m_menu_link: [
        {
            title: "Point추가",
            action: topo_menu_action.addPoint
        },
        {
            title: "회선스타일 변경",
            action: topo_menu_action.chg_linkStyle
        },
        {
            title: "회선폴링",
            action: topo_menu_action.polling_link
        },
        {
            title: "삭제",
            action: topo_menu_action.del_link
        }
    ],
    m_menu_curve_link : [
        {
            title: "회선스타일 변경",
            action: topo_menu_action.chg_linkStyle
        },
        {
            title: "곡선편집",
            action: topo_menu_action.link_editCurveBegin
        },
        {
            title: "회선폴링",
            action: topo_menu_action.polling_link
        },
        {
            title: "삭제",
            action: topo_menu_action.del_link
        }
    ],
    m_menu_two_item: [
        {
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
        {
            title: "회선추가",
            action: topo_menu_action.add_link
        },
        {
            title: "변경",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "아이콘크기변경",
                    action: topo_menu_action.chg_iconSize
                },
                {
                    title: "폰트크기변경",
                    action: topo_menu_action.chg_fontSize
                },
                {
                    title: "아이콘이미지변경",
                    action: topo_menu_action.chg_iconImg
                }
            ]
        },
        {
            title: "정렬",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "가로정렬",
                    action: topo_menu_action.align_horizontal
                },
                {
                    title: "세로정렬",
                    action: topo_menu_action.align_vertical
                }
            ]
        },
        {
            title: "삭제",
            action: topo_menu_action.del_multiIcon
        }
    ],
    m_menu_multi_item: [
        {
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
        {
            title: "변경",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "아이콘크기변경",
                    action: topo_menu_action.chg_iconSize
                },
                {
                    title: "폰트크기변경",
                    action: topo_menu_action.chg_fontSize
                },
                {
                    title: "아이콘이미지변경",
                    action: topo_menu_action.chg_iconImg
                }
            ]
        },
        {
            title: "정렬",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "가로정렬",
                    action: topo_menu_action.align_horizontal
                },
                {
                    title: "세로정렬",
                    action: topo_menu_action.align_vertical
                },
                {
                    title: "수평간격나누기",
                    action: topo_menu_action.align_horizontalDivision
                },
                {
                    title: "수직간격나누기",
                    action: topo_menu_action.align_verticalDivision
                }
            ]
        },
        {
            title: "삭제",
            action: topo_menu_action.del_multiIcon
        }
    ],
    m_menu_point: [
        {
            title: "삭제",
            action: topo_menu_action.del_point
        },
        {
            title: "메모",
            action: topo_menu_action.memo
        }
    ],
    m_menu_etc: [
        {
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
        {
            title: "변경",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "임의장비속성변경",
                    action: topo_menu_action.chg_etcDevAttr
                },
                {
                    title: "별칭변경",
                    action: topo_menu_action.chg_alias
                },
                {
                    title: "아이콘크기변경",
                    action: topo_menu_action.chg_iconSize
                },
                {
                    title: "폰트크기변경",
                    action: topo_menu_action.chg_fontSize
                },
                {
                    title: "타입변경",
                    action: topo_menu_action.chg_iconType
                },
                {
                    title: "아이콘이미지변경",
                    action: topo_menu_action.chg_iconImg
                }
            ]
        },
        {
            title: "삭제",
            action: topo_menu_action.del_icon
        },
        {
            title: "메모",
            action: topo_menu_action.memo
        }
    ],
    m_menu_other: [
        {
            title: "그룹이동",
            action: topo_menu_action.moveGrp
        },
        {
            title: "변경",
            action: function (elm, d, i) {
            },
            childrenItems: [
                {
                    title: "별칭변경",
                    action: topo_menu_action.chg_alias
                },
                {
                    title: "아이콘크기변경",
                    action: topo_menu_action.chg_iconSize
                },
                {
                    title: "폰트크기변경",
                    action: topo_menu_action.chg_fontSize
                },
                {
                    title: "아이콘이미지변경",
                    action: topo_menu_action.chg_iconImg
                }
            ]
        },
        {
            title: "삭제",
            action: topo_menu_action.del_icon
        },
        {
            title: "메모",
            action: topo_menu_action.memo
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
        }
    ],
    s_menu_sensor: [
        {
            title: "장비구성정보",
            action: topo_menu_action.view_devCpst
        }
    ],
    s_menu_link: [
        {
            title: "폴링회선보기",
            action: topo_menu_action.view_ifView
        }
    ],
    s_menu_back: [
        {
            title: "최상위그룹",
//                icon: 'dtl_info',
            action: topo_menu_action.gotoTop
        },
        {
            title: "상위그룹",
            action: topo_menu_action.gotoUp
        },
        {
            title: "모드변경",
            action: function (elm, d, i) {

            },
            childrenItems: [
                {
                    title: "조회모드",
                    action: topo_menu_action.modechg_search
                },
                {
                    title: "관리모드",
                    action: topo_menu_action.modechg_manage
                }
            ]
        },
        {
            title: "그룹보기",
            action: topo_menu_action.view_grp
        },
        {
            title: "장비찾기",
            action: topo_menu_action.findDev
        },
        {
            title: "이미지 저장",
            action: topo_menu_action.save_screenshot
        },
        {
            title: "토폴로지 Export",
            action: topo_menu_action.exportMap
        }
    ],
    s_menu_grp: [
        {
            title: "그룹들어가기",
            action: topo_menu_action.chgGrp
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
                {
                    title: "Telnet",
                    action: topo_menu_action.tool_telnet
                },
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
                {
                    title: "Telnet",
                    action: topo_menu_action.tool_telnet
                },
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
                {
                    title: "Telnet",
                    action: topo_menu_action.tool_telnet
                },
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
                {
                    title: "Telnet",
                    action: topo_menu_action.tool_telnet
                },
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
    ]
};