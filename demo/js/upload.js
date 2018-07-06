/** 
 * @class Ext.form.FileUploadField 
 * @extends Ext.form.TwinTriggerField 
 */  
Ext.form.FileUploadField = Ext.extend(Ext.form.TwinTriggerField, {  
    getTrigger : Ext.form.TwinTriggerField.prototype.getTrigger,  
    initTrigger : Ext.form.TwinTriggerField.prototype.initTrigger,  
    hideTrigger1 : true,  
    trigger1Class : 'x-form-clear-trigger',  
    trigger2Class : 'x-form-file-trigger',  
    validationEvent : false,  
    validateOnBlur : false,  
    editable : false,  
    enableClearBtn : true,//是否启用清除选择文件按钮  
  
    initComponent : function() {  
        Ext.form.FileUploadField.superclass.initComponent.call(this);  
  
        // add the CSS here so we don't have to include it  
        if (Ext.util.CSS.getRule('.x-form-file') == null) {  
            var styleBody = '.x-form-file-cabinet {position: relative;}'  
                    + '.x-form-file-wrapper {position: absolute; display: block; height: 22px; width: 18px; overflow: hidden;}'  
                    + '.x-form-file {cursor: pointer; position: absolute; height: 22px; right: 0; opacity: 0; -moz-opacity: 0; filter: alpha(opacity=0);}';  
  
            var styleSheet = Ext.util.CSS.createStyleSheet('/* Ext.form.FileUploadField stylesheet */\n' + styleBody, 'FileUploadField');  
            Ext.util.CSS.refreshCache();  
        }  
  
        this.addEvents(  
                /** 
                 * @event fileselected Fires when the underlying file input 
                 *        field's value has changed from the user selecting a 
                 *        new file from the system file selection dialog. 
                 * @param {Ext.form.FileUploadField} this 
                 * @param {String} value The file value returned by the underlying file input field 
                 */  
                'fileselected');  
  
        this.triggerConfig = {  
            tag : 'span',  
            cls : 'x-form-twin-triggers',  
            cn : [{  
                        tag : 'img',  
                        src : Ext.BLANK_IMAGE_URL,  
                        cls : 'x-form-trigger ' + this.trigger1Class  
                    }, {  
                        tag : 'img',  
                        src : Ext.BLANK_IMAGE_URL,  
                        cls : 'x-form-trigger ' + this.trigger2Class  
                    }, {  
                        tag : 'span',  
                        cls : 'x-form-file-cabinet',  
                        cn : [{  
                                    tag : 'div',  
                                    id : this.getFileWrapperId(),  
                                    cls : 'x-form-file-wrapper'  
                                }]  
                    }]  
        };  
    },  
  
    onRender : function(ct, position) {  
        Ext.form.FileUploadField.superclass.onRender.call(this, ct,position);  
        this.wrapper = Ext.get(this.getFileWrapperId());  
  
        this.createFileInput();  
        this.bindListeners();  
  
        this.getTrigger(1).on({  
                    mousemove : {  
                        fn : function() {  
                            this.wrapper.setXY(this.getTrigger(1).getXY())  
                        },  
                        scope : this  
                    }  
                });  
    },  
  
    bindListeners : function() {  
        this.fileInput.on({  
            scope : this,  
            mouseenter : function() {  
                this.getTrigger(1).addClass('x-form-trigger-over')  
            },  
            mouseleave : function() {  
                this.getTrigger(1).removeClass('x-form-trigger-over')  
            },  
            mousedown : function() {  
                this.getTrigger(1).addClass('x-form-trigger-click')  
            },  
            mouseup : function() {  
                this.getTrigger(1).removeClass('x-form-trigger-click')  
            },  
            change : {  
                fn : this.handleFile,  
                scope : this  
            }  
        });  
    },  
  
    reset : function() {  
        Ext.form.FileUploadField.superclass.reset.call(this);  
        this.fileInput.remove();  
        this.createFileInput();  
        this.bindListeners();  
        if(this.enableClearBtn){  
            this.getTrigger(0).hide();  
        }  
    },  
  
    setValue : Ext.form.TwinTriggerField.prototype.setValue.createSequence(function(v) {  
        this.getEl().dom.qtip = v;  
        this.getEl().dom.qwidth = Ext.util.TextMetrics.measure(this.getEl(), v).width + 12;  
  
        if (Ext.QuickTips) {  
            Ext.QuickTips.enable();  
        }  
    }),  
  
    handleFile : function() {  
        // if this is unix style structure replace / with \  
        var filePath = this.fileInput.dom.value.replace(/\//g, '\\');  
  
        // extract the filename from the value  
        var indexPos = filePath.lastIndexOf('\\');  
        var fileName = filePath.substring(indexPos + 1);  
  
        this.setValue(fileName);  
        this.fireEvent('fileselected', this, fileName);  
        if(this.enableClearBtn){  
            this.getTrigger(0).show();  
        }  
    },  
  
    onDestroy : function() {  
        Ext.form.FileUploadField.superclass.onDestroy.call(this);  
        Ext.destroy(this.fileInput, this.wrapper);  
    },  
  
    onDisable : function() {  
        Ext.form.FileUploadField.superclass.onDisable.call(this);  
        this.doDisable(true);  
    },  
  
    onEnable : function() {  
        Ext.form.FileUploadField.superclass.onEnable.call(this);  
        this.doDisable(false);  
    },  
  
    doDisable : function(disabled) {  
        this.fileInput.dom.disabled = disabled;  
    },  
  
    preFocus : Ext.emptyFn,  
  
    onTrigger1Click : function() {  
        this.clearValue();  
        if(this.enableClearBtn){  
            this.getTrigger(0).hide();  
        }  
        this.fileInput.remove();  
        this.createFileInput();  
        this.bindListeners();  
    },  
  
    createFileInput : function() {  
        this.fileInput = this.wrapper.createChild({  
            id : this.getFileInputId(),  
            name : this.name || this.getId(),  
            cls : 'x-form-file',  
            tag : 'input',  
            type : 'file',  
            width : 1  
        });  
    },  
  
    clearValue : function() {  
        this.setRawValue('');  
        this.setValue('');  
        this.value = '';  
    },  
  
    getFileInputId : function() {  
        return this.id + '-file';  
    },  
  
    getFileWrapperId : function() {  
        return this.id + '-wrapper';  
    }  
});  
Ext.reg('fileuploadfield', Ext.form.FileUploadField);