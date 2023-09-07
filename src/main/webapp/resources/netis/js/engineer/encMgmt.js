var Main = {

		/** variable */
		initVariable: function() {

		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSave': this.save(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			$('#appWin').jqxExpander({ width: '100%', showArrow: false, toggleMode: 'none', theme: jqxTheme,
				initContent: function() {
					// combobox
					$('#p_old_encrypt').jqxComboBox({width: 100, height: 21, selectedIndex: 0,
						source: [{label: "None", value: "NONE"}, {label: "Aria256", value: "ARIA256"}]
					});
                    $('#p_new_encrypt').jqxComboBox({width: 100, height: 21, selectedIndex: 0,
						source: [{label: "Sha-256", value: "SHA256"}]
					});
				}
			});
		},
		
		/** init data */
		initData: function() {

		},

		save: function() {
			var old_encrypt = $('#p_old_encrypt').jqxComboBox('getSelectedItem'),
				new_encrypt = $('#p_new_encrypt').jqxComboBox('getSelectedItem');

			if(old_encrypt.value == new_encrypt.value) {
				alert('기존 암호화 방식과 신규 암호화 방식이 동일합니다.');
				return;
			}

			if(!confirm('[{0}] 방식에서 [{1}] 방식으로 암호화 하시겠습니까?'.substitute(old_encrypt.label, new_encrypt.label))) return;

			Server.post('/engineer/encMgmt/saveUserPwdEncrypt.do', {
				data: {oldEncrypt: old_encrypt.value, newEncrypt: new_encrypt.value},
				success: function(result) {
					alert(JSON.stringify(result));
				}
			});

		}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});