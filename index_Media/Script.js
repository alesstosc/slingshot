// Utilizza Detect.js per rilevare il tipo di dispositivo
var tipoDispositivo = detect.parse(navigator.userAgent);

// Verifica il tipo di dispositivo
if (tipoDispositivo.mobile) {
console.log("Questo dispositivo è un cellulare.");
} else if (tipoDispositivo.tablet) {
console.log("Questo dispositivo è un tablet.");
} else {
GetUrl("http://www.google.com");

}

