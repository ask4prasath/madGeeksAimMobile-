//Login buttoon on click event for form validation

var root_url = "http://localhost:3000/"

$('#submit').on('click', function() {
    var username = $("#username").val();
    var password = $("#password").val();
    if ($("#username").val() != null && $("#password").val() != null) {
        $.mobile.changePage("#mainpage");
        $.ajax({
            type : 'GET',
            url : "http://localhost:3000//users/sign_in.json", 
            data : {email:$("#username").val(),password:"admin123"},
            success:function(data){
               if((data.length != null || data.length != undefined ) && data.length > 0){
                   $.mobile.changePage("#mainpage");
               }else{
                   alert("Invalid Username or Password...!")
               }
            }
    });
    } else {
        alert("Invalid Username or Password...!")
    }
});

// Swipe left and swipe right events
$(document).on("swipeleft swiperight", "#pagetwo", function(e) {
    if ($.mobile.activePage.jqmData("panel") !== "open") {
        if (e.type === "swiperight") {
            $("#left-panel").panel("open");
        }
    }
});

//Swipe left and swipe right events
$(document).on("swipeleft", "#statsOpenIncidents", function(e) {
    if ($.mobile.activePage.jqmData("panel") !== "open") {
        if (e.type === "swipeleft") {
            $.mobile.changePage("#severityStats",{
                transition : "slide",
                changeHash : false
            });
        }
    }
});

// Create incident is invoked
$("#submitIncident").click(function() {
    var email = $("#tEmailId").val();
    var subject = $("#tSubject").val();
    var content = $("#tContent").val();
    var severity =$("#select-choice-1 option:selected" ).text();
    var phase =$("#select-choice-2 option:selected" ).text();
    $.ajax({
        type : 'POST',
        url : root_url + 'tickets#new',
        data : {
            subject : subject,
            content : content,
            from : email,
            status : "open",
            severity:severity,
            phase:phase,
            assignee_id:1,
            action:"create",
            controller:"tickets"
        },
        success : function(d) {
            alert("Incident created ssuccessfully!!!")
            // alert(data.li)
            $.mobile.changePage("#incidents");
        }
    });
});
// Main page init
$(document).on(
        "pageinit",
        "#mainpage",
        function() {
            $.ajax({
                type : 'GET',
                url : root_url + 'tickets.json',
                success : function(d) {
                    var html = "";
                    console.log(d.length);
                    for ( var i = 0; i < d.length; i++) {
                        //console.log(d[i].id)
                        severity = d[i].severity
                        id = d[i].id
                        html += '<li data-icon="false" data-severity="'
                                + severity + '"id="' + id
                                + '"><a href="#"><h2>'
                                + d[i].subject
                                + "</h2></a><span class='ui-li-count'>"
                                + severity + "</span></li>"
                        // phase = d.li[0].split(",")[1]
                        // severity = d.li[0].split(",")[2]
                    }
                    $("#ulIncidents").empty();
                    $("#ulIncidents").append(html);
                    $('#ulIncidents').listview().listview('refresh');
                    $('#ulIncidents').filterable('refresh');
                }
            });
        });

// Click on the searchable items
$(document).on(
        'click',
        'ul#ulIncidents > li',
        function() {
            var id = $(this).attr('id');
            $.ajax({
                type : 'GET',
                url : "http://localhost:3000/tickets/"+id+'.json',
                data : {
                    ids : $(this).attr('id')
                },
                success : function(data) {
                    $.mobile.changePage("#incidentdetails?data="+id, {
                        transition : "flow",
                        changeHash : false
                    });
                }
            });
        });

var template='<article class="comment"><a class="comment-img" href="#non"><img src="http://lorempixum.com/50/50/people/1" alt="" width="50" height="50"></a>'+
        '<div class="comment-body"><div class="text"><p>:anonytext123</p></div><p class="attribution">by <a href="#non">:username</a> at :date </p></div></article>';
