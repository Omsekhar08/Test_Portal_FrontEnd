const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  try {
    const { language, code, input } = req.body;

    const languageToFaas = {
      'c': 'c-runner',
      'cpp': 'cpp-runner',
      'java': 'java-runner',
      'python': 'python3-runner',
      'javascript': 'js-runner'
    };

    const faasFunction = languageToFaas[language.toLowerCase()];
    if (!faasFunction) {
      throw new Error('Unsupported language');
    }

    const response = await axios.post(
      `https://interpreter.hysterchat.com/function/${faasFunction}`,
      {
        code: code,
        inputs: input,
        requestId: Date.now().toString()
      },
      {
        headers: { 
          'Content-Type': 'application/json',
        }
      }
    );

    res.status(200).json({
      stdout: response.data.result ? response.data.result.trim() : '',
      stderr: response.data.error || '',
      time: response.data.time || 'N/A',
      memory: response.data.memory || 'N/A'
    });
  } catch (error) {
    console.error('Error executing code:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
