import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { Typography, Button, Select, MenuItem, Paper, Box, IconButton, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import AceEditor from 'react-ace';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Proctoring from './Proctoring';
import { AuthContext } from '../../contexts/AuthContext'; // Make sure this path is correct
 
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-csharp';

import 'ace-builds/src-noconflict/theme-tomorrow_night_eighties';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-language_tools';

const CodingChallengeSection = ({ testId, challenges, onAllChallengesCompleted }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [challenge, setChallenge] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [runningTestCase, setRunningTestCase] = useState(null);
  const editorRef = useRef(null);
  const [showTestResults, setShowTestResults] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const alertCountRef = useRef(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { token } = useContext(AuthContext);
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    if (challenges && challenges.length > 0) {
      setChallenge(challenges[currentChallenge]);
      // console.log('Current challenge:', challenges[currentChallenge]);
    }
  }, [challenges, currentChallenge]);

  const languageToMode = {
    'C++': 'c_cpp',
    'Python': 'python',
    'JavaScript': 'javascript',
    'Java': 'java',
    'C#': 'csharp',
  };

  const getDefaultCodeTemplate = useCallback((language) => {
    switch (language) {
      case 'Java':
        return 'public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}';
      case 'Python':
        return '# Your code here';
      case 'JavaScript':
        return '// Your code here';
      case 'C++':
        return '#include <iostream>\n\nint main() {\n    // Your code here\n    return 0;\n}';
      default:
        return '// Your code here';
    }
  }, []);

  useEffect(() => {
    if (challenge && challenge.languages && challenge.languages.length > 0) {
      const defaultLanguage = challenge.languages[0];
      setSelectedLanguage(defaultLanguage);
      setUserCode(getDefaultCodeTemplate(defaultLanguage));
      setEditorKey(prevKey => prevKey + 1);
    }
  }, [challenge, getDefaultCodeTemplate]);

  useEffect(() => {
    const fetchChallengeDetails = async () => {
      if (challenge && challenge._id) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/coding-challenges/${challenge._id}`, 
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          console.log('Challenge details:', response.data);
          setChallenge(response.data);
        } catch (error) {
          console.error('Error fetching challenge details:', error);
        }
      }
    };

    fetchChallengeDetails();
  }, [challenge, token]);

  useEffect(() => {
    if (challenge) {
      console.log('Current challenge:', challenge);
      console.log('Test cases:', challenge.testCases);
    }
  }, [challenge]);

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    setUserCode(getDefaultCodeTemplate(newLanguage));
    setEditorKey(prevKey => prevKey + 1);
    
    console.log('Language changed to:', newLanguage);
    console.log('User code updated:', getDefaultCodeTemplate(newLanguage));
    
    // Use setTimeout to ensure this runs after the editor has been re-rendered
    setTimeout(() => {
      if (editorRef.current && editorRef.current.editor) {
        const newMode = languageToMode[newLanguage] || 'text';
        editorRef.current.editor.session.setMode(`ace/mode/${newMode}`);
        console.log('Editor mode set to:', newMode);
      } else {
        console.log('Editor not ready yet');
      }
    }, 0);
  };

  const handleCodeChange = (newCode) => {
    setUserCode(newCode);
  };

  const executeCode = async (action) => {
    setShowTestResults(true);
    setTestResults([]); // Reset test results at the start of each execution
    try {
      if (!challenge || !challenge.testCases || challenge.testCases.length === 0) {
        throw new Error('No test cases available');
      }

      console.log('Challenge:', challenge);
      console.log('Test cases:', challenge.testCases);

      const testCasesToRun = action === 'running' ? [challenge.testCases[0]] : challenge.testCases;

      for (let i = 0; i < testCasesToRun.length; i++) {
        setRunningTestCase(i);
        const testCase = testCasesToRun[i];
        
        if (!testCase) {
          console.error('Test case is undefined:', testCase);
          continue;
        }

        console.log('Current test case:', testCase);

        const payload = {
          language: selectedLanguage.toLowerCase(),
          code: userCode,
          input: testCase.input || ''
        };

        console.log('Executing code with payload:', payload);

        const response = await axios.post('/api/execute-code', payload);

        console.log('Code execution response:', response.data);

        const stdout = response.data.stdout || '';
        const expectedOutput = testCase.expectedOutput || 'Expected output not provided';
        const result = {
          input: testCase.input || 'N/A',
          expectedOutput: testCase.output,
          actualOutput: stdout,
          passed: stdout.trim() === testCase.output.trim(),
          time: response.data.time || 'N/A',
          memory: response.data.memory || 'N/A',
          status: 'completed'
        };
        console.log('Test result:', result);
        setTestResults(prevResults => [...prevResults, result]);
      }

      setRunningTestCase(null);
    } catch (error) {
      console.error('Error executing code:', error);
      let errorMessage = 'An error occurred while executing the code.';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.error || errorMessage;
      }
      setTestResults([{
        input: 'N/A',
        expectedOutput: 'N/A',
        actualOutput: errorMessage,
        passed: false,
        status: 'error'
      }]);
      setRunningTestCase(null);
    }
  };

  const toggleTestResults = () => {
    setShowTestResults(!showTestResults);
  };

  const handleSubmit = async () => {
    try {
      // Run all test cases
      await executeCode('submitting');

      // Wait for all test cases to complete
      while (runningTestCase !== null) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      const allTestsPassed = testResults.every(result => result.passed);

      const submissionData = {
        code: userCode,
        language: selectedLanguage,
        testResults: testResults,
        passed: allTestsPassed
      };

      console.log('Submitting with token:', token);
      console.log('Submitting challenge:', challenge._id);

      const response = await axios.post(
        `/api/coding-challenges/${challenge._id}/submit`, 
        submissionData, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Submission response:', response.data);

      if (allTestsPassed) {
        toast.success('All test cases passed. Submission successful!');
        if (currentChallenge === challenges.length - 1) {
          onAllChallengesCompleted(true);
        } else {
          setCurrentChallenge(prevChallenge => prevChallenge + 1);
        }
      } else {
        toast.warn('Not all test cases passed. Please review your code and try again.');
      }
    } catch (error) {
      console.error('Error submitting coding challenge:', error.response?.data || error.message);
      toast.error('Error submitting coding challenge: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRun = () => executeCode('running');

  if (challenges.length === 0) return <Typography>No coding challenges available for this hackathon.</Typography>;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (editorRef.current.requestFullscreen) {
        editorRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleRefresh = () => {
    setUserCode(challenge.languageImplementations[selectedLanguage].visibleCode);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleAlert = (message) => {
    toast.error(message);
    alertCountRef.current += 1;
    if (alertCountRef.current >= 3) {
      // Log out the user
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  const handleEditorLoad = (editor) => {
    editorRef.current = editor;
    const mode = languageToMode[selectedLanguage] || 'text';
    editor.session.setMode(`ace/mode/${mode}`);
    console.log('Editor loaded with mode:', mode);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: isMobile || isTablet ? 'column' : 'row',
      height: isMobile || isTablet ? 'auto' : 'calc(100vh - 201px)', 
      gap: 2,
      padding: isMobile ? 2 : 0,
    }}>
      {/* Left Panel - Problem Statement */}
      <Paper elevation={3} sx={{ 
        width: isMobile || isTablet ? '100%' : '30%', 
        bgcolor: isDarkMode ? '#1e1e1e' : '#f5f5f5', 
        color: isDarkMode ? 'white' : 'black', 
        p: 3, 
        overflowY: 'auto', 
        borderRadius: 2,
        mb: isMobile || isTablet ? 2 : 0,
      }}>
        <Typography variant="h5" gutterBottom sx={{ color: isDarkMode ? '#61dafb' : '#007acc', fontWeight: 'bold' }}>
          Coding Challenge {currentChallenge + 1} of {challenges.length}
        </Typography>
        {challenge && (
          <>
            <Typography variant="h6" sx={{ mt: 3, mb: 1, color: isDarkMode ? '#bb86fc' : '#5e35b1' }}>
              {challenge.title}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Difficulty: {challenge.difficulty}
            </Typography>
            <Typography variant="h6" sx={{ mt: 3, mb: 1, color: isDarkMode ? '#bb86fc' : '#5e35b1' }}>Problem Description</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>{challenge.description}</Typography>
            
            <Typography variant="h6" sx={{ mt: 3, mb: 1, color: isDarkMode ? '#bb86fc' : '#5e35b1' }}>Available Languages</Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              {challenge.languages.join(', ')}
            </Typography>
            
            <Typography variant="h6" sx={{ mt: 3, mb: 1, color: isDarkMode ? '#bb86fc' : '#5e35b1' }}>Sample Test Cases</Typography>
            {challenge.testCases && challenge.testCases.map((testCase, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Input:</Typography>
                <Typography variant="body2" component="pre" sx={{ bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5', p: 1, borderRadius: 1 }}>
                  {testCase.input}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>Expected Output:</Typography>
                <Typography variant="body2" component="pre" sx={{ bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5', p: 1, borderRadius: 1 }}>
                  {testCase.output}
                </Typography>
              </Box>
            ))}
          </>
        )}
      </Paper>

      {/* Right Panel - Code Editor and Test Cases */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        bgcolor: isDarkMode ? '#1e1e1e' : '#f5f5f5', 
        p: 2, 
        borderRadius: 2,
        ml: isMobile || isTablet ? 0 : 2,
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          mb: 2, 
          gap: 2,
        }}>
          <Select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            sx={{ 
              width: isMobile ? '100%' : 150, 
              bgcolor: isDarkMode ? 'white' : '#f5f5f5' 
            }}
          >
            {challenge && challenge.languages && challenge.languages.map((lang) => (
              <MenuItem key={lang} value={lang}>{lang}</MenuItem>
            ))}
          </Select>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: isMobile ? 'space-between' : 'flex-end',
            width: isMobile ? '100%' : 'auto',
          }}>
            <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={handleRun}>Run</Button>
            <Button variant="contained" color="secondary" onClick={handleSubmit}>Submit</Button>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: isMobile ? 'center' : 'flex-end',
            mt: isMobile ? 2 : 0,
          }}>
            <IconButton onClick={toggleFullscreen} sx={{ color: isDarkMode ? 'white' : 'black' }}><FullscreenIcon /></IconButton>
            <IconButton onClick={handleRefresh} sx={{ color: isDarkMode ? 'white' : 'black' }}><RefreshIcon /></IconButton>
            <IconButton onClick={toggleTheme} sx={{ color: isDarkMode ? 'white' : 'black' }}>
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Box>

        {/* Editor and Test Results container */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          flex: 1,
          height: 'calc(100% - 60px)',
          position: 'relative',
        }}>
          {/* Code Editor */}
          <Box sx={{ 
            flex: showTestResults ? '60%' : '100%',
            height: '100%',
            transition: 'flex 0.3s ease'
          }}>
            <AceEditor
              key={editorKey}
              onLoad={handleEditorLoad}
              mode={languageToMode[selectedLanguage] || 'text'}
              theme={isDarkMode ? 'tomorrow_night_eighties' : 'tomorrow'}
              name="code-editor"
              value={userCode}
              onChange={(newCode) => setUserCode(newCode)}
              width="100%"
              height="100%"
              editorProps={{ $blockScrolling: true }}
              fontSize={14}
              showPrintMargin={false}
              highlightActiveLine={true}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
                useWorker: false,
              }}
            />
          </Box>

          {/* Toggle Arrow Button */}
          <IconButton
            onClick={() => setShowTestResults(!showTestResults)}
            sx={{
              position: 'absolute',
              right: showTestResults ? '40%' : 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1,
              bgcolor: isDarkMode ? '#1e1e1e' : '#f5f5f5',
              '&:hover': {
                bgcolor: isDarkMode ? '#2d2d2d' : '#e0e0e0',
              },
              transition: 'right 0.3s ease'
            }}
          >
            {showTestResults ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
          </IconButton>

          {/* Test Results */}
          <Box sx={{ 
            flex: '40%',
            bgcolor: isDarkMode ? '#042240' : '#f5f5f5',
            color: isDarkMode ? 'white' : 'black',
            p: 2,
            borderRadius: 2,
            overflowY: 'auto',
            height: '100%',
            display: showTestResults ? 'block' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <Typography variant="h6" gutterBottom>Test Results</Typography>
            {testResults.length > 0 ? (
              testResults.map((result, index) => (
                <Box key={index} sx={{ mb: 2, p: 1, bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#f0f0f0', borderRadius: 1 }}>
                  {runningTestCase === index ? (
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                  ) : result.passed ? (
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  ) : (
                    <CancelIcon color="error" sx={{ mr: 1 }} />
                  )}
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Test Case {index + 1}</Typography>
                    <Typography variant="body2">Input: {result.input}</Typography>
                    <Typography variant="body2">Expected Output: {result.expectedOutput}</Typography>
                    <Typography variant="body2">Actual Output: {result.actualOutput}</Typography>
                    <Typography variant="body2">Time: {result.time}</Typography>
                    <Typography variant="body2">Memory: {result.memory}</Typography>
                    <Typography variant="body2" sx={{ color: result.passed ? 'green' : 'red' }}>
                      {result.passed ? 'Passed' : 'Failed'}
                    </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2">No test cases run yet.</Typography>
            )}
          </Box>
        </Box>

        {challenge?.proctoring && <Proctoring onAlert={handleAlert} />}
        <ToastContainer />
      </Box>
    </Box>
  );
};

export default CodingChallengeSection;