chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	  var tabid;
	  chrome.tabs.query(
		  {currentWindow: true, active : true},
		  function(tabArray){
			/*console.log(tabArray);*/
			if(tabArray.length>0){
				tabid = tabArray[0].id;
				if(tabArray[0].url.search("facebook.com")){
					if(request.hidden_count=="" || request.hidden_count==undefined){
						chrome.browserAction.setBadgeText({text: '', tabId: tabid});   // <-- set text to '' to remove the badge
					}else{
						chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 128]});
						chrome.browserAction.setBadgeText({text: request.hidden_count.toString(), tabId: tabid});
						console.log(tabid);
					}
				}
			}
		  }
		);
});
