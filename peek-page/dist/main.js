"use strict";
// src/main.ts
document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const fetchButton = document.getElementById('fetchButton');
    const contentBox = document.getElementById('contentBox');
    const errorMessage = document.getElementById('errorMessage');
    fetchButton.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        contentBox.textContent = 'Fetching content...';
        errorMessage.textContent = ''; // Clear previous errors
        if (!url) {
            errorMessage.textContent = 'Please enter a URL.';
            contentBox.textContent = 'Content will appear here...';
            return;
        }
        try {
            // Attempting to fetch directly.
            // Be aware that most external websites will block this due to CORS (Cross-Origin Resource Sharing) policies.
            // This will likely result in a "Failed to fetch" network error in the browser console.
            // The Access-Control-Allow-Origin header is typically set by the server in its response
            // to permit cross-origin requests, not by the client in its request.
            // Adding it here will not bypass CORS restrictions imposed by the server.
            const response = await fetch(url, {
                headers: {
                    // This header is primarily for server responses to allow cross-origin access.
                    // Including it in a client-side request will not force a server to allow CORS,
                    // and browsers typically ignore this header when sent in a request.
                    'Access-Control-Allow-Origin': '*'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const content = await response.text();
            contentBox.textContent = content;
        }
        catch (error) {
            console.error('Error fetching URL content:', error);
            errorMessage.textContent = `Failed to fetch content: ${error.message}. Please ensure the URL is valid and accessible. Due to browser security (CORS), direct fetching of most external sites is blocked unless the server explicitly allows it for your origin.`;
            contentBox.textContent = 'Content will appear here...';
        }
    });
});
