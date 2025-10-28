/**
 * Test script for MITRE ATT&CK integration
 * Run with: node test_mitre.js
 */

const fs = require('fs');
const path = require('path');

console.log('Testing MITRE ATT&CK integration...\n');

// Test 1: Check if file exists
const mitrePath = path.join(__dirname, 'vendor/mitre-cti/enterprise-attack/enterprise-attack.json');
console.log('1. Checking file existence:');
console.log('   Path:', mitrePath);
console.log('   Exists:', fs.existsSync(mitrePath));

if (!fs.existsSync(mitrePath)) {
    console.log('\n❌ MITRE ATT&CK data file not found!');
    process.exit(1);
}

// Test 2: Load and parse JSON
console.log('\n2. Loading JSON data...');
try {
    const rawData = fs.readFileSync(mitrePath, 'utf8');
    const mitreData = JSON.parse(rawData);
    console.log('   ✓ JSON parsed successfully');
    console.log('   Type:', mitreData.type);
    console.log('   ID:', mitreData.id);
    console.log('   Objects:', mitreData.objects ? mitreData.objects.length : 0);
    
    // Test 3: Extract techniques
    console.log('\n3. Extracting techniques...');
    const techniques = mitreData.objects.filter(obj => 
        obj.type === 'attack-pattern' && !obj.revoked && !obj.x_mitre_deprecated
    );
    console.log('   Total techniques:', techniques.length);
    
    // Show first 5 techniques
    console.log('\n4. Sample techniques:');
    techniques.slice(0, 5).forEach((tech, idx) => {
        const techniqueId = tech.external_references.find(ref => ref.source_name === 'mitre-attack')?.external_id;
        console.log(`   ${idx + 1}. ${techniqueId}: ${tech.name}`);
    });
    
    // Test 4: Extract tactics
    console.log('\n5. Extracting tactics...');
    const tactics = mitreData.objects.filter(obj => obj.type === 'x-mitre-tactic');
    console.log('   Total tactics:', tactics.length);
    tactics.forEach((tactic, idx) => {
        console.log(`   ${idx + 1}. ${tactic.x_mitre_shortname}`);
    });
    
    // Test 5: Check version
    console.log('\n6. Version information:');
    const versionObj = mitreData.objects.find(obj => obj.type === 'x-mitre-collection');
    if (versionObj) {
        console.log('   Version:', versionObj.x_mitre_version);
        console.log('   Modified:', versionObj.modified);
    }
    
    console.log('\n✅ All tests passed! MITRE integration is ready.');
    
} catch (error) {
    console.log('\n❌ Error loading MITRE data:', error.message);
    process.exit(1);
}
