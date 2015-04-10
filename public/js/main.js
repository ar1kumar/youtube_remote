function randomString(len) {
			    //var chars = "1234567890abcdefghijklmnopqrstuvwxyz";
			    var chars = "1";
			    var string_length = len;
			    var randomstring = '';
			    for (var i = 0; i < string_length; i++) {
			        var rnum = Math.floor(Math.random() * chars.length);
			        randomstring += chars.substring(rnum, rnum + 1);
			    }
			    return randomstring;
			}

	
		$(document).ready(function(){
			 
			//var baseURL = "http://192.168.1.109:3000/"
			var baseURL = "https://leanback.herokuapp.com/";
			var roomURL = baseURL+"mobile/"+roomId;	
			var socket = io.connect(baseURL);
			//var roomId = randomString(4);
			var roomId = randomString(1);
			      
			//start a room
			//generate url for mobile to join room
			//restrict room for two clients
			//listen for incoming actions
			
			
			//room created
			socket.emit('new_room', roomId);
		
			//url for mobile generated
			console.log('mobile-link- '+baseURL+'m/'+roomId);
			$('#link_bar').html('Remote URL- '+baseURL+'m/'+roomId)
			
			/* toggle night mode on - switch */
			// Switch toggle
			$('.Switch').click(function() {
				$(this).toggleClass('On').toggleClass('Off');
				var get_action = $(this).attr('class');
				console.log(get_action+" - Night mode")
			});
			
			/* embed video from input link */
			$('#submit').click(function(){
				get_vid = $('#vid_link').val();
				if(get_vid == "" || get_vid == null || get_vid == " "){
					alert('Please enter a youtube link');
				}else{
					vid_id = extractVideoID(get_vid);	
					console.log('video info 2 - '+vid_id[0]+'-::-'+vid_id[1]);
					onYouTubeIframeAPIReady(vid_id[0],vid_id[1]);
					console.log('click');
				}
				//vid_id = extractVideoID(get_vid);
				//onYouTubeIframeAPIReady(vid_id);
			})
				
			/* Get video id from entered url	 */
			function extractVideoID(url){
			    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
			    var match = url.match(regExp);
			    if ( match && match[7].length == 11 ){
			        var playlist = youtube_playlist_parser(url);
			        var video_id = match[7];
			        return [video_id, playlist];
			        //console.log('video info - '+video_id+'-::-'+playlist)
			    }else{
			        alert("Could not get video.");
			    }
			}
			
			//get playlist id from url
		    function youtube_playlist_parser(url){
			    var reg = new RegExp("[&?]list=([a-z0-9_-]+)","i");
		        var match = reg.exec(url);
		
		        //if (match&&match[1].length>0&&youtube_validate(url)){
		        if (match&&match[1].length>0){
		            return match[1];
		        }else{
		            return "nope";
		        }
		
		    }    

		  // validate if its a youtube URL
		  function youtube_validate(url) {
			  var regExp = /^(?:https?:\/\/)?(?:www\.)?youtube\.com(?:\S+)?$/;
			  return url.match(regExp)&&url.match(regExp).length>0;
		  }
		    
		  function send_video_info(url){
			  	var video_id = $('#video_info').attr('id');
			  	$.get("https://gdata.youtube.com/feeds/api/videos/"+url+"?v=2&alt=jsonc",function(data){
				  console.log('data from YT API-'+data.data.title)
				  
				  data = {
						roomId : roomId,
						video_info : data.data.title
					}
					socket.emit('video_info', data);	
				})
		  }
			 
				//2. This code loads the IFrame Player API code asynchronously.
			      var tag = document.createElement('script');
			
			      tag.src = "https://www.youtube.com/iframe_api";
			      var firstScriptTag = document.getElementsByTagName('script')[0];
			      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			
			      // 3. This function creates an <iframe> (and YouTube player)
			      //    after the API code downloads.
			      var player;
			      var start = true;
			      function onYouTubeIframeAPIReady(url,playlist) {
			      	console.log(url+'-video data-'+playlist);
			        if(start){
					     player = new YT.Player('player', {
					          height: '350',
					          width: '640',
					          videoId: url,
					          playerVars: {'list': playlist, 'autoplay': 0, 'controls': 0, 'rel':0, 'showinfo':0, 'enablejsapi':1 },
					          events: {
					            'onReady': onPlayerReady,
					            'onStateChange': onPlayerStateChange
					          }
					        });   
					    start = false; 
					    
					    $('#video_info').attr('id',url);
					    send_video_info(url);
					    
			        }/*
			        else if(!start && playlist != 'nope'){
				     	var get_list = $('#player').attr('src');
				     	list_id = get_list.split('?')[1].split('&')[0];
				     	naya_id = get_list.replace(list_id,"list="+playlist);
				     	$('#player').attr('src',naya_id);
				     	
			        }
			        */else{
				        //player.loadVideoById(url);   
				        $('#player').attr('src','https://www.youtube.com/embed/'+url+'?list='+playlist+'&autoplay=0&controls=0&rel=0&showinfo=0&enablejsapi=1');
				        
				        $('#video_info').attr('id',url);
				        send_video_info(url);
			        }
			        console.log(url+" - video id updated")
			      }
			      
			      // 4. The API will call this function when the video player is ready.
			      function onPlayerReady(event) {
			        //event.target.playVideo();
			        //do whatever when the player is ready
			        player.playVideo();
			        //send_video_info();
			      }
			      
			     function onPlayerStateChange(){
				    player.playVideo();  
				    //send_video_info();
			     }
			      
			      //actions coming from remote URL
			      socket.on('play/pause', function(data){
				 	//alert('reaction');
				 	control = data.action;
				 	console.log('play pause action');
				 	if(control == 'pause'){
					 	player.pauseVideo();
				 	}else if(control == 'play'){
					 	player.playVideo();

				 	}
				});
				
				socket.on('volume', function(data){
				 	new_volume = data.volume;
				 	console.log('volume- '+new_volume);
				 	player.setVolume(new_volume);
				});
				
				socket.on('reaction', function(data){
				 	control = data.action;
				 	if(control == 'next'){
					 	player.nextVideo();
				 	}else if(control == 'prev'){
					 	player.previousVideo();
					}
				});
				
				socket.on('new_video', function(data){
				 	new_video = data.video;
				 	new_list = data.list;
				 	console.log(new_video+" -new video info-" +new_list)
				 	if(new_list == undefined){
					 	new_list = "nope";
				 	}else{
					 	new_list = data.list;
				 	}
				 	onYouTubeIframeAPIReady(new_video, new_list);
				});
		
			})