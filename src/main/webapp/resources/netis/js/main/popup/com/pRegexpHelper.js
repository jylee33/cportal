var matchGroupArry = [];
var matchRegexCnt = [];
var pRegexp = {
    /** variable */
    initVariable: function() {

    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { pRegexp.eventControl(event); });
    },

    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'patternTextDel': this.patternTextDel(); break;
            case 'actionApply': this.actionApply(); break;

            case 'regexpExecute': this.regexpExecute(); break;

            case 'regexpHelperConfirm': this.regexpHelperConfirm(); break;
            case 'regexpHelperClose': this.regexpHelperClose(); break;
            //case 'autoHelp': this.autoHelp(); break;

        }
    },

    /** init design */
    initDesign: function() {
        /*$("#pattern").val('[\\s]+no[\\s]+ip[\\s]+redirects');

        $("#dragText").val('interface GigabitEthernet5/23\n' +
            ' description ## 03104567-0012,원자력안전기술원,보람중-25-TS06-2A-P6,72C_1조-45_46,Tu83,VB,L3-G1/0/23 ##\n' +
            ' no switchport\n' +
            ' ip address 172.121.83.217 255.255.255.248\n' +
            ' no ip redirects\n' +
            ' no ip unreachables\n' +
            ' no ip proxy-arp\n' +
            ' load-interval 30\n' +
            ' no cdp enable');*/

        $('#checkGrp, #numberFix').jqxCheckBox({ height: 22}); //#checkMinus
        $('#fixType').jqxDropDownList({width: 80, height: 21, theme: jqxTheme, autoDropDownHeight: true,
            source: [
                { label: '숫자고정',	value: 0 },
                { label: '숫자가변',	value: 1 },
            ],
            displayMember: 'label', valueMember: 'value', selectedIndex: 0
        });
        $('#compareType').jqxDropDownList({width: 80, height: 21, theme: jqxTheme, autoDropDownHeight: true,
            source: [
                { label: '같은경우',	value: 1 },
                { label: '다른경우',	value: 2 },
            ],
            displayMember: 'label', valueMember: 'value', selectedIndex: 0
        });
        $('#overBelowNum').jqxDropDownList({width: 80, height: 21, theme: jqxTheme, autoDropDownHeight: true,
            source: [
                { label: '1',	value: 1 },
                { label: '2',	value: 2 },
                { label: '3',	value: 3 },
                { label: '4',	value: 4 },
                { label: '5',	value: 5 },
                { label: '6',	value: 6 },
                { label: '7',	value: 7 },
                { label: '8',	value: 8 },
                { label: '9',	value: 9 }
            ],
            displayMember: 'label', valueMember: 'value', selectedIndex: 0
        });
        $('#overBelowUnit').jqxDropDownList({width: 120, height: 21, theme: jqxTheme, autoDropDownHeight: true,
            source: [
                { label: '',	value: '' },
                { label: '0',	value: '0' },
                { label: '00',	value: '00' },
                { label: '000',	value: '000' },
                { label: '0,000',	value: '0000' },
                { label: '00,000',	value: '00000' },
                { label: '000,000',	value: '000000' },
                { label: '0,000,000',	value: '0000000' },
                { label: '00,000,000',	value: '00000000'},
                { label: '000,000,000',	value: '000000000' },
                { label: '0000000000',	value: '0000000000' },
                { label: '00000000000',	value: '00000000000' },
                { label: '000000000000',	value: '000000000000' },
                { label: '0000000000000',	value: '0000000000000' },
                { label: '00000000000000',	value: '00000000000000' },
                { label: '000000000000000',	value: '000000000000000' },

            ],
            displayMember: 'label', valueMember: 'value', selectedIndex: 0
        });
        $('#overBelowType').jqxDropDownList({width: 80, height: 21, theme: jqxTheme, autoDropDownHeight: true,
            source: [
                { label: '이상',	value: 'OVER' },
                { label: '이하',	value: 'BELOW' },
            ],
            displayMember: 'label', valueMember: 'value', selectedIndex: 0
        });

    },

    /** init data */
    initData: function() {

        //점검필터 팝업의 샘플 텍스트..
        var filterSampleText = window.opener.$("#filterSampleText").val();

    },

    //필터문법 추가
    regexpApply: function (type, val) {
        var patternStr = ''//$("#pattern").val();
        var regExpText1  = $("#regExpText1").val();

        var regExpText2  = $("#regExpText2").val();
        var regExpText3  = $("#regExpText3").val();

        var regExpText4  = $("#regExpText4").val();
        var regExpText5  = $("#regExpText5").val();


        if(type == 'PATTERN'){
            if(val == 1){
                patternStr += '['+ regExpText1 +']'
            }else if(val == 2){
                if(regExpText2 == '' || regExpText3 == ''){
                    alert("시작/끝 값을 입력해주세요"); return;
                }
                patternStr += '['+ regExpText2 +'-'+	regExpText3	+']'
            }else if(val == 3){ //숫자범위
                if(regExpText4 == '' || regExpText5 == ''){
                    alert("시작/끝 값을 입력해주세요"); return;
                }

                if(regExpText4 * 1 > regExpText5 * 1){
                    alert("입력 숫자 범위를 확인해주세요"); return;
                }

                if(regExpText4.length > 3 || regExpText5.length > 3){
                    alert("최대 입력 숫자 단위는 3자리 입니다");
                    return;
                }

                patternStr += Regexp.ConvertNumberGap(regExpText4, regExpText5);


            }else if(val == 4){
                patternStr += '['+ '\\s'+	']'
            }else if(val == 5){
                patternStr += '['+ '\\w'+	']'
            }else if(val == 6){
                patternStr += '['+ '\\W'+	']'
            }else if(val == 7){
                patternStr += '['+ '\\d'+	']'
            }else if(val == 8){
                patternStr += '['+ '\\D'+	']'
            }else if(val == 9){
                patternStr += '('+ $("#regExpText6").val()+')'
            }
        }else if(type == 'OPER'){
            patternStr += val //	'|' 연산자 | 또는 + 그리고

        }else if(type == 'GROUP'){
            if(val == 'START'){
                patternStr += '(';
            }else{
                patternStr += ')+';
            }
        }else if(type == 'BEETWEEN'){
            if(val == 'START'){
                patternStr += '(?=';
            }else{
                patternStr += ')';
            }
        }else if(type == 'OVERBELOW'){
            var overBelowNum = $("#overBelowNum").val();
            var overBelowUnit = $("#overBelowUnit").val();
            var overBelowType = $("#overBelowType").val(); //OVER 이상, BELOW 이하

            if(overBelowType == 'OVER'){
                patternStr = RegexpCreator.Over(overBelowNum,overBelowUnit);
            }else{
                patternStr = RegexpCreator.Below(overBelowNum,overBelowUnit);
            }

        }

        var _data = $('#pattern').val();
        var _curIndex = pRegexp.textbox();
        var _insertText = patternStr;
        var _result = [_data.slice(0, _curIndex), _insertText, _data.slice(_curIndex)].join('');
        $("#pattern").val(_result);
    },

    //정규식 문법 영역 초기화
    patternTextDel: function () {
        $("#pattern").val('');
        $("#inputRegexpResult").text('');

        $("#regexpMatchGroup").text(''); //그룹문자열
        $("#matchRegexCnt").text('0'); //점검결과 개수

    },

    //정규식 필터 시작
    regexpExecute: function () {
        var regExp = new RegExp("[a-z]", "g");
        var pattern = $("#pattern").val();
        if(pattern == ''){
            alert("입력된 정규식 문법이 없습니다.");
            return;
        };
        //필터결과 영역 초기화
        $("#inputRegexpResult").text('');
        //선택그룹
        $("#regexpMatchGroup").text('');

        matchRegexCnt = [];

        //일치 그룹 문자열 표시영역 초기화 + 그룹문자열 arry 초기화
        matchGroupArry = [];

        var re = new RegExp(pattern, "gm");
        // 문자열 구하기
        var searchString = $("#dragText").val();
        var matchArray;
        var resultString = "";
        var first = 0;
        var last = 0;

        //var matchArrayStr = re.exec(searchString);

        // 각각의 일치하는 부분 검색
        while ( (matchArray = re.exec(searchString)) != null ) {
            last = matchArray.index;

            // 일치하는 모든 문자열을 연결
            resultString += searchString.substring(first, last);

            // 일치하는 부분에 red
            resultString += "<span class='found found_"+first+"'>" + matchArray[0] + "</span>";
            first = re.lastIndex;
            // RegExp객체의 lastIndex속성을 이용해 검색 결과의 마지막인덱스 접근

            matchRegexCnt.push(matchArray[0]) //정규식 결과 개수. (글자수X. 정규식에 해당 결과 row 수)
        }

        // 문자열 종료
        resultString += searchString.substring(first, searchString.length);
        resultString += "";

        // 화면에 출력
        $("#inputRegexpResult").append(resultString);


        var reGroupStr= new RegExp(pattern, "gm");
        var reArr = reGroupStr.exec($("#dragText").val());

        if(reArr == null){
            alert("검색된 정규식 결과가 존재하지 않습니다.");
            $("#inputRegexpResult").text();
            return
        }

        //정규식 exec실행 이후 arry 크기가 2인 것만 그룹 문자열이 있다고 판단.
        //결과에서 arry[0]은 일치하는 전체 문자열이 담기는 영역이고, arry[1] 부터 실제 그룹 문자열이 담기기 시작.
        //따라서 arry 크기가 2이상인것만 그룹 문자열이 있다고 판단한다.
        var matchGroupText = '';
        if(reArr.length > 1) {
            $.each(reArr, function (idx, value) {
                if(idx > 0){ //0번째는 포함되는 전체 문자열. 1번쨰부터 그룹문자 시작
                    matchGroupText += '<span style="font-weight: normal">['+idx+']</span>'
                    matchGroupText += '<span style="font-weight: bold; color: #1C97EA;">'+value+'</span>'

                    matchGroupArry.push(value);

                    if(idx !== reArr.length - 1) {
                        matchGroupText += '&nbsp;'
                    }
                }
            });
            $("#regexpMatchInfo").text(''); //설명 문구 제거
            $("#regexpMatchGroup").append(matchGroupText);
        }
        $("#matchRegexCnt").text(matchRegexCnt.length);

        //검색된 결과 첫번쨰로 포커스 이동
        $('.found').each(function(idx,data){
            if(idx == 0){
                this.scrollIntoView(true);
            }
        });
    },


    //조치방안 적용 -> 팝업 분리하면서 미사용
    actionApply: function () {
        var inputAction = $("#inputAction").val();
        var inputActionReplace =  $("#inputAction").val();

        for(var i = 0; i < matchGroupArry.length; i++){
            inputActionReplace = inputActionReplace.replace('{' + (i+1)*1 + '}', matchGroupArry[i])
        }
        $("#inputActionResult").text(inputActionReplace)
    },

    //도우미 팝업 확인 -> 필터 팝업으로 정규식 추가된 문법을 전달 -> 도우미 닫기
    regexpHelperConfirm: function () {
        //도우미 정규식문법
        var regexpHelperRexexp = $("#pattern").val();

        //호출한 부모창의 인풋 테스트 ID
        var callbackInput = $("#regexInputId").val();

        //필터팝업 정규식 영역
        window.opener.$("#"+callbackInput).val(regexpHelperRexexp);
        self.close();
    },

    regexpHelperClose: function () {
        self.close();
    },

    //기준문자열 추출
    standardText: function () {
        var checkGrp  = $("#checkGrp").val();
        var fixType = $("#fixType").val(); //숫자고정:0 숫자가변:1

        var dragText = pRegexp.getDragText().toString();
        var test = '';
        var textPattern = [];
        for(var i=0; i < dragText.length; i++){
            var checkText = dragText[i];
            var checkFlag = true;

            if(checkGrp) { //그룹지정 선택일 경우 정규식 문자열의 시작 문법은 '('
                if( i == 0){
                    test += '('
                }
            }
            var checkForwardText = dragText[i-1];
            var checkTextType =  RegexpCreator.validateStrType(checkText);
            var checkForwardTextType = RegexpCreator.validateStrType(checkForwardText);

            if(RegexpCreator.validateStr(checkText)){
                a = '문자';
                test += pRegexp.createRegexpExStrNum('STR', checkText); //문자일 경우는 고정/가변에 상관없이 무조건 문자 형태 그대로 표현
            }else if(RegexpCreator.validateNum(checkText)){
                a = '숫자';
                if(fixType == 0){ //숫자 고정일 경우는 있는 그대로 표현. 123 드래그 -> 123 추출
                    test += pRegexp.createRegexpExStrNum('NUM', checkText)
                }else{ //숫자 가변일 경우는 숫자 정규식으로 변환 123 -> \d
                    if( i > 0) { //2번쨰 글자 부터
                        if(checkTextType != checkForwardTextType){
                            test += pRegexp.createAutoRegexp('NUM', checkText)
                            test += '+'; //정규식의 끝은 무조건 +를 붙인다. 이유 모름 CS프로그램 규칙
                        }
                    }else{
                        test += pRegexp.createAutoRegexp('NUM', checkText)
                        test += '+'; //정규식의 끝은 무조건 +를 붙인다. 이유 모름 CS프로그램 규칙
                    }
                }


            }else if(RegexpCreator.validateSpace(checkText)){
                a = '공백';
                //기준문자열 추출시 공백이 N개 로 이어질 경우 \s 한개로 표현
                if(checkTextType != checkForwardTextType){
                    test += pRegexp.createRegexpExStrNum('SPACE', checkText)
                    test += '+';
                }
            }else if(RegexpCreator.validateNotStrNum(checkText)){
                a = '기호';
                test += pRegexp.createAutoRegexp('OTHER', checkText);


            }

            if(checkGrp) { //그룹지정 선택일 경우 정규식 문자열의 끝은 ')+'
                if (i == (dragText.length) - 1) {
                    test += ')+'
                }
            }
        }

        var _data = $('#pattern').val();
        var _curIndex = pRegexp.textbox();
        var _insertText = test;
        var _result = [_data.slice(0, _curIndex), _insertText, _data.slice(_curIndex)].join('');
        $("#pattern").val(_result);

    },

    //문자패턴 추출
    extractText : function(){
        var dragText = pRegexp.getDragText().toString();
        var test = '[';
        var textPattern = [];
        for(var i=0; i < dragText.length; i++){
            var checkText = dragText[i];
            var checkTextType =  RegexpCreator.validateStrType(checkText);

            if(checkTextType == 'STR' || checkTextType == 'NUM'){
                if ( textPattern.includes(pRegexp.createAutoPatternRegexp2('STR', checkText)) === false ) {
                    textPattern.push(pRegexp.createAutoPatternRegexp2('STR', checkText));
                }
            }else if(checkTextType == 'SPACE'){
                if ( textPattern.includes(pRegexp.createAutoPatternRegexp2('SPACE', checkText)) === false ) {
                    textPattern.push(pRegexp.createAutoPatternRegexp2('SPACE', checkText));
                }
            }else{
                if ( textPattern.includes(pRegexp.createAutoPatternRegexp2('OTHER', checkText)) === false ) {
                    textPattern.push(pRegexp.createAutoPatternRegexp2('OTHER', checkText));
                }
            }


        };

        if(textPattern.length >0 ){
            for(var i=0; i < textPattern.length; i++){
                test += textPattern[i];
            }
        }
        test += ']';
        if(dragText.length > 0){
            test += '+';
        };

        var _data = $('#pattern').val();
        var _curIndex = pRegexp.textbox();
        var _insertText = test;
        var _result = [_data.slice(0, _curIndex), _insertText, _data.slice(_curIndex)].join('');

        $("#pattern").val(_result);
    },

    getDragText: function () {
        var selectionText = "";
        if (document.getSelection) {
            selectionText = document.getSelection();
        } else if (document.selection) {
            selectionText = document.selection.createRange().text;
        }
        return selectionText;
    },

    createAutoRegexp: function (textType, textVal) {
        var regexpStr = '';
        if(textType == 'STR'){
            regexpStr = textVal;
        }else if(textType == 'NUM'){
            regexpStr = '['+ '\\d'+	']'
        }else if(textType == 'SPACE'){
            regexpStr = '['+ '\\s'+	']'
        }else if(textType == 'OTHER'){
            regexpStr = '['+ '\\' + textVal + ']'
        }
        return regexpStr;

    },

    createRegexpExStrNum: function (textType, textVal) {
        var regexpStr = '';
        if(textType == 'STR'){
            regexpStr = textVal;
        }else if(textType == 'NUM'){
            regexpStr = textVal;
        }else if(textType == 'SPACE'){
            regexpStr = '['+ '\\s'+	']'
        }else if(textType == 'OTHER'){
            regexpStr = '['+ '\\' + textVal + ']'
        }
        return regexpStr;

    },

    createAutoPatternRegexp: function (textType, textVal) {
        var regexpStr = '';
        if(textType == 'STR'){
            regexpStr = '['+ '\\w'+	']'
        }else if(textType == 'NUM'){
            regexpStr = '['+ '\\d'+	']'
        }else if(textType == 'SPACE'){
            regexpStr = '['+ '\\s'+	']'
        }else if(textType == 'OTHER'){
            regexpStr = '['+ '\\' + textVal + ']'
        }
        return regexpStr;

    },

    createAutoPatternRegexp2: function(textType, textVal) {
        var regexpStr = '';
        if(textType == 'STR' || textType == 'NUM'){
            regexpStr = '\\w';
        }else if(textType == 'SPACE'){
            regexpStr = '\\s';
        }else if(textType == 'OTHER'){
            regexpStr = '\\' + textVal;
        }
        return regexpStr;
    },

    //비교문자열 추출
    compareText: function () {
        var compareType = $("#compareType").val(); //
        var dragText = pRegexp.getDragText().toString();

        //$("#dragVal").text(dragText); //드래그 문자열 표시PS-2
        var test = '';

        if(compareType == 1){ // 비교문자열 1:같은경우, 2:다른경우
            test += '(?=';
        }else{
            test += '(?!';
        }

        for(var i=0; i < dragText.length; i++){
            var checkText = dragText[i];

            var checkForwardText = dragText[i-1];
            var checkTextType =  RegexpCreator.validateStrType(checkText);
            var checkForwardTextType = RegexpCreator.validateStrType(checkForwardText);

            if(RegexpCreator.validateStr(checkText)){
                a = '문자';
                test += pRegexp.createRegexpExStrNum('STR', checkText)
            }else if(RegexpCreator.validateNum(checkText)){
                a = '숫자';
                if( i > 0) { //2번쨰 글자 부터
                    //if(checkTextType != checkForwardTextType){
                    test += pRegexp.createRegexpExStrNum('NUM', checkText)
                    //}
                }else{
                    test += pRegexp.createRegexpExStrNum('NUM', checkText)
                }


            }else if(RegexpCreator.validateSpace(checkText)){
                a = '공백';
                test += pRegexp.createRegexpExStrNum('SPACE', checkText);
            }else if(RegexpCreator.validateNotStrNum(checkText)){
                a = '기호';
                test += pRegexp.createRegexpExStrNum('OTHER', checkText);
            }
        }
        if(dragText.length > 0){
            test += '+';
        }
        test += ')';


        //문자패턴
        var test2 = '';

        test2 += '(';
        for (var i = 0; i < dragText.length; i++) {
            var checkText = dragText[i];
            if (i > 0) { //2번쨰 글자 부터
                var checkForwardText = dragText[i - 1];

                var checkTextType = RegexpCreator.validateStrType(checkText); //드래그 검사 문자 시작 값 (ABC -> A)
                var checkForwardTextType = RegexpCreator.validateStrType(checkForwardText); //드래그문자 검사 한칸 앞 글자 (ABC -> A일 경우는 없고. B의 차례일때 A. C차례 일때 B)

                //검사 글자 타입이 앞의 글자와 형태가 다를 경우만
                //같은 경우에는 정규식 표현 문자를 한번만 사용
                //ex)123A -> /d/d/d/w (x)   /d/w(o)
                //ex)1a2b3 -> /d/w/d/w/d
                if (checkTextType != checkForwardTextType) {
                    if (checkTextType == 'STR' ) {
                        test2 += pRegexp.createAutoPatternRegexp('STR', checkText)
                    } else if (checkTextType == 'NUM') {
                        test2 += pRegexp.createAutoPatternRegexp('NUM', checkText)
                    } else if (checkTextType == 'SPACE') {
                        test2 += pRegexp.createAutoPatternRegexp('SPACE', checkText)
                    } else {
                        test2 += pRegexp.createAutoPatternRegexp('OTHER', checkText)
                    }
                    test2 += '+';
                }
            } else { //제일 첫글자 일때
                var checkTextType = RegexpCreator.validateStrType(checkText);
                if (checkTextType == 'STR') {
                    test2 += pRegexp.createAutoPatternRegexp('STR', checkText)
                }else if (checkTextType == 'NUM') {
                    test2 += pRegexp.createAutoPatternRegexp('NUM', checkText)
                }
                else if (checkTextType == 'SPACE') {
                    test2 += pRegexp.createAutoPatternRegexp('SPACE', checkText)
                } else {
                    test2 += pRegexp.createAutoPatternRegexp('OTHER', checkText)
                }
                test2 += '+';
            }

        }
        if(dragText.length > 0){

        }
        test2 += ')';
        var patternStr = ''
        var _data = $('#pattern').val();
        var _curIndex = pRegexp.textbox();
        var _insertText = test+test2;
        var _result = [_data.slice(0, _curIndex), _insertText, _data.slice(_curIndex)].join('');
        $("#pattern").val(_result);

    },

    numberFix : function(){
        var dragText = pRegexp.getDragText().toString();
        //$("#dragVal").text(dragText);
        var oterhMark = []; //문자포맷 자릿수 고정 시 스플릿 영역을 나누는 기준 특수문자.
        if($("#numberFix").val()) {
            for (var i = 0; i < dragText.length; i++) {
                var checkOtherText = RegexpCreator.validateStrType(dragText[i]);
                if (checkOtherText == 'OTHER') {
                    if (oterhMark.includes(dragText[i]) === false) { //같은 특수문자 저장시 스킵
                        oterhMark.push(dragText[i])
                    }
                }
            }
            //특수문자는 IP와 같이 한가지의 종류 일 경우만 계산 가능 2개 이상은 제외
            if (oterhMark.length == 0) {
                alert("자릿수 고정에 필요한 기호를 포함해주세요.");
                return
            } else if (oterhMark.length > 1) {
                alert("자릿수 고정에 필요한 기호는 한개만 가능합니다.");
                return
            }

            var splitText = dragText.split(oterhMark[0]);
            var splitCnt = 0;
        }

        var test = '(';
        for(var i=0; i < dragText.length; i++){
            var checkText = dragText[i];
            if( i > 0){ //2번쨰 글자 부터
                var checkForwardText = dragText[i-1];

                var checkTextType =  RegexpCreator.validateStrType2(checkText); //드래그 검사 문자 시작 값 (ABC -> A)
                var checkForwardTextType = RegexpCreator.validateStrType2(checkForwardText); //드래그문자 검사 한칸 앞 글자 (ABC -> A일 경우는 없고. B의 차례일때 A. C차례 일때 B)
                if(checkTextType != checkForwardTextType){
                    if(checkTextType == 'STR' || checkTextType == 'NUM'){
                        if($("#numberFix").val()){
                            if(splitText[splitCnt] !== undefined){
                                var splitTextItemCnt = splitText[splitCnt].length;
                                test += pRegexp.createAutoPatternRegexp('STR', checkText);
                                test += '{' + splitTextItemCnt + '}';
                                console.log("test",test)
                                splitCnt ++
                            }
                        }else{
                            test += pRegexp.createAutoPatternRegexp('STR', checkText);
                        }
                    }else if(checkTextType == 'SPACE'){
                        test += pRegexp.createAutoPatternRegexp('SPACE', checkText)
                    }else{
                        test += pRegexp.createAutoPatternRegexp('OTHER', checkText)
                    }
                    if(!$("#numberFix").val()) { //자리수 고정이 아닐 경우
                        test += '+';
                    }
                }
            }else{ //제일 첫글자 일때
                var checkTextType =  RegexpCreator.validateStrType2(checkText);
                if(checkTextType == 'STR' || checkTextType == 'NUM'){
                    test += pRegexp.createAutoPatternRegexp('STR', checkText);
                    if($("#numberFix").val()) {  //자리수 고정일 경우
                        var splitTextItemCnt = splitText[splitCnt].length;
                        test += '{' + splitText[0].length + '}';
                        splitCnt++;
                    }
                }else if(checkTextType == 'SPACE'){
                    test += pRegexp.createAutoPatternRegexp('SPACE', checkText)
                }else{
                    test += pRegexp.createAutoPatternRegexp('OTHER', checkText)
                }
                if(!$("#numberFix").val()) { //자리수 고정이 아닐 경우
                    test += '+';
                }
            }

        }
        test += ')';
        /*var currInputPattern = $("#pattern").val();
        $("#pattern").val(currInputPattern+test);*/

        var _data = $('#pattern').val();
        var _curIndex = pRegexp.textbox();
        var _insertText = test;
        var _result = [_data.slice(0, _curIndex), _insertText, _data.slice(_curIndex)].join('');
        $("#pattern").val(_result);
    },

    textbox:function () {
        var ctl = document.getElementById('pattern');
        var startPos = ctl.selectionStart;
        var endPos = ctl.selectionEnd;
        return startPos;
    },

    //드래그 텍스트 잘라내기 방지
    allowDrop: function (ev) {
        ev.preventDefault();
    },

    help:function(val){
        var helpType = val;
        var returnRegx = '';

        //문법 자동완성시 선택 커서 위치 유지시키기
        var ctl = document.getElementById('pattern');
        var endPos = ctl.selectionEnd;
        var sPos = ctl.selectionStart;

        switch(helpType) {
            case 1 : returnRegx = '.'; break;
            case 2 : returnRegx = '^'; break;
            case 3 : returnRegx = '$'; break;
            case 4 : returnRegx = 'a|b'; break;
            case 5 : returnRegx = '\\b'; break;
            case 6 : returnRegx = '\\n'; break;
            case 7 : returnRegx = '\\r '; break;
            case 8 : returnRegx = '\\t'; break;
            case 9 : returnRegx = '*'; break;
            case 10 : returnRegx = '+'; break;
            case 11 : returnRegx = '?'; break;
            case 12 : returnRegx = '{4}'; break;
            case 13 : returnRegx = '{4,}'; break;
            case 14 : returnRegx = '{2,4}'; break;
            case 15 : returnRegx = '[abc]'; break;
            case 16 : returnRegx = '[0-9]'; break;
            case 17 : returnRegx = '\\w'; break;
            case 18 : returnRegx = '\\W'; break;
            case 19 : returnRegx = '\\s'; break;
            case 20 : returnRegx = '\\S'; break;
            case 21 : returnRegx = '\\d'; break;
            case 22 : returnRegx = '\\D'; break;
            case 23 : returnRegx = '(ab)'; break;
            case 24 : returnRegx = 'a(?=b)'; break;
            case 25 : returnRegx = 'a(?!b)'; break;
            case 26 : returnRegx = '(?<=a)b'; break;
            case 27 : returnRegx = '(?<!a)b'; break;
        }
        var _data = $('#pattern').val();
        var _curIndex = pRegexp.textbox();
        var _insertText = returnRegx;
        var _result = [_data.slice(0, _curIndex), _insertText, _data.slice(_curIndex)].join('');
        $("#pattern").val(_result);
        //$('#pattern').val(returnRegx);

        var returnRegxLength = returnRegx.length; //커서 위치는 자동완성 되는 글자 수 에서 맨뒤로

        ctl.setSelectionRange(endPos+returnRegxLength, endPos+returnRegxLength);
        ctl.focus();
    },

    autoHelp: function (e) {
        if($("#helpDiv").length > 0){
            $("#autoHelp").jqxTooltip('close');
        }
        var html = '';
        html += '<div class="pop_gridTitle" >정규 표현식 도움말</div>';
        html += '<div class="pop_table" id="helpDiv" style="max-height: 200px; width: 250px; overflow-y: scroll; opacity: 1">';
        html += '<table class="helpTable" style="width:233px;height:200px;">';
        html += '<colgroup>';
        html += '<col width="25%">';
        html += '<col width="75%">';
        html += '</colgroup>';
        html += '<tr><th>문자</th><th>설명</th></tr>';
        html += '<tr onclick="pRegexp.help(1);"><th>.</th><td>이외의 모든 문자</td></tr>';
        html += '<tr onclick="pRegexp.help(2);"><th>^</th><td>줄의 시작</td></tr>';
        html += '<tr onclick="pRegexp.help(3);"><th>$</th><td>줄의 끝</td></tr>';
        html += '<tr onclick="pRegexp.help(4);"><th>a|b</th><td>a또는b</td></tr>';
        html += '<tr onclick="pRegexp.help(5);"><th>\\b</th><td>백스페이스</td></tr>';
        html += '<tr onclick="pRegexp.help(6);"><th>\\n</th><td>줄바꿈</td></tr>';
        html += '<tr onclick="pRegexp.help(7);"><th>\\r</th><td>캐리지리턴</td></tr>';
        html += '<tr onclick="pRegexp.help(8);"><th>\\t</th><td>탭</td></tr>';
        html += '<tr onclick="pRegexp.help(9);"><th>*</th><td>0회이상</td></tr>';
        html += '<tr onclick="pRegexp.help(10);"><th>+</th><td>1회이상</td></tr>';
        html += '<tr onclick="pRegexp.help(11);"><th>?</th><td>0또는1회</td></tr>';
        html += '<tr onclick="pRegexp.help(12);"><th>{4}</th><td>지정된횟수(4회)</td></tr>';
        html += '<tr onclick="pRegexp.help(13);"><th>{4,}</th><td>최소횟수(4회)</td></tr>';
        html += '<tr onclick="pRegexp.help(14);"><th>{2,4}</th><td>최소(2)최대(4)횟수</td></tr>';
        html += '<tr onclick="pRegexp.help(15);"><th>[abc]</th><td>abc중한문자</td></tr>';
        html += '<tr onclick="pRegexp.help(16);"><th>[0-9]</th><td>0-9중 한 문자</td></tr>';
        html += '<tr onclick="pRegexp.help(17);"><th>\\w</th><td>단어문자</td></tr>';
        html += '<tr onclick="pRegexp.help(18);"><th>\\W</th><td>단어아닌문자</td></tr>';
        html += '<tr onclick="pRegexp.help(19);"><th>\\s</th><td>공백문자</td></tr>';
        html += '<tr onclick="pRegexp.help(20);"><th>\\S</th><td>공백아닌문자</td></tr>';
        html += '<tr onclick="pRegexp.help(21);"><th>\\d</th><td>10진수숫자</td></tr>';
        html += '<tr onclick="pRegexp.help(22);"><th>\\D</th><td>10진수아닌숫자</td></tr>';
        html += '<tr onclick="pRegexp.help(23);"><th>(ab)</th><td>그룹-1번부터시작,ab 일치</td></tr>';
        html += '<tr onclick="pRegexp.help(24);"><th>a(?=b)</th><td>긍정 lookahead뒤가 b인a</td></tr>';
        html += '<tr onclick="pRegexp.help(25);"><th>a(?!b)</th><td>부정 lookahead뒤가 b가아닌a</td></tr>';
        html += '<tr onclick="pRegexp.help(26);"><th>(?<=a)b</th><td>긍정 lookbehind앞이 a인b</td></tr>';
        html += '<tr onclick="pRegexp.help(27);"><th>(?<&#33;a)b</th><td>부정 lookbehind앞이 a가아닌b</td></tr>';
        html += '</table>';
        html += '</div>';
        $("#autoHelp").jqxTooltip({
            content: html,
            position : "bottom",
            trigger: "click",
            opacity: 1,
            //height: '100',
            //left: -10,
            autoHide: false,
            autoHideDelay: false,
            closeOnClick: false
        });
        $("#autoHelp").jqxTooltip('open');
    },

    help:function(val){
        var helpType = val;
        var returnRegx = '';

        //문법 자동완성시 선택 커서 위치 유지시키기
        var ctl = document.getElementById('pattern');
        var endPos = ctl.selectionEnd;
        var sPos = ctl.selectionStart;

        switch(helpType) {
            case 1 : returnRegx = '.'; break;
            case 2 : returnRegx = '^'; break;
            case 3 : returnRegx = '$'; break;
            case 4 : returnRegx = 'a|b'; break;
            case 5 : returnRegx = '\\b'; break;
            case 6 : returnRegx = '\\n'; break;
            case 7 : returnRegx = '\\r '; break;
            case 8 : returnRegx = '\\t'; break;
            case 9 : returnRegx = '*'; break;
            case 10 : returnRegx = '+'; break;
            case 11 : returnRegx = '?'; break;
            case 12 : returnRegx = '{4}'; break;
            case 13 : returnRegx = '{4,}'; break;
            case 14 : returnRegx = '{2,4}'; break;
            case 15 : returnRegx = '[abc]'; break;
            case 16 : returnRegx = '[0-9]'; break;
            case 17 : returnRegx = '\\w'; break;
            case 18 : returnRegx = '\\W'; break;
            case 19 : returnRegx = '\\s'; break;
            case 20 : returnRegx = '\\S'; break;
            case 21 : returnRegx = '\\d'; break;
            case 22 : returnRegx = '\\D'; break;
            case 23 : returnRegx = '(ab)'; break;
            case 24 : returnRegx = 'a(?=b)'; break;
            case 25 : returnRegx = 'a(?!b)'; break;
            case 26 : returnRegx = '(?<=a)b'; break;
            case 27 : returnRegx = '(?<!a)b'; break;
        }
        var _data = $('#pattern').val();
        var _curIndex = pRegexp.textbox();
        var _insertText = returnRegx;
        var _result = [_data.slice(0, _curIndex), _insertText, _data.slice(_curIndex)].join('');
        $("#pattern").val(_result);
        //$('#pattern').val(returnRegx);

        var returnRegxLength = returnRegx.length; //커서 위치는 자동완성 되는 글자 수 에서 맨뒤로

        ctl.setSelectionRange(endPos+returnRegxLength, endPos+returnRegxLength);
        ctl.focus();
    }
};


$(function () {
    pRegexp.initVariable();
    pRegexp.observe();
    pRegexp.initDesign();
    pRegexp.initData();

    //정규식 관련 생성 버튼 클릭시
    $('.regx').click(function() {
        var dragText = pRegexp.getDragText().toString();
    })
});