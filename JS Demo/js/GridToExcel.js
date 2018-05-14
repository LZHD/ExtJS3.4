 function ExtGridToExcel(title,Grid,rowNum,codeType){
 	this.title=title;//Excel标题
 	this.Grid=Grid;//Grid对象
 	this.rowNum=rowNum;//表头的行数
 	this.codeType=codeType;//设置编码格式 UTF-8或ANSI

 	this.arrHeaderTr=new Array(rowNum);//按行存储表头信息
 	
	this.titleTr='<tr>  <th colspan = "'+Grid.initialConfig.columns.length+'" rowspan="1">'+title+'</th> </tr>';
 	this.arrField=new Array();//存储DataIndex数组
 	this.columns=Grid.initialConfig.columns;
 	this.nodeNum=0;//这是个临时变量
 	this.initArrHeaderTr();//初始化arrHeaderTr 数组
 	this.getHeader(this.columns,0);

 	//设置表头
 	this.theadStr="";
 	this.setTheadStr();
 	//设置数据
 	this.tbodyStr="";
 	this.setTbodyStr();
 	//输出html格式的Excel字符串
 	this.html=this.initHtml();
 }

 ExtGridToExcel.prototype = {
	constructor: ExtGridToExcel,//原型字面量方式会将对象的constructor变为Object，此外强制指回Person
	downloadExcelXml: function () {

		var location = 'data:application/vnd.ms-excel;base64,' + Base64.encode(this.html);

		var isSupportDownload = 'download' in document.createElement('a'); //当前浏览器是否支持download属性

		if (isSupportDownload) {
			var gridEl = this.Grid.getEl();
			var el = Ext.DomHelper.append(gridEl, {
				id: 'downloadExcel',
				tag: "a",
				download: this.title + "-" + new Date().format('Y-m-d') + '.xls',
				href: location
			});
			el.click();
			Ext.removeNode(Ext.fly('downloadExcel').dom);
		} else {
			document.location = location;
		}

	},
    getHeader: function (columns,num) {
    	for (var i = 0; i < columns.length; i++) {
            var col=columns[i];
            var dataIndex=col.dataIndex;
            var header=col.header;
            if (header==undefined){
                header=col.text;
            }

            if (typeof(dataIndex) == "undefined") {
            	
            	this.nodeNum=0;
            	this.getNodeNum(col.columns);
            	/*this.arrHeaderTr[num]+='<th colspan = "'+this.nodeNum+'" rowspan="1">'+header+'</th>';*/
            	this.arrHeaderTr[num]+='<th colspan = "'+this.nodeNum+'" rowspan="1">'+header+'</th>';
            	var abc=num+1;
            	this.getHeader(col.columns,abc);

            }else{
            	this.arrHeaderTr[num]+='<th colspan = "1" rowspan="'+(this.rowNum-num)+'">'+header+'</th>';
            	this.arrField.push(dataIndex);
            }

         }
        return this.arrHeaderTr;
    },
    getNodeNum:function(columns){
    	for (var i = 0; i < columns.length; i++) {
    		var col=columns[i];
            var dataIndex=col.dataIndex;
            if (typeof(dataIndex) == "undefined") {
            	this.getNodeNum(col.columns);
            }else{
            	this.nodeNum++;
            }
    	}

    },
    initArrHeaderTr:function(){
    	for (var i = 0; i < this.arrHeaderTr.length; i++) {
    		this.arrHeaderTr[i]="";
    	}
    },
    setTheadStr:function(){
    	for (var i = 0; i < this.arrHeaderTr.length; i++) {
    	
    		this.theadStr+="<tr>"+this.arrHeaderTr[i]+"</tr>";
    	}
    	this.theadStr="<thead>"+this.titleTr+this.theadStr+"</thead>";
    },
    setTbodyStr:function(){
    	var store=this.Grid.getStore();
    	for (var i = 0; i < store.getCount(); i++) {
			var record = store.getAt(i);
			//alert(record.get('due'));
			 var  td="";
		    for (var j = 0; j < this.arrField.length; j++) {
		    	td=td+"<td>"+record.get(this.arrField[j])+"</td>";
		    }
		    this.tbodyStr=this.tbodyStr+"<tr>"+td+"</tr>";
		}

    },
    initHtml:function(){
    	return '<html'+
				'    xmlns:o="urn:schemas-microsoft-com:office:office"'+
				'    xmlns:x="urn:schemas-microsoft-com:office:excel"'+
				'    xmlns="http://www.w3.org/TR/REC-html40">'+
				'    <head>'+
				'        <meta http-equiv="Content-Type" content="text/html; charset='+this.codeType+'">'+
				
				'        </head>'+
				'        <body>'+
				'            <table>'+this.theadStr+
				'                <tbody>'+this.tbodyStr+
				'                </tbody>'+
				'            </table>'+
				'        </body>'+
				'    </html>';

    }
}

