import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export let options = {
  vus: 1000, 
  duration: '5m', 
  iterations: 3500, 
  thresholds: {
    // Maximum tolerance limit for API response time
    'http_req_duration': ['p(95)<=2000'], 
  },
};

export default function () {
  group('k6 Post and Put Test', ()=> {
    // Skenario untuk POST request   
    let postData = {
      "name": "morpheus",
      "job": "leader"
    };
    let response1 = http.post('https://reqres.in/api/users', JSON.stringify(postData), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    check(response1, {
      'POST status is 201': (r) => r.status === 201, 
      'POST response time is less than 2s': (r) => r.timings.duration < 2000, 
    });
  
    // Skenario untuk PUT request
    let putData = {
      "name": "morpheus",
      "job": "zion resident"
    };
    let response2 = http.put('https://reqres.in/api/users/2', JSON.stringify(putData), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    check(response2, {
      'PUT status is 200': (r) => r.status == 200, 
      'PUT response time is less than 2s': (r) => r.timings.duration <= 2000,
    });
  
    sleep(1);
  })
}

export function handleSummary(data) {
  return {
    'script-task5.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
