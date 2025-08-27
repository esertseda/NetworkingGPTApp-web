import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './InviteForm.css';

interface FormData {
  // Davet gönderen kişi bilgileri
  inviter_first_name: string;
  inviter_last_name: string;
  inviter_email: string;
  
  // Yeni kişi bilgileri - Temel
  new_person_first_name: string;
  new_person_last_name: string;
  new_person_age: string;
  new_person_birthplace: string;
  new_person_current_city: string;
  new_person_proximity_level: number;
  new_person_email: string;
  new_person_phone: string;
  new_person_university: string;
  new_person_department: string;
  new_person_degree: string;
  new_person_graduation_year: string;
  new_person_description: string;
  
  // İş bilgileri
  new_person_position: string;
  new_person_company: string;
  new_person_work_experience: string;
  new_person_expertise: DropdownOption[];
  new_person_services: DropdownOption[];
  new_person_investments: string;
  
  // Kişisel özellikler
  new_person_personal_traits: DropdownOption[];
  new_person_values: DropdownOption[];
  new_person_goals: string;
  new_person_vision: string;
  
  // Sosyal
  new_person_hobbies: DropdownOption[];
  new_person_languages: DropdownOption[];
  new_person_mentor: boolean;
  new_person_volunteer_experience: string;
  
  // Deneyim
  new_person_turning_points: string;
  new_person_challenges: string;
  new_person_lessons: string;
  
  // Gelecek
  new_person_future_goals: string;
  new_person_investment_interest: boolean;
  new_person_collaboration_areas: string;
  
  // E-posta bildirimi
  send_email_notification: boolean;
}

// Dropdown Component
interface DropdownOption {
  id: string;
  name: string;
  emoji: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedItems: DropdownOption[];
  onSelectionChange: (items: DropdownOption[]) => void;
  placeholder: string;
  label: string;
}

