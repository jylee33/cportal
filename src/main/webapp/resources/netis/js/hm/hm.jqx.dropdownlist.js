var HmDropDownList = {

		create: function($obj, options) {
			var defOpts = { width: '95%', height: 22, theme: jqxTheme/*,autoDropDownHeight: true*/, placeHolder: '선택하세요',
					enableBrowserBoundsDetection: true };
			$.extend(defOpts, options);

			if(options !== undefined && options.autoDropDownHeight || true) {
				$obj.on('bindingComplete', function(event) {
					var _this = $(this);
					setTimeout(function() {
						var items = _this.jqxDropDownList('getItems');
						if((items == null? 0 : items.length) > 7) {
							_this.jqxDropDownList({autoDropDownHeight: false});
						} else {
							_this.jqxDropDownList({autoDropDownHeight: true});
						}
					}, 100); //delay time 필요!!
				});
			}

			$obj.jqxDropDownList(defOpts);
			return $obj;
		},

		getSourceByUrl: function(url, params, method) {
			if(method !== undefined && method != null && method.toLowerCase() == 'post') {
                return new $.jqx.dataAdapter(
                    {
                        datatype: 'json',
                        type: 'POST',
                        contentType: 'application/json; charset=UTF-8',
                        url: ctxPath + url
                    },
                    {
                        formatData: function(data) {
                            if(params != null) $.extend(data, params);
                            return JSON.stringify(data);
                        }
                    }
                );
			}
			else {
                return new $.jqx.dataAdapter(
                    {
                        datatype: 'json',
                        url: ctxPath + url
                    },
                    {
                        formatData: function(data) {
                            if(params != null) $.extend(data, params);
                            return data;
                        }
                    }
                );
			}
		},

		getSourceByHmResource: function(resourceId) {
			return HmResource[resourceId];
		},

		/**
		 * checkboxes 속성이 true인 경우 체크된 리스트 value값만 추출하여 리턴
		 */
		getCheckedValues: function($obj) {
			var checkedItems = $obj.jqxDropDownList('getCheckedItems');
			var result = [];
			$.each(checkedItems, function(idx, item) {
				result.push(item.value);
			});
			return result;
		},

		isBindingCompleted($obj) {
			var items = $obj.jqxDropDownList('getItems');
			if(items == null || items.length == 0) {
				return false;
			}
			else {
				return true;
			}
		}

};
