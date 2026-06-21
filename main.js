// Discount Timer
let totalSeconds = 15*60; // 6 minutes and 33 seconds

function updateTimer() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    
    if (totalSeconds > 0) {
        totalSeconds--;
    } else {
        clearInterval(timerInterval);
        document.querySelector('.timer-block span:first-child').style.color = '#ff6b6b';
        document.querySelector('.timer-sub').textContent = '⏰ Time expired!';
        document.querySelector('.timer-sub').style.color = '#ff6b6b';
    }
}

const timerInterval = setInterval(updateTimer, 1000);
updateTimer();

// ============================ SWIPE-TO-INSTALL (MINIMALIST) ============================
let swipeMinProgress = 0;
let isDraggingMin = false;
let swipeStartXMin = 0;
let swipeCurrentXMin = 0;

function initSwipeMinimal() {
    const divider = document.getElementById('swipeDividerMinimal');
    const handle = document.getElementById('swipeHandleMinimal');
    const container = document.querySelector('.swipe-track');
    const progressBar = document.getElementById('swipeBarMinimal');
    const popup = document.getElementById('swipePopupMinimal');
    const popupText = document.getElementById('popupTextMinimal');
    
    if (!divider || !container) return;
    
    const containerWidth = container.offsetWidth;
    let currentStep = -1;
    
    const steps = [
        { text: '✨ Just unbox & plug in', progress: 50 },
        { text: '❄️ Enjoy cool air instantly', progress: 100 }
    ];
    
    function updateSwipe(percent) {
        percent = Math.max(0, Math.min(100, percent));
        swipeMinProgress = percent;
        
        const leftPos = (percent / 100) * containerWidth;
        divider.style.left = leftPos + 'px';
        progressBar.style.width = percent + '%';
        
        // Update steps - only 2 steps
        const stepIndex = percent > 50 ? 1 : 0;
        
        if (stepIndex !== currentStep) {
            currentStep = stepIndex;
            
            document.querySelectorAll('.step-minimal').forEach((step, idx) => {
                step.classList.toggle('active', idx <= stepIndex);
            });
            
            // Show popup
            if (stepIndex < steps.length) {
                popupText.textContent = steps[stepIndex].text;
                popup.classList.add('show');
                
                clearTimeout(popup._timeout);
                popup._timeout = setTimeout(() => {
                    popup.classList.remove('show');
                }, 2000);
            }
        }
    }
    
    // Mouse events
    function onMouseDown(e) {
        isDraggingMin = true;
        swipeStartXMin = e.clientX;
        swipeCurrentXMin = ((parseFloat(divider.style.left) || containerWidth / 2) / containerWidth) * 100;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
    }
    
    function onMouseMove(e) {
        if (!isDraggingMin) return;
        const deltaX = (e.clientX - swipeStartXMin) / containerWidth * 100;
        updateSwipe(swipeCurrentXMin + deltaX);
    }
    
    function onMouseUp() {
        isDraggingMin = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
    
    // Touch events
    function onTouchStart(e) {
        const touch = e.touches[0];
        isDraggingMin = true;
        swipeStartXMin = touch.clientX;
        swipeCurrentXMin = ((parseFloat(divider.style.left) || containerWidth / 2) / containerWidth) * 100;
        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', onTouchEnd);
        e.preventDefault();
    }
    
    function onTouchMove(e) {
        if (!isDraggingMin) return;
        const touch = e.touches[0];
        const deltaX = (touch.clientX - swipeStartXMin) / containerWidth * 100;
        updateSwipe(swipeCurrentXMin + deltaX);
    }
    
    function onTouchEnd() {
        isDraggingMin = false;
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
    }
    
    // Click on container to advance
    container.addEventListener('click', function(e) {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 100;
        updateSwipe(x);
    });
    
    // Add event listeners
    handle.addEventListener('mousedown', onMouseDown);
    handle.addEventListener('touchstart', onTouchStart);
    
    // Auto-play on load
    setTimeout(() => {
        let progress = 0;
        const autoAdvance = setInterval(() => {
            progress += 1;
            if (progress >= 100) {
                clearInterval(autoAdvance);
                setTimeout(() => {
                    updateSwipe(0);
                }, 2000);
                return;
            }
            updateSwipe(progress);
        }, 30);
    }, 800);
    
    // Double click to reset
    container.addEventListener('dblclick', function() {
        updateSwipe(0);
    });
    
    // Handle resize
    window.addEventListener('resize', function() {
        const newWidth = container.offsetWidth;
        divider.style.left = ((swipeMinProgress / 100) * newWidth) + 'px';
    });
    
    updateSwipe(0);
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwipeMinimal);
} else {
    initSwipeMinimal();
}
