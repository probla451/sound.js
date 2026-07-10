async function play(name) {
    const sounds = '../sounds/';
    // Most popular browser-supported audio formats
    const formats = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'opus'];

    // If the name already has an extension, play it directly
    if (name.includes('.')) {
        const sound = new Audio(`${sounds}${name}`);
        sound.play().catch(err => console.error("Playback failed:", err));
        return;
    }

    // Try each extension in sequence until one succeeds (or fails with autoplay restrictions)
    for (const ext of formats) {
        const url = `${sounds}${name}.${ext}`;
        const played = await new Promise((resolve) => {
            const sound = new Audio(url);
            sound.play()
                .then(() => resolve(true)) // Success!
                .catch((error) => {
                    // NotAllowedError means the browser found the file but blocked it due to autoplay rules.
                    // This means the file exists, so we stop searching!
                    if (error.name === 'NotAllowedError') {
                        console.warn(`Autoplay blocked playing ${url}. User interaction required.`);
                        resolve(true); 
                    } else {
                        // File not found or not supported, try the next format
                        resolve(false);
                    }
                });
        });

        if (played) return; // Exit once we find and successfully attempt to play a file
    }

    console.error(`Could not find or play "${name}" in any supported format (${formats.join(', ')}).`);
}