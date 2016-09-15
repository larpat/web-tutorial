var frameData = null;
var frameDataLoaded = false;
var frameCount;
var OOI = null;
var ctx;
var frameNumber = 0;
var frames = [];
var barHeight;
var listenerActive = false;

function drawHole(object) {
	for(var i = 0; i < object.length; i++){
		var rectangle = object[i].getBoundingClientRect();
		ctx.beginPath();
		ctx.globalCompositeOperation = 'destination-out';
		ctx.lineJoin = "round";
		ctx.lineWidth = 20;
		ctx.rect(rectangle.left - 6, rectangle.top - 6 - barHeight, rectangle.width + 12, rectangle.height + 12);
		ctx.fill();
		ctx.stroke();
	}

	var rectangle = $('nav')[0].getBoundingClientRect();
	ctx.beginPath();
	ctx.fillStyle = "rgba(0,0,0,1)";
	ctx.rect(rectangle.left, rectangle.top-barHeight, rectangle.width, rectangle.height);
	ctx.globalCompositeOperation = 'destination-out';
	ctx.fill();
	ctx.fillStyle = "rgba(0,0,0,0.5)";
	ctx.globalCompositeOperation = 'destination-over';
	ctx.fill();
	ctx.fillStyle = "rgba(255,255,255,1)";
}

function scrollTo(element) {
	$('body, html').animate({ scrollTop: $(element).offset().top-window.innerHeight*0.4}, 600);
	window.setTimeout(function () {
		$('body,html').stop(true,false,true);
	},600);
}

function createNewFrame(newFrame){
	OOI = getObjectOfInterest();

	if (newFrame) {
		var data = frameData.find('frame[number=' + frameNumber + ']');
		var expl = data.find("explanation").html();
		var task = data.find("task").html();

		$("#progress").html(data.find("headline").html() + " (" + (frameNumber + 1) + " von " + frameCount + ")");
		$('#explanation').html(expl);
		$('#task').html(task);

		if (!expl || !task) {
			$('hr').hide();
		} else {
			$('hr').show();
		}

		var left;
		var top;

		if(data.find('textposition').length == 0) {
			left = frameData.find('standard').find('left').html() + "vw";
			top = frameData.find('standard').find('top').html() + "vh";
		} else {
			left = data.find('left').html() + "vw";
			top = data.find('top').html() + "vh";
		}

		$('#textwrapper').css({left: left, top: top});

		if(OOI != null){
			scrollTo(OOI);
		}
	}

	if(OOI != null){
		drawHole(OOI);
	}

	frameSpecific();
}



function taskDone() {
	var data = frameData.find('frame[number=' + frameNumber + ']');
	var buttonTemp = data.find('objectOfInterest').attr('button');
	var TDTemp = data.find("taskDoneValue").html();

	if (buttonTemp == "false") {
	  
		if (TDTemp == "") {
			TDTemp = null;
		}
		
		if (frameData != null && TDTemp != null) {
			return getObjectOfInterest().val() == TDTemp;
		} else {
			return true;
		}
		
	} else {
		return false;
	}
}

function frameSpecific() {
	switch (frameNumber) {
		case 8: listenerActive = true;
			break;
		case 16:listenerActive = true;
			break;
		case 17: listenerActive = true;
			break;
		default: listenerActive = false;
			break;

	}
}

function getObjectOfInterest() {

	if (frameData != null) {
		var data = frameData.find('frame[number=' + frameNumber + ']');
		var OOITemp = data.find("objectOfInterest").html();
		return $('body').find(OOITemp);
	} else {
		return null;
	}
}

function setup(){
	barHeight = $('#navigation')[0].getBoundingClientRect().height;

	$("#overlay").css("top", barHeight).css('height', window.innerHeight - barHeight);

	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	ctx.canvas.height = window.innerHeight - barHeight;
	ctx.canvas.width = window.innerWidth;
	ctx.fillStyle = "rgba(0,0,0,0.5)";
	ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
	ctx.fillStyle = "rgba(255,255,255,1)";

	$('#content').css('pointer-events', 'none');
	$('nav').add(OOI).css('pointer-events', 'auto');
}

//Listener Methoden

function redraw(){
	setup();
	if(!frameDataLoaded) {
		window.setTimeout(function () {
			redraw();
		}, 1);
	} else {
		createNewFrame(false);
	}

}

function drawNewFrame(){
	setup();
	if(!frameDataLoaded) {
		window.setTimeout(function () {
			drawNewFrame();
		}, 1);
	} else {
		createNewFrame(true);

		if(OOI != null){

			if(listenerActive){
				OOI.click(function(e){
					frameNumber++;
					drawNewFrame();
					listenerActive = false;
				});
			}
		}
	}

	$('body').focus();
}

function userAction(par) {
	if (par == 37 && frameNumber > 0) {
		frameNumber--;
		drawNewFrame();
	} else if(par == 39 && frameNumber < frameCount - 1) {
		if (taskDone()) {
			frameNumber++;
			drawNewFrame();
		} else {
			remindOfTask();
		}
	} else if(par == 71) {
		frameNumber++;
		drawNewFrame();
	}
	else if(par == 27){
		stopTutorial();
	}
}

function remindOfTask() {
	var animationLength = 75;
	$('#task').animate({ left: '-1vw'}, animationLength);
	$('#task').animate({ left: '1vw'},animationLength);
	$('#task').animate({ left: '0vw'}, animationLength);
	window.setTimeout(function () {
		$('#task').stop(true,true,true);
		$('#task').css({left: '0vw'});
	}, animationLength * 4);
}

$(document).ready(function(){
  $('#next').click(function() {
		userAction(39);
	});

	$('#back').click(function() {
		userAction(37);
	});

	$(document).keyup(function(e) {
		userAction(e.which);
	});
	
  $('.startTutorial').click(function(){
  	$('.tutorial').toggle();
  	redraw();
  });
  
  $(window).scroll(function() {
  	if ($('.tutorial:hidden').length == 0) {
  		var scroll = $(this).scrollTop(),
  			nav = $('nav'),
  			header = $('header'),
  			pos,
  			pos,
  			navOffset = header.offset().top + header.outerHeight();
  
  		if (scroll > navOffset - barHeight) {
  			nav.css({top: barHeight, position: 'fixed'});
  		} else {
  			nav.css({top: '0px', position: 'relative'});
  		}
  
  		pos = scroll + nav.height();
  
  		$('nav a').removeClass('active').each(function() {
  			var target = $(this).attr('href'),
  				offset = $(target).offset(),
  				height = $(target).height();
  
  			if (offset.top <= pos && pos < offset.top + height) {
  				$(this).addClass('active');
  				return false;
  			}
  		})
  	}
  
  	redraw();
  });
  
  $(window).resize(function() {
  	redraw();
  });
	
	$('.tutorial').hide();
	ctx = document.getElementById("overlay").getContext("2d");
	drawNewFrame();
	setup();
});
