var AD_INTERVAL_MSEC = 200;
var ADS_SELECTOR = "#pagelet_ego_pane_w, #pagelet_side_ads, #pagelet_ego_pane, .-cx-PRIVATE-snowliftAds__root, .ego_column";
var POSTS_SELECTOR = "#contentArea ._5jmm._5pat._3lb4.s_1o-zocebct:not(.fbpf-hidden)";
var HIDDEN_POST_CLASS = "fbpf-hidden";
var HIDDEN_POST_MSG_CLASS = "fbpf-message";
var DONT_HIDE_CLASS = "fbpf-donthide"

// Initiate cleaning functionality if on facebook.com domain
var currentURL = "" + window.location;
var NUMBER_OF_POSTS = 0, NUMBER_OF_POSTS_HIDDEN = 0;
var WORD_LIST = "", RX = "";

/*console.log("ext loaded");*/

function numberOfPosts(){
	var posts = document.querySelectorAll(POSTS_SELECTOR).length;
	return posts;
}

/*jQuery(document).ajaxComplete(function(event, xhr, settings){
	console.log(event, xhr, settings);
});*/

jQuery(document).scroll(function(){
	/*console.log("NUMBER_OF_POSTS ",NUMBER_OF_POSTS);*/
	if(NUMBER_OF_POSTS == 0){
		NUMBER_OF_POSTS = numberOfPosts();
	}
	/*console.log("NUMBER_OF_POSTS ",NUMBER_OF_POSTS," numberOfPosts() ", numberOfPosts());*/
	if(NUMBER_OF_POSTS < numberOfPosts()){
		NUMBER_OF_POSTS = numberOfPosts();
		/*console.log("new posts loaded");*/
		hidePosts();
	}
	/*console.log("doc scrolled");*/
});

jQuery(document).ready(function(){
	/*console.log("doc ready");*/
	chrome.storage.sync.get(['word_list'], function(items) {
		WORD_LIST = items.word_list;
		if(WORD_LIST != ""){
			/*console.log("|     Extension will run    |");*/
			if(WORD_LIST.search("sponsored")!==-1){
				WORD_LIST += ",SpSonSsoSred";
			}
			RX = RegExp(WORD_LIST.replace(/\,/g,"|"),"i");
			/*console.log("regex ", WORD_LIST.replace(/\,/g,"|"));*/
			hidePosts();
		}/*else{
			console.log("word list not set");
		}*/
	});
	$("body").on("click", "."+HIDDEN_POST_CLASS+" ."+HIDDEN_POST_MSG_CLASS,function(){
		$(this).parent("."+HIDDEN_POST_CLASS).addClass(DONT_HIDE_CLASS).removeClass(HIDDEN_POST_CLASS);
		$(this).remove();
		sendCountToBG();
	});
});

/*window.onload = function() {
	var pageHost = window.location.hostname;
	pageHost = pageHost.replace(/www./g,"");
	chrome.storage.sync.get(['word_list'], function(items) {
		console.log("items ", items);
		var word_list = items.word_list;
		if(word_list!="" && ( window.location.host=="facebook.com" || window.location.hostname=="facebook.com" )){
			c2cLog("|     Extension will run    |");
			theOBJ();
		}else{
			c2cLog("word list not set");
		}
	});
}*/
/*document.addEventListener('DOMSubtreeModified', function(){
  console.log('DOMSubtreeModified called');
  var posts = document.querySelectorAll(POSTS_SELECTOR);
  console.log("number of posts ", posts.length);
});
document.addEventListener('DOMContentLoaded', function domLoaded(){
	//run_at document_start hoy to chale
	console.log("dom loaded");
	if( window.location.host=="www.facebook.com" || window.location.hostname=="www.facebook.com" ){
		console.log("is facebook");
		chrome.storage.sync.get(['word_list'], function(items) {
			console.log("items ", items);
			var word_list_csv = items.word_list;
			if(word_list_csv!=""){
				console.log("|     Extension will run    |");
				hidePosts(word_list_csv);
			}else{
				console.log("word list not set");
			}
		});
	}
});
*/
function sendCountToBG(){
	NUMBER_OF_POSTS_HIDDEN = $("."+HIDDEN_POST_CLASS).length;
	/*chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 128]});
	chrome.browserAction.setBadgeText({text: NUMBER_OF_POSTS_HIDDEN});   // <-- set text to '' to remove the badge*/
	chrome.runtime.sendMessage({hidden_count: NUMBER_OF_POSTS_HIDDEN}, function(response) {});
}
function hidePosts(){
	/* to hide sponsored posts SpSonSsoSred  */
	if(RX===""){
		return;
	}
	var posts = document.querySelectorAll(POSTS_SELECTOR);
	var str,s,cls;
	for(var i=0; i<posts.length; i++){
		str = posts[i].innerText;
		s = str.search(RX);
		cls = posts[i].className;
		if(s != -1 && cls.search(DONT_HIDE_CLASS) === -1){
			
			/*console.log("matching post found ", s , " : ", str.substr(s,20));*/
			sendCountToBG();
			/*console.log("post hidden");*/
			$("<div />").text("Post Hidden by FB Posts Filter [Click to Show]").addClass("fbpf-message").appendTo($(posts[i]));
			posts[i].className = cls + " " + HIDDEN_POST_CLASS;
		}
	}
}