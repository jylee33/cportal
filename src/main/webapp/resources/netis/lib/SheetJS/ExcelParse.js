/* --------------------------------------------------------
*
* ExcelParse
*
-----------------------------------------------------------*/

var defaultObj = {
    validFileExtensions : [".xlsx", ".xls", "csv"],
    rABS : true, // T : 바이너리, F : 어레이 버퍼
    startRow : 5,
    endRow : 0,
    cellName : [],
    result:[],
    tabNameList: [],
    selectTabItem:'',
    excelChangeEvent: ''
};

var ExcelParse = function($obj){
    this.handleFile = this.handleFile.bind(this);

    for(var key in $obj) if( $obj.hasOwnProperty(key) ) defaultObj[key] = $obj[key];
}//end. ExcelParse

ExcelParse.prototype = (function(){

    return{
        constructor: ExcelParse,

        //
        inherit: function( Parent, Child ){
            Child = function(){
                Parent.call( this );
            }

            try{
                if (!Object.create) {
                    Object.create = (function(){
                        function F(){}
                        return function(o){
                            if (arguments.length != 1) {
                                throw new Error('Object.create implementation only accepts one parameter.');
                            }
                            F.prototype = o;
                            return new F();
                        }
                    })();
                }
                Child.prototype = Object.create( Parent.prototype );
                Child.prototype.constructor = Child;
                //override
                //Child.prototype.build = function(){ alert('hi, I am a Child'); };
                var child = new Child();
                if(child instanceof Parent === true) return child;
                else return new Parent();
            }catch(e){
                throw new Error( "[ inherit Error ] : "+ Parent.name +"객체를 상속받지 못했습니다. "+ Parent.name +" 객체를 '확인'해 주세요." );
            }
        },

        handleFile : function(e, $callback){
            //업로드 될 파일 확장자 검사
            var form = $("form");
            var _this = this;

            if( !this.validate( form ) ) return false;
            defaultObj.excelChangeEvent = e;
            var files = e.target.files;
            var i,f;
            for (i = 0; i != files.length; ++i) {
                f = files[i];
                var reader = new FileReader();
                var name = f.name;

                reader.onload = function(e) {
                    var data = e.target.result;
                    var workbook;

                    if(defaultObj.rABS) {
                        /* if binary string, read with type 'binary' */
                        workbook = XLSX.read(data, {type: 'binary'});
                    } else {
                        /* if array buffer, convert to base64 */
                        var arr = this.fixdata(data);
                        workbook = XLSX.read(btoa(arr), {type: 'base64'});
                    }//end. if

                    /* 워크북 처리 */
                    var htmlTable, csvToFSRS;
                    defaultObj.tabNameList = workbook.SheetNames;

                    workbook.SheetNames.forEach(function(item, index, array) {
                        if(defaultObj.selectTabItem != undefined){
                            //선택된 탭만 가져오도록 PASS 처리
                            if(defaultObj.selectTabItem != item) return false;
                        }

                        // CSV
                        var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[item], {FS:"::",RS:"|", skipHidden:true, blankrows: true} ); // default : ","

                        //var csvToFS = XLSX.utils.sheet_to_csv(workbook.Sheets[item], {FS:"\t"} ); // "Field Separator" delimiter between fields
                        //var csvToFSRS = XLSX.utils.sheet_to_csv(workbook.Sheets[item], {FS:":",RS:"|"} ); // "\n" "Record Separator" delimiter between rows

                        // html
                        //var html = XLSX.utils.sheet_to_html(workbook.Sheets[item]);
                        //var htmlHF = XLSX.utils.sheet_to_html(workbook.Sheets[item], {header:"<html><title='custom'><body><table>", footer:"</table><body></html>"});
                        //var htmlTable = XLSX.utils.sheet_to_html(workbook.Sheets[item], {header:"<table border='1'>", footer:"</table>"});

                        // json
                        var json = ExcelParse.prototype.getCsvToJson(csv);
                        defaultObj.result = json;
                        //formulae
                        //var formulae = XLSX.utils.sheet_to_formulae(workbook.Sheets[item]);

                        //htmlTable = XLSX.utils.sheet_to_html(workbook.Sheets[item], {header:"<table border='1'>", footer:"</table>"});
                        //csvToFSRS = XLSX.utils.sheet_to_csv(workbook.Sheets[item], {FS:":",RS:"|"} ); // "\n" "Record Separator" delimiter between rows
                        //getCsvToJson( csvToFSRS );

                    });//end. forEach
                }; //end onload

                if(defaultObj.rABS) reader.readAsBinaryString(f);
                else reader.readAsArrayBuffer(f);
            }//end. for
        },

        getList : function(){
            return defaultObj.result;
        },

        getTabNameList : function(){
            return defaultObj.tabNameList;
        },

        getExcelChangeEvent: function(){
            return defaultObj.excelChangeEvent;
        },

        setTabName : function(item){
            defaultObj.selectTabItem = item;
        },

        setRowNum : function(startRow, endRow){
            defaultObj.startRow = startRow;
            defaultObj.endRow = endRow;
        },

        getCsvToJson : function( $csv ){
            var startRow = defaultObj.startRow || 4;
            var endRow = defaultObj.endRow;

            var csvSP = $csv.split( "|" );
            var csvRow = [], csvCell = [];
            csvSP.forEach(function(item, index, array){
                //입력한 startRow, endRow 만큼 엑셀파싱
                var patt = new RegExp(":"); // 축약형patt = /:/ 대신...
                var isExistTocken = patt.test( item );

                // console.log(item)

                if( (isExistTocken && ( startRow - 1 ) <= index) && (index < endRow && isExistTocken)  ){
                    csvRow.push( item );
                }
            });


            //참조를 없애기 위한 객체 깊은 복사
            var cellNameList = JSON.parse(JSON.stringify(defaultObj.cellName));

            csvRow.forEach(function(item, index, array){
                var row = item.split("::");
                var obj = {};
                row.forEach(function(item, index, array){
                    if(item.indexOf(":") != -1)// : 이 포함된 문자열은 " " 로 감싸여지는 현상
                    {//: 이 포함된 문자는 처음과 끝 제거
                        item = item.substr(1).slice(0,-1);
                    }
                    item = item.replace('&rarr;','→');

                    obj[ cellNameList[index] ] = item;
                });

                csvCell[index] = obj;
            });

            return csvCell;
        },

        /******************************************************************************************************************
         *
         *    validate
         *
         ******************************************************************************************************************/
        validate: function(oForm){

            var _validFileExtensions = defaultObj.validFileExtensions || [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
            var arrInputs = oForm.find("input");

            for (var i = 0; i < arrInputs.length; i++) {
                var oInput = arrInputs[i];
                if (oInput.type == "file") {
                    var sFileName = oInput.value;
                    if (sFileName.length > 0) {
                        var blnValid = false;
                        for (var j = 0; j < _validFileExtensions.length; j++) {
                            var sCurExtension = _validFileExtensions[j];
                            if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                                blnValid = true;
                                break;
                            }
                        }

                        if (!blnValid) {
                            alert("경고, " + sFileName + " 는 유효하지않은 파일입니다.\n\n업로드는 다음형식을 지원합니다 : " + _validFileExtensions.join(", "));
                            return false;
                        }
                    }
                }
            }

            return true;
        },

        // 어레이 버퍼를 처리한다 ( 오직 readAsArrayBuffer 데이터만 가능하다 )
        fixdata : function(){
            var o = "", l = 0, w = 10240;
            for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
            o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
            return o;
        }

    }
})();
