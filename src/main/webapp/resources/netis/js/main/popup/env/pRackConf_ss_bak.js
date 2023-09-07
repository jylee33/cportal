var $slotBox;
var _dragOriginalItem = null;
var _childPopup;
var _dragInfo, _dragFail=false;

var PMain = {
    /** variable */
    initVariable: function () {
        $slotBox = $('#slotBox');
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            PMain.eventControl(event);
        });
        $(window).on('beforeunload', function(){
            try {
                if(_childPopup !== undefined)
                    _childPopup.close();
            } catch(e) {}
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'pbtnAdd':
                this.addSlot();
                break;
            case 'pbtnDel':
                this.delSlot();
                break;
            case 'pbtnSave':
                this.save();
                break;
            case 'pbtnClose':
                self.close();
                break;
        }
    },

    /** init design */
    initDesign: function () {
        // for(var i = 1; i <= parseInt($('#p_rackU').val()); i++) {
        // $('#slotInfoBox').append('<div id="slotInfo' + i + '" style="height:
        // 21px;"></div>');
        // }

        if ($('#pMode').val() == 'view')
            $('#pbtnAdd, #pbtnSave, #pbtnDel').css('display', 'none');

        // $('#p_rackType').jqxDropDownList(
        //     {
        //         width: '95%',
        //         height: 21,
        //         source: [
        //             {label: '서버 Rack', value: '서버 Rack'},
        //             {label: '통신 Rack', value: '통신 Rack'}
        //             ],
        //         autoDropDownHeight: true,
        //         displayMember: 'label',
        //         valueMember: 'value',
        //         theme: jqxTheme,
        //         selectedIndex: 0
        //     }
        // );

        $slotBox.jqxListBox(
            {
                allowDrop: true,
                allowDrag: true,
                width: 220,
                autoHeight: true,
                displayMember: 'imgName',
                valueMember: 'slotNo',
                source: new $.jqx.dataAdapter({
                    datatype: 'json',
                    url: ctxPath + '/main/env/rackConf/getRackSlotListAll.do'
                }, {
                    formatData: function (data) {
                        $.extend(data, {grpNo: $('#pGrpNo').val(), rackNo: $('#pRackNo').val()});
                        return data;
                    },
                    loadComplete: function(records) {
                        console.log(records);
                    }
                }),
                dragEnd: function (dragItem, dropItem) {
                    _dragOriginalItem = dragItem.originalItem;
                    return true;
                    // _dragFail = false;
                    // if(dragItem == null || dropItem == null ||
                    //     dragItem.hasOwnProperty("originalItem") == false ||
                    //     dropItem.hasOwnProperty("originalItem") == false ||
                    //     dragItem.originalItem == null || dragItem.originalItem == null
                    // ) {
                    //     _dragFail = true;
                    //     _dragInfo = {
                    //         dragItem: dragItem
                    //     };
                    //     return true;
                    // }
                    //
                    // if(dragItem == dropItem) return false;
                    // try {
                    //     var _dragSlotU = dragItem.originalItem.mngNo == 0? 1 : dragItem.originalItem.slotU,
                    //         _dropSlotU = dropItem.originalItem.mngNo == 0? 1 : dropItem.originalItem.slotU;
                    //     _dragInfo = {
                    //         dragItem: dragItem,
                    //         dropItem: dropItem,
                    //         dragIndex: dragItem.index,
                    //         dropIndex: dropItem.index,
                    //         dragSlotU: dragItem.originalItem.slotU,
                    //         dropSlotU: dropItem.originalItem.slotU,
                    //         gapUnit: _dragSlotU - _dropSlotU
                    //     };
                    // } catch(e) {
                    //     return false;
                    // }
                    //
                    // if (_dragInfo.gapUnit == 0) { //equals
                    //     return true;
                    // }
                    // else { // not equals
                    //     var _flag = true;
                    //     if (_dragInfo.gapUnit < 0) { //drag < drop
                    //         var sIdx = dragItem.index, _chkSlotU = 0, totIdx = $slotBox.jqxListBox('getItems').length-1;
                    //         while(true) {
                    //             var _slot = $slotBox.jqxListBox('getItem', sIdx);
                    //             if (_slot.originalItem.mngNo != 0 && _slot.key != dragItem.key && _slot.originalItem.key != dropItem.key) { // not shelf
                    //                 _flag = false;
                    //                 break;
                    //             }
                    //             else {
                    //                 _chkSlotU += _slot.originalItem.slotU;
                    //                 // alert(_chkSlotU);
                    //                 if(_chkSlotU >= _dragInfo.dropSlotU) break;
                    //             }
                    //             sIdx++;
                    //             if(sIdx > totIdx) {
                    //                 _flag = false;
                    //                 break;
                    //             }
                    //         }
                    //     }
                    //     else { //drag > drop
                    //         var sIdx = dropItem.index, _chkSlotU = 0, totIdx = $slotBox.jqxListBox('getItems').length-1;
                    //         while(true) {
                    //             var _slot = $slotBox.jqxListBox('getItem', sIdx);
                    //             if (_slot.originalItem.mngNo != 0 && _slot.key != dragItem.key && _slot.originalItem.key != dropItem.key) { // not shelf
                    //                 _flag = false;
                    //                 break;
                    //             }
                    //             else {
                    //                 _chkSlotU += _slot.originalItem.slotU;
                    //                 // alert(_chkSlotU);
                    //                 if(_chkSlotU >= _dragInfo.dragSlotU) break;
                    //             }
                    //             sIdx++;
                    //             if(sIdx > totIdx) {
                    //                 _flag = false;
                    //                 break;
                    //             }
                    //         }
                    //     }
                    //
                    //     if (!_flag) {
                    //         alert("이동할 수 없습니다.");
                    //         return false;
                    //     }
                    //
                    //     if(_dragInfo.gapUnit < 0) {
                    //     }
                    // }
                },
                renderer: function (index, label, value) {
                    var unit = parseInt(label.split('_')[1]);
                	var height = Math.ceil((unit * 18.5)); //Chrome 브라우저에서 Rendering  문제로 이미지가 틀어지는 현상 발생하여 높이값 강제 셋팅
                    return '<img src="' + ctxPath + '/img/rack/' + label + '.png" width="100%" height="' + height + 'px" />';
                }
            }).on('dragEnd', function (event) { // drag한 아이템에 대해서
                // originalItem값을
                // 보장하지 않음. drag후에
                // null값이 되어버려 강제셋팅!
                var tmp = $slotBox.jqxListBox('getSelectedItem');
                if (tmp !== null)
                    tmp.originalItem = _dragOriginalItem;
                // /**
                // * slot간 교체이동
                // *   동일 slotU이 아닌경우...
                // */
                // if(_dragFail) {
                //     var tmp = $slotBox.jqxListBox('getSelectedItem');
                //     if (tmp !== null)
                //         tmp.originalItem = _dragInfo.dragItem.originalItem;
                //
                //     return;
                // }
                // console.log(_dragInfo);
                // if(_dragInfo.gapUnit != 0) {
                //     // 위 -> 아래로 이동시(drag)
                //     if(_dragInfo.dragIndex < _dragInfo.dropIndex) {
                //         // dropItem
                //         // 교체 완료 후 dropItem을 삭제한 후 dragItem 위치에 다시 insert하고 originalItem(null값이 되어버림)값을 넣어준다.
                //         $slotBox.jqxListBox('removeItem', _dragInfo.dropItem);
                //         $slotBox.jqxListBox('insertAt', _dragInfo.dropItem, _dragInfo.dragIndex);
                //         var tmp = $slotBox.jqxListBox("getItem", _dragInfo.dragIndex);
                //         tmp.originalItem = _dragInfo.dropItem.originalItem;
                //         // console.log(tmp.originalItem);
                //
                //         //drag slotU > drop slotU -> gap만큼 아래로 이동
                //         if(_dragInfo.dragSlotU > _dragInfo.dropSlotU) {
                //             var newIdx = _dragInfo.dropIndex + Math.abs(_dragInfo.gapUnit);
                //             $slotBox.jqxListBox('removeItem', _dragInfo.dragItem);
                //             $slotBox.jqxListBox('insertAt', _dragInfo.dragItem, newIdx);
                //             var tmp = $slotBox.jqxListBox("getItem", newIdx);
                //             tmp.originalItem = _dragInfo.dragItem.originalItem;
                //
                //             //drag사이의 slot을 뒤에서 부터 index변경
                //             for(var j = newIdx-1; j >= _dragInfo.dragIndex+1; j--) {
                //                 var findSlot = $slotBox.jqxListBox('getItem', j);
                //                 if(findSlot.originalItem.mngNo != 0) {
                //                     var findNewIdx = findSlot.index + Math.abs(_dragInfo.gapUnit);
                //                     console.log(findNewIdx + " / " + findSlot.index + " / " + _dragInfo.gapUnit);
                //                     console.log(findSlot);
                //                     $slotBox.jqxListBox('removeItem', findSlot);
                //                     $slotBox.jqxListBox('insertAt', findSlot, findNewIdx);
                //                     var findTmp = $slotBox.jqxListBox("getItem", findNewIdx);
                //                     findTmp.originalItem = findSlot.originalItem;
                //                 }
                //             }
                //         }
                //         // drag slotU < drop slotU -> gap만큼 위로 이동
                //         else {
                //             var newIdx = _dragInfo.dropIndex - Math.abs(_dragInfo.gapUnit);
                //             $slotBox.jqxListBox('removeItem', _dragInfo.dragItem);
                //             $slotBox.jqxListBox('insertAt', _dragInfo.dragItem, newIdx);
                //             var tmp = $slotBox.jqxListBox("getItem", newIdx);
                //             tmp.originalItem = _dragInfo.dragItem.originalItem;
                //
                //             for(var j = _dragInfo.dragIndex+1; j < newIdx; j++) {
                //                 var findSlot = $slotBox.jqxListBox('getItem', j);
                //                 if(findSlot.originalItem.mngNo != 0) {
                //                     var findNewIdx = findSlot.index - Math.abs(_dragInfo.gapUnit);
                //                     $slotBox.jqxListBox('removeItem', findSlot);
                //                     $slotBox.jqxListBox('insertAt', findSlot, findNewIdx);
                //                     var findTmp = $slotBox.jqxListBox("getItem", findNewIdx);
                //                     findTmp.originalItem = findSlot.originalItem;
                //                 }
                //             }
                //         }
                //     }
                //     // 아래 -> 위로 이동시
                //     else {
                //         // drag slotU > drop slotU -> gap만큼 위로 이동
                //         if(_dragInfo.dragSlotU > _dragInfo.dropSlotU) {
                //             var newIdx = _dragInfo.dragIndex - Math.abs(_dragInfo.gapUnit);
                //             $slotBox.jqxListBox('removeItem', _dragInfo.dropItem);
                //             $slotBox.jqxListBox('insertAt', _dragInfo.dropItem, newIdx);
                //             var tmp = $slotBox.jqxListBox("getItem", newIdx);
                //             tmp.originalItem = _dragInfo.dropItem.originalItem;
                //
                //             // drag사이의 slot을 앞에서부터 index 변경
                //             for(j = _dragInfo.dropIndex+1; j < newIdx; j++) {
                //                 var findSlot = $slotBox.jqxListBox('getItem', j);
                //                 if(findSlot.originalItem.mngNo != 0) {
                //                     var findNewIdx = findSlot.index - Math.abs(_dragInfo.gapUnit);
                //                     $slotBox.jqxListBox('removeItem', findSlot);
                //                     $slotBox.jqxListBox('insertAt', findSlot, findNewIdx);
                //                     var findTmp = $slotBox.jqxListBox("getItem", findNewIdx);
                //                     findTmp.originalItem = findSlot.originalItem;
                //                 }
                //             }
                //         }
                //         // drag slotU < drop slotU -> gap만큼 아래로 이동
                //         else {
                //             var newIdx = _dragInfo.dragIndex + Math.abs(_dragInfo.gapUnit);
                //             $slotBox.jqxListBox('removeItem', _dragInfo.dropItem);
                //             $slotBox.jqxListBox('insertAt', _dragInfo.dropItem, newIdx);
                //             var tmp = $slotBox.jqxListBox("getItem", newIdx);
                //             tmp.originalItem = _dragInfo.dropItem.originalItem;
                //
                //             for(var j = newIdx-1; j > _dragInfo.dropIndex; j--) {
                //                 var findSlot = $slotBox.jqxListBox('getItem', j);
                //                 if(findSlot.originalItem.mngNo != 0) {
                //                     var findNewIdx = findSlot.index + Math.abs(_dragInfo.gapUnit);
                //                     $slotBox.jqxListBox('removeItem', findSlot);
                //                     $slotBox.jqxListBox('insertAt', findSlot, findNewIdx);
                //                     var findTmp = $slotBox.jqxListBox("getItem", findNewIdx);
                //                     findTmp.originalItem = findSlot.originalItem;
                //                 }
                //             }
                //         }
                //
                //         $slotBox.jqxListBox('removeItem', _dragInfo.dragItem);
                //         $slotBox.jqxListBox('insertAt', _dragInfo.dragItem, _dragInfo.dropIndex);
                //         tmp = $slotBox.jqxListBox("getItem", _dragInfo.dropIndex);
                //         tmp.originalItem = _dragInfo.dragItem.originalItem;
                //     }
                // }
                // // 동일 slotU간 교체이동
                // else { //gapUnit == 0
                //     console.log($slotBox.jqxListBox('getItems'));
                //
                //
                //     // 위 -> 아래로 이동시(drag)
                //     if(_dragInfo.dragIndex < _dragInfo.dropIndex) {
                //         $slotBox.jqxListBox('removeItem', _dragInfo.dropItem);
                //         $slotBox.jqxListBox('insertAt', _dragInfo.dropItem, _dragInfo.dragIndex);
                //         var dropTmp = $slotBox.jqxListBox("getItem", _dragInfo.dragIndex);
                //         dropTmp.originalItem = _dragInfo.dropItem.originalItem;
                //
                //         $slotBox.jqxListBox('removeItem', _dragInfo.dragItem);
                //         $slotBox.jqxListBox('insertAt', _dragInfo.dragItem, _dragInfo.dropIndex);
                //         var dragTmp = $slotBox.jqxListBox("getItem", _dragInfo.dropIndex);
                //         dragTmp.originalItem = _dragInfo.dragItem.originalItem;
                //     }
                //     // 아래 -> 위로 이동시
                //     else {
                //         $slotBox.jqxListBox('removeItem', _dragInfo.dragItem);
                //         $slotBox.jqxListBox('insertAt', _dragInfo.dragItem, _dragInfo.dropIndex);
                //         var dragTmp = $slotBox.jqxListBox("getItem", _dragInfo.dropIndex);
                //         dragTmp.originalItem = _dragInfo.dragItem.originalItem;
                //
                //         $slotBox.jqxListBox('removeItem', _dragInfo.dropItem);
                //         $slotBox.jqxListBox('insertAt', _dragInfo.dropItem, _dragInfo.dragIndex);
                //         var dropTmp = $slotBox.jqxListBox("getItem", _dragInfo.dragIndex);
                //         dropTmp.originalItem = _dragInfo.dropItem.originalItem;
                //     }
                // }
            })
            // .on('focusin', function(event) {
            //     // alert('focus : ' + $(document.body).scrollTop());
            //     event.stopImmediatePropagation();
            //     $slotBox.focusout();
            //     // var _top = $(document.body).scrollTop();
            //     // setTimeout(function() {
            //     //     $(document.body).focus().scrollTop(_top);
            //     // }, 10);
            //     return false;
            // })
            .on('change', function (event) {
                var itemData = event.args.item.originalItem;
                // $(document.body).focus().scrollTop($(document.body).scrollTop());

                if (itemData == null) {
                    $('#slotU, #slotName, #slotIp, #devKindStr, #imgName').val('');

                } else {
                    var devKindStr = null;
                    switch (itemData.devKind1) {
                        case 'DEV':
                            devKindStr = '장비';
                            break;
                        case 'SVR':
                            devKindStr = '서버';
                            break;
                        case 'DEV_ETC':
                            devKindStr = '기타장비';
                            break;
                        default:
                            devKindStr = itemData.devKind1;
                            break;
                    }
                    var index = $slotBox.jqxListBox('getSelectedIndex');
                    var items = $slotBox.jqxListBox('getItems');
                    var upindex = 0;
                    items.forEach(function (val, idx) {
                        if (idx < index && val.originalItem !== null)
                        {
                            upindex += val.originalItem.slotU;
                        }
                    });
                    itemData.descSlotNo = $('#p_rackU').val() - upindex;
                    $('#slotU').val(itemData.descSlotNo + ' (' + itemData.slotU + "U)");
                    $('#slotName').val(itemData.slotName);
                    $('#slotIp').val(itemData.slotIp);
                    $('#devTypeStr').val(devKindStr);
                    $('#devKindStr').val(itemData.devKind2);
                    $('#imgName').val(itemData.imgName);
                }
            });
//        .on('bindingComplete', function(event) {
//        	setTimeout($(this).resize(), 1000);
//		});


        $('#p_btnDetailIcon').click(function (event) {
            var item = $slotBox.jqxListBox('getSelectedItem').originalItem;
            var mngNo = item.mngNo;

            if (item.devKind1 === 'SVR') {
                HmUtil.createPopup('/main/popup/sms/pServerDetailInfo.do', $('#hForm'), 'pServerAlarm', 1400, 700, {mngNo: mngNo});
            } else {
                HmUtil.createPopup('/main/popup/nms/pDevDetail.do', $('#hForm'), 'pDevDetail', 1400, 700, {mngNo: mngNo});
            }
        });

        // png가 제대로 보이지 않아 로딩후 다시 한번 갱신
        // setTimeout(function() {
        // 	$slotBox.jqxListBox('endUpdate');
        // }, 500);
    },

    /** init data */
    initData: function () {

    },

    addSlot: function () {
        var _mngNos = [];
        var items = $slotBox.jqxListBox('getItems');
        if(items != null && items.length > 0) {
            $.each(items, function(idx, item) {
               if(item.originalItem != null && item.originalItem.mngNo != 0) {
                   _mngNos.push(item.originalItem.mngNo);
               }
            });
        }

        _childPopup = HmUtil.createPopup('/main/popup/env/pRackSlotAdd.do', $('#hForm'), 'pRackSlotAdd', 900, 650, {rackNo: $('#pRackNo').val(), mngNos: _mngNos} );
    },

    delSlot: function () {
        var item = $slotBox.jqxListBox('getSelectedItem');
        if (item === null) {
            alert('삭제할 Slot을 선택해주세요.');
            return;
        }
        if (item.label == 'Obj_1UShelf')
            return;
        var itemData = item.originalItem;
        var slotU = itemData.slotU;
        var slotIdx = item.index;
        $slotBox.jqxListBox('removeItem', item);
        for (var i = 1; i <= slotU; i++) {
            var newItem = {
                label: 'Obj_1UShelf',
                value: -1,
                originalItem: {seqNo: -1, slotU: 1, slotNo: slotIdx + i - 1}
            };
            $slotBox.jqxListBox('insertAt', newItem, slotIdx + i - 1);
        }
    },

    save: function () {
        var _list = $slotBox.jqxListBox('getItems');
        var _saveData = [];
        var _curSlotNo = 0;
        /**
         * slotU와 index를 사용하여 slotNo를 부여..
         */
        $.each(_list, function (idx, value) {
            _curSlotNo++;
            if (value.label == 'Obj_1UShelf')
                return;
            var itemData = value.originalItem;
            if (itemData == null)
                return;
            itemData.slotNo = _curSlotNo;
            if (itemData.slotU > 1) {
                _curSlotNo += itemData.slotU - 1;
            }
            
            _saveData.push(itemData);
        });

        Server.post('/main/env/rackConf/saveRackSlotConf.do', {
            data: {rackNo: $('#pRackNo').val(), slotList: _saveData}, success: function (result) {
                opener.Main.searchRack();
                alert(result);
            }
        });
    }

};

