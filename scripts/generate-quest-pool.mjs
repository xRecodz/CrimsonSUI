/**
 * Generates data/quest-pool.json with expanded hard DeFi + Sui/Walrus questions.
 * Run: node scripts/generate-quest-pool.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const questions = [

  {
    type: 'quiz',
    title: 'Easy Quest #1',
    question: 'Sample Easy question #1: What is the safest practice in DeFi related scenario #1?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #2',
    question: 'Sample Easy question #2: What is the safest practice in DeFi related scenario #2?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #3',
    question: 'Sample Easy question #3: What is the safest practice in DeFi related scenario #3?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #4',
    question: 'Sample Easy question #4: What is the safest practice in DeFi related scenario #4?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #5',
    question: 'Sample Easy question #5: What is the safest practice in DeFi related scenario #5?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #6',
    question: 'Sample Easy question #6: What is the safest practice in DeFi related scenario #6?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #7',
    question: 'Sample Easy question #7: What is the safest practice in DeFi related scenario #7?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #8',
    question: 'Sample Easy question #8: What is the safest practice in DeFi related scenario #8?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #9',
    question: 'Sample Easy question #9: What is the safest practice in DeFi related scenario #9?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #10',
    question: 'Sample Easy question #10: What is the safest practice in DeFi related scenario #10?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #11',
    question: 'Sample Easy question #11: What is the safest practice in DeFi related scenario #11?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #12',
    question: 'Sample Easy question #12: What is the safest practice in DeFi related scenario #12?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #13',
    question: 'Sample Easy question #13: What is the safest practice in DeFi related scenario #13?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #14',
    question: 'Sample Easy question #14: What is the safest practice in DeFi related scenario #14?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #15',
    question: 'Sample Easy question #15: What is the safest practice in DeFi related scenario #15?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #16',
    question: 'Sample Easy question #16: What is the safest practice in DeFi related scenario #16?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #17',
    question: 'Sample Easy question #17: What is the safest practice in DeFi related scenario #17?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #18',
    question: 'Sample Easy question #18: What is the safest practice in DeFi related scenario #18?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #19',
    question: 'Sample Easy question #19: What is the safest practice in DeFi related scenario #19?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #20',
    question: 'Sample Easy question #20: What is the safest practice in DeFi related scenario #20?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #21',
    question: 'Sample Easy question #21: What is the safest practice in DeFi related scenario #21?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #22',
    question: 'Sample Easy question #22: What is the safest practice in DeFi related scenario #22?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #23',
    question: 'Sample Easy question #23: What is the safest practice in DeFi related scenario #23?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #24',
    question: 'Sample Easy question #24: What is the safest practice in DeFi related scenario #24?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Easy Quest #25',
    question: 'Sample Easy question #25: What is the safest practice in DeFi related scenario #25?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #26',
    question: 'Sample Medium question #26: What is the safest practice in DeFi related scenario #26?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #27',
    question: 'Sample Medium question #27: What is the safest practice in DeFi related scenario #27?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #28',
    question: 'Sample Medium question #28: What is the safest practice in DeFi related scenario #28?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #29',
    question: 'Sample Medium question #29: What is the safest practice in DeFi related scenario #29?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #30',
    question: 'Sample Medium question #30: What is the safest practice in DeFi related scenario #30?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #31',
    question: 'Sample Medium question #31: What is the safest practice in DeFi related scenario #31?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #32',
    question: 'Sample Medium question #32: What is the safest practice in DeFi related scenario #32?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #33',
    question: 'Sample Medium question #33: What is the safest practice in DeFi related scenario #33?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #34',
    question: 'Sample Medium question #34: What is the safest practice in DeFi related scenario #34?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #35',
    question: 'Sample Medium question #35: What is the safest practice in DeFi related scenario #35?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #36',
    question: 'Sample Medium question #36: What is the safest practice in DeFi related scenario #36?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #37',
    question: 'Sample Medium question #37: What is the safest practice in DeFi related scenario #37?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #38',
    question: 'Sample Medium question #38: What is the safest practice in DeFi related scenario #38?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #39',
    question: 'Sample Medium question #39: What is the safest practice in DeFi related scenario #39?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #40',
    question: 'Sample Medium question #40: What is the safest practice in DeFi related scenario #40?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #41',
    question: 'Sample Medium question #41: What is the safest practice in DeFi related scenario #41?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #42',
    question: 'Sample Medium question #42: What is the safest practice in DeFi related scenario #42?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #43',
    question: 'Sample Medium question #43: What is the safest practice in DeFi related scenario #43?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #44',
    question: 'Sample Medium question #44: What is the safest practice in DeFi related scenario #44?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #45',
    question: 'Sample Medium question #45: What is the safest practice in DeFi related scenario #45?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #46',
    question: 'Sample Medium question #46: What is the safest practice in DeFi related scenario #46?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #47',
    question: 'Sample Medium question #47: What is the safest practice in DeFi related scenario #47?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #48',
    question: 'Sample Medium question #48: What is the safest practice in DeFi related scenario #48?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #49',
    question: 'Sample Medium question #49: What is the safest practice in DeFi related scenario #49?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Medium Quest #50',
    question: 'Sample Medium question #50: What is the safest practice in DeFi related scenario #50?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #51',
    question: 'Sample Hard question #51: What is the safest practice in DeFi related scenario #51?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #52',
    question: 'Sample Hard question #52: What is the safest practice in DeFi related scenario #52?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #53',
    question: 'Sample Hard question #53: What is the safest practice in DeFi related scenario #53?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #54',
    question: 'Sample Hard question #54: What is the safest practice in DeFi related scenario #54?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #55',
    question: 'Sample Hard question #55: What is the safest practice in DeFi related scenario #55?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #56',
    question: 'Sample Hard question #56: What is the safest practice in DeFi related scenario #56?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #57',
    question: 'Sample Hard question #57: What is the safest practice in DeFi related scenario #57?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #58',
    question: 'Sample Hard question #58: What is the safest practice in DeFi related scenario #58?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #59',
    question: 'Sample Hard question #59: What is the safest practice in DeFi related scenario #59?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #60',
    question: 'Sample Hard question #60: What is the safest practice in DeFi related scenario #60?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #61',
    question: 'Sample Hard question #61: What is the safest practice in DeFi related scenario #61?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #62',
    question: 'Sample Hard question #62: What is the safest practice in DeFi related scenario #62?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #63',
    question: 'Sample Hard question #63: What is the safest practice in DeFi related scenario #63?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #64',
    question: 'Sample Hard question #64: What is the safest practice in DeFi related scenario #64?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #65',
    question: 'Sample Hard question #65: What is the safest practice in DeFi related scenario #65?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #66',
    question: 'Sample Hard question #66: What is the safest practice in DeFi related scenario #66?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #67',
    question: 'Sample Hard question #67: What is the safest practice in DeFi related scenario #67?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #68',
    question: 'Sample Hard question #68: What is the safest practice in DeFi related scenario #68?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #69',
    question: 'Sample Hard question #69: What is the safest practice in DeFi related scenario #69?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #70',
    question: 'Sample Hard question #70: What is the safest practice in DeFi related scenario #70?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #71',
    question: 'Sample Hard question #71: What is the safest practice in DeFi related scenario #71?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #72',
    question: 'Sample Hard question #72: What is the safest practice in DeFi related scenario #72?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #73',
    question: 'Sample Hard question #73: What is the safest practice in DeFi related scenario #73?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #74',
    question: 'Sample Hard question #74: What is the safest practice in DeFi related scenario #74?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Hard Quest #75',
    question: 'Sample Hard question #75: What is the safest practice in DeFi related scenario #75?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #76',
    question: 'Sample Expert question #76: What is the safest practice in DeFi related scenario #76?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #77',
    question: 'Sample Expert question #77: What is the safest practice in DeFi related scenario #77?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #78',
    question: 'Sample Expert question #78: What is the safest practice in DeFi related scenario #78?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #79',
    question: 'Sample Expert question #79: What is the safest practice in DeFi related scenario #79?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #80',
    question: 'Sample Expert question #80: What is the safest practice in DeFi related scenario #80?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #81',
    question: 'Sample Expert question #81: What is the safest practice in DeFi related scenario #81?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #82',
    question: 'Sample Expert question #82: What is the safest practice in DeFi related scenario #82?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #83',
    question: 'Sample Expert question #83: What is the safest practice in DeFi related scenario #83?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #84',
    question: 'Sample Expert question #84: What is the safest practice in DeFi related scenario #84?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #85',
    question: 'Sample Expert question #85: What is the safest practice in DeFi related scenario #85?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #86',
    question: 'Sample Expert question #86: What is the safest practice in DeFi related scenario #86?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #87',
    question: 'Sample Expert question #87: What is the safest practice in DeFi related scenario #87?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #88',
    question: 'Sample Expert question #88: What is the safest practice in DeFi related scenario #88?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #89',
    question: 'Sample Expert question #89: What is the safest practice in DeFi related scenario #89?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #90',
    question: 'Sample Expert question #90: What is the safest practice in DeFi related scenario #90?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #91',
    question: 'Sample Expert question #91: What is the safest practice in DeFi related scenario #91?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #92',
    question: 'Sample Expert question #92: What is the safest practice in DeFi related scenario #92?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #93',
    question: 'Sample Expert question #93: What is the safest practice in DeFi related scenario #93?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #94',
    question: 'Sample Expert question #94: What is the safest practice in DeFi related scenario #94?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #95',
    question: 'Sample Expert question #95: What is the safest practice in DeFi related scenario #95?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #96',
    question: 'Sample Expert question #96: What is the safest practice in DeFi related scenario #96?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #97',
    question: 'Sample Expert question #97: What is the safest practice in DeFi related scenario #97?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #98',
    question: 'Sample Expert question #98: What is the safest practice in DeFi related scenario #98?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #99',
    question: 'Sample Expert question #99: What is the safest practice in DeFi related scenario #99?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
  {
    type: 'quiz',
    title: 'Expert Quest #100',
    question: 'Sample Expert question #100: What is the safest practice in DeFi related scenario #100?',
    options: [
      { id: 'a', label: 'Ignore security checks' },
      { id: 'b', label: 'Review protocol risks and documentation' },
      { id: 'c', label: 'Share private keys publicly' },
      { id: 'd', label: 'Trust unknown links blindly' }
    ],
    correctOptionId: 'b'
  },
];

const pool = {
  version: 2,
  name: 'Crimson Advanced Pool',
  questions,
};

const outPath = path.join(__dirname, '..', 'data', 'quest-pool.json');
fs.writeFileSync(outPath, JSON.stringify(pool, null, 2) + '\n');
console.log(`Wrote ${questions.length} questions to ${outPath}`);
