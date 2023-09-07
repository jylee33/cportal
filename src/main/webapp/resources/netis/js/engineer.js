var Engineer = {
		/** variable */
		initVariable: function() {
			$('#content').css('display', 'block');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Engineer.eventControl(event); });
			$('ul.sysmenu > li').on('click', function(event) {Engineer.eventControl(event); })
		},
		
		/** event handler */
		eventControl: function(event) {

			var curTarget = event.currentTarget;

			if(curTarget.id.startsWith('sysmenu_')) {

				var _page = curTarget.id.replace('sysmenu_', '') + '.do';
				var _menuNm = curTarget.innerText;

				$('ul.sysmenu > li').removeClass();
				$(curTarget).addClass('active');
				$('.sub_title').text(_menuNm);
				this.gotoPage(_page, _menuNm);

			}else {

			}


			switch(curTarget.id) {
			
			}
		},



		/** init design */
		initDesign: function() {
			// $('#menu').jqxMenu({ width: '100%', height: 30, theme: jqxTheme });
		},
		
		/** init data */
		initData: function() {
			this.gotoPage('sysConf.do', '시스템설정');
		},
		
		gotoPage: function(page, menuNm) {

			$('#contents').load(ctxPath + '/engineer/' + page, function(response, status, xhr) {
				if(status == 'error') {
					$('#contents').html('페이지를 불러 올 수 없습니다.');
					return;
				}
				$('#menuTxt').text(menuNm);
			});

		}
		
};

$(function() {
	Engineer.initVariable();
	Engineer.observe();
	Engineer.initDesign();
	Engineer.initData();
});