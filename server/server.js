import express from "express";
import cors from "cors";
import colors from "colors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import testRoute from "./routes/testRoute.js";

import Test from "./models/testmodel.js";
import Question from "./models/questionmodel.js";

dotenv.config()

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.Client_URL,
    methods: ['GET', 'POST']
}))

const questions = {
    html: [
      { question: 'What does HTML stand for?', options: ['Hypertext Markup Language', 'Hightext Markup Language', 'Hyperlink Text Markup Language', 'Hypertext Multiple Language'], correctOption: 'Hypertext Markup Language', marks: 1 },
      { question: 'Which HTML tag is used to define the largest heading?', options: ['<h1>', '<h2>', '<h3>', '<head>'], correctOption: '<h1>', marks: 1 },
      { question: 'How do you insert a comment in HTML?', options: ['<!-- Comment -->', '// Comment', '/* Comment */', '<!--- Comment --->'], correctOption: '<!-- Comment -->', marks: 1 },
      { question: 'What is the correct HTML element for inserting a line break?', options: ['<br>', '<break>', '<lb>', '<line>'], correctOption: '<br>', marks: 1 },
      { question: 'Which attribute is used to specify an image source in HTML?', options: ['src', 'href', 'alt', 'title'], correctOption: 'src', marks: 1 },
      { question: 'How do you create a hyperlink in HTML?', options: ['<a href="url">Link</a>', '<link href="url">Link</link>', '<hyperlink href="url">Link</hyperlink>', '<a url="url">Link</a>'], correctOption: '<a href="url">Link</a>', marks: 1 },
      { question: 'Which tag is used for creating a list in HTML?', options: ['<ul> for an unordered list', '<list>', '<ol> for an ordered list', '<li>'], correctOption: '<ul> for an unordered list', marks: 1 },
      { question: 'What is the purpose of the <meta> tag in HTML?', options: ['To specify metadata about the HTML document', 'To define the document\'s layout', 'To include CSS styles', 'To link JavaScript files'], correctOption: 'To specify metadata about the HTML document', marks: 1 },
      { question: 'How do you add a background color in HTML?', options: ['Use the style attribute with background-color', 'Use the <bgcolor> tag', 'Use the <color> tag', 'Use the <background> tag'], correctOption: 'Use the style attribute with background-color', marks: 1 },
      { question: 'Which tag is used to define a table row in HTML?', options: ['<tr>', '<row>', '<table-row>', '<td>'], correctOption: '<tr>', marks: 1 }
    ],
    css: [
      { question: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Cascading Style System', 'Custom Style Sheets', 'Cascading Scripting Sheets'], correctOption: 'Cascading Style Sheets', marks: 1 },
      { question: 'Which property is used to change the text color in CSS?', options: ['color', 'text-color', 'font-color', 'background-color'], correctOption: 'color', marks: 1 },
      { question: 'How do you add a border to an HTML element in CSS?', options: ['border: 1px solid black;', 'border-style: solid;', 'border-color: black;', 'border-width: 1px;'], correctOption: 'border: 1px solid black;', marks: 1 },
      { question: 'Which CSS property is used to set the font size?', options: ['font-size', 'text-size', 'font-style', 'size'], correctOption: 'font-size', marks: 1 },
      { question: 'How do you center text in CSS?', options: ['text-align: center;', 'align-text: center;', 'text-center: true;', 'center-align: yes;'], correctOption: 'text-align: center;', marks: 1 },
      { question: 'Which CSS property is used to change the background color of an element?', options: ['background-color', 'color', 'bg-color', 'background-style'], correctOption: 'background-color', marks: 1 },
      { question: 'How do you select an element with an id of "header" in CSS?', options: ['#header', '.header', 'header', 'id-header'], correctOption: '#header', marks: 1 },
      { question: 'Which property is used to control the spacing between lines of text in CSS?', options: ['line-height', 'text-spacing', 'letter-spacing', 'word-spacing'], correctOption: 'line-height', marks: 1 },
      { question: 'What is the default value of the position property in CSS?', options: ['static', 'relative', 'absolute', 'fixed'], correctOption: 'static', marks: 1 },
      { question: 'How do you apply a style to all <p> elements on a page?', options: ['p { /* styles */ }', 'all p { /* styles */ }', '.p { /* styles */ }', 'p:all { /* styles */ }'], correctOption: 'p { /* styles */ }', marks: 1 }
    ],
    js: [
      { question: 'What does the "var" keyword do in JavaScript?', options: ['Declares a variable', 'Defines a function', 'Creates an object', 'Declares a constant'], correctOption: 'Declares a variable', marks: 1 },
      { question: 'How do you create a function in JavaScript?', options: ['function myFunction() {}', 'create function myFunction() {}', 'function: myFunction() {}', 'function = myFunction() {}'], correctOption: 'function myFunction() {}', marks: 1 },
      { question: 'What is the correct way to write a comment in JavaScript?', options: ['// This is a comment', '<!-- This is a comment -->', '/* This is a comment */', '-- This is a comment --'], correctOption: '// This is a comment', marks: 1 },
      { question: 'How do you declare a constant variable in JavaScript?', options: ['const variableName', 'let variableName', 'var variableName', 'constant variableName'], correctOption: 'const variableName', marks: 1 },
      { question: 'What method is used to add an item to the end of an array in JavaScript?', options: ['push()', 'append()', 'add()', 'insert()'], correctOption: 'push()', marks: 1 },
      { question: 'How do you create an object in JavaScript?', options: ['let obj = {};', 'let obj = () => {};', 'object obj = {};', 'new Object() {}'], correctOption: 'let obj = {};', marks: 1 },
      { question: 'Which method is used to convert a string to an integer in JavaScript?', options: ['parseInt()', 'toInteger()', 'convertToInt()', 'int()'], correctOption: 'parseInt()', marks: 1 },
      { question: 'What is the output of "typeof 5" in JavaScript?', options: ['"number"', '"string"', '"boolean"', '"object"'], correctOption: '"number"', marks: 1 },
      { question: 'How do you access the first element of an array in JavaScript?', options: ['array[0]', 'array.first()', 'array.get(0)', 'array(0)'], correctOption: 'array[0]', marks: 1 },
      { question: 'What does the "this" keyword refer to in JavaScript?', options: ['The current object', 'The global object', 'The previous object', 'The document object'], correctOption: 'The current object', marks: 1 }
    ],
    operatingSystem: [
      { question: 'What is an operating system?', options: ['Software that manages hardware and software resources', 'Software that manages only hardware resources', 'Software that provides internet access', 'Software that runs games'], correctOption: 'Software that manages hardware and software resources', marks: 1 },
      { question: 'Which of the following is a type of operating system?', options: ['Windows', 'Adobe Photoshop', 'Microsoft Word', 'Google Chrome'], correctOption: 'Windows', marks: 1 },
      { question: 'What is the main function of an operating system?', options: ['To manage computer hardware and software resources', 'To create web applications', 'To edit multimedia files', 'To run antivirus programs'], correctOption: 'To manage computer hardware and software resources', marks: 1 },
      { question: 'Which operating system is known for its use in mobile devices?', options: ['Android', 'Linux', 'Windows', 'macOS'], correctOption: 'Android', marks: 1 },
      { question: 'What is a kernel in an operating system?', options: ['The core part of the operating system', 'A type of user interface', 'A hardware component', 'A network protocol'], correctOption: 'The core part of the operating system', marks: 1 },
      { question: 'Which of these is NOT an operating system?', options: ['Microsoft Word', 'macOS', 'Ubuntu', 'iOS'], correctOption: 'Microsoft Word', marks: 1 },
      { question: 'What does GUI stand for?', options: ['Graphical User Interface', 'General User Interface', 'Global User Interface', 'Graphical User Integration'], correctOption: 'Graphical User Interface', marks: 1 },
      { question: 'What type of operating system is Unix?', options: ['Multi-user', 'Single-user', 'Network-based', 'Real-time'], correctOption: 'Multi-user', marks: 1 },
      { question: 'Which OS is an open-source operating system?', options: ['Linux', 'Windows', 'macOS', 'iOS'], correctOption: 'Linux', marks: 1 },
      { question: 'What is the purpose of a system call in an operating system?', options: ['To request services from the kernel', 'To execute user programs', 'To connect to the internet', 'To update software'], correctOption: 'To request services from the kernel', marks: 1 }
    ],
    networking: [
      { question: 'What does LAN stand for?', options: ['Local Area Network', 'Long Area Network', 'Large Area Network', 'Link Area Network'], correctOption: 'Local Area Network', marks: 1 },
      { question: 'What is a router used for in networking?', options: ['To direct data packets between networks', 'To store data', 'To manage user accounts', 'To connect to the internet'], correctOption: 'To direct data packets between networks', marks: 1 },
      { question: 'Which protocol is used to transfer files over the internet?', options: ['FTP', 'HTTP', 'SMTP', 'POP3'], correctOption: 'FTP', marks: 1 },
      { question: 'What does IP stand for?', options: ['Internet Protocol', 'Internal Protocol', 'Interface Protocol', 'Internet Process'], correctOption: 'Internet Protocol', marks: 1 },
      { question: 'What is a subnet mask used for?', options: ['To divide IP addresses into subnetworks', 'To encrypt data', 'To establish a network connection', 'To configure a firewall'], correctOption: 'To divide IP addresses into subnetworks', marks: 1 },
      { question: 'What is the primary function of DNS?', options: ['To translate domain names into IP addresses', 'To provide email services', 'To manage network traffic', 'To encrypt data'], correctOption: 'To translate domain names into IP addresses', marks: 1 },
      { question: 'What does VPN stand for?', options: ['Virtual Private Network', 'Virtual Public Network', 'Variable Private Network', 'Virtual Protocol Network'], correctOption: 'Virtual Private Network', marks: 1 },
      { question: 'What is a firewall used for in networking?', options: ['To monitor and control incoming and outgoing network traffic', 'To create network connections', 'To speed up internet access', 'To manage network devices'], correctOption: 'To monitor and control incoming and outgoing network traffic', marks: 1 },
      { question: 'Which layer of the OSI model is responsible for routing?', options: ['Network layer', 'Transport layer', 'Application layer', 'Data link layer'], correctOption: 'Network layer', marks: 1 },
      { question: 'What does NAT stand for?', options: ['Network Address Translation', 'Network Access Transmission', 'Network Address Transfer', 'Network Application Transfer'], correctOption: 'Network Address Translation', marks: 1 }
    ]
  };
  
  // Endpoint to create tests and questions
  app.get('/', async (req, res) => {
    try {
      // Delete existing tests and questions to start fresh
      await Test.deleteMany({});
      await Question.deleteMany({});
  
      // Create and save tests
      const testNames = ['HTML Test', 'CSS Test', 'JavaScript Test', 'Operating System Test', 'Networking Test'];
      const testIds = [];
  
      for (let i = 0; i < testNames.length; i++) {
        const test = new Test({ title: testNames[i], descriptions: `${testNames[i]} Description` });
        const savedTest = await test.save();
        testIds.push(savedTest._id);
      }
  
      // Create and save questions with testId
      const questionsToCreate = [];
  
      for (const [index, topic] of Object.keys(questions).entries()) {
        const currentTestId = testIds[index];
        for (const q of questions[topic]) {
          questionsToCreate.push({ ...q, testId: currentTestId });
        }
      }
  
      const createdQuestions = await Question.insertMany(questionsToCreate);
  
      // Update tests to include question IDs
      for (let i = 0; i < testIds.length; i++) {
        const questionIds = createdQuestions.filter(q => q.testId.toString() === testIds[i].toString()).map(q => q._id);
        await Test.findByIdAndUpdate(testIds[i], { $set: { questions: questionIds } });
      }
  
      res.status(200).send('Tests and questions created successfully.');
    } catch (error) {
      console.error('Error creating tests and questions:', error);
      res.status(500).send('Error creating tests and questions.');
    }
  });

const Endpoint = "/server/api"
app.use(`${Endpoint}/auth`, authRoute);
app.use(`${Endpoint}/test`, testRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`.bgGreen.white);
})

connectDB();