/* eslint-disable @typescript-eslint/no-require-imports */
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  connectionString:
    "postgresql://postgres:%23Mazdamiatamx5@db.mltfuzqxnjjwvnwilkdq.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  const client = await pool.connect();
  try {
    // ---- Create tables ----
    await client.query(`
      DROP TABLE IF EXISTS notifications CASCADE;
      DROP TABLE IF EXISTS volunteer_events CASCADE;
      DROP TABLE IF EXISTS deforestation_reports CASCADE;
      DROP TABLE IF EXISTS pledges CASCADE;
      DROP TABLE IF EXISTS challenges CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS leaderboard_entries CASCADE;
      DROP TABLE IF EXISTS impact_data CASCADE;
      DROP TABLE IF EXISTS users CASCADE;

      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        avatar VARCHAR(10) NOT NULL,
        location VARCHAR(255) DEFAULT '',
        workplace VARCHAR(255) DEFAULT '',
        age_group VARCHAR(20) DEFAULT '25-34',
        green_score INT DEFAULT 50,
        weekly_score INT DEFAULT 0,
        streak INT DEFAULT 0,
        rank INT DEFAULT 1000,
        total_members INT DEFAULT 1200,
        joined_date DATE DEFAULT CURRENT_DATE,
        trees_equivalent FLOAT DEFAULT 0,
        co2_saved FLOAT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE leaderboard_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        name VARCHAR(255) NOT NULL,
        avatar VARCHAR(10) NOT NULL,
        score INT NOT NULL,
        change INT DEFAULT 0,
        location VARCHAR(255),
        workplace VARCHAR(255),
        category VARCHAR(50) NOT NULL, -- 'neighborhood', 'workplace', 'ageGroup'
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE challenges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        community VARCHAR(255),
        target INT NOT NULL,
        current INT DEFAULT 0,
        unit VARCHAR(100),
        deadline DATE,
        participants INT DEFAULT 0,
        category VARCHAR(50) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE pledges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        user_name VARCHAR(255) NOT NULL,
        user_avatar VARCHAR(10) NOT NULL,
        pledge TEXT NOT NULL,
        brand VARCHAR(255),
        start_date DATE DEFAULT CURRENT_DATE,
        days_kept INT DEFAULT 0,
        total_days INT DEFAULT 90,
        is_active BOOLEAN DEFAULT true,
        supporters INT DEFAULT 0,
        category VARCHAR(100),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(255) NOT NULL,
        sustainability_score INT DEFAULT 0,
        deforestation_risk VARCHAR(20) DEFAULT 'medium',
        palm_oil_free BOOLEAN DEFAULT false,
        certifications TEXT[] DEFAULT '{}',
        alternatives TEXT[] DEFAULT '{}',
        image_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE impact_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        month VARCHAR(10) NOT NULL,
        your_impact FLOAT DEFAULT 0,
        neighbor_avg FLOAT DEFAULT 0,
        city_avg FLOAT DEFAULT 0
      );

      CREATE TABLE deforestation_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        user_name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        lat FLOAT,
        lng FLOAT,
        description TEXT,
        date DATE DEFAULT CURRENT_DATE,
        status VARCHAR(20) DEFAULT 'pending',
        upvotes INT DEFAULT 0,
        image_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE volunteer_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        date DATE,
        time VARCHAR(100),
        spots_left INT DEFAULT 0,
        total_spots INT DEFAULT 0,
        score_reward INT DEFAULT 0,
        category VARCHAR(100),
        organizer VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        from_user VARCHAR(255),
        time VARCHAR(100),
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Track which user joined which challenge/event
      CREATE TABLE user_challenges (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, challenge_id)
      );

      CREATE TABLE user_events (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        event_id UUID REFERENCES volunteer_events(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, event_id)
      );
    `);

    console.log("✅ Tables created");

    // ---- Seed demo user ----
    const hash = await bcrypt.hash("password123", 10);
    const demoUser = await client.query(
      `INSERT INTO users (email, password_hash, name, avatar, location, workplace, age_group, green_score, weekly_score, streak, rank, total_members, joined_date, trees_equivalent, co2_saved)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING id`,
      [
        "aisha@example.com",
        hash,
        "Aisha Rahman",
        "AR",
        "Petaling Jaya",
        "TechCorp Malaysia",
        "25-34",
        62,
        45,
        12,
        847,
        1200,
        "2024-06-15",
        3.2,
        48,
      ]
    );
    const userId = demoUser.rows[0].id;
    console.log("✅ Demo user created:", userId);

    // ---- Leaderboard entries ----
    const lbNeighborhood = [
      ["Mei Ling Tan", "MT", 94, 2, "PJ SS2", null],
      ["Raj Kumar", "RK", 91, -1, "PJ SS2", null],
      ["Sarah Lim", "SL", 88, 5, "PJ SS17", null],
      ["Ahmad Faiz", "AF", 85, 0, "PJ SS2", null],
      ["Priya Nair", "PN", 83, 3, "PJ SS15", null],
      ["Jason Wong", "JW", 80, -2, "PJ SS2", null],
      ["Fatimah Ali", "FA", 78, 1, "PJ SS17", null],
      ["David Chong", "DC", 75, -3, "PJ SS15", null],
      ["Nurul Huda", "NH", 72, 4, "PJ SS2", null],
      ["Aisha Rahman", "AR", 62, -5, "PJ SS2", null],
      ["Vijay Rao", "VR", 58, -1, "PJ SS15", null],
      ["Zulkifli Hassan", "ZH", 52, -4, "PJ SS17", null],
    ];
    for (const e of lbNeighborhood) {
      await client.query(
        `INSERT INTO leaderboard_entries (name, avatar, score, change, location, workplace, category)
         VALUES ($1, $2, $3, $4, $5, $6, 'neighborhood')`,
        e
      );
    }

    const lbWorkplace = [
      ["Chen Wei", "CW", 96, 1, null, "TechCorp"],
      ["Ananya Pillai", "AP", 90, 3, null, "TechCorp"],
      ["Marcus Lee", "ML", 87, -2, null, "TechCorp"],
      ["Siti Aminah", "SA", 84, 0, null, "TechCorp"],
      ["Kevin Teh", "KT", 79, 2, null, "TechCorp"],
      ["Aisha Rahman", "AR", 62, -5, null, "TechCorp"],
      ["Bala Subramaniam", "BS", 55, -2, null, "TechCorp"],
    ];
    for (const e of lbWorkplace) {
      await client.query(
        `INSERT INTO leaderboard_entries (name, avatar, score, change, location, workplace, category)
         VALUES ($1, $2, $3, $4, $5, $6, 'workplace')`,
        e
      );
    }

    const lbAge = [
      ["Lina Ng", "LN", 95, 4, null, null],
      ["Hassan Ali", "HA", 92, 1, null, null],
      ["Mei Fong", "MF", 89, -1, null, null],
      ["Aisha Rahman", "AR", 62, -5, null, null],
      ["Tom Lee", "TL", 48, -8, null, null],
    ];
    for (const e of lbAge) {
      await client.query(
        `INSERT INTO leaderboard_entries (name, avatar, score, change, location, workplace, category)
         VALUES ($1, $2, $3, $4, $5, $6, 'ageGroup')`,
        e
      );
    }
    console.log("✅ Leaderboard entries seeded");

    // ---- Challenges ----
    const challengeRows = [
      ["500 Sustainable Products Switch", "Subang Jaya collectively switches to 500 sustainable products this month", "Subang Jaya", 500, 342, "products", "products", "2025-02-28", 234],
      ["Zero Single-Use Plastics Week", "Petaling Jaya goes one full week without single-use plastics", "Petaling Jaya", 1000, 678, "participants", "waste", "2025-02-14", 678],
      ["Public Transport Month", "TechCorp employees collectively log 10,000 km of public transport", "TechCorp Malaysia", 10000, 4520, "km", "transport", "2025-02-28", 89],
      ["Meatless Mondays", "SS2 neighborhood commits to meatless Mondays for a month", "PJ SS2", 200, 156, "meals", "food", "2025-02-28", 52],
      ["Energy Saving Sprint", "Reduce energy consumption by 20% across Selangor offices", "Selangor", 5000, 2100, "kWh saved", "energy", "2025-03-15", 412],
    ];
    const challengeIds: string[] = [];
    for (const c of challengeRows) {
      const res = await client.query(
        `INSERT INTO challenges (title, description, community, target, current, unit, category, deadline, participants)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        c
      );
      challengeIds.push(res.rows[0].id);
    }
    // User joined challenges 0, 1, 4
    for (const idx of [0, 1, 4]) {
      await client.query(
        `INSERT INTO user_challenges (user_id, challenge_id) VALUES ($1, $2)`,
        [userId, challengeIds[idx]]
      );
    }
    console.log("✅ Challenges seeded");

    // ---- Pledges ----
    const pledgeRows = [
      [userId, "Aisha Rahman", "AR", "Avoid all deforestation-linked palm oil brands", "Multiple brands", "2025-01-01", 36, 90, true, 23, "Palm Oil"],
      [null, "Mei Ling Tan", "MT", "Only buy RSPO-certified products", null, "2024-12-01", 67, 180, true, 45, "Products"],
      [null, "Raj Kumar", "RK", "No fast fashion purchases for 6 months", "Shein, Zara", "2024-11-15", 83, 180, true, 67, "Fashion"],
      [null, "Sarah Lim", "SL", "Switch to 100% renewable energy provider", null, "2025-01-15", 22, 365, true, 34, "Energy"],
      [null, "Ahmad Faiz", "AF", "Cycle to work every day", null, "2025-01-01", 15, 30, false, 12, "Transport"],
    ];
    for (const p of pledgeRows) {
      await client.query(
        `INSERT INTO pledges (user_id, user_name, user_avatar, pledge, brand, start_date, days_kept, total_days, is_active, supporters, category)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        p
      );
    }
    console.log("✅ Pledges seeded");

    // ---- Products ----
    const productRows = [
      ["Eco-Friendly Dish Soap", "GreenClean MY", 92, "low", true, ["RSPO", "EcoCert", "Palm Oil Free"], []],
      ["Instant Noodles", "PopularBrand", 34, "high", false, [], ["NatureMie Organic Noodles", "GreenBowl Instant"]],
      ["Chocolate Spread", "ChocoDelight", 45, "high", false, [], ["NutElla Sustainable", "Forest-Free Choco"]],
      ["Bamboo Toothbrush", "EcoSmile", 95, "low", true, ["FSC", "B-Corp"], []],
      ["Cooking Oil", "SawitGold", 28, "high", false, [], ["RSPO Certified Palm Oil", "Coconut Oil Alternative"]],
    ];
    for (const p of productRows) {
      await client.query(
        `INSERT INTO products (name, brand, sustainability_score, deforestation_risk, palm_oil_free, certifications, alternatives)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        p
      );
    }
    console.log("✅ Products seeded");

    // ---- Impact Data ----
    const impactRows = [
      ["Aug", 4.5, 2.1, 3.2],
      ["Sep", 4.2, 2.0, 3.0],
      ["Oct", 3.8, 1.8, 2.8],
      ["Nov", 3.5, 1.5, 2.5],
      ["Dec", 3.4, 1.2, 2.3],
      ["Jan", 3.2, 1.0, 2.1],
    ];
    for (const i of impactRows) {
      await client.query(
        `INSERT INTO impact_data (user_id, month, your_impact, neighbor_avg, city_avg)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, ...i]
      );
    }
    console.log("✅ Impact data seeded");

    // ---- Deforestation Reports ----
    const reportRows = [
      ["Lina Ng", "Near Taman Negara border", 4.3833, 102.3833, "Illegal logging activity spotted — approximately 2 hectares of old-growth forest cleared", "2025-01-28", "investigating", 89],
      ["Hassan Ali", "Perak state, near Gerik", 5.4333, 101.1167, "New palm oil plantation clearing in protected area buffer zone", "2025-01-25", "verified", 156],
      ["Vijay Rao", "Sabah, near Danum Valley", 5.0, 117.8, "Suspicious clearing activity near wildlife corridor", "2025-02-01", "pending", 34],
    ];
    for (const r of reportRows) {
      await client.query(
        `INSERT INTO deforestation_reports (user_id, user_name, location, lat, lng, description, date, status, upvotes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [userId, ...r]
      );
    }
    console.log("✅ Deforestation reports seeded");

    // ---- Volunteer Events ----
    const eventRows = [
      ["Mangrove Planting Day", "Join us to plant 500 mangrove saplings along the Klang coastline. All materials provided.", "Port Klang, Selangor", "2025-02-15", "8:00 AM - 12:00 PM", 23, 100, 15, "Planting", "Malaysian Nature Society"],
      ["River Cleanup: Sungai Klang", "Monthly river cleanup drive. Help remove waste and restore our waterways.", "Sungai Klang, KL", "2025-02-22", "7:00 AM - 11:00 AM", 45, 80, 12, "Cleanup", "River Rangers MY"],
      ["Sustainable Living Workshop", "Learn to make your own sustainable products — soap, detergent, and more.", "Community Hall, PJ SS2", "2025-03-01", "2:00 PM - 5:00 PM", 12, 30, 8, "Education", "Green Living MY"],
      ["Wildlife Survey: Taman Negara", "Assist researchers in documenting wildlife in Taman Negara. 3-day expedition.", "Taman Negara, Pahang", "2025-03-15", "Full Day", 5, 15, 25, "Research", "WWF Malaysia"],
    ];
    const eventIds: string[] = [];
    for (const e of eventRows) {
      const res = await client.query(
        `INSERT INTO volunteer_events (title, description, location, date, time, spots_left, total_spots, score_reward, category, organizer)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        e
      );
      eventIds.push(res.rows[0].id);
    }
    // User joined event index 1 (River Cleanup)
    await client.query(
      `INSERT INTO user_events (user_id, event_id) VALUES ($1, $2)`,
      [userId, eventIds[1]]
    );
    console.log("✅ Volunteer events seeded");

    // ---- Notifications ----
    const notifRows = [
      ["nudge", "Mei Ling nudged you — your score dropped 5 points this week! 💚", "Mei Ling Tan", "2 hours ago", false],
      ["rank_drop", "You dropped from #8 to #10 in Petaling Jaya rankings", null, "5 hours ago", false],
      ["challenge", "Subang Jaya's '500 Sustainable Products' challenge is 68% complete!", null, "1 day ago", true],
      ["streak_break", "Ahmad Faiz broke his cycling streak after 15 days", "Ahmad Faiz", "2 days ago", true],
      ["achievement", "You've logged 12 days in a row! Keep the streak alive 🔥", null, "3 days ago", true],
    ];
    for (const n of notifRows) {
      await client.query(
        `INSERT INTO notifications (user_id, type, message, from_user, time, read)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, ...n]
      );
    }
    console.log("✅ Notifications seeded");

    console.log("\n🌱 Database seeded successfully!");
    console.log("Demo login: aisha@example.com / password123");
  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
