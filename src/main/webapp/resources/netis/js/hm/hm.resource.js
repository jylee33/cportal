var HmResource = {

    vsvr_eng_ver_list: ['vSphere5.1', 'vSphere5.5', 'vSphere6.0'],

    // first_page_ver: ['None', 'Standard', 'Layout'],
    // first_page_ver: ['None', 'Standard', 'Widget'],
    first_page_ver: ['None', 'Standard'],

    /* Master.js 에서 초기화*/
    evt_level_list: [],

    syslog_severity_list: [
        {label: 'Emergency', value: 0},
        {label: 'Alert', value: 1},
        {label: 'Critical', value: 2},
        {label: 'Error', value: 3},
        {label: 'Warning', value: 4},
        {label: 'Notice', value: 5},
        {label: 'Informational', value: 6},
        {label: 'Debug', value: 7}
    ],

    evtlog_logname_list: [
        {label: '응용 프로그램', value: 'Application'},
        {label: '하드웨어 이벤트', value: 'HardwareEvents'},
        {label: 'Internet Explorer', value: 'Internet Explorer'},
        {label: '키 관리 서비스', value: 'Key Management Service'},
        {label: 'Microsoft Office Alerts', value: 'OAlerts'},
        {label: 'PreEmptive', value: 'PreEmptive'},
        {label: '시스템', value: 'System'},
        {label: 'Windows PowerShell', value: 'Windows PowerShell'},
        {label: '보안', value: 'Security'},
    ],

    evtlog_entrytype_list: [
        {label: '정보', value: 'Information'},
        {label: '경고', value: 'Warning'},
        {label: '오류', value: 'Error'},
        {label: '감사 성공', value: 'SuccessAudit'},
        {label: '감사 실패', value: 'FailureAudit'}
    ],

    use_flag_list: [
        {label: '미사용', value: 0},
        {label: '사용', value: 1}
    ],

    /** topology */
    topo_line_style_list: [
        {label: '실선', value: ""},
        {label: '점선', value: "3,3"},
        {label: '파선-점선', value: "10,5,3,5"},
        {label: '긴파선-점선', value: "20,10,5,10"}
    ],

    /** tms */
    protocol_list: [
        {label: 'ALL', value: 0},
        {label: 'TCP', value: 6},
        {label: 'UDP', value: 17}
    ],

    protocol_list2: [
        {label: 'ICMP', value: 1},
        {label: 'TCP', value: 6},
        {label: 'UDP', value: 17}
    ],

    tcpflag_list: [
        {label: 'NUL', value: 0},
        {label: 'FIN', value: 1},
        {label: 'SYN', value: 2},
        {label: 'RST', value: 4},
        {label: 'PSH', value: 8},
        {label: 'ACK', value: 16},
        {label: 'URG', value: 32}
    ],

    period_tms_short_list: [
        {label: '최근5분', value: '5m'},
        {label: '최근10분', value: '10m'},
        {label: '사용자설정', value: '-1'}
    ],

    period_tms_long_list: [
        {label: '최근1시간', value: '1h'},
        {label: '일간', value: '0d'},
        {label: '주간', value: '6d'},
        {label: '월간', value: '30d'},
        {label: '사용자설정', value: '-1'}
    ],

    period_middle_list: [
        {label: '최근10분', value: '9m'},
        {label: '최근30분', value: '29m'},
        {label: '최근1시간', value: '1h'},
        {label: '사용자설정', value: '-1'}
    ],

    dev_itemtype_list: [
        {label: 'CPU', value: '1'},
        {label: 'MEMORY', value: '2'},
        {label: '온도', value: '5'},
        {label: '응답시간', value: '6'},
        {label: '세션', value: '11'},
        {label: 'CPS', value: '14'}
    ],
    if_itemtype_list: [
        {label: 'bps', value: 'BPS'},
        {label: 'bps(%)', value: 'BPSPER'},
        {label: 'pps', value: 'PPS'},
        {label: 'error', value: 'ERR'}
        // {label: 'error', value: 'CRC'},
        // {label: 'error', value: 'COL'},
    ],
    if_itemtype_all: [
        {label: 'bps', value: 'BPS'},
        {label: 'bps(%)', value: 'BPSPER'},
        {label: 'pps', value: 'PPS'},
        {label: 'error', value: 'ERR'},
        {label: 'CRC', value: 'CRC'},
        {label: 'COLLISION', value: 'COLLISION'}
    ],
    if_itemtype_main: [
        {label: 'IN BPS', value: 'IN_BPS'},
        {label: 'OUT BPS', value: 'OUT_BPS'},
    ],
    svr_itemtype_list: [
        {label: 'CPU', value: 'CPU'},
        {label: 'MEMORY', value: 'MEM'},
        {label: 'FILESYSTEM', value: 'FS'},
        {label: 'NETWORK', value: 'NETWORK'},
        {label: 'DISK', value: 'DISK'}
    ],

    svr_cpuKind_list: [
        {label: 'IDLE', value: 'IDLE_PCT', unit: '%'},
        {label: 'IOWAIT', value: 'IOWAIT_PCT', unit: '%'},
        {label: 'IRQ', value: 'IRQ_PCT', unit: '%'},
        {label: 'NICE', value: 'NICE_PCT', unit: '%'},
        {label: 'SOFTIRQ', value: 'SOFTIRQ_PCT', unit: '%'},
        {label: 'STEAL', value: 'STEAL_PCT', unit: '%'},
        {label: 'SYSTEM', value: 'SYSTEM_PCT', unit: '%'},
        {label: 'USER', value: 'USER_PCT', unit: '%'}
    ],
    svr_memoryKind_list: [
        {label: '물리 사용량', value: 'PHYSICAL_USED_SIZE', unit: ''},
        {label: '물리 사용률', value: 'PHYSICAL_USED_PCT', unit: '%'},
        {label: 'SWAP 사용량', value: 'SWAP_USED_SIZE', unit: ''},
        {label: 'SWAP 사용률', value: 'SWAP_USED_PCT', unit: '%'}
    ],
    svr_filesystemKind_list: [
        {label: '사용량', value: 'USED_SIZE', unit: ''},
        {label: '사용률', value: 'USED_PCT', unit: '%'}
    ],
    svr_networkKind_list: [
        {label: 'BPS', value: 'BPS', unit: ''},
        {label: 'PPS', value: 'PPS', unit: '%'},
    ],
    svr_diskKind_list: [
        {label: '사용량', value: 'BYTES', unit: '1024'},
        {label: '사용건', value: 'COUNT', unit: ''}
    ],
    svr_vulners_srch_type: [
        {label: 'IP', value: 'IP'},
        {label: '장비', value: 'NAME'},
        {label: '종류', value: 'DEVKIND2'}
    ],

    /* 장비설정 */
    icmp_poll_list: [
        {label: 'NONE', value: 0},
        {label: 'Both', value: 3},
        {label: 'ICMP', value: 1},
        {label: 'SNMP', value: 2}
    ],

    snmp_ver_list: [
        {label: 'Ver3', value: 3},
        {label: 'Ver2', value: 2},
        {label: 'Ver1', value: 1}
    ],

    snmp_security_level_list: [
        {label: 'NoAuthNoPriv', value: 0},
        {label: 'AuthNoPriv', value: 1},
        {label: 'AuthPriv', value: 2}
    ],

    snmp_auth_type_list: [
        {label: 'SHA', value: 1},
        {label: 'MD5', value: 2}
    ],

    snmp_encrypt_type_list: [
        {label: 'AES', value: 1},
        {label: 'DES', value: 2},
        {label: 'AES192', value: 3},
        {label: 'AES256', value: 4}
    ],

    connect_mode_list: [
        {label: 'SSH', value: 'SSH'},
        // {label: 'SSH|TFTP', value: 'SSH|TFTP'},
        {label: 'TELNET', value: 'TELNET'},
        // {label: 'Telnet|TFTP', value: 'Telnet|TFTP'}
    ],

    char_code_list: [
        {label: 'utf-8', value: 0},
        {label: 'euc_kr', value: 1}
    ],

    cond_perf_val: [
        {label: '최대', value: 'MAX'},
        {label: '평균', value: 'AVG'},
        {label: '최소', value: 'MIN'}
    ],

    cond_topn_cnt: [
        {label: '5EA', value: 5},
        {label: '10EA', value: 10},
        {label: '20EA', value: 20}
    ],

    cond_srch_type: [
        {label: 'IP', value: 'IP'},
        {label: '장비', value: 'NAME'}
    ],


    cond_ip_srch_type: [
        {label: 'IP', value: 'IP'},
        {label: '이용기관', value: 'USE_AGENCY'}
    ],


    cond_period_srch_type: [
        {label: '일', value: '1D'},
        {label: '월', value: '1M'}
    ],

    cond_dev_srch_type: [
        {label: 'IP', value: 'IP'},
        {label: '장비', value: 'NAME'},
        {label: '종류', value: 'DEVKIND2'},
        {label: '제조사', value: 'VENDOR'},
        {label: '모델', value: 'MODEL'}
    ],
    cond_dev_srch_type2: [
        {label: 'IP', value: 'IP'},
        {label: '장비', value: 'NAME'},
        {label: '제조사', value: 'VENDOR'},
        {label: '모델', value: 'MODEL'}
    ],

    cond_nps_srch_type2: [
        {label: '이용기관', value: 'USE_AGENCY'},
        {label: '처리상태', value: 'STATE'},
    ],

    cond_kub_srch_type: [
        {label: '클러스터명', value: 'CLUSTER_NM'},
        {label: '네임스페이스명', value: 'NAMESPACE_NM'}
    ],


    cond_perf_cycle: [
        {label: '5분', value: 1},
        {label: '1시간', value: 2},
        {label: '1일', value: 3}
    ],

    cond_realtime_time: [
        {label: '1분', value: 1},
        {label: '5분', value: 5},
        {label: '10분', value: 10},
        {label: '20분', value: 20},
        {label: '계속', value: 0}
    ],

    cond_realtime_perf_cycle: [
        {label: '1초', value: 1},
        // {label: '2초', value: 2},
        {label: '5초', value: 5},
        {label: '10초', value: 10},
        {label: '30초', value: 30},
        {label: '60초', value: 60}
    ],

    cond_realtime_perf_xaxis_cnt: [
        {label: '10개', value: 10},
        {label: '20개', value: 20},
        {label: '30개', value: 30},
        {label: '50개', value: 50},
        {label: '100개', value: 100}
    ],

    cond_inout_type: [
        {label: 'IN', value: 'I'},
        {label: 'OUT', value: 'O'}
    ],
    cond_check_flag: [
        {label: '설정', value: 1},
        {label: '해제', value: 0}
    ],

    predict_type_list: [
        {label: '통계예측', value: 'STATS'},
        {label: '머신러닝예측', value: 'ML'}
    ],
    predict_dev_itemtype_list: [
        {label: 'CPU/MEM', value: 0},
        {label: '응답시간/온도', value: 1}
    ],
    predict_dev_ksa_itemtype_list: [
        {label: 'CPU/MEM', value: 0},
        {label: '온도', value: 1}
    ],
    predict_if_itemtype_list: [
        {label: 'In/Out bps', value: 0},
        {label: 'In/Out pps', value: 1}
    ],
    predict_err_range_list: [
        {label: '5%', value: 0.05},
        {label: '10%', value: 0.1}
    ],
    fms_itg_equip_type: [
        // {label: '설비종류', value: 'SENSOR_KIND'},
        {label: '주장치명', value: 'DEV_NAME'},
        {label: 'IP', value: 'DEV_IP'},
        {label: '설비명', value: 'SENSOR_NAME'},
    ],
    topo_line_effect_type: [
        // {label: '설비종류', value: 'SENSOR_KIND'},
        {label: '사용안함', value: 'None'},
        {label: '정방향', value: 'Forward'},
        {label: '역방향', value: 'Backward '}
    ],
    topo_line_marker: [
        // {label: '설비종류', value: 'SENSOR_KIND'},
        {label: '사용안함', value: 'none'},
        {label: '원', value: 'circle'},
        {label: '사각형', value: 'square'},
        {label: '화살표', value: 'arrow'}
    ],

    cond_neis_srch_type: [
        {label: '지원청', value: 'EDUCENTER'},
        {label: '그룹명', value: 'GRP_NAME'},
        {label: 'NEIS', value: 'NEIS'},
        {label: '전용회선', value: 'GRP_KEY'}
    ],

    cond_process_srch_type: [
        {label: 'IP', value: 'IP'},
        {label: '장비', value: 'NAME'},
        {label: '프로세스', value: 'PROC_NAME'}
    ],

    perf_compare_srch_type: [
        {label: '24H', value: 'DAY'},
        {label: '1W', value: 'WEEK'}
    ],

    perf_work_time_type: [
        {label: '전체', value: 0},
        {label: '업무시간', value: 1},
        {label: '업무시간(점심제외)', value: 2}
    ],

    getResource: function (resourceId, isIncAll) {
        var arr = JSON.parse(JSON.stringify(this[resourceId]));
        if (isIncAll !== undefined && isIncAll) {
            arr.unshift({label: '전체', value: 'ALL'});
        }
        return arr;
    },

    getLabelByValue: function (resourceId, value) {
        var arr = this[resourceId];
        if (arr != null) {
            var _label = null;
            $.each(arr, function (i, v) {
                if (v.value == value) {
                    _label = v.label;
                    return false;
                }
            });
            return _label;
        }
        return null;
    }
};

