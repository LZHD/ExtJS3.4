//支持Ext.grid.GroupingView 分组全选
Ext.override(Ext.grid.GroupingView, {
    initTemplates: function () {
        Ext.grid.GroupingView.superclass.initTemplates.call(this);
        this.state = {};

        var sm = this.grid.getSelectionModel();
        sm.on(sm.selectRow ? 'beforerowselect' : 'beforecellselect',
            this.onBeforeRowSelect, this);

        if (!this.startGroup) {
            var groupCheckBox = '';
            if (sm.header)
                groupCheckBox = '<div class="x-grid3-hd-inner x-grid3-hd-checker" unselectable="on" style="width:20px;float:left;padding:0"><div class="x-grid3-hd-checker" groupid="{groupId}">&nbsp;</div></div>'
            this.startGroup = new Ext.XTemplate(
                '<div id="{groupId}" class="x-grid-group {cls}">',
                '<div id="{groupId}-hd" class="x-grid-group-hd" style="{style}"><div class="x-grid-group-title">', groupCheckBox, this.groupTextTpl, '</div></div>',
                '<div id="{groupId}-bd" class="x-grid-group-body">'
            );
        }
        this.startGroup.compile();

        if (!this.endGroup) {
            this.endGroup = '</div></div>';
        }
    },
    processEvent: function(name, e){
        Ext.grid.GroupingView.superclass.processEvent.call(this, name, e);
        var hd = e.getTarget('.x-grid-group-hd', this.mainBody);
        if(hd){

            var field = this.getGroupField(),
                prefix = this.getPrefix(field),
                groupValue = hd.id.substring(prefix.length),
                emptyRe = new RegExp('gp-' + Ext.escapeRe(field) + '--hd');


            groupValue = groupValue.substr(0, groupValue.length - 3);


            if(groupValue || emptyRe.test(hd.id)){
                this.grid.fireEvent('group' + name, this.grid, field, groupValue, e);
            }
            if(name == 'mousedown' && e.button == 0){
                this.triggerSelect = true;
                //this.toggleGroup(hd.parentNode);
            }
        }

    },
    interceptMouse: function (e) {
        var hd = e.getTarget('.x-grid-group-hd', this.mainBody);
        if (hd) {
            e.stopEvent();
            var che = e.getTarget('.x-grid3-hd-checker', this.mainBody);
            if (che) {
                this.toggleGroup(hd.parentNode, true);
                this.toggleSelectGroup(che);
            } else
                this.toggleGroup(hd.parentNode);
        }
    },
    toggleSelectGroup: function (che) {
        var phd = Ext.fly(che.parentNode);
        var isChecked = phd.hasClass('x-grid3-hd-checker-on');
        var groupId = che.attributes.groupid.value;
        var arr = groupId.split('-');
        var groupFiled = arr[arr.length - 2];
        var groupValue = arr[arr.length - 1];
        var s = this.grid.store;
        if (isChecked) {
            phd.removeClass('x-grid3-hd-checker-on');
            for (i = 0; i < s.getCount(); i++) {
                if (s.getAt(i).get(groupFiled) == groupValue)
                    this.grid.selModel.deselectRow(i);
            }
        } else {
            phd.addClass('x-grid3-hd-checker-on');
            for (i = 0; i < s.getCount(); i++) {
                if (s.getAt(i).get(groupFiled) == groupValue)
                    this.grid.selModel.selectRow(i, true);
            }

        }

    }
});