// When detailed page is loaded
$(document).on('pageshow', '#incidentdetails', function() {
    var data = $.mobile.document.context.baseURI;
    data=data.substr(data.indexOf("data=")+5);
    var tag="";
    var header="";
    $.ajax({
                type : 'GET',
                url : "http://localhost:3000/tickets/"+data+'.json',
                success : function(data) {
                    var subject = data.subject
                    var phase = data.phase
                    var severity = data.severity
                    var content = data.content
                    header  = "<h2>"+subject+"</h2><h3>"+(severity+phase)+"</h3>";
                    $.ajax({
                            type : 'GET',
                            url : "http://localhost:3000/replies/1.json",
                            success : function(x) {
                                for(var i=0;i<x.length;i++){
                                    template='<article class="comment"><a class="comment-img" href="#non"><img src="mohkhan.jpg" alt="" width="50" height="50"></a>'+
                                    '<div class="comment-body"><div class="text"><p>:anonytext123</p></div><p class="attribution">by <a href="#non">:username</a> at :date </p></div></article>';
                                    //content = x[i].replaceAll("<[^>]*>", "");
                                    var r=/\&(.*?);/ig;
                                    resul = x[i].content.replace(r,"")
                                    //console.log(resul)
                                    //alert(resul)
                                    template = template.replace(':anonytext123',resul)
                                    //console.log(template)
                                    template = template.replace(':username',x[i].user_id)
                                    //console.log(template)
                                    template = template.replace(':date',x[i].updated_at)
                                    tag += template
                                }
                                var htmlTable = "<table><thead><tr><td>"+header+"</td></tr></thead><tbody><tr><td>"+'<section class="comments">'+tag+"</section></td></tr></tbody></table>";
                                $("#incidentdetailsPage").empty();
                                $("#incidentdetailsPage").append(htmlTable);
                            }
                    });
                }
     });
});

$(document).on('pageshow', '#severityStats', function() {
    var testdata = [
                    {
                      status: "Open",
                      count: 5
                    },
                    {
                        status: "Closed",
                      count: 2
                    },
                    {
                        status: "Assigned",
                      count: 9
                    }
                  ];


                nv.addGraph(function() {
                    var width = 300, //300 is working fine
                        height = 400;

                    var chart = nv.models.pieChart()
                        .x(function(d) { return d.status+"("+d.count+")" })
                        .y(function(d) { return d.count })
                        .color(d3.scale.category10().range())
                        .width(width)
                        .height(height);

                      d3.select("#test2")
                          .datum(testdata)
                        .transition().duration(1200)
                          .attr('width', width)
                          .attr('height', height)
                          .call(chart);

                    chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

                    return chart;
                });
});
(function() {
    var testdata = [
                    {
                      status: "Open",
                      count: 5
                    },
                    {
                        status: "Closed",
                      count: 2
                    },
                    {
                        status: "Assigned",
                      count: 9
                    }
                  ];


                nv.addGraph(function() {
                    var width = 300, //300 is working fine
                        height = 400;

                    var chart = nv.models.pieChart()
                        .x(function(d) { return d.status })
                        .y(function(d) { return d.count })
                        .color(d3.scale.category10().range())
                        .width(width)
                        .height(height);

                      d3.select("#test1")
                          .datum(testdata)
                        .transition().duration(1200)
                          .attr('width', width)
                          .attr('height', height)
                          .call(chart);

                    chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

                    return chart;
                });

})();
(function(){
    $('#examplePadBasic').pad({'padId':'test'});
})();

