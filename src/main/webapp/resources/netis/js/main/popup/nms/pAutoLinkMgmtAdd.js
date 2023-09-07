var $devGrid_pAutoLinkMgmtAdd, $relDevGrid_pAutoLinkMgmtAdd;
var $ifGrid_pAutoLinkMgmtAdd, $relIfGrid_pAutoLinkMgmtAdd;
var selectedRelMngNo = -1; //사용이유: 상단그리드에서 선택한 데이터를 기준으로 하단그리드에서 데이터를 조회하려고
var selectMngNo = -1;


var pAutoLinkAdd = {
    /** variable */
    initVariable : function() {
        $devGrid_pAutoLinkMgmtAdd = $('#devGrid_pAutoLinkMgmtAdd');
        $ifGrid_pAutoLinkMgmtAdd = $('#ifGrid_pAutoLinkMgmtAdd');

        $relDevGrid_pAutoLinkMgmtAdd = $('#relDevGrid_pAutoLinkMgmtAdd');
        $relIfGrid_pAutoLinkMgmtAdd = $('#relIfGrid_pAutoLinkMgmtAdd');
    },

    /** add event */
    observe : function() { //이벤트 추가, 이벤트 넣어주는것
        $('#pBtnSave_pAutoLinkMgmtAdd').click(function(){
            pAutoLinkAdd.addAutoLink();
        });
        $('#pBtnClose_pAutoLinkMgmtAdd').click(function(){
            $('#pwindow').jqxWindow('close');
        });
    },

    /** init design */
    initDesign : function() {

        HmJqxSplitter.create($('#pMainSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '50%',collapsible: false }, { size: '50%' }], 'auto', 620,{showSplitBar: false});
        HmJqxSplitter.create($('#pDevSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', 620,{showSplitBar: false});
        HmJqxSplitter.create($('#pReldevSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', 620,{showSplitBar: false});

        //좌 장비 그리드
        HmGrid.create($devGrid_pAutoLinkMgmtAdd, {
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

        HmGrid.create($relDevGrid_pAutoLinkMgmtAdd, {
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


        //TODO row클릭시 하단 그리드에 조회
        $devGrid_pAutoLinkMgmtAdd.on('rowselect', function (event)
        {
            var rowData = event.args.row; //선택한 row의  데이더를 가져온다.
            selectMngNo = rowData.mngNo;
            HmGrid.updateBoundData($ifGrid_pAutoLinkMgmtAdd, ctxPath + '/main/nms/autoLinkMgmt/getDev20List.do');
        });


        $relDevGrid_pAutoLinkMgmtAdd.on('rowselect', function (event)
        {
            var rowData = event.args.row;
            selectedRelMngNo = rowData.mngNo;

            HmGrid.updateBoundData($relIfGrid_pAutoLinkMgmtAdd, ctxPath + '/main/nms/autoLinkMgmt/getDev20List.do');
        });


        //회선 그리드
        HmGrid.create($ifGrid_pAutoLinkMgmtAdd, {
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


        HmGrid.create($relIfGrid_pAutoLinkMgmtAdd, {
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

    }, //initDesign


    /** init data */
     initData: function() {},

    addAutoLink : function() {

        //TODO MNGNO 2개, ifIdx 2개 가져오기
        //TODO : mngNo, relmngno, ifIdx, relifIdx

        var rowData = $ifGrid_pAutoLinkMgmtAdd.jqxGrid('getrowdata', $ifGrid_pAutoLinkMgmtAdd.jqxGrid('getselectedrowindex'));//선택된 행의 행인덱스 가져와서 행인덱스의 data를 가져옴
        var relRowData = $relIfGrid_pAutoLinkMgmtAdd.jqxGrid('getrowdata', $relIfGrid_pAutoLinkMgmtAdd.jqxGrid('getselectedrowindex'));

        var params = {
            mngNo: rowData.mngNo,
            ifIdx: rowData.ifIdx,
            relMngNo: relRowData.mngNo,
            relIfIdx: relRowData.ifIdx,
            relType: 0
        }; //rowData의 mngNo,ifIdx를 params에 담는다.

        //좌우 데이터가 같은지 판단
        if (params.mngNo == params.relMngNo && params.ifIdx == params.relIfIdx) {
            alert('중복입니다.');
            return;
        }

        //회선연결 그리드에 이미 저장되어있는지 확인
        var rows = $autoLinkGrid.jqxGrid('getrows'); //AutoLinkMgmt(부모)의 입장에서는 한페이지에 있는것으로 생각되어 사용할수 있는것입니다.
        var flag= false;

        //idx - 배열의 인덱스 또는 객체의 키 의미(key)
        //value - 해당 인덱스나 키가 가진 값을 의미(value)
        // $.each(rows, function(idx, value){
        //     if(value.mngNo == params.mngNo && value.ifIdx == params.ifIdx
        //         && value.relMngNo == params.relMngNo && value.relIfIdx == params.relIfIdx ){
        //         alert('이미 저장된 데이터 입니다.');
        //         flag= true;
        //         return false;//함수를빠져나간다
        //     }
        // });

        // $.each => for문으로 변경(test)
         for(var idx=0; idx < rows.length; idx++) {

             var value= rows[idx];
            if (value.mngNo == params.mngNo && value.ifIdx == params.ifIdx
                && value.relMngNo == params.relMngNo && value.relIfIdx == params.relIfIdx) {
                alert('이미 저장된 데이터 입니다.');
                flag = true;
                break;
            }
        }
         //선택된 값과 $autoLinkGrid에 있는 데이터를 비교한다.

        //
        if(flag) {//왜 쓰이는지 파악하기 - true일때만 들어온다..? if문은 true일때 실행되니깐?
            console.log('find!') //
            return; //flag로 인해 함수를 빠져나간다. saveAutoLink : function()
        }


        Server.post('/main/nms/autoLinkMgmt/addAutoLinkRelation.do', {
        data: params, //뭐하는가? 데이터에 파람을 넣는다. 파람은 선택한것(추가하려고 선택한거..)
        success: function(data) {
            alert('추가되었습니다.');
            Main.search();
            $('#pwindow').jqxWindow('close');

        }
    });
    },
 };

function pwindow_init(_param){
    pAutoLinkAdd.initVariable();
    pAutoLinkAdd.observe();
    pAutoLinkAdd.initDesign();
    pAutoLinkAdd.initData();
}//pwindow_init()
