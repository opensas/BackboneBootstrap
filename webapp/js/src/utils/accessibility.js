function colorBlind() {	
    $('*').css('color','black');
    $('div.navbar-inner').css('background-color','white');
    $('* a:hover').css('color','black');
}

function resizeText(multiplier) {
  if (document.body.style.fontSize == "") {
	document.body.style.fontSize = "1.0em";
  }
	document.body.style.fontSize = parseFloat(document.body.style.fontSize) + (multiplier * 0.2) + "em";
}