// Ext.ns('Ext.ux.plugins');
// /**
//  * Plugin to autosize grid columns to the width of the widest content by dblclicking the header split
//  */
// Ext.ux.plugins.ColumnAutoResizer = Ext.extend(Ext.util.Observable, {
//     init: function(grid) {
//         this.grid = grid;
//         this.view = grid.getView();
//         this.cm = grid.getColumnModel();
//         grid.on('render', this.initEvents, this);
//     },
//     initEvents: function() {
//         // remove default headerclick listener
//         this.grid.un("headerclick", this.view.onHeaderClick, this.view);
//         // create an interceptor function to check whether the cursor is on split or not
//         var fn = this.view.onHeaderClick.createInterceptor(this.beforeHeaderClick, this);
//         // apply this as new headerclick listener
//         this.grid.on("headerclick", fn, this.view);
//         // add a listener for headerdblclick
//         this.grid.on("headerdblclick", this.onHeaderDblClick, this);
//     },
//     beforeHeaderClick: function() {
//         // return false if headers aren't enabled or the cursor is on header split
//         // this prevents sorting of the current column
//         return !(this.view.headerDisabled || this.isResizeCursor());
//     },
//     isResizeCursor: function() {
//         // return true if the cursor is on header split
//         return this.view.activeHd.style.cursor == (Ext.isAir ? 'move' : Ext.isWebKit ? 'w-resize' : 'col-resize');
//     },
//     // fires on headerdblclick
//     onHeaderDblClick: function(g, index, e) {
//         // stop and return if headers ar disabled, the cursor isn't on header split or the view has no rows
//         if (this.view.headerDisabled || !this.isResizeCursor() || !this.view.hasRows()) return;

//         e.stopEvent();
//         // stop editing in editor grid
//         g.stopEditing(true);

//         // check whether the cursor is on beginning of the next column
//         var hw = this.view.splitHandleWidth || 5;
//         var r = this.view.activeHdRegion;
//         var x = e.getPageX();
//         // if so, set index to previous column
//         if (x - r.left <= hw) index--;
//         // skip hidden columns
//         while (index > 0 && this.cm.isHidden(index)) index--;
//         // resize column to width of widest content
//         if (this.cm.isResizable(index)) this.resize(index);
//     },
//     // resize column width of the specified column to its widest content
//     resize: function(index) {
//         var r = this.view.getRows().length; // get rowcount
//         var c, w, s = 0;
//         // looping through the rows
//         for (var i = 0; i < r; i++) {
//             c = Ext.fly(this.view.getCell(i, index)); // get cell element
//             w = c.getPadding('lr'); // add padding to content width
//             c = c.first('.x-grid3-cell-inner'); // get inner cell element
//             // add margins, padding and textwidth to content width
//             w += c.getMargins('lr') + c.getPadding('lr') + c.getTextWidth(Ext.util.Format.stripTags(c.innerHTML));
//             // find maximum
//             s = Math.max(s, w);
//         }
//         // set the column width to maximum
//         this.view.onColumnSplitterMoved(index, s);
//     }
// });




Ext.ns('Ext.ux.grid');
(function () {
    var cursorRe = /^(?:col|e|w)-resize$/;
    Ext.ux.grid.AutoSizeColumns = Ext.extend(Object, {
        cellPadding: 8,
        constructor: function (config) {
            Ext.apply(this, config);
        },
        init: function (grid) {
            var view = grid.getView();
            view.onHeaderClick = view.onHeaderClick.createInterceptor(this.onHeaderClick);
            grid.on('headerdblclick', this.onHeaderDblClick.createDelegate(view, [this.cellPadding], 3));
        },
        onHeaderClick: function (grid, colIndex) {
            var el = this.getHeaderCell(colIndex);
            if (cursorRe.test(el.style.cursor)) {
                return false;
            }
        },
        onHeaderDblClick: function (grid, colIndex, e, cellPadding) {
            var el = this.getHeaderCell(colIndex), width, rowIndex, count;
            if (!cursorRe.test(el.style.cursor)) {
                return;
            }
            if (e.getXY()[0] - Ext.lib.Dom.getXY(el)[0] <= 5) {
                colIndex--;
                el = this.getHeaderCell(colIndex);
            }
            if (this.cm.isFixed(colIndex) || this.cm.isHidden(colIndex)) {
                return;
            }
            el = el.firstChild;
            el.style.width = '0px';
            width = el.scrollWidth;
            el.style.width = 'auto';
            for (rowIndex = 0, count = this.ds.getCount(); rowIndex < count; rowIndex++) {
                el = this.getCell(rowIndex, colIndex).firstChild;
                el.style.width = '0px';
                width = Math.max(width, el.scrollWidth);
                el.style.width = 'auto';
            }
            this.onColumnSplitterMoved(colIndex, width + cellPadding);
        }
    });
})();
Ext.preg('autosizecolumns', Ext.ux.grid.AutoSizeColumns);