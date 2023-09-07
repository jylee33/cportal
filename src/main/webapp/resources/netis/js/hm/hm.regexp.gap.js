var Regexp = {
    ConvertNumberGap: function(sOverNumber, sUnderNumber) {
        var str1 =  null;
        var str2 =  null;
        var num1 = 0;
        var num2 = 0;
        var int32_1 = parseInt(sOverNumber);
        var int32_2 = parseInt(sUnderNumber);
        var num3;
        var num4;
        var num5;
        var num6;

        if (sOverNumber.length == 1 && sUnderNumber.length == 1)
        {
            str1 = "([" + int32_1.toString() + "-";
            str2 = int32_2.toString() + "])";
        }
        else if (sOverNumber.length == 1 && sUnderNumber.length == 2)
        {
            str1 = int32_1 != 9 ? "([" + ToString(int32_1) + "-9]|" : "(" + ToString(int32_1) + "|";
            if (int32_2 == 10)
                str2 = ToString(int32_2) + ")";
            else if (10 < int32_2 && int32_2 < 100)
                str2 = Two_Place(ToString(int32_2));
        }
        else if (sOverNumber.length == 1 && sUnderNumber.length == 3){
            num3 = 0;
            num4 = 0;
            num5 = 0;
            num6 = 0;
            num3 = Math.trunc(int32_1 / 10);
            num4 = Math.trunc(int32_1 % 10);
            var num8 = Math.trunc(int32_2 / 100);
            var num9 = Math.trunc(int32_2 % 100);
            str1 = int32_1 != 9 ? "([" + ToString(int32_1) + "-9]|[1-9][0-9]|" : "(" + ToString(int32_1) + "|[1-9][0-9]|";
            if (num9 == 0)
            {
                switch (num8)
                {
                    case 1:
                        str2 = ToString(int32_2) + ")";
                        break;
                    case 2:
                        str2 = "1[0-9][0-9]|" + ToString(int32_2) + ")";
                        break;
                    default:
                        str2 = "[1-" + ToString(num8 - 1) + "][0-9][0-9]|" + ToString(int32_2) + ")";
                        break;
                }
            }
            else if (int32_2 > 100 && int32_2 < 200)
            {
                if (Math.trunc(num9 % 10) == 9)
                    str2 = int32_2 != 109 ? "1[0-" + ToString(num9 / 10) + "][0-9])" : "10[0-9])";
                else if (Math.trunc(num9 % 10) == 0)
                {
                    if (num9 == 10)
                        str2 = "10[0-9]|110)";
                    else
                        str2 = "1[0-" + ToString(num9 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                }
                else if (Math.trunc(num9 / 10) == 0)
                    str2 = "10[0-" + ToString(num9 % 10) + "])";
                else if (Math.trunc(num9 / 10) == 1)
                    str2 = "10[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num9 % 10) + "])";
                else
                    str2 = "1[0-" + ToString(num9 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num9 % 10) + "])";
            }
            else if (int32_2 > 200 && int32_2 < 300)
            {
                if (Math.trunc(num9 % 10) == 9)
                    str2 = Math.trunc(num9 / 10) != 0 ? ( Math.trunc(num9 / 10) != 9 ? "1[0-9][0-9]|2[0-" + ToString( Math.trunc(num9 / 10)) + "][0-9])" : "[1-2][0-9][0-9])") : "1[0-9][0-9]|20[0-9])";
                else if (Math.trunc(num9 % 10) == 0)
                {
                    if (num9 == 10)
                        str2 = "1[0-9][0-9]|20[0-9]|210)";
                    else
                        str2 = "1[0-9][0-9]|2[0-" + ToString(num9 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                }
                else if (Math.trunc(num9 / 10) == 0)
                    str2 = "1[0-9][0-9]|" + ToString(num8) + "0[0-" + ToString(num9) + "])";
                else if (Math.trunc(num9 / 10) == 1)
                    str2 = "1[0-9][0-9]|20[0-9]|21[0-" + ToString(num9 % 10) + "])";
                else
                    str2 = "1[0-9][0-9]|2[0-" + ToString( Math.trunc(num9 / 10) - 1) + "][0-9]|" + ToString( Math.trunc(int32_2 / 10)) + "[0-" + ToString( Math.trunc(num9 % 10)) + "])";
            }
            else if (int32_2 == 999)
                str2 = "[1-9][0-9][0-9])";
            else if (Math.trunc(num9 % 10) == 9)
            {
                if (Math.trunc(num9 / 10) == 0)
                    str2 = "[1-" + ToString(num8 - 1) + "][0-9][0-9]|" + ToString(Math.trunc(int32_2 / 10)) + "[0-9])";
                else if (Math.trunc(num9 / 10) == 9)
                    str2 = "[1-" + ToString(num8) + "][0-9][0-9])";
                else
                    str2 = "[1-" + ToString(num8 - 1) + "][0-9][0-9]|" + ToString(num8) + "[0-" + ToString(Math.trunc(num9 / 10)) + "][0-9])";
            }
            else if (Math.trunc(num9 % 10) == 0)
                str2 = "[1-" + ToString(num8 - 1) + "][0-9][0-9]|" + ToString(num8) + "[0-" + ToString(Math.trunc(num9 / 10) - 1) + "][0-9]|" + ToString(int32_2) + ")";
            else if (Math.trunc(num9 / 10) == 0)
                str2 = "[1-" + ToString(num8 - 1) + "][0-9][0-9]|" + ToString(Math.trunc(int32_2 / 10)) + "[0-" + ToString(num9) + "])";
            else if (Math.trunc(num9 / 10) == 1)
                str2 = "[1-" + ToString(num8 - 1) + "][0-9][0-9]|" + ToString(Math.trunc(int32_2 / 10)- 1) + "[0-9]|" + ToString(Math.trunc(int32_2 / 10)) + "[0-" + ToString(num9 % 10) + "])";
            else
                str2 = "[1-" + ToString(num8 - 1) + "][0-9][0-9]|" + ToString(num8) + "[0-" + ToString(num9 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num9 % 10) + "])";
        } // 1자리3자리 else if 끝
        
        //2자리2자리
        else if (sOverNumber.length == 2 && sUnderNumber.length == 2){
            num3 = 0;
            num4 = 0;
            num5 = 0;
            num6 = 0;
            var num10 = Math.trunc(int32_1 / 10);
            var num11 = Math.trunc(int32_1 % 10);
            var num12 = Math.trunc(int32_2 / 10);
            var num13 = Math.trunc(int32_2 % 10);
            if (num11 == 0 && num13 == 9)
            {
                if (num10 == num12)
                {
                    str1 = "(" + ToString(num10) + "[";
                    str2 = ToString(num11) + "-" + ToString(num13) + "])";
                }
                else
                {
                    str1 = "([" + ToString(num10) + "-" + ToString(num12) + "]";
                    str2 = "[" + ToString(num11) + "-" + ToString(num13) + "])";
                }
            }
            else if (num11 == 0 && num13 == 0)
            {
                if (num10 == num12 - 1)
                {
                    str1 = "(" + ToString(num10) + "[0-9]|";
                    str2 = ToString(int32_2) + ")";
                }
                else
                {
                    str1 = "([" + ToString(num10) + "-" + ToString(num12 - 1) + "][0-9]|";
                    str2 = ToString(int32_2) + ")";
                }
            }
            else
            {
                if (num10 == num12) //같은 범위 일때 11~11 21~21 31~31
                {
                    str1 = "(" + ToString(num10);
                    str2 = "[" + ToString(num11) + "-" + ToString(num13) + "])";
                }
                else if (num10 == num12 - 1) //11~21?
                {
                    var num14;
                    switch (num11) // 앞자리 % 10의 값
                    {
                        case 0: //앞이 10일때만.. ?? 여기 접근이 가능..?
                            str1 = "(" + ToString(num10) + "[0-9]|";
                            str2 = ToString(num12) + "[0-" + ToString(num13) + "])";
                            //goto label_100;
                        case 9:
                            num14 = num13 != 0 ? 1 : 0;
                            break;
                        default:
                            num14 = 1;
                            break;
                    }
                    if (num14 == 0)
                    {
                        str1 = "(" + ToString(int32_1) + "|";
                        str2 = ToString(int32_2) + ")";
                    }
                    else
                    {
                        if (num11 == 9)
                            str1 = "(" + ToString(int32_1) + "|";
                        else
                            str1 = "(" + ToString(num10) + "[" + ToString(num11) + "-9]|";
                        str2 = num13 != 0 ? ToString(num12) + "[0-" + ToString(num13) + "])" : ToString(int32_2) + ")";
                    }
                }
                else if (num11 == 9 && num13 == 9)
                {
                    str1 = "(" + ToString(int32_1) + "|";
                    str2 = "[" + ToString(num10 + 1) + "-" + ToString(num12) + "][0-9])";
                }
                else if (num11 == 9 && num13 == 0)
                {
                    if (num10 + 1 == num12 - 1)
                    {
                        str1 = "(" + ToString(int32_1) + "|";
                        str2 = ToString(num10 + 1) + "[0-9]|" + ToString(int32_2) + ")";
                    }
                    else
                    {
                        str1 = "(" + ToString(int32_1) + "|";
                        str2 = "[" + ToString(num10 + 1) + "-" + ToString(num12 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                    }
                }
                else if (num11 == 9)
                {
                    if (num10 + 1 == num12 - 1)
                    {
                        str1 = "(" + ToString(int32_1) + "|";
                        str2 = ToString(num10 + 1) + "[0-9]|" + ToString(num12) + "[0-" + ToString(num13) + "])";
                    }
                    else
                    {
                        str1 = "(" + ToString(int32_1) + "|";
                        str2 = "[" + ToString(num10 + 1) + "-" + ToString(num12 - 1) + "][0-9]|" + ToString(num12) + "[0-" + ToString(num13) + "])";
                    }
                }
                else
                {
                    switch (num13)
                    {
                        case 0:
                            str1 = "(" + ToString(num10) + "[" + ToString(num11) + "-9]|";
                            str2 = "[" + ToString(num10 + 1) + "-" + ToString(num12 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            break;
                        case 9:
                            str1 = "(" + ToString(num10) + "[" + ToString(num11) + "-9]|";
                            str2 = "[" + ToString(num10 + 1) + "-" + ToString(num12) + "][0-9])";
                            break;
                        default:
                            if (num10 + 1 == num12 - 1)
                            {
                                str1 = "(" + ToString(num10) + "[" + ToString(num11) + "-9]|";
                                str2 = "[" + ToString(num10 + 1) + "[0-9]|" + ToString(num12) + "[0-" + ToString(num13) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(num10) + "[" + ToString(num11) + "-9]|";
                                str2 = "[" + ToString(num10 + 1) + "-" + ToString(num12 - 1) + "][0-9]|" + ToString(num12) + "[0-" + ToString(num13) + "])";
                            }
                            break;
                    }
                }

            }
        } //2자리2자리끝
        //2자리3자리
        else if (sOverNumber.length == 2 && sUnderNumber.length == 3){
            num3 = 0;
            num4 = 0;
            num5 = 0;
            num6 = 0;
            var num15 = Math.trunc(int32_1 / 10);
            var num16 = Math.trunc(int32_1 % 10);
            var num17 = Math.trunc(int32_2 / 100);
            var num18 = Math.trunc(int32_2 % 100);
            switch (num16)
            {
                case 0:
                    str1 = num15 != 9 ? "([" + ToString(num15) + "-9][0-9]|" : "(" + ToString(num15) + "[0-9]|";
                    break;
                case 9:
                    switch (num15)
                    {
                        case 8:
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num15 + 1) + "[0-9]|";
                            break;
                        case 9:
                            str1 = "(" + ToString(int32_1) + "|";
                            break;
                        default:
                            str1 = "(" + ToString(int32_1) + "|[" + ToString(num15 + 1) + "-9][0-9]|";
                            break;
                    }
                    break;
                default:
                    switch (num15)
                    {
                        case 8:
                            str1 = "(" + ToString(num15) + "[" + ToString(num16) + "-9]|" + ToString(num15 + 1) + "[0-9]|";
                            break;
                        case 9:
                            str1 = "(" + ToString(num15) + "[" + ToString(num16) + "-9]|";
                            break;
                        default:
                            str1 = "(" + ToString(num15) + "[" + ToString(num16) + "-9]|[" + ToString(num15 + 1) + "-9][0-9]|";
                            break;
                    }
                    break;
            }
            if (num18 == 0)
            {
                switch (num17)
                {
                    case 1:
                        str2 = ToString(int32_2) + ")";
                        break;
                    case 2:
                        str2 = "1[0-9][0-9]|" + ToString(int32_2) + ")";
                        break;
                    default:
                        str2 = "[1-" + ToString(num17 - 1) + "][0-9][0-9]|" + ToString(int32_2) + ")";
                        break;
                }
            }
            else if (int32_2 > 100 && int32_2 < 200)
            {
                if ( Math.trunc(num18 % 10) == 9)
                    str2 = int32_2 != 109 ? "1[0-" + ToString( Math.trunc(num18 / 10)) + "][0-9])" : "10[0-9])";
                else if ( Math.trunc(num18 % 10) == 0)
                {
                    if (num18 == 10)
                        str2 = "10[0-9]|110)";
                    else
                        str2 = "1[0-" + ToString( Math.trunc(num18 / 10 - 1)) + "][0-9]|" + ToString(int32_2) + ")";
                }
                else if (Math.trunc(num18 / 10) == 0)
                    str2 = "10[0-" + ToString(Math.trunc(num18 % 10)) + "])";
                else if ( Math.trunc(num18 / 10) == 1)
                    str2 = "10[0-9]|" + ToString( Math.trunc(int32_2 / 10)) + "[0-" + ToString( Math.trunc(num18 % 10)) + "])";
                else
                    str2 = "1[0-" + ToString(Math.trunc(num18 / 10) - 1) + "][0-9]|" + ToString(Math.trunc(int32_2 / 10)) + "[0-" + ToString(Math.trunc(num18 % 10)) + "])";
            }
            else if (int32_2 > 200 && int32_2 < 300)
            {
                if (Math.trunc(num18 % 10) == 9)
                    str2 = Math.trunc(num18 / 10) != 0 ? (Math.trunc(num18 / 10) != 9 ? "1[0-9][0-9]|2[0-" + ToString(Math.trunc(num18 / 10)) + "][0-9])" : "[1-2][0-9][0-9])") : "1[0-9][0-9]|20[0-9])";
                else if (Math.trunc(num18 % 10) == 0)
                {
                    if (num18 == 10)
                        str2 = "1[0-9][0-9]|20[0-9]|210)";
                    else
                        str2 = "1[0-9][0-9]|2[0-" + ToString(Math.trunc(num18 / 10) - 1) + "][0-9]|" + ToString(int32_2) + ")";
                }
                else if (Math.trunc(num18 / 10) == 0)
                    str2 = "1[0-9][0-9]|" + ToString(num17) + "0[0-" + ToString(num18) + "])";
                else if (Math.trunc(num18 / 10) == 1)
                    str2 = "1[0-9][0-9]|20[0-9]|21[0-" + ToString(Math.trunc(num18 % 10)) + "])";
                else
                    str2 = "1[0-9][0-9]|2[0-" + ToString(Math.trunc(num18 / 10) - 1) + "][0-9]|" + ToString(Math.trunc(int32_2 / 10)) + "[0-" + ToString(Math.trunc(num18 % 10)) + "])";
            }
            else if (int32_2 == 999)
                str2 = "[1-9][0-9][0-9])";
            else if (Math.trunc(num18 % 10) == 9)
            {
                if (Math.trunc(num18 / 10) == 0)
                    str2 = "[1-" + ToString(num17 - 1) + "][0-9][0-9]|" + ToString(Math.trunc(int32_2 / 10)) + "[0-9])";
                else if (Math.trunc(num18 / 10) == 9)
                    str2 = "[1-" + ToString(num17) + "][0-9][0-9])";
                else
                    str2 = "[1-" + ToString(num17 - 1) + "][0-9][0-9]|" + ToString(num17) + "[0-" + ToString(Math.trunc(num18 / 10)) + "][0-9])";
            }
            else if (Math.trunc(num18 % 10) == 0)
                str2 = "[1-" + ToString(num17 - 1) + "][0-9][0-9]|" + ToString(num17) + "[0-" + ToString(Math.trunc(num18 / 10) - 1) + "][0-9]|" + ToString(int32_2) + ")";
            else if (Math.trunc(num18 / 10) == 0)
                str2 = "[1-" + ToString(num17 - 1) + "][0-9][0-9]|" + ToString(Math.trunc(int32_2 / 10)) + "[0-" + ToString(num18) + "])";
            else if (Math.trunc(num18 / 10) == 1)
                str2 = "[1-" + ToString(num17 - 1) + "][0-9][0-9]|" + ToString(Math.trunc(int32_2 / 10) - 1) + "[0-9]|" + ToString(Math.trunc(int32_2 / 10)) + "[0-" + ToString(Math.trunc(num18 % 10)) + "])";
            else
                str2 = "[1-" + ToString(num17 - 1) + "][0-9][0-9]|" + ToString(num17) + "[0-" + ToString(Math.trunc(num18 / 10 - 1)) + "][0-9]|" + ToString(Math.trunc(int32_2 / 10)) + "[0-" + ToString(Math.trunc(num18 % 10)) + "])";
        }//2자리3자리끝
        //3자리3자리시작
        else if (sOverNumber.length == 3 && sUnderNumber.length == 3)
        {
            num3 = 0;
            num4 = 0;
            num5 = 0;
            num6 = 0;
            var num19 = Math.trunc(int32_1 / 100);
            var num20 = Math.trunc(int32_1 % 100);
            var num21 = Math.trunc(int32_2 / 100);
            var num22 = Math.trunc(int32_2 % 100);

            if (num19 == num21)
            {
                if (Math.trunc(num20 / 10) == Math.trunc(num22 / 10))
                {
                    if (Math.trunc(num20 % 10) != Math.trunc(num22 % 10))
                    {
                        str1 = "(" + ToString(int32_1 / 10);
                        str2 = "[" + ToString(num20 % 10) + "-" + ToString(num22 % 10) + "])";
                    }
                }
                else if (Math.trunc(num20 % 10) == Math.trunc(num22 % 10))
                {
                    if (Math.trunc(num22 % 10 == 0))
                    {
                        if (num20 + 10 == num22)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[0-9]|";
                            str2 = ToString(int32_2) + ")";
                        }
                        else
                        {
                            str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-" + ToString(num22 / 10 - 1) + "][0-9]|";
                            str2 = ToString(int32_2) + ")";
                        }
                    }
                    else if (Math.trunc(num22 % 10) == 9)
                    {
                        if (Math.trunc(num20 / 10) + 1 == Math.trunc(num22 / 10))
                        {
                            str1 = "(" + ToString(int32_1) + "|";
                            str2 = ToString(int32_2 / 10) + "[0-9])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1) + "|";
                            str2 = ToString(num21) + "[" + ToString(num20 / 10 + 1) + "-" + ToString(num22 / 10) + "][0-9])";
                        }
                    }
                    else if (Math.trunc(num20 / 10) + 1 == Math.trunc(num22 / 10))
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                        str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else if (Math.trunc(num20 / 10) + 2 == Math.trunc(num22 / 10))
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                        str2 = ToString(int32_1 / 10 + 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-" + ToString(num22 / 10 - 1) + "][0-9]|";
                        str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                }
                else if (Math.trunc(num20 % 10) == 0)
                {
                    if (Math.trunc(num22 % 10 == 9))
                    {
                        str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-";
                        str2 = ToString(num22 / 10) + "][0-9])";
                    }
                    else if (Math.trunc(num20 / 10) + 1 == Math.trunc(num22 / 10))
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[0-9]|";
                        str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else
                    {
                        str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-" + ToString(num22 / 10 - 1) + "][0-9]|";
                        str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                }
                else if (Math.trunc(num20 % 10 == 9))
                {
                    if (Math.trunc(num22 % 10 == 0))
                    {
                        if (Math.trunc(num20 / 10) + 1 == Math.trunc(num22 / 10))
                        {
                            str1 = "(" + ToString(int32_1) + "|";
                            str2 = ToString(int32_2) + ")";
                        }
                        else if (Math.trunc(num20 / 10) + 1 == Math.trunc(num22 / 10) - 1)
                        {
                            str1 = "(" + ToString(int32_1) + "|";
                            str2 = ToString(int32_1 / 10 + 1) + "[0-9]|" + ToString(int32_2) + ")";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-" + ToString(num22 / 10 - 1) + "][0-9]|";
                            str2 = ToString(int32_2) + ")";
                        }
                    }
                    else if (Math.trunc(num20 / 10) + 1 == Math.trunc(num22 / 10))
                    {
                        str1 = "(" + ToString(int32_1) + "|";
                        str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else if (Math.trunc(num20 / 10) + 2 == Math.trunc(num22 / 10))
                    {
                        str1 = "(" + ToString(int32_1) + "|";
                        str2 = ToString(int32_1 / 10 + 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else
                    {
                        str1 = "(" + ToString(int32_1) + "|";
                        str2 = ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                }
                else if (Math.trunc(num22 % 10) == 0)
                {
                    if (Math.trunc(num20 / 10) + 1 == Math.trunc(num22 / 10))
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                        str2 = ToString(int32_2) + ")";
                    }
                    else if (Math.trunc(num20 / 10) + 2 == Math.trunc(num22 / 10))
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                        str2 = ToString(int32_1 / 10 + 1) + "[0-9]|" + ToString(int32_2) + ")";
                    }
                    else
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                        str2 = ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                    }
                }
                else if (Math.trunc(num22 % 10) == 9)
                {
                    if (Math.trunc(num20 / 10) + 1 == Math.trunc(num22 / 10))
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                        str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                        str2 = ToString(num21) + "[" + ToString(num20 / 10 + 1) + "-" + ToString(num22 / 10) + "][0-9])";
                    }
                }
                else if (Math.trunc(num20 / 10) + 1 == Math.trunc(num22 / 10))
                {
                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                    str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                }
                else if (Math.trunc(num20 / 10) + 2 == Math.trunc(num22 / 10))
                {
                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                    str2 = ToString(int32_1 / 10 + 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                }
                else
                {
                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                    str2 = ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                }
            }
            else if (num19 != num21)
            {
                if (Math.trunc(num20 / 10) == Math.trunc(num22 / 10))
                {
                    if (Math.trunc(num20 % 10) == Math.trunc(num22 % 10))
                    {
                        if (Math.trunc(num22 % 10) == 0)
                        {
                            if (Math.trunc(num20 / 10) == 0)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(num19) + "[0-9][0-9]|";
                                    str2 = ToString(int32_2) + ")";
                                }
                                else
                                {
                                    str1 = "([" + ToString(num19) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                    str2 = ToString(int32_2) + ")";
                                }
                            }
                            else if (Math.trunc(num20 / 10) == 9)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[0-9]|";
                                    str2 = ToString(num19 + 1) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                    str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                }
                                else
                                    str1 = "(" + ToString(int32_1 / 10) + "[0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else if (Math.trunc(num22 / 10) == 1)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                                    str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                    str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                                else
                                {
                                    str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                    str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                                str2 = ToString(num19 + 1) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                        }
                        else if (Math.trunc(num22 % 10) == 9)
                        {
                            if (Math.trunc(num20 / 10) == 0)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|";
                                    str2 = ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|" + ToString(int32_2 / 10) + "[0-9])";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = ToString(num21 - 1) + "[0-9][0-9]|" + ToString(int32_2 / 10) + "[0-9])";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10) + "[0-9])";
                                }
                            }
                            else if (Math.trunc(num20 / 10) == 9)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|";
                                    str2 = ToString(num21) + "[0-9][0-9])";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1) + "|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21) + "][0-9][0-9])";
                                }
                            }
                            else if (Math.trunc(num20 / 10) == 8)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|";
                                    str2 = ToString(int32_1 / 10 + 1) + "[0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num21 - 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                        }
                        else if (Math.trunc(num20 / 10) == 0)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num21 - 1) + "[0-9][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (Math.trunc(num20 / 10) == 9)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19 + 1) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (Math.trunc(num20 / 10) == 8)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (Math.trunc(num20 / 10) == 1)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num21 - 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (Math.trunc(num20 % 10) != Math.trunc(num22 % 10))
                    {
                        if (Math.trunc(num20 / 10) == 0)
                        {
                            if (Math.trunc(num20 % 10) == 0)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(num19) + "[0-9][0-9]|";
                                    str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                                else
                                {
                                    str1 = "([" + ToString(num19) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                    str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                            }
                            else if (Math.trunc(num20 % 10) == 9)
                            {
                                if (Math.trunc(num22 % 10) == 0)
                                {
                                    if (num19 + 1 == num21)
                                    {
                                        str1 = "(" + ToString(int32_1) + "|";
                                        str2 = ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|" + ToString(int32_2) + "])";
                                    }
                                    else if (num19 + 2 == num21)
                                    {
                                        str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                        str2 = ToString(num21 - 1) + "[0-9][0-9]|" + ToString(int32_2) + ")";
                                    }
                                    else
                                    {
                                        str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                        str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2) + ")";
                                    }
                                }
                                else if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                            }
                            else if (Math.trunc(num22 % 10) == 0)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = ToString(int32_2) + ")";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = ToString(num21 - 1) + "[0-9][0-9]|" + ToString(int32_2) + ")";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2) + ")";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num21 - 1) + "[0-9][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (Math.trunc(num20 / 10) == 9)
                        {
                            if (Math.trunc(num20 % 10) == 0)
                            {
                                if (Math.trunc(num22 % 10) == 9)
                                {
                                    if (num19 + 1 == num21)
                                    {
                                        str1 = "(" + ToString(int32_1 / 10) + "[0-9]|";
                                        str2 = ToString(num21) + "[0-9][0-9])";
                                    }
                                    else
                                    {
                                        str1 = "(" + ToString(int32_1 / 10) + "[0-9]|";
                                        str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21) + "][0-9][0-9])";
                                    }
                                }
                                else if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[0-9]|" + ToString(num19 + 1) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|";
                                    str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                    str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                    str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                            }
                            else if (Math.trunc(num20 % 10) == 9)
                            {
                                if (Math.trunc(num22 % 10) == 0)
                                {
                                    if (num19 + 1 == num21)
                                    {
                                        str1 = "(" + ToString(int32_1) + "|" + ToString(num19 + 1) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|";
                                        str2 = ToString(int32_2) + ")";
                                    }
                                    else if (num19 + 2 == num21)
                                    {
                                        str1 = "(" + ToString(int32_1) + "|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                        str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                    }
                                    else
                                    {
                                        str1 = "(" + ToString(int32_1) + "|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                        str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                    }
                                }
                                else if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19 + 1) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|";
                                    str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                    str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1) + "|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                    str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                            }
                            else if (Math.trunc(num22 % 10) == 0)//여기
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                                    str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                    str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                    str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                }
                            }
                            else if (Math.trunc(num22 % 10) == 9)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                                    str2 = ToString(num21) + "[0-9][0-9])";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21) + "][0-9][0-9])";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (Math.trunc(num20 % 10) == 0)
                        {
                            if (Math.trunc(num22 % 10) == 9)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                                    str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                                    str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                                }
                                else
                                {
                                    str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num20 / 10) + "][0-9])";
                                }
                            }
                            else if (Math.trunc(num20 / 10) == 1)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                                    str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                                    str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                                else
                                {
                                    str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                    str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|" + ToString(num19 + 1) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (Math.trunc(num20 % 10) == 9)
                        {
                            if (Math.trunc(num22 % 10) == 0)
                            {
                                if (Math.trunc(num20 / 10) == 1)
                                {
                                    if (num19 + 1 == num21)
                                    {
                                        str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                        str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                    }
                                    else if (num19 + 2 == num21)
                                    {
                                        str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                        str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                    }
                                    else
                                    {
                                        str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                        str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                    }
                                }
                                else if (Math.trunc(num20 / 10) == 8)
                                {
                                    if (num19 + 1 == num21)
                                    {
                                        str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                        str2 = ToString(num21) + "[0-" + ToString(num20 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                    }
                                    else if (num19 + 2 == num21)
                                    {
                                        str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                        str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                    }
                                    else
                                    {
                                        str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                        str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                    }
                                }
                                else if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                }
                            }
                            else if (Math.trunc(num20 / 10) == 8)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                            }
                            else if (Math.trunc(num20 / 10) == 1)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (Math.trunc(num22 % 10) == 0)
                        {
                            if (Math.trunc(num20 / 10) == 8)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                }
                            }
                            else if (Math.trunc(num20 / 10) == 1)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                        }
                        else if (Math.trunc(num22 % 10) == 9)
                        {
                            if (Math.trunc(num20 / 10) == 8)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = ToString(num21 - 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                        }
                        else if (Math.trunc(num20 / 10) == 8)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (Math.trunc(num20 / 10) == 1)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                }
                else if (num20 % 10 == num22 % 10)
                {
                    if (Math.trunc(num20 % 10) == 0)
                    {
                        if (Math.trunc(num20 / 10) == 0)
                        {
                            if (Math.trunc(num22 / 10) == 9)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(num19) + "[0-9][0-9]|";
                                    str2 = ToString(num21) + "[0-8][0-9]|" + ToString(int32_2) + ")";
                                }
                                else
                                {
                                    str1 = "([" + ToString(num19) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                    str2 = ToString(num21) + "[0-8][0-9]|" + ToString(int32_2) + ")";
                                }
                            }
                            else if (Math.trunc(num22 / 10) == 1)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(num19) + "[0-9][0-9]|";
                                    str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                                else
                                {
                                    str1 = "([" + ToString(num19) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                    str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(num19) + "[0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "([" + ToString(num19) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                        }
                        else if (Math.trunc(num20 / 10) == 9) //여기
                        {
                            if (Math.trunc(num22 / 10) == 0)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[0-9]|";
                                    str2 = ToString(int32_2) + ")";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[0-9]|";
                                    str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2) + ")";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2) + ")";
                                }
                            }
                            else if (Math.trunc(num22 / 10) == 1)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[0-9]|";
                                    str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                    str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                    str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                        }
                        else if (Math.trunc(num22 / 10) == 0)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                                str2 = ToString(int32_2) + ")";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2) + ")";
                            }
                        }
                        else if (Math.trunc(num22 / 10) == 9)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                        }
                        else if (Math.trunc(num22 / 10) == 1)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                        }
                        else
                        {
                            str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                        }
                    }
                    else if (num20 % 10 == 9)
                    {
                        if (Math.trunc(num20 / 10) == 0)
                        {
                            if (Math.trunc(num22 / 10) == 9)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = ToString(num21) + "[0-9][0-9])";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21) + "][0-9][0-9])";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                        }
                        else if (Math.trunc(num20 / 10) == 9)
                        {
                            if (Math.trunc(num22 / 10) == 0)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|";
                                    str2 = ToString(int32_2 / 10) + "[0-9])";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|";
                                    str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10) + "[0-9])";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1) + "|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10) + "[0-9])";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                        }
                        else if (Math.trunc(num22 / 10) == 0)
                        {
                            if (Math.trunc(num20 / 10) == 8)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = ToString(int32_2 / 10) + "[0-9])";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10) + "[0-9])";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10) + "[0-9])";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-9])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10) + "[0-9])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10) + "[0-9])";
                            }
                        }
                        else if (Math.trunc(num22 / 10) == 9)
                        {
                            if (Math.trunc(num20 / 10) == 8)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = ToString(num21) + "[0-9][0-9])";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21) + "][0-9][0-9])";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num21) + "[0-9][0-9])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21) + "][0-9][0-9])";
                            }
                        }
                        else if (Math.trunc(num20 / 10) == 8)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                        }
                    }
                    else if (Math.trunc(num20 / 10) == 0)
                    {
                        if (Math.trunc(num22 / 10) == 9)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (Math.trunc(num22 / 10) == 1)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (Math.trunc(num20 / 10) == 9)
                    {
                        if (Math.trunc(num22 / 10) == 0)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (Math.trunc(num22 / 10) == 1)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (Math.trunc(num22 / 10) == 0)
                    {
                        if (Math.trunc(num20 / 10) == 8)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (Math.trunc(num22 / 10) == 9)
                    {
                        if (Math.trunc(num20 / 10) == 8)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 / 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 / 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 / 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (Math.trunc(num20 / 10) == 8)
                    {
                        if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (num19 + 1 == num21)
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else if (num19 + 2 == num21)
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                }
                else if (Math.trunc(num20 / 10) == 0)
                {
                    if (num20 % 10 == 0)
                    {
                        if (Math.trunc(num22 / 10) == 9)
                        {
                            if (num22 % 10 == 9)
                            {
                                str1 = "([" + ToString(num19) + "-" + ToString(num21) + "]";
                                str2 = "[0-9][0-9])";
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(num19) + "[0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "([" + ToString(num19) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (num22 % 10 == 9)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(num19) + "[0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                            else
                            {
                                str1 = "([" + ToString(num19) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                        }
                        else if (Math.trunc(num22 / 10) == 1)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(num19) + "[0-9][0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "([" + ToString(num19) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(num19) + "[0-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "([" + ToString(num19) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (num20 % 10 == 9)
                    {
                        if (Math.trunc(num22 / 10) == 9)
                        {
                            if (num22 % 10 == 0)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (num22 % 10 == 0)
                        {
                            if (Math.trunc(num22 / 10) == 1)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                        }
                        else if (Math.trunc(num22 / 10) == 1)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (Math.trunc(num22 / 10) == 9)
                    {
                        if (num22 % 10 == 0)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                        }
                        else if (num22 % 10 == 9)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num21) + "[0-9][0-9])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21) + "][0-9][0-9])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (num22 % 10 == 0)
                    {
                        if (Math.trunc(num22 / 10) == 1)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                        }
                    }
                    else if (num22 % 10 == 9)
                    {
                        if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                        }
                    }
                    else if (Math.trunc(num22 / 10) == 1)
                    {
                        if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (num19 + 1 == num21)
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else if (num19 + 2 == num21)
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                }
                else if (Math.trunc(num20 / 10) == 9)
                {
                    if (num20 % 10 == 0)
                    {
                        if (Math.trunc(num22 / 10) == 0)
                        {
                            if (num22 % 10 == 9)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[0-9]|";
                                    str2 = ToString(int32_2 / 10) + "[0-9])";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                    str2 = ToString(int32_2 / 10) + "[0-9])";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1 / 10) + "[0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                    str2 = ToString(int32_2 / 10) + "[0-9])";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (num22 % 10 == 9)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                            }
                        }
                        else if (Math.trunc(num22 / 10) == 1)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (num20 % 10 == 9)
                    {
                        if (Math.trunc(num22 / 10) == 0)
                        {
                            if (num22 % 10 == 0)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|";
                                    str2 = ToString(int32_2) + ")";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                    str2 = ToString(int32_2) + ")";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1) + "|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                    str2 = ToString(int32_2) + ")";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|";
                                str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (num22 % 10 == 0)
                        {
                            if (Math.trunc(num22 / 10) == 1)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|";
                                    str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                    str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1) + "|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                    str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                        }
                        else if (Math.trunc(num22 / 10) == 1)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1) + "|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19 + 1) + "[0-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1) + "|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (Math.trunc(num22 / 10) == 0)
                    {
                        if (num22 % 10 == 0)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                                str2 = ToString(int32_2) + ")";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                str2 = ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(int32_2) + ")";
                            }
                        }
                        else if (num22 % 10 == 9)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-9])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-9])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-9])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                            str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                            str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                            str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (num22 % 10 == 0)
                    {
                        if (Math.trunc(num22 / 10) == 1)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                        }
                    }
                    else if (num22 % 10 == 9)
                    {
                        if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                        }
                    }
                    else if (Math.trunc(num22 / 10) == 1)
                    {
                        if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                            str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                            str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                            str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (num19 + 1 == num21)
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|";
                        str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else if (num19 + 2 == num21)
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                        str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                        str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                }
                else if (num20 % 10 == 0)
                {
                    if (Math.trunc(num22 / 10) == 0)
                    {
                        if (num22 % 10 == 9)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-9])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-9])";
                            }
                            else
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-9])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                            str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                            str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                            str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (Math.trunc(num22 / 10) == 9)
                    {
                        if (num22 % 10 == 9)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                                str2 = ToString(num21) + "[0-9][0-9])";
                            }
                            else
                            {
                                str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21) + "][0-9][0-9])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (num22 % 10 == 9)
                    {
                        if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                        }
                        else
                        {
                            str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                        }
                    }
                    else if (Math.trunc(num22 / 10) == 1)
                    {
                        if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                            str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                            str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                            str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (num19 + 1 == num21)
                    {
                        str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|";
                        str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else if (num19 + 2 == num21)
                    {
                        str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|" + ToString(num19 + 1) + "[0-9][0-9]|";
                        str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else
                    {
                        str1 = "(" + ToString(num19) + "[" + ToString(num20 / 10) + "-9][0-9]|[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|";
                        str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                }
                else if (num20 % 10 == 9)
                {
                    if (Math.trunc(num22 / 10) == 0)
                    {
                        if (num22 % 10 == 0)
                        {
                            if (Math.trunc(num20 / 10) == 8)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = ToString(int32_2) + ")";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2) + ")";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2) + ")";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(int32_2) + ")";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2) + ")";
                            }
                        }
                        else if (Math.trunc(num20 / 10) == 8)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (Math.trunc(num22 / 10) == 9)
                    {
                        if (num22 % 10 == 0)
                        {
                            if (Math.trunc(num20 / 10) == 8)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                        }
                        else if (Math.trunc(num20 / 10) == 8)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (num22 % 10 == 0)
                    {
                        if (Math.trunc(num22 / 10) == 1)
                        {
                            if (Math.trunc(num20 / 10) == 8)
                            {
                                if (num19 + 1 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                                else if (num19 + 2 == num21)
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                                else
                                {
                                    str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                                }
                            }
                            else if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                            }
                        }
                        else if (Math.trunc(num20 / 10) == 8)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                        }
                    }
                    else if (Math.trunc(num22 / 10) == 1)
                    {
                        if (Math.trunc(num20 / 10) == 8)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (Math.trunc(num20 / 10) == 8)
                    {
                        if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1) + "|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (num19 + 1 == num21)
                    {
                        str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else if (num19 + 2 == num21)
                    {
                        str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else
                    {
                        str1 = "(" + ToString(int32_1) + "|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                }
                else if (Math.trunc(num22 / 10) == 0)
                {
                    if (num22 % 10 == 0)
                    {
                        if (Math.trunc(num20 / 10) == 8)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(int32_2) + ")";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2) + ")";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(int32_2) + ")";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2) + ")";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2) + ")";
                        }
                    }
                    else if (num22 % 10 == 9)
                    {
                        if (Math.trunc(num20 / 10) == 8)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(int32_2 / 10) + "[0-9])";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10) + "[0-9])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10) + "[0-9])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(int32_2 / 10) + "[0-9])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10) + "[0-9])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10) + "[0-9])";
                        }
                    }
                    else if (Math.trunc(num20 / 10) == 8)
                    {
                        if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (num19 + 1 == num21)
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else if (num19 + 2 == num21)
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                }
                else if (Math.trunc(num22 / 10) == 9)
                {
                    if (num22 % 10 == 0)
                    {
                        if (nMath.trunc(um20 / 10) == 8)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                        }
                    }
                    else if (num22 % 10 == 9)
                    {
                        if (Math.trunc(num20 / 10) == 8)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num21) + "[0-9][0-9])";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21) + "][0-9][0-9])";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num21) + "[0-9][0-9])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21) + "][0-9][0-9])";
                        }
                    }
                    else if (Math.trunc(num20 / 10) == 8)
                    {
                        if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (num19 + 1 == num21)
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else if (num19 + 2 == num21)
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                }
                else if (num22 % 10 == 0)
                {
                    if (Math.trunc(num22 / 10) == 1)
                    {
                        if (Math.trunc(num20 / 10) == 8)
                        {
                            if (num19 + 1 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                            }
                            else if (num19 + 2 == num21)
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                            }
                            else
                            {
                                str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                                str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                            }
                        }
                        else if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2) + ")";
                        }
                    }
                    else if (Math.trunc(num20 / 10) == 8)
                    {
                        if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                        }
                    }
                    else if (num19 + 1 == num21)
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                    }
                    else if (num19 + 2 == num21)
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                    }
                    else
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2) + ")";
                    }
                }
                else if (num22 % 10 == 9)
                {
                    if (Math.trunc(num20 / 10) == 8)
                    {
                        if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                        }
                    }
                    else if (num19 + 1 == num21)
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 / 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                    }
                    else if (num19 + 2 == num21)
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 / 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                    }
                    else
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 / 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10) + "][0-9])";
                    }
                }
                else if (Math.trunc(num22 / 10) == 1)
                {
                    if (Math.trunc(num20 / 10) == 8)
                    {
                        if (num19 + 1 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else if (num19 + 2 == num21)
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                        else
                        {
                            str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                            str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                        }
                    }
                    else if (num19 + 1 == num21)
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num19) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else if (num19 + 2 == num21)
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num19) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num19) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                        str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(int32_2 / 10 - 1) + "[0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                }
                else if (Math.trunc(num20 / 10) == 8)
                {
                    if (num19 + 1 == num21)
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                        str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else if (num19 + 2 == num21)
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                        str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                    else
                    {
                        str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(int32_1 / 10 + 1) + "[0-9]|";
                        str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                    }
                }
                else if (num19 + 1 == num21)
                {
                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                    str2 = ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                }
                else if (num19 + 2 == num21)
                {
                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                    str2 = ToString(num19 + 1) + "[0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                }
                else
                {
                    str1 = "(" + ToString(int32_1 / 10) + "[" + ToString(num20 % 10) + "-9]|" + ToString(num19) + "[" + ToString(num20 / 10 + 1) + "-9][0-9]|";
                    str2 = "[" + ToString(num19 + 1) + "-" + ToString(num21 - 1) + "][0-9][0-9]|" + ToString(num21) + "[0-" + ToString(num22 / 10 - 1) + "][0-9]|" + ToString(int32_2 / 10) + "[0-" + ToString(num22 % 10) + "])";
                }
            }
        }


        return str1 + str2;
    }

};

