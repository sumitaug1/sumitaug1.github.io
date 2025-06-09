document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const resultText = document.getElementById('resultText');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const swapBtn = document.getElementById('swapBtn');
    const caseButtons = document.querySelectorAll('.case-option');

    function convertCase(text, caseType) {
        switch(caseType) {
            case 'upper':
                return text.toUpperCase();
            case 'lower':
                return text.toLowerCase();
            case 'title':
                return text.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
            case 'sentence':
                return text.toLowerCase().replace(/^.|\.\s+./g, l => l.toUpperCase());
            case 'camel':
                return text.toLowerCase()
                    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
            case 'pascal':
                return text.toLowerCase()
                    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
                    .replace(/^./, str => str.toUpperCase());
            case 'snake':
                return text.toLowerCase().replace(/\s+/g, '_');
            case 'kebab':
                return text.toLowerCase().replace(/\s+/g, '-');
            default:
                return text;
        }
    }

    function updateResult() {
        const text = textInput.value;
        const activeCase = document.querySelector('.case-option.active')?.dataset.case || 'upper';
        resultText.value = convertCase(text, activeCase);
    }

    function showCopyFeedback() {
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
        }, 2000);
    }

    // Event Listeners
    caseButtons.forEach(button => {
        button.addEventListener('click', () => {
            caseButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateResult();
        });
    });

    textInput.addEventListener('input', updateResult);

    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        resultText.value = '';
    });

    copyBtn.addEventListener('click', () => {
        resultText.select();
        document.execCommand('copy');
        showCopyFeedback();
    });

    swapBtn.addEventListener('click', () => {
        const temp = textInput.value;
        textInput.value = resultText.value;
        resultText.value = temp;
    });

    // Initialize with uppercase as default
    caseButtons[0].classList.add('active');
    updateResult();
}); 