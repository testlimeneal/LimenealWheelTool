export const json = {
    "title": "Cognitive Test",
    "showProgressBar": "bottom",
    "showTimerPanel": "top",
    // "maxTimeToFinishPage": 10,
    // "maxTimeToFinish": 25,
    "firstPageIsStarted": true,
    "startSurveyText": "Start Quiz",
    "pages": [
        {
          "elements": [
            {
              "type": "html",
              "imageLink": "https://sample-videos.com/img/Sample-png-image-100kb.png",
                "imageHeight": 330,
                "imageWidth": 800,
              "html": "You are about to start a quiz . <br>You will have 25 seconds to end the quiz.<br>Enter your name below and click <b>Start Quiz</b> to begin."
            },
            {
              "type": "text",
              "name": "username",
              "titleLocation": "hidden",
              "isRequired": true,
              "maxLength": 25
            }
          ]
        },
      {
        "elements": [
          
            {
                "type": "image",
                "imageLink": "https://media.istockphoto.com/id/1357238374/vector/rate-us-bar-from-1-to-10-best-for-website-design-app-ui-isolated-on-white-background-eps-10.jpg?s=612x612&w=0&k=20&c=Zoqfj3J26J2MzKZAqcXyUnAeKlii7z7BNkDsGGXdHIw=",
                  "imageHeight": 130,
                  "imageWidth": 800,
              },
            {
              "type": "ranking",
              "name": "smartphone-features",
              "title": "Please rank the following smartphone features from the most important to the least",
              "isRequired": true,
              "choices": [
                "Long battery life",
                "Plenty of storage capacity",
                "High-quality camera",
                "Powerful CPU",
                "Large screen size",
                "High durability",
                "Low price"
              ]
            },
            {
              "type": "ranking",
              "name": "smartphone-features",
              "title": "Please rank the following smartphone features from the most important to the least",
              "isRequired": true,
              "choices": [
                "Long battery life",
                "Plenty of storage capacity",
                "High-quality camera",
                "Powerful CPU",
                "Large screen size",
                "High durability",
                "Low price"
              ]
            },
            {
              "type": "ranking",
              "name": "smartphone-features",
              "title": "Please rank the following smartphone features from the most important to the least",
              "isRequired": true,
              "choices": [
                "Long battery life",
                "Plenty of storage capacity",
                "High-quality camera",
                "Powerful CPU",
                "Large screen size",
                "High durability",
                "Low price"
              ]
            }
          ],
      },
      {
        "elements": [
            {
              "type": "ranking",
              "name": "smartphone-names",
              "title": "Please rank the names",
              "isRequired": true,
              "choices": [
                "Long battery life",
                "Plenty of storage capacity",
                "High-quality camera",
                "Powerful CPU",
                "Large screen size",
                "High durability",
                "Low price",
                " "
              ]
            }
          ],
      }
    ],
    "completedHtml": "<h4>Your Analysis will be emailed to you.</h4>",
    
  };



