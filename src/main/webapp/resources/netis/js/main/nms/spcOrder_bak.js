var DesAreaDocnt;
var Col_Mode;
var strSource3;
var StyleFFamily = 'font-family:굴림; ';
var StyleFSize = 'font-size:9pt; ';
var StyleFColor = 'color:#000000; ';
var StyleFalign = 'text-align: ;';
var StyleBackgr = "; ";
var StyleBWidth = 'border-width:1; ';
var StyleBColor = 'border-color:#555555; ';
var StyleBColor2 =StyleBColor;
var StyleBStyle = 'border-style:solid; ';
var StylePageColor = "background-color:1; ; ";
var StyleLineHeight = 'line-height:100%;';

// 타입 정의
var execMode = {
	NORMAL: 'normal',
	FONT: 'font'
};

var colorMode = {
	ALL_FONT_COLOR: 'allFontColor',
	ALL_BG_COLOR: 'allFontBgColor',
	SELECT_FONT_COLOR:'selectFontColor',
	SELECT_FONT_BG_COLOR:'selectFontBgColor'
};

var mouseMode = {
	CLICK: 1,
	OVER: 2
};

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


        }
    },

    /** init design */
    initDesign: function() {
        strSource3 = "<TABLE width=95% align=center border=0 cellpadding=0 cellSpacing=0>" +
            "<tr>" +
            "</tr>" +
            "<tr>" +
            "<td>" +
            "<TABLE id='table1' width=100% border=1 cellpadding=1 cellSpacing=0 borderColor=#b7b7b7 borderColorLight=#b7b7b7 borderColorDark=white style='FONT-SIZE: 10pt; COLOR: #5f5f5f; FONT-FAMILY: 돋움'>" +
            "<TR><TD align=middle bgColor=lightgoldenrodyellow><b><font size=3>발 주 서</font></b></TD></TR>" +
            "<TR>" +
            "<TD>" +
            "<p align=center>※ 아래와 같이 발주합니다.</p>" +
            "<TABLE cellSpacing=0 cellpadding=1 width=70% align=center border=1 borderColor=#b7b7b7 borderColorLight=#b7b7b7 borderColorDark=white style='FONT-SIZE: 10pt; COLOR: #5f5f5f; FONT-FAMILY: 돋움'>" +
            "<TR><TD width=40% align=middle bgcolor=lightcyan>발 주 일 자</TD><TD align=middle>&nbsp;</TD></TR>" +
            "<TR><TD align=middle bgcolor=lightcyan>건 명</TD><TD align=middle>&nbsp;</TD></TR>" +
            "<TR><TD align=middle bgcolor=lightcyan>대금지불조건</TD><TD align=middle>&nbsp;</TD></TR>" +
            "<TR><TD align=middle bgcolor=lightcyan>품 질 보 증</TD><TD align=middle>&nbsp;</TD></TR>" +
            "<TR><TD align=middle bgcolor=lightcyan>납 품 일 정</TD><TD align=middle>&nbsp;</TD>" +
            "</TR>" +
            "</TABLE>" +
            "<br>" +
            "<TABLE id='table2' cellSpacing=0 cellpadding=1 width=95% align=center border=1 borderColor=#b7b7b7 borderColorLight=#b7b7b7 borderColorDark=white style='FONT-SIZE: 10pt; COLOR: #5f5f5f; FONT-FAMILY: 돋움'>" +
            "<TR><TD colSpan=6 align=middle><b>▶   발 주  금 액   :   \\- (VAT 포함) [ 금액 단위 : 원 ]</b></TD></TR>" +
            "<TR bgcolor=lightcyan align=middle><TD width=20%>품 명</TD><TD width=34%>규 격</TD><TD width=8%>수량</TD><TD width=8%>단위</TD><TD width=15%>공급단가</TD><TD width=15%>공급가합</TD></TR>" +
            "<TR><TD>&nbsp;</TD><TD>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=right>&nbsp;</TD><TD align=right>&nbsp;</TD></TR>" +
            "<TR><TD>&nbsp;</TD><TD>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=right>&nbsp;</TD><TD align=right>&nbsp;</TD></TR>" +
            "<TR><TD>&nbsp;</TD><TD>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=right>&nbsp;</TD><TD align=right>&nbsp;</TD></TR>" +
            "<TR><TD>&nbsp;</TD><TD>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=right>&nbsp;</TD><TD align=right>&nbsp;</TD></TR>" +
            "<TR><TD>&nbsp;</TD><TD>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=right>&nbsp;</TD><TD align=right>&nbsp;</TD></TR>" +
            "<TR><TD>&nbsp;</TD><TD>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=right>&nbsp;</TD><TD align=right>&nbsp;</TD></TR>" +
            "<TR><TD>&nbsp;</TD><TD>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=right>&nbsp;</TD><TD align=right>&nbsp;</TD></TR>" +
            "<TR><TD>&nbsp;</TD><TD>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=right>&nbsp;</TD><TD align=right>&nbsp;</TD></TR>" +
            "<TR><TD>&nbsp;</TD><TD>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=right>&nbsp;</TD><TD align=right>&nbsp;</TD></TR>" +
            "<TR><TD>&nbsp;</TD><TD>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=middle>&nbsp;</TD><TD align=right>&nbsp;</TD><TD align=right>&nbsp;</TD></TR>" +
            "<TR align=middle><TD colSpan=4 bgColor=lightcyan><b>공급가합</b></TD><TD colSpan=2><b>\\</b></TD></TR>" +
            "<TR align=middle><TD colSpan=4 bgColor=lightcyan><b>VAT 포함</b></TD><TD colSpan=2><b>\\</b></TD></TR>" +
            "</TABLE>" +
            "</TD>" +
            "</TR>" +
            "<TR>" +
            "<TD>(주)섹타나인 담당 : </TD>" +
            "</TABLE>" +
            "</td>" +
            "</tr>" +
            "</TABLE>"

        Main.createOrder();
		Main.createStyleDiv();

    },

    /** init data */
    initData: function() {

    },

    search: function() {

    },

	/*======================================================================================
				Toolbar 버튼 제어
	 =======================================================================================*/

    /**
	 * 발주서 양식 생성
     */
    createOrder: function () {
        DesAreaDocnt=window.frames.DesignArea.document;
        DesAreaDocnt.designMode = 'On';
        DesAreaDocnt.body.innerHTML = strSource3;
    },

	createStyleDiv: function () {
		// 기호

		var elemDiv = document.createElement('div');
		var elemHTML;
		var SignArray = new Array('<li>','『 』','【 】','◁','▷','◀','▶','☆','★','○','●','◎','◆','□','♀','♂','△','▲','→','←','↑','↓','↔','≪','≫','⇒','⇔','♤','♠','♡','♥','♧','♣','⊙','◈','▣','◐','▤','▥','▧','▦','♨','☏','☎','☜','☞','®','㉿','㈜','♬','♪','±','×','÷','≠','≤','≥','∽','￥');
	    elemHTML = '<div id=Signtext style="font-size:9px; border:1px solid #0000ff;position:absolute; visibility:hidden; z-Index:10; padding:0;">'
		elemHTML += '<select onchange=Main.EditModeTagin(value,4)>'
		elemHTML += '<option value="">기호</option>';
	    elemHTML += "<option value=''></option><option value='<li>'>dot</option>"

		for(i=1; i<SignArray.length; ++i) {
			elemHTML += "<option value='"+SignArray[i]+"'>"+SignArray[i]+"</option>";
		}
		elemHTML += '</select>'
		elemHTML += '</div>'
		elemDiv.innerHTML = elemHTML;
		$('#topDiv').append(elemDiv);

		// 색상
		var colors = new Array('#FFFFFF','#FFF3EF','#FFFBEF','#FFFFEF','#FFFFEF','#EFFFF7','#EFFFFF','#EFFBFF','#EFF3FF','#FFEFFF','#FFEFFF','#FFEFFF','#FFEFFF','#EEEEEE','#FFD3CE','#FFEFCE','#FFFFCE','#EFFFCE','#CEFFD6','#CEFFF7','#CEF3FF','#CEDBFF','#E7CFFF','#EFCFFF','#FFCFFF','#FFCFEF','#BBBBBB','#FF8E84','#FFD384','#FFFF94','#CEFF84','#84FF8C','#84FFEF','#84E3FF','#849EFF','#BD86FF','#D686FF','#FF86FF','#FF86CE','#999999','#FF3421','#FFAE21','#FFFF21','#A5FF21','#21FF31','#21FFD6','#21CBFF','#2151FF','#8424FF','#AD24FF','#FF24FF','#FF24A5','#777777','#E70C00','#E79200','#E7E700','#84E700','#00E708','#00E7BD','#00AEE7','#0028E7','#6300E7','#9500E7','#E700E7','#E70084','#555555','#9C0800','#9C6100','#9C9E00','#5A9E00','#009E08','#009E84','#00799C','#001C9C','#42009C','#63009C','#9C009C','#9C005A','#303030','#5A0500','#5A3800','#5A5D00','#315D00','#005D00','#005D4A','#00495A','#00105A','#29005A','#39005A','#5A005A','#5A0031','#000000','#390000','#391800','#393C00','#213C00','#003C00','#003C31','#003039','#000C39','#180039','#210039','#390039','#390021');
        elemDiv = document.createElement('div');
        elemHTML = '<div id=ColorTableview style="font-size:9px; border:1px solid black;position:absolute; visibility:hidden; z-Index:10; padding:1; background-color:white;">'

        for( var i = 0; i < 104; i++ ) {
            elemHTML  += '<a href=javascript:void(0) onClick=Main.setColor("'+ colors[i] +'",1)  onMouseOver=Main.setColor("'+colors[i]+'",2)>'
            elemHTML  += '<span style=background-color:'+ colors[i] +';>&nbsp;	&nbsp;</span></a>';
            if( i % 13 == 12 )
                elemHTML += '<br>'
        }
        elemHTML += '</div>';
		elemDiv.innerHTML = elemHTML;
		$('#topDiv').append(elemDiv)
    },

	// toolbarAction
    EditTextColorAction: function (exec, type, value) {
        var doc = DesignArea.document;

		switch (type) {
			case execMode.NORMAL:
				doc.execCommand(exec);
				break;
			case execMode.FONT:
				doc.execCommand(exec, false, value);
				break;
		}
		// if(type != 'k' ) { //backcolor나 forecolor가 아닌 경우...
		// 	type.selectedIndex=0;
		// }

        // if(Where == 'Link') {
        //     var linkURL = prompt('Enter a URL:', 'http://');
        //     var sText = aTemp.getSelection();
        //
        //     aTemp.execCommand('insertHTML', false, '<a href="' + linkURL + '" target="_blank">' + sText + '</a>');
        // }
    },

	EditTableOpen: function(divId, scrollTop, scrollLeft, returnvol) {

		Col_Mode = returnvol;
	    var $obj = $('#' + divId)[0];
		if($obj.opened) {
			$obj.opened = false;
			$obj.style.visibility = 'hidden';
		}
		else {
			$obj.opened = true;
			$obj.style.pixelTop = $(divId).clientY + document.body.scrollTop - parseInt(scrollTop);
			$obj.style.pixelLeft = $(divId).clientX + document.body.scrollLeft + parseInt(scrollLeft);
			$obj.style.visibility = 'visible';
		}
	},

    //Toolbar에서 기호, 링크, 수평선1, 수평선2 삽입
    EditModeTagin: function (readtag,tagsection) {
        	var o=DesAreaDocnt.body;	//iframe의 body
            var hrcolor = '#8888ff';
            var hrwidth = "100%";

		if(tagsection == 2) {
			alert("((((( 하이퍼링크 삽입하기 )))))\n\n\n본문입력된 글자를 마우스로 드래그하여 색상을 반전시킨후, \n" +
	"마우스 우측버튼을 클릭하고 [하이퍼링크 편집] 메뉴를 선택하십시오. ");
		}else if(tagsection == 3) {
			alert("((((( 이미지(그림) 링크삽입하기 )))))\n\n\n본문내 그림이 삽입될 위치에 마우스 우측버튼을 클릭하고,\n" +
	"[이미지삽입] 메뉴를 선택후, 이미지(그림)의 URL을 입력 하십시오. \n\n예) http://abcd.com/image/abcd.gif         ");
		}else if(tagsection == 12) {
			var linkurl = prompt("▥▥ 본문에 삽입할 링크URL을 입력하십시오.                                                         (예, http://abcd.com/abcd/web/abc.html)","http://");
			if(linkurl != "http://" && linkurl) {
				var linkTextin = prompt("▥▥ 링크될 글자(단어)를 입력하십시오. (예, '클릭')","");
				if(linkTextin) {
					// k.value += ("<a href=" + linkurl +">" + linkTextin + "</a>");
					o.innerHTML += ("<a href=" + linkurl +">" + linkTextin + "</a>");
					// o.innerHTML=k.value;
					o.focus();}
				else {
					return;
				}
			}else {
				return;
			}
		}else if(tagsection == 13) {	//Editor mode의 toolbar에서 이미지 삽입 클릭하였을 경우
			var imgurlL = prompt("▥▥ 본문에 삽입할 이미지의 URL을 입력하십시오.                                                          (예, http://abcd.com/img/abcd.gif)","http://");
			if(imgurlL != "http://" && imgurlL) {
				o.innerHTML += ("<img border=0 src=" + imgurlL +">");
				o.focus();
			}
			else {
				return;
			}
		}else if(tagsection == 1) {		//Editor mode의 toolbar에서 수평선1 클릭하였을 경우
			var hrheight = prompt("◎ 수평선의 두께를 지정하거나 [확인] 버튼을 누르십시오.", hrheight);
			if(hrheight) {
				hrcolor = prompt("◎ 수평선의 색상을 지정하거나 [확인] 버튼을 누르십시오.", hrcolor);
			}else {
				return;
			}
			if(hrcolor) {
				o.innerHTML += "<hr size=" + hrheight + "  width=" + hrwidth + "  color=" + hrcolor + ">";
			}
			else {
				return;
			}
			// o.innerHTML=k.value;
			o.focus();
		}else if(tagsection == 4) {		//Editor mode의 toolbar에서 기호삽입 클릭하였을 경우
			// k.value += readtag ;
			o.innerHTML+=readtag;
			o.focus();
			Signtext.opened = false;
			Signtext.style.visibility = 'hidden';
		}else {}
    },

    /* --------------------- Toolbar에서 각종 속성 설정하여 Style값과 내용 변경  --------------------- */

    changeColor: function(ColorValues,Target,RealColor,Repeatcom) {
		// var WriteDoc = document.form1;
		if(Target == 6) {			// 변경한 align, 문서전체글자색, 바탕색, 바탕패턴값들 Reset 시킴
			Main.FormStyleSeting();
		}else if(Target == 36) {	// 글의 align 설정
			StyleFalign = "text-align:"+ColorValues+"; ";
			// WriteDoc.txtalign.value = ColorValues ;
		}else if(Target == 3) {		// font-size와 font-family 변경
			if(ColorValues == 31) {
				StyleFSize = 'font-size:9pt; ';
				StyleFFamily	= "font-family:굴림; ";
			}else {
				StyleFFamily	= "font-family:"+ColorValues+"; ";
				StyleFSize = 'font-size:10pt; ';
			}
		}else if(Target == 1) {			//문서전체 바탕색패턴
			// WriteDoc.color.value = ColorValues;
			StyleBackgr	= "background-image:url('" +ImageDirUrl+"/"+ColorValues+ "'); ";	//배경그림
			if(Repeatcom == 1) {	//배경그림의 연속하지 않음. 중앙에 위치
				StyleBackgr += " background-repeat:no-repeat; background-position:50% 50%; ";
			}
			if(RealColor != 5) {
				Backimgview.opened = false;
				Backimgview.style.visibility = 'hidden';
			}
		}else if(Target == 11) {	//문서전체 바탕색
			// WriteDoc.color.value = ColorValues;
			StyleBackgr		= "background-color:"+ColorValues+"; ";
		}else if(Target == 19) {	//문서 전체 글자색 지정
			// WriteDoc.textcol.value = ColorValues;
			StyleFColor	= "font-color:"+ColorValues+"; ";
			console.log('StyleFColor',StyleFColor)
		}else {
			return ;
		}

		Main.ReStyleView();
	},

    setColor: function(color, action) {
    	switch (Col_Mode) {
			case colorMode.ALL_FONT_COLOR:
				if(action === mouseMode.CLICK) Main.changeColor(color,19);
				else { Main.changeColor(color,19,5); return }
				break;
			case colorMode.ALL_BG_COLOR:
				if(action === mouseMode.CLICK) Main.changeColor(color,11);
				else { Main.changeColor(color,11,5); return }
				break;
			case colorMode.SELECT_FONT_COLOR:
				Main.EditTextColorAction('ForeColor', 'font', color);
				break;
			case colorMode.SELECT_FONT_BG_COLOR:
				Main.EditTextColorAction('BackColor', 'font', color);
				break;
		}

		ColorTableview.opened = false;
		ColorTableview.style.visibility = 'hidden';

	},
    
    FormStyleSeting: function () {
        StyleFFamily = 'font-family:굴림; ';
		StyleFSize = 'font-size:9pt; ';
		StyleFColor = 'color:#000000; ';
		StyleFalign = 'text-align: ;';
		StyleBackgr = "; ";
		StyleBWidth = 'border-width:1; ';
		StyleBColor = 'border-color:#555555; ';
		StyleBColor2 =StyleBColor;
		StyleBStyle = 'border-style:solid; ';
		StylePageColor = "background-color:1; ; ";
		StyleLineHeight = 'line-height:100%;';
    },

    ReStyleView: function() {
		var Atemp = DesAreaDocnt.body.style;
		Atemp.fontSize='9pt';
		Atemp.cssText=StyleFFamily + StyleFSize + StyleFColor + StyleFalign + StyleBackgr + StyleBWidth + StyleBColor + StyleBStyle + StyleLineHeight + ' width:100%; height:100%; margin:1; padding:5;';;
	}
};

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});