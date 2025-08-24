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

// Progress Elements
const progressStep = document.querySelector('.progress-step');
const progressPercentage = document.querySelector('.progress-percentage');
const progressFill = document.querySelector('.progress-fill');
const progressLabel = document.querySelector('.progress-label');
const progressMarkers = document.querySelectorAll('.progress-marker');

// Debug Elements
const debugStep = document.getElementById('debugStep');
const debugTotal = document.getElementById('debugTotal');
const debugProgress = document.getElementById('debugProgress');

// Current step tracking
let currentStep = 1;
let currentTab = 'basic';
let inviteData = null;

// Step configuration
const STEPS = [
    { id: 1, name: 'basic', label: 'Temel Bilgiler', progress: 17 },
    { id: 2, name: 'work', label: 'İş Bilgileri', progress: 33 },
    { id: 3, name: 'personal', label: 'Kişisel Özellikler', progress: 50 },
    { id: 4, name: 'social', label: 'Sosyal ve Networking', progress: 67 },
    { id: 5, name: 'experience', label: 'Deneyim', progress: 83 },
    { id: 6, name: 'future', label: 'Gelecek', progress: 100 }
];

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateSliderValue();
    updateDebugInfo();
    
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
    const closenessSlider = document.getElementById('closeness');
    if (closenessSlider) {
        closenessSlider.addEventListener('input', updateSliderValue);
    }

    // Category buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => selectCategory(btn.dataset.category));
    });
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
        updateProgress(2);
    } else if (step === 'success') {
        success.classList.add('active');
        currentStep = 'success';
        updateProgress(6);
    }
}

function goToPreviousStep() {
    if (currentStep === 2) {
        goToStep(1);
        updateProgress(1);
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
    updateProgressByTab(tabName);
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
    const closenessSlider = document.getElementById('closeness');
    const sliderValue = document.querySelector('.closeness-value');
    
    if (sliderValue && closenessSlider) {
        sliderValue.textContent = closenessSlider.value;
    }
}

// Select category
function selectCategory(category) {
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
}

// Update progress
function updateProgress(stepNumber) {
    const step = STEPS.find(s => s.id === stepNumber);
    if (!step) return;

    // Update progress elements
    if (progressStep) progressStep.textContent = `Adım ${stepNumber}/6`;
    if (progressPercentage) progressPercentage.textContent = `${step.progress}% Tamamlandı`;
    if (progressFill) progressFill.style.width = `${step.progress}%`;
    if (progressLabel) progressLabel.textContent = step.label;

    // Update progress markers
    progressMarkers.forEach((marker, index) => {
        if (index < stepNumber) {
            marker.classList.add('active');
        } else {
            marker.classList.remove('active');
        }
    });

    // Update debug info
    updateDebugInfo();
}

// Update progress by tab
function updateProgressByTab(tabName) {
    const stepMap = {
        'basic': 1,
        'work': 2,
        'personal': 3,
        'social': 4,
        'experience': 5,
        'future': 6
    };

    const stepNumber = stepMap[tabName];
    if (stepNumber) {
        updateProgress(stepNumber);
    }
}

// Update debug info
function updateDebugInfo() {
    if (debugStep) debugStep.textContent = currentStep;
    if (debugTotal) debugTotal.textContent = 6;
    
    const currentStepData = STEPS.find(s => s.id === currentStep);
    if (debugProgress && currentStepData) {
        debugProgress.textContent = `${currentStepData.progress}%`;
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
    const formData = {
      // Basic Tab
      first_name: document.getElementById('firstName').value,
      age: document.getElementById('age').value,
      city: document.getElementById('city').value,
      current_city: document.getElementById('currentCity').value,
      
      // Work Tab
      university: document.getElementById('university').value,
      department: document.getElementById('department').value,
      degree: document.getElementById('degree').value,
      graduation_year: document.getElementById('graduationYear').value,
      position: document.getElementById('position').value,
      company: document.getElementById('company').value,
      sectors: document.getElementById('sectors').value,
      expertise_tags: document.getElementById('expertiseTags').value,
      service_tags: document.getElementById('serviceTags').value,
      
      // Personal Tab
      closeness: getSelectedCategory(),
      category: getSelectedCategory(),
      traits: getSelectedTraits(),
      principles: getSelectedPrinciples(),
      goals: document.getElementById('goals').value,
      vision: document.getElementById('vision').value,
      
      // Social Tab
      languages: document.getElementById('languages').value,
      mentor_service: document.getElementById('isMentor').checked,
      social_volunteer: document.getElementById('volunteering').value,
      
      // Experience Tab
      life_experience: document.getElementById('lifeExperience').value,
      challenges: document.getElementById('challenges').value,
      lessons: document.getElementById('lessons').value,
      
      // Future Tab
      future_goals: document.getElementById('goals5y').value,
      investment_interest: document.getElementById('willingToInvest').checked,
      collaboration_areas: document.getElementById('collaborationAreas').value
    };
    
    console.log('📝 Form verileri toplandı:', formData);
    return formData;
  }

// Get selected category
function getSelectedCategory() {
    const activeCategory = document.querySelector('.category-btn.active');
    return activeCategory ? activeCategory.dataset.category : '';
}

// Get selected traits
function getSelectedTraits() {
    const selectedTraits = [];
    document.querySelectorAll('input[name="traits"]:checked').forEach(checkbox => {
        selectedTraits.push(checkbox.value);
    });
    return selectedTraits;
}

// Get selected principles
function getSelectedPrinciples() {
    const selectedPrinciples = [];
    document.querySelectorAll('input[name="principles"]:checked').forEach(checkbox => {
        selectedPrinciples.push(checkbox.value);
    });
    return selectedPrinciples;
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
