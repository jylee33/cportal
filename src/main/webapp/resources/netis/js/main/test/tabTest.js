var $eventTabs;
var frames;
function initVariable() {
    $eventTabs = $('#testTabs')
}

function initDesign() {
    $eventTabs.jqxTabs({ width: '100%', height: '100%', showCloseButtons: true });
    $eventTabs.jqxTabs('removeAt', 0); //최초 생성된 것 제거

    $eventTabs.on('selected', function (event) {
        frames = $('.tabFrame');

        var idx = event.args.item;
        var menuNo = $(frames[frames.length - idx - 1]).attr('data-menu');

        setMeunHistory(menuNo)
        var scrollable = $eventTabs.jqxTabs('scrollable');
        console.log('zz',scrollable)
    });

}

function addTab(url, menuNo) {

    var menuNm = '';
    $('#mega-menu li.level-3 a').each(function () {
        var clickMenuNo = menuNo
        var menuNoList = $(this).attr('data-menuNo');
        if(clickMenuNo == menuNoList){
            menuNm = $(this).text();
        }
    });

    setMeunHistory(menuNo);

    frames = $('.tabFrame');

    // if(frames.length >= 10) {
    //     alert('탭은 최대 10개까지 가능합니다.\n기존 탭 삭제 후, 진행해주세요.');
    //     return;
    // }

    for(var i = 0; i < frames.length; i++) {
        var orgMenuNo = $(frames[i]).attr('data-menu');
        var clickMenuNo = menuNo;
        if(orgMenuNo === clickMenuNo) {
            $eventTabs.jqxTabs('select', frames.length - i - 1);
            return;
        }
    }

    var frame = '<iframe src="'+ url + '"  style="width: 100%; height: 90%" data-menu="'+ menuNo +'" class="tabFrame"></iframe>';
    $eventTabs.jqxTabs('addAt', 0 , menuNm, frame);

}

function setMeunHistory(findMenuNo) {
    $('#mega-menu li.level-3 a').each(function () {
        var clickMenuNo = findMenuNo
        var menuNoList = $(this).attr('data-menuNo');
        if(clickMenuNo == menuNoList){
            var menuNm = $(this).text();

            var pageGrp = $(this).closest('li.level-2').children(':first').text();
            var page = $(this).closest('li.level-1').children(':first').text();

            $('#navPage').text(page);
            $('#navPageGrp').text(pageGrp);
            $('#navPageMenu').text(menuNm);
            $('#navMenuNm').text(menuNm);
        }
    });
}

$(function () {
    initVariable();
    initDesign()
})