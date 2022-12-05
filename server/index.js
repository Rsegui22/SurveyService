const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');
const cors = require('cors');

const PORT = 3002;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

/************************** Testing **************************/
app.post('/testing_api', (req, res) => {
    const val = req.body.val;
    const query = `
        insert into test (testing) values (${val});
    `;
    console.log(req.body.val);
    console.log(val)
    db.query(query, (err, out) => {
        if (err) {
            console.log(err);
        }
        console.log(out);
    });
    res.send(req);
});
/************************** Initialize User **************************/
app.post('/authenticate_user', (req, res) => {
    // format new user data & build query
    const email = req.body.email;
    const password = req.body.password;
    const get_user = `
        select * from Users where Email = "${email}" and Password = "${password}";
    `;
    const make_new = `
        insert into Users (Email, Password, Verified) values ("${email}", "${password}", default);
    `;
    // execute sql
    db.query(get_user, (err, out) => {
        if (err) {
            console.log(err);
        }
        if (out.length) {
            console.log("user found");
            res.send(out);
            return;
        } else {
            db.query(make_new, (err, out) => {
                if (err) {
                    console.log(err);
                }
            });
            console.log("user created");
            db.query(get_user, (err, out) => {
                if (err) {
                    console.log(err);
                }
                res.send(out);
            });
        }
    });
});
/************************** Create Survey **************************/
app.post('/create_survey', (req, res) => {
        // get survey data
        const userid = req.body.user_id;
        const title = req.body.title;
        const description = req.body.description;
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
    
        // get question data
        const sid = req.body.survey_id;
        const questions = req.body.questions;
        const questionType = req.body.questionType;
    
        const survey_query = `
            insert into  Surveys (UserID, Title, Description, StartDate, EndDate) values (${userid}, ${title}, ${description}, ${startDate}, ${endDate})
        `;
    
        const questions_query = `
            insert into Questions (SurveyID, QuestionType, Question) values (${sid}, ${questionType}, ${questions})
        `
        // execute sql
        db.query(survey_query, (err, out) => {
            if (err) {
                console.log(err);
            }
            console.log(out);
            res.send("survey info posted");
        });
        db.query(questions_query, (err, out) => {
            if (err) {
                console.log(err);
            }
            console.log("questions posted");
            res.send(out);
        });
});
/************************** Get Surveys All **************************/
app.post('/get_surveys', (req, res) => {
    // format new user data & build query
    
    //***Reminder*** Filter out by invalid End Dates */
    const query = `
        select * from Surveys;
    `;
    // execute sql
    db.query(query, (err, out) => {
        if (err) {
            console.log(err);
        }
        console.log("got surveys");
        res.send(out);
    });
});
/************************** Get Surveys User **************************/
app.post('/get_surveys_user', (req, res) => {
    // format new user data & build query
    const user_id = req.body.userid;
    const query = `
        select * from Surveys where UserID = ${user_id};
    `;
    // execute sql
    db.query(query, (err, out) => {
        if (err) {
            console.log(err);
        }
        console.log("surveys found");
        res.send(out);
    });
});
/************************** Create Response **************************/
app.post('/add_response', (req, res) => {
    // format new response data & build query
    const userID = req.body.userid;
    const questionID = req.body.questionid;
    const response = req.body.response;
    const query = `
        insert into Responses (UserID, QuestionID, Response) values (${userID}, ${questionID}, ${response});
    `;
    // execute sql
    db.query(query, (err, out) => {
        if (err) {
            console.log(err);
        }
        console.log(out);
        res.send("inside");
    });
});
/************************** Search Questions **************************/
app.get('/search_questions', (req, res) => {
    // format new question & build query
    const surveyID = req.body.surveyid;
    const query = `
        select * from Questions where SurveyID = "${surveyID}";
    `;
    // execute sql
    db.query(query, (err, out) => {
        if (err) {
            console.log(err);
        }
        console.log(out);
        res.send(out);
    });
});
/************************** Get Survey Results **************************/
app.post('/get_results_survey', (req, res) => {
    // format new user data & build query
    const survey_id = req.body.survey_id;
    const query = `
        select *
          from Questions q
          join Responses r
            on q.QuestionID = r.QuestionID
         where q.SurveyID = ${survey_id}
         order by QuestionID
        ;
    `;
    // execute sql
    db.query(query, (err, out) => {
        if (err) {
            console.log(err);
        }
        console.log("surveys found");
        res.send(out);
    });
});
/************************** Port Listener **************************/
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});