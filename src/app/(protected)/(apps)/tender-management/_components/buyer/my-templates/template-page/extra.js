const ref = Globals.BaseAPI.PreLoader1732862556565;
/*         ref.ws.send(JSON.stringify({
            "evt": "START",
            "payload": taskUserMsg,
			"gender":ref.userProfileData.avatarDetails["gender"]
        })) */
		fetch('https://ikoncloud-dev.keross.com/aiagent/webhook-test/50b4660c-f2c3-4872-91d4-4c0408362525', {
			method: 'POST', // Specify the request method
			headers: {
				'Content-Type': 'application/json' // Indicate the data format
			},
			body: JSON.stringify({ // Convert the data to JSON
				docs:[]
			})
		})
		.then(async response => {
			//let audioData = await response.json();
			//audioData = audioData.data
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
// 			const audioBytes = Uint8Array.from(atob(audioData.audioOutput), c => c.charCodeAt(0));
// 			const blob = new Blob([audioBytes], { type: 'audio/mp3' }); // Use the correct MIME type
// 			const url = URL.createObjectURL(blob);
// 			const audio = new Audio(url);
// 			//audio.playbackRate = 1.3;
// 			// Stop speech recognition before playing audio
// 			ref.isRecognitionActive = false;
// /* 			if (ref.recognition) {
// 				ref.recognition.stop();
// 			} */
// 			eval(audioData.js)

// 			audio.play();

// 			// Restart speech recognition after audio ends
// 			audio.onended = () => {
// 				ref.isRecognitionActive = true;
// /* 				if (ref.recognition) {
// 					ref.recognition.start();
// 				} */
// 			};
			//return response.json(); // Or response.text() if the server returns plain text
		})
			.then(data => {
			console.log('Success:', data);
			// Handle the server's response
		})
			.catch(error => {
			console.error('Error:', error);
		});