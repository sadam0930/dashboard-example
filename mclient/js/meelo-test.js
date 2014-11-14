$(document).ready(function(){
    $.getJSON( "/ajax/twitter.json", function( response ) {
        generateChart(response);
        generateTable(response);
    });
    
});

function generateChart(response) {
    var chartDivId = '#chart-1';
    var twit_data = [];
    var data_votes = [5,7,8,9,3,11,7,2,12];
    var	w = 850,
    	h = 400,
        yoffset = 0,
        barPadding = 5,
        xoffset = 0,
        scale = d3.scale.linear(),
        svg = d3.select(chartDivId).append("svg").attr("width", w).attr("height", h);
        

    scale.domain([0,d3.max(data_votes)]);
    scale.range([0,h]);
    
    var bars = svg.selectAll("rect")
    	.data(data_votes)
      .enter().append("rect")
    	.attr("x", function(d, i) {return i * (w / data_votes.length)+ xoffset;})
        .attr("y", function(d){return h + yoffset - scale(d);})
    	.attr("width", w / data_votes.length - barPadding)
    	.attr("height", function(d) {return scale(d);})
    	.attr("fill", "teal");
}

function generateTable(response) {
    var tableDivId = '#table-1';
    var tableId = 'twitter-table';
    buildTable(response, tableDivId, tableId);
    populateTable(response, tableId);
    $('#'+tableId).dataTable( {
        "dom": '<"top">rt<"bottom"fp><"clear">',
        "pagingType": "input"
    });
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