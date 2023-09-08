
var ctxPath;
var PMain = {
		/** variable */
		initVariable: function() {
			ctxPath = $('#ctxPath').val();
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { PMain.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'pbtnClose': self.close(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
            $('#cbPrivacyList').jqxDropDownList({
                width: '100%', height: '21px', dropDownHeight: 100, theme: jqxTheme,
                source: HmDropDownList.getSourceByUrl('/main/com/privacyPolicy/getPrivacyPolicyList.do', {policyType: 0}),
                displayMember: 'title', valueMember: 'content', selectedIndex: 0
            }).on('change', function(event){
                $('#p_content').html((event.args.item.value).htmlCharacterUnescapes());
			});
		},
		
		/** init data */
		initData: function() {
            PMain.search();
		},

		search: function() {
            Server.get('/main/com/privacyPolicy/getPrivacyPolicyList.do', {
                data: { policyType: 0, accountYn: 'Y'},
                success: function(data) {
                    if(data != null) {

                        $('#p_content').html((data[0].content).htmlCharacterUnescapes())
                    }
                }
            });
		}
		
};

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});
