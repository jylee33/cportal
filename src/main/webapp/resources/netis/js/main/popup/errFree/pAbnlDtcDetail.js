/**
 * Created by Leeyouje on 2023-05-13.
 */
var $btnChgInfo, $dtlTab, $pGrpTree;
var dtlTabIndex;
$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});

var PMain = {
    /** variable */
    initVariable: function () {
        $btnChgInfo = $("#btnChgInfo");
        $dtlTab = $('#dtlTab');
        $pGrpTree = $('#p_grpTree');
        dtlTabIndex = 0;
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            PMain.eventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch':
                this.search();
                break;
        }
    },

    /** init design */
    initDesign: function () {
        // 메인텝
        $dtlTab.jqxTabs({
            width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function (tab) {
                switch (tab) {
                    case 0: // 요약
                        $btnChgInfo.hide();
                        // HmJqxSplitter.create($('#p_basicSp1'), HmJqxSplitter.ORIENTATION_V, [{size: '30%'}, {size: '70%'}], '100%', '100%', {showSplitBar: false});
                        // HmJqxSplitter.create($('#p_basicSp2'), HmJqxSplitter.ORIENTATION_V, [{size: '40%'}, {size: '60%'}], '100%', '100%', {showSplitBar: false});
                        break;
                    case 1: // 탐지상세
                        $btnChgInfo.hide();
                        HmJqxSplitter.create($('#p_detectSp1'), HmJqxSplitter.ORIENTATION_V, [{size: '50%'}, {size: '50%'}], '100%', '100%', {showSplitBar: false});
                        break;
                    case 2: // 이상장비
                        $btnChgInfo.hide();
                        HmJqxSplitter.create($('#p_abnlDevSp1'), HmJqxSplitter.ORIENTATION_V, [{size: '50%'}, {size: '50%'}], '100%', '100%', {showSplitBar: false});
                        HmJqxSplitter.create($('#p_abnlDevSp2'), HmJqxSplitter.ORIENTATION_H, [{size: '65%'}, {size: '35%'}], '100%', '100%', {showSplitBar: false});
                        break;
                    case 3: // 지표분석
                        $btnChgInfo.hide();

                        break;
                    case 4: // 대응방안
                        $btnChgInfo.show();
                        HmJqxSplitter.create($('#p_resPlanSp1'), HmJqxSplitter.ORIENTATION_V, [{
                            size: 300,
                            min: 150,
                            collapsible: false
                        }, {size: '100%'}], 'auto', '96.5%', {showSplitBar: false});
                        HmTreeGrid.create($pGrpTree, HmTree.T_GRP_DEFAULT2, PMain.selectTree, { devKind1: 'DEV' });
                        break;
                }
            }
        }).on('selected', function (event) {
            var selectedTab = event.args.item;
            dtlTabIndex = selectedTab;
            console.log("selectedTab")
            console.log(selectedTab)
            PMain.buttonShowHide(selectedTab);
        });
    },

    /** init data */
    initData: function () {
    },
    selectTree: function(){
        console.log('tree search');
    },
    search: function(){
        console.log('조회');
    },

    buttonShowHide: function (tab) {
        switch (tab) {
            case 0: // 요약
                $btnChgInfo.hide();
                break;
            case 1: // 탐지상세
                $btnChgInfo.hide();
                break;
            case 2: // 이상장비
                $btnChgInfo.hide();
                break;
            case 3: // 지표분석
                $btnChgInfo.hide();
                break;
            case 4: // 대응방안
                $btnChgInfo.show();
                break;
        }
    }
};
