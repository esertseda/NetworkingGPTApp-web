// NetworkingGPT Web App - Kişi Ekleme Sistemi
// Adım 1: Ağ'a ekleyen kişi doğrulama
// Adım 2: Yeni kişi ekleme

// Supabase Configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Global functions for onclick handlers
window.resetForm = resetForm;

// Supabase client
let supabase = null;

// Form verilerini saklamak için
let formData = {
    // Adım 1: Ağ'a ekleyen kişi bilgileri
    inviter_first_name: '',
    inviter_last_name: '',
    inviter_email: '',
    
    // Adım 2: Yeni kişi bilgileri
    new_person_first_name: '',
    new_person_last_name: '',
    new_person_age: null,
    new_person_city: '',
    new_person_current_city: '',
    new_person_university: '',
    new_person_degree: '',
    new_person_graduation_year: null,
    new_person_email: '',
    new_person_phone: ''
};

let currentStep = 1;
const totalSteps = 2;

// --- DOM Elements ---
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const inviterForm = document.getElementById('inviterForm');
const backBtn = document.getElementById('backBtn');
const saveBtn = document.getElementById('saveBtn');

// --- Supabase Initialization ---
function initializeSupabase() {
    if (SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL !== 'https://your-project.supabase.co') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase başarıyla başlatıldı.');
        return true;
    } else {
        console.error('Supabase bilgileri yapılandırılmamış.');
        showConfigError();
        return false;
    }
}

function showConfigError() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="form-card">
            <div class="step-header">
                <div class="step-icon">⚠️</div>
                <h2>Konfigürasyon Hatası</h2>
                <p>Supabase bilgileri yapılandırılmamış</p>
            </div>
            <section class="form-section">
                <div class="info-message">
                    <span class="info-icon">ℹ️</span>
                    Lütfen app.js dosyasında SUPABASE_URL ve SUPABASE_ANON_KEY değerlerini güncelleyin.
                </div>
                <div class="form-actions">
                    <button onclick="location.reload()" class="btn btn-primary">
                        <span class="btn-icon">🔄</span>
                        Sayfayı Yenile
                    </button>
                </div>
            </section>
        </div>
    `;
}

// --- Step Management ---
function showStep(stepNumber) {
    console.log(`Adım ${stepNumber}'e geçiliyor...`);
    
    // Hide all steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    const currentStepElement = document.getElementById(`step${stepNumber}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
        console.log(`Adım ${stepNumber} gösterildi`);
    } else {
        console.error(`Adım ${stepNumber} elementi bulunamadı`);
    }
    
    // Update progress
    updateProgress(stepNumber);
    
    // Update step icons
    updateStepIcons(stepNumber);
    
    // Adım 2'ye geçiyorsak form alanlarını doldur
    if (stepNumber === 2) {
        setTimeout(() => {
            fillStep2Form();
        }, 300);
    }
}

function fillStep2Form() {
    console.log('Adım 2 form alanları dolduruluyor...');
    
    const formFields = {
        'fullName': '',
        'age': '25',
        'birthplace': 'İstanbul',
        'currentCity': 'İstanbul',
        'school': 'Boğaziçi Üniversitesi',
        'department': 'Bilgisayar Mühendisliği',
        'degree': 'Lisans',
        'graduationYear': '2020',
        'email': 'ornek@email.com',
        'phone': '+90 5XX XXX XX XX'
    };
    
    Object.entries(formFields).forEach(([fieldId, value]) => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.value = value;
            console.log(`${fieldId} alanı dolduruldu: ${value}`);
        } else {
            console.warn(`${fieldId} elementi bulunamadı`);
        }
    });
    
    console.log('Adım 2 form alanları doldurma tamamlandı');
}

function updateProgress(stepNumber) {
    const percentage = Math.round((stepNumber / totalSteps) * 100);
    const progressFill = document.querySelector('.progress-fill');
    const progressStep = document.querySelector('.progress-step');
    const progressPercentage = document.querySelector('.progress-percentage');
    
    if (progressFill) progressFill.style.width = percentage + '%';
    if (progressStep) progressStep.textContent = `Adım ${stepNumber}/${totalSteps}`;
    if (progressPercentage) progressPercentage.textContent = `${percentage}% Tamamlandı`;
}

function updateStepIcons(stepNumber) {
    document.querySelectorAll('.step-icon-item').forEach((icon, index) => {
        icon.classList.remove('active');
        if (index === stepNumber - 1) {
            icon.classList.add('active');
        }
    });
}

// --- Adım 1: Ağ'a ekleyen kişi doğrulama ---
async function handleInviterSubmit(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('contactFirstName').value.trim();
    const lastName = document.getElementById('contactLastName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();

    if (!firstName || !lastName || !email) {
        alert('Lütfen tüm alanları doldurunuz!');
        return;
    }

    // Form verilerini kaydet
    formData.inviter_first_name = firstName;
    formData.inviter_last_name = lastName;
    formData.inviter_email = email;

    const btn = document.getElementById('continueBtn');
    const original = btn.textContent;
    btn.textContent = 'Doğrulanıyor...';
    btn.disabled = true;

    try {
        // Supabase'de ağ'a ekleyen kişiyi ara
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .eq('first_name', firstName)
            .eq('last_name', lastName)
            .eq('email', email)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // Kişi bulunamadı
                alert('Bu bilgilerle ağ listesinde kişi bulunamadı. Lütfen bilgileri kontrol ediniz.');
                return;
            } else {
                console.error('Supabase error:', error);
                alert('Kişi aranırken bir hata oluştu: ' + error.message);
                return;
            }
        }

        // Kişi bulundu
        console.log('Ağ listesinde kişi bulundu:', data);
        alert('Kişi başarıyla doğrulandı! Adım 2\'ye geçebilirsiniz.');
        
        // Adım 2'ye geç
        currentStep = 2;
        showStep(2);
        
    } catch (error) {
        console.error('Kişi doğrulama hatası:', error);
        alert('Beklenmeyen bir hata oluştu!');
    } finally {
        btn.textContent = original;
        btn.disabled = false;
    }
}

