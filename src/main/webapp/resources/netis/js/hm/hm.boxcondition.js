var HmBoxCondition = {

	/** create boxCondition */
	create : function($box, source, options) {
		var _id = $box.attr('id');
		$box.attr('class', 'tab_container_custom');

		var _boxId = _id  +'_box';
		var _target = $('<div id="'+ _boxId +'" class="tab-wrap">');
		var _divide = $('<div class="divide"></div>');
		try {
			$.each(source, function(i, v){
				_divide.append(
					$('<input id="tab_'+_id+'_'+i+'" type="radio" name="target_'+_id+'" value="'+v.value+'">'+
					'<label for="tab_'+_id+'_'+i+'" style="float: left" >'+v.label+'</label>')
				);
			});

			_target.append(_divide);
			$box.append(_target);
			$("input:radio[name=target_{0}]:first".substitute(_id)).attr('checked', true);
			// $('#tab_'+_id+'_0').attr('checked', 1);

		}catch (e) {}
	},

	/* radio */
	createRadio: function($div, source) {
		var docFrag = $(document.createDocumentFragment());
		var _id = $div.attr('id');
		$.each(source, function (i, v) {
			var _radioId = _id + i;
			docFrag.append($('<input/>', {id: _radioId, type: 'radio', name: _id, value: v.value, checked: i == 0}));
			docFrag.append($('<label/>', {for: _radioId, text: v.label, class: 'hm-radio'}));
		});
		$div.append(docFrag);
	},
	/* radio */
	changeRadioSource: function($div, source) {
		var docFrag = $(document.createDocumentFragment());
		var _id = $div.attr('id');
		$div.empty();
		$.each(source, function (i, v) {
			var _radioId = _id + i;
			docFrag.append($('<input/>', {id: _radioId, type: 'radio', name: _id, value: v.value, checked: i == 0}));
			docFrag.append($('<label/>', {for: _radioId, text: v.label, class: 'hm-radio'}));
		});
		$div.append(docFrag);
	},
	/* radio */
	disabledRadio: function(name, disabled) {
		// $('input[type="radio"]').prop('disabled', disabled);
		$("input[id^='{0}']".substitute(name)).attr('disabled',disabled);
		/*$("input[name='{0}']:checked".substitute(name)).css('disable', disabled);*/
	},	/* radio */
	clickRadio: function(name, value) {
		$("input:radio[id^='{0}']:input[value='{1}']".substitute(name, value)).attr("checked", true);

	},

	/* radioInput - 검색 */
	createRadioInput: function($div, source) {

		var docFrag = $(document.createDocumentFragment());
        var _id = $div.attr('id');

		console.dir(_id);


		$.each(source, function (i, v) {
			var _radioId = _id + i;
			docFrag.append($('<input/>', {id: _radioId, type: 'radio', name: _id, value: v.value, checked: i == 0}));
			docFrag.append($('<label/>', {for: _radioId, text: v.label, class: 'hm-radio'}));
		});
		docFrag.append($('<input/>', {type: 'text', id: _id + '_input', style: 'display: block; margin-left: 3px;'}));
		$div.append(docFrag);

	},


    /* radioInput - 검색 */
    createRadioDate: function ($div, source) {
        var docFrag = $(document.createDocumentFragment());
        var _id = $div.attr('id');
        $.each(source, function (i, v) {
            var _radioId = _id + i;
            docFrag.append($('<input/>', {id: _radioId, type: 'radio', name: _id, value: v.value, checked: i == 0}));
            docFrag.append($('<label/>', {for: _radioId, text: v.label, class: 'hm-radio'}));
        });
        $div.append(docFrag);
    },


    /* 실시간/기간 조건 생성
    *	@params
    * 	cid					기간 dom 생성시 unique id를 생성하기 위한 suffix
    * 	fn_searchCallback	'실시간' timer 사용시 'complete' 이벤트에 호출한 callback function
    * 	timer				'실시간' 사용시 timer 객체를 담을 변수
    * 	perfCycleNm			수집주기 radio name
    *
    **/

	createPeriod: function(cid, fn_searchCallback, timer, perfCycleNm) {
		cid = cid || '';
		$("input:radio[name=sPeriod{0}]".substitute(cid)).click(function(event){
			var _val = $(this).val(), _unit = $(this).val().replace(/[0-9\-]/ig, '');
			// value값에 단위가 존재하는 경우 예외처리 (m: minute)
			if(_unit.length) {
				_val = $(this).val().replace(/\D/ig,'');
				// clear timer
				if (timer != null) {
					clearInterval(timer);
				}
				$(this).closest('div.tab_container').find('section.content1').css('display', 'none');
				$(this).closest('div.tab_container').find('section.content2').css('display', 'inline-block');
				$('#sDate1{0}'.substitute(cid)).add( $('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({ disabled: true });
				if(_unit != 'ALL') {
					Master.radioCbPeriodCondition($("input[name='sPeriod{0}']:checked".substitute(cid)), $('#sDate1' + cid), $('#sDate2' + cid));
				}
			}
			else { // 0(실시간), -1(기간) 일때...
				if (_val == "0") {
					$(this).closest('div.tab_container').find('section.content1').css('display', 'inline-block');
					$(this).closest('div.tab_container').find('section.content2').css('display', 'none');
					$("input:radio[name='sRef{0}']:last".substitute(cid)).click();
				}
				else {
					// clear timer
					if (timer != null) {
						clearInterval(timer);
					}
					$(this).closest('div.tab_container').find('section.content1').css('display', 'none');
					$(this).closest('div.tab_container').find('section.content2').css('display', 'inline-block');
					$('#sDate1{0}'.substitute(cid)).add($('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({disabled: _val != "-1"});
					if (_val != "-1") {
						Master.radioCbPeriodCondition($("input[name='sPeriod{0}']:checked".substitute(cid)), $('#sDate1' + cid), $('#sDate2' + cid));
					}
				}
			}
			// 수집주기 radio가 존재하면 기간구분 선택에 따른 수집주기 설정 변경
			if(perfCycleNm !== undefined) {
				var _perfCycle = 2; // default = 2
				if(_val == '1') {
					_perfCycle = 1;
				}
				else if(_val == '365') {
					_perfCycle = 3;
				}
				$("input:radio[name={0}][value={1}]".substitute(perfCycleNm, _perfCycle)).click();
			}
		});

		// 실시간 조건
		$("input:radio[name='sRef{0}']".substitute(cid)).click(function() {
			var _val = $(this).val();
			if (timer != null) {
				clearInterval(timer);
			}
			if (_val > 0) {
				timer = setInterval(function() {
					var curVal = $('#prgrsBar'+cid).val();
					if (curVal < 100)
						curVal += 100 / _val;
					$('#prgrsBar'+cid).val(curVal);
				}, 1000);
			} else {
				$('#prgrsBar'+cid).val(0);
			}
		});
		$('#prgrsBar'+cid).jqxProgressBar({ width : 70, height : 20, theme: jqxTheme, showText : true, animationDuration: 0 })
			.on('complete', function(event) {
				$(this).val(0);
				if(fn_searchCallback != null) {
					fn_searchCallback();
				}
			});

		// date 조건
		HmDate.create($('#sDate1'+ cid), $('#sDate2'+ cid), HmDate.HOUR, 0);

		// 구분 default = first element
		$("input:radio[name=sPeriod{0}]:first".substitute(cid)).click();
	},

	createTmsPeriod: function(cid, fn_searchCallback, timer, perfCycleNm) {
		cid = cid || '';
		// TMS는 5분단위로 설정

		$('#sDate1{0}'.substitute(cid)).on('valueChanged', function(event) {
			var jsDate = event.args.date;
			var mod = jsDate.getMinutes() % 5;
			if(mod == 1) {
				jsDate.setMinutes(jsDate.getMinutes() - mod );
				if( jsDate >  $('#sDate2{0}'.substitute(cid)).jqxDateTimeInput('getDate')  ){
					$(this).jqxDateTimeInput('setDate', $('#sDate2{0}'.substitute(cid)).jqxDateTimeInput('getDate') );
				}else{
					$(this).jqxDateTimeInput('setDate', jsDate);
				}
			}else if(mod == 2){
				jsDate.setMinutes(jsDate.getMinutes() - mod );
				if( jsDate >  $('#sDate2{0}'.substitute(cid)).jqxDateTimeInput('getDate')  ){
					$(this).jqxDateTimeInput('setDate', $('#sDate2{0}'.substitute(cid)).jqxDateTimeInput('getDate') );
				}else{
					$(this).jqxDateTimeInput('setDate', jsDate);
				}
			}else if(mod == 3){
				jsDate.setMinutes(jsDate.getMinutes() - mod );
				if( jsDate >  $('#sDate2{0}'.substitute(cid)).jqxDateTimeInput('getDate')  ){
					$(this).jqxDateTimeInput('setDate', $('#sDate2{0}'.substitute(cid)).jqxDateTimeInput('getDate') );
				}else{
					$(this).jqxDateTimeInput('setDate', jsDate);
				}
			}else if(mod == 4){
				jsDate.setMinutes(jsDate.getMinutes() - mod );
				if( jsDate >  $('#sDate2{0}'.substitute(cid)).jqxDateTimeInput('getDate')  ){
					$(this).jqxDateTimeInput('setDate', $('#sDate2{0}'.substitute(cid)).jqxDateTimeInput('getDate') );
				}else{
					$(this).jqxDateTimeInput('setDate', jsDate);
				}
			}
		});

		$('#sDate2{0}'.substitute(cid)).on('valueChanged', function(event) {
			var jsDate = event.args.date;
			var mod = jsDate.getMinutes() % 5;
			if(mod == 1) {
				jsDate.setMinutes(jsDate.getMinutes() - mod );

				if( jsDate <  $('#sDate1{0}'.substitute(cid)).jqxDateTimeInput('getDate')  ){

					var tmpDate = $('#sDate1{0}'.substitute(cid)).jqxDateTimeInput('getDate');
					tmpDate.setMinutes(tmpDate.getMinutes() + 5 );
					$(this).jqxDateTimeInput('setDate', tmpDate );

				}else{
					$(this).jqxDateTimeInput('setDate', jsDate);
				}
			}
			else if(mod == 2){
				jsDate.setMinutes(jsDate.getMinutes() - mod );

				if( jsDate <  $('#sDate1{0}'.substitute(cid)).jqxDateTimeInput('getDate')  ){

					var tmpDate = $('#sDate1{0}'.substitute(cid)).jqxDateTimeInput('getDate');
					tmpDate.setMinutes(tmpDate.getMinutes() + 5 );
					$(this).jqxDateTimeInput('setDate', tmpDate );

				}else{
					$(this).jqxDateTimeInput('setDate', jsDate);
				}
			}
			else if(mod == 3){
				jsDate.setMinutes(jsDate.getMinutes() - mod );

				if( jsDate <  $('#sDate1{0}'.substitute(cid)).jqxDateTimeInput('getDate')  ){

					var tmpDate = $('#sDate1{0}'.substitute(cid)).jqxDateTimeInput('getDate');
					tmpDate.setMinutes(tmpDate.getMinutes() + 5 );
					$(this).jqxDateTimeInput('setDate', tmpDate );

				}else{
					$(this).jqxDateTimeInput('setDate', jsDate);
				}
			}

			else if(mod == 4){
				jsDate.setMinutes(jsDate.getMinutes() - mod );

				if( jsDate <  $('#sDate1{0}'.substitute(cid)).jqxDateTimeInput('getDate')  ){

					var tmpDate = $('#sDate1{0}'.substitute(cid)).jqxDateTimeInput('getDate');
					tmpDate.setMinutes(tmpDate.getMinutes() + 5 );
					$(this).jqxDateTimeInput('setDate', tmpDate );

				}else{
					$(this).jqxDateTimeInput('setDate', jsDate);
				}
			}
		});

		$("input:radio[name=sPeriod{0}]".substitute(cid)).click(function(event){
			var _val = $(this).val(), _unit = $(this).val().replace(/[0-9\-]/ig, '');
			// value값에 단위가 존재하는 경우 예외처리 (m: minute)
			if(_unit.length) {
				_val = parseInt($(this).val().replace(/\D/ig,''));
				$(this).closest('div.tab_container').find('section.content1').css('display', 'none');
				$(this).closest('div.tab_container').find('section.content2').css('display', 'inline-block');
				$('#sDate1{0}'.substitute(cid)).add( $('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({ disabled: true });
				switch(_unit) {
					case 'm': //minute
						var toDate = new Date();
						var fromDate = new Date();
						if(_val == 5) {
							var min = Math.floor(fromDate.getMinutes() / 5) * 5;
							fromDate.setMinutes(min-5);
							toDate.setMinutes(min);
						}
						else if(_val == 10) {
							// toDate.setMinutes(Math.floor(toDate.getMinutes() / 5) * 5);
							// fromDate.setTime(toDate.getTime() - (5 * 60 * 1000));
							var min = Math.floor(fromDate.getMinutes() / 5) * 5;
							fromDate.setMinutes(min-10);
							toDate.setMinutes(min);
						}
						else {
							fromDate.setTime(toDate.getTime() - (_val * 60 * 1000));
						}
						$('#sDate1{0}'.substitute(cid)).jqxDateTimeInput('setDate', fromDate);
						$('#sDate2{0}'.substitute(cid)).jqxDateTimeInput('setDate', toDate);
						break;
					case 'D' :
						Master.radioCbPeriodCondition($("input[name='sPeriod{0}']:checked".substitute(cid)), $('#sDate1' + cid), $('#sDate2' + cid));
						$('#sDate1{0}'.substitute(cid)).add($('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({disabled: _val != "-1"});
						break;
				}
			}
			else {
				if (_val == "0") {
					$(this).closest('div.tab_container').find('section.content1').css('display', 'inline-block');
					$(this).closest('div.tab_container').find('section.content2').css('display', 'none');
					$("input:radio[name='sRef{0}']:last".substitute(cid)).click();
				} else {
					$(this).closest('div.tab_container').find('section.content1').css('display', 'none');
					$(this).closest('div.tab_container').find('section.content2').css('display', 'inline-block');
					$('#sDate1{0}'.substitute(cid)).add($('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({disabled: _val != "-1"});
					if (_val != "-1") {
						Master.radioCbPeriodCondition($("input[name='sPeriod{0}']:checked".substitute(cid)), $('#sDate1' + cid), $('#sDate2' + cid));
					}
					if(_val == "-1"){
						var firstVal = parseInt($("input:radio[name=sPeriod{0}]".substitute(cid)).eq(0).val().replace(/\D/ig,''));
						var firstValUnit = $("input:radio[name=sPeriod{0}]".substitute(cid)).eq(0).val().replace(/[0-9\-]/ig, '');
						//기간 선택 했을 때 각 페이지에 있는 radio에서 첫 번째 값을 찾아서 그 값 기준으로 기간 세팅해줌
						switch(firstValUnit) {
							case 'm': //minute
								var toDate = new Date();
								var fromDate = new Date();
								if(firstVal == 5) {
									var min = Math.floor(fromDate.getMinutes() / 5) * 5;
									fromDate.setMinutes(min-5);
									toDate.setMinutes(min);
								}
								else if(firstVal == 10) {
									var min = Math.floor(fromDate.getMinutes() / 5) * 5;
									fromDate.setMinutes(min-10);
									toDate.setMinutes(min);
								}
								else {
									fromDate.setTime(toDate.getTime() - (firstVal * 60 * 1000));
								}
								$('#sDate1{0}'.substitute(cid)).jqxDateTimeInput('setDate', fromDate);
								$('#sDate2{0}'.substitute(cid)).jqxDateTimeInput('setDate', toDate);
								break;
							case 'D' :
								Master.radioCbPeriodCondition($("input[name='sPeriod{0}']:checked".substitute(cid)), $('#sDate1' + cid), $('#sDate2' + cid));
								$('#sDate1{0}'.substitute(cid)).add($('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({disabled: _val != "-1"});
								break;
						}

					}
				}
			}
		});
		// date 조건
		HmDate.create($('#sDate1'+ cid), $('#sDate2'+ cid), HmDate.HOUR, 0);

		// 구분 default = first element
		$("input:radio[name=sPeriod{0}]:first".substitute(cid)).click();
	},

	createTmsHourPeriod: function(cid, fn_searchCallback, timer, perfCycleNm) {
		cid = cid || '';
		// 1시간 단위로 설정

		$("input:radio[name=sPeriod{0}]".substitute(cid)).click(function(event){
			var _val = $(this).val(), _unit = $(this).val().replace(/[0-9\-]/ig, '');
			// value값에 단위가 존재하는 경우 예외처리 (m: minute)

			if(_unit.length) {

				_val = parseInt($(this).val().replace(/\D/ig,''));

				$(this).closest('div.tab_container').find('section.content1').css('display', 'none');
				$(this).closest('div.tab_container').find('section.content2').css('display', 'inline-block');
				$('#sDate1{0}'.substitute(cid)).add( $('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({ disabled: true });
				$('#sDate1{0}'.substitute(cid)).jqxDateTimeInput({ disabled: true , formatString : 'yyyy-MM-dd HH:00' });
				$('#sDate2{0}'.substitute(cid)).jqxDateTimeInput({ disabled: true , formatString : 'yyyy-MM-dd HH:00' });
				switch(_unit) {
					case 'm': //minute
						var toDate = new Date();
						var fromDate = new Date();

						fromDate.setTime(toDate.getTime() - (_val * 60 * 1000));
						fromDate.setMinutes(0);
						toDate.setMinutes(0);

						$('#sDate1{0}'.substitute(cid)).jqxDateTimeInput('setDate', fromDate);
						$('#sDate2{0}'.substitute(cid)).jqxDateTimeInput('setDate', toDate);
						$('#sDate1{0}'.substitute(cid)).jqxDateTimeInput({ formatString : 'yyyy-MM-dd HH:00'});
						$('#sDate2{0}'.substitute(cid)).jqxDateTimeInput({ formatString : 'yyyy-MM-dd HH:00'});
						break;
					case 'D' :
						var toDate = new Date();
						var fromDate = new Date();
						fromDate.setTime(fromDate.getTime() - (_val * 24 * 60 * 60 * 1000));
						fromDate.setMinutes(0);
						toDate.setMinutes(0);

						$('#sDate1{0}'.substitute(cid)).jqxDateTimeInput('setDate', fromDate);
						$('#sDate2{0}'.substitute(cid)).jqxDateTimeInput('setDate', toDate);
						$('#sDate1{0}'.substitute(cid)).jqxDateTimeInput({ formatString : 'yyyy-MM-dd HH:00'});
						$('#sDate2{0}'.substitute(cid)).jqxDateTimeInput({ formatString : 'yyyy-MM-dd HH:00'});
						$('#sDate1{0}'.substitute(cid)).add($('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({disabled: _val != "-1"});
						break;
				}

			}
			else {

				$(this).closest('div.tab_container').find('section.content1').css('display', 'none');
				$(this).closest('div.tab_container').find('section.content2').css('display', 'inline-block');
				$('#sDate1{0}'.substitute(cid)).add($('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({disabled: _val != "-1"});
				$('#sDate1{0}'.substitute(cid)).jqxDateTimeInput({ formatString : 'yyyy-MM-dd HH:00'});
				$('#sDate2{0}'.substitute(cid)).jqxDateTimeInput({ formatString : 'yyyy-MM-dd HH:00'});
				if (_val != "-1") {
					Master.radioCbPeriodCondition($("input[name='sPeriod{0}']:checked".substitute(cid)), $('#sDate1' + cid), $('#sDate2' + cid));
				}
				if(_val == "-1"){
					var firstVal = parseInt($("input:radio[name=sPeriod{0}]".substitute(cid)).eq(0).val().replace(/\D/ig,''));
					var firstValUnit = $("input:radio[name=sPeriod{0}]".substitute(cid)).eq(0).val().replace(/[0-9\-]/ig, '');
					//기간 선택 했을 때 각 페이지에 있는 radio에서 첫 번째 값을 찾아서 그 값 기준으로 기간 세팅해줌
					switch(firstValUnit) {
						case 'm': //minute
							var toDate = new Date();
							var fromDate = new Date();
							fromDate.setTime(toDate.getTime() - (firstVal * 60 * 1000));
							fromDate.setMinutes(0);
							toDate.setMinutes(0);

							$('#sDate1{0}'.substitute(cid)).jqxDateTimeInput('setDate', fromDate);
							$('#sDate2{0}'.substitute(cid)).jqxDateTimeInput('setDate', toDate);

							break;
						case 'D' :
							Master.radioCbPeriodCondition($("input[name='sPeriod{0}']:checked".substitute(cid)), $('#sDate1' + cid), $('#sDate2' + cid));
							$('#sDate1{0}'.substitute(cid)).add($('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({disabled: _val != "-1"});
							break;
					}

				}
			}
		});

		// date 조건
		HmDate.create($('#sDate1'+ cid), $('#sDate2'+ cid), HmDate.HOUR, 0);

		// 구분 default = first element
		$("input:radio[name=sPeriod{0}]:first".substitute(cid)).click();
	},


	//2023.05.18
	createTmsDatePeriod: function(cid, fn_searchCallback, timer, perfCycleNm) {
		cid = cid || '';
		// TMS 용 '년월일' 만 가능하게 함
		$('#sDate1{0}'.substitute(cid)).add( $('#sDate2{0}'.substitute(cid)))
			.on('valueChanged', function(event) {
				var jsDate = event.args.date;
				// console.dir(jsDate);
			});

		$("input:radio[name=sPeriod{0}]".substitute(cid)).click(function(event){
			var _val = $(this).val(), _unit = $(this).val().replace(/[0-9\-]/ig, '');
			// value값에 단위가 존재하는 경우 예외처리 (m: minute)

			if(_unit.length) {
				_val = parseInt($(this).val().replace(/\D/ig,''));
				$(this).closest('div.tab_container').find('section.content1').css('display', 'none');
				$(this).closest('div.tab_container').find('section.content2').css('display', 'inline-block');
				$('#sDate1{0}'.substitute(cid)).jqxDateTimeInput({ disabled: true , formatString : 'yyyy-MM-dd 00:00' , width : 95 });
				$('#sDate2{0}'.substitute(cid)).jqxDateTimeInput({ disabled: true , formatString : 'yyyy-MM-dd 23:59' , width : 95 });
				switch(_unit) {
					case 'D' :
						// Master.radioCbPeriodCondition($("input[name='sPeriod{0}']:checked".substitute(cid)), $('#sDate1' + cid), $('#sDate2' + cid));
						var comboVal = parseInt($("input[name='sPeriod{0}']:checked".substitute(cid)).val().replace(/\D/ig, ''));
						var toDate = new Date(), fromDate = new Date();
						fromDate.setTime(fromDate.getTime() - (comboVal * 24 * 60 * 60 * 1000));
						toDate.setTime(toDate.getTime() - (24 * 60 * 60 * 1000));

						$('#sDate1' + cid).jqxDateTimeInput('setDate', fromDate);
						$('#sDate2' + cid).jqxDateTimeInput('setDate', toDate);
						$('#sDate1' + cid).add($('#sDate2' + cid)).jqxDateTimeInput({disabled: true});

						$('#sDate1{0}'.substitute(cid)).add($('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({disabled: _val != "-1"});
						$('#sDate1{0}'.substitute(cid)).jqxDateTimeInput({ formatString : 'yyyy-MM-dd'});
						$('#sDate2{0}'.substitute(cid)).jqxDateTimeInput({ formatString : 'yyyy-MM-dd'});
						break;
				}
			}
			else {
				$(this).closest('div.tab_container').find('section.content1').css('display', 'none');
				$(this).closest('div.tab_container').find('section.content2').css('display', 'inline-block');
				$('#sDate1{0}'.substitute(cid)).add($('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({disabled: _val != "-1"});
				if (_val != "-1") {
					Master.radioCbPeriodCondition($("input[name='sPeriod{0}']:checked".substitute(cid)), $('#sDate1' + cid), $('#sDate2' + cid));
				}
				if(_val == "-1"){
					var firstVal = parseInt($("input:radio[name=sPeriod{0}]".substitute(cid)).eq(0).val().replace(/\D/ig,''));
					var firstValUnit = $("input:radio[name=sPeriod{0}]".substitute(cid)).eq(0).val().replace(/[0-9\-]/ig, '');
					//기간 선택 했을 때 각 페이지에 있는 radio에서 첫 번째 값을 찾아서 그 값 기준으로 기간 세팅해줌
					switch(firstValUnit) {
						case 'D' :
							Master.radioCbPeriodCondition($("input[name='sPeriod{0}']:checked".substitute(cid)), $('#sDate1' + cid), $('#sDate2' + cid));

							var comboVal = parseInt($("input[name='sPeriod{0}']:checked".substitute(cid)).val().replace(/\D/ig, ''));
							var toDate = new Date(), fromDate = new Date();
							fromDate.setTime(fromDate.getTime() - (comboVal * 24 * 60 * 60 * 1000));
							toDate.setTime(toDate.getTime() - (24 * 60 * 60 * 1000));
							$('#sDate1' + cid).jqxDateTimeInput('setDate', fromDate);
							$('#sDate2' + cid).jqxDateTimeInput('setDate', toDate);
							$('#sDate1' + cid).add($('#sDate2' + cid)).jqxDateTimeInput({disabled: true});
							$('#sDate1{0}'.substitute(cid)).jqxDateTimeInput({ formatString : 'yyyy-MM-dd'});
							$('#sDate2{0}'.substitute(cid)).jqxDateTimeInput({ formatString : 'yyyy-MM-dd'});

							$('#sDate1{0}'.substitute(cid)).add($('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({disabled: _val != "-1"});
							break;
					}

				}
			}
		});
		// date 조건
		HmDate.create($('#sDate1'+ cid), $('#sDate2'+ cid), HmDate.HOUR, 0);

		// 구분 default = first element
		$("input:radio[name=sPeriod{0}]:first".substitute(cid)).click();
	},


	refreshPeriod: function(cid) {
		cid = cid || '';
		var _sPeriod = $("input:radio[name=sPeriod{0}]:checked".substitute(cid)).val();
		if($.inArray(_sPeriod, ['0', '-1']) === -1) {
			$("input:radio[name=sPeriod{0}]:checked".substitute(cid)).click();
		}
	},

	getPeriodParams: function(cid) {

		cid = cid || '';
		var _period = "";

		if($("input[name='sPeriod{0}']:checked".substitute(cid)).val().indexOf("-") == 0){
			_period = "-" + $("input[name='sPeriod{0}']:checked".substitute(cid)).val().replace(/\D/ig,'');
		} else {
			_period = $("input[name='sPeriod{0}']:checked".substitute(cid)).val().replace(/\D/ig,'');
		}

		return {
			period: _period,
			date1: HmDate.getDateStr($('#sDate1'+cid)),
			time1: HmDate.getTimeStr($('#sDate1'+cid)),
			date2: HmDate.getDateStr($('#sDate2'+cid)),
			time2: HmDate.getTimeStr($('#sDate2'+cid))
		};

	},

	getSrchParams: function(radioNm) {

		if(radioNm === undefined) {
			radioNm = 'sSrchType';
		}

		var _stype = $("input:radio[name={0}]:checked".substitute(radioNm)).val(),
			_stext = $('#{0}_input'.substitute(radioNm)).val();

		return {
			sIp: _stype == 'IP'? _stext : null,
			sDevName: _stype == 'NAME'? _stext : null,
			sDevKind2: _stype == 'DEVKIND2'? _stext : null,
			sVendor: _stype == 'VENDOR'? _stext : null,
			sModel: _stype == 'MODEL'? _stext : null,
			sProcName: _stype == 'PROC_NAME'? _stext : null,
		};

	},

	val: function(name) {
		return $("input[name='{0}']:checked".substitute(name)).val();
	},

	label: function(name) {
		var id = $("input[name='{0}']:checked".substitute(name)).attr('id');
		return $("label[for='{0}']".substitute(id)).text();
	},

	/** 선택된 Radio Value 리턴 */
	getValue: function($box) {
		if($box === undefined) {
			return null
		}
		var _id = $box.attr('id');
		return $("input[name='target_"+_id+"']:checked").val();
	},

    /* resource value 앞에 s_ 붙인 후 lowerCase 로 변환, camelCase 로변환 */
    getCamelCaseSrchParams: function (radioNm) {
        if (radioNm === undefined) {
            radioNm = 'sSrchType';
        }
        var _stype = $("input:radio[name={0}]:checked".substitute(radioNm)).val(),
            _stext = $('#{0}_input'.substitute(radioNm)).val();
        _stype = ('s_' + _stype).underscoreToCamelCase();
        var obj = {};
        obj[_stype] = _stext.isBlank() ? null : _stext;
        return obj;
    },


};
