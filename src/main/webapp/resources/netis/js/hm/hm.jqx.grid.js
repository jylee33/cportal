var HmGrid = {

		/** get jqxGrid default options */
		getDefaultOptions : function($grid) {
            // var gridPage = $("#gGridPage").val();
            // var gridArray = gridPage.split(',');
            var gridDefault = parseInt($("#gGridDefault").val() ?? 10);

            return {
                width : "99.8%",
                height : "99.8%",
                autoheight : false,		/* loading slow */
                autorowheight: false,		/* loading slow */
                theme : jqxTheme,
                pageable : true,
                pagermode: 'simple',
                columnsresize : true,
                showstatusbar : false,
                selectionmode : "singlerow",
                enabletooltips : true,
                columnsheight: 26,
                rowsheight: 22,
                filterrowheight: 30,
                toolbarheight : 30,
                sortable : true,
                altrows: false,
//				filterable: true,  				/* loading slow */
                enablebrowserselection : true,
                showpinnedcolumnbackground: false,
                showsortcolumnbackground : false,
                pagesize: gridDefault,
                pagesizeoptions:  [ "1000", "5000", "10000" ],
                localization : getLocalization('kr')

//				pagerrenderer : this.pagerrenderer
//				ready: function() {
//					$grid.jqxGrid({ filterable: true });
//				}

            };
		},

		/** create jqxGrid */
		create : function($grid, options, ctxmenuType, ctxmenuIdx) {
			var defOpts = this.getDefaultOptions($grid);
			// 그리드 헤더텍스트 정렬을 center로.. 처리
			try {
				$.each(options.columns, function(idx, value) {
					value.align = 'center';
					value.filterdelay = 60000; // key이벤트에 대한 동작을 막기위해 delaytime 설정
				});
			} catch(e) {}
			$.extend(defOpts, options);
			$grid.jqxGrid(defOpts);
			if(ctxmenuType === undefined) ctxmenuType = CtxMenu.COMM;
			if(ctxmenuIdx === undefined) ctxmenuIdx = '';
			CtxMenu.create($grid, ctxmenuType, ctxmenuIdx);
		},

		/** data refresh */
		updateBoundData : function($grid, reqUrl) {
			var adapter = $grid.jqxGrid("source");
			if(adapter !== undefined) {

                if ($grid.jqxGrid('getselectedrowindex') > -1) {
                	// console.log($grid.jqxGrid('getselectedrowindex'));
                    $grid.jqxGrid('clearselection');
                }

                if(adapter._source.url == null || adapter._source.url == "")
					adapter._source.url = reqUrl;

				if($grid.jqxGrid('filterable')) {
					$grid.jqxGrid("updatebounddata", "filter");
				}
                else if($grid.jqxGrid('groupable')) {
                    $grid.jqxGrid("updatebounddata", "data");
                }
				else {
					$grid.jqxGrid("updatebounddata");
				}

				// 상태바 표시상태일때 높이조절
				if($grid.jqxGrid("showstatusbar") == true) {
					var gridId = $grid.attr("id");
					setTimeout('HmGrid.setStatusbarHeight("' + gridId + '")', 500);
				}
			}
		},

		setLocalData: function($grid, data) {
			$grid.jqxGrid('source')._source.localdata = data;
			$grid.jqxGrid('updateBoundData');
		},

		/** 그리드 statusbar에 합계표현할때 height값이 맞지않아 틀어지는 현상 보완 */
		setStatusbarHeight: function(gridId) {
			$("#statusbar" + gridId).children().css("height", ($("#statusbar" + gridId).height() - 2));
		},


		/** 선택된 rowindex를 리턴 */
		getRowIdx: function($grid, msg) {

			var rowIdx = $grid.jqxGrid('getselectedrowindex');
			if(rowIdx === undefined || rowIdx === null || rowIdx == -1) {
				if(msg !== undefined) alert(msg);
				return false;
			}

			return rowIdx;

		},

		/** 선택된 rowindexes를 리턴 */
		getRowIdxes: function($grid, msg) {

			if($grid.jqxGrid('getboundrows').length == 0) {
				if(msg !== undefined) alert(msg);
				return false;
			}

			var rowIdxes = $grid.jqxGrid('getselectedrowindexes');
			if(rowIdxes === undefined || rowIdxes === null || rowIdxes.length == 0) {
				if(msg !== undefined) alert(msg);
				return false;
			}

			return rowIdxes;

		},

		/** 선택된 row의 data를 리턴 */
		getRowData: function($grid, rowIdx) {
			if(rowIdx === undefined) {
				rowIdx = $grid.jqxGrid('getselectedrowindex');
				if(rowIdx == -1) return null;
			}

			return $grid.jqxGrid('getrowdata', rowIdx);
		},

		/** 선택된 rows의 data를 리턴 */
		getRowDataList: function($grid, rowIdxes) {
			if(rowIdxes === undefined) {
				rowIdxes = $grid.jqxGrid('getselectedrowindexes');
				if(rowIdxes == null || rowIdxes.length == 0) return null;
			}

			var list = [];
			$.each(rowIdxes, function(idx, rowIdx) {
				list.push($grid.jqxGrid('getrowdata', rowIdx));
			});
			return list;
		},

		/** 선택된 row의 editing을 종료 */
		endRowEdit: function($grid) {
			var rowIdx = HmGrid.getRowIdx($grid);
			if(rowIdx !== false) {
				$grid.jqxGrid('endrowedit', rowIdx, false);
			}
		},

		/** 선택된 cell의 editing을 종료 (selectionmode = singlecell일때) */
		endCellEdit: function($grid) {

			var rowIdx = HmGrid.getRowIdx($grid);
			if (rowIdx === false) return;

			// var cell = $grid.jqxGrid('getselectedcell');
			// if (cell === false) return;

            var chlidrens = $grid.children();
            if(chlidrens && chlidrens.length) {
                var elValidation = chlidrens.find('div.jqx-grid-validation');
                if (elValidation.length && $(elValidation[0]).css('display') == 'block') {
                    return false;
                }
            }
			$grid.jqxGrid('endrowedit', rowIdx, false);
		},

		/** ImageRenderer **/
		img16renderer: function(row, datafield, value){
			return '<img width="16" height="16" style="display: block; margin: auto; margin-top: 5px;" src="' + value + '"/>';
		},

		img128renderer: function(row, datafield, value){
			return '<img height="128" width="128" style="display: block; margin: auto; margin-top: 5px;" src="' + value + '"/>';
		},

		img200renderer: function(row, datafield, value){
			return '<img height="200" width="200" style="display: block; margin: auto; margin-top: 5px;" src="' + value + '"/>';
		},

		/** commaNum */
		commaNumrenderer: function (row, column, value) {
			var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
			cell += HmUtil.commaNum(value);
			cell += '</div>';
			return cell;
		},

        /**
         * 장비/서버 공통 상세팝업 호출
         * @param devKind1
         * @param row
         * @param gridId
         * @param type
         */
        commonDetailPopup: function(devKind1, row, gridId, type) {
            CtxMenu.itemClick('cm_dev_detail', $('#'+gridId),'grid');
        },

        /** 장비명 */
        devNameRenderer: function(row, column, value) {

            var _gridId = this.owner.element.id;
            var cell = $('<div></div>', {
                style: 'margin: 6px 2px 0 2px',
                class: 'jqx-left-align',
                onclick: "try { HmGrid.commonDetailPopup('DEV', " + row + ", '" + _gridId + "', 'grid')} catch(e) {}"
            });
            cell.append($('<img></img>', {
                src: '/img/tree/BACKBONE.png'
            }));
            cell.append($('<span></span>', {
                text: value
            }));
            return cell[0].outerHTML
        },

		/** unit1000 */
		unit1000renderer: function (row, column, value) {
			var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
			cell += (value == null || value.length == 0)? value : HmUtil.convertUnit1000(value);
		    cell += '</div>';
			return cell;
		},

		/** unit MHz -> convert Hz */
		unitHzRenderer: function (row, column, value) {
			var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
			cell += HmUtil.convertHz(value) + 'Hz';
			cell += '</div>';
			return cell;
		},

		/** unit1024 */
		unit1024renderer: function (row, column, value) {
			var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
			cell += HmUtil.convertUnit1024(value);
		    cell += '</div>';
			return cell;
		},

		/** unitHyphen1000 */
        hyphenrenderer: function (row, column, value) {
            var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';

            if ( typeof value === 'number' && isFinite(value)) {
                cell += value;
            } else {
                cell += '-';
            }
            cell += '</div>';
            return cell;
        },
		unitHyphen1000renderer: function (row, column, value) {
			var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';

            if ( typeof value === 'number' && isFinite(value)) {
                cell += HmUtil.convertUnit1000(value);
            } else {
                cell += '-';
            }
			cell += '</div>';
			return cell;
		},

		/** unitHyphen1024 */
		unitHyphen1024renderer: function (row, column, value) {
			var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
            if(value == null || value == ''){
                cell += '-';
            }else {
                cell += HmUtil.convertUnit1024(value);
            }
			cell += '</div>';
			return cell;
		},
		/** 회선상태 */
		ifStatusrenderer: function(row, datafield, value) {
            if(value == null) return;
            var _color = '#69B2E4';
            switch(value.toUpperCase()) {
                case 'ALIVE': _color = '#69B2E4'; break;
                case 'DEAD': _color = '#a3a3a3'; break;
                case 'UNSET': _color = '#d4d4d4'; break;
            }

            var div = $('<div></div>', {
                class: 'jqx-center-align evtName evt',
				style: 'background: {0}'.substitute(_color),
                text: value
            });
            return div[0].outerHTML;
		},

		/** 회선상태 */
		sensorStatusrenderer: function(row, datafield, value) {
			if(value == null) return;
			var cell = "<div style='margin-top: 2px' class='jqx-center-align'>";
			switch(value.toString()) {
			case "1": cell += "<img src='" + ctxPath + "/img/Grid/IfStatus/alive.gif' alt='" + value + "' />"; break;
			case "0": cell += "<img src='" + ctxPath + "/img/Grid/IfStatus/dead.gif' alt='" + value + "' />"; break;
			case "2": cell += "<img src='" + ctxPath + "/img/Grid/IfStatus/unset.gif' alt='" + value + "' />"; break;
			default: return;
			}
			cell += "</div>";
			return cell;
		},

		/** 장애등급 */
		evtLevelrenderer: function (row, datafield, value, defaultHTML) {


			//시작 테그만 빼고 삭제.
            defaultHTML = defaultHTML.replace(/\>.*\<\/div\>/, '') + '>';
			var _splitHTML = defaultHTML.split('"');
            for (var i = 0; i < _splitHTML.length; i++) {
                /**
				 * 브라우저 호환성 문제가 있으니 사용하지 마세요!!!
				 * String.prototype.incldues 함수는 Chrome41버전 이상, Firefox40이상, Safari9이상에서만 지원하며
				 * ie, Opera는 지원하지 않음.
                 */
                //if (_splitHTML[i].includes('class')) {
				if(_splitHTML[i].indexOf('class') != -1) {
                    _splitHTML[i + 1] += ' evtName';
                    switch (value.toString()) {
                        case "-1":
                        case "조치중":
						case $('#sEvtLevelMeasure').val():
                            _splitHTML[i + 1] += ' evt processing';
                            _splitHTML[_splitHTML.length -1] += $('#sEvtLevelMeasure').val() + '</div>';
                            break;
                        case "0":
                        case "정상":
						case $('#sEvtLevel0').val():
                            _splitHTML[i + 1] += ' evt normal';
                            _splitHTML[_splitHTML.length -1] += $('#sEvtLevel0').val() + '</div>';
                            break;
                        case "1":
                        case "정보":
						case $('#sEvtLevel1').val():
                            _splitHTML[i + 1] += ' evt info';
                            _splitHTML[_splitHTML.length -1] += $('#sEvtLevel1').val() + '</div>';
                            break;
                        case "2":
						case "주의":
						case $('#sEvtLevel2').val():
                            _splitHTML[i + 1] += ' evt warning';
                            _splitHTML[_splitHTML.length -1] += $('#sEvtLevel2').val() + '</div>';
                            break;
                        case "3":
                        case "알람":
						case $('#sEvtLevel3').val():
                            _splitHTML[i + 1] += ' evt minor';
                            _splitHTML[_splitHTML.length -1] += $('#sEvtLevel3').val() + '</div>';
                            break;
                        case "4":
                        case "경보":
						case $('#sEvtLevel4').val():
                            _splitHTML[i + 1] += ' evt major';
                            _splitHTML[_splitHTML.length -1] += $('#sEvtLevel4').val() + '</div>';
                            break;
                        case "5":
                        case "장애":
						case $('#sEvtLevel5').val():
                             _splitHTML[i + 1] += ' evt critical';
                            _splitHTML[_splitHTML.length -1] += $('#sEvtLevel5').val() + '</div>';
                            break;
                        default:
                            return;
                    }
                }
            }
			return _splitHTML.join('"');
		},

		/** 토폴로지 장애등급 */
		topoEvtLevelrenderer: function (row, datafield, value, defaultHTML) {
			//시작 테그만 빼고 삭제.
			defaultHTML = defaultHTML.replace(/\>.*\<\/div\>/, '') + '>';
			var _splitHTML = defaultHTML.split('"');
			for (var i = 0; i < _splitHTML.length; i++) {
				if(_splitHTML[i].indexOf('class') != -1) {
					_splitHTML[i + 1] += ' evtName';
					switch (value.toString()) {
						case "-1":
						case "조치중":
							_splitHTML[i + 1] += ' evt processing';
							_splitHTML[_splitHTML.length -1] += $('#sEvtLevelMeasure').val() + '</div>';
							break;
						case "0": case "1": case "정상":
							_splitHTML[i + 1] += ' evt normal';
							_splitHTML[_splitHTML.length -1] += $('#sEvtLevel0').val() + '</div>';
							break;
						case "2":
						case "정보":
							_splitHTML[i + 1] += ' evt info';
							_splitHTML[_splitHTML.length -1] += $('#sEvtLevel1').val() + '</div>';
							break;
						case "3":
						case "주의":
							_splitHTML[i + 1] += ' evt warning';
							_splitHTML[_splitHTML.length -1] += $('#sEvtLevel2').val() + '</div>';
							break;
						case "4":
						case "알람":
							_splitHTML[i + 1] += ' evt minor';
							_splitHTML[_splitHTML.length -1] += $('#sEvtLevel3').val() + '</div>';
							break;
						case "5":
						case "경보":
							_splitHTML[i + 1] += ' evt major';
							_splitHTML[_splitHTML.length -1] += $('#sEvtLevel4').val() + '</div>';
							break;
						case "6":
						case "장애":
							_splitHTML[i + 1] += ' evt critical';
							_splitHTML[_splitHTML.length -1] += $('#sEvtLevel5').val() + '</div>';
							break;
						default:
							return;
					}
				}
			}
			return _splitHTML.join('"');
		},

		/** 헬스체크 */
		healthChkrenderer: function (row, datafield, value, defaultHTML) {
			//시작 테그만 빼고 삭제.
            defaultHTML = defaultHTML.replace(/\>.*\<\/div\>/, '') + '>';
			var _splitHTML = defaultHTML.split('"');
            for (var i = 0; i < _splitHTML.length; i++) {
                /**
				 * 브라우저 호환성 문제가 있으니 사용하지 마세요!!!
				 * String.prototype.incldues 함수는 Chrome41버전 이상, Firefox40이상, Safari9이상에서만 지원하며
				 * ie, Opera는 지원하지 않음.
                 */
                //if (_splitHTML[i].includes('class')) {
				if(_splitHTML[i].indexOf('class') != -1) {
                    _splitHTML[i + 1] += ' evtName';
                    switch (value.toString()) {
                        case "1":
                        case "정상":
                        case $('#sEvtLevel0').val():
                            _splitHTML[i + 1] += ' evt normal';
                            _splitHTML[_splitHTML.length -1] += value.toString() + '</div>';
                            break;
                        case "0":
                        case "장애":
                        case $('#sEvtLevel5').val():
                             _splitHTML[i + 1] += ' evt critical';
                            _splitHTML[_splitHTML.length -1] += value.toString() + '</div>';
                            break;
                        default:
                            return;
                    }
                }
            }
			return _splitHTML.join('"');
		},
    	evtLevelFilterRenderer: function (index, label, value) {
            switch (value.toString()) {
                case "-1":
                case "조치중":
                    return $('#sEvtLevelMeasure').val();
                case "0":
                case "정상":
                    return $('#sEvtLevel0').val();
                case "1":
                case "정보":
                    return $('#sEvtLevel1').val();
                case "2":
                case "주의":
                    return $('#sEvtLevel2').val();
                case "3":
                case "알람":
                    return $('#sEvtLevel3').val();
                case "4":
                case "경보":
                    return $('#sEvtLevel4').val();
                case "5":
                case "장애":
                    return $('#sEvtLevel5').val();
                default:
                    return label;
            }
        },

        healthChkFilterRenderer: function (index, label, value) {
            switch (value.toString()) {
                case "1":
                case "정상":
                    return "정상";
                case "0":
                case "장애":
                    return "장애";
                default:
                    return label;
            }
        },

		/** 게시판 상태 */
		boardStatusrenderer: function (row, datafield, value) {
			if(value == null) return;
			var cell = "<div style='margin-top: 2px' class='jqx-center-align'>";
			switch(value.toString()) {
			case "요청":
				cell += "<img src='" + ctxPath + "/img/Grid/apply.png' alt='" + value + "'/>";
				break;
			case "처리":
				cell += "<img src='" + ctxPath + "/img/Grid/check.png' alt='" + value + "'/>";
				break;
			default: return;
			}
			cell += "</div>";
			return cell;
		},

		/** 작업진행 상태 */
		jobFlagrenderer: function (row, datafield, value) {
			if(value == null) return;
			var cell = "<div style='margin-top: 5px' class='jqx-center-align'>";
			switch(value.toString()) {
			case "0": case "신청":
				cell += "<img src='" + ctxPath + "/img/Grid/JobFlag/apply.png' alt='" + value + "'/>";
				break;
			case "1": case "승인":
				cell += "<img src='" + ctxPath + "/img/Grid/JobFlag/confirm.png' alt='" + value + "'/>";
				break;
			default: return;
			}
			cell += "</div>";
			return cell;
		},

		/** 작업관리 중요도 */
		jobLevelrenderer: function (row, datafield, value) {
			if(value == null) return;
			var joblvl = [null, 'low', 'middle', 'high'];
			var _lvl = 1, _text = '낮음';
			switch(value.toString()) {
                case '1': case '낮음': _lvl = 1; _text = '낮음'; break;
                case '2': case '보통': _lvl = 2; _text = '보통'; break;
                case '3': case '높음': _lvl = 3; _text = '높음'; break;
			}

			var div = $('<div></div>', {
				class: 'jqx-center-align evtName evt joblvl_{0}'.substitute(joblvl[_lvl]),
				text: _text
			});
			return div[0].outerHTML;
		},

		/** 이벤트 지속시간 (second) */
		cTimerenderer: function (row, datafield, value) {
			var result = HmUtil.convertCTime(value);

		    return "<div style='margin-top: 4px; margin-right: 5px' class='jqx-right-align'>" + result + "</div>";
		},

		/** 시간 (milisecond) */
		milisecrenderer: function (row, datafield, value) {
			var result = HmUtil.convertMilisecond(value);
			return "<div style='margin-top: 4px; margin-right: 5px' class='jqx-right-align'>" + result + "</div>";
		},

		/** 컬럼값에 ms 단위 추가 */
        milisecTextrenderer: function (row, datafield, value) {
			return "<div style='margin-top: 4px; margin-right: 5px' class='jqx-right-align'>" + value +"ms</div>";
		},

		/** 이미지 장비타입 */
		imgDevkind1renderer: function(row, columnfield, value, defaulthtml, columnproperties) {
			var gridId = $(this.owner.wrapper).attr("id").replace("wrapper", "");
			if(gridId == null) return value;
			var imgUrl = $('#' + gridId).jqxGrid('getrowdata', row).devKind1ImgUrl;
			var cell = "<div style='margin-top: 2px; margin-left: 4px; margin-right: 2px;'>"
				+ "<img src='" + ($('#websvcUrl').val() + imgUrl) + "'>&nbsp;" + value
				+ "</div>";
			return cell;
		},

		/** 전화번호 */
		phonerenderer: function (row, datafield, value) {
			return "<div style='margin-top: 4px; margin-left: 5px' class='jqx-left-align'>**********</div>";
		},
		/** 비밀번호 */
		pwdrenderer: function (row, datafield, value) {
			return "<div style='margin-top: 4px; margin-left: 5px' class='jqx-left-align'>**********</div>";
		},

		/** 비밀번호 */
		secretrenderer: function (row, datafield, value) {
			return "<div style='margin-top: 4px; margin-left: 5px' class='jqx-left-align'>**********</div>";
		},

		/** 컬럼값에  온도(℃) 추가 */
		temperaturerenderer: function (row, datafield, value) {
            return "<div style='margin-top: 4px; margin-right: 5px' class='jqx-right-align'>" + value +"℃</div>";
		},

		/** 값 + comumntype을 사용  */
        customColumnTypererenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
        	console.log(columnproperties.columntype);
			return "<div style='margin-top: 4px; margin-right: 5px' class='jqx-right-align'>" + value + columnproperties.columntype + "</div>";
		},

		/** ROW NO */
		rownumrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
			console.log(columnproperties.cellsalign);
			var _class = 'jqx-right-align';
			if(columnproperties.cellsalign !== undefined){
				_class = 'jqx-'+ columnproperties.cellsalign  + '-align';
            }
            return "<div style='margin-top: 4px; margin-right: 5px' class='"+_class+"'>" + (row + 1) +"</div>";
		},

    	/** ROW NO */
		rownumrenderer2: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
            console.log(columnproperties.cellsalign);
            var _class = 'jqx-right-align';
            if(columnproperties.cellsalign !== undefined){
                _class = 'jqx-'+ columnproperties.cellsalign  + '-align';
            }
            return "<div style='margin-top: 4px; margin-right: 5px' class='"+_class+"'>" + (value + 1) + "</div>";
		},
		/** 사용자 계정상태 */
		usrStaterenderer: function (row, datafield, value) {
			var cell = "<div style='margin-top: 4px; margin-left: 5px' class='jqx-left-align'>";
			switch(value.toString()) {
			case "0": cell += "정지"; break;
			case "1": cell += "승인"; break;
			case "2": cell += "대기"; break;
			case "3": cell += "잠김"; break;
			}
			cell += "</div>";
			return cell;
		},

		/** 장비종류1 */
		devKind1renderer: function (row, datafield, value) {
			var cell = "<div style='margin-top: 4px; margin-left: 5px' class='jqx-left-align'>";
			switch(value.toString()) {
				case "DEV": cell += "장비"; break;
				case "SVR": cell += "서버"; break;
				default: cell += value.toString(); break;
			}
			cell += "</div>";
			return cell;
		},

		/** AP 상태 */
		apStatusrenderer: function (row, datafield, value) {
			if(value == null) return;
			var cell = "<div style='margin-top: 2px' class='jqx-center-align'>";
			switch(value.toUpperCase()) {
				case "UP": cell += "<img src='" + ctxPath + "/img/Grid/ApStatus/ap_up.png' alt='" + value + "' />"; break;
				case "DOWN": cell += "<img src='" + ctxPath + "/img/Grid/ApStatus/ap_down.png' alt='" + value + "' />"; break;
				default: break;
			}
			cell += "</div>";
			return cell;
		},

		/** progressbar */
		progressbarrenderer:function (row, column, value) {
			var cellWidth = 100;
			try {
				cellWidth = parseInt($(this)[0].width);
			} catch(e) {}

			var cell = '<div style="margin-top:4px; text-align: center;">';
			cell += '<div style="background: #37B8EF; position: relative; width: ' + (cellWidth/100*value) + 'px; height: 16px;"></div>';
			cell += '<div style="margin-left: 5px; position: relative; top: -15px;">' + value.toString() + '%' + '</div>';
			cell += '</div>';
			return cell;
		},

		/** 헬스체크 */
		icmpPollrenderer: function(row, datafield, value) {
            var cell = "<div style='margin-top: 4px; margin-left: 5px' class='jqx-left-align'>";
            switch(value.toString()) {
                case "1": cell += "ICMP"; break;
                case "2": cell += "SNMP"; break;
                case "3": cell += "Both"; break;
				default: cell += "NONE"; break;
            }
            cell += "</div>";
            console.log('icmp', cell);
            return cell;
        },

		/** SNMP Version */
		snmpVerrenderer: function (row, datafield, value) {
			var cell = "<div style='margin-top: 6px; margin-left: 5px' class='jqx-left-align'>";
			switch(value.toString()) {
			case "1": cell += "Ver1"; break;
			case "2": cell += "Ver2"; break;
			case "3": cell += "Ver3"; break;
			}
			cell += "</div>";
			return cell;
		},
		snmpSecurityLevelrenderer: function (row, datafield, value) {
			var cell = "<div style='margin-top: 6px; margin-left: 5px' class='jqx-left-align'>";
			switch(value.toString()) {
				case "0": cell += "NoAuthNoPriv"; break;
				case "1": cell += "AuthNoPriv"; break;
				case "2": cell += "AuthPriv"; break;
			}
			cell += "</div>";
			return cell;
		},
		snmpAuthTyperenderer: function (row, datafield, value) {
			var cell = "<div style='margin-top: 6px; margin-left: 5px' class='jqx-left-align'>";
			switch(value.toString()) {
				case "1": cell += "SHA"; break;
				case "2": cell += "MD5"; break;
			}
			cell += "</div>";
			return cell;
		},
		snmpEncryptTyperenderer: function (row, datafield, value) {
			var cell = "<div style='margin-top: 6px; margin-left: 5px' class='jqx-left-align'>";
			switch(value.toString()) {
				case "1": cell += "AES"; break;
				case "2": cell += "DES"; break;
                case "3": cell += "AES192"; break;
                case "4": cell += "AES256"; break;
			}
			cell += "</div>";
			return cell;
		},


		/** title */
		titlerenderer: function(toolbar, title, elemId) {
			var container = $('<div style="margin: 5px;"></div>');
			var span;
			if(elemId !== null && elemId !== undefined) {
				span = $('<span style="float: left; font-weight: bold; margin-top: 5px; margin-right: 4px;" id="' + elemId + '">' + title + '</span>');
			}
			else {
				span = $('<span style="float: left; font-weight: bold; margin-top: 5px; margin-right: 4px;">' + title + '</span>');
			}
			toolbar.empty();
	    	toolbar.append(container);
	    	container.append(span);
		},

		/** flow 수집여부 */
		tmsFlowRenderer: function(row, datafield, value) {
			var cell = "<div style='margin-top: 7px' class='jqx-center-align'>";
			switch(value.toString()) {
			case "Y":
				cell += "<img src='" + ctxPath + "/img/Grid/TmsFlow/yes.png' alt='" + value + "'/>";
				break;
			case "N":
				cell += "<img src='" + ctxPath + "/img/Grid/TmsFlow/no.png' alt='" + value + "'/>";
				break;
			}
			cell += "</div>";
			return cell;
		},

		/** Syslog 등급 */
		syslogLevelrenderer: function (row, datafield, value, defaultHTML) {
			//시작 테그만 빼고 삭제.
            defaultHTML = defaultHTML.replace(/\>.*\<\/div\>/, '') + '>';
			var _splitHTML = defaultHTML.split('"');
            for (var i = 0; i < _splitHTML.length; i++) {
                /**
				 * 브라우저 호환성 문제가 있으니 사용하지 마세요!!!
				 * String.prototype.incldues 함수는 Chrome41버전 이상, Firefox40이상, Safari9이상에서만 지원하며
				 * ie, Opera는 지원하지 않음.
                 */
                //if (_splitHTML[i].includes('class')) {
				if(_splitHTML[i].indexOf('class') != -1) {
                    _splitHTML[i + 1] += ' evtName';
                    var sys_className = 'sys_'+ value.toString().toLocaleLowerCase();

                    _splitHTML[i + 1] += ' evt '+sys_className;
                    _splitHTML[_splitHTML.length -1] += value + '</div>';
                }
            }
			return _splitHTML.join('"');
		},

		/** 감시프로스세스 비교조건 */
		mprocCmpcondRenderer: function (row, datafield, value) {
			if(value == null) return;
			var cell = "<div style='margin-top: 2px' class='jqx-center-align'>";
            cell += value.replace('&lt;','<').replace('&gt;', '>');
			cell += "</div>";
			return cell;
		},
		/** 라이센스 상세 */
		licenseDetailrenderer: function(row, datafield, value) {
			if(value == null) return;
			var cell = "<div style='margin-top: 2px' class='jqx-center-align'>";
			switch(value) {
				case 0: cell += "<img src='" + ctxPath + "/img/Grid/LicenseStatus/grn.png' alt='대기중' />"; break;
				case 1: cell += "<img src='" + ctxPath + "/img/Grid/LicenseStatus/yellow.png' alt='통화중' />"; break;
				case 2: cell += "<img src='" + ctxPath + "/img/Grid/LicenseStatus/red.png' alt='측정불가' />"; break;
				default: return;
			}
			cell += "</div>";
			return cell;
		},
		/** fax  */
		faxStatusrenderer: function(row, datafield, value) {
			if(value == null) return;
			var cell = "<div style='margin-top: 2px' class='jqx-center-align'>";
			switch(value) {
                case 'ALIVE': cell += "<img src='" + ctxPath + "/img/Grid/LicenseStatus/grn.png' alt='정상' /> 정상"; break;
                case 'DEAD': cell += "<img src='" + ctxPath + "/img/Grid/LicenseStatus/red.png' alt='비정상' /> 비정상"; break;
				default: return;
			}
			cell += "</div>";
			return cell;
		},

		/** SLA */
		/** SLA 조치상태 */
		slaActionrenderer: function(row, datafield, value) {
			if(value == null) return;
			var _text = '';
			switch(value.toString()) {
				case "1": _text = "미통보"; break;
				case "2": _text = "통보"; break;
				case "3": _text = "지연통보"; break;
			}
			var div = $('<div></div>', {class: 'slaAction slaAction' + value + ' jqx-center-align', title: _text,
				onclick: "try { Main.showSlaAction(" + row + ") } catch(e) {}"
			});
			div.append($('<span></span>', {text: _text, class: 'slaActionText'}));
			return div[0].outerHTML;
		},

		/** SLA 진행상태 */
		slaStaterenderer: function(row, datafield, value) {
            if(value == null) return;
            var _text = '';
            switch(value.toString()) {
                case "1": _text = "신청"; break;
                case "2": _text = "검토중"; break;
                case "3": _text = "반려"; break;
                case "4": _text = "재신청"; break;
                case "5": _text = "거부"; break;
                case "6": _text = "승인"; break;
                default: _text = "NONE"; value = 0; break;
            }
            var div = $('<div></div>', {class: 'slaState slaState' + value + ' jqx-center-align', title: _text,
                onclick: "try { Main.showSlaReport(" + row + ") } catch(e) {}"
            });
            div.append($('<span></span>', {text: _text, class: 'slaStateText'}));
            return div[0].outerHTML;
		},

		/*
			서버 Renderer
		*/
		svrLogTypeRenderer: function(row, datafield, value) {
            if((value || '').length == 0) {
            	return null;
            }
            else {
                var _text = null;
                switch(value.toString()) {
					case '0': _text = '날짜'; break;
                    case '1': _text = '사이즈'; break;
                    case '2': _text = '내용'; break;
                    case '3': _text = '누적'; break;
				}
                return '<div style="margin-top: 2px" class="jqx-center-align">' + _text + '</div>';
			}
		},

		/*
			L7SWITCH 상태값 (F5기준)
		*/
		l4f5StatusRenderer: function(row, datafield, value, defaulthtml, columnproperties, rowdata) {
            var clz = (rowdata.statusClz || 'none').toLowerCase();
            if($.inArray(clz, ['up', 'down', 'none']) === -1) {
            	clz = 'none';
			}
			return '<div class="jqx-center-align {0}" style="margin-top: 6px;">●</div>'.substitute('l4f5_status_' + clz);
		},

		/**============================================
		 * aggregatesrenderer
		 ============================================*/
		agg_unit1024sumrenderer: function(aggregates) {
			var value = aggregates['sum'];
			if(isNaN(value)) value = 0;
			return '<div style="float: right; margin: 4px; overflow: hidden;">' + HmUtil.convertUnit1024(value) + '</div>';
		},

		agg_unit1000sumrenderer: function(aggregates) {
			var value = aggregates['sum'];
			if(isNaN(value)) value = 0;
			return '<div style="float: right; margin: 4px; overflow: hidden;">' + HmUtil.convertUnit1000(value) + '</div>';
		},

		agg_sumrenderer: function(aggregates) {
			var value = aggregates['sum'];
			if(isNaN(value)) value = 0;
			return '<div style="float: right; margin: 4px; overflow: hidden;">' + HmUtil.commaNum(value) + '</div>';
		},

		agg_sumcenterrenderer: function(aggregates) {
			var value = aggregates['sum'];
			if(isNaN(value)) value = 0;
			return '<div style="margin: 4px; overflow: hidden; line-height: 2; text-align: center">' + HmUtil.commaNum(value) + '</div>';
		},

		/**============================================
		 * header renderer
		 ============================================*/
		ckheaderRenderer: function(header) {
			return '<div style="margin: 4.5px 4px 4.5px 4px; text-align: center; overflow: hidden; padding-bottom: 2px; -ms-text-overflow: ellipsis;">' +
						'<div class="ckheader" style="float: left; margin: 0 auto;"></div>' +
				 		'<span style="cursor: default; -ms-text-overflow: ellipsis;">' + header + '</span>' +
			 		'</div>';
		},

		ckheaderRendered: function(element, grid, datafield) {
			var ckobj = $(element).children('.ckheader');
			ckobj.jqxCheckBox({ theme: jqxTheme, width: 16, height: 16, hasThreeStates: false })
				.on('change', function(event) {
					var _newval = event.args.checked? 1 : 0;
					var _list = grid.jqxGrid('getdisplayrows');
					if(_list == null || _list.length == 0) return;
					grid.jqxGrid('beginupdate');
					// 데이터 변경 후 sort이벤트가 발생하여 강제해제
					grid.jqxGrid('setcolumnproperty', datafield, 'sortable', false);
					$.each(_list, function(idx, value) {
						grid.jqxGrid('setcellvalue', value.visibleindex, datafield, _newval);
					});
					grid.jqxGrid('endupdate');
					// 데이터 변경 후 sort이벤트가 발생하여 강제해제 해지..
					setTimeout(function() { grid.jqxGrid('setcolumnproperty', datafield, 'sortable', true); }, 500);
				});
			return true;
		},

		/**============================================
		 * validation
		 ============================================*/
        requireIpValidation: function(cell, value) {
            if($.isBlank(value)) {
                return { result: false, message: 'IP를 입력해주세요.' };
            }
            if(!$.validateIp(value)) {
                return { result: false, message: 'IP형식이 유효하지 않습니다.' };
            }
            return true;
        },

		portValidation: function(cell, value) {
            if(value.toString().length > 5) {
                return { result: false, message: '0~99999사이의 값을 입력해주세요.' };
            }
            return true;
		},

		/*
		* TCP Flag 치환
		* */

		tcpFlagrenderer: function(row, datafield, value) {
			var cell = '<div style="text-align: left; overflow: hidden; padding-bottom: 2px; margin-top: 4px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
			cell += tcpFlagUtil.noToTcpFlag(value);
			cell += '</div>';
			return cell;
		}

};


