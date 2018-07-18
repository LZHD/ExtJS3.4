//重写Treeloader的requestData方法,添加超时处理
Ext.override(Ext.tree.TreeLoader, {
    requestData : function(node, callback, scope){
        if(this.fireEvent("beforeload", this, node, callback) !== false){
            if(this.directFn){
                var args = this.getParams(node);
                args.push(this.processDirectResponse.createDelegate(this, [{callback: callback, node: node, scope: scope}], true));
                this.directFn.apply(window, args);
            }else{
                this.transId = Ext.Ajax.request({
                    method:this.requestMethod,
                    url: this.dataUrl||this.url,
                    success: this.handleResponse,
                    failure: this.handleFailure,
                    timeout: this.timeout || 30000,//超时处理
                    scope: this,
                    argument: {callback: callback, node: node, scope: scope},
                    params: this.getParams(node)
                });
            }
        }else{
            this.runCallback(callback, scope || node, []);
        }
    }
});