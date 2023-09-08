var RegexpCreator = {
    ConvertNumberGap: function(a, b) {
        var str = '';

        /** 한 자릿수, 한 자릿수 */
        if((a > 0 && a < 10) && (b > 0 && b < 10)) {
            str += '[' + a + '-' + b + ']'
        }

        /** 한 자릿수, 두 자릿수 */
        if((a > 0 && a < 10) && (b >= 10 && b < 100)) {

            str += '^[' + a + '-' + 9 + ']$' + '|'
            if(getI(b,10) >= 2) {
                str += '^[' + 1 + '-' + (getI(b,10)-1) + ']'+ '[' + 0 + '-' + 9 + ']$' + '|'
            }
            str += '^' + getI(b,10)  + '[' + 0 + '-' + getR(b,10) + ']$'
        }

        /** 한 자릿수, 세 자릿수 */
        if((a > 0 && a < 10) && (b >= 100 && b < 1000)) {
            str += '^[' + a + '-' + 9 + ']$' + '|'
            str += '^[' + 1 + '-' + 9 + ']' + '[' + 0 + '-' + 9 + ']$' + '|'
            if(getI(b,100) >= 2) {
                str += '^[' + 1 + '-' + (getI(b,100)-1) + ']' + '[' + 0 + '-' + 9 + ']' + '[' + 0 + '-' + 9 + ']$' + '|'
            }
            if(getI(getC(b),10) >= 1) {
                str += '^' + getI(b,100) + '[' + 0 + '-' + (getI(getC(b), 10)-1) + ']' + '[' + 0 + '-' + 9 + ']$' + '|'
            }
            str += '^'+ getI(b,10) + '[' + 0 + '-' + getR(b,10) + ']$'
        }

        /** 두 자릿수, 두 자릿수 */
        if((a >= 10 && a < 100) && (b >= 10 && b < 100)) {
            if(getI(a,10) == getI(b,10)) {
                str += '^' + getI(a,10) + '[' + getR(a,10) + '-' + getR(b,10) + ']$'
            } else {
                str += '^' + getI(a,10) + '[' + getR(a,10) + '-' + 9 + ']$' + '|'

                if(getI(b,10) - getI(a,10) >= 2) {
                    str += '^[' + (getI(a,10)+1) + '-' + (getI(b,10)-1) + ']' + '[' + 0 + '-' + 9 + ']$' + '|'
                }
                str += '^' + getI(b,10)  + '[' + 0 + '-' + getR(b,10) + ']$'
            }
        }

        /** 두 자릿수, 세 자릿수 */
        if((a >= 10 && a < 100)  && (b >= 100 && b < 1000)) {
            str += '^' + getI(a, 10)  + '[' + getR(a, 10) + '-' + 9 + ']$' + '|'

            if(getI(a,10) < 9) {
                str += '^[' + (getI(a,10)+1) + '-' + 9 + ']' + '[' + 0 + '-' + 9 + ']$' + '|'
            }
            if(getI(b,100) >= 2) {
                str += '^[' + 1 + '-' + (getI(b,100)-1) + ']' + '[' + 0 + '-' + 9 + ']' + '[' + 0 + '-' + 9 + ']$' + '|'
            }
            if(getI(getC(b),10) > 0) {
                str += '^'+ getI(b, 100) + '[' + 0 + '-' + (getI(getC(b,100),10)-1) + ']' + '[' + 0 + '-' + 9 + ']$' + '|'
            }
            str += '^'+ getI(b, 10) + '[' + 0 + '-' + getR(b,10) + ']$'
        }

        /** 세 자릿수, 세 자릿수 */
        if((a >= 100 && b < 1000)  && (b >= 100 && b < 1000)) {
            var maxRest10 = Math.trunc(b % 10) ;  //to 값의 일의 자리 숫자
            var maxRest100 = Math.trunc(b % 100) ; //to 값의 십의 자리 숫자
            var maxStart = b - maxRest100; //to 값의 순수 백의 자리 숫자 추출. 325 -> 300
            var maxStart_mi = maxStart - 1; //최대 시작값의 -1  ->  300 - 1 = 299
            var maxEnd = b - maxRest10; //끝숫자의 검색 시작값
            var maxEnd_mi = maxEnd - 1; //끝숫자의 하나 적은 값
            var maxEnd1 = b - maxEnd;

            var startQuota100 = Math.trunc(a / 100) ;
            var endQuota100 = Math.trunc(b / 100) ;

            var startQuota10 = Math.trunc(a / 10) ;
            var endQuota10 = Math.trunc(b / 10) ;

            var startRemainder10  = Math.trunc(a % 10) ;
            var endRemainder10 = Math.trunc(b % 10) ;

            if(getI(a, 100) == getI(b,100)){ //100자리가 같으며
                //같은 십의자리수 110~118 , 101 109
                if(getI((getR(b,100) - getR(b,10)) , 10) - getI((getR(a,100) - getR(a,10)) , 10) == 0){
                    str += getI(a, 10)
                    str += '['+getR(a,10)+ '-' + getR(b,10) + ']';
                }
                //십의 자리수 차이가 1일 경우
                if(getI((getR(b,100) - getR(b,10)) , 10) - getI((getR(a,100) - getR(a,10)) , 10) == 1){
                    str += getI(a, 10)
                    str += '['+getR(a,10)+'-9]';
                    str += '|';

                    str += "[" + maxEnd.toString()[0] + '-' + b[0] + ']';
                    str += "[" + maxEnd.toString()[1] + '-' + b[1] + ']';
                    str += "[" + maxEnd.toString()[2] + '-' + b[2] + ']';
                    //str += getI(b, 100) + '[' + (getI(getC(a),10)+1) + '-' + (getI(getC(b),10)-1) + ']' + '[' + 0 + '-' + 9 + ']$' + '|'

                }
                
                //십의 자리 차이 2이상 일 경우
                if(getI((getR(b,100) - getR(b,10)) , 10) - getI((getR(a,100) - getR(a,10)) , 10) >= 2){
                    str += getI(a, 10) + '[' + getR(getC(a), 10) + '-' + 9 + ']'; //시작값의 십의자리 9 까지의 끝
                    str += getI(b, 100) + '[' + (getI(getC(a),10)+1) + '-' + (getI(getC(b),10)-1) + ']' + '[' + 0 + '-' + 9 + ']'; //십의 자리를 구한수 +1 / -1 이후 [0-9] 고정
                    str += '|'
                    str += getI(b, 10) + '[' + 0 + '-' + getR(b,10) + ']$'
                }

            }

            if(getI(a, 100) != getI(b,100)){ //100자리가 다르며
                str += getI(a, 10) + '[' + getR(a,10) + '-9]' ; // 시작값의 십의자리끝 201-> 201~209. 211 -> 211~219
                str += '|';

                //200차이 이상
                if(getI(b,100) - getI(a, 100) == 2  || getI(b,100) - getI(a, 100) >= 3) {
                    // 기본 시작값의 마지막 끝수(9) 생성하여 +1 (십의자리 올림)  . 256 -> 259 + 1 . 271 -> 279 + 1
                    var secondStartNum = parseInt(getI(a, 10) + '9') + 1;
                    //256-> 259 + 1 = 260 ~ 299
                    str += getI(a, 100) + '[' + secondStartNum.toString()[1] + '-9]' + '[' + secondStartNum.toString()[2] + '-9]' //[2]값은 무조건 0 일 것으로 예상
                    str += '|';
                    //getI(a, 100) + 1 //시작 백의자리에서 한자리 올림 231 -> 3
                    //시작 십자리 +1 부터 끝 백의자리 -1 까지 모든 수를 구함
                    //256~656 -> 260~599 까지 사이의 모든 값 문법
                    str += '[' + parseInt(getI(a, 100) + 1) + '-' + maxStart_mi.toString()[0] + ']'
                    str += '\\d{2}(\\.\\d{1,2})?';


                    //끝값의 백자리 + 00 부터 시작
                    //maxEnd_mi

                    if(getI((getR(b,100) - getR(b,10)) , 10) == 0){ //끝자리 의 십의자리가 0인지 아닌지
                        
                    }else{
                        str += '|';
                        str += getI(b, 100) ;
                        str += '[0-' + maxEnd_mi.toString()[1] + ']';
                        str += '[0-' + maxEnd_mi.toString()[2] + ']';
                    }


                }
                if(getI(b,100) - getI(a, 100) == 1){ //100 차이
                    //str += getI(a, 100) + '[1-9][0-9]';
                    str += '^[' + getI(a, 100) + '-' + (getI(b, 100)-1) + ']' + '[' + (getI(getC(a),10)+1) + '-' + 9 + ']' + '[' + 0 + '-' + 9 + ']'

                    if(getI((getR(b,100) - getR(b,10)) , 10) != 0){
                        str += '|';
                        str += maxStart.toString()[0] + '[' + maxStart.toString()[1] + '-'+ maxEnd_mi.toString()[1] + ']';
                        str += '[' + maxStart.toString()[2] + '-' + maxEnd_mi.toString()[2] + ']';
                    }


                }
                /*if(getI(b,100) - getI(a, 100) == 2 && getI((getR(b,100) - getR(b,10)) , 10) == 0){ //200 차이
                    alert("200차이")
                    //str += '^[' + getI(a, 100) + '-' + (getI(b, 100)-1) + ']' + '[' + (getI(getC(a),10)+1) + '-' + 9 + ']' + '[' + 0 + '-' + 9 + ']$'
                    str += maxStart.toString()[0] + '[' + maxStart.toString()[1] + '-'+ maxEnd_mi.toString()[1] + ']';
                    str += '|';
                    str += maxStart_mi.toString()[0] + '[0-9][0-9]';


                }*/


                str += '|';
                //끝자리 가 포함된 값부터 마지막까지 980 ~ 989 98[0-9]
                str += getI(b, 10) + '[0-' + getR(b, 10) + ']';

            };
            /*if((a >= 100 && b < 1000)  && (b >= 100 && b < 1000)) {
                if(b-a >= 10) {
                    str += '^' + getI(a, 10) + '[' + getR(getC(a), 10) + '-' + 9 + ']$' + '|'
                }
                if(getI(a, 100) != getI(b,100)) { //100의 자릿수가 다를 때
                    str += '^[' + getI(a, 100) + '-' + (getI(b, 100)-1) + ']' + '[' + (getI(getC(a),10)+1) + '-' + 9 + ']' + '[' + 0 + '-' + 9 + ']$' + '|'
                }
                if(getI(getC(b),10) - getI(getC(a),10) > 1) { //10의 자릿수 차이가 2이상일 때 ->
                    str += '^'+ getI(b, 100) + '[' + (getI(getC(a),10)+1) + '-' + (getI(getC(b),10)-1) + ']' + '[' + 0 + '-' + 9 + ']$' + '|'
                }
                str += '^'+ getI(b, 10) + '[' + 0 + '-' + getR(b,10) + ']$'
            }*/
            console.log("---->>     " +str)
            /*if(b-a >= 10) {
                str += '^' + getI(a, 10) + '[' + getR(getC(a), 10) + '-' + 9 + ']$' + '|'
            }
            if(getI(a, 100) != getI(b,100)) { //100의 자릿수가 다를 때
                str += '^[' + getI(a, 100) + '-' + (getI(b, 100)-1) + ']' + '[' + (getI(getC(a),10)+1) + '-' + 9 + ']' + '[' + 0 + '-' + 9 + ']$' + '|'
            }
            if(getI(getC(b),10) - getI(getC(a),10) > 1) { //10의 자릿수 차이가 2이상일 때 ->
                str += '^'+ getI(b, 100) + '[' + (getI(getC(a),10)+1) + '-' + (getI(getC(b),10)-1) + ']' + '[' + 0 + '-' + 9 + ']$' + '|'
            }*/
            //str += '^'+ getI(b, 10) + '[' + 0 + '-' + getR(b,10) + ']$'
        }

        return str;
    },

    //이상
    Over:function (sOverORUnderNum, sOverORUnderUnit) {
        var str = sOverORUnderNum;
        var length = (sOverORUnderUnit.length) + 1;
        // 콤보 빈칸 -> 1 한자리
        //콤보 0 -> 2자리 (10이상)

        switch (length)
        {
            case 1:
                sOverORUnderNum = !(str == "9") ? "([1-9][0-9]+|[" + str + "-9])" : "([1-9][0-9]+|9)";
                break;
            case 2:
                sOverORUnderNum = !(str == "9") ? "([1-9][0-9][0-9]+|[" + str + "-9][0-9])" : "([1-9][0-9][0-9]+|9[0-9])";
                break;
            case 3:
                sOverORUnderNum = !(str == "9") ? "([1-9][0-9]{2}[0-9]+|[" + str + "-9][0-9][0-9])" : "([1-9][0-9]{2}[0-9]+|9[0-9][0-9])";
                break;
            default:
                if (str == "9")
                    sOverORUnderNum = "([1-9][0-9]{" + ToString(length - 1) + "}[0-9]+|" + str + "[0-9]{" + ToString(length - 1) + "})";
                else
                    sOverORUnderNum = "([1-9][0-9]{" + ToString(length - 1) + "}[0-9]+|[" + str + "-9][0-9]{" + ToString(length - 1) + "})";
                break;
        }
        return sOverORUnderNum;
    },

    //이하
    Below:function (sOverORUnderNum, sOverORUnderUnit) {
        var length = (sOverORUnderUnit.length) +1;
        var int32 = parseInt(sOverORUnderNum);
        var limitVal = sOverORUnderNum + sOverORUnderUnit; // 5와 000 선택 일 경우 5,000 생성

        switch (length)
        {
            case 1:
                sOverORUnderNum = "([0-" + ToString(int32) + "])";
                break;
            case 2: //100이하
                switch (int32)
                {
                    case 1:
                        sOverORUnderNum = "(" + sOverORUnderNum + "|[0-9])";
                        break;
                    case 2:
                        sOverORUnderNum = "(" + sOverORUnderNum + "|1[0-9]|[0-9])";
                        break;
                    default:
                        sOverORUnderNum = "(" + sOverORUnderNum + "|[1-" + ToString(int32 - 1) + "][0-9]|[0-9])";
                        break;
                }
                break;
            case 3:
                switch (int32)
                {
                    case 1:
                        sOverORUnderNum = "(" + sOverORUnderNum + "|[1-9][0-9]|[0-9])";
                        break;
                    case 2:
                        sOverORUnderNum = "(" + sOverORUnderNum + "|1[0-9][0-9]|[1-9][0-9]|[0-9])";
                        break;
                    default:
                        sOverORUnderNum = "(" + sOverORUnderNum + "|[1-" + ToString(int32 - 1) + "][0-9][0-9]|[1-9][0-9]|[0-9])";
                        break;
                }
                break;
            case 4:
                switch (int32)
                {
                    case 1:
                        sOverORUnderNum = "(" + limitVal + "|[1-9][0-9][0-9]|[1-9][0-9]|[0-9])";
                        break;
                    case 2:
                        sOverORUnderNum = "(" + limitVal + "|1[0-9][0-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9]|[0-9])";
                        break;
                    default:
                        sOverORUnderNum = "(" + limitVal + "|[1-" + ToString(int32 - 1) + "][0-9][0-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9]|[0-9])";
                        break;
                }
                break;
            case 5:
                switch (int32)
                {
                    case 1:
                        sOverORUnderNum = "(" + limitVal + + "|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    case 2:
                        sOverORUnderNum = "(" + limitVal + "|1[0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    default:
                        sOverORUnderNum = "(" + limitVal + "|[1-" + ToString(int32 - 1) + "][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                }
                break;
            case 6:
                switch (int32)
                {
                    case 1:
                        sOverORUnderNum = "(" + limitVal + "|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    case 2:
                        sOverORUnderNum = "(" + limitVal + "|1[0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    default:
                        sOverORUnderNum = "(" + limitVal + "|[1-" + ToString(int32 - 1) + "][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                }
                break;
            case 7:
                switch (int32)
                {
                    case 1:
                        sOverORUnderNum = "(" + limitVal + "|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    case 2:
                        sOverORUnderNum = "(" + limitVal + "|1[0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    default:
                        sOverORUnderNum = "(" + limitVal + "|[1-" + ToString(int32 - 1) + "][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                }
                break;
            case 8:
                switch (int32)
                {
                    case 1:
                        sOverORUnderNum = "(" + limitVal + "|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    case 2:
                        sOverORUnderNum = "(" + limitVal + "|1[0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    default:
                        sOverORUnderNum = "(" + limitVal + "|[1-" + ToString(int32 - 1) + "][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                }
                break;
            case 9:
                switch (int32)
                {
                    case 1:
                        sOverORUnderNum = "(" + limitVal + "|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    case 2:
                        sOverORUnderNum = "(" + limitVal + "|1[0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    default:
                        sOverORUnderNum = "(" + limitVal + "|[1-" + ToString(int32 - 1) + "][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                }
                break;
            case 10:
                switch (int32)
                {
                    case 1:
                        sOverORUnderNum = "(" + limitVal + "|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    case 2:
                        sOverORUnderNum = "(" + limitVal + "|1[0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    default:
                        sOverORUnderNum = "(" + limitVal + "|[1-" + ToString(int32 - 1) + "][0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                }
                break;
            case 11:
                switch (int32)
                {
                    case 1:
                        sOverORUnderNum = "(" + limitVal + "|[1-9][0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    case 2:
                        sOverORUnderNum = "(" + limitVal + "|1[0-9]{10}|[1-9][0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    default:
                        sOverORUnderNum = "(" + limitVal + "|[1-" + ToString(int32 - 1) + "][0-9]{10}|[1-9][0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                }
                break;
            case 12:
                switch (int32)
                {
                    case 1:
                        sOverORUnderNum = "(" + limitVal + "|[1-9][0-9]{10}|[1-9][0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    case 2:
                        sOverORUnderNum = "(" + limitVal + "|1[0-9]{11}|[1-9][0-9]{10}|[1-9][0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    default:
                        sOverORUnderNum = "(" + limitVal + "|[1-" + ToString(int32 - 1) + "][0-9]{11}|[1-9][0-9]{10}|[1-9][0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                }
                break;
            case 13:
                switch (int32)
                {
                    case 1:
                        sOverORUnderNum = "(" + limitVal + "|[1-9][0-9]{11}|[1-9][0-9]{10}|[1-9][0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    case 2:
                        sOverORUnderNum = "(" + limitVal + "|1[0-9]{12}|[1-9][0-9]{11}|[1-9][0-9]{10}|[1-9][0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    default:
                        sOverORUnderNum = "(" + limitVal + "|[1-" + ToString(int32 - 1) + "][0-9]{12}|[1-9][0-9]{11}|[1-9][0-9]{10}|[1-9][0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                }
                break;
            case 14:
                switch (int32)
                {
                    case 1:
                        sOverORUnderNum = "(" + limitVal + "|[1-9][0-9]{12}|[1-9][0-9]{11}|[1-9][0-9]{10}|[1-9][0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    case 2:
                        sOverORUnderNum = "(" + limitVal + "|1[0-9]{13}|[1-9][0-9]{12}|[1-9][0-9]{11}|[1-9][0-9]{10}|[1-9][0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    default:
                        sOverORUnderNum = "(" + limitVal + "|[1-" + ToString(int32 - 1) + "][0-9]{13}|[1-9][0-9]{12}|[1-9][0-9]{11}|[1-9][0-9]{10}|[1-9][0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                }
                break;
            case 15:
                switch (int32)
                {
                    case 1:
                        sOverORUnderNum = "(" + limitVal + "|[1-9][0-9]{13}|[1-9][0-9]{12}|[1-9][0-9]{11}|[1-9][0-9]{10}|[1-9][0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    case 2:
                        sOverORUnderNum = "(" + limitVal + "|1[0-9]{14}|[1-9][0-9]{13}|[1-9][0-9]{12}|[1-9][0-9]{11}|[1-9][0-9]{10}|[1-9][0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    default:
                        sOverORUnderNum = "(" + limitVal + "|[1-" + ToString(int32 - 1) + "][0-9]{14}|[1-9][0-9]{13}|[1-9][0-9]{12}|[1-9][0-9]{11}|[1-9][0-9]{10}|[1-9][0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                }
                break;
            default:
                switch (int32)
                {
                    case 1:
                        sOverORUnderNum = "(" + limitVal + "|[1-9][0-9]{14}|[1-9][0-9]{13}|[1-9][0-9]{12}|[1-9][0-9]{11}|[1-9][0-9]{10}|[1-9][0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    case 2:
                        sOverORUnderNum = "(" + limitVal + "|1[0-9]{15}|[1-9][0-9]{14}|[1-9][0-9]{13}|[1-9][0-9]{12}|[1-9][0-9]{11}|[1-9][0-9]{10}|[1-9][0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                    default:
                        sOverORUnderNum = "(" + limitVal + "|[1-" + ToString(int32 - 1) + "][0-9]{15}|[1-9][0-9]{14}|[1-9][0-9]{13}|[1-9][0-9]{12}|[1-9][0-9]{11}|[1-9][0-9]{10}|[1-9][0-9]{9}|[1-9][0-9]{8}|[1-9][0-9]{7}|[1-9][0-9]{6}|[1-9][0-9]{5}|[1-9][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[0-9])";
                        break;
                }
                break;
        }
        return sOverORUnderNum;
    },

    //정규식 도우미용 문자 체크
    validateStr: function(checkStr) {
        var pattern = /^[a-zA-Z]*$/;
        var checkStr = checkStr;
        return pattern.test(checkStr);
    },
    //정규식 도우미용 숫자 체크
    validateNum: function(checkStr) {
        var pattern = /[0-9]/g;
        var checkStr = checkStr;
        return pattern.test(checkStr);
    },
    //정규식 도우미용 특문체크
    validateNotStrNum: function(checkStr) {
        var pattern = /[^a-zA-Z0-9]/
        var checkStr = checkStr;
        return pattern.test(checkStr);
    },
    //정규식 도우미용 공백
    validateSpace: function(checkStr) {
        var pattern = /\s/g;
        var checkStr = checkStr;
        return pattern.test(checkStr);
    },
    //정규식 도우미용 입력 타입 체크
    validateStrType: function(checkStr){
        var patternStr = /[a-zA-Z]/;
        var patternNum = /[0-9]/;
        var patternSpace = /\s/g;
        var patternType = '';

        if(patternStr.test(checkStr)){
            patternType =  'STR';
        }else{
            if(patternNum.test(checkStr)){
                patternType =  'NUM';
            }else{
                if(patternSpace.test(checkStr)){
                    patternType =  'SPACE';
                }else{
                    patternType =  'OTHER';
                }
            }
        }
        return patternType;

    },

    //정규식 타입 체크(문자와 숫자 동일하게 판단. 문자 또는 숫자 모두 w 로 판단(d도 w에 포함으로)
    validateStrType2: function(checkStr){
        var patternStr = /[0-9a-zA-Z]/;
        var patternNum = /[0-9]/;
        var patternSpace = /\s/g;
        var patternType = '';

        if(patternStr.test(checkStr)){
            patternType =  'STR';
        }else{
            if(patternSpace.test(checkStr)){
                patternType =  'SPACE';
            }else{
                patternType =  'OTHER';
            }
        }
        return patternType;

    },

};

function getI(x, y) {
    return parseInt(x/y)
}

function getR(x, y) {
    return x%y
}

function getC(x) {
    return x - (getI(x, 100) * 100)
}

function getD(x) {
    return x - (getR(x, 10))
}

function ToString(numberVal) {
    var returnVal = Math.trunc(numberVal);
    return returnVal.toString();
}
