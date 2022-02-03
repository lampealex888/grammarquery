// import fetch from 'node-fetch'
// import dotenv from 'dotenv'
// const express = require('express')
// const app = express()
// const port = 3000
import {randomQuestion} from './questions.js'

let recording = false;
let selectedCategory = null;
const questionContainer = document.getElementById("question-container");
const questionText = document.getElementById("question");
const recordButton = document.getElementById("record");
const transcriptText = document.getElementById("transcript-text");
const nextQuestionButton = document.getElementById("change-question-button");
const corrections = document.getElementById("transcript-result");
const periodDropdown = document.getElementById("period_dropdown");
const categories = document.getElementById("categories");
const transcriptContainer = document.getElementById("transcript-container");
const tryAgainButton = document.getElementById("try-again-btn");
const transcriptResult = document.getElementById("transcript-result");
const textToSpeech = document.getElementById("text-to-speech");

// Choose a next question
nextQuestionButton.addEventListener('click', () => {
	questionText.textContent = randomQuestion(periodDropdown.value)
})

// Choose a category
categories.addEventListener('click', () => {
	if (periodDropdown.value != -1 && selectedCategory != periodDropdown.value) {
		questionContainer.style.display = 'flex'
		questionText.textContent = randomQuestion(periodDropdown.value);
		selectedCategory = periodDropdown.value;
	}
	if (periodDropdown.value == -1) questionContainer.style.display = 'none'
})
// Record button
recordButton.addEventListener('click', () => {
	if (recording == false) {
		recordButton.textContent = "Stop Recording"
		recording = true
		startRecord()
	} else {
		recordButton.textContent = "Record"
		recording = false;
		(async () => {
			const audio = await recorder.stop()
			console.log(audio)
		})
		transcriptContainer.style.display = 'block'
		transcriptContainer.scrollIntoView()

	}
})

const recordAudio = () => {
	return new Promise(resolve => {
	  navigator.mediaDevices.getUserMedia({ audio: true })
		.then(stream => {
		  const mediaRecorder = new MediaRecorder(stream);
		  const audioChunks = [];
  
		  mediaRecorder.addEventListener("dataavailable", event => {
			audioChunks.push(event.data);
		  });
  
		  const start = () => {
			mediaRecorder.start();
		  };
  
		  const stop = () => {
			return new Promise(resolve => {
			  mediaRecorder.addEventListener("stop", () => {
				const audioBlob = new Blob(audioChunks);
				const audioUrl = URL.createObjectURL(audioBlob);
				const audio = new Audio(audioUrl);
				const play = () => {
				  audio.play();
				};
  
				resolve({ audioBlob, audioUrl, play });
			  });
  
			  mediaRecorder.stop();
			});
		  };
  
		  resolve({ start, stop });
		});
	});
  };
tryAgainButton.addEventListener('click', () => {
	transcriptContainer.style.display = 'none'
})

function updateTranscriptResult(newTranscript) {
	if (newTranscript != undefined) {
		while (elements.corrections.firstChild) {
			elements.corrections.removeChild(elements.corrections.firstChild);
		}
		for (let i = 0; i < newTranscript.length; i++) {
			let listItem = document.createElement('li')
			listItem.textContent = newTranscript[i]
			elements.corrections.appendChild(listItem)
		}
		if (newTranscript.length == 0) {
			let listItem = document.createElement('li')
			listItem.textContent = "Correct! :)"
			elements.transcriptResult.appendChild(listItem)
		}
	}
}

// textToSpeech.addEventListener('click', () =>{
// 		state.textToSpeech = speakTheQuestion(questionText.textContent);
// })