import { rankDonors } from '../services/recommendationService.js';

const mockDonors = [
    {
        _id: 'donor1',
        name: 'John Doe',
        distance: 2, // 2km
        responseRate: 0.9, // 90%
        isEligible: true
    },
    {
        _id: 'donor2',
        name: 'Jane Smith',
        distance: 8, // 8km
        responseRate: 0.95, // High response but far
        isEligible: true
    },
    {
        _id: 'donor3',
        name: 'Bob Johnson',
        distance: 1, // Very close
        responseRate: 0.1, // Very low response
        isEligible: true
    },
    {
        _id: 'donor4',
        name: 'Alice Brown',
        distance: 3,
        responseRate: 0.8,
        isEligible: false // Not eligible (recent donation)
    }
];

const radiusKm = 10;
const results = rankDonors(mockDonors, radiusKm, 4);

console.log('--- Recommendation Engine Test Results ---');
results.forEach((d, i) => {
    console.log(`${i + 1}. ${d.name}`);
    console.log(`   Score: ${d.recommendationScore.toFixed(3)}`);
    console.log(`   Distance: ${d.distance}km`);
    console.log(`   Response Rate: ${d.responseRate * 100}%`);
    console.log(`   Eligible: ${d.isEligible}`);
    console.log(`   Reason: ${d.reason}`);
    console.log('-----------------------------------------');
});

// Basic assertion check
if (results[0].name === 'John Doe') {
    console.log('SUCCESS: John Doe is the top match (Good mix of proximity and response).');
} else {
    console.log('NOTE: Top match is ' + results[0].name);
}
