// DOM Elements
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const success = document.getElementById('success');
const inviterForm = document.getElementById('inviterForm');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');

// Loading and Error States
const loadingState = document.getElementById('loading');
const errorState = document.getElementById('error');
const mainContent = document.getElementById('mainContent');
const errorMessage = document.getElementById('errorMessage');

// Tab Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// Slider Elements
const closenessSlider = document.getElementById('closeness');
const sliderValue = document.querySelector('.slider-value');

// Current step tracking
let currentStep = 1;
let currentTab = 'basic';
let inviteData = null;

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateSliderValue();
    
    // Sayfa yüklendiğinde token doğrulaması yap
    validateInviteToken();
});

// Token doğrulama
async function validateInviteToken() {
    try {
        const token = getInviteToken();
        if (!token) {
            showError('Davet token bulunamadı');
            return;
        }

        console.log('🔍 Davet token doğrulanıyor:', token);

        // Token'ı doğrula - public endpoint
        const response = await fetch(`${SUPABASE_URL}/functions/v1/invite-verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                token: token
            })
        });

        if (response.ok) {
            const result = await response.json();
            if (result.ok !== false) {
                // Token geçerli, ana içeriği göster
                showMainContent();
                console.log('✅ Davet token doğrulandı');
            } else {
                showError(result.reason === 'not_found' ? 'Davet bağlantısı bulunamadı' : 'Davet bağlantısı geçersiz');
            }
        } else {
            const errorData = await response.json();
            showError(errorData.error || 'Token doğrulanamadı');
        }

    } catch (error) {
        console.error('Token doğrulama hatası:', error);
        showError('Davet bağlantısı doğrulanamadı: ' + error.message);
    }
}


// Ana içeriği göster
function showMainContent() {
    loadingState.style.display = 'none';
    errorState.style.display = 'none';
    mainContent.style.display = 'block';
}

// Hata göster
function showError(message) {
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
    mainContent.style.display = 'none';
    errorMessage.textContent = message;
}

// Event Listeners
function initializeEventListeners() {
    // Inviter form submission
    inviterForm.addEventListener('submit', handleInviterSubmit);
    
    // Navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', goToPreviousStep);
    if (nextBtn) nextBtn.addEventListener('click', goToNextStep);
    if (submitBtn) submitBtn.addEventListener('click', handleSubmit);
    
    // Tab navigation
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Slider value update
    if (closenessSlider) closenessSlider.addEventListener('input', updateSliderValue);
}

// Handle inviter form submission
function handleInviterSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(inviterForm);
    const inviterData = {
        first_name: formData.get('inviterFirstName'),
        last_name: formData.get('inviterLastName'),
        email: formData.get('inviterEmail')
    };
    
    // Validate inviter exists in the network
    validateInviter(inviterData);
}

// Navigation functions
function goToStep(step) {
    // Hide all steps
    step1.classList.remove('active');
    step2.classList.remove('active');
    success.classList.remove('active');
    
    // Show current step
    if (step === 1) {
        step1.classList.add('active');
        currentStep = 1;
    } else if (step === 2) {
        step2.classList.add('active');
        currentStep = 2;
        updateNavigationButtons();
    } else if (step === 'success') {
        success.classList.add('active');
        currentStep = 'success';
    }
}

function goToPreviousStep() {
    if (currentStep === 2) {
        goToStep(1);
    }
}

function goToNextStep() {
    if (currentTab === 'basic') {
        switchTab('work');
    } else if (currentTab === 'work') {
        switchTab('personal');
    } else if (currentTab === 'personal') {
        switchTab('social');
    } else if (currentTab === 'social') {
        switchTab('experience');
    } else if (currentTab === 'experience') {
        switchTab('future');
        showSubmitButton();
    }
}

// Tab switching
function switchTab(tabName) {
    // Update active tab button
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update active tab pane
    tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === tabName) {
            pane.classList.add('active');
        }
    });
    
    currentTab = tabName;
    updateNavigationButtons();
}

// Update navigation buttons
function updateNavigationButtons() {
    if (currentTab === 'basic') {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    } else if (currentTab === 'future') {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

// Show submit button
function showSubmitButton() {
    submitBtn.style.display = 'block';
    nextBtn.style.display = 'none';
}

// Update slider value display
function updateSliderValue() {
    if (sliderValue && closenessSlider) {
        sliderValue.textContent = closenessSlider.value;
    }
}

// Handle final form submission
async function handleSubmit() {
    try {
        // Collect all form data
        const formData = collectFormData();
        
        // Validate required fields
        if (!validateFormData(formData)) {
            alert('Lütfen zorunlu alanları doldurun.');
            return;
        }
        
        // Show loading state
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Gönderiliyor...';
        submitBtn.disabled = true;
        
        // Get invite data from step 1
        const inviteData = window.inviteData;
        if (!inviteData) {
            throw new Error('Davet bilgileri bulunamadı');
        }
        
        // Get invite token from URL
        const token = getInviteToken();
        
        // Send data to Supabase Edge Function
        const response = await fetch(`${SUPABASE_URL}/functions/v1/invite-submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                inviter_contact_id: inviteData.inviter_contact_id,
                contact: formData
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.ok) {
                // Show success message
                showSuccessMessage('Kişi başarıyla eklendi!');
                setTimeout(() => {
                    goToStep('success');
                }, 1500);
            } else {
                throw new Error(result.error || 'Kişi eklenemedi');
            }
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'API error');
        }
        
    } catch (error) {
        console.error('Submit error:', error);
        showErrorMessage('Gönderim sırasında hata oluştu: ' + error.message);
    } finally {
        // Reset button state
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Collect all form data
function collectFormData() {
    const data = {
        // Basic info
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        closeness: document.getElementById('closeness').value,
        age: document.getElementById('age').value,
        hometown: document.getElementById('hometown').value,
        current_city: document.getElementById('currentCity').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        summary: document.getElementById('summary').value,
        
        // Work info
        current_title: document.getElementById('currentTitle').value,
        current_company: document.getElementById('currentCompany').value,
        university: document.getElementById('university').value,
        education: document.getElementById('education').value,
        past_experiences: document.getElementById('pastExperiences').value,
        expertise_tags: document.getElementById('expertiseTags').value,
        service_tags: document.getElementById('serviceTags').value,
        sectors: document.getElementById('sectors').value,
        
        // Personal info
        traits: document.getElementById('traits').value,
        principles: document.getElementById('principles').value,
        goals: document.getElementById('goals').value,
        vision: document.getElementById('vision').value,
        
        // Social info
        hobbies: document.getElementById('hobbies').value,
        languages: document.getElementById('languages').value,
        is_mentor: document.getElementById('isMentor').checked,
        volunteering: document.getElementById('volunteering').value,
        
        // Experience info
        turning_points: document.getElementById('turningPoints').value,
        big_challenges: document.getElementById('bigChallenges').value,
        big_lessons: document.getElementById('bigLessons').value,
        
        // Future info
        goals_5y: document.getElementById('goals5y').value,
        goals_10y: document.getElementById('goals10y').value,
        approach_new_ideas: document.getElementById('approachNewIdeas').value,
        willing_to_invest: document.getElementById('willingToInvest').checked,
        willing_to_partner: document.getElementById('willingToPartner').checked,
        collaboration_areas: document.getElementById('collaborationAreas').value
    };
    
    return data;
}

// Validate form data
function validateFormData(data) {
    // Required fields
    if (!data.first_name.trim() || !data.last_name.trim()) {
        return false;
    }
    
    return true;
}

// URL token extraction
function getInviteToken() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('t');
}

