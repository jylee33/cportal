var TopoConst = {

		mapMode: {
			SEARCH: 0,		//조회모드
			MANAGE: 1,		//편집모드
			LINE_EDIT: 2	//회선편집모드
		},

		viewType: {
			TOPO: 'TOPO',
			GIS: 'GIS'
		},

		lineType: {
			linear: "1",	    //직선
			curve: "2",	        //곡선
			fixUpCurve: "3",	//고정상향곡선
			fixDwCurve: "4",	//고정하향곡선
			fixDbCurve: "5"		//고정쌍곡선
		},

		lineColorMode: {
			EVT: 'EVT',
			SPEED: 'SPEED'
		},

		evtLvl: {
			none: 1,		// 정상
			info: 2,		// 정보
			warning: 3,	// 주의
			minor: 4,	// 알람
			major: 5,	// 경보
			critical: 6,	// 장애
			action: -1,	// 조치중
			work: -2		// 작업중
		},

		evtLvlString: {
			level_2: '작업중',
			level_1: '조치중',
			level1: '정상',
			level2: '정보',
			level3: '주의',
			level4: '알람',
			level5: '경보',
			level6: '장애'
		},

		evtLvlColor: {
			level2: $("#gEvtNormal").val() || '#1428A0',
         	level3: $("#gEvtWarning").val() || '#FEEE24',
         	level4: $("#gEvtMinor").val() || '#FFCD00',
         	level5: $("#gEvtMajor").val() || '#FF9A00',
         	level6: $("#gEvtCritical").val()|| '#F64431',
         	level_1: '#3FBFB0',
         	level_2: '#072DEB',
         	level1: '#05b505',
         	level0: '#a3a3a3'
		},

		trfTypeString: {
			I: "In",
			O: "Out",
			A: "평균",
			M: "Max",
			S: "Sum"
		},

		editTypeString: {
			GN:"grpName",
			IA:"itemAlias",
			FS:"fontSize",
			IS:"itemSize",
			IT:"itemType",
			LP:"labelPosition"
		},

		// 사용자 환경설정값
		envSetting: {
			refreshTime: 60,	//60초
			showLabel: 1,		//0:hidden, 1:visible
			fontColor: '#000000',
			fontBgColor: '#00bcd4',
			lineColor: '#a3a3a3',
			pollingColor: '#05b505',
			lineFlowEffectColor: '#FF0000',
			lineLabel: '0',
			lineLabelColor: '#a3a3a3',
			lineLabelFontSize: 11,
			linePerf: '0',
            alarmChk:0,
			alarmLv1Chk:0,
            alarmLv2Chk:0,
            alarmLv3Chk:0,
            alarmLv4Chk:0,
            alarmLv5Chk:0,
            alarmLv1Path:'default.mp3',
            alarmLv2Path:'default.mp3',
            alarmLv3Path:'default.mp3',
            alarmLv4Path:'default.mp3',
            alarmLv5Path:'default.mp3',
			topoEditYn: 'Y',
			ifColorMode: 'EVT',
			speedColor1: '#a3a3a3',
			speedColor2: '#a3a3a3',
			speedColor3: '#a3a3a3',
			speedColor4: '#a3a3a3',
			speedColor5: '#a3a3a3',
			bubbleOpacity: 1,
			showIcmpPoll: 0,		//0:hidden, 1:visible
			fontBgOpacity: 0.3,
			isAudioRepeat: false,
			soundFilePath: '',
			smallIconMenu: 0,
            showHA: 0,
		},

		digitClockSetting: {
			posX: 850,
			posY: 24,
			fillColor: '#000000',
			clockBgColor: '#a3a3a3',
			clockBgOpacity: 0.1,
			clockType: 'H24',
			clockTheme: ''
		},

		slideGrpSetting: {
			group:[],
			period: 0
		},

		flowSetting: {
			isMade: false,
		},


		setEnvSetting: function(data) {
			$.extend(this.envSetting, {
				refreshTime: data.refreshTime,
				showLabel: data.showLabel,
				fontColor: data.fontColor,
				fontBgColor: data.fontBgColor || '#00bcd4',
				lineColor: data.lineColor || '#a3a3a3',
				pollingColor: data.pollingColor || '#05b505',
				alarmChk: data.alarmChk,
				alarmLv1Chk: data.alarmLv1Chk,
                alarmLv2Chk: data.alarmLv2Chk,
                alarmLv3Chk: data.alarmLv3Chk,
                alarmLv4Chk: data.alarmLv4Chk,
                alarmLv5Chk: data.alarmLv5Chk,
                alarmLv1Path: data.alarmLv1Path || 'default.mp3',
                alarmLv2Path: data.alarmLv2Path || 'default.mp3',
                alarmLv3Path: data.alarmLv3Path || 'default.mp3',
                alarmLv4Path: data.alarmLv4Path || 'default.mp3',
                alarmLv5Path: data.alarmLv5Path || 'default.mp3',
				showIcmpPoll: data.showIcmpPoll,
            });

			this.evtLvlColor.level0 = this.envSetting.lineColor;
			this.evtLvlColor.level1 = this.envSetting.pollingColor;

			// jsonConf
			var jsonConf = JSON.parse(data.jsonConf);
			if(jsonConf != null) {
				if(jsonConf.hasOwnProperty('ifColorMode')) {
					this.envSetting.ifColorMode = jsonConf.ifColorMode || 'EVT';
				}
				for(var i = 1; i <= 5; i++) {
					var field = 'speedColor'+i;
					if(jsonConf.hasOwnProperty(field)) {
						this.envSetting[field] = jsonConf[field] || '#a3a3a3';
					}
				}

				// bubble opacity
				this.envSetting['bubbleOpacity'] = jsonConf.bubbleOpacity || 1;
				// font bg opacity
				this.envSetting['fontBgOpacity'] = jsonConf.fontBgOpacity || 0.3;
				// audio repeat
				this.envSetting['isAudioRepeat'] = jsonConf.isAudioRepeat;

				// small Icon Menu
				this.envSetting['smallIconMenu'] = jsonConf.smallIconMenu;

				// HA show/hide
				this.envSetting['showHA'] = parseInt(jsonConf.showHA);

			}

			// digitClockConf
			var digitClockConf = JSON.parse(data.digitClockConf);
			if(digitClockConf != null) {
				var keys = Object.keys(digitClockConf);
				for(var idx = 0; idx < keys.length; idx++) {
					var field = keys[idx];
					if(digitClockConf.hasOwnProperty(field)) {
						this.digitClockSetting[field] = digitClockConf[field];
					}
				}
			}

			// // slideShow
			// var slideGrpConf = JSON.parse(data.slideGrpConf);
			// if(slideGrpConf) {
			// 	var keys = Object.keys(slideGrpConf);
			// 	for(var idx = 0; idx < keys.length; idx++) {
			// 		var field = keys[idx];
			// 		if(slideGrpConf.hasOwnProperty(field)) {
			// 			if (field === 'group') this.slideGrpSetting[field] = slideGrpConf[field].split(',');
			// 			else this.slideGrpSetting[field] = slideGrpConf[field];
			// 		}
			// 	}
			// }


		},


    /**
	 * devKind1에 따른 devKind2 목록
     * @param type	DEV | SVR | ETC
     */
		getDevKind2List: function(type) {
			if(type == 'DEV') {
				return [
					'SWITCH', 'BACKBONE', 'ROUTER', 'L2SWITCH', 'L3SWITCH', 'L4SWITCH', 'L7SWITCH',
					'AP', 'VPN', 'GATEWAY', 'CMTS', 'UTM', 'IPS', 'UPS', 'POTN', 'FIREWALL',
					'DDOS', 'QOS'
				];
			}
			else if(type == 'SVR') {
				return [
					'SERVER', 'PRINT', 'FIREWALL', 'WIN2000', 'WIN2003', 'WIN9598', 'WIN2008',
					'VISTA', 'UNIX', 'HP', 'WINXP', 'LINUX', 'SOLARIS'
				];
			}
			else if(type == 'ETC') {
				return [
					'NOTEBOOK', 'WORKBOX', 'WOMAN', 'MAN', 'MONITOR', 'PC', 'VOIP', 'SECURE', 'DEVICE',
					'COMPUTER', 'MOBILE', 'CLOUD', 'BUILDING', 'ETC_SWITCH', 'ETC_ROUTER', 'ETC_IPS',
					'ETC_BACKBONE', 'ETC_HUB', 'ETC_VPN', 'ETC_ANTENNA', 'ETC_RCST', 'ETC_가속기', 'ETC_TAP'
				];
			}
			else {
				return null;
			}
		},

};
