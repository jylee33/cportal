/**
 * GIS토폴로지 컨텍스트 메뉴 Action
 */
var gis_menu_action = {
    /** 최상위그룹 */
    gotoTop: function (elm, d, objTopo) {
        console.log(elm, d, objTopo);
        if(objTopo.vars.curGrpNo == objTopo.vars.topGrpNo) {
            alert("최상위 그룹입니다.");
            return;
        }

        objTopo.vars.curGrpNo = objTopo.vars.topGrpNo;
        objTopo.search.call(objTopo);
    },

    /** 상위그룹 */
    gotoUp: function (elm, d, objTopo) {
        if(objTopo.vars.curGrpNo == objTopo.vars.topGrpNo) {
            alert("최상위 그룹입니다.");
            return;
        }

        Server.get("/d3map/topo/getParentGrpNo.do", {
            data: { grpNo: objTopo.vars.curGrpNo, userId: objTopo.vars.sessUserId },
            success: function(result) {
                objTopo.vars.curGrpNo = result;
                objTopo.search.call(objTopo);
            }
        });
    }
    
};