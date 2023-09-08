"use strict";


var digitData = null;
var digitNode = null, separator = null;
var digit = null, ymdText = null, ampm = null;
var digitPattern = [];
var digitTimer= null;
var dragDigit = null;
var clockScale = 0.5, envCx, envCy, posX = 0, posY = 0, calcCx = 0;
var gradient = 0;
var weeks = 'SUN MON TUE WED THU FRI SAT'.split(' ');
var today = null, hours = null, minutes = null, seconds = null;
var year = null, month = null, day = null, dateString = '', ampmString = '';
var	digitClockConf = null;

var TopoDigitalClock = {

    setDigitData: function () {
        digitData = [
            ["M10,8L14,4L42,4L46,8L42,12L14,12L10,8z",
                "M8,10L12,14L12,42L8,46L4,42L4,14L8,10z",
                "M48,10L52,14L52,42L48,46L44,42L44,14L48,10z",
                "M10,48L14,44L42,44L46,48L42,52L14,52L10,48z",
                "M8,50L12,54L12,82L8,86L4,82L4,54L8,50z",
                "M48,50L52,54L52,82L48,86L44,82L44,54L48,50z",
                "M10,88L14,84L42,84L46,88L42,92L14,92L10,88z"],
            ["M66,8L70,4L98,4L102,8L98,12L70,12L66,8z",
                "M64,10L68,14L68,42L64,46L60,42L60,14L64,10z",
                "M104,10L108,14L108,42L104,46L100,42L100,14L104,10z",
                "M66,48L70,44L98,44L102,48L98,52L70,52L66,48z",
                "M64,50L68,54L68,82L64,86L60,82L60,54L64,50z",
                "M104,50L108,54L108,82L104,86L100,82L100,54L104,50z",
                "M66,88L70,84L98,84L102,88L98,92L70,92L66,88z"],
            ["M134,8L138,4L166,4L170,8L166,12L138,12L134,8z",
                "M132,10L136,14L136,42L132,46L128,42L128,14L132,10z",
                "M172,10L176,14L176,42L172,46L168,42L168,14L172,10z",
                "M134,48L138,44L166,44L170,48L166,52L138,52L134,48z",
                "M132,50L136,54L136,82L132,86L128,82L128,54L132,50z",
                "M172,50L176,54L176,82L172,86L168,82L168,54L172,50z",
                "M134,88L138,84L166,84L170,88L166,92L138,92L134,88z"],
            ["M190,8L194,4L222,4L226,8L222,12L194,12L190,8z",
                "M188,10L192,14L192,42L188,46L184,42L184,14L188,10z",
                "M228,10L232,14L232,42L228,46L224,42L224,14L228,10z",
                "M190,48L194,44L222,44L226,48L222,52L194,52L190,48z",
                "M188,50L192,54L192,82L188,86L184,82L184,54L188,50z",
                "M228,50L232,54L232,82L228,86L224,82L224,54L228,50z",
                "M190,88L194,84L222,84L226,88L222,92L194,92L190,88z"],
            ["M258,8L262,4L290,4L294,8L290,12L262,12L258,8z",
                "M256,10L260,14L260,42L256,46L252,42L252,14L256,10z",
                "M296,10L300,14L300,42L296,46L292,42L292,14L296,10z",
                "M258,48L262,44L290,44L294,48L290,52L262,52L258,48z",
                "M256,50L260,54L260,82L256,86L252,82L252,54L256,50z",
                "M296,50L300,54L300,82L296,86L292,82L292,54L296,50z",
                "M258,88L262,84L290,84L294,88L290,92L262,92L258,88z"],
            ["M314,8L318,4L346,4L350,8L346,12L318,12L314,8z",
                "M312,10L316,14L316,42L312,46L308,42L308,14L312,10z",
                "M352,10L356,14L356,42L352,46L348,42L348,14L352,10z",
                "M314,48L318,44L346,44L350,48L346,52L318,52L314,48z",
                "M312,50L316,54L316,82L312,86L308,82L308,54L312,50z",
                "M352,50L356,54L356,82L352,86L348,82L348,54L352,50z",
                "M314,88L318,84L346,84L350,88L346,92L318,92L314,88z"]
        ];
    },

    clearTimer: function () {
        if (digitTimer != null) clearTimeout(digitTimer);
        digitTimer = null;
    },

    setDigit: function (objTopo) {

        objTopo.vars.svg.select(".svgGroup").selectAll(".grp_clock").selectAll("g").remove();
        // objTopo.vars.svg.select(".svgGroup").selectAll(".clockBackground").remove();
        // objTopo.vars.svg.select(".svgGroup").selectAll(".clockSelect").remove();

        TopoDigitalClock.clearTimer();
        TopoDigitalClock.setDigitData();

        gradient = -4; // - 값 : 오른쪽으로 기울기,  + 왼쪽으로 기울기
        // envCx = parseFloat(TopoConst.digitClockSetting.posX) || 850;
        // envCy = parseFloat(TopoConst.digitClockSetting.posY) || 24;

        envCx = parseFloat((objTopo.vars.width / 2)-150) || 850;
        envCy = parseFloat(TopoConst.digitClockSetting.posY) || 24;


        calcCx = envCx * 2;
        digitNode =  objTopo.vars.svgGroup.select("g.grp_clock");
        digitNode.style("display", this.isViewMode(objTopo) ? "block" : "none");

        /* 시계 기본 g 선언 */
        digitNode = digitNode.enter()
            .append("g")
            .merge(digitNode)
            .attr("cx", envCx)
            .attr("cy", envCy)
            .on("click", function (d) {
                if(TopoDigitalClock.isManageMode(objTopo)) {
                    d3.select("rect#clockSelect")
                        .classed("clockactive", true)
                        .style("display", "block");
                    dragDigit = objTopo.vars.svgGroup.select("g.grp_clock");
                } else {
                    d3.select("rect#clockSelect")
                        .classed("clockactive", false)
                        .style("display", "none");
                }
            })
            .call(d3.drag()
                .on("start",  function(d) {
                    if(TopoDigitalClock.isManageMode(objTopo)) {
                        d3.select("rect#clockSelect")
                            .classed("clockactive", true)
                            .style("display", "block");
                    	// // d3.select(this).classed("clockactive", true);
                    	// TopoDigitalClock.dragStarted(objTopo);
                    }
                })
                    .on("drag", function(d) {
                        if(TopoDigitalClock.isManageMode(objTopo)) {
                            if (objTopo.vars.svg.selectAll(".clockactive").data().length > 0 ) {
                                TopoDigitalClock.dragged(this);
                            }
                        }
                    })
            )
            .attr("transform", "translate({0}, {1})".substitute(calcCx, envCy));


        /* clock BG */
        digitNode
            .selectAppend("g", "clockBackground")
            .selectAppend("rect", "clockBackground")
            .attr("width", 210)
            .attr("height", 70)
            .attr("rx", 8)
            .attr("px", calcCx)
            .attr("py", envCy)
            .classed("clockBackground", true)
            .attr("fill", TopoConst.digitClockSetting.clockBgColor)
            .style("fill-opacity", TopoConst.digitClockSetting.clockBgOpacity)
            .style("display", this.isViewMode(objTopo) ? "block" : "none")
            // .attr("transform", "translate({0}, {1})".substitute(calcCx - 10, envCy - 11))


        /* clock select stroke */
        digitNode
            .selectAppend("g", "clockSelect")
            .selectAppend("rect", "clockSelect")
            .attr("id", "clockSelect")
            .attr("class", "clockSelect")
            .attr("width", 210)
            .attr("height", 70)
            .attr("rx", 8)
            .attr("px", calcCx)
            .attr("py", envCy)
            .classed("clockactive", false)
            .attr("fill", "transparent")
            .attr("stroke", "#ff0000")
            .attr("stroke-width", 3)
            .style("stroke-dasharray", "5,5")
            .style("display", "none");
        //  .attr("transform", "translate({0}, {1})".substitute(calcCx - 10, envCy - 11));




        /** 년월일 + 요일 표시  append **/
        digitNode
            .selectAppend("g", "ymd")
            .attr("id", "ymd")
            .classed("ymd", true);
        // .attr("transform", "scale(" + clockScale + ")");

        /** 년월일 + 요일 표시 */
        digitNode.select("g#ymd")
            .selectAppend("text", "ymd")
            .attr("id", "ymd")
            .attr("class", "textymd")
            .attr("x", 45)
            .attr("y", 15)
            .attr("fill", TopoConst.digitClockSetting.fillColor)
            .style("font-size", '14px')
            .style("font-family", 'Sans-Serif')
            .style("font-weight", 'bold')
            // .attr("text-anchor", "middle")
            .text('');

        /**  am, pm text **/
        digitNode
            .selectAppend("g", "ampm")
            .attr("id", "ampm")
            .selectAppend("text", "ampm")
            .attr("class", "textampm")
            .attr('x', 4)
            .attr('y', 32)
            .attr("fill", TopoConst.digitClockSetting.fillColor)
            .style("font-size", '11px')
            .style("font-family", 'Sans-Serif')
            .style("font-weight", 'bold')
            .text('');

        /** 시계 이미지 append **/
        digitNode
            .selectAppend("g", "clockimage")
            .attr("id", "clockimage")
            .selectAppend("image", "clockimage")
            .attr('xlink:href', '/img/d3/menu/navi/topoNav10.svg')
            .attr('width', 18).attr('height', 18)
            .attr('x', 4).attr('y', 45);

        /* clock Path */
        $.each(digitData, function (i, g) {
            digitNode
                .selectAppend("g", "clock")
                .attr("id", "clock_"+i)
                .merge(digitNode)
                .attr("transform", "scale(" + clockScale + ") translate(54, 36) skewX(" + gradient + ")")
                .classed("digit", true);

            $.each(g, function (j, d) {
                digitNode.select("g#clock_" + i)
                    .selectAppend("path", "clock")
                    .attr("d", d)
                    .attr("fill", TopoConst.digitClockSetting.fillColor);
            });

            /* clock separator */
            if(i === 1) {
                digitNode
                    .selectAppend("g", "separator_"+ i)
                    .attr("id", "separator_" + i)
                    .attr("transform", "scale(" + clockScale + ") skewX(" + gradient + ")")
                    .classed("separator", true)
                    .selectAppend("circle", "separator")
                    .attr("id", "separator_"+i+"_1")
                    .attr("r", 4)
                    .attr("cx", 174)
                    .attr("cy", 65)
                    .attr("fill", TopoConst.digitClockSetting.fillColor);

                digitNode.select("g#separator_" + i)
                    .selectAppend("circle", "separator")
                    .attr("id", "separator_"+i+"_2")
                    .attr("r", 4)
                    .attr("cx", 174)
                    .attr("cy", 105)
                    .attr("fill", TopoConst.digitClockSetting.fillColor);
            }

            if(i === 3) {

                digitNode
                    .selectAppend("g", "separator_"+ i)
                    .attr("id", "separator_" + i)
                    .attr("transform", "scale(" + clockScale + ") skewX(" + gradient + ")")
                    .classed("separator", true)
                    .selectAppend("circle", "separator")
                    .attr("id", "separator_"+i+"_1")
                    .attr("r", 4)
                    .attr("cx", 298)
                    .attr("cy", 65)
                    .attr("fill", TopoConst.digitClockSetting.fillColor);

                digitNode.select("g#separator_" + i)
                    .selectAppend("circle", "separator")
                    .attr("id", "separator_"+i+"_2")
                    .attr("r", 4)
                    .attr("cx", 298)
                    .attr("cy", 105)
                    .attr("fill", TopoConst.digitClockSetting.fillColor);
            }

        });

        // clockUnderlay = objTopo.vars.svgGroup.select("g.clock");



        // digitNode.attr("id", "underlay");
        // clockOverlay.attr("id", "overlay");

        digitNode.raise();

        dragDigit = objTopo.vars.svgGroup.select("g.clock");
        ymdText = objTopo.vars.svgGroup.select(".textymd");
        ampm = objTopo.vars.svgGroup.select(".textampm");
        digit = objTopo.vars.svgGroup.selectAll(".digit");
        separator = objTopo.vars.svgGroup.selectAll(".separator circle");

        digitPattern = [
            [1,0,1,1,0,1,1,1,1,1],
            [1,0,0,0,1,1,1,0,1,1],
            [1,1,1,1,1,0,0,1,1,1],
            [0,0,1,1,1,1,1,0,1,1],
            [1,0,1,0,0,0,1,0,1,0],
            [1,1,0,1,1,1,1,1,1,1],
            [1,0,1,1,0,1,1,0,1,1]
        ];

        digitTimer = setTimeout(function tick () {
            TopoDigitalClock.digitTick();
            setTimeout(tick, 1000 - (new Date) % 1000);
        }, 1000 - (new Date) % 1000);


    },

    dragStarted: function (objTopo) {
        dragDigit = null;
        if(TopoDigitalClock.isManageMode(objTopo)) {
            dragDigit = objTopo.vars.svgGroup.select("g.grp_clock");

        }
    },

    dragged: function (d) {

        if ( d3.select("rect#clockSelect.clockactive").empty() ) return;


        posX = d3.event.dx + parseFloat(objTopo.vars.svg.select(".svgGroup").select(".clockSelect").attr('px') ); //parseFloat(posVal[5]);
        posY = d3.event.dy + parseFloat(objTopo.vars.svg.select(".svgGroup").select(".clockSelect").attr('py') ); //parseFloat(posVal[6]);

        // calcCx = posX * 2;

        d3.select(d)
            .attr("px", posX)
            .attr("py", posY)
            .attr("transform", "translate({0}, {1})".substitute(posX - 10, posY - 11));

        d3.select("rect#clockSelect")
            .attr("px", posX)
            .attr("py", posY);
            // .attr("transform", "translate({0}, {1})".substitute(posX, posY));

        dragDigit
            .attr("cx", posX)
            .attr("cy", posY)
            .attr("transform", "translate({0}, {1})".substitute(posX, posY));
    },

    digitTick: function () {
        today = new Date;
        hours = today.getHours();
        minutes = today.getMinutes();
        seconds = today.getSeconds();

        year = today.getFullYear();
        month = ('0' + (today.getMonth() + 1)).slice(-2);
        day = ('0' + today.getDate()).slice(-2);
        dateString = year + '-' + month  + '-' + day + ' ' + weeks[new Date().getDay()];

        ymdText.text(dateString);

        digit = digit.data([hours / 10 | 0, hours % 10, minutes / 10 | 0, minutes % 10, seconds / 10 | 0, seconds % 10]);

       // console.log("hours ==> " + hours) , console.log("hours / 10 ==> " + (hours / 10))  , console.log("hours % 10 ==> " + (hours % 10))  ;
       //  console.log("minutes ==> " + minutes) , console.log("minutes / 10 ==> " + (minutes / 10)) , console.log("minutes % 10 ==> " + (minutes % 10));
       //  console.log("seconds ==> " + seconds ), console.log("seconds / 10 ==> " + (seconds / 10)), console.log("seconds % 10 ==> " + (seconds % 10));

        // var ampm = hours >= 12 ? 'pm' : 'am';
        // var hours1 = hours === 12 ? 12 : (hours % 12) < 10 ? 0 : 1;
        // var hours2 = (hours % 12) < 10 ? (hours % 12) : (hours % 12) % 10;

        if (TopoConst.digitClockSetting.clockType == "H24") {
            ampm.attr("display", "none");
            digit = digit.data([hours / 10 | 0, hours % 10, minutes / 10 | 0, minutes % 10, seconds / 10 | 0, seconds % 10]);
        } else {
            ampmString = hours < 12 ? "AM" : "PM";
            ampm.text(ampmString)
                .attr("display", "block");

            digit = digit.data([
                hours === 12 ? 1 : (hours % 12) < 10 ? 0 : 1,
                hours === 12 ? 2 : (hours % 12) < 10 ? (hours % 12) : (hours % 12) % 10,
                minutes / 10 | 0,
                minutes % 10,
                seconds / 10 | 0,
                seconds % 10]
            );
        }

        digit.select("path:nth-child(1)")
            .style("fill", function(d) { if (digitPattern[0][d] === 1) return TopoConst.digitClockSetting.fillColor; else return 'none'; })
            .classed("lit", function(d) { return digitPattern[0][d]; });
        digit.select("path:nth-child(2)")
            .style("fill", function(d) { if (digitPattern[1][d] === 1) return TopoConst.digitClockSetting.fillColor; else return 'none'; })
            .classed("lit", function(d) { return digitPattern[1][d]; });
        digit.select("path:nth-child(3)")
            .style("fill", function(d) { if (digitPattern[2][d] === 1) return TopoConst.digitClockSetting.fillColor; else return 'none'; })
            .classed("lit", function(d) { return digitPattern[2][d]; });
        digit.select("path:nth-child(4)")
            .style("fill", function(d) { if (digitPattern[3][d] === 1) return TopoConst.digitClockSetting.fillColor; else return 'none'; })
            .classed("lit", function(d) { return digitPattern[3][d]; });
        digit.select("path:nth-child(5)")
            .style("fill", function(d) { if (digitPattern[4][d] === 1) return TopoConst.digitClockSetting.fillColor; else return 'none'; })
            .classed("lit", function(d) { return digitPattern[4][d];});
        digit.select("path:nth-child(6)")
            .style("fill", function(d) { if (digitPattern[5][d] === 1) return TopoConst.digitClockSetting.fillColor; else return 'none'; })
            .classed("lit", function(d) { return digitPattern[5][d]; });
        digit.select("path:nth-child(7)")
            .style("fill", function(d) { if (digitPattern[6][d] === 1) return TopoConst.digitClockSetting.fillColor; else return 'none'; })
            .classed("lit", function(d) { return digitPattern[6][d]; });
        separator
            .style("fill", function(d) { if (seconds & 1) return TopoConst.digitClockSetting.fillColor; else return 'none'; })
            // .classed("lit", seconds & 1);

    },


    getDigitClockEnvInfo:function (objTopo) {
        dragDigit = objTopo.vars.svgGroup.select("g.grp_clock");
        digitClockConf = null;
        if(objTopo.vars.svgGroup.selectAll(".clockBackground").nodes().length > 0 ) {

            var posX, posY, fillColor, clockBgColor, clockBgOpacity, clockType, clockTheme;
            posX = dragDigit.attr("cx");
            posY = dragDigit.attr("cy");
            fillColor = TopoConst.digitClockSetting.fillColor||'#000000';
            clockBgColor = TopoConst.digitClockSetting.clockBgColor||'#a3a3a3';
            clockBgOpacity = TopoConst.digitClockSetting.clockBgOpacity||0.1;
            clockType = TopoConst.digitClockSetting.clockType||'H24'; // H12
            clockTheme = '';

            digitClockConf = JSON.stringify({
                posX: posX,
                posY: posY,
                fillColor: fillColor,
                clockBgColor: clockBgColor,
                clockBgOpacity: clockBgOpacity,
                clockType: clockType,
                clockTheme: clockTheme
            });

        }

        return digitClockConf;

    },

    isViewMode: function(objTopo) {
        return objTopo.vars.isViewClock;
    },

    isManageMode: function(objTopo) {
        return objTopo.vars.mapMode == TopoConst.mapMode.MANAGE;
    }


};
