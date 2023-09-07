(function() {
    d3.selection.prototype.selectAppend = function(name, classNm) {
        var select = d3.selector(name + (classNm != null? "." + classNm : "")),
            create = d3.creator(name);
        return this.select(function() {
            return select.apply(this, arguments)
                || this.appendChild(create.apply(this, arguments));
        });
    };
    d3.selection.prototype.selectAppendById = function(name, id) {
        var select = d3.selector(name + (id != null? "#" + id : "")),
            create = d3.creator(name);
        return this.select(function() {
            return select.apply(this, arguments)
                || this.appendChild(create.apply(this, arguments));
        });
    };

    d3.selection.prototype.selectInsert = function(name, classNm, before) {
        var select = d3.selector(name + (classNm != null? "." + classNm : "")),
            create = d3.creator(name);
        return this.select(function() {
            return select.apply(this, arguments)
                || this.insertBefore(create.apply(this, arguments), this.lastChild);
        });
    };

    // console.log(d3.selection.prototype.enter);

    d3.selection.prototype.appendHTML =
        d3.selection.prototype.enter.prototype.appendHTML = function(HTMLString) {
            return this.select(function() {
                console.log(document.importNode(new DOMParser().parseFromString(HTMLString, 'text/html').body.childNodes[0], true));
                return this.appendChild(document.importNode(new DOMParser().parseFromString(HTMLString, 'text/html').body.childNodes[0], true));
            });
        };

    d3.selection.prototype.appendSVG =
        d3.selection.prototype.enter.prototype.appendSVG = function(SVGString) {
            return this.select(function() {
                return this.appendChild(document.importNode(new DOMParser()
                    .parseFromString('<svg xmlns="http://www.w3.org/2000/svg">' + SVGString +
                        '</svg>', 'application/xml').documentElement.firstChild, true));
            });
        };
})(d3.selection);