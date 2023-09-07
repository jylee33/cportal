/**
 * 부산교통공사 토폴로지 컨텍스트 메뉴 Action
 */
var popup = null;

var humetro_menu_action = {

    /* 게이트 상세 */
    detail_gate: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/huMetro/popup/pDetailGate.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '게이트상세', result, 725, 620, 'pwindow_init', {data: d, objTopo: objTopo});
            }
        );

    },

    /* 보충기 상세 */
    detail_supplement: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/huMetro/popup/pDetailSupplement.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '보충기상세', result, 810, 620, 'pwindow_init', {data: d, objTopo: objTopo});
            }
        );
    },

    /* 발매기 상세 */
    detail_ticketm: function (elm, d, i, objTopo) {
        HmWindow.close($('#pwindow'));
        $.post('/huMetro/popup/pDetailTicketM.do',
            function (result) {
                HmWindow.openFit($('#pwindow'), '발매기상세', result, 774, 620, 'pwindow_init', {data: d, objTopo: objTopo});
            }
        );
    },

};
