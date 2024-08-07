/*
jQWidgets v5.3.0 (2017-Sep)
Copyright (c) 2011-2017 jQWidgets.
License: https://jqwidgets.com/license/
*/

(function (a) {
    a.extend(a.jqx._jqxGrid.prototype, {
        _updatefilterrowui: function (f) {
            var m = this.columns.records.length;
            var e = 0;
            var l = this;
            if (!this.filterrow) {
                return
            }
            for (var i = 0; i < m; i++) {
                var g = this.columns.records[i];
                var c = parseInt(g.width);
                if (c < g.minwidth) {
                    c = g.minwidth
                }
                if (c > g.maxwidth) {
                    c = g.maxwidth
                }
                var k = a(this.filterrow[0].cells[i]);
                k.css("left", e);
                var h = true;
                if (k.width() == c) {
                    h = false
                }
                if (f) {
                    h = true
                }
                k.width(c);
                k[0].left = e;
                if (!(g.hidden && g.hideable)) {
                    e += c
                } else {
                    k.css("display", "none")
                }
                if (!h) {
                    continue
                }
                if (g.createfilterwidget && g.filtertype == "custom") {
                    g.createfilterwidget(g, k)
                } else {
                    if (g.filterable) {
                        var d = function (n, o) {
                            var j = a(o.children()[0]);
                            j.width(c - 10);
                            if (a.jqx.browser.msie) {
                                j.width(c - 16)
                            }
                            j.attr("disabled", n.disabled)
                        };
                        switch (g.filtertype) {
                            case"number":
                            case"input":
                                a(k.children()[0]).width(c);
                                k.find("input").width(c - 30);
                                if (a.jqx.browser.msie) {
                                    k.find("input").width(c - 36)
                                }
                                k.find("input").attr("disabled", l.disabled);
                                a(k.find(".jqx-dropdownlist-state-normal")).jqxDropDownList({
                                    theme: l.theme,
                                    disabled: l.disabled
                                });
                                break;
                            case"date":
                            case"range":
                                if (this.host.jqxDateTimeInput) {
                                    a(k.children()[0]).jqxDateTimeInput({
                                        theme: l.theme,
                                        disabled: l.disabled,
                                        width: c - 10
                                    })
                                } else {
                                    d(this, k)
                                }
                                break;
                            case"textbox":
                            case"default":
                                d(this, k);
                                break;
                            case"list":
                            case"checkedlist":
                                if (this.host.jqxDropDownList) {
                                    a(k.children()[0]).jqxDropDownList({
                                        theme: l.theme,
                                        disabled: l.disabled,
                                        width: c - 10
                                    })
                                } else {
                                    d(this, k)
                                }
                                break;
                            case"bool":
                            case"boolean":
                                if (!this.host.jqxCheckBox) {
                                    d(this, k)
                                } else {
                                    a(k.children()[0]).jqxCheckBox({theme: l.theme, disabled: l.disabled})
                                }
                                break
                        }
                    }
                }
            }
            var b = a(this.filterrow.children()[0]);
            b.width(parseInt(e) + 2);
            b.height(this.filterrowheight)
        }, clearfilterrow: function (d) {
            this._disablefilterrow = true;
            if (!this.columns.records) {
                return
            }
            var m = this.columns.records.length;
            var e = 0;
            for (var i = 0; i < m; i++) {
                var f = this.columns.records[i];
                var l = a(this.filterrow[0].cells[i]);
                if (typeof d == "string") {
                    if (f.displayfield != d) {
                        continue
                    }
                }
                if (f.filterable) {
                    var c = function (o, p) {
                        var j = a(p.children()[0]);
                        j.val("");
                        if (j[0]) {
                            o["_oldWriteText" + j[0].id] = ""
                        }
                    };
                    switch (f.filtertype) {
                        case"number":
                        case"input":
                            l.find("input").val("");
                            if (this.host.jqxDropDownList) {
                                var k = a(a(a(l).children()[0]).children()[1]);
                                k.jqxDropDownList("clearSelection");
                                var g = 0;
                                if (g == 0) {
                                    var b = this._getfiltersbytype(f.filtertype == "number" ? "number" : "string");
                                    var n = new a.jqx.filter();
                                    var h = n.getoperatorsbyfiltertype(f.filtertype == "number" ? "numberfilter" : "stringfilter");
                                    if (f.filtercondition != null) {
                                        g = h.indexOf(f.filtercondition.toUpperCase());
                                        if (g == -1) {
                                            g = f.filtertype == "number" ? 0 : 2
                                        }
                                    } else {
                                        g = f.filtertype == "number" ? 0 : 2
                                    }
                                }
                                k.jqxDropDownList({selectedIndex: g});
                                k.jqxDropDownList("ensureVisible", g)
                            }
                            break;
                        case"date":
                        case"range":
                            if (this.host.jqxDateTimeInput) {
                                a(l.children()[0]).jqxDateTimeInput("setDate", null)
                            } else {
                                c(this, l)
                            }
                            break;
                        case"textbox":
                        case"default":
                            c(this, l);
                            break;
                        case"list":
                            if (this.host.jqxDropDownList) {
                                a(l.children()[0]).jqxDropDownList("clearSelection")
                            } else {
                                c(this, l)
                            }
                            break;
                        case"checkedlist":
                            if (this.host.jqxDropDownList) {
                                a(l.children()[0]).jqxDropDownList("checkAll", false)
                            } else {
                                c(this, l)
                            }
                            break;
                        case"bool":
                        case"boolean":
                            if (!this.host.jqxCheckBox) {
                                c(this, l)
                            } else {
                                a(l.children()[0]).jqxCheckBox({checked: null})
                            }
                            break
                    }
                }
            }
            this._disablefilterrow = false
        }, _applyfilterfromfilterrow: function () {
            if (this._disablefilterrow == true) {
                return
            }
            if (this.disabled) {
                return
            }
            var z = this.columns.records.length;
            var D = this.that;
            for (var t = 0; t < z; t++) {
                var k = new a.jqx.filter();
                var u = this.columns.records[t];
                if (!u.filterable) {
                    continue
                }
                if (u.datafield === null) {
                    continue
                }
                var f = D._getcolumntypebydatafield(u);
                var d = D._getfiltertype(f);
                var l = 1;
                var E = true;
                var e = u.filtertype;
                var B = function (j, L, I) {
                    var i = true;
                    if (j._filterwidget) {
                        var G = j._filterwidget.val();
                        if (G != "") {
                            var J = "equal";
                            if (L == "stringfilter") {
                                var J = "contains"
                            }
                            if (L == "numericfilter") {
                                if (D.gridlocalization.decimalseparator == ",") {
                                    if (G.indexOf(D.gridlocalization.decimalseparator) >= 0) {
                                        G = G.replace(D.gridlocalization.decimalseparator, ".")
                                    }
                                }
                            }
                            if (L != "stringfilter") {
                                var K = 0;
                                if (G.indexOf(">") != -1) {
                                    J = "greater_than";
                                    K = 1
                                }
                                if (G.indexOf("<") != -1) {
                                    J = "less_than";
                                    K = 1
                                }
                                if (G.indexOf("=") != -1) {
                                    if (J == "greater_than") {
                                        J = "greater_than_or_equal";
                                        K = 2
                                    } else {
                                        if (J == "less_than") {
                                            J = "less_than_or_equal";
                                            K = 2
                                        } else {
                                            J = "equal";
                                            K = 1
                                        }
                                    }
                                }
                                if (K != 0) {
                                    G = G.substring(K);
                                    if (G.length < 1) {
                                        return false
                                    }
                                }
                            }
                            if (j.filtercondition != undefined) {
                                J = j.filtercondition
                            }
                            if (L == "datefilter") {
                                var H = I.createfilter(L, G, J, null, j.cellsformat, D.gridlocalization)
                            } else {
                                var H = I.createfilter(L, G, J)
                            }
                            I.addfilter(l, H)
                        } else {
                            i = false
                        }
                    }
                    return i
                };
                switch (u.filtertype) {
                    case"range":
                    case"date":
                        if (u._filterwidget.jqxDateTimeInput) {
                            if (u.filtertype == "range") {
                                var p = u._filterwidget.jqxDateTimeInput("getRange");
                                if (p != null && p.from != null && p.to != null) {
                                    var o = "GREATER_THAN_OR_EQUAL";
                                    var r = new Date(0);
                                    r.setHours(0);
                                    r.setMinutes(0);
                                    r.setFullYear(p.from.getFullYear(), p.from.getMonth(), p.from.getDate());
                                    var q = new Date(0);
                                    q.setHours(0);
                                    q.setMinutes(0);
                                    q.setFullYear(p.to.getFullYear(), p.to.getMonth(), p.to.getDate());
                                    q.setHours(p.to.getHours());
                                    q.setMinutes(p.to.getMinutes());
                                    q.setSeconds(p.to.getSeconds());
                                    var y = k.createfilter(d, r, o);
                                    k.addfilter(0, y);
                                    var c = "LESS_THAN_OR_EQUAL";
                                    var x = k.createfilter(d, q, c);
                                    k.addfilter(0, x)
                                } else {
                                    E = false
                                }
                            } else {
                                var p = u._filterwidget.jqxDateTimeInput("getDate");
                                if (p != null) {
                                    var r = new Date(0);
                                    r.setHours(0);
                                    r.setMinutes(0);
                                    r.setFullYear(p.getFullYear(), p.getMonth(), p.getDate());
                                    var o = "EQUAL";
                                    if (u.filtercondition != undefined) {
                                        o = u.filtercondition
                                    }
                                    var y = k.createfilter(d, r, o);
                                    k.addfilter(0, y)
                                } else {
                                    E = false
                                }
                            }
                        } else {
                            E = B(u, d, k)
                        }
                        break;
                    case"input":
                        if (u._filterwidget) {
                            var p = u._filterwidget.find("input").val();
                            var h = u._filterwidget.find(".filter").jqxDropDownList("selectedIndex");
                            var w = k.getoperatorsbyfiltertype(d)[h];
                            if (D.updatefilterconditions) {
                                var F = D.updatefilterconditions(d, k.getoperatorsbyfiltertype(d));
                                if (F != undefined) {
                                    k.setoperatorsbyfiltertype(d, F)
                                }
                                var w = k.getoperatorsbyfiltertype(d)[h]
                            }
                            var n = w == "NULL" || w == "NOT_NULL";
                            var s = w == "EMPTY" || w == "NOT_EMPTY";
                            if (p != undefined && p.length > 0 || n || s) {
                                y = k.createfilter(d, p, w, null, u.cellsformat, D.gridlocalization);
                                k.addfilter(0, y)
                            } else {
                                E = false
                            }
                        } else {
                            E = false
                        }
                        break;
                    case"number":
                        if (u._filterwidget) {
                            var p = u._filterwidget.find("input").val();
                            if (D.gridlocalization.decimalseparator == ",") {
                                if (p.indexOf(D.gridlocalization.decimalseparator) >= 0) {
                                    p = p.replace(D.gridlocalization.decimalseparator, ".")
                                }
                            }
                            var h = u._filterwidget.find(".filter").jqxDropDownList("selectedIndex");
                            var w = k.getoperatorsbyfiltertype(d)[h];
                            if (D.updatefilterconditions) {
                                var F = D.updatefilterconditions(d, k.getoperatorsbyfiltertype(d));
                                if (F != undefined) {
                                    k.setoperatorsbyfiltertype(d, F)
                                }
                                var w = k.getoperatorsbyfiltertype(d)[h]
                            }
                            var n = w == "NULL" || w == "NOT_NULL";
                            var s = w == "EMPTY" || w == "NOT_EMPTY";
                            if (p != undefined && p.length > 0 || n || s) {
                                y = k.createfilter(d, new Number(p), w, null, u.cellsformat, D.gridlocalization);
                                k.addfilter(0, y)
                            } else {
                                E = false
                            }
                        } else {
                            E = false
                        }
                        break;
                    case"textbox":
                    case"default":
                        E = B(u, d, k);
                        break;
                    case"bool":
                    case"boolean":
                        if (u._filterwidget.jqxCheckBox) {
                            var p = u._filterwidget.jqxCheckBox("checked");
                            if (p != null) {
                                var o = "equal";
                                var m = k.createfilter(d, p, o);
                                k.addfilter(l, m)
                            } else {
                                E = false
                            }
                        } else {
                            E = B(u, d, k)
                        }
                        break;
                    case"list":
                        var g = u._filterwidget.jqxDropDownList("listBox");
                        if (g.selectedIndex > 0) {
                            var b = g.getItem(g.selectedIndex);
                            var p = b.label;
                            var A = b.value;
                            var o = "equal";
                            if (p === "") {
                                o = "NULL"
                            }
                            var m = k.createfilter(d, p, o);
                            k.addfilter(l, m);
                            if (A !== p) {
                                m.data = A
                            }
                        } else {
                            E = false
                        }
                        break;
                    case"checkedlist":
                        if (u._filterwidget.jqxDropDownList) {
                            var g = u._filterwidget.jqxDropDownList("listBox");
                            var C = g.getCheckedItems();
                            if (C.length == 0) {
                                for (var v = 1; v < g.items.length; v++) {
                                    var p = g.items[v].label;
                                    var A = g.items[v].value;
                                    var o = "not_equal";
                                    if (p === "") {
                                        o = "NULL"
                                    }
                                    var m = k.createfilter(d, p, o);
                                    if (A !== p) {
                                        m.data = A
                                    }
                                    k.addfilter(0, m)
                                }
                                E = true
                            } else {
                                if (C.length != g.items.length) {
                                    for (var v = 0; v < C.length; v++) {
                                        var p = C[v].label;
                                        var A = C[v].value;
                                        var o = "equal";
                                        if (p === "") {
                                            o = "NULL"
                                        }
                                        var m = k.createfilter(d, p, o);
                                        if (A !== p) {
                                            m.data = A
                                        }
                                        k.addfilter(l, m)
                                    }
                                } else {
                                    E = false
                                }
                            }
                        } else {
                            E = B(u, d, k)
                        }
                        break
                }
                if (!this._loading) {
                    if (E) {
                        this.addfilter(u.displayfield, k, false)
                    } else {
                        this.removefilter(u.displayfield, false)
                    }
                }
            }
            if (!this._loading) {
                this.applyfilters("filterrow")
            }
        }, _updatefilterrow: function () {
            var b = a('<div style="position: relative;" id="row00' + this.element.id + '"></div>');
            var f = 0;
            var o = this.columns.records.length;
            var m = this.toThemeProperty("jqx-grid-cell");
            m += " " + this.toThemeProperty("jqx-grid-cell-pinned");
            m += " " + this.toThemeProperty("jqx-grid-cell-filter-row");
            var r = o + 10;
            var s = new Array();
            var n = this.that;
            this.filterrow[0].cells = s;
            b.height(this.filterrowheight);
            this.filterrow.children().detach();
            this.filterrow.append(b);
            if (!this._filterrowcache) {
                this._filterrowcache = new Array()
            }
            this._initcolumntypes();
            var g = false;
            var d = new Array();
            var q = document.createDocumentFragment();
            for (var h = 0; h < o; h++) {
                var e = this.columns.records[h];
                var c = e.width;
                if (c < e.minwidth) {
                    c = e.minwidth
                }
                if (c > e.maxwidth) {
                    c = e.maxwidth
                }
                var l = document.createElement("div");
                l.style.overflow = "hidden";
                l.style.position = "absolute";
                l.style.height = "100%";
                l.className = m;
                l = a(l);
                q.appendChild(l[0]);
                l[0].style.left = f + "px";
                if (this.rtl) {
                    l.css("z-index", r++);
                    l.css("border-left-width", "1px")
                } else {
                    l.css("z-index", r--)
                }
                if (c == "auto") {
                    c = 0
                }
                l[0].style.width = parseFloat(c) + "px";
                l[0].left = f;
                if (!(e.hidden && e.hideable)) {
                    f += c
                } else {
                    l.css("display", "none")
                }
                s[s.length] = l[0];
                var k = true;
                if (!this.rtl) {
                    if (this.groupable) {
                        var p = (this.showrowdetailscolumn && this.rowdetails) ? 1 : 0;
                        if (this.groups.length + p > h) {
                            k = false
                        }
                    }
                    if (this.showrowdetailscolumn && this.rowdetails && h == 0) {
                        k = false
                    }
                } else {
                    if (this.groupable) {
                        var p = (this.showrowdetailscolumn && this.rowdetails) ? 1 : 0;
                        if (this.groups.length + p + h > o - 1) {
                            k = false
                        }
                    }
                    if (this.showrowdetailscolumn && this.rowdetails && h == o - 1) {
                        k = false
                    }
                }
                if (k) {
                    if (e.filtertype == "custom" && e.createfilterwidget) {
                        var i = function () {
                            n._applyfilterfromfilterrow()
                        };
                        e.createfilterwidget(e, l, i)
                    } else {
                        if (e.filterable) {
                            if (this._filterrowcache[e.datafield]) {
                                g = true;
                                l.append(this._filterrowcache[e.datafield]);
                                e._filterwidget = this._filterrowcache[e.datafield]
                            } else {
                                this._addfilterwidget(e, l, c);
                                d[e.datafield] = e._filterwidget
                            }
                        }
                    }
                }
            }
            b[0].appendChild(q);
            this._filterrowcache = d;
            if (a.jqx.browser.msie && a.jqx.browser.version < 8) {
                b.css("z-index", r--)
            }
            b.width(parseFloat(f) + 2);
            this.filterrow.addClass(m);
            this.filterrow.css("border-top-width", "1px");
            this.filterrow.css("border-right-width", "0px");
            if (g) {
                this._updatefilterrowui(true)
            }
        }, _addfilterwidget: function (C, d, A) {
            var H = this.that;
            var z = "";
            var E = "";
            for (var F = 0; F < H.dataview.filters.length; F++) {
                var x = H.dataview.filters[F];
                if (x.datafield && x.datafield == C.datafield) {
                    var F = x.filter.getfilters()[0];
                    z = F.value;
                    if (C.filtertype === "range") {
                        z = {from: z, to: x.filter.getfilters()[1].value}
                    }
                    E = F.condition;
                    C.filtercondition = E;
                    break
                }
            }
            var g = function (I, J) {
                var f = a('<input autocomplete="off" type="textarea"/>');
                f[0].id = a.jqx.utilities.createId();
                f.addClass(I.toThemeProperty("jqx-widget"));
                f.addClass(I.toThemeProperty("jqx-input"));
                f.addClass(I.toThemeProperty("jqx-rc-all"));
                f.addClass(I.toThemeProperty("jqx-widget-content"));
                if (I.rtl) {
                    f.css("direction", "rtl")
                }
                if (I.disabled) {
                    f.attr("disabled", true)
                }
                f.attr("disabled", false);
                f.appendTo(J);
                f.width(A - 10);
                f.height(I.filterrowheight - 10);
                f.css("margin", "4px");
                f.css("box-sizing", "border-box");
                if (C.createfilterwidget) {
                    C.createfilterwidget(C, J, f)
                }
                C._filterwidget = f;
                f.focus(function () {
                    I.content[0].scrollLeft = 0;
                    setTimeout(function () {
                        I.content[0].scrollLeft = 0
                    }, 10);
                    I.focusedfilter = f;
                    f.addClass(I.toThemeProperty("jqx-fill-state-focus"));
                    return false
                });
                f.blur(function () {
                    f.removeClass(I.toThemeProperty("jqx-fill-state-focus"))
                });
                f.keydown(function (K) {
                    if (K.keyCode == "13") {
                        I._applyfilterfromfilterrow()
                    }
                    if (f[0]._writeTimer) {
                        clearTimeout(f[0]._writeTimer)
                    }
                    f[0]._writeTimer = setTimeout(function () {
                        if (!I._loading) {
                            if (!I["_oldWriteText" + f[0].id]) {
                                I["_oldWriteText" + f[0].id] = ""
                            }
                            if (I["_oldWriteText" + f[0].id].length > 0 && I["_oldWriteText" + f[0].id] != f.val()) {
                                I._applyfilterfromfilterrow();
                                I["_oldWriteText" + f[0].id] = f.val()
                            } else {
                                if (I["_oldWriteText" + f[0].id].length == 0) {
                                    I._applyfilterfromfilterrow();
                                    I["_oldWriteText" + f[0].id] = f.val()
                                }
                            }
                        }
                    }, C.filterdelay);
                    I.focusedfilter = f
                });
                I.host.removeClass("jqx-disableselect");
                I.content.removeClass("jqx-disableselect");
                f.val(z)
            };
            if (C.datatype != null) {
                if (C.filtertype == "number") {
                    if (C.datatype == "string" || C.datatype == "date" || C.datatype == "bool") {
                        C.filtertype = "textbox"
                    }
                }
                if (C.filtertype == "date") {
                    if (C.datatype == "string" || C.datatype == "number" || C.datatype == "bool") {
                        C.filtertype = "textbox"
                    }
                }
                if (C.filtertype == "bool") {
                    if (C.datatype == "string" || C.datatype == "number" || C.datatype == "date") {
                        C.filtertype = "textbox"
                    }
                }
            }
            switch (C.filtertype) {
                case"number":
                case"input":
                    var m = a("<div></div>");
                    m.width(d.width());
                    m.height(this.filterrowheight);
                    d.append(m);
                    var A = d.width() - 21;
                    var s = function (J, K, f) {
                        var I = a('<input style="float: left;" autocomplete="off" type="textarea"/>');
                        if (H.rtl) {
                            I.css("float", "right");
                            I.css("direction", "rtl")
                        }
                        I[0].id = a.jqx.utilities.createId();
                        I.addClass(H.toThemeProperty("jqx-widget jqx-input jqx-rc-all jqx-widget-content"));
                        I.appendTo(J);
                        I.width(K - 16);
                        if (H.disabled) {
                            I.attr("disabled", true)
                        }
                        I.attr("disabled", false);
                        I.height(H.filterrowheight - 10);
                        I.css("margin", "4px");
                        I.css("margin-right", "2px");
                        I.focus(function () {
                            H.focusedfilter = I;
                            I.addClass(H.toThemeProperty("jqx-fill-state-focus"))
                        });
                        I.blur(function () {
                            I.removeClass(H.toThemeProperty("jqx-fill-state-focus"))
                        });
                        I.keydown(function (L) {
                            if (L.keyCode == "13") {
                                H._applyfilterfromfilterrow()
                            }
                            if (I[0]._writeTimer) {
                                clearTimeout(I[0]._writeTimer)
                            }
                            I[0]._writeTimer = setTimeout(function () {
                                if (!H._loading) {
                                    if (H["_oldWriteText" + I[0].id] != I.val()) {
                                        H._applyfilterfromfilterrow();
                                        H["_oldWriteText" + I[0].id] = I.val()
                                    }
                                }
                            }, C.filterdelay);
                            H.focusedfilter = I
                        });
                        I.val(z);
                        return I
                    };
                    s(m, A);
                    var B = H._getfiltersbytype(C.filtertype == "number" ? "number" : "string");
                    var t = a("<div class='filter' style='float: left;'></div>");
                    t.css("margin-top", "4px");
                    t.appendTo(m);
                    if (H.rtl) {
                        t.css("float", "right")
                    }
                    var h = 0;
                    if (C.filtercondition != null) {
                        var F = new a.jqx.filter();
                        var r = F.getoperatorsbyfiltertype(C.filtertype == "number" ? "numericfilter" : "stringfilter");
                        var e = r.indexOf(C.filtercondition.toUpperCase());
                        if (e != -1) {
                            h = e
                        }
                    }
                    var D = 180;
                    if (C.filtertype == "input") {
                        D = 240;
                        if (h == 0) {
                            var e = B.indexOf("contains") || 2;
                            if (e != -1 && C.filtercondition == null) {
                                h = e
                            }
                        }
                    }
                    t.jqxDropDownList({
                        disabled: H.disabled,
                        touchMode: H.touchmode,
                        rtl: H.rtl,
                        dropDownHorizontalAlignment: "right",
                        enableBrowserBoundsDetection: true,
                        selectedIndex: h,
                        width: 18,
                        height: 21,
                        dropDownHeight: 150,
                        dropDownWidth: D,
                        source: B,
                        theme: H.theme
                    });
                    t.jqxDropDownList({
                        selectionRenderer: function (f) {
                            return ""
                        }
                    });
                    t.jqxDropDownList("setContent", "");
                    t.find(".jqx-dropdownlist-content").hide();
                    if (C.createfilterwidget) {
                        C.createfilterwidget(C, d, m)
                    }
                    C._filterwidget = m;
                    var j = null;
                    this.addHandler(t, "select", function () {
                        var f = t.jqxDropDownList("getSelectedItem").label;
                        if (C._filterwidget.find("input").val().length > 0 && !H.refreshingfilter) {
                            H._applyfilterfromfilterrow()
                        }
                        if (C.filtertype == "input" && !H.refreshingfilter) {
                            H._applyfilterfromfilterrow()
                        } else {
                            if (C._filterwidget.find("input").val().length == 0 && !H.refreshingfilter) {
                                if (j == "null" || j == "not null" || f == "null" || f == "not null") {
                                    H._applyfilterfromfilterrow()
                                }
                            }
                        }
                        j = f
                    });
                    break;
                case"textbox":
                case"default":
                default:
                    g(this, d);
                    break;
                case"none":
                    break;
                case"date":
                case"range":
                    if (this.host.jqxDateTimeInput) {
                        var b = a("<div></div>");
                        b.css("margin", "4px");
                        b.appendTo(d);
                        var n = {
                            calendar: this.gridlocalization,
                            todayString: this.gridlocalization.todaystring,
                            clearString: this.gridlocalization.clearstring
                        };
                        b.jqxDateTimeInput({
                            firstDayOfWeek: this.gridlocalization.firstDay,
                            readonly: true,
                            disabled: H.disabled,
                            localization: n,
                            rtl: H.rtl,
                            showFooter: true,
                            formatString: C.cellsformat,
                            selectionMode: C.filtertype,
                            value: null,
                            theme: this.theme,
                            width: A - 10,
                            height: this.filterrowheight - 10
                        });
                        if (C.createfilterwidget) {
                            C.createfilterwidget(C, d, b)
                        }
                        if (z && z.from) {
                            b.jqxDateTimeInput("setRange", z.from, z.to)
                        } else {
                            if (z && z.toString().length > 1) {
                                b.val(z)
                            }
                        }
                        C._filterwidget = b;
                        this.addHandler(b, "valueChanged", function (f) {
                            if (!H.refreshingfilter) {
                                H._applyfilterfromfilterrow();
                                H.focusedfilter = null
                            }
                        })
                    } else {
                        g(this, d)
                    }
                    break;
                case"list":
                case"checkedlist":
                    if (this.host.jqxDropDownList) {
                        var q = this._getfilterdataadapter(C);
                        var l = false;
                        var t = a("<div></div>");
                        t.css("margin", "4px");
                        var u = C.datafield;
                        var v = C.filtertype == "checkedlist" ? true : false;
                        var D = A < 150 ? 220 : "auto";
                        q.dataBind();
                        var p = q.records;
                        var k = p.length < 8 ? true : false;
                        l = k;
                        t.appendTo(d);
                        t.jqxDropDownList({
                            placeHolder: H.gridlocalization.filterchoosestring,
                            disabled: H.disabled,
                            touchMode: H.touchmode,
                            rtl: H.rtl,
                            checkboxes: v,
                            dropDownWidth: D,
                            source: q.records,
                            autoDropDownHeight: k,
                            theme: this.theme,
                            width: A - 10,
                            height: this.filterrowheight - 10,
                            displayMember: C.displayfield,
                            valueMember: u
                        });
                        if (C.createfilterwidget) {
                            C.createfilterwidget(C, d, t)
                        }
                        var c = t.jqxDropDownList("listBox");
                        if (v) {
                            t.jqxDropDownList({
                                selectionRenderer: function () {
                                    var f = '<span class="' + H.toThemeProperty("jqx-item") + '" style="top: 2px; position: relative; color: inherit; border: none; background-color: transparent;">' + H.gridlocalization.filterselectstring + "</span>";
                                    return f
                                }
                            });
                            var y = a('<span style="top: 2px; position: relative; color: inherit; border: none; background-color: transparent;">' + H.gridlocalization.filterselectstring + "</span>");
                            y.addClass(this.toThemeProperty("jqx-item"));
                            if (c != undefined) {
                                if (!l) {
                                    c.host.height(200)
                                }
                                c.insertAt(H.gridlocalization.filterselectallstring, 0);
                                t.jqxDropDownList("setContent", y);
                                var i = true;
                                var G = new Array();
                                c.checkAll(false);
                                H.addHandler(c.host, "checkChange", function (J) {
                                    t[0]._selectionChanged = true;
                                    if (!i) {
                                        return
                                    }
                                    if (J.args.label != H.gridlocalization.filterselectallstring) {
                                        i = false;
                                        c.host.jqxListBox("checkIndex", 0, true, false);
                                        var f = c.host.jqxListBox("getCheckedItems");
                                        var I = c.host.jqxListBox("getItems");
                                        if (f.length == 1) {
                                            c.host.jqxListBox("uncheckIndex", 0, true, false)
                                        } else {
                                            if (I.length != f.length) {
                                                c.host.jqxListBox("indeterminateIndex", 0, true, false)
                                            }
                                        }
                                        i = true
                                    } else {
                                        i = false;
                                        if (J.args.checked) {
                                            c.host.jqxListBox("checkAll", false)
                                        } else {
                                            c.host.jqxListBox("uncheckAll", false)
                                        }
                                        i = true
                                    }
                                })
                            }
                        } else {
                            c.insertAt({label: this.gridlocalization.filterchoosestring, value: ""}, 0);
                            t.jqxDropDownList({selectedIndex: 0})
                        }
                        C._filterwidget = t;
                        var o = t.jqxDropDownList("dropdownlistWrapper");
                        if (C.filtertype == "list") {
                            this.addHandler(t, "select", function (f) {
                                if (!H.refreshingfilter) {
                                    if (f.args && f.args.type != "none") {
                                        H._applyfilterfromfilterrow();
                                        H.focusedfilter = null
                                    }
                                }
                            })
                        } else {
                            this.addHandler(t, "close", function (f) {
                                if (t[0]._selectionChanged) {
                                    H._applyfilterfromfilterrow();
                                    H.focusedfilter = null;
                                    t[0]._selectionChanged = false
                                }
                            })
                        }
                    } else {
                        g(this, d)
                    }
                    break;
                case"bool":
                case"boolean":
                    if (this.host.jqxCheckBox) {
                        var w = a('<div tabIndex=0 style="opacity: 0.99; position: absolute; top: 50%; left: 50%; margin-top: -7px; margin-left: -10px;"></div>');
                        w.appendTo(d);
                        w.jqxCheckBox({
                            disabled: H.disabled,
                            enableContainerClick: false,
                            animationShowDelay: 0,
                            animationHideDelay: 0,
                            hasThreeStates: true,
                            theme: this.theme,
                            checked: null
                        });
                        if (C.createfilterwidget) {
                            C.createfilterwidget(C, d, w)
                        }
                        if (z === true || z == "true") {
                            w.jqxCheckBox({checked: true})
                        } else {
                            if (z === false || z == "false") {
                                w.jqxCheckBox({checked: false})
                            }
                        }
                        C._filterwidget = w;
                        this.addHandler(w, "change", function (f) {
                            if (!H.refreshingfilter) {
                                if (f.args) {
                                    H.focusedfilter = null;
                                    H._applyfilterfromfilterrow()
                                }
                            }
                        })
                    } else {
                        g(this, d)
                    }
                    break
            }
        }, _getfilterdataadapter: function (b) {
            var c = this.source._source ? true : false;
            if (!c) {
                dataadapter = new a.jqx.dataAdapter(this.source, {
                    autoBind: false,
                    uniqueDataFields: [b.displayfield],
                    autoSort: true,
                    autoSortField: b.displayfield,
                    async: false
                })
            } else {
                var e = {
                    localdata: a.extend(true, {}, this.source.records),
                    datatype: this.source.datatype,
                    async: false
                };
                var d = this;
                dataadapter = new a.jqx.dataAdapter(e, {
                    autoBind: false,
                    autoSort: true,
                    autoSortField: b.displayfield,
                    async: false,
                    uniqueDataFields: [b.displayfield],
                    beforeLoadComplete: function (f) {
                        var k = new Array();
                        if (b.cellsformat) {
                            var j = d._getcolumntypebydatafield(b);
                            for (var g = 0; g < f.length; g++) {
                                k.push(f[g]);
                                var h = f[g][b.displayfield];
                                f[g][b.displayfield + "JQValue"] = h;
                                if (j === "date") {
                                    if (h != null) {
                                        f[g][b.displayfield] = dataadapter.formatDate(h, b.cellsformat, d.gridlocalization)
                                    } else {
                                        f[g][b.displayfield] = ""
                                    }
                                } else {
                                    if (j === "number" || j === "float" || j === "int") {
                                        if (h != null) {
                                            f[g][b.displayfield] = dataadapter.formatNumber(h, b.cellsformat, d.gridlocalization)
                                        } else {
                                            f[g][b.displayfield] = ""
                                        }
                                    }
                                }
                            }
                            return k
                        } else {
                            return f
                        }
                    }
                })
            }
            if (b.filteritems && b.filteritems.length > 0) {
                var e = {localdata: b.filteritems, datatype: this.source.datatype, async: false};
                dataadapter = new a.jqx.dataAdapter(e, {autoBind: false, async: false})
            } else {
                if (b.filteritems) {
                    if (b.filteritems._source) {
                        b.filteritems._options.autoBind = false;
                        b.filteritems._options.async = false;
                        return b.filteritems
                    } else {
                        if (a.isFunction(b.filteritems)) {
                            return b.filteritems()
                        }
                    }
                }
            }
            return dataadapter
        }, refreshfilterrow: function () {
            if (!this.showfilterrow) {
                return
            }
            this.refreshingfilter = true;
            this._updatefilterrowui();
            this._updatelistfilters(true, true);
            var h = this.that;
            var l = this.columns.records.length;
            for (var d = 0; d < l; d++) {
                var c = this.columns.records[d];
                if (c.filterable) {
                    if (c.filter) {
                        var b = c.filter.getfilters();
                        if (b.length > 0) {
                            var k = b[0].value;
                            var e = c._filterwidget;
                            var f = c._filterwidget.parent();
                            if (e != null) {
                                switch (c.filtertype) {
                                    case"number":
                                        f.find("input").val(k);
                                        if (this.host.jqxDropDownList) {
                                            var i = c.filter.getoperatorsbyfiltertype("numericfilter");
                                            e.find(".filter").jqxDropDownList("selectIndex", i.indexOf(b[0].condition))
                                        }
                                        break;
                                    case"input":
                                        f.find("input").val(k);
                                        if (this.host.jqxDropDownList) {
                                            var i = c.filter.getoperatorsbyfiltertype("stringfilter");
                                            e.find(".filter").jqxDropDownList("selectIndex", i.indexOf(b[0].condition))
                                        }
                                        break;
                                    case"date":
                                    case"range":
                                        if (this.host.jqxDateTimeInput) {
                                            var k = c.filter.getfilterat(0).filtervalue;
                                            if (k != undefined) {
                                                if (c.filter.getfilterat(1)) {
                                                    var g = c.filter.getfilterat(1).filtervalue
                                                } else {
                                                    g = k
                                                }
                                                if (c.filtertype == "range") {
                                                    a(f.children()[0]).jqxDateTimeInput("setRange", new Date(k), new Date(g))
                                                } else {
                                                    a(f.children()[0]).jqxDateTimeInput("setDate", new Date(k))
                                                }
                                            }
                                        } else {
                                            e.val(k)
                                        }
                                        break;
                                    case"textbox":
                                    case"default":
                                        e.val(k);
                                        h["_oldWriteText" + e[0].id] = k;
                                        break;
                                    case"bool":
                                    case"boolean":
                                        if (!this.host.jqxCheckBox) {
                                            e.val(k)
                                        } else {
                                            a(f.children()[0]).jqxCheckBox({checked: k})
                                        }
                                        break
                                }
                            }
                        }
                    }
                }
            }
            this.refreshingfilter = false
        }, _destroyedfilters: function () {
            var g = this.that;
            var b = this.columns.records.length;
            for (var f = 0; f < b; f++) {
                var c = this.columns.records[f];
                if (c.filterable) {
                    var h = c._filterwidget;
                    if (c.filtertype == "list" || c.filtertype == "checkedlist") {
                        this.removeHandler(h, "select");
                        this.removeHandler(h, "close");
                        h.jqxDropDownList("destroy")
                    } else {
                        if (c.filtertype == "date" || c.filtertype == "range") {
                            this.removeHandler(h, "valueChanged");
                            h.jqxDateTimeInput("destroy")
                        } else {
                            if (c.filtertype == "bool") {
                                this.removeHandler(h, "change");
                                h.jqxCheckBox("destroy")
                            } else {
                                if (c.filtertype == "number" || c.filtertype === "input") {
                                    var d = h.find(".jqx-input");
                                    this.removeHandler(d, "keydown");
                                    var e = a(h.children()[1]);
                                    e.jqxDropDownList("destroy")
                                } else {
                                    this.removeHandler(h, "keydown")
                                }
                            }
                        }
                    }
                    h.remove()
                }
            }
        }, _updatelistfilters: function (l, k) {
            var v = this.that;
            var t = this.columns.records.length;
            for (var p = 0; p < t; p++) {
                var q = this.columns.records[p];
                if (q.filterable) {
                    if (q.filtertype == "list" || q.filtertype == "checkedlist") {
                        var h = q._filterwidget;
                        if (!l) {
                            if (q.filter == undefined) {
                                h.jqxDropDownList("renderSelection");
                                continue
                            }
                        } else {
                            var e = this._getfilterdataadapter(q);
                            h.jqxDropDownList({source: e});
                            var d = h.jqxDropDownList("getItems");
                            var o = true;
                            if (d.length != e.records.length + 1) {
                                o = false
                            }
                            if (o) {
                                for (var s = 1; s < d.length; s++) {
                                    if (d[s].label != e.records[s - 1][q.displayfield]) {
                                        o = false;
                                        break
                                    }
                                }
                            }
                            if (o && !k) {
                                continue
                            }
                        }
                        var m = q.filtertype == "checkedlist" ? true : false;
                        var d = h.jqxDropDownList("getItems");
                        var b = h.jqxDropDownList("listBox");
                        h.jqxDropDownList("dataBind");
                        if (m) {
                            h.jqxDropDownList({
                                selectionRenderer: function () {
                                    return v.gridlocalization.filterselectstring
                                }
                            });
                            if (b.getItem(this.gridlocalization.filterselectallstring) == null) {
                                b.insertAt(this.gridlocalization.filterselectallstring, 0)
                            }
                            var n = a('<span style="top: 2px; position: relative; color: inherit; border: none; background-color: transparent;">' + this.gridlocalization.filterselectstring + "</span>");
                            n.addClass(this.toThemeProperty("jqx-item"));
                            h.jqxDropDownList("setContent", n);
                            b.checkAll(false);
                            if (q.filter) {
                                var g = q.filter.getfilters();
                                for (var s = 0; s < b.items.length; s++) {
                                    var f = b.items[s].label;
                                    var r = undefined;
                                    a.each(g, function () {
                                        var i;
                                        if (this.condition == "NOT_EQUAL") {
                                            if (f == this.value) {
                                                i = false
                                            } else {
                                                i = true
                                            }
                                        } else {
                                            if (this.condition == "EQUAL") {
                                                if (f == this.value) {
                                                    i = true
                                                } else {
                                                    i = false
                                                }
                                            }
                                        }
                                        if (r == undefined && i !== undefined) {
                                            r = i
                                        } else {
                                            if (this.condition == "EQUAL") {
                                                r = r || i
                                            } else {
                                                r = r && i
                                            }
                                        }
                                    });
                                    if (r) {
                                        b.checkIndex(s, false, false)
                                    } else {
                                        b.uncheckIndex(s, false, false)
                                    }
                                }
                                b._updateCheckedItems();
                                var u = b.getCheckedItems().length;
                                if (b.items.length != u && u > 0) {
                                    b.host.jqxListBox("indeterminateIndex", 0, true, false)
                                }
                            }
                        } else {
                            if (b.getItem(this.gridlocalization.filterselectallstring) == null) {
                                b.insertAt({label: this.gridlocalization.filterchoosestring, value: ""}, 0)
                            }
                            h.jqxDropDownList({selectedIndex: 0});
                            if (q.filter) {
                                var g = q.filter.getfilters();
                                var c = -1;
                                for (var s = 0; s < b.items.length; s++) {
                                    var f = b.items[s].label;
                                    a.each(g, function () {
                                        if (this.condition == "NOT_EQUAL") {
                                            return true
                                        }
                                        if (f == this.value) {
                                            c = s;
                                            return false
                                        }
                                    })
                                }
                                if (c != -1) {
                                    b.selectIndex(c)
                                }
                            }
                        }
                        if (d.length < 8) {
                            h.jqxDropDownList("autoDropDownHeight", true)
                        } else {
                            h.jqxDropDownList("autoDropDownHeight", false)
                        }
                    }
                }
            }
        }, _renderfiltercolumn: function () {
            var b = this.that;
            if (this.filterable) {
                if (!this.columns.records) {
                    return
                }
                a.each(this.columns.records, function (d, e) {
                    var c = false;
                    if (b.autoshowfiltericon) {
                        if (this.filter) {
                            a(this.filtericon).show();
                            c = true
                        } else {
                            a(this.filtericon).hide()
                        }
                    } else {
                        if (this.filterable) {
                            a(this.filtericon).show();
                            c = true
                        }
                    }
                    if (this.align == "right" && !this.renderer) {
                        if (this.element) {
                            if (!c) {
                                this.element.firstChild.firstChild.style.marginRight = "2px"
                            } else {
                                this.element.firstChild.firstChild.style.marginRight = "18px"
                            }
                        }
                    }
                })
            }
        }, _initcolumntypes: function () {
            if (this.columns && this.columns.records) {
                var b = this.source._source.datafields;
                if (b) {
                    for (var c = 0; c < this.columns.records.length; c++) {
                        var d = this.columns.records[c];
                        if (d.datatype) {
                            continue
                        }
                        var e = "";
                        a.each(b, function () {
                            if (this.name == d.displayfield) {
                                if (this.type) {
                                    e = this.type
                                }
                                return false
                            }
                        });
                        if (e != "") {
                            d.datatype = e
                        } else {
                            d.datatype = ""
                        }
                    }
                }
            }
        }, _getcolumntypebydatafield: function (f) {
            var g = this.that;
            var e = "string";
            var d = g.source.datafields || ((g.source._source) ? g.source._source.datafields : null);
            if (d) {
                var i = "";
                a.each(d, function () {
                    if (this.name == f.displayfield) {
                        if (this.type) {
                            i = this.type
                        }
                        return false
                    }
                });
                if (i) {
                    return i
                }
            }
            if (f != null) {
                if (this.dataview.cachedrecords == undefined) {
                    return e
                }
                var b = null;
                if (!this.virtualmode) {
                    if (this.dataview.cachedrecords.length == 0) {
                        return e
                    }
                    b = this.dataview.cachedrecords[0][f.displayfield];
                    if (b != null && b.toString() == "") {
                        return "string"
                    }
                } else {
                    a.each(this.dataview.cachedrecords, function () {
                        b = this[f.displayfield];
                        return false
                    })
                }
                if (b != null) {
                    if (typeof b == "boolean") {
                        e = "boolean"
                    } else {
                        if (a.jqx.dataFormat.isNumber(b)) {
                            e = "number"
                        } else {
                            var h = new Date(b);
                            if (h.toString() == "NaN" || h.toString() == "Invalid Date") {
                                if (a.jqx.dataFormat) {
                                    h = a.jqx.dataFormat.tryparsedate(b);
                                    if (h != null) {
                                        if (h && h.getFullYear()) {
                                            if (h.getFullYear() == 1970 && h.getMonth() == 0 && h.getDate() == 1) {
                                                var c = new Number(b);
                                                if (!isNaN(c)) {
                                                    return "number"
                                                }
                                                return "string"
                                            }
                                        }
                                        return "date"
                                    } else {
                                        e = "string"
                                    }
                                } else {
                                    e = "string"
                                }
                            } else {
                                e = "date"
                            }
                        }
                    }
                }
            }
            return e
        }, _getfiltersbytype: function (b) {
            var c = this.that;
            var d = "";
            switch (b) {
                case"number":
                case"float":
                case"int":
                    d = c.gridlocalization.filternumericcomparisonoperators;
                    break;
                case"date":
                    d = c.gridlocalization.filterdatecomparisonoperators;
                    break;
                case"boolean":
                case"bool":
                    d = c.gridlocalization.filterbooleancomparisonoperators;
                    break;
                case"string":
                default:
                    d = c.gridlocalization.filterstringcomparisonoperators;
                    break
            }
            return d
        }, _getfiltertype: function (b) {
            var c = "stringfilter";
            switch (b) {
                case"number":
                case"int":
                case"float":
                case"decimal":
                    c = "numericfilter";
                    break;
                case"boolean":
                case"bool":
                    c = "booleanfilter";
                    break;
                case"date":
                case"time":
                case"range":
                    c = "datefilter";
                    break;
                case"string":
                case"input":
                    c = "stringfilter";
                    break
            }
            return c
        }, _buildfilter: function (r, l, F) {
            var f = a(l).find(".filter1");
            var G = a(l).find(".filter2");
            var K = a(l).find(".filter3");
            var k = a(l).find(".filtertext1" + r.element.id);
            var j = a(l).find(".filtertext2" + r.element.id);
            var A = k.val();
            var z = j.val();
            var M = r._getcolumntypebydatafield(F);
            var t = r._getfiltersbytype(M);
            var J = new a.jqx.filter();
            var w = r._getfiltertype(M);
            if (r.filtermode === "default" && (F.filtertype !== "list" && F.filtertype !== "checkedlist")) {
                var E = f.jqxDropDownList("selectedIndex");
                var c = G.jqxDropDownList("selectedIndex");
                var D = K.jqxDropDownList("selectedIndex");
                var e = null;
                var d = null;
                if (r.updatefilterconditions) {
                    var p = r.updatefilterconditions(w, J.getoperatorsbyfiltertype(w));
                    if (p != undefined) {
                        J.setoperatorsbyfiltertype(w, p)
                    }
                }
                var q = false;
                var L = J.getoperatorsbyfiltertype(w)[E];
                var K = J.getoperatorsbyfiltertype(w)[D];
                var v = L == "NULL" || L == "NOT_NULL";
                var h = L == "EMPTY" || L == "NOT_EMPTY";
                if (L == undefined) {
                    L = J.getoperatorsbyfiltertype(w)[0]
                }
                if (K == undefined) {
                    K = J.getoperatorsbyfiltertype(w)[0]
                }
                if (A.length > 0 || v || h) {
                    e = J.createfilter(w, A, L, null, F.cellsformat, r.gridlocalization);
                    J.addfilter(c, e);
                    q = true
                }
                var u = K == "NULL" || K == "NOT_NULL";
                var g = K == "EMPTY" || K == "NOT_EMPTY";
                if (z.length > 0 || u || g) {
                    d = J.createfilter(w, z, K, null, F.cellsformat, r.gridlocalization);
                    J.addfilter(c, d);
                    q = true
                }
                if (q) {
                    var C = F.displayfield;
                    this.addfilter(C, J, true)
                } else {
                    this._clearfilter(r, l, F)
                }
            } else {
                if (r.filtermode === "excel" || (F.filtertype === "list" || F.filtertype === "checkedlist")) {
                    var B = this;
                    var n = false;
                    var x = f.data().jqxListBox.instance;
                    var I = this.filtermode === "excel" || F.filtertype === "checkedlist";
                    var o = x.getCheckedItems();
                    if (!I) {
                        var o = x.getSelectedItems()
                    }
                    if (o.length == 0) {
                        for (var H = 1; H < x.items.length; H++) {
                            var m = x.items[H].value;
                            if (m === undefined) {
                                m = ""
                            }
                            var b = "not_equal";
                            if (m && m.indexOf) {
                                if (m.indexOf("|") >= 0 || m.indexOf(" AND ") >= 0 || m.indexOf(" OR ") >= 0 || m.indexOf(" and ") >= 0 || m.indexOf(" or ") >= 0) {
                                    m = m.replace("|", "");
                                    m = m.replace("AND", "");
                                    m = m.replace("OR", "");
                                    m = m.replace("and", "");
                                    m = m.replace("or", "");
                                    var b = "equal"
                                }
                            }
                            if (w == "datefilter") {
                                var y = J.createfilter(w, m, b, null, F.cellsformat, r.gridlocalization)
                            } else {
                                var y = J.createfilter(w, m, b, null)
                            }
                            J.addfilter(0, y)
                        }
                        n = true
                    } else {
                        if (o.length != x.items.length) {
                            n = true;
                            for (var H = 0; H < o.length; H++) {
                                if (r.gridlocalization.filterselectallstring === o[H].value) {
                                    continue
                                }
                                var m = o[H].value;
                                if (m === undefined) {
                                    m = ""
                                }
                                var b = "equal";
                                if (w == "datefilter") {
                                    var y = J.createfilter(w, m, b, null, F.cellsformat, r.gridlocalization)
                                } else {
                                    var y = J.createfilter(w, m, b, null)
                                }
                                var s = 1;
                                J.addfilter(s, y)
                            }
                        } else {
                            n = false
                        }
                    }
                    if (n) {
                        var C = F.displayfield;
                        this.addfilter(C, J, true)
                    } else {
                        var C = F.displayfield;
                        this.removefilter(C, true)
                    }
                }
            }
        }, _clearfilter: function (e, c, d) {
            var b = d.displayfield;
            this.removefilter(b, true)
        }, addfilter: function (d, e, c) {
            if (this._loading) {
                throw new Error("jqxGrid: " + this.loadingerrormessage);
                return false
            }
            var f = this.getcolumn(d);
            var b = this._getcolumn(d);
            if (f == undefined || f == null) {
                return
            }
            f.filter = e;
            b.filter = e;
            this.dataview.addfilter(d, e);
            if (c == true && c != undefined) {
                this.applyfilters("add")
            }
        }, removefilter: function (d, c) {
            if (this._loading) {
                throw new Error("jqxGrid: " + this.loadingerrormessage);
                return false
            }
            var e = this.getcolumn(d);
            var b = this._getcolumn(d);
            if (e == undefined || e == null) {
                return
            }
            if (e.filter == null) {
                return
            }
            this.dataview.removefilter(d, e.filter);
            e.filter = null;
            b.filter = null;
            if (this.showfilterrow) {
                this.clearfilterrow(d)
            }
            if (c == true || c !== false) {
                this.applyfilters("remove")
            }
        }, applyfilters: function (f) {
            var c = false;
            if (this.dataview.filters.length >= 0 && (this.virtualmode || !this.source.localdata)) {
                if (this.source != null && this.source.filter) {
                    var g = -1;
                    if (this.pageable) {
                        g = this.dataview.pagenum;
                        this.dataview.pagenum = 0
                    } else {
                        this.vScrollInstance.setPosition(0);
                        this.loadondemand = true;
                        this._renderrows(this.virtualsizeinfo)
                    }
                    if (this.pageable && this.virtualmode) {
                        this.dataview.pagenum = 0
                    }
                    this.source.filter(this.dataview.filters, this.dataview.records, this.dataview.records.length);
                    if (this.pageable && !this.virtualmode) {
                        this.dataview.pagenum = g
                    }
                }
            }
            this._cellscache = new Array();
            if (this.dataview.clearsortdata) {
                this.dataview.clearsortdata()
            }
            if (!this.virtualmode) {
                var b = this.selectedrowindexes;
                var d = this.that;
                this.dataview.refresh();
                if (this.dataview.clearsortdata) {
                    if (this.sortcolumn && this.sortdirection) {
                        var e = this.sortdirection.ascending ? "asc" : "desc";
                        if (!this._loading) {
                            this.sortby(this.sortcolumn, e, null, false)
                        } else {
                            this.sortby(this.sortcolumn, e, null, false, false)
                        }
                    }
                }
            } else {
                if (this.pageable) {
                    this.dataview.updateview();
                    if (this.gotopage) {
                        this.gotopage(0)
                    }
                }
                this.rendergridcontent(false, false);
                if (this.showfilterrow) {
                    if (typeof f != "string" && a.isEmptyObject(f)) {
                        this.refreshfilterrow()
                    }
                }
                this._postrender("filter");
                this._raiseEvent(13, {filters: this.dataview.filters});
                return
            }
            if (this.pageable) {
                this.dataview.updateview();
                if (this.gotopage) {
                    this.gotopage(0);
                    this.updatepagerdetails()
                }
            }
            this._updaterowsproperties();
            if (!this.groupable || (this.groupable && this.groups.length == 0)) {
                this._rowdetailscache = new Array();
                this.virtualsizeinfo = null;
                this._pagescache = new Array();
                if (this.columns && this.columns.records && this.columns.records.length > 0 && !this.columns.records[0].filtericon) {
                    this.prerenderrequired = true
                }
                this.rendergridcontent(true, false);
                this._updatecolumnwidths();
                this._updatecellwidths();
                this._renderrows(this.virtualsizeinfo);
                if (this.showaggregates && this._updatecolumnsaggregates) {
                    this._updatecolumnsaggregates()
                }
                this._postrender("filter")
            } else {
                this._rowdetailscache = new Array();
                this._render(true, true, false, false, false);
                if (this.showfilterrow) {
                    this._updatefocusedfilter()
                }
                this._updatecolumnwidths();
                this._updatecellwidths();
                this._renderrows(this.virtualsizeinfo);
                this._postrender("filter")
            }
            if (this.showfilterrow) {
                if (typeof f != "string" && a.isEmptyObject(f)) {
                    this.refreshfilterrow()
                }
            }
            this._raiseEvent(13, {filters: this.dataview.filters})
        }, getfilterinformation: function () {
            var d = new Array();
            for (var b = 0; b < this.dataview.filters.length; b++) {
                var c = this.getcolumn(this.dataview.filters[b].datafield);
                d[b] = {
                    filter: this.dataview.filters[b].filter,
                    datafield: c.datafield,
                    displayfield: c.displayfield,
                    filtercolumn: c.datafield,
                    filtercolumntext: c.text
                }
            }
            return d
        }, clearfilters: function (b) {
            var d = this.that;
            if (this.showfilterrow) {
                this.clearfilterrow()
            }
            if (this.columns.records) {
                var c = b == true || b !== false;
                a.each(this.columns.records, function () {
                    d.removefilter(this.displayfield, !c)
                })
            }
            if (b === false) {
                return
            }
            if (b == true || b !== false) {
                this.applyfilters("clear")
            }
        }, _destroyfilterpanel: function () {
            var e = a(a.find("#filterclearbutton" + this.element.id));
            var d = a(a.find("#filterbutton" + this.element.id));
            var h = a(a.find("#filter1" + this.element.id));
            var c = a(a.find("#filter2" + this.element.id));
            var g = a(a.find("#filter3" + this.element.id));
            var f = a(a.find(".filtertext1" + this.element.id));
            var b = a(a.find(".filtertext2" + this.element.id));
            if (f.length > 0 && b.length > 0) {
                f.removeClass();
                b.removeClass();
                f.remove();
                b.remove()
            }
            if (e.length > 0) {
                e.jqxButton("destroy");
                d.jqxButton("destroy");
                this.removeHandler(e, "click");
                this.removeHandler(d, "click")
            }
            if (h.length > 0) {
                h.jqxDropDownList("destroy")
            }
            if (c.length > 0) {
                c.jqxDropDownList("destroy")
            }
            if (g.length > 0) {
                g.jqxDropDownList("destroy")
            }
            var h = a(a.find("#filter1" + this.element.id + "ex"));
            var c = a(a.find("#filter2" + this.element.id + "ex"));
            var g = a(a.find("#filter3" + this.element.id + "ex"));
            if (h.length > 0) {
                h.jqxDropDownList("destroy")
            }
            if (c.length > 0) {
                c.jqxDropDownList("destroy")
            }
            if (g.length > 0) {
                g.jqxDropDownList("destroy")
            }
        }, _updatefilterpanel: function (s, p, E) {
            if (s == null || s == undefined) {
                s = this
            }
            var Q = s._getcolumntypebydatafield(E);
            var u = s._getfiltersbytype(Q);
            if (!s.host.jqxDropDownList) {
                throw new Error("jqxGrid: Missing reference to jqxdropdownlist.js.");
                return
            }
            s.filterpanel.detach();
            s.excelfilterpanel.detach();
            if (E.filterpanel) {
                E.filterpanel.detach()
            }
            a(p).children().detach();
            var k = a(s.menuitemsarray[6]);
            a(k).css("height", "190px");
            if (E.createfilterpanel && !E.filterpanel) {
                var K = a("<div class='filter' style='margin-left: 7px;'></div>");
                a(p).append(K);
                E.createfilterpanel(E.displayfield, K);
                E.filterpanel = K
            }
            if (E.filtertype === "list" || E.filtertype === "checkedlist") {
                a(p).append(s.excelfilterpanel)
            } else {
                if (E.filtertype !== "custom") {
                    a(p).append(s.filterpanel)
                } else {
                    if (E.filterpanel) {
                        a(p).append(E.filterpanel)
                    }
                }
            }
            var g = a(p);
            var N = g.find("#filterclearbutton" + s.element.id);
            var l = g.find("#filterbutton" + s.element.id);
            var f = g.find(".filter1");
            var m = g.find(".filter2");
            var P = g.find(".filter3");
            var j = g.find(".filtertext1" + s.element.id);
            var h = g.find(".filtertext2" + s.element.id);
            if (this._hasdatefilter && (E.filtertype !== "list" && E.filtertype !== "checkedlist" && E.filtertype !== "custom")) {
                var e = j.parent();
                var d = h.parent();
                e.children().remove();
                d.children().remove();
                if (E.filtertype == "date") {
                    s._showwhere.text(s.gridlocalization.filtershowrowdatestring);
                    var b = a("<div class='filtertext1" + s.element.id + "' style='margin-top: 3px; margin-bottom: 3px;'></div>");
                    e.append(b);
                    var n = function (c) {
                        var i = {
                            calendar: s.gridlocalization,
                            todayString: s.gridlocalization.todaystring,
                            clearString: s.gridlocalization.clearstring
                        };
                        c.jqxDateTimeInput({
                            disabled: s.disabled,
                            firstDayOfWeek: s.gridlocalization.firstDay,
                            localization: i,
                            rtl: s.rtl,
                            width: s._filterpanelwidth - 15,
                            height: 23,
                            value: null,
                            formatString: E.cellsformat,
                            theme: s.theme
                        })
                    };
                    n(b);
                    var b = a("<div class='filtertext2" + s.element.id + "' style='margin-top: 3px; margin-bottom: 3px;'></div>");
                    d.append(b);
                    n(b)
                } else {
                    s._showwhere.text(s.gridlocalization.filtershowrowstring);
                    var b = a("<input class='filtertext1" + s.element.id + "' style='height: 23px; margin-top: 3px; margin-bottom: 3px;' type='text'></input>");
                    e.append(b);
                    var n = function (c) {
                        c.addClass(s.toThemeProperty("jqx-input"));
                        c.addClass(s.toThemeProperty("jqx-widget-content"));
                        c.addClass(s.toThemeProperty("jqx-rc-all"));
                        c.width(s._filterpanelwidth - 21)
                    };
                    n(b);
                    var b = a("<input class='filtertext2" + s.element.id + "' style='height: 23px; margin-top: 3px; margin-bottom: 3px;' type='text'></input>");
                    d.append(b);
                    n(b)
                }
                var j = g.find(".filtertext1" + s.element.id);
                var h = g.find(".filtertext2" + s.element.id)
            }
            if (E.filtertype != "date") {
                j.val("");
                h.val("")
            } else {
                j.val(null);
                h.val(null)
            }
            this.removeHandler(l, "click");
            this.addHandler(l, "click", function () {
                s._buildfilter(s, p, E);
                s._closemenu()
            });
            this.removeHandler(N, "click");
            this.addHandler(N, "click", function () {
                s._clearfilter(s, p, E);
                s._closemenu()
            });
            this.removeHandler(l, "keydown");
            this.addHandler(l, "keydown", function (c) {
                if (c.keyCode === 13) {
                    s._buildfilter(s, p, E);
                    s._closemenu()
                }
            });
            this.removeHandler(N, "keydown");
            this.addHandler(N, "keydown", function (c) {
                if (c.keyCode === 13) {
                    s._clearfilter(s, p, E);
                    s._closemenu()
                }
            });
            this.removeHandler(j, "keydown");
            this.addHandler(j, "keydown", function (c) {
                if (c.keyCode === 13) {
                    l.trigger("click")
                }
                if (c.keyCode === 27) {
                    s._closemenu()
                }
            });
            this.removeHandler(h, "keydown");
            this.addHandler(h, "keydown", function (c) {
                if (c.keyCode === 13) {
                    l.trigger("click")
                }
                if (c.keyCode === 27) {
                    s._closemenu()
                }
            });
            if (this.filtermode === "default" && (E.filtertype !== "list" && E.filtertype !== "checkedlist" && E.filtertype !== "custom")) {
                if (f.jqxDropDownList("source") != u) {
                    f.jqxDropDownList({enableBrowserBoundsDetection: false, source: u});
                    P.jqxDropDownList({enableBrowserBoundsDetection: false, source: u})
                }
                if (Q == "boolean" || Q == "bool") {
                    f.jqxDropDownList({autoDropDownHeight: true, selectedIndex: 0});
                    P.jqxDropDownList({autoDropDownHeight: true, selectedIndex: 0})
                } else {
                    var H = false;
                    if (u && u.length) {
                        if (u.length < 5) {
                            H = true
                        }
                    }
                    f.jqxDropDownList({autoDropDownHeight: H, selectedIndex: 2});
                    P.jqxDropDownList({autoDropDownHeight: H, selectedIndex: 2})
                }
                m.jqxDropDownList({selectedIndex: 0});
                var z = E.filter;
                var M = new a.jqx.filter();
                var x = "";
                switch (Q) {
                    case"number":
                    case"int":
                    case"float":
                    case"decimal":
                        x = "numericfilter";
                        o = M.getoperatorsbyfiltertype("numericfilter");
                        break;
                    case"boolean":
                    case"bool":
                        x = "booleanfilter";
                        o = M.getoperatorsbyfiltertype("booleanfilter");
                        break;
                    case"date":
                    case"time":
                        x = "datefilter";
                        o = M.getoperatorsbyfiltertype("datefilter");
                        break;
                    case"string":
                        x = "stringfilter";
                        o = M.getoperatorsbyfiltertype("stringfilter");
                        break
                }
                if (z != null) {
                    var e = z.getfilterat(0);
                    var d = z.getfilterat(1);
                    var I = z.getoperatorat(0);
                    if (s.updatefilterconditions) {
                        var o = [];
                        var r = s.updatefilterconditions(x, o);
                        if (r != undefined) {
                            for (var O = 0; O < r.length; O++) {
                                r[O] = r[O].toUpperCase()
                            }
                            z.setoperatorsbyfiltertype(x, r);
                            o = r
                        }
                    }
                    var w = "default";
                    if (e != null) {
                        var D = o.indexOf(e.comparisonoperator);
                        var A = e.filtervalue;
                        j.val(A);
                        f.jqxDropDownList({selectedIndex: D, animationType: w})
                    }
                    if (d != null) {
                        var C = o.indexOf(d.comparisonoperator);
                        var y = d.filtervalue;
                        h.val(y);
                        P.jqxDropDownList({selectedIndex: C, animationType: w})
                    }
                    if (z.getoperatorat(0) == undefined) {
                        m.jqxDropDownList({selectedIndex: 0, animationType: w})
                    } else {
                        if (z.getoperatorat(0) == "and" || z.getoperatorat(0) == 0) {
                            m.jqxDropDownList({selectedIndex: 0})
                        } else {
                            m.jqxDropDownList({selectedIndex: 1})
                        }
                    }
                }
                if (s.updatefilterpanel) {
                    s.updatefilterpanel(f, P, m, j, h, l, N, z, x, o)
                }
                if (!this._hasdatefilter || (this._hasdatefilter && E.filtertype != "date")) {
                    if (!this.touchdevice) {
                        j.focus();
                        setTimeout(function () {
                            j.focus()
                        }, 10)
                    }
                }
            } else {
                if (this.filtermode === "excel" || E.filtertype === "list" || E.filtertype === "checkedlist") {
                    var v = s._getfilterdataadapter(E);
                    var x = s._getfiltertype(Q);
                    var L = this.filtermode === "excel" || E.filtertype === "checkedlist";
                    f.jqxListBox("focus");
                    this.removeHandler(f, "keyup");
                    this.addHandler(f, "keyup", function (c) {
                        if (c.keyCode === 13) {
                            l.trigger("click")
                        }
                        if (c.keyCode === 27) {
                            s._closemenu()
                        }
                    });
                    if (E.cellsformat) {
                        f.jqxListBox({
                            checkboxes: L,
                            displayMember: E.displayfield,
                            valueMember: E.displayfield + "JQValue",
                            source: v
                        })
                    } else {
                        f.jqxListBox({
                            checkboxes: L,
                            displayMember: E.displayfield,
                            valueMember: E.displayfield,
                            source: v
                        })
                    }
                    if (L) {
                        f.jqxListBox("insertAt", s.gridlocalization.filterselectallstring, 0);
                        var F = f.data().jqxListBox.instance;
                        F.checkAll(false);
                        var B = this;
                        if (E.filter) {
                            F.uncheckAll(false);
                            var t = E.filter.getfilters();
                            for (var J = 0; J < F.items.length; J++) {
                                var G = F.items[J].value;
                                a.each(t, function () {
                                    if (this.condition == "NOT_EQUAL") {
                                        if (G != this.value) {
                                            F.uncheckIndex(J, false, false);
                                            return false
                                        } else {
                                            if (G != null && this.value != null && G.toString() != this.value.toString()) {
                                                F.uncheckIndex(J, false, false);
                                                return false
                                            }
                                        }
                                    } else {
                                        if (this.condition == "EQUAL") {
                                            if (G == this.value) {
                                                F.checkIndex(J, false, false);
                                                return false
                                            } else {
                                                if (G != null && this.value != null && G.toString() == this.value.toString()) {
                                                    F.checkIndex(J, false, false);
                                                    return false
                                                }
                                            }
                                        }
                                    }
                                })
                            }
                            F._updateCheckedItems();
                            var q = F.getCheckedItems().length;
                            if (F.items.length != q && q > 0) {
                                F.host.jqxListBox("indeterminateIndex", 0, true, false)
                            }
                            if (q === F.items.length - 1) {
                                F.host.jqxListBox("checkIndex", 0, true, false)
                            }
                        }
                    } else {
                        if (E.filter) {
                            var F = f.data().jqxListBox.instance;
                            F.clearSelection();
                            var t = E.filter.getfilters();
                            for (var J = 0; J < F.items.length; J++) {
                                var G = F.items[J].value;
                                a.each(t, function () {
                                    if (this.condition == "NOT_EQUAL") {
                                        if (G != this.value) {
                                            F.unselectIndex(J, false, false);
                                            return false
                                        }
                                    } else {
                                        if (this.condition == "EQUAL") {
                                            if (G == this.value) {
                                                F.selectIndex(J, true, false);
                                                return false
                                            }
                                        }
                                    }
                                })
                            }
                            F._renderItems()
                        }
                    }
                }
            }
        }, _initfilterpanel: function (z, b, c, p, w) {
            if (z == null || z == undefined) {
                z = this
            }
            b[0].innerHTML = "";
            var t = a("<div class='filter' style='margin-left: 7px;'></div>");
            b.append(t);
            var n = a("<div class='filter' style='margin-top: 3px; margin-bottom: 3px;'></div>");
            n.text(z.gridlocalization.filtershowrowstring);
            this._showwhere = n;
            var o = w ? "ex" : "";
            var v = a("<div class='filter filter1' id='filter1" + z.element.id + o + "'></div>");
            var h = a("<div class='filter filter2' id='filter2" + z.element.id + o + "' style='margin-bottom: 3px;'></div>");
            var s = a("<div class='filter filter3' id='filter3" + z.element.id + o + "'></div>");
            var e = z._getcolumntypebydatafield(c);
            if (!v.jqxDropDownList) {
                throw new Error("jqxGrid: jqxdropdownlist.js is not loaded.");
                return
            }
            var q = z._getfiltersbytype(e);
            this._hasdatefilter = false;
            this._filterpanelwidth = p;
            if (this.columns && this.columns.records) {
                for (var u = 0; u < this.columns.records.length; u++) {
                    if (this.columns.records[u].filtertype == "date") {
                        this._hasdatefilter = true;
                        break
                    }
                }
            } else {
                if (this.columns && !this.columns.records) {
                    for (var u = 0; u < this.columns.length; u++) {
                        if (this.columns[u].filtertype == "date") {
                            this._hasdatefilter = true;
                            break
                        }
                    }
                }
            }
            var k = a("<div class='filter'><input class='filtertext1" + z.element.id + "' style='height: 23px; margin-top: 3px; margin-bottom: 3px;' type='text'></input></div>");
            var m = k.find("input");
            m.addClass(this.toThemeProperty("jqx-input"));
            m.addClass(this.toThemeProperty("jqx-widget-content"));
            m.addClass(this.toThemeProperty("jqx-rc-all"));
            m.width(p - 21);
            var l = a("<div class='filter'><input class='filtertext2" + z.element.id + "' style='height: 23px; margin-top: 3px;' type='text'></input></div>");
            var j = l.find("input");
            j.addClass(this.toThemeProperty("jqx-input"));
            j.addClass(this.toThemeProperty("jqx-widget-content"));
            j.addClass(this.toThemeProperty("jqx-rc-all"));
            j.width(p - 21);
            if (z.rtl) {
                m.css("direction", "rtl");
                j.css("direction", "rtl")
            }
            var g = a("<div class='filter' style='height: 25px; margin-left: 20px; margin-top: 7px;'></div>");
            var f = a('<span tabIndex=0 id="filterbutton' + z.element.id + '" class="filterbutton" style="padding: 4px 12px; margin-left: 2px;">' + z.gridlocalization.filterstring + "</span>");
            g.append(f);
            var x = a('<span tabIndex=0 id="filterclearbutton' + z.element.id + '" class="filterclearbutton" style="padding: 4px 12px; margin-left: 5px;">' + z.gridlocalization.filterclearstring + "</span>");
            g.append(x);
            f.jqxButton({height: 20, theme: z.theme});
            x.jqxButton({height: 20, theme: z.theme});
            var y = function (A) {
                if (A) {
                    if (A.text().indexOf("case sensitive") != -1) {
                        var i = A.text();
                        i = i.replace("case sensitive", "match case");
                        A.text(i)
                    }
                    A.css("font-family", z.host.css("font-family"));
                    A.css("font-size", z.host.css("font-size"));
                    A.css("top", "2px");
                    A.css("position", "relative");
                    return A
                }
                return ""
            };
            if (this.filtermode === "default" && !w) {
                t.append(n);
                t.append(v);
                v.jqxDropDownList({
                    _checkForHiddenParent: false,
                    autoItemsHeight: true,
                    rtl: z.rtl,
                    enableBrowserBoundsDetection: false,
                    selectedIndex: 2,
                    width: p - 15,
                    height: 23,
                    dropDownHeight: 150,
                    dropDownWidth: p - 15,
                    selectionRenderer: y,
                    source: q,
                    theme: z.theme
                });
                t.append(k);
                var r = new Array();
                r[0] = z.gridlocalization.filterandconditionstring;
                r[1] = z.gridlocalization.filterorconditionstring;
                h.jqxDropDownList({
                    _checkForHiddenParent: false,
                    rtl: z.rtl,
                    enableBrowserBoundsDetection: false,
                    autoDropDownHeight: true,
                    selectedIndex: 0,
                    width: 60,
                    height: 23,
                    source: r,
                    selectionRenderer: y,
                    theme: z.theme
                });
                t.append(h);
                s.jqxDropDownList({
                    _checkForHiddenParent: false,
                    autoItemsHeight: true,
                    rtl: z.rtl,
                    enableBrowserBoundsDetection: false,
                    selectedIndex: 2,
                    width: p - 15,
                    height: 23,
                    dropDownHeight: 150,
                    dropDownWidth: p - 15,
                    selectionRenderer: y,
                    source: q,
                    theme: z.theme
                });
                t.append(s);
                t.append(l)
            } else {
                if (this.filtermode === "excel" || w) {
                    t.append(n);
                    t.append(v);
                    v.attr("tabindex", 0);
                    v.jqxListBox({
                        rtl: z.rtl,
                        _checkForHiddenParent: false,
                        checkboxes: true,
                        selectedIndex: 2,
                        width: p - 15,
                        height: 130,
                        theme: z.theme
                    });
                    var d = true;
                    z.addHandler(v, "checkChange", function (B) {
                        if (!d) {
                            return
                        }
                        if (B.args.label != z.gridlocalization.filterselectallstring) {
                            d = false;
                            v.jqxListBox("checkIndex", 0, true, false);
                            var i = v.jqxListBox("getCheckedItems");
                            var A = v.jqxListBox("getItems");
                            if (i.length == 1) {
                                v.jqxListBox("uncheckIndex", 0, true, false)
                            } else {
                                if (A.length != i.length) {
                                    v.jqxListBox("indeterminateIndex", 0, true, false)
                                }
                            }
                            d = true
                        } else {
                            d = false;
                            if (B.args.checked) {
                                v.jqxListBox("checkAll", false)
                            } else {
                                v.jqxListBox("uncheckAll", false)
                            }
                            d = true
                        }
                    })
                }
            }
            t.append(g);
            if (z.updatefilterpanel) {
                z.updatefilterpanel(v, s, h, k, l, f, x, null, null, q)
            }
        }
    })
})(jqxBaseFramework);

