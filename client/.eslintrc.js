module.exports = {
  // ... other config
  rules: {
    'no-unused-vars': 'warn',  // Changes error to warning
    // Or to ignore specific variables:
    'no-unused-vars': ['warn', { 
      'varsIgnorePattern': 'React|useState|useEffect',
      'argsIgnorePattern': '^_'
    }]
  }
}; 