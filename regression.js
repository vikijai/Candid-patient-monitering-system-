var canvas1; 
var ctx1;
var height = 200;
var width = 300;
var regData = [];
var yogi=[];

var meanX,sumX=0, meanY, sumY=0, squareSumX=0, squareSumY=0, sumXY=0;
var dataExtremes1,dataRange1;
function process(){

    for(var i in yogi){
        sumX+=parseInt(i);
        sumY+=parseInt(yogi[i]);
    }
    meanX = sumX / 10;
    meanY = sumY / 10;

    for(var j in yogi){
        var i=parseInt(j);
        squareSumX+=(i-meanX)*(i-meanX);
        squareSumY+=(yogi[j]-meanY)*(yogi[j]-meanY);
        sumXY+=(i-meanX)*(yogi[j]-meanY);
    }

    var r=(sumXY/squareSumX);

    for(i=10;i<20;i++){
        yogi[i]=(r*(i-meanX))+meanY;
    }

    regData=[];
    for(var i in yogi)
        regData.push([parseInt(i),parseInt(yogi[i])]);

}


function regInit(){
    canvas1 = document.getElementById('regression');
    ctx1 = canvas1.getContext('2d');

    ctx1.translate(0, canvas1.height);
    ctx1.scale(1, -1);
}

function regSetup() {  
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    dataExtremes1 = getDataExtremes1(regData);
    dataRange1 = getDataRanges1(dataExtremes1);
    regDraw();    

}

function getDataRanges1(extremes) {
    var ranges = [];

    for (var dimension in extremes)
    {
        ranges[dimension] = extremes[dimension].max - extremes[dimension].min;
    }

    return ranges;

}

function getDataExtremes1(points) {
    
    var extremes = [];

    for (var i in regData)
    {
        var point = regData[i];

        for (var dimension in point)
        {
            if ( ! extremes[dimension] )
            {
                extremes[dimension] = {min: 1000, max: 0};
            }

            if (point[dimension] < extremes[dimension].min)
            {
                extremes[dimension].min = point[dimension];
            }

            if (point[dimension] > extremes[dimension].max)
            {
                extremes[dimension].max = point[dimension];
            }
        }
    }

    return extremes;

}


function regDraw() {

    ctx1.clearRect(0,0,width, height);
    ctx1.globalAlpha = 1;

    console.log('draw');

    for (var i in regData)
    {
        ctx1.save();

        console.log('in');

        var point = regData[i];

        var x = (point[0] - dataExtremes1[0].min + 1) * (width / (dataRange1[0] + 2) );
        var y = (point[1] - dataExtremes1[1].min + 1) * (height / (dataRange1[1] + 2) );

        ctx1.strokeStyle = (parseInt(i)>10)?'#cccccc':'#009688';
        ctx1.translate(x, y);
        ctx1.beginPath();
        ctx1.arc(0, 0, 2, 0, Math.PI*2, true);
        ctx1.stroke();
        ctx1.fillStyle = (parseInt(i)>10)?'#cccccc':'#009688';
        ctx1.fill();
        ctx1.closePath();

        ctx1.restore();
    }

    var point = regData[0];

    var x = (point[0] - dataExtremes1[0].min + 1) * (width / (dataRange1[0] + 2) );
    var y = (point[1] - dataExtremes1[1].min + 1) * (height / (dataRange1[1] + 2) );

    ctx1.beginPath();
    ctx1.strokeStyle = '#bbbbbb'
    ctx1.moveTo(x,y);

    point = regData[ regData.length - 1 ];

    x = (point[0] - dataExtremes1[0].min + 1) * (width / (dataRange1[0] + 2) );
    y = (point[1] - dataExtremes1[1].min + 1) * (height / (dataRange1[1] + 2) );

    ctx1.lineTo(x,y);
    ctx1.stroke();

    ctx1.beginPath();
    ctx1.setLineDash([6,4]);
    ctx1.moveTo(0,140);
    ctx1.lineTo(300,140);
    ctx1.stroke();

    ctx1.moveTo(5,160);     

}

regInit();  