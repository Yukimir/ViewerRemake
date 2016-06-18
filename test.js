const ipcrender = require('electron').ipcRenderer;
ipcrender.on('name', function(event, message) {
	  var a = document.getElementsByClassName('card_title');
	  if(a.length > 0){
		  a = a[0];
		  var s = a.childNodes[2].wholeText;
		  s = s.substring(0,s.indexOf('\n'));
		  ipcrender.sendToHost('name',s);
	  }
});
ipcrender.on('pic', function(event, message) {
	b = document.getElementsByTagName('img');
	for(var i = 0;i<b.length;i++)
	{
		if(b[i].getAttribute('width') == '310px') ipcrender.sendToHost('pic',b[i].getAttribute('src'));
	}
});