// Validate inviter exists in the network
async function validateInviter(inviterData) {
    try {
        // Show loading state
        const submitBtn = document.querySelector('#inviterForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Doğrulanıyor...';
        submitBtn.disabled = true;
        
        // Get invite token from URL
        const token = getInviteToken();
        
        // Call Supabase Edge Function to validate inviter
        const response = await fetch(`${SUPABASE_URL}/functions/v1/invite-verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                token: token,
                inviter: inviterData
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.ok) {
                // Store invite data for step 2
                window.inviteData = result;
                
                // Inviter exists, proceed to step 2
                showSuccessMessage('Doğrulama başarılı! İkinci adıma geçiliyor...');
                setTimeout(() => {
                    goToStep(2);
                }, 1500);
            } else {
                // Handle different error reasons
                let errorMessage = 'Bu bilgilerle ağ listesinde kişi bulunamadı.';
                if (result.reason === 'ambiguous') {
                    errorMessage = 'Birden fazla eşleşen kişi bulundu. Lütfen e-posta adresinizi de girin.';
                }
                showErrorMessage(errorMessage);
            }
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'API error');
        }
    } catch (error) {
        console.error('Validation error:', error);
        showErrorMessage('Doğrulama sırasında hata oluştu: ' + error.message);
    } finally {
        // Reset button state
        const submitBtn = document.querySelector('#inviterForm button[type="submit"]');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Show success message
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message success-message';
    messageDiv.textContent = message;
    
    const form = document.getElementById('inviterForm');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Show error message
function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message error-message';
    messageDiv.textContent = message;
    
    const form = document.getElementById('inviterForm');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Add message styles
const style = document.createElement('style');
style.textContent = `
    .message {
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-weight: 500;
    }
    
    .success-message {
        background: #d1fae5;
        color: #065f46;
        border: 1px solid #a7f3d0;
    }
    
    .error-message {
        background: #fee2e2;
        color: #991b1b;
        border: 1px solid #fecaca;
    }
`;
document.head.appendChild(style);
