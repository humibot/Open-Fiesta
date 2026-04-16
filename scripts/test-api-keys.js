#!/usr/bin/env node

/**
 * Test script to verify API keys are working
 * Run with: node scripts/test-api-keys.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function testGeminiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    log('❌ GEMINI_API_KEY not found in .env', 'red');
    return false;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    const response = await makeRequest(url);

    if (response.status === 200) {
      log('✅ Gemini API key is valid', 'green');
      return true;
    } else {
      log(`❌ Gemini API key failed: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Gemini API test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testPollinationsKey() {
  const key = process.env.OPEN_PROVIDER_API_KEY || process.env.OPEN_PROVIDER_API_KEY_BACKUP;
  if (!key) {
    log('❌ OPEN_PROVIDER_API_KEY not found in .env', 'red');
    return false;
  }

  log(`🔑 Testing Pollinations token: ${key.substring(0, 8)}...`, 'blue');

  try {
    const url = `https://text.pollinations.ai/openai?token=${encodeURIComponent(key)}`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        model: 'openai',
        max_tokens: 10,
      }),
    };

    const response = await makeRequest(url, options);

    if (response.status === 200) {
      log('✅ Pollinations API key is valid', 'green');
      return true;
    } else if (response.status === 402) {
      log('❌ Pollinations API key has insufficient tier (need SEED tier)', 'red');
      log('   Get a SEED tier token from: https://auth.pollinations.ai/', 'yellow');
      return false;
    } else {
      log(`❌ Pollinations API key failed: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Pollinations API test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testUnstableKey() {
  const key = process.env.INFERENCE_API_KEY;
  const endpoint = process.env.INFERENCE_API_ENDPOINT;

  if (!key) {
    log('❌ INFERENCE_API_KEY not found in .env', 'red');
    return false;
  }

  try {
    const url = endpoint || 'https://inference.quran.lat/v1/chat/completions';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        model: 'gpt-5-chat',
        max_tokens: 10,
      }),
    };

    const response = await makeRequest(url, options);

    if (response.status === 200) {
      log('✅ Unstable API key is valid', 'green');
      return true;
    } else {
      log(`❌ Unstable API key failed: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Unstable API test failed: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('🔑 Testing API Keys for Open-Fiesta Default Models', 'bold');
  log('================================================', 'blue');

  // Check if .env exists
  if (!fs.existsSync('.env')) {
    log('❌ .env file not found!', 'red');
    log('   Copy .env.example to .env and add your API keys', 'yellow');
    process.exit(1);
  }

  const results = [];

  log('\n📡 Testing required API keys...', 'blue');
  results.push(await testUnstableKey());
  results.push(await testGeminiKey());
  results.push(await testPollinationsKey());

  const allValid = results.every((r) => r);

  log('\n📊 Summary:', 'blue');
  if (allValid) {
    log('🎉 All required API keys are working!', 'green');
    log('   Your default models should work properly.', 'green');
  } else {
    log('⚠️  Some API keys need attention.', 'yellow');
    log('   Fix the failed keys to use all default models.', 'yellow');
  }

  log('\n🔗 Get API keys from:', 'blue');
  log('   • Gemini: https://aistudio.google.com/app/apikey', 'yellow');
  log(
    '   • Pollinations: Working token provided (or get your own from https://auth.pollinations.ai/)',
    'yellow',
  );
  log('   • Unstable: Already provided in .env.example', 'yellow');
}

main().catch(console.error);
