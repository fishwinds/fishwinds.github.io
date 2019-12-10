/*****************************************
 *
 *	[No need to change] Cross browser requestAnimationFrame
 *  To know more detail, go to the following link
 *  http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 *
 *****************************************/
window.requestAnimFrame = (function(callback) {
    var agent = navigator.userAgent;
    if(agent.search(/iPhone/) != -1 || agent.search(/iPod/) != -1 || agent.search(/iPad/) != -1){
        return function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    }
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

/*****************************************
 *
 *  [No need to change] AnimFrame Constructor
 *  For manageing the plural animation canvases.
 *  Usage:
 *   1. Instantiate this Constructor: var animeFrame = new AnimFrame();
 *   2. Set animation objects extended from AnimCanvas Constructor: animeFrame.push(anim01); animeFrame.push(anim02); ...
 *   3. Call the start method: animeFrame.start();
 *   4. Be able to stop animations by calling the stop method (no used in Clocklinks): animeFrame.stop();
 *
 *****************************************/
var AnimFrame = (function(){
    function F(){}
    var stack = [];
    var isAnimating;

    F.prototype.push = function(instance){
        stack.push(instance);
    };
    F.prototype.stop = function(){
        isAnimating = false;
    };
    F.prototype.start = function(){
        isAnimating = true;
        init();
        animate();
    };

    function init(){
        for(var i=0, l=stack.length; i<l; i++) {
            stack[i].init();
        }
    }

    function animate(){
        if(isAnimating) {
            requestAnimFrame(function() {
                animate();
            });
        }
        for(var i=0, l=stack.length; i<l; i++) {
            stack[i].render();
        }
    };
    return F;
})();

/*****************************************
 *
 *  [No need to change] AnimCanvas Constructor
 *  This is used as a base of animation canvas.
 *
 *****************************************/
var AnimCanvas = (function(){
    /* Constructor */
    function F(){
        this.id;
        this.canvas;
        this.context;
        this.time;
        this.startTime;
        this.fps;
        this.fpsStep;
        this.fpsTime;
    }

    /* Public Methods */
    // setCanvas() is required to call for identifying the canvas to use
    F.prototype.setCanvas = function(canvasId){
        this.id = canvasId;
        this.canvas = document.getElementById(this.id);
        this.context = this.canvas.getContext("2d");
    };

    // createCanvas() is required to call for
    F.prototype.createCanvas = function(width, height){
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;
    };

    // setFps() is arbitrary to change the fps
    // if not called, the canvas is rendered right when animation gets ready
    F.prototype.setFps = function(fps){
        this.fps = fps;
        this.fpsStep = 1000 / fps;
        this.fpsFrame;
    };

    // init() is called by the AnimFrame constructor when starting Animation
    F.prototype.init = function(){
        this.startTime = (new Date()).getTime();
    };

    // render() is called by the AnimFrame constructor each time to render
    F.prototype.render = function(){
        this.time = (new Date()).getTime() - this.startTime;

        if(this.fps){
            var millisecond = this.time % 1000;
            var currentFpsFrame = Math.floor(millisecond / this.fpsStep);
            if(this.fpsFrame != currentFpsFrame){
                this.fpsFrame = currentFpsFrame;
                this.draw();
            }
        } else {
            this.draw();
        }
    };
    return F;
})();

/*****************************************
 *
 *	SimpleCanvas Constructor
 *
 *****************************************/
var SimpleCanvas = (function(){
    /* Constructor */
    function F(){
        this.id;
        this.canvas;
        this.context;
    }

    /* Public Methods */
    // setCanvas() is required to call for identifying the canvas to use
    F.prototype.setCanvas = function(canvasId){
        this.id = canvasId;
        this.canvas = document.getElementById(this.id);
        this.context = this.canvas.getContext("2d");
    };

    // createCanvas() is required to call for gerating a new canvas object
    F.prototype.createCanvas = function(width, height){
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;
    };

    // render() is called by the AnimFrame constructor each time to render
    F.prototype.render = function(){
        this.draw();
    };
    return F;
})();

// Now is Html5 Clock begin, above all is render frame.

function isCanvasSupported(){
    var elem = document.createElement("canvas");
    return !!(elem.getContext && elem.getContext("2d"));
}
var urlClock = 'Clock-Html5';
var urlTimezone = 'CCT';
var urlSize = '150';
var urlTitle = '';
var urlMessage = '';
var urlTarget = '';
var urlFrom = '2014,1,1,0,0,0';
var urlColor = 'gray';
//var adImageUrl = "";
//var redirectUrl = "";
var serverYear = new Date().getFullYear();
var serverMonth = new Date().getMonth();
var serverDay = new Date().getDay();
var serverHour = new Date().getHours();
var serverMinute = new Date().getMinutes();
var serverSecond = new Date().getSeconds();
var serverMillisecond = new Date().getMilliseconds();
var rootPath = "/";
//var adId = "Clock-Html5-AD";

/*
 Global valuables
 - urlClock
 - urlTimezone
 - urlColor
 - urlSize
 - serverYear
 - serverMonth
 - serverDay
 - serverHour
 - serverMinute
 - serverSecond
 - serverMillisecond
 */

var baseSize = 227;
var srcPath = rootPath + "html5-008/";

document.write('<canvas id="' + urlClock + '" width="' + urlSize + 'px" height="' + urlSize/2.91 + 'px"></canvas>');

/*****************************************
 *
 *	Clock Constructor extended by AnimCanvas
 *
 *****************************************/
var Clock = (function(){
    /* Constructor */
    function F(){}

    /* Inheritance */
    F.prototype = new AnimCanvas();
    F.prototype.__super__ = AnimCanvas.prototype;
    F.prototype.init = function(){
        this.__super__.init.apply(this, arguments);

        var servertime = new Date();
        servertime.setYear(serverYear);
        servertime.setMonth(serverMonth - 1);
        servertime.setDate(serverDay);
        servertime.setHours(serverHour);
        servertime.setMinutes(serverMinute);
        servertime.setSeconds(serverSecond);
        unixservertime = servertime.getTime();
    };

    /* Private Valuables (don't change the values) */
    var canvas, context, time;
    var unixservertime,
        currenttime;
    var hour,
        minute,
        second,
        millisecond;
    var previousHour,
        previousMinute,
        previousSecond;
    var scaleValue = 1;

    /* Private Functions */
    function countTime(){
        currenttime = new Date();
        currenttime.setTime(unixservertime + time);
        hour   = currenttime.getHours();
        minute = currenttime.getMinutes();
        second = currenttime.getSeconds();
        millisecond = currenttime.getMilliseconds()
    }


    /* Public Methods */
    F.prototype.setScale = function(val){
        scaleValue = val;
    };
    F.prototype.draw = function(){
        canvas = this.canvas;
        context = this.context;
        time = this.time;

        /* Clear and save initial setting  */
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();

        /********* Draw from here *********/
        countTime();
        context.translate(0, canvas.height/2);
        context.scale(scaleValue, scaleValue);

        // hour panel
        hourPanel.setNumber(hour);
        context.drawImage(hourPanel.canvas, 0, -hourPanel.canvas.height/2);

        // minute panel
        minutePanel.setNumber(minute);
        context.drawImage(minutePanel.canvas, 77, -minutePanel.canvas.height/2);

        // second panel
        secondPanel.setNumber(second);
        context.drawImage(secondPanel.canvas, 154, -secondPanel.canvas.height/2);

        /********* Revert to initial setting *********/
        context.restore();
    }
    return F;
})();



/*****************************************
 *
 *	ClockPanel Constructor extended by AnimCanvas
 *
 *****************************************/
var ClockPanel = (function(){
    /* Constructor */
    function F(){}

    /* Inheritance */
    F.prototype = new AnimCanvas();
    F.prototype.__super__ = AnimCanvas.prototype;
    F.prototype.init = function(){
        this.__super__.init.apply(this, arguments);
        this.currentNum = 0;
        this.previousNum = 0;
        this.count = 0;
    };

    /* Private Valuables (don't change the values) */
    var canvas, context, time;
    var flipFrame = 10;

    /* Public Methods */
    F.prototype.draw = function(){
        canvas = this.canvas;
        context = this.context;
        time = this.time;

        /* Clear and save initial setting  */
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();

        /********* Draw from here *********/
        if(this.currentNum == this.previousNum){
            context.drawImage(this.panelList[this.currentNum].canvas, 0, 0);
        } else {
            this.count++;

            var progress = Math.cos(Math.PI * this.count / flipFrame);
            var currentPanel = this.panelList[this.currentNum].canvas;
            var previousPanel = this.panelList[this.previousNum].canvas;

            context.save();
            context.translate(0, currentPanel.height/2);

            // Upper Current Panel
            context.drawImage(currentPanel, 0, 0, currentPanel.width, currentPanel.height/2, 0, -currentPanel.height/2, currentPanel.width, currentPanel.height/2);
            // Lower Previous Panel
            context.drawImage(previousPanel, 0, previousPanel.height/2, previousPanel.width, previousPanel.height/2, 0, 0, previousPanel.width, previousPanel.height/2);

            if(progress>0){
                // Upper Previous Panel
                context.drawImage(previousPanel, 0, 0, previousPanel.width, previousPanel.height/2, 0, -previousPanel.height/2*progress, previousPanel.width, previousPanel.height/2*progress);
            } else {
                progress = progress* -1;
                // Lower Current Panel
                context.drawImage(currentPanel, 0, currentPanel.height/2, currentPanel.width, currentPanel.height/2, 0, 0, currentPanel.width, currentPanel.height/2*progress);
            }

            context.restore();

            if(this.count==flipFrame){
                this.count=0;
                this.previousNum = this.currentNum;
            }

        }


        /********* Revert to initial setting *********/
        context.restore();
    }
    F.prototype.setPanelList = function(array){
        this.panelList = array;
    }

    F.prototype.setNumber = function(num){
        this.currentNum = num;
    }
    return F;
})();


/*****************************************
 *
 *	General60 Constructor extended by AnimCanvas
 *
 *****************************************/
var General60 = (function(){
    /* Constructor */
    function F(){}

    /* Inheritance */
    F.prototype = new SimpleCanvas();

    /* Private Valuables */
    var canvas, context, time;
    var corderRound = { x : 10, y : 8 }

    /* Public Methods */
    F.prototype.draw = function(){
        canvas = this.canvas;
        context = this.context;
        time = this.time;

        /* Clear and save initial setting  */
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();

        /********* Draw from here *********/
        // Create Clip Path
        context.beginPath();
        context.moveTo(0, corderRound.y);
        context.quadraticCurveTo(0, 0, corderRound.x, 0);
        context.lineTo(canvas.width-corderRound.x, 0);
        context.quadraticCurveTo(canvas.width, 0, canvas.width, corderRound.y);
        context.lineTo(canvas.width, canvas.height-corderRound.y);
        context.quadraticCurveTo(canvas.width, canvas.height, canvas.width-corderRound.x, canvas.height);
        context.lineTo(corderRound.x, canvas.height);
        context.quadraticCurveTo(0, canvas.height, 0, canvas.height-corderRound.y);
        context.closePath();
        // context.clip();

        // Fill Background Color
        context.fillStyle = this.color;
        context.fill();
        // context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the Number
        context.font = "62px Arial"
        context.textAlign = "center";
        context.textBaseline = "Alphabetic";
        context.fillStyle = "#ffffff";
        if(this.color.toLowerCase() == "white" || this.color.toLowerCase() == "#ffffff"){
            context.fillStyle = "#000000";
        }
        context.fillText(this.number, canvas.width/2, canvas.height-8.5);

        // Draw Center Line
        context.strokeStyle = this.color;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(0, canvas.height/2);
        context.lineTo(canvas.width, canvas.height/2);
        context.stroke();

        /********* Revert to initial setting *********/
        context.restore();
    }
    F.prototype.setColor = function(color){
        this.color = color.toString();
    }
    F.prototype.setNumber = function(number){
        this.number = number.toString();
        if(this.number.length == 1){
            this.number = "0" + this.number;
        }
    }
    return F;
})();

/*****************************************
 *
 *	Hour24 Constructor extended by AnimCanvas
 *
 *****************************************/
var Hour24 = (function(){
    /* Constructor */
    function F(){
        this.pm = false;
    }

    /* Inheritance */
    F.prototype = new SimpleCanvas();

    /* Private Valuables */
    var canvas, context, time;
    var corderRound = { x : 10, y : 8 }

    /* Public Methods */
    F.prototype.draw = function(){
        canvas = this.canvas;
        context = this.context;
        time = this.time;

        /* Clear and save initial setting  */
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();

        /********* Draw from here *********/
        // Create Clip Path
        context.beginPath();
        context.moveTo(0, corderRound.y);
        context.quadraticCurveTo(0, 0, corderRound.x, 0);
        context.lineTo(canvas.width-corderRound.x, 0);
        context.quadraticCurveTo(canvas.width, 0, canvas.width, corderRound.y);
        context.lineTo(canvas.width, canvas.height-corderRound.y);
        context.quadraticCurveTo(canvas.width, canvas.height, canvas.width-corderRound.x, canvas.height);
        context.lineTo(corderRound.x, canvas.height);
        context.quadraticCurveTo(0, canvas.height, 0, canvas.height-corderRound.y);
        context.closePath();
        // context.clip();

        // Fill Background Color
        context.fillStyle = this.color;
        context.fill();
        // context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the Number
        context.font = "62px Arial"
        context.textAlign = "center";
        context.textBaseline = "Alphabetic";
        context.fillStyle = "#ffffff";
        if(this.color.toLowerCase() == "white" || this.color.toLowerCase() == "#ffffff"){
            context.fillStyle = "#000000";
        }
        context.fillText(this.number, canvas.width/2, canvas.height-8.5);

        // Draw the Number
        context.font = "8px Arial"
        context.textAlign = "left";
        if(this.pm){
            context.fillText("PM", 4, canvas.height-8.5);
        } else {
            context.fillText("AM", 4, canvas.height-8.5);
        }

        // Draw Center Line
        context.strokeStyle = this.color;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(0, canvas.height/2);
        context.lineTo(canvas.width, canvas.height/2);
        context.stroke();

        /********* Revert to initial setting *********/
        context.restore();
    }
    F.prototype.setColor = function(color){
        this.color = color.toString();
    }
    F.prototype.setNumber = function(number){
        this.number = number;
        if(this.number >= 12){
            this.pm = true;
            this.number = this.number - 12
        }
        this.number = this.number != 0 ? this.number : 12;
        this.number = this.number.toString();
    }
    return F;
})();


/* Create Instance */
var color = urlColor;
switch(urlColor){
    case "black":
        color = "#000000";
        break;
    case "blue":
        color = "#0000ff";
        break;
    case "gray":
        color = "#808080";
        break;
    case "green":
        color = "#008000";
        break;
    case "orange":
        color = "#ffa500";
        break;
    case "pink":
        color = "#ffc0cb";
        break;
    case "red":
        color = "#ff0000";
        break;
    case "white":
        color = "#ffffff";
        break;
}

var generalNum = [];
var hourNum = [];

for(var i=0; i<60; i++){
    var num = new General60();
    num.createCanvas(73, 61);
    num.setColor(color);
    num.setNumber(i);
    num.render();
    generalNum.push(num);
}
for(var i=0; i<24; i++){
    var num = new Hour24();
    num.createCanvas(73, 61);
    num.setColor(color);
    num.setNumber(i);
    num.render();
    hourNum.push(num);
}

var hourPanel = new ClockPanel();
hourPanel.createCanvas(73, 61);
hourPanel.setFps(20);
hourPanel.setPanelList(hourNum);

var minutePanel = new ClockPanel();
minutePanel.createCanvas(73, 61);
minutePanel.setFps(20);
minutePanel.setPanelList(generalNum);

var secondPanel = new ClockPanel();
secondPanel.createCanvas(73, 61);
secondPanel.setFps(20);
secondPanel.setPanelList(generalNum);

var clock = new Clock();
clock.setCanvas(urlClock);
clock.setScale(urlSize/baseSize);

/* Start Animation */
var animFrame = new AnimFrame();
animFrame.push(clock);
animFrame.push(hourPanel);
animFrame.push(minutePanel);
animFrame.push(secondPanel);
animFrame.start();