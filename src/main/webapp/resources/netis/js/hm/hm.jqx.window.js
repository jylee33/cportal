var HmWindow = {
    create: function ($pwin, pWidth, pHeight, modalZIndex) {
        if (pWidth === undefined) pWidth = 100;
        if (pHeight === undefined) pHeight = 100;
        if (modalZIndex === undefined) modalZIndex = 300;

        var _maxWidth = screen.availWidth || 1280, _maxHeight = screen.availHeight || 720;
        $pwin.jqxWindow({
            maxWidth: _maxWidth, maxHeight: _maxHeight, width: pWidth, height: pHeight, content: 'Loading...',
            resizable: false, isModal: true, position: 'center', modalOpacity: 0.1, autoOpen: false, closeButtonSize: 40
            , modalZIndex: modalZIndex
        });
    },

    setSize: function ($pwin, w, h) {
        // 18.06.21] maxHeight가 h로 받은값보다 작을때 maxHeight 값을 변경하여 세팅한다.
        var maxHeight = 720;
        if (h > 720) {
            maxHeight = h;
            $pwin.jqxWindow({maxHeight: maxHeight}); // 먼저 세팅해줘야 height 값이 제대로 적용된다.
        }
        $pwin.jqxWindow({width: w, height: h});
    },

    open: function ($pwin, title, content, w, h, fnInit, fnInitParam, p2close) {
        if (w != null && h != null) {
            HmWindow.setSize($pwin, w, h);
        }
        if (title) {
            title = title.replace(/\</ig, '&lt;').replace(/\>/ig, '&gt;');
        }
        $pwin.jqxWindow({
            title: '<h1>' + title + '</h1>', content: content, position: 'center', resizable: false, // modalZIndex: 180,
            initContent: function () {
                try {
                    //if (fnInit) {
                        if (fnInit == null || fnInit == undefined) {
                            if (typeof pwindow_init === 'function') pwindow_init(fnInitParam);
                        } else {
                            fnInit = window[fnInit];
                            if (typeof fnInit === 'function') fnInit(fnInitParam);
                        }
                    //}
                } catch (e) {
                }
            }
        })
            .off('open').off('close', null)
            .on('close', function (event) {
                try {
                    if (typeof pwindow_close === 'function') pwindow_close();
                    // 색상 팔레트 제거
                    if ($('.sp-container').length > 0) $('.sp-container').remove();
                } catch (e) {
                }
            });

        if (p2close !== undefined) {
            $pwin.off('close', null)
                .on('close', function (event) {
                    try {
                        if (typeof p2close === 'function') p2close();
                    } catch (e) {
                    }
                });
        }
        $pwin.jqxWindow('open');
    },
    open_new: function ($pwin, title, content, _SIZE_OBJ, fnInit, fnInitParam, p2close) {
        if (_SIZE_OBJ.w != null && _SIZE_OBJ.h != null) {
            HmWindow.setSize($pwin, _SIZE_OBJ.w, _SIZE_OBJ.h);
        }
        if (title) {
            title = title.replace(/\</ig, '&lt;').replace(/\>/ig, '&gt;');
        }
        $pwin.jqxWindow({
            title: '<h1>' + title + '</h1>', content: content, resizable: true, //position: _SIZE_OBJ.position != null? _SIZE_OBJ.position : {x: 15, y:100}, // modalZIndex: 180,
            //position: _SIZE_OBJ.position,
            initContent: function () {
                try {
                    //if (fnInit) {
                        if (fnInit == null || fnInit == undefined) {
                            if (typeof pwindow_init === 'function') pwindow_init(fnInitParam);
                        } else {
                            fnInit = window[fnInit];
                            if (typeof fnInit === 'function') fnInit(fnInitParam);
                        }
                    //}
                } catch (e) {
                }
            }
        }).off('open').off('close', null);

        if (p2close !== undefined) {
            $pwin.off('close', null)
                .on('close', function (event) {
                    try {
                        if (typeof p2close === 'function') p2close();
                    } catch (e) {
                    }
                });
        }
        $pwin.jqxWindow('open');
    },

    openFit: function ($pwin, title, content, w, h, fnInit, fnInitParam, p2close) {

        if (w != null && h != null) {
            HmWindow.setSize($pwin, w, h);
        }
        if (title) {
            title = title.replace(/\</ig, '&lt;').replace(/\>/ig, '&gt;');
        }
        $pwin.jqxWindow({
            title: '<h1>' + title + '</h1>', content: content, position: 'center', resizable: false, // modalZIndex: 180,
            initContent: function () {
                try {
                    //if (fnInit) {
                        if (fnInit == null || fnInit == undefined) {
                            if (typeof pwindow_init === 'function') pwindow_init(fnInitParam);
                        } else {
                            fnInit = window[fnInit];
                            if (typeof fnInit === 'function') fnInit(fnInitParam);
                        }
                    //}
                } catch (e) {
                }
            }
        })
            .off('open').on('open', function (event) {
            var bottom_layer = $(this).find('div.p_bottom_btnlayer');
            if (bottom_layer.length == 0) return;
            var top = $(bottom_layer).position().top;
            // calculate jqxWindow.height & move to center
            $(this).jqxWindow({height: (top + 35) + 'px'});
            var cx = ($(window).width() / 2) - ($(this).width() / 2),
                cy = ($(window).height() / 2) - ($(this).height() / 2);
            $(this).jqxWindow('move', cx, cy);
        })
            .off('close', null).on('close', function (event) {
            try {
                // 색상 팔레트 제거
                if ($('.sp-container').length > 0) $('.sp-container').remove();
                if (typeof pwindow_close === 'function') pwindow_close();
            } catch (e) {
            }
        });
        if (p2close !== undefined) {
            $pwin.off('close', null)
                .on('close', function (event) {
                    try {
                        if (typeof p2window_close === 'function') p2window_close();
                    } catch (e) {
                    }
                });
        }
        $pwin.jqxWindow({ dragArea: { left: 0, top: 85, width: $(window).width(), height: $(window).height() - 85 }}); // 메뉴랑 레이아웃 겹치지 않도록 하기 위해
        $pwin.jqxWindow('open');
    },


    openFit2: function ($pwin, title, content, w, h, fnInit, fnInitParam) {

        if (w != null && h != null) {
            HmWindow.setSize($pwin, w, h);
        }
        if (title) {
            title = title.replace(/\</ig, '&lt;').replace(/\>/ig, '&gt;');
        }
        $pwin.jqxWindow({
            title: '<h1>' + title + '</h1>', content: content, position: 'center', resizable: false, // modalZIndex: 180,
            initContent: function () {
                try {
                    //if (fnInit) {
                    if (fnInit == null || fnInit == undefined) {
                        if (typeof pwindow_init === 'function') pwindow_init(fnInitParam);
                    } else {
                        fnInit = window[fnInit];
                        if (typeof fnInit === 'function') fnInit(fnInitParam);
                    }
                    //}
                } catch (e) {
                }
            }
        })
            .off('open').on('open', function (event) {
            var bottom_layer = $(this).find('div.p_bottom_btnlayer');
            if (bottom_layer.length == 0) return;
            var top = $(bottom_layer).position().top;
            // calculate jqxWindow.height & move to center
            $(this).jqxWindow({height: (top + 35) + 'px'});
            var cx = ($(window).width() / 2) - ($(this).width() / 2),
                cy = ($(window).height() / 2) - ($(this).height() / 2);
            $(this).jqxWindow('move', cx, cy);
        });
        //     .off('close', null).on('close', function (event) {
        //     try {
        //         // 색상 팔레트 제거
        //         if ($('.sp-container').length > 0) $('.sp-container').remove();
        //         if (typeof pwindow_close === 'function') pwindow_close();
        //     } catch (e) {
        //     }
        // });

        $pwin.jqxWindow({ dragArea: { left: 0, top: 85, width: $(window).width(), height: $(window).height() - 85 }}); // 메뉴랑 레이아웃 겹치지 않도록 하기 위해
        $pwin.jqxWindow('open');
    },

    close: function ($pwin) {
        try {
            if (typeof pwindow_close === 'function') pwindow_close();
        } catch (e) {
        }
        $pwin.jqxWindow('close');
    },


    destroy: function (event) {

//			$(event.currentTarget.offsetParent).jqxWindow('close');
        var $pwin = $(event.currentTarget).parents('div.jqx-window');
        $pwin.jqxWindow('close');

        if (typeof topo_menu_action !== "undefined") topo_menu_action.popup = null;

        // 색상 팔레트 제거
        if ($('.sp-container').length > 0) $('.sp-container').remove();

    },

    createNewWindow: function (id) {
        try {
            var pwin = $('#' + id);
            if (pwin.length == 0) {
                pwin = $('<div id="{0}" style="position: absolute;"></div>'.substitute(id));
                pwin.append($('<div></div>'));
                pwin.append($('<div></div>'));
                $('body').append(pwin);
            }
            HmWindow.create(pwin);
            return pwin;
        } catch (e) {
        }
    },

    resize: function (pwin) {
        var bottom_layer = pwin.find('div.p_bottom_btnlayer'),
            top = $(bottom_layer).position().top;
        pwin.jqxWindow({height: (top + 35) + 'px'});
        var cx = ($(window).width() / 2) - (pwin.width() / 2),
            cy = ($(window).height() / 2) - (pwin.height() / 2);
        pwin.jqxWindow('move', cx, cy);
    }

};