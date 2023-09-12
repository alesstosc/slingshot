function Frame__0_0(ID){alert("UserAgent: " + navigator.userAgent + "\nappName: " + navigator.appName + "\nappVersion: " + navigator.appVersion);
// Ottieni la stringa userAgent
var userAgentString = navigator.userAgent;

// Dividi la stringa in parole utilizzando uno o più spazi come delimitatori
var parole = userAgentString.split(/\s+/);

// Utilizza un ciclo for per enumerare le parole
var contatore=0;
for (var i = 0; i < parole.length; i++){
	if (parole[i]=="(Windows") {
		contatore=contatore+1;
	}
}
if (contatore==1){
	GetUrl("http://www.microsoft.com");
} else{
	GetUrl("http://www.google.com");
}
	



}

