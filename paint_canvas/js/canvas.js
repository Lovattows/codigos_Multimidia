$(document).ready(function () {
    let canvas = document.getElementById("myCanvas");
    let context = canvas.getContext("2d");

    let myDrawing = {
        currentStartX: undefined,
        currentStartY: undefined,
        allShapes: [],
        tempShape: undefined,
        movingShape: undefined,
        nextObject: "line",
        nextColor: "black",
        nextWidth: 1,
        isDrawing: false,
        moveX: undefined,
        moveY: undefined,
        drawAllShapes: function (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < myDrawing.allShapes.length; i++) {
                if (myDrawing.allShapes[i] !== undefined) {
                    myDrawing.allShapes[i].draw(context, myDrawing.allShapes[i]);
                }
            }
        },
        clearAllShapes: function () {
            myDrawing.allShapes = [];
        }
    };

    $("#myCanvas").mousedown(function (e) {
        myDrawing.nextWidth = document.getElementById("idTamanho").value;
        myDrawing.currentStartX = e.pageX - this.offsetLeft;
        myDrawing.currentStartY = e.pageY - this.offsetTop;
        if (document.getElementById('idRetangulo').checked) {
            myDrawing.nextObject = "rect";
        } else if (document.getElementById('idLinha').checked) {
            myDrawing.nextObject = "line";
        } else if (document.getElementById('idCirculo').checked) {
            myDrawing.nextObject = "circle";
        } else if (document.getElementById('idCaneta').checked) {
            myDrawing.tempShape = (new Pen(0, 0, 0, 0, myDrawing.nextColor, myDrawing.nextWidth, "pen"));
            myDrawing.tempShape.xArray.push(myDrawing.currentStartX);
            myDrawing.tempShape.yArray.push(myDrawing.currentStartY);
            myDrawing.nextObject = "pen";
        }
        myDrawing.isDrawing = true;
    });

    $("#myCanvas").mousemove(function (e) {
        if (myDrawing.isDrawing === true) {
            myDrawing.drawAllShapes(context);
            undoRedo.resetAll();
            let x = e.pageX - this.offsetLeft;
            let y = e.pageY - this.offsetTop;
            if (myDrawing.nextObject === "line") {
                myDrawing.tempShape = (new Line(myDrawing.currentStartX,
                    myDrawing.currentStartY,
                    x,
                    y,
                    myDrawing.nextColor,
                    myDrawing.nextWidth,
                    "line"));
                myDrawing.tempShape.draw(context, myDrawing.tempShape);
            } else if (myDrawing.nextObject === "rect") {
                myDrawing.tempShape = (new Rect(myDrawing.currentStartX,
                    myDrawing.currentStartY,
                    x - myDrawing.currentStartX,
                    y - myDrawing.currentStartY,
                    myDrawing.nextColor,
                    myDrawing.nextWidth,
                    "rect"));
                myDrawing.tempShape.draw(context, myDrawing.tempShape);
            } else if (myDrawing.nextObject === "circle") {
                myDrawing.tempShape = (new Circle(myDrawing.currentStartX,
                    myDrawing.currentStartY,
                    x,
                    y,
                    myDrawing.nextColor,
                    myDrawing.nextWidth,
                    "circle"));
                myDrawing.tempShape.centerX = myDrawing.currentStartX + myDrawing.tempShape.radiusX;
                myDrawing.tempShape.centerY = myDrawing.currentStartY + myDrawing.tempShape.radiusY;
                myDrawing.tempShape.draw(context, myDrawing.tempShape);
            } else if (myDrawing.nextObject === "pen") {
                myDrawing.tempShape.xArray.push(x);
                myDrawing.tempShape.yArray.push(y);
                myDrawing.tempShape.draw(context, myDrawing.tempShape);
            }
        }
    });

    $("#myCanvas").mouseup(function (e) {
        myDrawing.isDrawing = false;
        if (myDrawing.tempShape !== undefined) {
            myDrawing.allShapes.push(myDrawing.tempShape);
        }
        myDrawing.tempShape = undefined;
        myDrawing.movingShape = undefined;
    });

    let Shape = Basic.extend({
        constructor: function (startX, startY, x, y, color, width, name) {
            this.x = x;
            this.y = y;
            this.startX = startX;
            this.startY = startY;
            this.objColor = color;
            this.objWidth = width;
            this.objName = name;
        },
        x: undefined,
        y: undefined,
        startX: undefined,
        startY: undefined,
        objColor: "black",
        objWidth: 1,
        objName: "line",
        findMe: function (x, y, obj) {
            let xFound = false,
                yFound = false;
            if (x >= obj.startX) {
                if (x <= (obj.startX + obj.x)) {
                    xFound = true;
                }
            } else {
                if (x >= (obj.startX + obj.x)) {
                    xFound = true;
                }
            }
            if (y >= obj.startY) {
                if (y <= (obj.startY + obj.y)) {
                    yFound = true;
                }
            } else {
                if (y >= (obj.startY + obj.y)) {
                    yFound = true;
                }
            }

            return xFound && yFound;
        }
    });

    let Line = Shape.extend({
        draw: function (context, obj) {
            context.beginPath();
            context.lineWidth = obj.objWidth;
            context.strokeStyle = obj.objColor;
            context.moveTo(obj.startX, obj.startY);
            context.lineTo(obj.x, obj.y);
            context.stroke();
        },
        findMe: function (x, y, obj) {
            let x1 = 0,
                x2 = 0;
            let y1 = 0;
            let y2 = 0;
            if (obj.startX <= obj.x) {
                x1 = obj.startX;
                x2 = obj.x;
                y1 = obj.startY;
                y2 = obj.y;
            } else {
                x1 = obj.x;
                x2 = obj.startX;
                y1 = obj.y;
                y2 = obj.startY;
            }
            let slope = obj.findSlope(x1, y1, x2, y2);
            let targetSlope = obj.findSlope(x1, y1, x, y);
            if (x < x2 && x > x1) {
                if (Math.abs(slope - targetSlope) < 0.1) {
                    return true;
                }
            }
            return false;
        },
        findSlope: function (x1, y1, x2, y2) {
            return (y1 - y2) / (x2 - x1);
        }
    });

    let Rect = Shape.extend({
        draw: function (context, obj) {
            context.beginPath();
            context.lineWidth = obj.objWidth;
            context.strokeStyle = obj.objColor;
            context.strokeRect(obj.startX, obj.startY, obj.x, obj.y);
            context.stroke();
        }
    });

    let Circle = Shape.extend({
        constructor: function (startX, startY, x, y, color, width, name) {
            this.base(startX, startY, x, y, color, width, name);
            this.radiusX = (x - myDrawing.currentStartX) * 0.5;
            this.radiusY = (y - myDrawing.currentStartY) * 0.5;
        },
        centerX: undefined,
        centerY: undefined,
        draw: function (context, obj) {
            let radiusX = obj.radiusX,
                radiusY = obj.radiusY,
                centerX = obj.startX + obj.radiusX,
                centerY = obj.startY + obj.radiusY,
                step = 0.01,
                a = step,
                pi2 = Math.PI * 2 - step;
            context.beginPath();
            context.lineWidth = obj.objWidth;
            context.strokeStyle = obj.objColor;
            context.moveTo(centerX + radiusX * Math.cos(0),
                centerY + radiusY * Math.sin(0));
            for (; a < pi2; a += step) {
                context.lineTo(centerX + radiusX * Math.cos(a),
                    centerY + radiusY * Math.sin(a));
            }
            context.closePath();
            context.stroke();
        },
        findMe: function (x, y, obj) {
            let xa = [];
            let ya = [];
            let radiusX = obj.radiusX;
            let radiusY = obj.radiusY;
            let centerX = obj.startX + obj.radiusX,
                centerY = obj.startY + obj.radiusY,
                step = 0.01,
                a = step,
                pi2 = Math.PI * 2 - step;
            xa.push(centerX + radiusX * Math.cos(a));
            ya.push(centerY + radiusY * Math.sin(a));
            for (; a < pi2; a += step) {
                xa.push(centerX + radiusX * Math.cos(a));
                ya.push(centerY + radiusY * Math.sin(a));
            }
            let qt = xa.length / 4;
            let half = xa.length / 2;
            let count = 0;
            for (let i = 0; i < half; i++) {
                if (xa[i + half] < x && xa[i] > x) {
                    if (ya[i + qt] > y && ya[i + half + qt] < y) {
                        count++;
                    }
                }
            }
            return count > 60;
        }
    });

    let Pen = Shape.extend({
        constructor: function (startX, startY, x, y, color, width, name) {
            this.base(startX, startY, x, y, color, width, name);
            this.xArray = [];
            this.yArray = [];
        },
        draw: function (context, obj) {
            for (let j = 0; j < obj.xArray.length; j++) {
                context.beginPath();
                context.lineWidth = obj.objWidth;
                context.strokeStyle = obj.objColor;
                context.moveTo(obj.xArray[j - 1], obj.yArray[j - 1]);
                context.lineTo(obj.xArray[j], obj.yArray[j]);
                context.closePath();
                context.stroke();
            }
        },
        findMe: function (x, y, obj) {
            for (let i = 0; i < obj.xArray.length; i++) {
                if (obj.xArray[i] < x + 5 && obj.xArray[i] > x - 5) {
                    if (obj.yArray[i] < y + 8 && obj.yArray[i] > y - 8) {
                        return true;
                    }
                }
            }
            return false;
        }
    });

    let undoRedo = {
        undoneItems: [],
        popItem: function () {
            undoRedo.undoneItems.push(myDrawing.allShapes.pop());
            myDrawing.drawAllShapes(context);
        },
        undoItem: function () {
            myDrawing.allShapes.push(undoRedo.undoneItems[0]);
            undoRedo.undoneItems.splice(0, 1);
            myDrawing.drawAllShapes(context);
        },
        resetAll: function () {
            undoRedo.undoneItems = [];
        }
    };

    $(".colorPicker").colorpicker().on('changeColor', function (ev) {
        myDrawing.nextColor = ev.color.toHex();
    });

    $("#idUndo").click(function() {
        undoRedo.popItem();
    });

    $("#idRedo").click(function(){
        undoRedo.undoItem();
    });

    $("#idReset").click(function () {
        undoRedo.resetAll();
        myDrawing.clearAllShapes();
        myDrawing.drawAllShapes(context);
    });
});







