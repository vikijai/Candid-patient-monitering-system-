/*
 * This is NOT free software. You may learn from and experiment with this code but you may not redistribute it or use it in any commercial application without the explicit prior consent of the author.
 * Burak Kanber
 * burak@burakkanber.com
 * October 2012
 */


var canvas; 
var ctx;
var height = 200;
var width = 300;
    var data = [
        [100,117],
        [110,118],	
        [130,93],	
        [145,166],	
        [150,167],	
        [140,169],	
        [130,145],	
        [95,67],	
        [90,122],	
        [87,12],	
        [88,92],
        [40,9],
        [90,99],	
        [40,14],	
        [50,77],	
        [55,45],	
        [45,69],	        
        [55,48],	
        [59,44],
        [75,40]

    ];
var means = [];
var assignments = [];
var dataExtremes;
var dataRange;
var drawDelay = 0;

function mlAdd(a) {
    data.push(a);
}

function init(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

 
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
}

function setup() {  
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dataExtremes = getDataExtremes(data);
    dataRange = getDataRanges(dataExtremes);
    means = initMeans(3);

    makeAssignments();
    draw();    

    setTimeout(run, drawDelay);
}

function getDataRanges(extremes) {
    var ranges = [];

    for (var dimension in extremes)
    {
        ranges[dimension] = extremes[dimension].max - extremes[dimension].min;
    }

    return ranges;

}

function getDataExtremes(points) {
    
    var extremes = [];

    for (var i in data)
    {
        var point = data[i];

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

function initMeans(k) {

    if ( ! k )
    {
        k = 3;
    }

    while (k--)
    {
        var mean = [];

        for (var dimension in dataExtremes)
        {
            mean[dimension] = dataExtremes[dimension].min + ( Math.random() * dataRange[dimension] );
        }

        means.push(mean);
    }

    return means;

};

function makeAssignments() {

    for (var i in data)
    {
        var point = data[i];
        var distances = [];

        for (var j in means)
        {
            var mean = means[j];
            var sum = 0;

            for (var dimension in point)
            {
                var difference = point[dimension] - mean[dimension];
                difference *= difference;
                sum += difference;
            }

            distances[j] = Math.sqrt(sum);
        }

        assignments[i] = distances.indexOf( Math.min.apply(null, distances) );
    }

}

function moveMeans() {

    makeAssignments();

    var sums = Array( means.length );
    var counts = Array( means.length );
    var moved = false;

    for (var j in means)
    {
        counts[j] = 0;
        sums[j] = Array( means[j].length );
        for (var dimension in means[j])
        {
            sums[j][dimension] = 0;
        }
    }

    for (var point_index in assignments)
    {
        var mean_index = assignments[point_index];
        var point = data[point_index];
        var mean = means[mean_index];

        counts[mean_index]++;

        for (var dimension in mean)
        {
            sums[mean_index][dimension] += point[dimension];
        }
    }

    for (var mean_index in sums)
    {
       // console.log(counts[mean_index]);
        if ( 0 === counts[mean_index] ) 
        {
            sums[mean_index] = means[mean_index];
           // console.log("Mean with no points");
           // console.log(sums[mean_index]);

            for (var dimension in dataExtremes)
            {
                sums[mean_index][dimension] = dataExtremes[dimension].min + ( Math.random() * dataRange[dimension] );
            }
            continue;
        }

        for (var dimension in sums[mean_index])
        {
            sums[mean_index][dimension] /= counts[mean_index];
        }
    }

    if (means.toString() !== sums.toString())
    {
        moved = true;
    }

    means = sums;

    return moved;

}

function run() {

    var moved = moveMeans();
    draw();

    if (moved)
    {
        setTimeout(run, drawDelay);
    }

}

function dist(a,b){
	var dis = ((a[0]-b[0])*(a[0]-b[0])+(a[1]-b[1])*(a[1]-b[1]));
  //console.log('yogi' + b[0]);
  return dis;
}
function draw() {

    ctx.clearRect(0,0,width, height);

    ctx.globalAlpha = 0.3;
    /*for (var point_index in assignments)
    {
        var mean_index = assignments[point_index];
        var point = data[point_index];
        var mean = means[mean_index];

        ctx.save();

        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(
            (point[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2) ),
            (point[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2) )
        );
        ctx.lineTo(
            (mean[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2) ),
            (mean[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2) )
        );
        ctx.stroke();
        ctx.closePath();
    
        ctx.restore();
    }*/
    ctx.globalAlpha = 1;

    for (var i in data)
    {
        ctx.save();

        var point = data[i];

        var x = (point[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2) );
        var y = (point[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2) );

        ctx.strokeStyle = (point[0]>120 || point[0]<60)?'#F44336':'#2196F3';
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, Math.PI*2, true);
        ctx.stroke();
        ctx.fillStyle = (point[0]>120 || point[0]<60)?'#F44336':'#2196F3';
        ctx.fill();
        ctx.closePath();

        ctx.restore();
    }

    /*for (var i in means)
    {
        ctx.save();

        var point = means[i];

        var x = (point[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2) );
        var y = (point[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2) );

        ctx.fillStyle = 'green';
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI*2, true);
        ctx.fill();
        ctx.closePath();

        ctx.restore();

    }*/

}

init();  