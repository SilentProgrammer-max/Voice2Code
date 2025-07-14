function startListening() {
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = function (event) {
    const voiceCommand = event.results[0][0].transcript;
    document.getElementById("voiceText").innerText =
      "You said: " + voiceCommand;
    fetchCode(voiceCommand);
  };

  recognition.onerror = function (event) {
    alert("Speech recognition error: " + event.error);
  };
}

function fetchCode(prompt) {
  fetch("/generate-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("codeOutput").innerText =
        data.code || data.response || "No code found.";
    })
    .catch((err) => {
      document.getElementById("codeOutput").innerText =
        "Error generating code.";
    });
}

function copyCode() {
  const code = document.getElementById("codeOutput").innerText;
  navigator.clipboard
    .writeText(code)
    .then(() => alert("Code copied!"))
    .catch(() => alert("Failed to copy."));
}
