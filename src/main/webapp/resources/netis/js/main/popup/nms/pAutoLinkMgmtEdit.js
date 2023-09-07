var $devGrid_pAutoLinkMgmtEdit, $relDevGrid_pAutoLinkMgmtEdit;
var $ifGrid_pAutoLinkMgmtEdit, $relIfGrid_pAutoLinkMgmtEdit;
var selectedRelMngNo='';
var selectMngNo ='';
var orgSeqNo, orgMngNo, orgIfidx,orgRelMngNo, orgRelIfIdx;



var pAutoLinkEdit = {
    /** variable */
    initVariable : function() {
        $devGrid_pAutoLinkMgmtEdit = $('#devGrid_pAutoLinkMgmtEdit');
        $ifGrid_pAutoLinkMgmtEdit = $('#ifGrid_pAutoLinkMgmtEdit');

        $relDevGrid_pAutoLinkMgmtEdit = $('#relDevGrid_pAutoLinkMgmtEdit');
        $relIfGrid_pAutoLinkMgmtEdit = $('#relIfGrid_pAutoLinkMgmtEdit');
    },

    /** add event */
    observe : function() {
        $('#pBtnEdit_pAutoLinkMgmtEdit').click(function(){
            pAutoLinkEdit.editAutoLink();
        });
        $('#pBtnClose_pAutoLinkMgmtEdit').click(function(){
            $('#pwindow').jqxWindow('close');
        });
    },

    /** init design */
    initDesign : function() {
        HmJqxSplitter.create($('#pMainSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '50%',collapsible: false }, { size: '50%' }], 'auto', 620,{showSplitBar: false});
        HmJqxSplitter.create($('#pDevSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', 620,{showSplitBar: false});
        HmJqxSplitter.create($('#pReldevSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', 620,{showSplitBar: false});

        //TODO 상단 그리드
        HmGrid.create($devGrid_pAutoLinkMgmtEdit, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'GET',
                    url: ctxPath + '/main/nms/autoLinkMgmt/getDev10List.do',
                    datafields: [
                        { name: 'mngNo', type: 'number' },
                        { name: 'disDevName', type: 'string' },
                        { name: 'devKind2', type: 'string' },
                        { name: 'devIp', type: 'string' },
                        { name: 'vendor', type: 'string' },
                        { name: 'model', type: 'string' },
                    ]
                }
            ),
            columns:[
                { text : '장비번호', datafield: 'mngNo', hidden: true },
                { text : '장비명', datafield: 'disDevName'},
                { text: '종류',  datafield: 'devKind2', width: 100, cellsalign: 'center'},
                { text: '대표IP',  datafield: 'devIp', width: 100},
                { text: '제조사',  datafield: 'vendor', width: 130 },
                { text: '모델', datafield: 'model', width: 150 },
            ],
        }, CtxMenu.DEV);

        HmGrid.create($relDevGrid_pAutoLinkMgmtEdit, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'GET',
                    url: ctxPath + '/main/nms/autoLinkMgmt/getDev10List.do',
                    datafields: [
                        { name: 'mngNo', type: 'number' },
                        { name: 'disDevName', type: 'string' },
                        { name: 'devKind2', type: 'string' },
                        { name: 'devIp', type: 'string' },
                        { name: 'vendor', type: 'string' },
                        { name: 'model', type: 'string' },
                    ]
                }
            ),
            columns:
                [
                    { text : '장비번호', datafield: 'mngNo', hidden: true },
                    { text : '장비명', datafield: 'disDevName'},
                    { text: '종류',  datafield: 'devKind2', width: 100, cellsalign: 'center'},
                    { text: '대표IP',  datafield: 'devIp', width: 100},
                    { text: '제조사',  datafield: 'vendor', width: 130 },
                    { text: '모델', datafield: 'model', width: 150 },
                ],
        }, CtxMenu.DEV);


        //TODO row클릭시 하단 그리드에 조회 & 선택한 데이터 select
        $devGrid_pAutoLinkMgmtEdit.on('rowselect', function (event){
            var rowData = event.args.row;
            selectMngNo = rowData.mngNo;

            HmGrid.updateBoundData($ifGrid_pAutoLinkMgmtEdit, ctxPath + '/main/nms/autoLinkMgmt/getDev20List.do');

        }).on("bindingcomplete", function (event) {

             var rows = $devGrid_pAutoLinkMgmtEdit.jqxGrid('getrows');
             for(var i=0; i<rows.length; i++){
                if(rows[i].mngNo == orgMngNo){
                    $devGrid_pAutoLinkMgmtEdit.jqxGrid('selectrow', rows[i].visibleindex);
                    break;
                }
            }
        });

        $relDevGrid_pAutoLinkMgmtEdit.on('rowselect', function (event)
        {
            var rowData = event.args.row;
            selectedRelMngNo = rowData.mngNo;

            HmGrid.updateBoundData($relIfGrid_pAutoLinkMgmtEdit, ctxPath + '/main/nms/autoLinkMgmt/getDev20List.do');

        }).on("bindingcomplete", function (event) {

            var rows = $relDevGrid_pAutoLinkMgmtEdit.jqxGrid('getrows');

            for(var i=0; i<rows.length; i++){
                if(rows[i].mngNo == orgRelMngNo){
                    $relDevGrid_pAutoLinkMgmtEdit.jqxGrid('selectrow', rows[i].visibleindex);
                    break;
                }
            }//for end(i)
        });


        //TODO 하단 그리드
        HmGrid.create($ifGrid_pAutoLinkMgmtEdit, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function(data) {
                        data.mngNo = selectMngNo;
                        return data;
                    }
                }
            ),
            columns:
                [
                    {text: '회선번호', datafield: 'ifIdx', width: 50, cellsalign: 'center'},
                    {text : '회선명', datafield : 'disIfName'},
                    {text: '회선정보',  datafield: 'ifDescr', width: 100},
                    {text : '회선IP', datafield : 'ifIp', width : 80 },
                    {text : '대역폭', datafield : 'lineWidth', cellsrenderer: HmGrid.unit1000renderer, width : 80 },
                    {text : '상태', datafield : 'status', width : 80},
                ],
        }, CtxMenu.IF);

        $ifGrid_pAutoLinkMgmtEdit.on("bindingcomplete", function () {
            var rows = $ifGrid_pAutoLinkMgmtEdit.jqxGrid('getrows');
            for(var i=0; i<rows.length; i++){
                if(rows[i].ifIdx == orgIfidx){
                    $ifGrid_pAutoLinkMgmtEdit.jqxGrid('selectrow', rows[i].visibleindex);
                    break;
                }
            }//for end(i)
        });


        HmGrid.create($relIfGrid_pAutoLinkMgmtEdit, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function (data) {
                        data.mngNo = selectedRelMngNo;
                        return data;
                    }
                }
            ),
            columns:
                [
                    {text: '회선번호', datafield: 'ifIdx', width: 50, cellsalign: 'center'},
                    {text : '회선명', datafield : 'disIfName'},
                    {text: '회선정보',  datafield: 'ifDescr', width: 100},
                    {text : '회선IP', datafield : 'ifIp', width : 80 },
                    {text : '대역폭', datafield : 'lineWidth', cellsrenderer: HmGrid.unit1000renderer, width : 80 },
                    {text : '상태', datafield : 'status', width : 80},
                ],
        }, CtxMenu.IF);


        $relIfGrid_pAutoLinkMgmtEdit.on("bindingcomplete", function () {

            var rows = $relIfGrid_pAutoLinkMgmtEdit.jqxGrid('getrows');

            for(var i=0; i<rows.length; i++){
                if(rows[i].ifIdx == orgRelIfIdx){
                    $relIfGrid_pAutoLinkMgmtEdit.jqxGrid('selectrow', rows[i].visibleindex);
                    break;
                }
            }//for end(i)
        });

    }, //initDesign


    /** init data */
    initData: function() {},

    editAutoLink : function() {
        //하단그리드
        var rowData = $ifGrid_pAutoLinkMgmtEdit.jqxGrid('getrowdata', $ifGrid_pAutoLinkMgmtEdit.jqxGrid('getselectedrowindex'));
        var relRowData = $relIfGrid_pAutoLinkMgmtEdit.jqxGrid('getrowdata', $relIfGrid_pAutoLinkMgmtEdit.jqxGrid('getselectedrowindex'));
        //선택된 row의 index를 가져와서 index에 있는 rowdata를 가져온다.

        var editParam = {
            seqNo: orgSeqNo,
            mngNo: rowData.mngNo,
            ifIdx: rowData.ifIdx,
            relMngNo: relRowData.mngNo,
            relIfIdx: relRowData.ifIdx,
            relType: 0
        };

        if (editParam.mngNo == editParam.relMngNo && editParam.ifIdx == editParam.relIfIdx) {
            alert('중복입니다.');
            return;
        }

        if(orgMngNo == editParam.mngNo && orgRelMngNo == editParam.relMngNo
            && orgIfidx == editParam.ifIdx && orgRelIfIdx == editParam.relIfIdx ){
            $('#pwindow').jqxWindow('close');
            return;
        }


        var rows = $autoLinkGrid.jqxGrid('getrows');
        var flag= false;//처리흐름을 제어하기위해 사용하는 변수(boolean)
        $.each(rows, function(idx, value){
        if(value.mngNo == editParam.mngNo && value.ifIdx == editParam.ifIdx
            && value.relMngNo == editParam.relMngNo && value.relIfIdx == editParam.relIfIdx ){
            alert('이미 저장된 데이터 입니다.');
            flag= true;
            return false;
            }
        });


        //TODO 수정하기
        //ajax로 post방식으로 전송, 보내는 데이터는 editParam
        Server.post('/main/nms/autoLinkMgmt/editAutoLinkRelation.do', {
            data: editParam,
            success: function(data) { //작업이 성공적으로 발생했을경우
                alert('수정되었습니다.');
                Main.search();
                $('#pwindow').jqxWindow('close');
            }
        });

        },
 };

//팝업창이 처음열리면 실행이됨, param에 부모창에서 넘겨받은 rowData가 들어온다.
function  pwindow_init(param){
    orgSeqNo = param.seqNo;
    orgMngNo = param.mngNo;
    orgRelMngNo = param.relMngNo;
    orgIfidx = param.ifIdx;
    orgRelIfIdx = param.relIfIdx;

    pAutoLinkEdit.initVariable();
    pAutoLinkEdit.observe();
    pAutoLinkEdit.initDesign();
    pAutoLinkEdit.initData();

}

//pwindow_init이 시작되기 전 먼저 시작되어 주석처리
// $(function() {
//     pAutoLinkEdit.initVariable();
//     pAutoLinkEdit.observe();
//     pAutoLinkEdit.initDesign();
//     pAutoLinkEdit.initData();
// });
