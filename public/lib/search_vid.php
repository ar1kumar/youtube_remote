<?php
	$data = $_POST['data'];
	//$response = http_get("https://www.googleapis.com/youtube/v3/search?key=AIzaSyBfGJ7nuAra9imWqN8q3UsHTWyiKvGLTdU&channelId=UC-9-kyTW8ZkZNDHQJ6FgpwQ&part=snippet,id&order=date&maxResults=50", array("timeout"=>1), $info);
	$request = file_get_contents("https://www.googleapis.com/youtube/v3/search?part=snippet&q=".$data."songs&type=video&videoDuration=short&videoCaption=any&key=AIzaSyBfGJ7nuAra9imWqN8q3UsHTWyiKvGLTdU&maxResults=50");
	//print_r($response);
	
	$data_back = json_decode($request);

        // set json string to php variables
	$items = $data_back->{"items"};

	// create json response
	$response = array();
	$i=0;
	foreach ($items as $key){
		$add = $i;
		$video_id = $key->{"id"}->{"videoId"};
		//$response[$add] = $video_id;
		array_push($response, $video_id);
		$i++;
	}
	
	header("Content-type: application/json");
	//--------send response------------//
	 
	   //$return = array_rand ($response,1);
	   echo json_encode($response);
	   //die();
?>