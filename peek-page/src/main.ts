// src/main.ts
document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput') as HTMLInputElement;
    const fetchButton = document.getElementById('fetchButton') as HTMLButtonElement;
    const contentBox = document.getElementById('contentBox') as HTMLDivElement;
    const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;

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
            // Using a proxy to bypass CORS issues for fetching external content.
            // For production, you would typically have your own backend proxy.
            // This example uses a public CORS proxy. Be aware of its limitations and reliability.
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);

            if (!response.ok) {
                // allorigins.win returns 200 even for some errors, but we can check the content.
                // For a more robust check, you might inspect `data.status.http_code` or `data.status.message`.
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            // The actual content is usually in data.contents when using allorigins.win
            if (data.contents) {
                contentBox.textContent = data.contents;
            } else {
                contentBox.textContent = 'Could not retrieve content from the URL. Check console for details from proxy.';
            }

        } catch (error: any) {
            console.error('Error fetching URL content:', error);
            errorMessage.textContent = `Failed to fetch content: ${error.message}. Please ensure the URL is valid and accessible. Due to browser security (CORS), direct fetching of many external sites is blocked. This example uses a public CORS proxy.`;
            contentBox.textContent = 'Content will appear here...';
        }
    });
});