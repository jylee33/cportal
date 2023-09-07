var HmColorPicker = {
    create: function(ddb, cp, color) {
        ddb.jqxDropDownButton({width: 100, height: 20});
        cp.jqxColorPicker({width: 220, height: 220, colorMode: 'hue'})
            .off('colorchange')
            .on('colorchange', function(event) {
                // var ddbKey = $(event.currentTarget).data('ddbkey');
                // var ddb = $('#'+ddbKey);
                // if(ddb == null) return;
                ddb.jqxDropDownButton('setContent', HmColorPicker.getTextElementByColor(event.args.color));
            });
        cp.jqxColorPicker('setColor', color || '#a3a3a3');
    },

    getTextElementByColor: function(color) {
        if (color == 'transparent' || color.hex == "") {
            return $("<div style='text-shadow: none; position: relative; padding-bottom: 2px; margin-top: 2px;'>transparent</div>");
        }
        var element = $("<div style='text-shadow: none; position: relative; padding-bottom: 2px; margin-top: 2px;'>#" + color.hex + "</div>");
        var nThreshold = 105;
        var bgDelta = (color.r * 0.299) + (color.g * 0.587) + (color.b * 0.114);
        var foreColor = (255 - bgDelta < nThreshold) ? 'Black' : 'White';
        element.css('color', foreColor);
        element.css('background', "#" + color.hex);
        element.addClass('jqx-rc-all');
        return element;
    }
};


var HmSlider = {
    createPercent: function(slider, input, width) {
        slider.jqxSlider({
            showTickLabels: false, ticksPosition: 'top', tickSize: 4, tooltip: true, showButtons: false, mode: "fixed", width: width || 180, height: 20,
            min: 0, max: 100, ticksFrequency: 25, value: 70, step: 1, theme: jqxTheme,
            tickLabelFormatFunction: function (value)
            {
                if (value == 0) return value;
                if (value == 100) return value;
                return "";
            }
        }).off('change').on('change', function(event) {
            input.val(Math.floor(event.args.value));
        });
        input.off('keyup').on('keyup', function(event) {
            slider.val(this.value);
        }).val(70);
    }
}

