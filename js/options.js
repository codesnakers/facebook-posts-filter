// Saves options to chrome.storage
var xmlRes;
function c2cLog(s){ /*console.log(s);*/ }
/*function save_options() {
  /*$("#result").html("<img width='20px' src='loading.gif'>");* /
}*/

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
	word_list:'' 
	}, function(items) {
	createTable(items.word_list,"word_list");
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
/*document.getElementById('add_word').addEventListener('click', save_options);*/


function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}
function createTable(data,list){
	$("#"+list).empty();
	t = $("<table />");
	if(data!=""){
		var a = data.split(",");
		for(var i in a){
			tr = $("<tr />");
			/*$("<td />").html("<input type='checkbox' >").appendTo(tr);*/
			$("<td />").text(a[i]).appendTo(tr);
			//$("<td />").addClass("del_td").html("<button class='del_domain' data-list='"+list+"' data-domain='"+a[i]+"'>Del</button>").appendTo(tr);
			$("<td />").addClass("del_td").html("<img src='assets/del.png' alt='Delete' class='del_word' data-list='"+list+"' data-word='"+a[i]+"' >").appendTo(tr);
			tr.appendTo(t);
		}
	}
	$("#"+list).append(t);
}
function addToTable(domain,list){
	c2cLog("addtotable ma");
	var data = new Array();
	var td;
	$("#"+list+" table tr").each(function(){
		td = $(this).find("td").eq(0);
		data.push(td.text());
	});
	data.push(domain);
	var s = data.join(",");
	var o = {};
	o[list] = s;
	chrome.storage.sync.set(o, function() {
		// Update status to let user know options were saved.
		$("#"+list+"_status").text("Word List Saved").delay(800).text("");
		createTable(s,list);
	});
}
function removeFromTable(domain,list){
	var data = new Array();
	var td;
	$("#"+list+" table tr").each(function(){
		td = $(this).find("td").eq(0);
		if(td.text()!=domain){
			data.push(td.text());
		}
	});
	var s = data.join(",");
	var o = {};
	o[list] = s;
	chrome.storage.sync.set(o, function() {
		// Update status to let user know options were saved.
		$("#"+list+"_status").text("Domain List Saved").delay(500).text("");
		createTable(s,list);
	});
}
function saveTable(list){
	var data = new Array();
	$("#"+list+" table tr").each(function(){
		data.push($(this).find("td").eq(0).text());
	});
	var s = data.join(",");
	var o = {};
	o[list] = s;
	chrome.storage.sync.set(o, function() {
		// Update status to let user know options were saved.
		$("#"+list+"_status").text("Domain List Saved");
		$("#"+list+"_status").fadeIn().delay(1000).slideUp();
		createTable(s,list);
	});
}
function saveWord(){
	/*c2cLog("add inc domain ma");*/
	var d = extractDomain($("#word").val());
	if($.trim(d)!=""){
		addToTable(d,"word_list");
	}
	$("#word").val("");
}
$("#word").keypress(function(e){
	if(e.which === 13){
		saveWord();
	}
});
$("#add_word").click(saveWord);
$(".main-container").on("click",".del_word",function(){
	var d = $(this);
	if(confirm("Are you sure you want to delete the word "+d.attr("data-word")+" from the list?")){
		removeFromTable(d.attr("data-word"),d.attr("data-list"));
	}
});
$(".qtip").hover(function(){
	var id = $(this).attr("id");
	$("#"+id+"_text").toggle();
},function(){
	var id = $(this).attr("id");
	$("#"+id+"_text").toggle();
});
$(document).ready(function(){
	
	
});
