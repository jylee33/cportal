var HmJqxSplitter = {
	ORIENTATION_V: 'vertical',
	ORIENTATION_H: 'horizontal',

	PANELS: {
		TREE_LAYER: [{ size: 254, collapsible: true }, { size: '100%' }]
	},

	create: function($obj, orientation, panels, w, h, options) {
		var defOpts = { width: w || '100%', height: h || '100%', theme: jqxTheme, orientation: orientation || 'vertical',
			panels: panels || this.PANELS.TREE_LAYER,
			splitBarSize: 3} ;
		$.extend(defOpts, options);
		$obj.jqxSplitter(defOpts);
		return $obj;
	},

    createFull: function($obj, orientation, panels) {
        var defOpts = { width: '100%', height: '100%', theme: jqxTheme, orientation: orientation || 'vertical',
            panels: panels || this.PANELS.TREE_LAYER } ;
        $obj.jqxSplitter(defOpts);
        return $obj;
    },

	createTree: function($obj) {
		return this.create($obj, this.ORIENTATION_V, [{size: 254, collapsible: true}, {size: '100%'}]);
	}

};