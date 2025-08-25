// NOTE: Bu dosya ESM module. HTML'de type="module" ile yükleniyor.
// Env'leri Vite üzerinden enjekte edin:
// VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase env bulunamadı. VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanımlayın.');
}

// --- DOM ---
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');

const inviterForm = document.getElementById('inviterForm');
const backBtn = document.getElementById('backBtn');
const saveBtn = document.getElementById('saveBtn');

let currentStep = 1;

// --- Yardımcılar ---
function getInviteToken() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('t');
}

function showStep(n) {
  [step1, step2].forEach(el => el && el.classList.remove('active'));
  if (n === 1) step1.classList.add('active');
  else step2.classList.add('active');
  currentStep = n;
}

function showMessage(targetForm, message, type = 'success') {
  const old = targetForm.querySelector('.message'); if (old) old.remove();
  const div = document.createElement('div');
  div.className = `message ${type === 'success' ? 'success-message' : 'error-message'}`;
  div.textContent = message;
  targetForm.prepend(div);
  setTimeout(() => div.remove(), type === 'success' ? 3000 : 5000);
}

// --- Token doğrulama (Edge Function) ---
async function validateInviteToken() {
  const token = getInviteToken();
  if (!token) {
    showMessage(inviterForm, 'Davet token bulunamadı.', 'error');
    return;
  }
  try {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/invite-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        authorization: `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ token })
    });
    const result = await resp.json();
    if (!resp.ok || result.ok === false) {
      throw new Error(result?.error || result?.reason || 'Geçersiz davet bağlantısı');
    }
    // Geçerli ise form gösterimde kalsın
    console.log('✅ token ok');
  } catch (e) {
    console.error(e);
    showMessage(inviterForm, `Davet bağlantısı doğrulanamadı: ${e.message}`, 'error');
  }
}

// --- Adım 1: Davet eden doğrula ---
async function handleInviterSubmit(e) {
  e.preventDefault();
  const data = new FormData(inviterForm);
  const inviter = {
    first_name: data.get('inviterFirstName')?.toString().trim(),
    last_name: data.get('inviterLastName')?.toString().trim(),
    email: data.get('inviterEmail')?.toString().trim(),
  };

  if (!inviter.first_name || !inviter.last_name || !inviter.email) {
    showMessage(inviterForm, 'Lütfen tüm alanları doldurun.', 'error');
    return;
  }

  const btn = document.getElementById('continueBtn');
  const original = btn.textContent;
  btn.textContent = 'Doğrulanıyor...';
  btn.disabled = true;

  try {
    const token = getInviteToken();
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/invite-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        authorization: `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ token, inviter })
    });
    const result = await resp.json();

    if (resp.ok && result.ok) {
      window.inviteData = result; // step2 için sakla
      showMessage(inviterForm, 'Doğrulama başarılı! İkinci adıma geçiliyor...', 'success');
      setTimeout(() => showStep(2), 800);
    } else {
      let msg = 'Bu bilgilerle ağ listesinde kişi bulunamadı.';
      if (result.reason === 'ambiguous') msg = 'Birden fazla eşleşme var. Lütfen e-postayı doğru girin.';
      showMessage(inviterForm, msg, 'error');
    }
  } catch (err) {
    console.error(err);
    showMessage(inviterForm, `Doğrulama sırasında hata: ${err.message}`, 'error');
  } finally {
    btn.textContent = original;
    btn.disabled = false;
  }
}

// --- Adım 2: Kişi ekle ---
async function handleSave() {
  const fullName = document.getElementById('fullName').value.trim();
  const parts = fullName.split(' ');
  if (parts.length < 2) {
    alert('Lütfen ad ve soyad giriniz.');
    return;
  }

  const contact = {
    first_name: parts[0],
    last_name: parts.slice(1).join(' '),
    age: parseInt(document.getElementById('age').value) || null,
    city: document.getElementById('birthplace').value.trim(),
    current_city: document.getElementById('currentCity').value.trim(),
    university: document.getElementById('school').value.trim(),
    degree: document.getElementById('degree').value.trim(),
    graduation_year: parseInt(document.getElementById('graduationYear').value) || null,
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
  };

  const btn = saveBtn;
  const original = btn.textContent;
  btn.textContent = 'Gönderiliyor...';
  btn.disabled = true;

  try {
    const token = getInviteToken();
    const inviteData = window.inviteData;
    if (!inviteData) throw new Error('Davet bilgileri yok');

    const resp = await fetch(`${SUPABASE_URL}/functions/v1/invite-submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        inviter_contact_id: inviteData.inviter_contact_id,
        contact
      })
    });
    const result = await resp.json();

    if (!resp.ok || !result.ok) {
      throw new Error(result?.error || 'Kişi eklenemedi');
    }

    alert('Kişi başarıyla eklendi!');
    // İstersen success ekranına yönlendir
    // location.href = '/invite/success';
  } catch (err) {
    console.error(err);
    alert(`Gönderim hatası: ${err.message}`);
  } finally {
    btn.textContent = original;
    btn.disabled = false;
  }
}

// --- Event binding ---
document.addEventListener('DOMContentLoaded', () => {
  validateInviteToken();
  inviterForm.addEventListener('submit', handleInviterSubmit);
  backBtn.addEventListener('click', () => showStep(1));
  saveBtn.addEventListener('click', handleSave);
});
