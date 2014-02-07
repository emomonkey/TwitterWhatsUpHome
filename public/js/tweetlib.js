'use strict';

var socket = io.connect();


  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-47727470-1', '80.229.21.163');
  ga('send', 'pageview');




socket.on('twitmessagestream', function(data) {
		  

		   document.getElementById('container').innerHTML = data.tweetmessage;

	

		   
	})



