/**
 * ElasticSearch
 * @type {{client: null, getClient: HmES.getClient, createClient: HmES.createClient, ping: HmES.ping, search: HmES.search}}
 */



var HmES = function() {
    this.client = null;
    this.protocol = ($('#gEsSslYn').val() || 'N') == 'Y'? 'https' : 'http';
    this.host = '{0}:{1}'.substitute($('#gEsIp').val(), $('#gEsPort').val());
}

HmES.prototype = function() {

    var getClient = function() {
        alert(this.protocol);
        if(this.client == null) {
            this.client =
                new elasticsearch.Client({
                    protocol: this.protocol,
                    host: this.host,
                    log: 'debug'
                });
        }
        console.log(this.client);
        return this.client;
    }

    var ping = function() {
        this.client.ping({
                requestTimeout: 30000
            },
            function (err, resp, status) {
                console.log(status);
            }
        );
    }

    /**
     * 검색
     * @param param
     *      indexName   검색index
     *      body        검색 필터
     *      callbackFn  콜백함수
     */
    var search = function(param) {
        this.client.search({
            index: param.indexName,
            scroll: '60s',
            _source: param.source,
            body: param.body
        }, param.callbackFn);
    }

    return {
        getClient: getClient,
        ping: ping,
        search: search
    }

}();
