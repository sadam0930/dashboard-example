$(document).ready(function(){
    $.getJSON( "/ajax/twitter.json", function( response ) {
        generateChart(response);
        generateTable(response);
    });
    
});

/*
TODO:
Add draggability
*/

$(".gridster ul").gridster({
    widget_margins: [10, 10],
    widget_base_dimensions: [950, 500]
});

function generateChart(response) {
    var chartDivId = '#chart-1';
    	
    var day = new Date(response.data.rows[0][0].value);
    var daybefore = new Date(day.getTime());
    var dayafter = new Date(day.getTime());
    daybefore.setDate((day.getDate() - 1));
    dayafter.setDate((day.getDate() + 1));
   
    var margin = {top: 40, right: 150, bottom: 70, left: 100},
    width = 950 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    // Parse the date / time
    var	parseDate = d3.time.format("%m/%d/%y").parse;
    
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .5);
    var y = d3.scale.linear().range([height, 0]);
    var y2 = d3.scale.linear().range([height, 0]);
    var y3 = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .tickFormat(d3.time.format("%m/%d/%y"));

    var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(10);
                    
    var yAxisRight1 = d3.svg.axis().scale(y2)
                        .orient("right").ticks(15); 
                        
    var yAxisRight2 = d3.svg.axis().scale(y3)
                        .orient("right").ticks(10); 

    var svg = d3.select(chartDivId).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", 
                        "translate(" + margin.left + "," + margin.top + ")");

    
    var data = [{"date":daybefore,"value":0,"eng":0,"exp":0}];
    $.each(response.data.headers, function() {
        if(this.field === "posts" || this.field === "reach" || this.field === "interactions"){
            var tmp = {"date":day};
            if(this.field === "posts"){
                tmp.value = +this.totals;
            } else if(this.field === "reach"){
            tmp.exp = this.totals;
            } else if(this.field === "interactions"){
                tmp.eng = this.totals;
            }
            data.push(tmp);
        }
    });
    data.push({"date":dayafter,"value":0,"eng":0,"exp":0})

    x.domain(data.map(function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);
    y2.domain([0, d3.max(data, function(d) { return d.eng; })]);
    y3.domain([0, d3.max(data, function(d) { return d.exp; })]);
    
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-75)" );
    
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("fill", "OliveDrab")
      .text("Posts");
    
    svg.append("g")				
      .attr("class", "y axis")	
      .attr("transform", "translate(" + width + " ,0)")	
      .call(yAxisRight1)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -15)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("fill", "purple")
      .text("Engagement");;
    
    svg.append("g")				
      .attr("class", "y axis")	
      .attr("transform", "translate(" + (width+65) + " ,0)")	
      .call(yAxisRight2)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -15)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("fill", "orange")
      .text("Engagement");;

    
    svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "OliveDrab")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

}

function generateTable(response) {
    var tableDivId = '#table-1';
    var tableId = 'twitter-table';
    buildTable(response, tableDivId, tableId);
    populateTable(response, tableId);
    $('#'+tableId).dataTable( {
        "dom": '<"top"fp>rt<"bottom"fp><"clear">',
        "pagingType": "input"
    });
    $('.top').addClass("clearfix")
    $('.bottom').addClass("clearfix")
}

function buildTable(response, tableDivId, tableId){
    $(tableDivId).append('<table class="table" id="'+ tableId +'"><thead><tr></tr></thead><tbody></tbody></table>');
    var html = '';
    $.each(response.data.headers, function(){
        html = '<th id="' + this.field + '">' + this.label + '</th>';
        $('#' + tableId + ' > thead > tr').append(html);
    });
}

function populateTable(response, tableId){
    var html = '';
    $.each(response.data.rows, function(){
       $('#' + tableId + ' > tbody').append('<tr></tr>');
       $.each(this, function(){
           switch(this.field){
               case 'date' :
                   var date = new Date(this.value);
                   html = '<td>' + formatDate(date) + '</td>';
                   break;
               case 'brand_id':
                   html = '<td>' + this.label + '</td>';
                   break;
               case 'title':
                   html = '<td>' + this.label + '</td>';
                   break;
               case 'posts':
                   html = '<td>' + this.values + '</td>';
                   break;
               case 'reach':
                   html = '<td>' + this.values + '</td>';
                   break;
               case 'interactions':
                   html = '<td>' + this.values + '</td>';
                   break;
                default:
                    html = '<td>' + this + '</td>';
           }
           $('#' + tableId + ' > tbody > tr:last').append(html);
       });
    });
}

function formatDate(date) {
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
}