var HmConst = {
    rack: {
        type_server: 1,		// 서버랙
        type_com: 2		// 통신랙
    },

    upload_file_kind: {
        evt_log: 1,		// 이벤트로그
        evt_rpt: 2			// 이벤트보고서
    },

    asset_mgr_flag: {
        sys_reg: 1,		//시스템등록
        user_reg: 2,		//사용자등록
        del: -1			//삭제
    },

    period_type: {
        short: 1,
        middle: 2,
        long: 3,
        cstrf: 4,
        devif: 5,
        hist: 6,
        tms_short: 7,
        tms_long: 8
    },

    SLA_STATE_CD: {
        //NONE -> 소명신청 -> 검토중 -> 반려 -> 보완완료(재요청) -> 소명거부 -> 소명완료
        NONE: 0, REQ: 1, CHECK: 2, RETURN: 3, REREQ: 4, REJECT: 5, APPROVE: 6
    },

    trf_type: {
        total: 'TOTAL',
        protocol: 'PROTOCOL',
        port: 'PORT',
        tcpflag: 'TCPFLAG'
    },

};


var SiteEnum = {
    None: 'None', Netis3: 'Netis3', Netis380: 'Netis380', HyundaiCar: 'HyundaiCar',
    HI: 'HI'
};

var DevPerfType = {
    CPU: '1', MEMORY: '2', TEMP: '5', RESP: '6', SESSION: '11', CPS: '14'
};

var IfPerfType = {
    BPS: 'BPS', BPSPER: 'BPSPER', PPS: 'PPS', ERR: 'ERR', CRC: 'CRC', COL: 'COL',
    DISCARD: 'DISCARD', NONUNICAST: 'NONUNICAST', MULTICAST: 'MULTICAST', BROADCAST: 'BROADCAST'
};

var perfTypeForCode = {
    PERF_05: '1', PERF_06: '2', PERF_14: '5',
    PERF_01: 'INBPS', PERF_02: 'OUTBPS', PERF_03: 'INPPS', PERF_04: 'OUTPPS'
};

var TcpPerfType = {
    SVR: 'SVR', PORT: 'PORT'
};
