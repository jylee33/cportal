/**
 * Created by Leeyouje on 2023-05-13.
 */
var Main = {
    initVariable: function(){},
    observe: function(){
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },
    eventControl : function(event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch': this.search(); break;
            case 'btnShowPopup': this.showPopup(); break;
        }
    },
    initDesign: function(){
        pAbnlDtcDonutChart.initDesign();
        pAbnlDtcNetworkTopN.initDesign();
        pAbnlDtcNetworkWeakPoint.initDesign();
        pAbnlDtcServerTopN.initDesign();
        pAbnlDtcServerWeakPoint.initDesign();
        pAbnlDtcErrHistory.initDesign();//이상탐지발생이력
        pAbnlDtcStatusCnt.initDesign();//이상탐지발생 현황
        pAbnlDtcEventGrid.initDesign();
        //pAbnlDtcNetworkChart.initDesign();
    },
    initData: function(){
        pAbnlDtcDonutChart.initData();
        pAbnlDtcNetworkTopN.initData();
        pAbnlDtcNetworkWeakPoint.initData();
        pAbnlDtcServerTopN.initData();
        pAbnlDtcServerWeakPoint.initData();
        pAbnlDtcErrHistory.initData();
        pAbnlDtcStatusCnt.initData();
        pAbnlDtcEventGrid.initData();
       // pAbnlDtcNetworkChart.initData();
    },
    search: function(){
        console.log('조회');
        pAbnlDtcDonutChart.searchAll();
        pAbnlDtcNetworkTopN.searchAll();
        pAbnlDtcNetworkWeakPoint.searchAll();
        pAbnlDtcServerTopN.searchAll();
        pAbnlDtcServerWeakPoint.searchAll();
        pAbnlDtcEventGrid.searchAll();
        pAbnlDtcErrHistory.searchAll();
        pAbnlDtcStatusCnt.search();
       // pAbnlDtcNetworkChart.searchAll();

    },
    showPopup: function(){
        HmUtil.createPopup('/main/popup/errFree/pAbnlDtcDetail.do', $('#hForm'), 'pAbnlDtcDetail', 1300, 700, null);
    },

}

$(function(){
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});
