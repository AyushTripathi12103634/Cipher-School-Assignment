import testmodel from "../models/testmodel.js";
import submissionmodel from "../models/submissionmodel.js";
import questionmodel from "../models/questionmodel.js";
import mongoose from "mongoose"

import cron from "node-cron";
import nodemailer from "nodemailer";

export const createtestcontroller = async (req, res) => {
  try {
    const { title, descriptions, questions } = req.body;
    const test = new testmodel({
      title,
      descriptions,
      questions,
    });
    await test.save();
    res.status(201).send({
      succcess: true,
      message: 'Test created successfully',
      test
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in create test api",
      error: error
    })
  }
}

export const submittestcontroller = async (req, res) => {
  try {
    const { testId, selections } = req.body;
    const userId = req.user._id;

    const submission = new submissionmodel({
      testId,
      userId,
      selections,
      endedAt: new Date(),
    });

    await submission.save();
    res.status(201).send({
      success: true,
      message: 'Test submitted successfully'
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in submit test api",
      error: error
    })
  }
}

cron.schedule("0 * * * *", async () => {
  try {
    const submissions = await submissionmodel.find({ isDeleted: false })
      .populate({
        path: 'userId',
        select: 'name email',
      })
      .populate({
        path: 'testId',
        populate: {
          path: 'questions',
          model: 'Question',
        },
      });


    for (const submission of submissions) {
      const email = submission.userId.email;
      const total_score = submission.testId.questions.length;
      let score = 0;

      for (const selection of submission.selections) {
        const question = await questionmodel.findById(selection.questionId);

        if (selection.option === question.correctOption) {
          score += question.marks;
        }
      }

      await sendmail(email, total_score, score, submission.testId.title);

      submission.isDeleted = true;
      await submission.save();
    }
  } catch (error) {
    console.error("Error evaluating the test. Error: ", error);
  }
});

const sendmail = async (email, total_score, score, testTitle) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.Email,
        pass: process.env.Password,
      },
    });

    const mailOptions = {
      from: process.env.Email,
      to: email,
      subject: "Your Test Score",
      html: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  color: #333;
                  line-height: 1.6;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                }
                .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  border: 1px solid #ddd;
                }
                h1 {
                  color: #007bff;
                  font-size: 24px;
                  margin-bottom: 20px;
                }
                p {
                  font-size: 16px;
                  margin: 0 0 15px;
                }
                .score {
                  font-size: 18px;
                  font-weight: bold;
                  color: #28a745;
                  margin-top: 10px;
                }
                .button {
                  display: inline-block;
                  padding: 10px 20px;
                  margin-top: 20px;
                  background-color: #007bff;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 5px;
                  font-size: 16px;
                  font-weight: bold;
                }
                .button:hover {
                  background-color: #0056b3;
                }
                .footer {
                  font-size: 14px;
                  color: #6c757d;
                  margin-top: 30px;
                  text-align: center;
                }
                .footer a {
                  color: #007bff;
                  text-decoration: none;
                }
                .footer a:hover {
                  text-decoration: underline;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Your Test Score</h1>
                <p>Hello <strong>${email}</strong>,</p>
                <p>The results for your test <strong>${testTitle}</strong> are ready.</p>
                <p class="score">You scored <strong>${score}</strong> points out of <strong>${total_score}</strong>.</p>
                <p>Thank you for participating! We appreciate your effort.</p>
                <div class="footer">
                  <p>If you have any questions, feel free to <a href="mailto:ayushtripathi2003@gmail.com">contact us</a>.</p>
                  <p>Best regards,<br>Your Test Team</p>
                </div>
              </div>
            </body>
          </html>
        `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent to:', email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
export const gettestcontroller = async (req, res) => {
  try {
    const { id } = req.params;

    const test = await testmodel.findById(id)
      .populate("questions");

    return res.status(200).send({
      success: true,
      message: "Test fetched successfully",
      test: test
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Erorr in get test api"
    })
  }
}

export const getalltestcontroller = async (req, res) => {
  try {
    const test = await testmodel.find();
    return res.status(200).send({
      success: true,
      message: "All tests fetched successfully",
      test: test
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in get all test api"
    })
  }
}

export const createquestioncontroller = async (req, res) => {
  try {
    const { question, options, testId, marks, correctOption } = req.body;
    const newquestion = new questionmodel({
      question,
      options,
      testId,
      marks,
      correctOption
    })
    await newquestion.save();
    return res.status(200).send({
      success: true,
      message: "Question created successfully",
      question: newquestion
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in create question api",
      error: error
    })
  }
}