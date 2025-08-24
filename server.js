const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase environment variables are missing!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// API Routes
app.post('/api/contacts', async (req, res) => {
    try {
        const contactData = req.body;
        
        // Gerekli alanları kontrol et
        if (!contactData.first_name || !contactData.last_name) {
            return res.status(400).json({
                success: false,
                message: 'Ad ve soyad alanları zorunludur!'
            });
        }

        // Supabase'e kişi ekle
        const { data, error } = await supabase
            .from('contacts')
            .insert([{
                first_name: contactData.first_name,
                last_name: contactData.last_name,
                age: contactData.age,
                city: contactData.city,
                current_city: contactData.current_city,
                university: contactData.university,
                degree: contactData.degree,
                graduation_year: contactData.graduation_year,
                position: contactData.position,
                company: contactData.company,
                sectors: contactData.sectors,
                expertise: contactData.expertise,
                services: contactData.services,
                email: contactData.email,
                phone: contactData.phone,
                languages: contactData.languages,
                mentor_service: contactData.mentor_service || false,
                social_volunteer: contactData.social_volunteer,
                life_experience: contactData.life_experience,
                challenges: contactData.challenges,
                lessons: contactData.lessons,
                future_goals: contactData.future_goals,
                investment_interest: contactData.investment_interest || false,
                collaboration_areas: contactData.collaboration_areas,
                // Ek alanlar için JSON olarak sakla
                additional_data: {
                    description: contactData.description,
                    work_experience: contactData.work_experience,
                    category: contactData.category,
                    closeness_level: contactData.closeness_level,
                    traits: contactData.traits,
                    principles: contactData.principles,
                    goals: contactData.goals,
                    vision: contactData.vision
                }
            }])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({
                success: false,
                message: 'Kişi eklenirken bir hata oluştu: ' + error.message
            });
        }

        console.log('Yeni kişi eklendi:', data);

        res.json({
            success: true,
            message: 'Kişi başarıyla eklendi!',
            data: data
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası: ' + error.message
        });
    }
});

// Kişileri listele (test için)
app.get('/api/contacts', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(500).json({
                success: false,
                message: 'Kişiler getirilemedi: ' + error.message
            });
        }

        res.json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası: ' + error.message
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Web site: http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api`);
});
