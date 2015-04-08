		
	window.onload = function() {
	
		/* Start the volume slider plugin */
		$("#volume").simpleSlider();

		console.log('starts');
		//var baseURL = "http://192.168.1.109:3000/"
		var baseURL = "https://leanback.herokuapp.com/";
		var socket = io.connect(baseURL);
		
		url = document.URL;
		fragments = url.split('/');
		roomId = fragments[fragments.length - 1];
		
		
		//join room
		socket.emit('new_room', roomId);	
		
		//define variables
		var play = true;
		/*
		var list = new Array();
		var thumb = new Array();
		var title = new Array();
*/
		
		$('#click').click(function(){
			if(play){
				data = {
					roomId : roomId,
					action : 'pause'
				}
				socket.emit('play/pause', data);
				$('#click').css('-webkit-filter', 'invert(100%)'); 	
				play = false;	
			}else if(!play){
				data = {
					roomId : roomId,
					action : 'play'
				}
				socket.emit('play/pause', data);	
				$('#click').css('-webkit-filter', 'invert(0%)'); 	
				play = true;	
			}
			
		})
		
		//common function for all buttons - get button action
		$('.action').click(function(){
			resp = $(this).attr('id');
			data = {
				roomId : roomId,
				action : resp
			}
			socket.emit('action', data);	
		})
		
		$("#volume").bind("slider:changed", function (event, data) {
		  // The currently selected value of the slider
		  console.log(data.value);
		  var volume = Math.round(data.value*100)
		  
		  data = {
					roomId : roomId,
					action : 'volume',
					volume : volume
				}
				socket.emit('volume', data);
		  
		  // The value as a ratio of the slider (between 0 and 1)
		  //console.log(data.ratio);
		});
		
		
		/* search for videos */
		$('.search_btn').click(function(){

			$('.results_list').empty();
			var list = new Array();
			var thumb = new Array();
			var title = new Array();
			
			setTimeout(function(){
				var string = $('.search_bar').val();

				$.get( "https://www.googleapis.com/youtube/v3/search?part=snippet&q="+string+"&type=video&videoDuration=short&videoCaption=any&key=AIzaSyBfGJ7nuAra9imWqN8q3UsHTWyiKvGLTdU&maxResults=50", function(data){
					for(i=0;i<50;i++){
						list.push(data.items[i].id.videoId)
						thumb.push(data.items[i].snippet.thumbnails.medium.url)
						title.push(data.items[i].snippet.title)
						$('.results_list').append("<li class='vid_list mobile-grid-100 clear_fix' id='"+list[i]+"'><img src='"+thumb[i]+"' class='mobile-grid-50' alt=''/>"+title[i]+"</li>")
					}
				});
			},1000)
		})
		
		$(document).on('click', 'ul li', function(e) { 
			$('.active').removeClass('active');
			get_video = $(this).attr('id');
			console.log(get_video+" -video ID");
			data = {
				roomId : roomId,
				video : get_video
			}
			socket.emit('update_video', data);	
			$(this).addClass('active');
		});
		
	}
	
	