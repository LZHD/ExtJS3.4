var TreeTimeOut = function () {
    return {
        //方法一
        //重写TreeLoader的requestData方法
        requestRewrite: function () {
            Ext.override(Ext.tree.TreeLoader, {
                requestData: function (node, callback, scope) {
                    if (this.fireEvent("beforeload", this, node, callback) !== false) {
                        if (this.directFn) {
                            var args = this.getParams(node);
                            args.push(this.processDirectResponse.createDelegate(this, [{
                                callback: callback,
                                node: node,
                                scope: scope
                            }], true));
                            this.directFn.apply(window, args);
                        } else {
                            this.transId = Ext.Ajax.request({
                                method: this.requestMethod,
                                url: this.dataUrl || this.url,
                                success: this.handleResponse,
                                failure: this.handleFailure,
                                timeout: this.timeout || 30000,// 超时处理
                                scope: this,
                                argument: {callback: callback, node: node, scope: scope},
                                params: this.getParams(node)
                            });
                        }
                    } else {
                        this.runCallback(callback, scope || node, []);
                    }
                }
            });
        },
        //方法二
        directFn: function (nodeId, callback, url, timeout) {
            Ext.Ajax.request({
                url: url,//'./data/tree.json'
                method: 'POST',
                timeout: timeout || 30000,// 超时处理
                success: function (response, opts) {
                    var treeData = Ext.decode(response.responseText);
                    callback(treeData, {
                        status: true
                    })
                },
                failure: function (form, action) {
                    parent.Ext.ux.Toast.msg('操作提示：', '操作失败');
                }
            });
        }
    }
}();