// 1. TEXT TRANSLATION ENGINE (API)
async function performTranslation() {
    const sourceText = document.getElementById("sourceText").value.trim();
    const targetText = document.getElementById("targetText");
    const sourceLang = document.getElementById("sourceLang").value;
    const targetLang = document.getElementById("targetLang").value;

    if (!sourceText) {
        targetText.value = "";
        targetText.placeholder = "Translation will appear here...";
        return;
    }

    targetText.placeholder = "Translating text, please wait...";
    targetText.value = "";

    // MyMemory Free REST Translation API Integration
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=${sourceLang}|${targetLang}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("API Network response down.");
        
        const data = await response.json();
        if (data.responseData) {
            targetText.value = data.responseData.translatedText;
        } else {
            targetText.value = "Translation Error. Please try again.";
        }
    } catch (error) {
        console.error("Error standard trace:", error);
        targetText.value = "Server Busy. Check network connection.";
    }
}

// 2. VOICE INPUT FEATURE (SPEECH TO TEXT)
let recognition;
function startSpeechRecognition() {
    const micBtn = document.getElementById("micBtn");
    const sourceText = document.getElementById("sourceText");
    const sourceLang = document.getElementById("sourceLang").value;

    // Browser compatibility check
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        alert("Your browser does not support Speech Recognition. Try Google Chrome.");
        return;
    }

    if (!recognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            micBtn.style.background = "#e53e3e"; // Mic turns red when recording
            micBtn.style.color = "#ffffff";
            sourceText.placeholder = "Listening actively... Speak into your mic.";
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            sourceText.value = transcript;
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            alert("Mic error: " + event.error);
        };

        recognition.onend = () => {
            micBtn.style.background = ""; // Reset mic style
            micBtn.style.color = "";
            sourceText.placeholder = "Start typing or click the mic to speak...";
            // Automatically translate after speech finishes
            performTranslation();
        };
    }

    // Dynamic language detection for input voice
    recognition.lang = sourceLang;
    recognition.start();
}

// 3. AI AUDIO OUTPUT WITH DYNAMIC WAVE ANIMATION
function speakTranslation() {
    const textToSpeak = document.getElementById("targetText").value;
    const targetLang = document.getElementById("targetLang").value;
    const voicePlayerBox = document.getElementById("voicePlayerBox");
    
    if (!textToSpeak) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = targetLang; 

    // Show wave box animation when audio starts playing
    utterance.onstart = () => {
        if (voicePlayerBox) {
            voicePlayerBox.style.display = "flex";
        }
    };

    // Hide wave box animation when audio finishes
    utterance.onend = () => {
        if (voicePlayerBox) {
            voicePlayerBox.style.display = "none";
        }
    };

    utterance.onerror = () => {
        if (voicePlayerBox) {
            voicePlayerBox.style.display = "none";
        }
    };

    window.speechSynthesis.speak(utterance);
}

// 4. CLIPBOARD COPY ENGINE
function copyTranslation() {
    const textToCopy = document.getElementById("targetText").value;
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
        alert("Translation copied to clipboard successfully!");
    }).catch(err => {
        console.error("Could not copy text: ", err);
    });
}