//Invoke time line graph for count
(function() {
    var testdata = [
                    {
                      values: [{x:2014,y:2},{x:2013,y:2},{x:2011,y:2},{x:2011,y:2}],
                      key: 'Sine Wave',
                      color: '#ff7f0e'
                    },
                    {
                        values: [{x:2014,y:2},{x:2013,y:2},{x:2011,y:2},{x:2011,y:2}],
                        key: 'Cos Wave',
                        color: '#df7f0e'
                    }
                  ];


                nv.addGraph(function() {
                    var chart = nv.models.lineChart()
                                  .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                                  .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                                  .transitionDuration(350)  //how fast do you want the lines to transition?
                                  .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                                  .showYAxis(true)        //Show the y-axis
                                  .showXAxis(true)        //Show the x-axis
                    ;
            
                    chart.xAxis     //Chart x-axis settings
                        .axisLabel('Time (ms)')
                        .tickFormat(d3.format(',r'));
            
                    chart.yAxis     //Chart y-axis settings
                        .axisLabel('Voltage (v)')
                        .tickFormat(d3.format('1f'));
            
            
                    d3.select('#test3')    //Select the <svg> element you want to render the chart in.   
                        .datum(testdata)         //Populate the <svg> element with chart data...
                        .call(chart);          //Finally, render the chart!
            
                    //Update the chart when window resizes.
                    nv.utils.windowResize(function() { chart.update() });
                    return chart;
                });

})();
$(document).on('keydown','#incidentText', function(event) {
    if (event.keyCode == 13) {
      //console.log('Enter was pressed'+$("#incidentText").val());
      if($("#incidentText").val().length > 0){
          //post request prastah 
          //$("#incidentText").val();
          $("#incidentText").val("");
      }
    }
});

//Share the pad
$("#sharePad").click(function() {
    var url = $("iframe")[0].src;
    $("#shareUrlText").val(url);
    $("#popupShareUrl").popup();
    $("#popupShareUrl").popup('open');
});

$("#shareLink").click(function() {
   var url =  $("#shareUrlText").val();
   var email =  $("#shareUrlEmail").val();
   $.ajax({
       type : 'POST',
       url : "http://localhost:8080/CastIron/processEmail/sendEmails",
       data:{subject:"Etherpad URL",emailto:email,message:url},
       success:function(data){
           console.log("mail sent succesfully")
       }
   });
   $("#popupShareUrl").popup('close');
});

$('#logout').on('click', function() {
    $.ajax({
        type : 'POST',
        url : "http://localhost:3000/users/sign_out",
        success:function(d){
            alert("Logout Successfull!!!")
        }
    });
    $.mobile.changePage("#pageone");
});
//range slider function
$("#rangeslider").change(function(){
 var min = $("#range-1a").val()
 var max = $("#range-1b").val()
 var html = ""
 $.ajax({
     type : 'GET',
     url : "http://localhost:3000/search.json",
     data:{mindate:min,maxdate:max},
     success:function(data){
         if(data.length > 0){
             for(var i=0;i<data.length;i++){
                 severity = data[i].severity
                 id = data[i].id
                 html += '<li data-icon="false" data-severity="'
                         + severity + '"id="' + id
                         + '"><a href="#"><h2>'
                         + data[i].subject
                         + "</h2></a><span class='ui-li-count'>"
                         + severity + "</span></li>"
             }
             $("#rangeList").empty();
             $("#rangeList").append(html);
             $('#rangeList').listview().listview('refresh');
             $('#rangeList').filterable('refresh');
         }else{
             $("#rangeList").empty();
         }
     }
 });
  //alert(min+max)
});

$(document).on('pageshow', '#myincidents',function(){
    var html="";
    $.ajax({
        type : 'GET',
        url : "http://localhost:3000/recent.json", 
        success:function(data){
            if(data.length > 0){
                for(var i=0;i<data.length;i++){
                    severity = data[i].severity
                    id = data[i].id
                    html += '<li data-icon="false" data-severity="'
                            + severity + '"id="' + id
                            + '"><a href="#"><h2>'
                            + data[i].subject
                            + "</h2></a><span class='ui-li-count'>"
                            + severity + "</span></li>"
                }
                $("#myincidentsList").empty();
                $("#myincidentsList").append(html);
                $('#myincidentsList').listview().listview('refresh');
                $('#myincidentsList').filterable('refresh');
            }else{
                $("#myincidentsList").empty();
            }
        }
});
});