// --- Adım 2: Yeni kişi ekleme ---
async function handleSave() {
    try {
        // Form verilerini topla
        const fullName = document.getElementById('fullName').value.trim();
        const nameParts = fullName.split(' ');
        
        if (nameParts.length < 2) {
            alert('Lütfen hem ad hem de soyad giriniz!');
            return;
        }

        // Yeni kişi verilerini hazırla
        const newContactData = {
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || '',
            age: parseInt(document.getElementById('age').value) || null,
            city: document.getElementById('birthplace').value.trim(),
            current_city: document.getElementById('currentCity').value.trim(),
            university: document.getElementById('school').value.trim(),
            degree: document.getElementById('degree').value.trim(),
            graduation_year: parseInt(document.getElementById('graduationYear').value) || null,
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim()
        };

        const btn = saveBtn;
        const original = btn.textContent;
        btn.textContent = 'Gönderiliyor...';
        btn.disabled = true;

        // Önce davet gönderen kişiyi bul (parent contact)
        const { data: parentContact, error: parentError } = await supabase
            .from('contacts')
            .select('id')
            .eq('first_name', formData.inviter_first_name)
            .eq('last_name', formData.inviter_last_name)
            .eq('email', formData.inviter_email)
            .single();

        if (parentError) {
            console.error('Parent contact bulunamadı:', parentError);
            alert('Davet gönderen kişi bulunamadı. Lütfen tekrar deneyiniz.');
            return;
        }

        // Yeni kişiyi ekle
        const { data: newContact, error: insertError } = await supabase
            .from('contacts')
            .insert([newContactData])
            .select()
            .single();

        if (insertError) {
            console.error('Supabase error:', insertError);
            alert('Kişi eklenirken bir hata oluştu: ' + insertError.message);
            return;
        }

        // Parent-child ilişkisini kur (relationships tablosu)
        const relationshipData = {
            parent_contact_id: parentContact.id,
            child_contact_id: newContact.id,
            degree: 1, // Direct connection
            relationship_type: 'invite'
        };

        const { error: relationshipError } = await supabase
            .from('relationships')
            .insert([relationshipData]);

        if (relationshipError) {
            console.error('Relationship oluşturma hatası:', relationshipError);
            // İlişki kurulamadı ama kişi eklendi, sadece uyarı ver
            console.warn('Kişi eklendi ama ilişki kurulamadı');
        } else {
            console.log('Parent-child ilişkisi başarıyla kuruldu');
        }

        console.log('Yeni kişi eklendi:', newContact);
        showSuccessMessage('Kişi başarıyla eklendi! Mobil uygulamada ağ listesinde görünecektir.');
        
        // Form verilerini temizle
        resetForm();
        
    } catch (error) {
        console.error('Form gönderimi hatası:', error);
        alert('Beklenmeyen bir hata oluştu!');
    } finally {
        const btn = saveBtn;
        btn.textContent = '✓ Kişi Ekle';
        btn.disabled = false;
    }
}

function showSuccessMessage(message) {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="form-card">
            <div class="step-header">
                <div class="step-icon">✅</div>
                <h2>Başarılı!</h2>
                <p>${message}</p>
            </div>
            <section class="form-section">
                <div class="info-message">
                    <span class="info-icon">ℹ️</span>
                    Kişi mobil uygulamada ağ listesinde görünecektir.
                </div>
                <div class="form-actions">
                    <button onclick="resetForm()" class="btn btn-primary">
                        <span class="btn-icon">🔄</span>
                        Yeni Kişi Ekle
                    </button>
                </div>
            </section>
        </div>
    `;
}

function resetForm() {
    // Form verilerini sıfırla
    formData = {
        inviter_first_name: '', inviter_last_name: '', inviter_email: '',
        new_person_first_name: '', new_person_last_name: '', new_person_age: null,
        new_person_city: '', new_person_current_city: '', new_person_university: '',
        new_person_degree: '', new_person_graduation_year: null, new_person_email: '', new_person_phone: ''
    };
    
    // İlk adıma dön
    currentStep = 1;
    showStep(1);
    
    // Form alanlarını temizle
    document.querySelectorAll('input, select, textarea').forEach(input => {
        if (input.type === 'number') {
            input.value = input.defaultValue || '';
        } else {
            input.value = '';
        }
    });
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Supabase'i başlat
    if (!initializeSupabase()) {
        return; // Supabase konfigürasyonu gerekli
    }
    
    // İlk adımı göster
    showStep(1);
    
    // Event listeners
    if (inviterForm) {
        inviterForm.addEventListener('submit', handleInviterSubmit);
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', prevStep);
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', handleSave);
    }
});