function Dropdown({ options, selectedItems, onSelectionChange, placeholder, label }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (option: DropdownOption) => {
    const isSelected = selectedItems.find(item => item.id === option.id);
    
    if (isSelected) {
      onSelectionChange(selectedItems.filter(item => item.id !== option.id));
    } else {
      onSelectionChange([...selectedItems, option]);
    }
  };

  const removeItem = (itemId: string) => {
    onSelectionChange(selectedItems.filter(item => item.id !== itemId));
  };

  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="dropdown-container" ref={dropdownRef}>
        <button
          type="button"
          className={`dropdown-button ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedItems.length > 0 ? `${selectedItems.length} seçili` : placeholder}</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </button>
        
        {isOpen && (
          <div className="dropdown-list">
            {options.map((option) => {
              const isSelected = selectedItems.find(item => item.id === option.id);
              return (
                <div
                  key={option.id}
                  className={`dropdown-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleItemClick(option)}
                >
                  <span className="dropdown-item-emoji">{option.emoji}</span>
                  <span className="dropdown-item-text">{option.name}</span>
                </div>
              );
            })}
          </div>
        )}
        
        {selectedItems.length > 0 && (
          <div className="selected-items">
            {selectedItems.map((item) => (
              <div key={item.id} className="selected-item">
                <span>{item.emoji} {item.name}</span>
                <span className="remove-item" onClick={() => removeItem(item.id)}>×</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function InviteForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inviteId, setInviteId] = useState<string>('');

  // URL'den invite ID'sini al
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const inviteIdFromUrl = pathParts[pathParts.length - 1];
    if (inviteIdFromUrl && inviteIdFromUrl.length > 10) {
      setInviteId(inviteIdFromUrl);
    }
  }, []);

  // Dropdown options - Mobil uygulamadaki ile aynı
  const expertiseOptions: DropdownOption[] = [
    { id: 'frontend', name: 'Frontend Development', emoji: '💻' },
    { id: 'backend', name: 'Backend Development', emoji: '⚙️' },
    { id: 'mobile', name: 'Mobile Development', emoji: '📱' },
    { id: 'fullstack', name: 'Full Stack Development', emoji: '🌐' },
    { id: 'devops', name: 'DevOps', emoji: '🔧' },
    { id: 'data_science', name: 'Data Science', emoji: '📊' },
    { id: 'ai_ml', name: 'AI/Machine Learning', emoji: '🤖' },
    { id: 'ui_ux', name: 'UI/UX Tasarım', emoji: '🎨' },
    { id: 'product_management', name: 'Product Management', emoji: '📋' },
    { id: 'project_management', name: 'Proje Yönetimi', emoji: '📈' },
    { id: 'digital_marketing', name: 'Dijital Pazarlama', emoji: '📱' },
    { id: 'content_marketing', name: 'İçerik Pazarlaması', emoji: '✍️' },
    { id: 'seo', name: 'SEO/SEM', emoji: '🔍' },
    { id: 'sales', name: 'Satış', emoji: '💼' },
    { id: 'business_development', name: 'İş Geliştirme', emoji: '🚀' },
    { id: 'hr', name: 'İnsan Kaynakları', emoji: '👥' },
    { id: 'finance', name: 'Finans', emoji: '💰' },
    { id: 'accounting', name: 'Muhasebe', emoji: '📊' },
    { id: 'legal', name: 'Hukuk', emoji: '⚖️' },
    { id: 'consulting', name: 'Danışmanlık', emoji: '💡' },
    { id: 'research', name: 'Araştırma', emoji: '🔬' },
    { id: 'writing', name: 'Yazım/Editörlük', emoji: '✒️' },
    { id: 'translation', name: 'Çeviri', emoji: '🌍' },
    { id: 'photography', name: 'Fotoğrafçılık', emoji: '📸' },
    { id: 'videography', name: 'Videografi', emoji: '🎬' },
    { id: 'graphic_design', name: 'Grafik Tasarım', emoji: '🎨' },
    { id: 'architecture', name: 'Mimarlık', emoji: '🏗️' },
    { id: 'engineering', name: 'Mühendislik', emoji: '⚙️' },
    { id: 'teaching', name: 'Öğretmenlik/Eğitim', emoji: '👩‍🏫' },
    { id: 'other', name: 'Diğer', emoji: '➕' }
  ];

  const serviceOptions: DropdownOption[] = [
    { id: 'consulting', name: 'Danışmanlık', emoji: '💡' },
    { id: 'mentoring', name: 'Mentorluk', emoji: '🎓' },
    { id: 'training', name: 'Eğitim/Kurs', emoji: '📚' },
    { id: 'freelance_dev', name: 'Freelance Geliştirme', emoji: '💻' },
    { id: 'web_design', name: 'Web Tasarım', emoji: '🌐' },
    { id: 'mobile_dev', name: 'Mobil Uygulama Geliştirme', emoji: '📱' },
    { id: 'ui_ux_service', name: 'UI/UX Tasarım Hizmeti', emoji: '🎨' },
    { id: 'graphic_design_service', name: 'Grafik Tasarım Hizmeti', emoji: '🖼️' },
    { id: 'content_creation', name: 'İçerik Üretimi', emoji: '✍️' },
    { id: 'copywriting', name: 'Metin Yazarlığı', emoji: '📝' },
    { id: 'translation_service', name: 'Çeviri Hizmeti', emoji: '🌍' },
    { id: 'seo_service', name: 'SEO Optimizasyonu', emoji: '🔍' },
    { id: 'social_media', name: 'Sosyal Medya Yönetimi', emoji: '📱' },
    { id: 'digital_marketing_service', name: 'Dijital Pazarlama', emoji: '📊' },
    { id: 'photography_service', name: 'Fotoğrafçılık', emoji: '📸' },
    { id: 'video_production', name: 'Video Prodüksiyon', emoji: '🎬' },
    { id: 'event_planning', name: 'Etkinlik Organizasyonu', emoji: '🎉' },
    { id: 'project_management_service', name: 'Proje Yönetimi', emoji: '📋' },
    { id: 'business_consulting', name: 'İş Danışmanlığı', emoji: '💼' },
    { id: 'financial_consulting', name: 'Finansal Danışmanlık', emoji: '💰' },
    { id: 'legal_service', name: 'Hukuki Danışmanlık', emoji: '⚖️' },
    { id: 'accounting_service', name: 'Muhasebe Hizmeti', emoji: '📊' },
    { id: 'hr_consulting', name: 'İK Danışmanlığı', emoji: '👥' },
    { id: 'market_research', name: 'Pazar Araştırması', emoji: '🔬' },
    { id: 'data_analysis', name: 'Veri Analizi', emoji: '📈' },
    { id: 'investment_advice', name: 'Yatırım Danışmanlığı', emoji: '📈' },
    { id: 'partnership', name: 'İş Ortaklığı', emoji: '🤝' },
    { id: 'networking', name: 'Network Kurma', emoji: '🌐' },
    { id: 'career_coaching', name: 'Kariyer Koçluğu', emoji: '🚀' },
    { id: 'other', name: 'Diğer', emoji: '➕' }
  ];

  const languageOptions: DropdownOption[] = [
    { id: 'turkish', name: 'Türkçe', emoji: '🇹🇷' },
    { id: 'english', name: 'İngilizce', emoji: '🇺🇸' },
    { id: 'german', name: 'Almanca', emoji: '🇩🇪' },
    { id: 'french', name: 'Fransızca', emoji: '🇫🇷' },
    { id: 'spanish', name: 'İspanyolca', emoji: '🇪🇸' },
    { id: 'italian', name: 'İtalyanca', emoji: '🇮🇹' },
    { id: 'russian', name: 'Rusça', emoji: '🇷🇺' },
    { id: 'arabic', name: 'Arapça', emoji: '🇸🇦' },
    { id: 'chinese', name: 'Çince', emoji: '🇨🇳' },
    { id: 'japanese', name: 'Japonca', emoji: '🇯🇵' },
    { id: 'korean', name: 'Korece', emoji: '🇰🇷' },
    { id: 'portuguese', name: 'Portekizce', emoji: '🇵🇹' },
    { id: 'dutch', name: 'Hollandaca', emoji: '🇳🇱' },
    { id: 'swedish', name: 'İsveççe', emoji: '🇸🇪' },
    { id: 'norwegian', name: 'Norveççe', emoji: '🇳🇴' },
    { id: 'danish', name: 'Danca', emoji: '🇩🇰' },
    { id: 'finnish', name: 'Fince', emoji: '🇫🇮' },
    { id: 'other', name: 'Diğer', emoji: '➕' }
  ];

  const personalTraitsOptions: DropdownOption[] = [
    { id: 'honesty', name: 'Dürüstlük', emoji: '🤝' },
    { id: 'reliability', name: 'Güvenilirlik', emoji: '✅' },
    { id: 'discipline', name: 'Disiplin', emoji: '📋' },
    { id: 'hardworking', name: 'Çalışkanlık', emoji: '💪' },
    { id: 'patience', name: 'Sabırlı Olmak', emoji: '😌' },
    { id: 'leadership', name: 'Liderlik', emoji: '👑' },
    { id: 'teamwork', name: 'Takım Çalışması', emoji: '👥' },
    { id: 'communication', name: 'İletişim Becerisi', emoji: '💬' },
    { id: 'creativity', name: 'Yaratıcılık', emoji: '🎨' },
    { id: 'problem_solving', name: 'Problem Çözme', emoji: '🔧' },
    { id: 'adaptability', name: 'Uyum Sağlama', emoji: '🔄' },
    { id: 'empathy', name: 'Empati', emoji: '❤️' },
    { id: 'other', name: 'Diğer', emoji: '➕' }
  ];

  const valuesOptions: DropdownOption[] = [
    { id: 'ethics', name: 'Etik', emoji: '⚖️' },
    { id: 'sustainability', name: 'Sürdürülebilirlik', emoji: '🌱' },
    { id: 'social_impact', name: 'Topluma Fayda', emoji: '🤝' },
    { id: 'innovation', name: 'İnovasyon', emoji: '💡' },
    { id: 'quality', name: 'Kalite', emoji: '⭐' },
    { id: 'integrity', name: 'Dürüstlük', emoji: '🛡️' },
    { id: 'excellence', name: 'Mükemmellik', emoji: '🏆' },
    { id: 'collaboration', name: 'İş Birliği', emoji: '🤝' },
    { id: 'learning', name: 'Sürekli Öğrenme', emoji: '📚' },
    { id: 'other', name: 'Diğer', emoji: '➕' }
  ];

  const hobbiesOptions: DropdownOption[] = [
    { id: 'reading', name: 'Okuma', emoji: '📚' },
    { id: 'traveling', name: 'Seyahat', emoji: '✈️' },
    { id: 'sports', name: 'Spor', emoji: '⚽' },
    { id: 'music', name: 'Müzik', emoji: '🎵' },
    { id: 'cooking', name: 'Yemek Yapma', emoji: '👨‍🍳' },
    { id: 'photography', name: 'Fotoğrafçılık', emoji: '📸' },
    { id: 'gaming', name: 'Oyun', emoji: '🎮' },
    { id: 'art', name: 'Sanat', emoji: '🎨' },
    { id: 'gardening', name: 'Bahçıvanlık', emoji: '🌱' },
    { id: 'hiking', name: 'Doğa Yürüyüşü', emoji: '🏔️' },
    { id: 'volunteering', name: 'Gönüllülük', emoji: '🤝' },
    { id: 'other', name: 'Diğer', emoji: '➕' }
  ];
  
  const [formData, setFormData] = useState<FormData>({
    // Davet gönderen kişi bilgileri
    inviter_first_name: '',
    inviter_last_name: '',
    inviter_email: '',
    
    // Yeni kişi bilgileri - Temel
    new_person_first_name: '',
    new_person_last_name: '',
    new_person_age: '',
    new_person_birthplace: '',
    new_person_current_city: '',
    new_person_proximity_level: 5,
    new_person_email: '',
    new_person_phone: '',
    new_person_university: '',
    new_person_department: '',
    new_person_degree: '',
    new_person_graduation_year: '',
    new_person_description: '',
    
    // İş bilgileri
    new_person_position: '',
    new_person_company: '',
    new_person_work_experience: '',
    new_person_expertise: [],
    new_person_services: [],
    new_person_investments: '',
    
    // Kişisel özellikler
    new_person_personal_traits: [],
    new_person_values: [],
    new_person_goals: '',
    new_person_vision: '',
    
    // Sosyal
    new_person_hobbies: [],
    new_person_languages: [],
    new_person_mentor: false,
    new_person_volunteer_experience: '',
    
    // Deneyim
    new_person_turning_points: '',
    new_person_challenges: '',
    new_person_lessons: '',
    
    // Gelecek
    new_person_future_goals: '',
    new_person_investment_interest: false,
    new_person_collaboration_areas: '',
    
    // E-posta bildirimi
    send_email_notification: false
  });

  const totalSteps = 7; // 1 adım davet gönderen + 6 adım yeni kişi
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const stepTitles = [
    'Davet Gönderen Bilgileri',
    'Temel Bilgiler',
    'İş Bilgileri',
    'Kişisel Özellikler',
    'Sosyal',
    'Deneyim',
    'Gelecek'
  ];

  const stepIcons = [
    '👤',
    '📋',
    '💼',
    '⭐',
    '👥',
    '🏆',
    '🚀'
  ];

  const updateFormData = (field: keyof FormData, value: string | number | boolean | DropdownOption[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const checkPersonExists = async () => {
    const { inviter_first_name, inviter_last_name, inviter_email } = formData;
    
    if (!inviter_first_name || !inviter_last_name || !inviter_email) {
      alert('Lütfen tüm alanları doldurunuz!');
      return;
    }

    try {
      // Değerleri temizle (boşlukları kaldır)
      const cleanFirstName = inviter_first_name.trim();
      const cleanLastName = inviter_last_name.trim();
      const cleanEmail = inviter_email.trim();

      const { data, error } = await supabase.functions.invoke('invite-verify', {
        body: {
          first_name: cleanFirstName,
          last_name: cleanLastName,
          email: cleanEmail
        }
      });

      if (error) {
        console.error('Kişi bulunamadı:', error);
        alert('Bu bilgilerle kayıtlı kişi bulunamadı. Lütfen bilgilerinizi kontrol ediniz.');
        return;
      }

      if (data && data.success) {
        console.log('Ağ listesinde kişi bulundu:', data);
        setCurrentStep(1); // Yeni kişi bilgilerine geç
        } else {
        alert('Bu bilgilerle kayıtlı kişi bulunamadı. Lütfen bilgilerinizi kontrol ediniz.');
        }
    } catch (error) {
      console.error('Hata:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyiniz.');
      }
  };

      

  const handleSave = async () => {
    const { new_person_first_name, new_person_last_name } = formData;
    
    if (!new_person_first_name || !new_person_last_name) {
      alert('Lütfen hem ad hem de soyad giriniz!');
      return;
    }

    setLoading(true);

    try {
      // Supabase Edge Function kullanarak kişi ekleme işlemini yap
      const { data, error } = await supabase.functions.invoke('invite-submit', {
        body: {
          inviter: {
            first_name: formData.inviter_first_name.trim(),
            last_name: formData.inviter_last_name.trim(),
            email: formData.inviter_email.trim()
          },
          new_person: {
        first_name: new_person_first_name,
        last_name: new_person_last_name,
            age: formData.new_person_age ? parseInt(formData.new_person_age) : null,
        city: formData.new_person_birthplace,
        current_city: formData.new_person_current_city,
        email: formData.new_person_email,
        phone: formData.new_person_phone,
            university: formData.new_person_university,
            degree: formData.new_person_degree,
            graduation_year: formData.new_person_graduation_year ? parseInt(formData.new_person_graduation_year) : null,
        position: formData.new_person_position,
        company: formData.new_person_company,
            sectors: formData.new_person_personal_traits.map(item => item.name).join(', '),
            expertise: formData.new_person_expertise.map(item => item.name).join(', '),
            services: formData.new_person_services.map(item => item.name).join(', '),
            languages: formData.new_person_languages.map(item => item.name).join(', '),
            mentor_service: formData.new_person_mentor,
            investment_interest: formData.new_person_investment_interest,
            social_volunteer: formData.new_person_volunteer_experience,
            life_experience: formData.new_person_turning_points,
        challenges: formData.new_person_challenges,
        lessons: formData.new_person_lessons,
        future_goals: formData.new_person_future_goals,
        collaboration_areas: formData.new_person_collaboration_areas,
            summary: formData.new_person_description,
            goals: formData.new_person_goals,
            vision: formData.new_person_vision,
            closeness: formData.new_person_proximity_level,
            department: formData.new_person_department,
            connection_degree: 1,
            network_degree: 1
          },
          send_email_notification: formData.send_email_notification
        }
      });

      if (error) {
        console.error('Edge Function error:', error);
        alert('Kişi eklenirken bir hata oluştu: ' + error.message);
        return;
      }

      if (data && data.success) {
        alert('Kişi başarıyla eklendi!');
      
      // Formu sıfırla
      setFormData({
        inviter_first_name: '',
        inviter_last_name: '',
        inviter_email: '',
        new_person_first_name: '',
        new_person_last_name: '',
          new_person_age: '',
        new_person_birthplace: '',
        new_person_current_city: '',
          new_person_proximity_level: 5,
          new_person_email: '',
          new_person_phone: '',
        new_person_university: '',
        new_person_department: '',
        new_person_degree: '',
          new_person_graduation_year: '',
        new_person_description: '',
        new_person_position: '',
        new_person_company: '',
        new_person_work_experience: '',
          new_person_expertise: [] as DropdownOption[],
          new_person_services: [] as DropdownOption[],
        new_person_investments: '',
          new_person_personal_traits: [] as DropdownOption[],
          new_person_values: [] as DropdownOption[],
        new_person_goals: '',
        new_person_vision: '',
          new_person_hobbies: [] as DropdownOption[],
          new_person_languages: [] as DropdownOption[],
        new_person_mentor: false,
        new_person_volunteer_experience: '',
        new_person_turning_points: '',
        new_person_challenges: '',
        new_person_lessons: '',
        new_person_future_goals: '',
        new_person_investment_interest: false,
          new_person_collaboration_areas: '',
          send_email_notification: false
        });
        
        setCurrentStep(0);
      } else {
        alert('Kişi eklenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Davet gönderen bilgileri
        return (
          <div className="step-content">
            <div className="form-section">
              <h3>👤 Davet Gönderen Bilgileri</h3>
              <p>Sizinle bağlantı kurmak isteyen kişinin bilgilerini girin</p>
              
              <div className="form-group">
                <label>Ad</label>
                <input
                  type="text"
                  value={formData.inviter_first_name}
                  onChange={(e) => updateFormData('inviter_first_name', e.target.value)}
                  placeholder="Adınız"
                />
              </div>
              
              <div className="form-group">
                <label>Soyad</label>
                <input
                  type="text"
                  value={formData.inviter_last_name}
                  onChange={(e) => updateFormData('inviter_last_name', e.target.value)}
                  placeholder="Soyadınız"
                />
              </div>
              
              <div className="form-group">
                <label>E-posta Adresi</label>
                <input
                  type="email"
                  value={formData.inviter_email}
                  onChange={(e) => updateFormData('inviter_email', e.target.value)}
                  placeholder="e-posta@ornek.com"
                />
              </div>
              
              <button 
                className="nav-btn save-btn"
                onClick={checkPersonExists}
                disabled={loading}
                style={{ marginTop: '20px', width: '100%' }}
              >
                {loading ? 'Kontrol Ediliyor...' : 'Devam Et'}
              </button>
            </div>
          </div>
        );

      case 1: // Temel Bilgiler
        return (
          <div className="step-content">
            <div className="form-section">
              <h3>👤 Temel Bilgiler</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Ad</label>
                  <input
                    type="text"
                    value={formData.new_person_first_name}
                    onChange={(e) => updateFormData('new_person_first_name', e.target.value)}
                    placeholder="Ad"
                  />
                </div>
                <div className="form-group">
                  <label>Soyad</label>
                  <input
                    type="text"
                    value={formData.new_person_last_name}
                    onChange={(e) => updateFormData('new_person_last_name', e.target.value)}
                    placeholder="Soyad"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Yaş</label>
                  <input
                    type="number"
                    value={formData.new_person_age}
                    onChange={(e) => updateFormData('new_person_age', e.target.value)}
                    placeholder="25"
                  />
                </div>
                <div className="form-group">
                  <label>Nereli</label>
                  <input
                    type="text"
                    value={formData.new_person_birthplace}
                    onChange={(e) => updateFormData('new_person_birthplace', e.target.value)}
                    placeholder="İstanbul"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Şu An Yaşadığı Şehir</label>
                <input
                  type="text"
                  value={formData.new_person_current_city}
                  onChange={(e) => updateFormData('new_person_current_city', e.target.value)}
                  placeholder="İstanbul"
                />
              </div>

              <div className="form-group">
                <label>Yakınlık Seviyesi: {formData.new_person_proximity_level}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.new_person_proximity_level}
                  onChange={(e) => updateFormData('new_person_proximity_level', parseInt(e.target.value))}
                  className="range-slider"
                />
                <div className="range-labels">
                  <span>Uzak (1)</span>
                  <span>Yakın (10)</span>
                </div>
              </div>

              <div className="form-section">
                <h4>📧 İletişim Bilgileri</h4>
                <p className="form-note">(E-posta veya telefon gerekli)</p>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>E-posta</label>
                    <input
                      type="email"
                      value={formData.new_person_email}
                      onChange={(e) => updateFormData('new_person_email', e.target.value)}
                      placeholder="ornek@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefon</label>
                    <input
                      type="tel"
                      value={formData.new_person_phone}
                      onChange={(e) => updateFormData('new_person_phone', e.target.value)}
                      placeholder="+90 5XX XXX XX XX"
                    />
                  </div>
                </div>
                
                {(!formData.new_person_email && !formData.new_person_phone) && (
                  <div className="warning-message">
                    ⚠️ E-posta veya telefon bilgilerinden en az biri girilmelidir.
                  </div>
                )}
              </div>

              <div className="form-section">
                <h4>🎓 Eğitim Geçmişi</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Okul/Üniversite</label>
                    <input
                      type="text"
                      value={formData.new_person_university}
                      onChange={(e) => updateFormData('new_person_university', e.target.value)}
                      placeholder="Boğaziçi Üniversitesi"
                    />
                  </div>
                  <div className="form-group">
                    <label>Bölüm</label>
                    <input
                      type="text"
                      value={formData.new_person_department}
                      onChange={(e) => updateFormData('new_person_department', e.target.value)}
                      placeholder="Bilgisayar Mühendisliği"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Derece</label>
                    <input
                      type="text"
                      value={formData.new_person_degree}
                      onChange={(e) => updateFormData('new_person_degree', e.target.value)}
                      placeholder="Lisans"
                    />
                  </div>
                  <div className="form-group">
                    <label>Mezuniyet Yılı</label>
                    <input
                      type="number"
                      value={formData.new_person_graduation_year}
                      onChange={(e) => updateFormData('new_person_graduation_year', e.target.value)}
                      placeholder="2020"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Kişi hakkında genel notlar...</label>
                <textarea
                  value={formData.new_person_description}
                  onChange={(e) => updateFormData('new_person_description', e.target.value)}
                  placeholder="Kişi hakkında genel notlar..."
                  rows={3}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.send_email_notification}
                    onChange={(e) => updateFormData('send_email_notification', e.target.checked)}
                  />
                  Kişiye e-posta göndermek ister misiniz?
                </label>
              </div>
            </div>
          </div>
        );

      case 2: // İş Bilgileri
        return (
          <div className="step-content">
            <div className="form-section">
              <h3>💼 İş ve Profesyonel Bilgiler</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>👤 Pozisyon</label>
                  <input
                    type="text"
                    value={formData.new_person_position}
                    onChange={(e) => updateFormData('new_person_position', e.target.value)}
                    placeholder="Senior Frontend Developer"
                  />
                </div>
                <div className="form-group">
                  <label>🏢 Şirket</label>
                  <input
                    type="text"
                    value={formData.new_person_company}
                    onChange={(e) => updateFormData('new_person_company', e.target.value)}
                    placeholder="Google"
                  />
                </div>
              </div>

              <Dropdown
                options={expertiseOptions}
                selectedItems={formData.new_person_expertise}
                onSelectionChange={(items) => updateFormData('new_person_expertise', items)}
                placeholder="Uzmanlık alanı seçin..."
                label="⭐ Uzmanlık Alanları"
              />

              <Dropdown
                options={serviceOptions}
                selectedItems={formData.new_person_services}
                onSelectionChange={(items) => updateFormData('new_person_services', items)}
                placeholder="Hizmet seçin..."
                label="⚡ Verebileceği Hizmetler"
              />

              <div className="form-group">
                <label>📄 İş Deneyimi (Kısa Notlar)</label>
                <textarea
                  value={formData.new_person_work_experience}
                  onChange={(e) => updateFormData('new_person_work_experience', e.target.value)}
                  placeholder="Önceki iş deneyimleri, projeler, başarılar..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 3: // Kişisel Özellikler
        return (
          <div className="step-content">
            <div className="form-section">
              <h3>⭐ Kişisel Özellikler</h3>
              
              <div className="form-section">
                <h4>💼 Kategori</h4>
                <div className="category-buttons">
                  <button className={`category-btn ${formData.new_person_personal_traits.length > 0 ? 'active' : ''}`}>
                    💼 İş
                  </button>
                  <button className="category-btn">
                    🏠 Aile
                  </button>
                  <button className="category-btn">
                    👥 Arkadaş
                  </button>
                  <button className="category-btn">
                    ➕ Diğer
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>❤️ Yakınlık Seviyesi: {formData.new_person_proximity_level}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.new_person_proximity_level}
                  onChange={(e) => updateFormData('new_person_proximity_level', parseInt(e.target.value))}
                  className="range-slider"
                />
                <div className="range-labels">
                  <span>Uzak (1)</span>
                  <span>Yakın (10)</span>
                </div>
              </div>

              <div className="form-section">
                <h4>⭐ Kişisel Özellikler</h4>
                <div className="traits-grid">
                  <div className="traits-column">
                    <label className="trait-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_personal_traits.some(t => t.id === 'honesty')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_personal_traits', [...formData.new_person_personal_traits, { id: 'honesty', name: 'Dürüstlük', emoji: '🤝' }]);
                          } else {
                            updateFormData('new_person_personal_traits', formData.new_person_personal_traits.filter(t => t.id !== 'honesty'));
                          }
                        }}
                      />
                      Dürüstlük
                    </label>
                    <label className="trait-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_personal_traits.some(t => t.id === 'discipline')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_personal_traits', [...formData.new_person_personal_traits, { id: 'discipline', name: 'Disiplin', emoji: '📋' }]);
                          } else {
                            updateFormData('new_person_personal_traits', formData.new_person_personal_traits.filter(t => t.id !== 'discipline'));
                          }
                        }}
                      />
                      Disiplin
                    </label>
                    <label className="trait-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_personal_traits.some(t => t.id === 'patience')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_personal_traits', [...formData.new_person_personal_traits, { id: 'patience', name: 'Sabırlılık', emoji: '😌' }]);
                          } else {
                            updateFormData('new_person_personal_traits', formData.new_person_personal_traits.filter(t => t.id !== 'patience'));
                          }
                        }}
                      />
                      Sabırlılık
                    </label>
                    <label className="trait-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_personal_traits.some(t => t.id === 'teamwork')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_personal_traits', [...formData.new_person_personal_traits, { id: 'teamwork', name: 'Takım Çalışması', emoji: '👥' }]);
                          } else {
                            updateFormData('new_person_personal_traits', formData.new_person_personal_traits.filter(t => t.id !== 'teamwork'));
                          }
                        }}
                      />
                      Takım Çalışması
                    </label>
                    <label className="trait-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_personal_traits.some(t => t.id === 'creativity')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_personal_traits', [...formData.new_person_personal_traits, { id: 'creativity', name: 'Yaratıcılık', emoji: '🎨' }]);
                          } else {
                            updateFormData('new_person_personal_traits', formData.new_person_personal_traits.filter(t => t.id !== 'creativity'));
                          }
                        }}
                      />
                      Yaratıcılık
                    </label>
                  </div>
                  <div className="traits-column">
                    <label className="trait-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_personal_traits.some(t => t.id === 'reliability')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_personal_traits', [...formData.new_person_personal_traits, { id: 'reliability', name: 'Güvenilirlik', emoji: '✅' }]);
                          } else {
                            updateFormData('new_person_personal_traits', formData.new_person_personal_traits.filter(t => t.id !== 'reliability'));
                          }
                        }}
                      />
                      Güvenilirlik
                    </label>
                    <label className="trait-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_personal_traits.some(t => t.id === 'hardworking')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_personal_traits', [...formData.new_person_personal_traits, { id: 'hardworking', name: 'Çalışkanlık', emoji: '💪' }]);
                          } else {
                            updateFormData('new_person_personal_traits', formData.new_person_personal_traits.filter(t => t.id !== 'hardworking'));
                          }
                        }}
                      />
                      Çalışkanlık
                    </label>
                    <label className="trait-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_personal_traits.some(t => t.id === 'leadership')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_personal_traits', [...formData.new_person_personal_traits, { id: 'leadership', name: 'Liderlik', emoji: '👑' }]);
                          } else {
                            updateFormData('new_person_personal_traits', formData.new_person_personal_traits.filter(t => t.id !== 'leadership'));
                          }
                        }}
                      />
                      Liderlik
                    </label>
                    <label className="trait-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_personal_traits.some(t => t.id === 'communication')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_personal_traits', [...formData.new_person_personal_traits, { id: 'communication', name: 'İletişim Becerisi', emoji: '💬' }]);
                          } else {
                            updateFormData('new_person_personal_traits', formData.new_person_personal_traits.filter(t => t.id !== 'communication'));
                          }
                        }}
                      />
                      İletişim Becerisi
                    </label>
                    <label className="trait-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_personal_traits.some(t => t.id === 'adaptability')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_personal_traits', [...formData.new_person_personal_traits, { id: 'adaptability', name: 'Uyum Yeteneği', emoji: '🔄' }]);
                          } else {
                            updateFormData('new_person_personal_traits', formData.new_person_personal_traits.filter(t => t.id !== 'adaptability'));
                          }
                        }}
                      />
                      Uyum Yeteneği
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>💎 Değer Verdiği Prensipler</h4>
                <div className="values-grid">
                  <div className="values-column">
                    <label className="value-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_values.some(v => v.id === 'ethics')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_values', [...formData.new_person_values, { id: 'ethics', name: 'Etik', emoji: '⚖️' }]);
                          } else {
                            updateFormData('new_person_values', formData.new_person_values.filter(v => v.id !== 'ethics'));
                          }
                        }}
                      />
                      Etik
                    </label>
                    <label className="value-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_values.some(v => v.id === 'innovation')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_values', [...formData.new_person_values, { id: 'innovation', name: 'İnovasyon', emoji: '💡' }]);
                          } else {
                            updateFormData('new_person_values', formData.new_person_values.filter(v => v.id !== 'innovation'));
                          }
                        }}
                      />
                      İnovasyon
                    </label>
                    <label className="value-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_values.some(v => v.id === 'learning')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_values', [...formData.new_person_values, { id: 'learning', name: 'Sürekli Öğrenme', emoji: '📚' }]);
                          } else {
                            updateFormData('new_person_values', formData.new_person_values.filter(v => v.id !== 'learning'));
                          }
                        }}
                      />
                      Sürekli Öğrenme
                    </label>
                    <label className="value-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_values.some(v => v.id === 'empathy')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_values', [...formData.new_person_values, { id: 'empathy', name: 'Empati', emoji: '❤️' }]);
                          } else {
                            updateFormData('new_person_values', formData.new_person_values.filter(v => v.id !== 'empathy'));
                          }
                        }}
                      />
                      Empati
                    </label>
                  </div>
                  <div className="values-column">
                    <label className="value-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_values.some(v => v.id === 'sustainability')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_values', [...formData.new_person_values, { id: 'sustainability', name: 'Sürdürülebilirlik', emoji: '🌱' }]);
                          } else {
                            updateFormData('new_person_values', formData.new_person_values.filter(v => v.id !== 'sustainability'));
                          }
                        }}
                      />
                      Sürdürülebilirlik
                    </label>
                    <label className="value-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_values.some(v => v.id === 'quality')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_values', [...formData.new_person_values, { id: 'quality', name: 'Kalite', emoji: '⭐' }]);
                          } else {
                            updateFormData('new_person_values', formData.new_person_values.filter(v => v.id !== 'quality'));
                          }
                        }}
                      />
                      Kalite
                    </label>
                    <label className="value-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_values.some(v => v.id === 'transparency')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_values', [...formData.new_person_values, { id: 'transparency', name: 'Şeffaflık', emoji: '🔍' }]);
                          } else {
                            updateFormData('new_person_values', formData.new_person_values.filter(v => v.id !== 'transparency'));
                          }
                        }}
                      />
                      Şeffaflık
                    </label>
                  </div>
                  <div className="values-column">
                    <label className="value-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_values.some(v => v.id === 'social_impact')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_values', [...formData.new_person_values, { id: 'social_impact', name: 'Topluma Fayda', emoji: '🤝' }]);
                          } else {
                            updateFormData('new_person_values', formData.new_person_values.filter(v => v.id !== 'social_impact'));
                          }
                        }}
                      />
                      Topluma Fayda
                    </label>
                    <label className="value-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_values.some(v => v.id === 'customer_focus')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_values', [...formData.new_person_values, { id: 'customer_focus', name: 'Müşteri Odaklılık', emoji: '🎯' }]);
                          } else {
                            updateFormData('new_person_values', formData.new_person_values.filter(v => v.id !== 'customer_focus'));
                          }
                        }}
                      />
                      Müşteri Odaklılık
                    </label>
                    <label className="value-item">
                      <input
                        type="checkbox"
                        checked={formData.new_person_values.some(v => v.id === 'justice')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('new_person_values', [...formData.new_person_values, { id: 'justice', name: 'Adalet', emoji: '⚖️' }]);
                          } else {
                            updateFormData('new_person_values', formData.new_person_values.filter(v => v.id !== 'justice'));
                          }
                        }}
                      />
                      Adalet
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>🎯 Hedefleri</label>
                <textarea
                  value={formData.new_person_goals}
                  onChange={(e) => updateFormData('new_person_goals', e.target.value)}
                  placeholder="Kısa ve uzun vadeli hedefler..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>💎 Vizyonu</label>
                <textarea
                  value={formData.new_person_vision}
                  onChange={(e) => updateFormData('new_person_vision', e.target.value)}
                  placeholder="Kişisel vizyonu ve misyonu..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 4: // Sosyal
        return (
          <div className="step-content">
            <div className="form-section">
              <h3>👥 Sosyal ve Networking</h3>
              
              <div className="form-group">
                <label>🌍 Konuştuğu Diller</label>
                <Dropdown
                  options={languageOptions}
                  selectedItems={formData.new_person_languages}
                  onSelectionChange={(items) => updateFormData('new_person_languages', items)}
                  placeholder="Dil seçin..."
                  label=""
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.new_person_mentor}
                    onChange={(e) => updateFormData('new_person_mentor', e.target.checked)}
                  />
                  🎓 Mentor olarak hizmet veriyor
                </label>
                {formData.new_person_mentor && (
                  <input
                    type="text"
                    placeholder="Mentorluk alanları..."
                    style={{ marginTop: '10px' }}
                  />
                )}
              </div>

              <div className="form-group">
                <label>🤝 Gönüllü İşler / Topluluk Deneyimleri</label>
                <textarea
                  value={formData.new_person_volunteer_experience}
                  onChange={(e) => updateFormData('new_person_volunteer_experience', e.target.value)}
                  placeholder="Gönüllü çalışmalar ve topluluk deneyimleri..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 5: // Deneyim
        return (
          <div className="step-content">
            <div className="form-section">
              <h3>🏆 Kritik Yaşam Deneyimleri</h3>
              
              <div className="form-group">
                <label>🔄 Hayatındaki Dönüm Noktaları</label>
                <textarea
                  value={formData.new_person_turning_points}
                  onChange={(e) => updateFormData('new_person_turning_points', e.target.value)}
                  placeholder="Şirket kurma, iş değiştirme, ülke değiştirme gibi dönüm noktaları..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>💪 Karşılaştığı Büyük Zorluklar</label>
                <textarea
                  value={formData.new_person_challenges}
                  onChange={(e) => updateFormData('new_person_challenges', e.target.value)}
                  placeholder="Karşılaştığı zorluklar ve nasıl aştığı..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>📚 Öğrendiği En Büyük Dersler</label>
                <textarea
                  value={formData.new_person_lessons}
                  onChange={(e) => updateFormData('new_person_lessons', e.target.value)}
                  placeholder="Hayattan öğrendiği en önemli dersler..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 6: // Gelecek
        return (
          <div className="step-content">
            <div className="form-section">
              <h3>🚀 İleriye Dönük Planlar</h3>
              
              <div className="form-group">
                <label>🎯 5-10 Yıllık Hedefleri</label>
                <textarea
                  value={formData.new_person_future_goals}
                  onChange={(e) => updateFormData('new_person_future_goals', e.target.value)}
                  placeholder="Gelecek planları ve hedefleri..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.new_person_investment_interest}
                    onChange={(e) => updateFormData('new_person_investment_interest', e.target.checked)}
                  />
                  💰 Yatırım yapma / ortaklık kurma isteği var
                </label>
                {formData.new_person_investment_interest && (
                  <textarea
                    placeholder="Hangi alanlarda işbirliği yapmak istediği..."
                    rows={3}
                    style={{ marginTop: '10px' }}
                  />
                )}
              </div>

              <div className="form-group">
                <label>🤝 İş Birliği Yapma İsteği Alanlar</label>
                <textarea
                  value={formData.new_person_collaboration_areas}
                  onChange={(e) => updateFormData('new_person_collaboration_areas', e.target.value)}
                  placeholder="Hangi alanlarda işbirliği yapmak istediği..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="invite-form">
      {/* Header */}
      <div className="header">
        <div className="logo-container">
          <div className="logo-icon">🧠</div>
          <h1 className="logo-text">
            <span className="networking">NETWORKING</span>
            <span className="gpt">GPT</span>
          </h1>
        </div>
        <p className="tagline">Davete özel kişi ekleme platformu</p>
        <p className="subtagline">Mitolojik güçle ağınızı genişletin ✨</p>
      </div>

      {/* Main Container */}
      <div className="main-container">
        {/* Step Header */}
        <div className="step-header">
          <div className="step-title">
            <div className="step-icon">👥</div>
            <div>
              <h2>Adım {currentStep + 1}: {stepTitles[currentStep]}</h2>
              <p>Hermes'in rehberliğinde yeni bağlantınızı oluşturun</p>
            </div>
          </div>
        </div>

        {/* Add Person Button */}
        <div className="add-person-section">
          <button className="add-person-btn">
            <span className="add-icon">+</span>
            <span>Yeni Kişi Ekle</span>
          </button>
          <p className="add-person-text">Ağınıza yeni bir bağlantı ekleyin ✨</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-info">
            <span>Adım {currentStep + 1}/{totalSteps}</span>
            <span>{Math.round(progress)}% Tamamlandı</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="step-indicators">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div 
                key={i} 
                className={`step-dot ${i <= currentStep ? 'active' : ''} ${i === currentStep ? 'current' : ''}`}
              >
                {i === currentStep && <span className="step-label">{stepTitles[i]}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="navigation-section">
          {currentStep > 0 && (
            <button className="nav-btn prev-btn" onClick={handlePrevious}>
              ← Önceki Adım
            </button>
          )}
          {currentStep < totalSteps - 1 && currentStep > 0 && (
            <button className="nav-btn next-btn" onClick={handleNext}>
              Sonraki Adım →
            </button>
          )}
          {currentStep === totalSteps - 1 && (
            <button 
              className="nav-btn save-btn" 
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Kaydediliyor...' : 'Kişi Ekle'}
            </button>
          )}
        </div>

        {/* Form Content */}
        <div className="form-content">
          {renderStepContent()}
        </div>

        {/* Debug Info */}
        <div className="debug-info">
          Debug: Current Step: {currentStep}, Total Steps: {totalSteps}, Progress: {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}

