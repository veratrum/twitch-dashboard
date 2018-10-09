
var clientID = "fdut9mge16j1horjcs3xa2l001ly3a";
var oauthToken = "";

function getData() {
	if (document.location.hash == "") {
		return;
	}
	
	oauthToken = document.location.hash.split("&")[0].substring(14, 44);
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://api.twitch.tv/kraken/streams/followed?stream_type=live&client_id=" + clientID, true);
	xhr.setRequestHeader("Client-ID", clientID);
	xhr.setRequestHeader("Authorization", "OAuth " + oauthToken);
	
	xhr.onload = function() {
		var data = JSON.parse(this.responseText);
		
		var output = "";
		var streams = data._total;
		for (var i = 0; i < streams; i++) {
			output += "<tr>"
			var name = data.streams[i].channel.display_name;
			output += "<td><a href=\"http://twitch.tv/" + name + "\">" + name + "</a></td>";
			output += "<td>" + data.streams[i].game + "</td>";
			output += "<td>" + data.streams[i].viewers + " viewers" + "</td>";
			output += "<td><img src=\"" + data.streams[i].preview.medium + "?rand=" + Math.random() + "\"></td>";
			output += "<td>" + data.streams[i].channel.status + "</td>";
			
			output += "</tr>";
		}
		
		document.getElementById("output").innerHTML = output;
	};
	
	xhr.send(null);
}

function auth() {
	// redirect the user to a twitch login page where they get a token, then get redirected back here with the token
	window.location.href = "https://id.twitch.tv/oauth2/authorize" +
	"?client_id=" + clientID +
	"&redirect_uri=http://localhost/dev/twitch-live/" +
	"&response_type=token" +
	"&scope=user_read";	
}

window.onload = function() {
	document.getElementById("refresh").onclick = getData;
	document.getElementById("auth").onclick = auth;
	
	// attempt to make the request in case the user has returned back with the token. nothing will happen if the token isn't in the url already
	getData();
};