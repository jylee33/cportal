/**
 * 문자열의 길이를 구한다. 한글 (2byte), 영문 (1byte)
 * @returns 
 */
String.prototype.byteLen = function() {
	var cnt = 0;
	for(var i = 0; i < this.length; i++) {
		if(this.charCodeAt(i) > 127) cnt+= 2;
		else cnt++;
	}
	return cnt;
};

/** 
 * 공백이나 널인지 확인
 * @returns {Boolean}
 */
String.prototype.isBlank = function() {
	var str = this.trim();
	for(var i = 0; i < str.length; i++) {
		if(str.charAt(i) !== "\t" && str.charAt(i) !== "\n" && str.charAt(i) !== "\r") return false;
	}
	return true;
};

/**
 * 숫자로 구성되어 있는지 학인
 * @returns
 */
String.prototype.isNum = function() {
	return (/^[0-9]+$/).test(this) ? true : false;
};

/**
 * 영어로 구성되어 있는지 학인
 * @returns
 */
String.prototype.isEng = function() {
//	alert( (/^[a-zA-Z]+$/).test(this) ? true : false);
	return (/^[a-zA-Z]+$/).test(this) ? true : false;
//	return false;
//	return (/^[a-zA-Z]+$/).test(this) ? true : false;
};

/**
 * 한글로 구성되어 있는지 학인
 * @returns
 */
String.prototype.isKor = function() {
	return (/^[가-힣]+$/).test(this) ? true : false;
};

/**
 * 이메일의 유효성을 체크
 * @returns
 */
String.prototype.isEmail = function() {
    return (/\w+([-+.]\w+)*@\w+([-.]\w+)*\.[a-zA-Z]{2,4}$/).test(this.trim());
};

/**
 * 전화번호 체크 - arguments[0] : 전화번호 구분자
 * @returns
 */
String.prototype.isPhone = function() {
    var arg = arguments[0] ? arguments[0] : "";
    return eval("(/(02|0[3-9]{1}[0-9]{1})" + arg + "[1-9]{1}[0-9]{2,3}" + arg + "[0-9]{4}$/).test(this)");
};

/**
 * 핸드폰번호 체크 - arguments[0] : 핸드폰 구분자
 * @returns
 */
String.prototype.isMobile = function() {
    var arg = arguments[0] ? arguments[0] : "";
    return eval("(/01[016789]" + arg + "[1-9]{1}[0-9]{2,3}" + arg + "[0-9]{4}$/).test(this)");
};

/**
 * IPv4 체크
 */
String.prototype.isIPv4 = function() {
    return (/^(((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}(((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5])))$/).test(this);
};

String.prototype.isIPv4_subnet = function() {
    var checkIp = this.indexOf('/') !== -1? this.substring(0, this.indexOf('/')) : this;
    var checkMask = this.indexOf('/') !== -1? this.split('/')[1] : 32;

    var flag = (/^(((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}(((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5])))$/).test(checkIp);
    if(flag  && (checkMask >= 0 && checkMask <= 32)) {
        return true;
    }
    else return false;
};

/**
 * IPv6 체크
 */
String.prototype.isIPv6 = function() {
	var regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
	return (regex).test(this);
};

String.prototype.lpad = function(padLength, padString) {
	var s = this;
	while(s.length < padLength) {
		s = padString + s;
	}
	return s;
};

String.prototype.rpad = function(padLength, padString) {
	var s = this;
	while(s.length < padLength) {
		s = s + padString;
	}
	return s;
};

String.prototype.format = function() {
	var str = this;
	for(var i = 0; i < arguments.length; i++) {
		var reg = new RegExp("\\{" + i + "\\}", "gm");
		str = str.replace(reg, arguments[i]);
	}
	return str;
};

String.prototype.substitute = function() {
	var str = this;
	for(var i = 0; i < arguments.length; i++) {
		var reg = new RegExp("\\{" + i + "\\}", "gm");
		str = str.replace(reg, arguments[i]);
	}
	return str;
};

/**
* XSS Filter된 문자를 치환하는 함수
* 치환문자: < (&lt;), > (&gt;), (&quot;)
* 제외 : &amp; 의 경우 저장시문제 발생으로 제외 처리
* @returns {String}
*/
String.prototype.htmlCharacterUnescapes = function() {
    var str = this;
    str = str.replace(/\&lt\;/g, '<').replace(/\&gt\;/g, '>').replace(/\&quot\;/g, '"').replace(/\&rsquo\;/g, "'")
        .replace(/\<script\>/ig, '&lt;script&gt;').replace(/\<\/script\>/ig, '&lt;/script&gt;');
    return str;
};

String.prototype.htmlCharacterEscapes = function() {
    var str = this;
    str = str.replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\"/g, '&quot;');
    return str;
};


if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}

if (!String.prototype.repeat) {
    String.prototype.repeat = function(count) {
        'use strict';
        if (this == null) {
            throw new TypeError('can\'t convert ' + this + ' to object');
        }
        var str = '' + this;
        count = +count;
        if (count != count) {
            count = 0;
        }
        if (count < 0) {
            throw new RangeError('repeat count must be non-negative');
        }
        if (count == Infinity) {
            throw new RangeError('repeat count must be less than infinity');
        }
        count = Math.floor(count);
        if (str.length == 0 || count == 0) {
            return '';
        }
        // Ensuring count is a 31-bit integer allows us to heavily optimize the
        // main part. But anyway, most current (August 2014) browsers can't handle
        // strings 1 << 28 chars or longer, so:
        if (str.length * count >= 1 << 28) {
            throw new RangeError('repeat count must not overflow maximum string size');
        }
        var maxCount = str.length * count;
        count = Math.floor(Math.log(count) / Math.log(2));
        while (count) {
            str += str;
            count--;
        }
        str += str.substring(0, maxCount - str.length);
        return str;
    }
}



String.prototype.underscoreToCamelCase = function() {
    var str = this.toLowerCase();
    var arr = str.split(/[_-]/);
    var newStr = "";
    for (var i = 1; i < arr.length; i++) {
        newStr += arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    return arr[0] + newStr;
};

