var $nwTab,
TAB = {
	APP: 0,
	WORK: 1,
	AS: 2,
	ISP: 3,
	COUNTRY: 4
};

var Main = {
	/** variable */
	initVariable : function() {
		$nwTab = $('#nwTab');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {

		}
	},

	/** init design */
	initDesign : function() {
		$nwTab.on('created', function() {
				$(this).css('visibility', 'visible');
			})
			.jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
			initTabContent: function(tab) {
				switch(tab) {
					case TAB.APP: NwAppConf.initialize(); break;
                    case TAB.WORK: NwWorkConf.initialize(); break;
                    case TAB.AS: NwAsConf.initialize(); break;
                    case TAB.ISP: NwIspConf.initialize(); break;
                    case TAB.COUNTRY: NwCountryConf.initialize(); break;
				}
			}
		});
	},

	/** init data */
	initData: function() {

	}
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});