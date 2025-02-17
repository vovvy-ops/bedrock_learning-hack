// ==UserScript==
// @name         Bedrock Learning Solver
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Takes a screenshot of Bedrock Learning, sends it to Gemini, and displays the answer in a beautifully styled new tab.
// @author       You
// @match        https://app.bedrocklearning.org/*
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://html2canvas.hertzen.com/dist/html2canvas.min.js
// ==/UserScript==

(function () {
    'use strict';

    const GEMINI_API_KEY_KEY = 'Your-Google-API-Key-Here';
    let geminiApiKey = GM_getValue(GEMINI_API_KEY_KEY, null);
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=';
    const DEFAULT_PROMPT = "Analyze the image and identify any questions. Answer the questions clearly and concisely";
    const ADDITIONAL_PROMPT_MESSAGE = "Enter any additional instructions or questions to send with the image (or leave blank for default prompt):";

    async function checkApiKey() {
        if (!geminiApiKey) {
            geminiApiKey = prompt("Enter your Google AI Studio API Key:");
            if (geminiApiKey) {
                GM_setValue(GEMINI_API_KEY_KEY, geminiApiKey);
                alert("API key saved. Press Ctrl+X again to process the question.");
            } else {
                alert("API key required for the script to function.");
            }
            return false;
        }
        return true;
    }

    function captureScreenshot() {
        return html2canvas(document.body, {
            useCORS: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: document.body.scrollWidth,
            windowHeight: document.body.scrollHeight,
            width: document.body.scrollWidth,
            height: document.body.scrollHeight
        });
    }

    function convertCanvasToBlob(canvas) {
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                blob ? resolve(blob) : reject(new Error('Failed to convert canvas to blob.'));
            }, 'image/png');
        });
    }

    async function sendImageToGemini(imageBlob, additionalPrompt = "") {
        if (!await checkApiKey()) return;

        const reader = new FileReader();
        reader.readAsDataURL(imageBlob);

        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                const base64Image = reader.result.split(',')[1];
                const promptText = additionalPrompt.trim() !== "" ? additionalPrompt : DEFAULT_PROMPT;

                const payload = {
                    contents: [
                        {
                            parts: [
                                { text: promptText },
                                {
                                    inline_data: {
                                        mime_type: "image/png",
                                        data: base64Image
                                    }
                                }
                            ]
                        }
                    ]
                };

                GM_xmlhttpRequest({
                    method: "POST",
                    url: GEMINI_API_URL + geminiApiKey,
                    headers: { "Content-Type": "application/json" },
                    data: JSON.stringify(payload),
                    onload: function (response) {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const jsonResponse = JSON.parse(response.responseText);
                                let answer = jsonResponse?.candidates?.[0]?.content?.parts?.[0]?.text || "No answer found.";

                                // Apply bold and italic formatting
                                answer = answer.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Bold
                                answer = answer.replace(/"(.*?)"/g, '<i>$1</i>'); // Italics

                                displayAnswerInNewTab(answer);
                            } catch (error) {
                                reject("Error parsing response: " + error.message);
                            }
                        } else {
                            reject(`API Error: ${response.status} - ${response.responseText}`);
                        }
                    },
                    onerror: function (error) {
                        reject("Request error: " + error);
                    }
                });
            };
            reader.onerror = () => reject(new Error('Failed to read image.'));
        });
    }

    function displayAnswerInNewTab(answer) {
        const newTabContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Gemini Answer</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
                <style>
                    @keyframes gradientChange {
                        0% { background: #1E1E2F; }
                        25% { background: #3E4E5E; }
                        50% { background: #2E2E3E; }
                        75% { background: #0E1E2F; }
                        100% { background: #1E1E2F; }
                    }

                    body {
                        font-family: 'Poppins', sans-serif;
                        animation: gradientChange 10s infinite alternate ease-in-out;
                        color: #FFF;
                        text-align: center;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .container {
                        background: rgba(255, 255, 255, 0.1);
                        padding: 20px;
                        border-radius: 12px;
                        max-width: 600px;
                        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
                        transition: transform 0.3s, box-shadow 0.3s;
                    }
                    .container:hover {
                        transform: scale(1.05);
                        box-shadow: 0 0 20px white;
                    }
                    h1 {
                        font-size: 22px;
                        font-weight: 600;
                        margin-bottom: 10px;
                    }
                    pre {
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        font-size: 14px;
                        background: rgba(255, 255, 255, 0.1);
                        padding: 10px;
                        border-radius: 8px;
                        text-align: left;
                        max-height: 300px;
                        overflow-y: auto;
                    }
                    button {
                        margin-top: 10px;
                        padding: 10px 20px;
                        font-size: 14px;
                        border: none;
                        border-radius: 8px;
                        background: #FFC857;
                        color: #222;
                        cursor: pointer;
                        transition: 0.3s;
                    }
                    button:hover {
                        background: #FFA500;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Gemini Answer</h1>
                    <pre id="answer">${answer}</pre>
                    <button onclick="copyToClipboard()">📋 Copy</button>
                </div>
                <script>
                    function copyToClipboard() {
                        const answerText = document.getElementById("answer").innerText;
                        navigator.clipboard.writeText(answerText).then(() => {
                            alert("Copied to clipboard!");
                        }).catch(err => console.error("Copy failed:", err));
                    }
                </script>
            </body>
            </html>
        `;

        GM_openInTab(`data:text/html;charset=utf-8,${encodeURIComponent(newTabContent)}`, { active: true });
    }

    document.addEventListener('keydown', async function (event) {
        if (event.ctrlKey && event.key === 'x') {
            event.preventDefault();
            try {
                const canvas = await captureScreenshot();
                const imageBlob = await convertCanvasToBlob(canvas);
                const additionalPrompt = prompt(ADDITIONAL_PROMPT_MESSAGE);
                await sendImageToGemini(imageBlob, additionalPrompt);
            } catch (error) {
                alert("Error: " + error);
            }
        }
    });

    console.log("Uber Aesthetic Solver script loaded.");
})();
