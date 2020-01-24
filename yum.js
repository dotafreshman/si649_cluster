//background
//**********************************************************
//citation
//Title: Visualizing K-Means algorithm with D3.js
//Author: nitoyon
//Date: 2013
//Availability: https://github.com/nitoyon/tech.nitoyon.com/blob/master/ja/blog/2013/11/07/k-means/k-means.js
//***********************************************************

WIDTH=500
HEIGHT=200
var svg = d3.select("#kmeans svg")
  .attr('width', WIDTH)
  .attr('height', HEIGHT)
  .style('padding', '10px')
  .style('background', '#f0f8ff')
 .on('click', function() {
    d3.event.preventDefault();
    step();
  });

var dotg = svg.append('g');
var centerg=svg.append('g')
var lineg=svg.append('g');
var cluster_number=0
var dots=[];var groups=[];
var flag=false;
d3.select("#reset").on('click',function(){init();test();smalldraw()})

svg.on("click",function(){
    cluster_number=0

    var cood=d3.mouse(this);
    var dot={
        x:cood[0],
        y:cood[1],
        group:undefined
    };
    dots.push(dot)

    d3.select("#reset")
        .on('click',function(){init();test();draw()})//
    d3.select("#step")
        .on('click',function(){step();draw()})

    function step(){
        if(flag){
            moveCenter()
            draw()
            d3.select("#kmeans a").text("current stage: move center of each group")
        }else{
            updateGroup()
            draw()
            d3.select("#kmeans a").text("current stage: update center of each group")
        }
        flag=!flag
    }


    function draw(){
      var circles = dotg.selectAll('circle').data(dots);
      circles.enter().append('circle');
      circles.exit().remove();
      circles
        .transition()
        .duration(500)
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .attr('fill', function(d) { return d.group ? d.group.color : '#223344'; })
        .attr('r', 5);


        if (dots[0].group) {
            var l = lineg.selectAll('line')
              .data(dots);
            var updateLine = function(lines) {
              lines
                .attr('x1', function(d) { return d.x; })
                .attr('y1', function(d) { return d.y; })
                .attr('x2', function(d) { return d.group.center.x; })
                .attr('y2', function(d) { return d.group.center.y; })
                .attr('stroke', function(d) { return d.group.color; });
            };
            updateLine(l.enter().append('line'));
            updateLine(l.transition().duration(500));
            l.exit().remove();
          } else {
            lineg.selectAll('line').remove();
        }


        var c=centerg.selectAll('path').data(groups);
        var updateCenters = function(centers) {
            centers
              .attr('transform', function(d) { return "translate(" + d.center.x + "," + d.center.y + ") rotate(45)";})
              .attr('fill', function(d,i) { return d.color; })
              .attr('stroke', '#aabbcc');
        };
        c.exit().remove();
          updateCenters(c.enter()
            .append('path')
            .attr('d', d3.svg.symbol().type('cross'))
            .attr('stroke', '#aabbcc'));
          updateCenters(c
            .transition()
            .duration(500));

    }

    function moveCenter(){
        groups.forEach(function(group, i) {
            if (group.dots.length == 0) return;

            // get center of gravity
            var x = 0, y = 0;
            group.dots.forEach(function(dot) {
              x += dot.x;
              y += dot.y;
            });

            group.center = {
              x: x / group.dots.length,
              y: y / group.dots.length
            };
        });
    }

    function updateGroup(){
        groups.forEach(function(g) { g.dots = []; });
        dots.forEach(function(dot) {
    // find the nearest group
        var min = Infinity;
        var group;
        groups.forEach(function(g) {
          var d = Math.pow(g.center.x - dot.x, 2) + Math.pow(g.center.y - dot.y, 2);
          if (d < min) {
            min = d;
            group = g;
        }
    });

    // update group
    group.dots.push(dot);
    dot.group = group;
  });
    }




   draw()
})




function init(){
        flag=false
        dots=[];groups=[]
        var K=parseInt(d3.select('#K')[0][0].value, 10);
        cluster_number=K
        for (var i=0;i<K;i++){
            var g={
                dots:[],
                color:'hsl('+(i*360/K)+',100%,50%',
                center:{x:Math.random()*WIDTH,y:Math.random()*HEIGHT},
                init:{center:{}}
            };
            groups.push(g)
        }
        smalldraw()
    }
function test(){
        d3.select("#kmeans p").text("cluster number: "+cluster_number).style("font-size","30px")
}
function smalldraw(){

        var circles = dotg.selectAll('circle').data([]);
      circles.enter().append('circle');
      circles.exit().remove();
      circles
        .transition()
        .duration(500)
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .attr('fill', function(d) { return d.group ? d.group.color : '#223344'; })
        .attr('r', 5);




            lineg.selectAll('line').remove();




        var c=centerg.selectAll('path').data(groups);
        var updateCenters = function(centers) {
            centers
              .attr('transform', function(d) { return "translate(" + d.center.x + "," + d.center.y + ") rotate(45)";})
              .attr('fill', function(d,i) { return d.color; })
              .attr('stroke', '#aabbcc');
        };
        c.exit().remove();
          updateCenters(c.enter()
            .append('path')
            .attr('d', d3.svg.symbol().type('cross'))
            .attr('stroke', '#aabbcc'));
          updateCenters(c
            .transition()
            .duration(500));

    }
smalldraw()



