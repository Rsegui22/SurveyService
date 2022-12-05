import { useState } from 'react';
import Axios from 'axios';
import './Viewing.css'

function Viewing(props) {
  const [surveyid, setSurveyID] = useState(0);
  const [surveys, setSurveys] = useState([]);

  const getAllSurveys = () => {
    Axios.post(`${props.host}:3002/get_surveys_user`, {
      user_id: props.userid 
    }).then((response) => {
      console.log(`Response: ${response.data}\nUserID: ${props.userid}`);
      setSurveys(response.data);
    });
  } 

  const getResults = () => {
    Axios.post(`${props.host}:3002/get_results_survey`, {
      survey_id: surveyid
    }).then((response) => {
      console.log(`Response get_results_survey: ${Object.values(response.data)}`)
    })
  }

  const createSurveyTable = () => {
    if (!surveys.length) getAllSurveys(props.userid);
    return (!surveys ? null : (
      <>
        <tr>
          <td>Selection</td>
          <td>Title</td>
          <td>Description</td>
          <td>Start Date</td>
          <td>End Date</td>
        </tr>
        {surveys.map(s => {
          return (
            <tr className='row'>
              <td className='cell'>
                <button onClick={() => {setSurveyID(s.SurveyID)}}>Select</button>
              </td>
              {Object.values(s).map(f => {
                return typeof f !== 'number' ? <td className='cell'>{f}</td> : null
              })}
            </tr>
          );
        })}
      </>
    ))
  }

  const showResults = () => {
    getResults();
  }

  // getAllSurveys();
  return (
      <div className='viewing'>
        <table className='table' border="1">{createSurveyTable()}</table>
        <>{`surveyid ${surveyid}\nuserid ${props.userid}`}</>
        {surveyid != 0 && showResults()}
      </div>
  )
}

export default Viewing;