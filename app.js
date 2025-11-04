// Get DOM elements
const textInput = document.getElementById('textInput');
const gridContainer = document.getElementById('gridContainer');
const statsSection = document.getElementById('stats');
const charCountEl = document.getElementById('charCount');
const codePointCountEl = document.getElementById('codePointCount');
const byteCountEl = document.getElementById('byteCount');

// Function to calculate UTF-8 byte length
function getUTF8ByteLength(str) {
    return new Blob([str]).size;
}

// Function to get UTF-8 code point
function getCodePoint(char) {
    return char.codePointAt(0);
}

// Function to format code point as hex
function formatCodePoint(codePoint) {
    return 'U+' + codePoint.toString(16).toUpperCase().padStart(4, '0');
}

// Function to get character name/description
function getCharDescription(char) {
    const codePoint = getCodePoint(char);
    
    if (char === ' ') return 'SPACE';
    if (char === '\n') return 'LINE FEED';
    if (char === '\r') return 'CARRIAGE RETURN';
    if (char === '\t') return 'TAB';
    if (codePoint < 32) return 'CONTROL CHAR';
    
    // Unicode ranges
    if (codePoint >= 0x1F600 && codePoint <= 0x1F64F) return 'Emoji';
    if (codePoint >= 0x1F300 && codePoint <= 0x1F5FF) return 'Emoji';
    if (codePoint >= 0x1F680 && codePoint <= 0x1F6FF) return 'Emoji';
    if (codePoint >= 0x1F900 && codePoint <= 0x1F9FF) return 'Emoji';
    if (codePoint >= 0x2600 && codePoint <= 0x26FF) return 'Symbol';
    if (codePoint >= 0x2700 && codePoint <= 0x27BF) return 'Dingbat';
    if (codePoint >= 0x4E00 && codePoint <= 0x9FFF) return 'CJK';
    if (codePoint >= 0x0400 && codePoint <= 0x04FF) return 'Cyrillic';
    if (codePoint >= 0x0600 && codePoint <= 0x06FF) return 'Arabic';
    if (codePoint >= 0x0370 && codePoint <= 0x03FF) return 'Greek';
    
    return 'Character';
}

// Function to render the grid
function renderGrid(text) {
    if (!text) {
        gridContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <div class="empty-state-text">Enter some text above to see the character grid</div>
            </div>
        `;
        statsSection.style.display = 'none';
        return;
    }

    // Show stats
    statsSection.style.display = 'flex';
    
    // Convert string to array of characters (handles surrogate pairs correctly)
    const chars = Array.from(text);
    
    // Update stats
    charCountEl.textContent = chars.length;
    codePointCountEl.textContent = chars.length;
    byteCountEl.textContent = getUTF8ByteLength(text);
    
    // Clear grid
    gridContainer.innerHTML = '';
    gridContainer.className = 'grid-container';
    
    // Create cards for each character
    chars.forEach((char, index) => {
        const card = document.createElement('div');
        card.className = 'char-card';
        
        const codePoint = getCodePoint(char);
        const hexCode = formatCodePoint(codePoint);
        const decCode = codePoint;
        const charType = getCharDescription(char);
        const byteLength = getUTF8ByteLength(char);
        
        // Display character (handle special cases)
        let displayChar = char;
        if (char === ' ') displayChar = '␣';
        if (char === '\n') displayChar = '↵';
        if (char === '\r') displayChar = '⏎';
        if (char === '\t') displayChar = '⇥';
        
        card.innerHTML = `
            <div class="char-display">${displayChar}</div>
            <div class="char-info">
                <div class="char-info-item">
                    <span class="info-label">Index:</span>
                    <span class="info-value">${index}</span>
                </div>
                <div class="char-info-item">
                    <span class="info-label">UTF Code:</span>
                    <span class="info-value">${hexCode}</span>
                </div>
                <div class="char-info-item">
                    <span class="info-label">Decimal:</span>
                    <span class="info-value">${decCode}</span>
                </div>
                <div class="char-info-item">
                    <span class="info-label">Bytes:</span>
                    <span class="info-value">${byteLength}</span>
                </div>
                <div class="char-info-item">
                    <span class="info-label">Type:</span>
                    <span class="info-value">${charType}</span>
                </div>
            </div>
        `;
        
        // Add click to copy functionality
        card.addEventListener('click', () => {
            const info = `Character: ${char}\nIndex: ${index}\nUTF Code: ${hexCode}\nDecimal: ${decCode}\nBytes: ${byteLength}`;
            navigator.clipboard.writeText(info).then(() => {
                card.style.background = 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
                setTimeout(() => {
                    card.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
                }, 300);
            });
        });
        
        gridContainer.appendChild(card);
    });
}

// Event listener for text input
textInput.addEventListener('input', (e) => {
    renderGrid(e.target.value);
});

// Add some default text as an example
const defaultText = "Hello World! 🌍 UTF-8";
textInput.value = defaultText;
renderGrid(defaultText);

// Focus on the textarea
textInput.focus();
textInput.select();
