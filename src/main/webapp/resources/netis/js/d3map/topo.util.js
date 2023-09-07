var TopoUtil = {
		/** 이벤트등급 문자열 리턴 */
		convertEvtLevel: function(evtLevel) {
			var result = TopoConst.evtLvlString["level" + (evtLevel < 0? "_" : "") + Math.abs(evtLevel)];
			return result || "기타";
		},

		/** 이벤트등급 색상 리턴 */
		getEvtColor: function(evtLevel) {
			var result = TopoConst.evtLvlColor["level" + (evtLevel < 0? "_" : "") + Math.abs(evtLevel)];
			return result || TopoConst.evtLvlColor.level0;
		},

        getIfSpeedColor: function(speed) {
		    if(speed >= (Math.pow(1000,3) * 10)) {
		        return TopoConst.envSetting.speedColor5;
            }
		    else if(speed >= Math.pow(1000,3)) {
                return TopoConst.envSetting.speedColor4;
            }
            else if(speed >= (Math.pow(1000,2) * 100)) {
                return TopoConst.envSetting.speedColor3;
            }
            else if(speed >= (Math.pow(1000,2) * 10)) {
                return TopoConst.envSetting.speedColor2;
            }
            else {
                return TopoConst.envSetting.speedColor1;
            }
        },

        getItemWidth: function(itemSize) {
		    return this.getItemScale(itemSize) * 55;
        },

        getItemScale: function(itemSize) {
            return 1.5 * (9 * itemSize) / 55;
        },

        // 두좌표간 각도 계산
        getAngle: function(x1, y1, x2, y2) {
		    var dx = x2 - x1,
                dy = y2 - y1;
		    var rad = Math.atan2(dx, dy),
                degree = (rad * 180) / Math.PI;
		    return degree;
        },

        /**
         * @param value  모든 값
         *  값 유무 및 undefined 체크
         */
        getValidateCheck: function (value) {
            if (value && value !== undefined) return true;
            else false;

        }
};

d3.selection.prototype.selectAppend = function(name, classNm) {
    var select = d3.selector(name + (classNm != null? "." + classNm : "")),
        create = d3.creator(name);
    return this.select(function() {
        return select.apply(this, arguments)
            || this.appendChild(create.apply(this, arguments));
    });
};
d3.selection.prototype.selectAppendById = function(name, id) {
    var select = d3.selector(name + (id != null? "#" + id : "")),
        create = d3.creator(name);
    return this.select(function() {
        return select.apply(this, arguments)
            || this.appendChild(create.apply(this, arguments));
    });
};

d3.selection.prototype.selectInsert = function(name, classNm, before) {
    var select = d3.selector(name + (classNm != null? "." + classNm : "")),
        create = d3.creator(name);
    return this.select(function() {
        return select.apply(this, arguments)
            || this.insertBefore(create.apply(this, arguments), this.lastChild);
    });
};
