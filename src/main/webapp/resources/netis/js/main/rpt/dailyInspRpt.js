var $mainTab,
    TAB = {
        IFRPT: 0,
        WEEK: 1,
        TOP10: 2,
    };

var Main = {
    /** variable */
    initVariable: function () {
        $mainTab = $('#mainTab');
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {

        }
    },

    /** init design */
    initDesign: function () {

        $mainTab.on('created', function () {
            $(this).css('visibility', 'visible');
        })
            .jqxTabs({
                width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
                initTabContent: function (tab) {
                    switch (tab) {
                        case TAB.IFRPT:
                            IfRpt.initialize();
                            break;
                        case TAB.WEEK:
                            WeeklyRpt.initialize();
                            break;
                        case TAB.TOP10:
                            Top10.initialize();
                            break;
                    }
                }
            });
    },

    /** init data */
    initData: function () {
    }

};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});