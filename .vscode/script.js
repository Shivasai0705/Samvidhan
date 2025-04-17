document.addEventListener('DOMContentLoaded', function() {
    // Wheel configuration
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const spinButton = document.getElementById('spinButton');
    const resultContainer = document.getElementById('resultContainer');
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const explanationText = document.getElementById('explanationText');
    const nextButton = document.getElementById('nextButton');
    const scoreDisplay = document.getElementById('scoreDisplay');
    
    // Game state
    let isSpinning = false;
    let currentAngle = 0;
    let score = 0;
    let spinCount = 0;
    const maxSpins = 5;
    
    // Topics
    const topics = [
        "Fundamental Rights",
        "Directive Principles",
        "Fundamental Duties",
        "President",
        "Parliament",
        "Judiciary",
        "Amendments",
        "Emergency Provisions"
    ];
    
    // Draw the wheel
    function drawWheel() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const segmentAngle = (2 * Math.PI) / topics.length;
        
        for (let i = 0; i < topics.length; i++) {
            const startAngle = i * segmentAngle + currentAngle;
            const endAngle = (i + 1) * segmentAngle + currentAngle;
            
            ctx.fillStyle = i % 2 === 0 ? '#4a5568' : '#2d3748';
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fill();
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + segmentAngle / 2);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(topics[i], radius - 20, 5);
            ctx.restore();
        }
        
        ctx.fillStyle = '#e53e3e';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Initialize
    drawWheel();
    spinButton.textContent = `Spin (0/${maxSpins})`;
    
    // Spin button event listener
    spinButton.addEventListener('click', function() {
        if (!isSpinning && spinCount < maxSpins) {
            spinWheel();
        }
    });
    
    // Next button event listener
    nextButton.addEventListener('click', function() {
        resultContainer.style.display = 'none';
        if (spinCount < maxSpins) {
            spinButton.disabled = false;
        }
    });

    function spinWheel() {
        isSpinning = true;
        spinCount++;
        spinButton.disabled = true;
        
        const spinDuration = 3000 + Math.random() * 2000;
        const startTime = Date.now();
        const startAngle = currentAngle;
        const spinAngle = 10 + Math.random() * 20;
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / spinDuration, 1);
            const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
            
            currentAngle = startAngle + easeProgress * spinAngle * Math.PI * 2;
            drawWheel();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                finishSpin();
            }
        }
        
        animate();
    }
    
    function finishSpin() {
        isSpinning = false;
        const segmentAngle = (2 * Math.PI) / topics.length;
        const normalizedAngle = ((currentAngle % (2 * Math.PI)) + (2 * Math.PI));
        const adjustedAngle = normalizedAngle % (2 * Math.PI);
        const selectedSegment = Math.floor(adjustedAngle / segmentAngle);
        const selectedTopic = topics[topics.length - 1 - selectedSegment];
        
        // For now, just display the selected topic
        displayQuestion({
            question: `Selected Topic: ${selectedTopic}`,
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswer: 0,
            explanation: "This is a placeholder for the real questions which will be implemented next."
        });
        
        if (spinCount >= maxSpins) {
            spinButton.textContent = "Game Over";
            setTimeout(showFinalScore, 1000);
        } else {
            spinButton.textContent = `Spin (${spinCount}/${maxSpins})`;
        }
    }
    
    function displayQuestion(questionData) {
        questionText.textContent = questionData.question;
        optionsContainer.innerHTML = '';
        
        questionData.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => checkAnswer(index, questionData.correctAnswer, optionElement));
            optionsContainer.appendChild(optionElement);
        });
        
        explanationText.textContent = '';
        resultContainer.style.display = 'block';
        nextButton.style.display = 'none';
    }
    
    function checkAnswer(selectedIndex, correctIndex, optionElement) {
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.style.pointerEvents = 'none';
        });
        
        if (selectedIndex === correctIndex) {
            optionElement.classList.add('correct');
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
        } else {
            optionElement.classList.add('incorrect');
            options[correctIndex].classList.add('correct');
        }
        
        explanationText.textContent = questionData.explanation;
        nextButton.style.display = 'block';
    }
    
    function showFinalScore() {
        resultContainer.style.display = 'block';
        questionText.textContent = `Game Over! Your final score is ${score} out of ${maxSpins}`;
        optionsContainer.innerHTML = '';
        explanationText.textContent = 'Thank you for playing!';
        nextButton.style.display = 'none';
    }
});
function openModal(cardType) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    let content = '';
    
    switch(cardType) {
        case 'date-card1':
            content = `
                <h2>26th January 1950 - Constitution Day</h2>
                <p>The Constitution of India was adopted by the Constituent Assembly on 26 November 1949, and came into effect on 26 January 1950. The date 26 January was chosen to commemorate the Purna Swaraj declaration of independence of 1930.</p>
                <p>The Constitution replaced the Government of India Act 1935 as the country's fundamental governing document, and the Dominion of India became the Republic of India.</p>
                <p>Dr. Rajendra Prasad became the first President of India. The Constitution declares India a sovereign, socialist, secular, democratic republic, assuring its citizens justice, equality and liberty.</p>
            `;
            break;
            
        case 'article-card1':
            content = `
                <h2>Article 21: Protection of Life and Personal Liberty</h2>
                <p><strong>Text:</strong> "No person shall be deprived of his life or personal liberty except according to procedure established by law."</p>
                <h3>Key Interpretations:</h3>
                <ul>
                    <li>Right to live with human dignity</li>
                    <li>Right to clean environment</li>
                    <li>Right to privacy</li>
                    <li>Right to shelter</li>
                    <li>Right to health</li>
                </ul>
                <p>This article has been the basis for numerous landmark judgments that have expanded the scope of fundamental rights in India.</p>
            `;
            break;
            
        case 'timeline-card1':
            content = `
                <h2>Major Constitutional Amendments Timeline</h2>
                <div class="modal-timeline">
                    <div class="modal-timeline-item">
                        <div class="modal-timeline-date">1951</div>
                        <div class="modal-timeline-content">First Amendment: Added Ninth Schedule to protect land reform laws</div>
                    </div>
                    <div class="modal-timeline-item">
                        <div class="modal-timeline-date">1971</div>
                        <div class="modal-timeline-content">24th Amendment: Affirmed Parliament's power to amend any part of the Constitution</div>
                    </div>
                    <div class="modal-timeline-item">
                        <div class="modal-timeline-date">1976</div>
                        <div class="modal-timeline-content">42nd Amendment: Added Fundamental Duties, made India "Socialist Secular"</div>
                    </div>
                    <div class="modal-timeline-item">
                        <div class="modal-timeline-date">1992</div>
                        <div class="modal-timeline-content">73rd & 74th Amendments: Constitutional status to Panchayati Raj institutions</div>
                    </div>
                    <div class="modal-timeline-item">
                        <div class="modal-timeline-date">2019</div>
                        <div class="modal-timeline-content">103rd Amendment: 10% reservation for Economically Weaker Sections</div>
                    </div>
                </div>
            `;
            break;
            
        case 'amendment-card1':
            content = `
                <h2>104th Constitutional Amendment (2020)</h2>
                <h3>Key Provisions:</h3>
                <ul>
                    <li>Extended reservation for SC/STs in Lok Sabha and State Assemblies for 10 more years (until 2030)</li>
                    <li>Removed the reserved seats for Anglo-Indians in Lok Sabha and State Assemblies</li>
                </ul>
                <h3>Background:</h3>
                <p>The amendment was passed to continue affirmative action for Scheduled Castes and Scheduled Tribes while doing away with the Anglo-Indian reservation which was based on historical context that was no longer relevant.</p>
                <p>The reservation for SC/STs in Parliament and State Assemblies was first implemented in 1950 and has been extended every 10 years since then.</p>
            `;
            break;
    }
    
    modalBody.innerHTML = content;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside content
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('modal');
    if (event.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// Add this CSS for modal timeline
