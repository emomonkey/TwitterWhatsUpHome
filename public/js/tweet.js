<script src="dust-core-0.3.0.min.js"></script>
<script type="text/javascript">
alert('tweet libraray loaded');


	var socket = io.connect();
	var messagearray[];
	var template = "<div><ul><li>{title}</li>{#tweets}<li>{.} /li>{/tweets}</ul> </div>"

	alert('tweet message loaded');

	socket.on('twitmessagestream', function(data) {
		   alert('recieved message');
		   messagearray.push(data);

		   if (messagearray.length() > 100)
		   {
		   		messagearray.shift();
		   }

		   var data = JSON.stringify(messagearray);
		   var compiled = dust.compile(template, "Tweets");
		   dust.loadSource(compiled);

		   dust.render("Tweets", data, function(err, out){
		   		$('#container').html(out).trigger("create");
		   })

		   
	})


 </script>
