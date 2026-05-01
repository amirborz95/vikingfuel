#!/usr/bin/env node

/**
 * Script to update the single index.html file from Next.js static export
 * Run this after making changes to regenerate the single-page HTML
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Updating single index.html from Next.js export...');

// Check if out directory exists
if (!fs.existsSync('out')) {
    console.error('❌ Error: out/ directory not found. Run "npm run export" first.');
    process.exit(1);
}

// Read the generated index.html from out/
const generatedIndexPath = path.join('out', 'index.html');
if (!fs.existsSync(generatedIndexPath)) {
    console.error('❌ Error: out/index.html not found.');
    process.exit(1);
}

try {
    // Read the generated content
    let generatedContent = fs.readFileSync(generatedIndexPath, 'utf8');

    // Copy the generated file to root as index.html
    fs.writeFileSync('index.html', generatedContent);

    // Create a deploy folder with the full export output
    const deployDir = path.join(process.cwd(), 'deploy');
    if (fs.existsSync(deployDir)) {
        try {
            fs.rmSync(deployDir, { recursive: true, force: true });
        } catch (rmError) {
            console.log('⚠️  Could not remove existing deploy folder, continuing...');
        }
    }

    function copyRecursive(src, dest) {
        const stat = fs.statSync(src);
        if (stat.isDirectory()) {
            try {
                fs.mkdirSync(dest, { recursive: true });
            } catch (mkdirError) {
                console.log(`⚠️  Could not create directory ${dest}, continuing...`);
                return;
            }
            for (const entry of fs.readdirSync(src)) {
                copyRecursive(path.join(src, entry), path.join(dest, entry));
            }
        } else {
            try {
                fs.copyFileSync(src, dest);
            } catch (copyError) {
                console.log(`⚠️  Could not copy ${src} to ${dest}, continuing...`);
            }
        }
    }

    copyRecursive(path.join(process.cwd(), 'out'), deployDir);
    
    try {
        fs.writeFileSync(path.join(deployDir, 'index.html'), generatedContent);
    } catch (writeError) {
        console.log('⚠️  Could not write index.html to deploy folder, continuing...');
    }

    console.log('✅ Single index.html updated successfully!');
    console.log('📁 Full Hostup deploy package ready: ./deploy/');
    console.log('📁 Root index.html also updated at ./index.html');
    console.log('🚀 Upload the contents of deploy/ to Hostup for the live site.');

} catch (error) {
    console.error('❌ Error updating index.html:', error.message);
    process.exit(1);
}