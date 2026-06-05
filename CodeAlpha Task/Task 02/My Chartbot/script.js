const faqData = {
    "intro": "University of Kotli AJK (formerly known as UMSIT) is a highly prestigious public sector higher education institution featuring 4 primary faculties:<br><ul class='chat-bullet-list'><li>Faculty of Computing and Engineering</li><li>Faculty of Management Sciences</li><li>Faculty of Basic and Applied Sciences</li><li>Faculty of Social Sciences & Humanities</li></ul>For more information, visit our website: <a href='https://uokajk.edu.pk' target='_blank' class='chat-link'>uokajk.edu.pk</a>",
    "location": "The University of Kotli campus is situated in the scenic and peaceful valley city of Kotli, Azad Jammu and Kashmir, Pakistan.<br><br>📍 View on maps: <a href='https://maps.google.com' target='_blank' class='chat-link'>Click here for Google Maps Location</a>",
    "date": "Fall Semester 2026 admissions officially launch around June/July.<br><br>🗓️ <b>Expected Application Deadline:</b> August 30, 2026.<br>Stay monitored via the web portal: <a href='https://admissions.uokajk.edu.pk' target='_blank' class='chat-link'>admissions.uokajk.edu.pk</a>",
    "criteria": "<b>Undergraduate (BS Programs):</b> Requires Higher Secondary Intermediate certification (FSc, ICS, I.Com, FA) with a minimum score threshold of 50% for technical divisions. The performance evaluation formula is:<br><ul class='chat-bullet-list'><li>70% academic weightage</li><li>30% formal entry test metrics</li></ul><br><b>Postgraduate (MS / M.Phil):</b> Requires a relevant 16-year BS undergraduate degree with a minimum 2.50 CGPA or 55% score equivalent alongside a 50% minimum score profile in the GAT General assessment.",
    "fee": "The per-semester operational cost breakdown is highly economical and affordable:<br><ul class='chat-bullet-list'><li>BS Computer Science / Software / AI: ~22,000 to 24,000 PKR</li><li>BBA / Management Sciences: ~20,000 PKR</li><li>Engineering Degrees (e.g., Electrical): ~28,000 PKR</li></ul>Review the complete institutional matrix: <a href='https://uokajk.edu.pk/fee-structure' target='_blank' class='chat-link'>uokajk.edu.pk/fee-structure</a>",
    "apply": "Follow this step-by-step digital application roadmap to secure enrollment:<br><ul class='chat-bullet-list'><li>Step 1: Create your candidate account at <a href='https://admissions.uokajk.edu.pk' target='_blank' class='chat-link'>admissions.uokajk.edu.pk</a></li><li>Step 2: Input your authentic profile information and matriculation/intermediate transcripts</li><li>Step 3: Upload digital scans of your original academic credentials and identity photos</li><li>Step 4: Generate and settle your admission processing fee voucher at the partner bank</li><li>Step 5: Access and download your formal testing credential slip via the online portal</li></ul>"
};

const datasetKeywords = {
    "intro": ["intro", "introduction", "about", "faculty", "faculties", "umsit", "university", "department"],
    "date": ["date", "deadline", "schedule", "last date", "timing", "2026", "when", "open", "close"],
    "criteria": ["criteria", "eligibility", "eligible", "merit", "marks", "admission", "percentage", "require"],
    "fee": ["fee", "fees", "structure", "cost", "expense", "pkr", "price", "money", "payment"],
    "apply": ["apply", "process", "online", "guide", "how to", "steps", "portal", "form", "registration"],
    "location": ["location", "where", "map", "address", "place", "campus", "direction", "situated"]
};

function getWelcomeMenu() {
    return "Please request information by typing your specific question or selecting a number key (1-6):<br><br>" +
           "<b>1.</b> General Institutional Introduction<br>" +
           "<b>2.</b> Fall 2026 Admission Schedule & Deadline<br>" +
           "<b>3.</b> Academic Eligibility & Merit Criteria<br>" +
           "<b>4.</b> Semester Tuition Fee Structure<br>" +
           "<b>5.</b> Step-by-Step Online Application Process<br>" +
           "<b>6.</b> Campus Geographic Location Map";
}

function cleanText(text) {
    return text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").trim();
}

function calculateBestMatch(userQuery) {
    const tokens = cleanText(userQuery).split(/\s+/);
    let bestIntent = null;
    let highestScore = 0;

    if(tokens.includes("1")) return "intro";
    if(tokens.includes("2")) return "date";
    if(tokens.includes("3")) return "criteria";
    if(tokens.includes("4")) return "fee";
    if(tokens.includes("5")) return "apply";
    if(tokens.includes("6")) return "location";

    for (let intent in datasetKeywords) {
        let keywordList = datasetKeywords[intent];
        let matches = 0;

        tokens.forEach(token => {
            keywordList.forEach(keyword => {
                if (token.includes(keyword) || keyword.includes(token) || LevenshteinDistance(token, keyword) <= 2) {
                    matches++;
                }
            });
        });

        let score = matches / (tokens.length + keywordList.length - matches);
        if (score > highestScore) {
            highestScore = score;
            bestIntent = intent;
        }
    }
    return (highestScore > 0.05) ? bestIntent : null;
}

function LevenshteinDistance(a, b) {
    if(a.length === 0) return b.length; 
    if(b.length === 0) return a.length;
    let matrix = [];
    for(let i = 0; i <= b.length; i++){ matrix[i] = [i]; }
    for(let j = 0; j <= a.length; j++){ matrix[0][j] = j; }
    for(let i = 1; i <= b.length; i++){
        for(let j = 1; j <= a.length; j++){
            if(b.charAt(i-1) === a.charAt(j-1)){ matrix[i][j] = matrix[i-1][j-1]; } 
            else { matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, Math.min(matrix[i][j-1] + 1, matrix[i-1][j] + 1)); }
        }
    }
    return matrix[b.length][a.length];
}

function sendBtn() {
    const inputField = document.getElementById("userInput");
    const rawText = inputField.value.trim();
    if (rawText === "") return;

    const chatContainer = document.getElementById("chatContainer");

    const userDiv = document.createElement("div");
    userDiv.className = "bubble user-bubble";
    userDiv.innerText = rawText;
    chatContainer.appendChild(userDiv);

    inputField.value = ""; 
    chatContainer.scrollTop = chatContainer.scrollHeight; 

    setTimeout(() => {
        const botDiv = document.createElement("div");
        botDiv.className = "bubble bot-bubble";
        
        const matchedIntent = calculateBestMatch(rawText);

        if (matchedIntent && faqData[matchedIntent]) {
            botDiv.innerHTML = faqData[matchedIntent];
        } else if (["hi", "hello", "hey", "salam", "start"].includes(cleanText(rawText))) {
            botDiv.innerHTML = "Hello! " + getWelcomeMenu();
        } else {
            botDiv.innerHTML = "I couldn't quite recognize that term. " + getWelcomeMenu();
        }

        chatContainer.appendChild(botDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight; 
    }, 300);
}