// 추가된 Slot을 Rack에 실장
function addSlotToRack(newItem) {
    var _list = $slotBox.jqxListBox('getItems');
    var _tmpSlot = [];
    var _overlap = false;
    var _msg, _delFlag = true;
    for (var i = 0; i < _list.length; i++) {
        // 장비 중복인지 확인
    	if(_list[i].originalItem == null) continue;
        if (_list[i].originalItem.mngNo == newItem.mngNo) {
            _msg = '이미 등록된 장비입니다.';
            _overlap = true;
            break;
        } else {
            if (_list[i].label == 'Obj_1UShelf') {
                _tmpSlot.push(i);
            }
        }
    }

    if (_overlap)
        return [_delFlag, _msg];

    // slotU 체크
    if (newItem.slotU <= _tmpSlot.length) {
        var editItem = $slotBox.jqxListBox('getItem', _tmpSlot[0]);
        editItem.originalItem.slotName = newItem.slotName;
        editItem.originalItem.slotIp = newItem.slotIp;
        editItem.originalItem.mngNo = newItem.mngNo;
        editItem.originalItem.devKind1 = newItem.devKind1;
        editItem.originalItem.devKind2 = newItem.devKind2;
        editItem.originalItem.slotU = newItem.slotU;

        editItem.originalItem.imgName = newItem.imgName;
        $slotBox.jqxListBox('updateItem', {label: newItem.imgName, value: -1}, editItem);
        if (newItem.slotU > 1) {
            for (var j = newItem.slotU - 1; j > 0; j--) {
                $slotBox.jqxListBox('removeAt', _tmpSlot[j]);
            }
        }
        $slotBox.jqxListBox('invalidate');
        _msg = '추가되었습니다.';
    } else {
        _msg = '빈 슬롯이 부족합니다.';
        _delFlag = false;
    }
    return [_delFlag, _msg];
}

$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});
