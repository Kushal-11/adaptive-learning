// Enhanced Dummy Product Database
// This file contains a comprehensive database of products across multiple categories

const dummyProductDatabase = [
    // Electronics
    {
        id: 'prod-001',
        category: 'electronics',
        makeModel: 'iPhone 14 Pro',
        variant: '256GB Space Black',
        condition: 'good',
        price: 750,
        seller: 'Sarah Johnson',
        sellerEmail: 'sarah.johnson@email.com',
        location: 'Palo Alto, CA',
        distance: 3.2,
        images: ['📱'],
        timeRanges: [
            { start: '2024-02-01T18:00', end: '2024-02-01T20:00' },
            { start: '2024-02-02T10:00', end: '2024-02-02T12:00' }
        ],
        defects: 'Minor scratches on screen protector',
        accessories: ['Original box', 'Charger', 'EarPods'],
        usage: { hours: 800, notes: 'Daily use for 1 year' }
    },
    {
        id: 'prod-002',
        category: 'electronics',
        makeModel: 'MacBook Air M2',
        variant: '256GB Silver',
        condition: 'like-new',
        price: 1050,
        seller: 'Mike Chen',
        sellerEmail: 'mike.chen@email.com',
        location: 'San Francisco, CA',
        distance: 5.1,
        images: ['💻'],
        timeRanges: [
            { start: '2024-02-01T14:00', end: '2024-02-01T18:00' },
            { start: '2024-02-03T09:00', end: '2024-02-03T17:00' }
        ],
        defects: 'None',
        accessories: ['Original box', 'Charger', 'Documentation'],
        usage: { hours: 200, notes: 'Light use for work' }
    },
    {
        id: 'prod-003',
        category: 'electronics',
        makeModel: 'AirPods Pro',
        variant: '2nd Generation',
        condition: 'like-new',
        price: 180,
        seller: 'David Kim',
        sellerEmail: 'david.kim@email.com',
        location: 'Sunnyvale, CA',
        distance: 12.1,
        images: ['🎧'],
        timeRanges: [
            { start: '2024-02-02T12:00', end: '2024-02-02T15:00' },
            { start: '2024-02-02T18:00', end: '2024-02-02T21:00' }
        ],
        defects: 'None',
        accessories: ['Charging case', 'Extra ear tips', 'Original box'],
        usage: { hours: 150, notes: 'Used for workouts and commuting' }
    },
    {
        id: 'prod-004',
        category: 'electronics',
        makeModel: 'iPad Air',
        variant: '64GB Wi-Fi Space Gray',
        condition: 'good',
        price: 420,
        seller: 'Emma Wilson',
        sellerEmail: 'emma.wilson@email.com',
        location: 'San Jose, CA',
        distance: 18.5,
        images: ['📱'],
        timeRanges: [
            { start: '2024-02-01T16:00', end: '2024-02-01T19:00' }
        ],
        defects: 'Small scratch on back, screen protector applied',
        accessories: ['Charger', 'Screen protector'],
        usage: { hours: 600, notes: 'Used for reading and light gaming' }
    },
    {
        id: 'prod-005',
        category: 'electronics',
        makeModel: 'Nintendo Switch',
        variant: 'OLED Model',
        condition: 'good',
        price: 280,
        seller: 'Alex Rodriguez',
        sellerEmail: 'alex.rodriguez@email.com',
        location: 'Santa Clara, CA',
        distance: 14.3,
        images: ['🎮'],
        timeRanges: [
            { start: '2024-02-02T19:00', end: '2024-02-02T21:00' },
            { start: '2024-02-03T14:00', end: '2024-02-03T17:00' }
        ],
        defects: 'Joy-Con slight drift on left controller',
        accessories: ['Dock', 'Joy-Con controllers', 'Pro Controller', '3 games'],
        usage: { hours: 400, notes: 'Weekend gaming sessions' }
    },

    // Appliances
    {
        id: 'prod-006',
        category: 'appliances',
        makeModel: 'Dyson V15',
        variant: 'Cordless Vacuum',
        condition: 'good',
        price: 320,
        seller: 'Lisa Wang',
        sellerEmail: 'lisa.wang@email.com',
        location: 'Mountain View, CA',
        distance: 8.3,
        images: ['🧹'],
        timeRanges: [
            { start: '2024-02-01T16:00', end: '2024-02-01T19:00' }
        ],
        defects: 'Minor wear on handle grip',
        accessories: ['Multiple attachments', 'Wall mount', 'Extra filter'],
        usage: { cycles: 200, notes: 'Used twice weekly for 6 months' }
    },
    {
        id: 'prod-007',
        category: 'appliances',
        makeModel: 'Ninja Blender',
        variant: 'Professional BL610',
        condition: 'fair',
        price: 85,
        seller: 'Robert Taylor',
        sellerEmail: 'robert.taylor@email.com',
        location: 'Fremont, CA',
        distance: 18.7,
        images: ['🥤'],
        timeRanges: [
            { start: '2024-02-01T19:00', end: '2024-02-01T21:00' }
        ],
        defects: 'Base has some staining, blades slightly dull',
        accessories: ['Multiple cups', 'Lids', 'Recipe book'],
        usage: { cycles: 500, notes: 'Daily smoothie making for 2 years' }
    },
    {
        id: 'prod-008',
        category: 'appliances',
        makeModel: 'KitchenAid Stand Mixer',
        variant: 'Artisan 5-Qt',
        condition: 'like-new',
        price: 280,
        seller: 'Maria Garcia',
        sellerEmail: 'maria.garcia@email.com',
        location: 'Cupertino, CA',
        distance: 9.8,
        images: ['🍰'],
        timeRanges: [
            { start: '2024-02-02T10:00', end: '2024-02-02T14:00' },
            { start: '2024-02-03T15:00', end: '2024-02-03T18:00' }
        ],
        defects: 'None',
        accessories: ['Dough hook', 'Wire whip', 'Flat beater', 'Pouring shield'],
        usage: { cycles: 20, notes: 'Used only for special occasions' }
    },
    {
        id: 'prod-009',
        category: 'appliances',
        makeModel: 'Instant Pot',
        variant: 'Duo 8-Qt',
        condition: 'good',
        price: 65,
        seller: 'James Park',
        sellerEmail: 'james.park@email.com',
        location: 'Milpitas, CA',
        distance: 22.1,
        images: ['🍲'],
        timeRanges: [
            { start: '2024-02-01T17:00', end: '2024-02-01T20:00' }
        ],
        defects: 'Some discoloration on inner pot',
        accessories: ['Steam rack', 'Measuring cup', 'Recipe booklet'],
        usage: { cycles: 150, notes: 'Weekly meal prep for 1 year' }
    },

    // Sports Equipment
    {
        id: 'prod-010',
        category: 'sports',
        makeModel: 'Peloton Bike',
        variant: 'Gen 4',
        condition: 'good',
        price: 1200,
        seller: 'Jennifer Lopez',
        sellerEmail: 'jennifer.lopez@email.com',
        location: 'San Jose, CA',
        distance: 15.2,
        images: ['🚴'],
        timeRanges: [
            { start: '2024-02-03T08:00', end: '2024-02-03T12:00' }
        ],
        defects: 'Seat shows wear, pedals slightly loose',
        accessories: ['Heart rate monitor', 'Weights', 'Mat', 'Water bottle'],
        usage: { hours: 300, notes: 'Daily workouts for 8 months' }
    },
    {
        id: 'prod-011',
        category: 'sports',
        makeModel: 'Trek Mountain Bike',
        variant: 'X-Caliber 8',
        condition: 'good',
        price: 650,
        seller: 'Chris Johnson',
        sellerEmail: 'chris.johnson@email.com',
        location: 'Los Altos, CA',
        distance: 7.4,
        images: ['🚵'],
        timeRanges: [
            { start: '2024-02-02T09:00', end: '2024-02-02T12:00' },
            { start: '2024-02-02T15:00', end: '2024-02-02T18:00' }
        ],
        defects: 'Chain needs adjustment, minor scratches on frame',
        accessories: ['Helmet', 'Water bottle holder', 'Bike lock'],
        usage: { hours: 200, notes: 'Weekend trail rides for 1 year' }
    },
    {
        id: 'prod-012',
        category: 'sports',
        makeModel: 'Bowflex Dumbbells',
        variant: 'SelectTech 552',
        condition: 'like-new',
        price: 280,
        seller: 'Kevin Lee',
        sellerEmail: 'kevin.lee@email.com',
        location: 'Redwood City, CA',
        distance: 11.6,
        images: ['🏋️'],
        timeRanges: [
            { start: '2024-02-01T18:00', end: '2024-02-01T21:00' }
        ],
        defects: 'None',
        accessories: ['Stand', 'Workout guide', 'DVD set'],
        usage: { hours: 50, notes: 'Light home gym use for 3 months' }
    },

    // Furniture
    {
        id: 'prod-013',
        category: 'furniture',
        makeModel: 'Herman Miller Chair',
        variant: 'Aeron Size B',
        condition: 'good',
        price: 450,
        seller: 'Rachel Green',
        sellerEmail: 'rachel.green@email.com',
        location: 'Menlo Park, CA',
        distance: 6.8,
        images: ['🪑'],
        timeRanges: [
            { start: '2024-02-02T14:00', end: '2024-02-02T17:00' },
            { start: '2024-02-03T10:00', end: '2024-02-03T13:00' }
        ],
        defects: 'Armrests show wear, mesh slightly stretched',
        accessories: ['Original documentation'],
        usage: { hours: 2000, notes: 'Daily office use for 3 years' }
    },
    {
        id: 'prod-014',
        category: 'furniture',
        makeModel: 'IKEA Desk',
        variant: 'BEKANT 63x31"',
        condition: 'fair',
        price: 85,
        seller: 'Tom Wilson',
        sellerEmail: 'tom.wilson@email.com',
        location: 'Foster City, CA',
        distance: 13.9,
        images: ['🗃️'],
        timeRanges: [
            { start: '2024-02-01T15:00', end: '2024-02-01T18:00' }
        ],
        defects: 'Surface scratches, one leg slightly wobbly',
        accessories: ['Assembly instructions'],
        usage: { hours: 1500, notes: 'Home office use for 2 years' }
    },
    {
        id: 'prod-015',
        category: 'furniture',
        makeModel: 'West Elm Sofa',
        variant: 'Andes 3-Seater',
        condition: 'good',
        price: 850,
        seller: 'Sophie Chen',
        sellerEmail: 'sophie.chen@email.com',
        location: 'Burlingame, CA',
        distance: 16.2,
        images: ['🛋️'],
        timeRanges: [
            { start: '2024-02-03T11:00', end: '2024-02-03T15:00' }
        ],
        defects: 'Minor stain on one cushion, slight fading',
        accessories: ['Extra throw pillows', 'Care instructions'],
        usage: { hours: 1000, notes: 'Living room use for 18 months' }
    },

    // Clothing & Accessories
    {
        id: 'prod-016',
        category: 'clothing',
        makeModel: 'Patagonia Jacket',
        variant: 'Better Sweater Fleece',
        condition: 'like-new',
        price: 85,
        seller: 'Anna Davis',
        sellerEmail: 'anna.davis@email.com',
        location: 'Half Moon Bay, CA',
        distance: 25.3,
        images: ['🧥'],
        timeRanges: [
            { start: '2024-02-02T16:00', end: '2024-02-02T19:00' }
        ],
        defects: 'None',
        accessories: ['Original tags'],
        usage: { hours: 20, notes: 'Worn only a few times' }
    },
    {
        id: 'prod-017',
        category: 'clothing',
        makeModel: 'Ray-Ban Sunglasses',
        variant: 'Aviator Classic',
        condition: 'good',
        price: 95,
        seller: 'Mark Thompson',
        sellerEmail: 'mark.thompson@email.com',
        location: 'Saratoga, CA',
        distance: 19.4,
        images: ['🕶️'],
        timeRanges: [
            { start: '2024-02-01T13:00', end: '2024-02-01T16:00' },
            { start: '2024-02-02T20:00', end: '2024-02-02T22:00' }
        ],
        defects: 'Minor scratches on lenses, nose pads slightly worn',
        accessories: ['Case', 'Cleaning cloth'],
        usage: { hours: 200, notes: 'Regular outdoor use for 1 year' }
    },
    {
        id: 'prod-018',
        category: 'clothing',
        makeModel: 'Levi\'s Jeans',
        variant: '501 Original Fit',
        condition: 'good',
        price: 35,
        seller: 'Jessica Brown',
        sellerEmail: 'jessica.brown@email.com',
        location: 'Campbell, CA',
        distance: 12.7,
        images: ['👖'],
        timeRanges: [
            { start: '2024-02-02T17:00', end: '2024-02-02T20:00' }
        ],
        defects: 'Slight fading, minor wear on knees',
        accessories: ['Original tags'],
        usage: { hours: 300, notes: 'Regular wear for 6 months' }
    },

    // Home & Garden
    {
        id: 'prod-019',
        category: 'appliances',
        makeModel: 'Roomba',
        variant: 'i7+ Robot Vacuum',
        condition: 'good',
        price: 380,
        seller: 'Daniel Kim',
        sellerEmail: 'daniel.kim@email.com',
        location: 'Sunnyvale, CA',
        distance: 12.1,
        images: ['🤖'],
        timeRanges: [
            { start: '2024-02-01T14:00', end: '2024-02-01T17:00' },
            { start: '2024-02-03T16:00', end: '2024-02-03T19:00' }
        ],
        defects: 'Brushes need replacement, minor scuffs',
        accessories: ['Charging dock', 'Extra filters', 'Virtual wall barriers'],
        usage: { cycles: 300, notes: 'Daily cleaning for 8 months' }
    },
    {
        id: 'prod-020',
        category: 'appliances',
        makeModel: 'Nespresso Machine',
        variant: 'VertuoPlus',
        condition: 'like-new',
        price: 120,
        seller: 'Laura Martinez',
        sellerEmail: 'laura.martinez@email.com',
        location: 'San Mateo, CA',
        distance: 17.8,
        images: ['☕'],
        timeRanges: [
            { start: '2024-02-02T11:00', end: '2024-02-02T14:00' }
        ],
        defects: 'None',
        accessories: ['Sample pods', 'Water tank', 'Drip tray', 'Manual'],
        usage: { cycles: 50, notes: 'Occasional use for 2 months' }
    },

    // Electronics - Audio/Video
    {
        id: 'prod-021',
        category: 'electronics',
        makeModel: 'Sony Headphones',
        variant: 'WH-1000XM4',
        condition: 'good',
        price: 220,
        seller: 'Ryan Cooper',
        sellerEmail: 'ryan.cooper@email.com',
        location: 'Palo Alto, CA',
        distance: 3.2,
        images: ['🎧'],
        timeRanges: [
            { start: '2024-02-01T19:00', end: '2024-02-01T22:00' }
        ],
        defects: 'Ear pads slightly compressed, minor wear on headband',
        accessories: ['Carrying case', 'Audio cable', 'USB-C cable'],
        usage: { hours: 400, notes: 'Daily commute and work use for 1 year' }
    },
    {
        id: 'prod-022',
        category: 'electronics',
        makeModel: 'Samsung TV',
        variant: '55" QLED 4K',
        condition: 'like-new',
        price: 680,
        seller: 'Michelle Wang',
        sellerEmail: 'michelle.wang@email.com',
        location: 'Fremont, CA',
        distance: 18.7,
        images: ['📺'],
        timeRanges: [
            { start: '2024-02-03T12:00', end: '2024-02-03T16:00' }
        ],
        defects: 'None',
        accessories: ['Remote', 'Stand', 'Power cable', 'Manual'],
        usage: { hours: 200, notes: 'Light evening use for 4 months' }
    },

    // Sports - More Equipment
    {
        id: 'prod-023',
        category: 'sports',
        makeModel: 'Yeti Cooler',
        variant: 'Tundra 45',
        condition: 'good',
        price: 180,
        seller: 'Steve Johnson',
        sellerEmail: 'steve.johnson@email.com',
        location: 'Santa Cruz, CA',
        distance: 28.5,
        images: ['🧊'],
        timeRanges: [
            { start: '2024-02-02T13:00', end: '2024-02-02T16:00' }
        ],
        defects: 'Minor dents on exterior, latches work perfectly',
        accessories: ['Divider', 'Bottle opener'],
        usage: { cycles: 30, notes: 'Camping trips and beach outings' }
    },
    {
        id: 'prod-024',
        category: 'sports',
        makeModel: 'Electric Scooter',
        variant: 'Xiaomi Mi Pro 2',
        condition: 'fair',
        price: 320,
        seller: 'Carlos Rodriguez',
        sellerEmail: 'carlos.rodriguez@email.com',
        location: 'San Jose, CA',
        distance: 15.2,
        images: ['🛴'],
        timeRanges: [
            { start: '2024-02-01T16:00', end: '2024-02-01T19:00' },
            { start: '2024-02-03T14:00', end: '2024-02-03T17:00' }
        ],
        defects: 'Battery holds 80% charge, handlebar grips worn',
        accessories: ['Charger', 'Phone mount', 'Bell'],
        usage: { hours: 150, notes: 'Daily commute for 6 months' }
    }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = dummyProductDatabase;
}

// For browser usage
if (typeof window !== 'undefined') {
    window.dummyProductDatabase = dummyProductDatabase;
}
