/**
 * jqxDataAdapter
 * @param type  RequestMethod (GET | POST)
 * @param url   RequestURI
 * @param id    unique key datafield
 * @constructor
 */
var HmDataAdapter = function(type, url, id) {
    this.adapter = null;
    this.type = typeof type === 'undefined'? 'GET' : type;
    this.id = typeof id === 'undefined'? null : id;
    this.url = url;
};

HmDataAdapter.prototype = function() {
    var editRowIds = [];

    var create = function(fnFormatData, fnLoadComplete, fnBeforeLoadComplete) {
        var source, settings;
        if(this.type.toUpperCase().trim() == 'POST') {
            source = {
                datatype: 'json',
                type: 'POST',
                contentType: 'application/json; charset=UTF-8',
                url: this.url,
                id: this.id
            };
            settings = {
                formatData: function(data) {
                    if(typeof fnFormatData === 'function') {
                        data = fnFormatData(data);
                    }
                    // console.log('post', data);
                    return JSON.stringify(data);
                }
            }
        }
        else {
            source = {
                datatype: 'json',
                type: 'GET',
                url: this.url,
                id: this.id
            };
            settings = {
                formatData: function(data) {
                    if(typeof fnFormatData === 'function') {
                        data = fnFormatData(data);
                    }
                    // console.log('get', data);
                    return data;
                }
            }
        }

        // updaterow (변경된 rowid 목록 관리)
        var _this = this;
        source.updaterow = function(rowid, rowdata, commit) {
            if(editRowIds.indexOf(rowid) === -1) {
                editRowIds.push(rowid);
            }
            commit(true);
        };

        // loadComplete
        if(typeof fnLoadComplete === 'function') {
            settings.loadComplete = function(records) {
                fnLoadComplete(records);
                return records;
            }
        }

        // beforeLoadComplete
        if(fnBeforeLoadComplete !== undefined && typeof fnBeforeLoadComplete === 'function') {
            settings.beforeLoadComplete = function(records) {
                fnBeforeLoadComplete(records);
                return records;
            }
        }

        this.adapter = new $.jqx.dataAdapter(source, settings);
        return this;

    };

    var getEditRowIds = function() {
        return editRowIds;
    };

    var clearEditRowIds = function() {
        editRowIds.length = 0;
    };

    var setDataFields = function(datafields) {
        this.adapter.datafields = datafields;
        // console.log(this.adapter);
    };

    return {
        create: create,
        getEditRowIds: getEditRowIds,
        clearEditRowIds: clearEditRowIds,
        setDataFields: setDataFields
    }

}();