function ToString (numberVal) {
    var returnVal = Math.trunc(numberVal);
    return returnVal.toString();
}
function ToInt32(stringVal){
    return parseInt(stringVal);
}
function Two_Place(Reg_String) {
    var int32 = ToInt32(Reg_String);
    var num1 = Math.trunc(int32 / 10);
    var num2 = Math.trunc(int32 % 10);
    if (num2 == 0)
    {
        if (num1 == 2)
            Reg_String = "1[0-9]|" + ToString(int32) + ")";
        else
            Reg_String = "[1-" + ToString(num1 - 1) + "][0-9]|" + ToString(int32) + ")";
    }
    else
    {
        switch (num1)
        {
            case 1:
                Reg_String = ToString(num1) + "[0-" + ToString(num2) + "])";
                break;
            case 2:
                if (num2 == 9)
                {
                    Reg_String = "[1-" + ToString(num1) + "][0-" + ToString(num2) + "])";
                    break;
                }
                Reg_String = ToString(num1 - 1) + "[0-9]|" + ToString(num1) + "[0-" + num2 + "])";
                break;
            default:
                if (num2 == 9)
                    Reg_String = "[1-" +  num1 + "][0-" +  num2 + "])";
                else
                    Reg_String = "[1-" +  (num1 - 1) + "][0-9]|" + num1 + "[0-" + num2 + "])";
                break;
        }
    }
    return Reg_String;
}