/**
 * jqxGrid export할때 functionName을 찾기위해 prototype.name을 지정해 둔다.
 * export시 컨버전이 필요한 렌더러는 아래 name을 지정한 후 서버단 ConvertUtil에 함수 추가필요.
 * @returns {string}
 */
HmGrid.unit1000renderer.prototype.name = function() { return 'unit1000renderer'; };
HmGrid.unit1024renderer.prototype.name = function() { return 'unit1024renderer'; };
HmGrid.evtLevelrenderer.prototype.name = function() { return 'evtLevelrenderer'; };
HmGrid.topoEvtLevelrenderer.prototype.name = function() { return 'topoEvtLevelrenderer'; };
HmGrid.healthChkrenderer.prototype.name = function() { return 'healthChkrenderer'; };
HmGrid.evtLevelFilterRenderer.prototype.name = function() { return 'evtLevelFilterRenderer'; };
HmGrid.healthChkFilterRenderer.prototype.name = function() { return 'healthChkFilterRenderer'; };
HmGrid.jobFlagrenderer.prototype.name = function() { return 'jobFlagrenderer'; };
HmGrid.jobLevelrenderer.prototype.name = function() { return 'jobLevelrenderer'; };
HmGrid.cTimerenderer.prototype.name = function() { return 'cTimerenderer'; };
HmGrid.milisecrenderer.prototype.name = function() { return 'milisecrenderer'; };
HmGrid.rownumrenderer.prototype.name = function() { return 'rownumrenderer'; };
HmGrid.usrStaterenderer.prototype.name = function() { return 'usrStaterenderer'; };
HmGrid.devKind1renderer.prototype.name = function() { return 'devKind1renderer'; };
HmGrid.snmpVerrenderer.prototype.name = function() { return 'snmpVerrenderer'; };
HmGrid.progressbarrenderer.prototype.name = function() { return 'progressbarrenderer'; }; //
