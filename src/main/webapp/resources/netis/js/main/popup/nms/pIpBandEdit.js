var orgData;
var prefixList;
var PMain = {
    /** variable */
    initVariable: function() {

    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { PMain.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnSave':
                PMain.save();
                break;
            case 'btnClose':
                PMain.close();
                break;
        }
    },

    /** init design */
    initDesign: function() {
        prefixList = [
            { label: 24, value: 254 }, { label: 25, value: 126 }, { label: 26, value: 62 },
            { label: 27, value: 30 }, { label: 28, value: 14 }, { label: 29, value: 6 }, { label: 30, value: 2 }
        ];
        HmDropDownList.create($('#p_prefix'), { source: prefixList, displayMember: 'label', valueMember: 'value', selectedIndex: 0});
    },

    /** init data */
    initData: function() {
        Server.get('/main/nms/ipBandMgmt/getIpBandList.do', {
            data: { seqNo : $('#seqNo').val() },
            success: function (result) {
                var data = result[0];

                $('#p_sortation').val(data.sortation);
                $('#p_company').val(data.company);
                $('#p_ipAddress').val(data.ipAddress);
                $('#p_startIp').val(data.startIp);
                $('#p_user').val(data.user);
                $('#p_userNo').val(data.userNo);
                $('#p_memo').val(data.memo);

                orgData = data;

                PMain.setPrefix(data.prefix);
            }
        })
    },

    setPrefix: function (prefix) {
        $.each(prefixList, function (idx, item) {
            if(item.label == prefix) {
                $("#p_prefix").jqxDropDownList('selectIndex', idx);
                return false;
            }
        });
    },

    save: function () {
        if(!this.validation()) return;

        var params = $('#pForm').serializeObject();
        params.seqNo = $('#seqNo').val();
        params.pSeqNo = $('#seqNo').val();
        params.ipAdd = this.getIpAdd();
        params.list = this.getIpBandDetailList();
        params.isIpChange = this.checkChangeIp();

        var listItem = $("#p_prefix").jqxDropDownList('getSelectedItem');
        params.prefix = listItem.label;
        params.ipRelevant = listItem.value;

        console.log('params',params)

        Server.post('/main/nms/ipBandMgmt/editIpBand.do', {
            data: params,
            success: function (result) {
                alert(result);
                PMain.close();

                Main.search();
            }
        })
    },

    getIpBandDetailList: function () {
        var list = [];
        var size = $('#p_prefix').val() * 1;
        var ipLast = $('#p_startIp').val().split('.')[3] * 1;

        for(var i = ipLast; i < size + ipLast; i++) {
            console.log('for i', i)
            var pushData = {};

            pushData.subnetMask = this.getSubnetMask();
            pushData.realIp = $('#p_ipAddress').val() + '.' + i;

            list.push(pushData);
        }

        return list;
    },

    validation: function () {

        var obj = $('#p_sortation');
        if($.isBlank(obj.val())) {
            alert('구분을 입력해주세요.');
            return false;
        }

        obj = $('#p_company');
        if($.isBlank(obj.val())) {
            alert('IP 대역명을 입력해주세요.');
            return false;
        }

        obj =  $('#p_ipAddress');
        if($.isBlank(obj.val())) {
            alert('IP 대역을 입력해주세요.');
            return false;
        }

        if(!$.validateIp(obj.val() + '.0')) {
            alert('IP 대역 형식이 유효하지 않습니다.');
            return false;
        }

        obj = $('#p_startIp');
        if($.isBlank(obj.val())) {
            alert('시작 IP를 입력해주세요.');
            return false;
        }

        if(!$.validateIp(obj.val())) {
            alert('시작 IP 형식이 유효하지 않습니다.');
            return false;
        }

        if(!this.checkIpAddrMatchStartIp()) {
            alert('시작 IP 의 IP 대역을 확인해주세요.');
            return false;
        }

        if(!this.checkIpRange()) {
            alert('생성하려는 IP 범위가 유효하지 않습니다.');
            return false;
        }

        if(this.checkChangeIp()) {
            return confirm(
                'IP 대역 정보 수정 시, 기존 IP 대역으로 생성된 IP 목록이 삭제 후 재생성 됩니다. ' +
                '수정하시겠습니까?'
            );
        }

        return true;
    },

    getIpAdd : function () {
        var ip = $('#p_ipAddress').val();
        var splitIp = ip.split('.');

        var classA = this.formatIpStr(splitIp[0]);
        var classB = this.formatIpStr(splitIp[1]);
        var classC = this.formatIpStr(splitIp[2]);

        return classA + classB + classC;
    },

    formatIpStr: function (splitIp) {
        var str = '';
        if(splitIp.length === 1) { str = '00' + splitIp }
        if(splitIp.length === 2) { str = '0' + splitIp }
        if(splitIp.length === 3) { str = splitIp }

        return str;
    },

    getSubnetMask: function () {
        var prefix = $("#p_prefix").jqxDropDownList('getSelectedItem').label;
        var ip = $('#p_startIp').val();
        var splitIp = ip.split('.');

        var ipBin={};
        ipBin[1]=String("00000000"+parseInt(splitIp[0],10).toString(2)).slice(-8);
        ipBin[2]=String("00000000"+parseInt(splitIp[1],10).toString(2)).slice(-8);
        ipBin[3]=String("00000000"+parseInt(splitIp[2],10).toString(2)).slice(-8);
        ipBin[4]=String("00000000"+parseInt(splitIp[3],10).toString(2)).slice(-8);

        var mask=prefix;
        var importantBlock = Math.ceil(mask / 8);
        var importantBlockBinary = ipBin[importantBlock];
        var maskBinaryBlockCount = mask % 8;
        if(maskBinaryBlockCount == 0)importantBlock++;
        var maskBinaryBlock="";
        var maskBlock;

        for(var i = 1; i<= 8; i++) {
            if (maskBinaryBlockCount >= i) {
                maskBinaryBlock += "1";
            } else {
                maskBinaryBlock += "0";
            }
        }

        maskBlock = parseInt(maskBinaryBlock, 2);

        var netBlockBinary="";
        var bcBlockBinary="";
        for(var i = 1; i <= 8; i++){
          if(maskBinaryBlock.substr(i-1, 1) == "1"){
              netBlockBinary+=importantBlockBinary.substr(i-1,1);
              bcBlockBinary+=importantBlockBinary.substr(i-1,1);
          } else {
              netBlockBinary += "0";
              bcBlockBinary += "1";
          }
        }

        var subnetMask = "";
        for(var i = 1;i <= 4; i++){
          if(importantBlock > i) { subnetMask += "255"; }
          else if (importantBlock == i) { subnetMask += maskBlock; }
          else { subnetMask += 0; }

          if(i < 4){ subnetMask += "."; }
        }

        return subnetMask;
    },

    checkIpRange: function () {
        var prefixVal = $('#p_prefix').val();
        var startIp = $('#p_startIp').val();
        var splitIp = startIp.split('.');

        var lastIp = parseInt(splitIp[3]);
        var prefixInt = parseInt(prefixVal);

        return (lastIp + prefixInt - 1 <= 255);
    },

    checkChangeIp: function () {
        var newData = $('#pForm').serializeObject();
        newData.prefix = $("#p_prefix").jqxDropDownList('getSelectedItem').label;

        return!(newData.prefix == orgData.prefix && newData.ipAddress === orgData.ipAddress && newData.startIp === orgData.startIp)

    },

    checkIpAddrMatchStartIp: function() {
        var ipAddress = $('#p_ipAddress').val();
        var startIp = $('#p_startIp').val();

        var isMatch = startIp.indexOf(ipAddress);

        return isMatch !== -1;
    },

    close: function () {
        $('#pwindow').jqxWindow('close');
    },

};
$(function() {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});