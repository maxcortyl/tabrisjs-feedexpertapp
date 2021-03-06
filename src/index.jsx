import {NavigationView, Page, Button, TextView, ScrollView, StackLayout, ImageView, contentView, Picker} from 'tabris';

let questionId = 0;
let answers = initAnswers();
let questions = initQuestions();
let suggestions = initSuggestions();
let relations = initRelations();

contentView.append(
  <NavigationView stretch>
    <InitPage center title="Home Page"/>
  </NavigationView>
);

const navigationView = $(NavigationView).only();
let textViews = contentView.find(TextView);
let buttons = contentView.find(Button);
let pickers = contentView.find(Picker);

/** PAGE FUNCTIONS */
/** @param {tabris.Attributes<Page>} attributes */
function InitPage(attributes) {
  const pageLayout = new StackLayout({alignment: 'stretchX', spacing: 16});
  return(
    <Page padding={20} centerY layout={pageLayout} {...attributes}>
      <ScrollView layoutData='stretchY' layout={pageLayout}>
        <ImageView width={200} center image='src/img/logo.png' />
        <TextView font='24px'>Welcome to the Tonisity app that help you take the correct decisions when it comes to using the Tonisity Total Program</TextView>
        <Button onSelect={getQuestionPage}>Start</Button>
        <Button onSelect={getPreviousResultPage}>Show Previous Results</Button>
      </ScrollView>
    </Page>
  )
}

/** @param {tabris.Attributes<Page>} attributes */
function QuestionPage(attributes) {
  const pageLayout = new StackLayout({alignment: 'stretchX'});
  return(
    <Page padding={20} layout={pageLayout} {...attributes}>
      <ScrollView layoutData='stretchY' layout={pageLayout}>
        <TextView font='24px'></TextView>
        <TextView font='24px' text={questions[questionId]}></TextView>
        <Button centerX value={questionId} onSelect={(event) => showResult(event, 0)}>Yes</Button>
        <Button centerX value={questionId} onSelect={(event) => showResult(event, 1)}>No</Button>
        <Button centerX onSelect={returnToMainPage}>Return To Main Page</Button>
      </ScrollView>
    </Page>
  )
}

/** @param {tabris.Attributes<Page>} attributes */
function ResultPage(attributes) {
  const pageLayout = new StackLayout({alignment: 'stretchX'});
  const userCurrentAnswers = getUserAnswers();
  return(
    <Page padding={20} layout={pageLayout} {...attributes}>
      <ScrollView layoutData='stretchY' layout={pageLayout}>
        <TextView font='24px' text={userCurrentAnswers}></TextView>
        <Button centerX onSelect={(e) => saveResult(userCurrentAnswers)}>Save Result</Button>
        <Button centerX onSelect={returnToMainPage}>Return To Main Page</Button>
      </ScrollView>
    </Page>
  )
}

/** @param {tabris.Attributes<Page>} attributes */
function PreviousResultPage(attributes) {
  const pageLayout = new StackLayout({alignment: 'stretchX'});
  return(
    <Page padding={20} layout={pageLayout} {...attributes}>
      <ScrollView layoutData='stretchY' layout={pageLayout}>
        <Picker message='Previous Results' itemCount={getPreviousResults().length} itemText={(index) => getPreviousResults()[index]}
                onSelectionIndexChanged={(e) => textViews[1].text = `${localStorage.getItem(getPreviousResults()[e.value])}`} />
        <TextView font='24px' />
        <Button centerX onSelect={(e) => clearCurrent(pickers[0].selectionIndex)}>Clear Current Result</Button>
        <Button centerX onSelect={clearAll}>Clear All Results</Button>
        <Button centerX onSelect={returnToMainPage}>Return To Main Page</Button>
      </ScrollView>
    </Page>
  )
}

/** DATA PROCESSING FUNCTIONS */
function getQuestionPage() {
  resetData();
  navigationView.append(
    <QuestionPage title={'Question Page'} />
  );
  textViews = contentView.find(TextView);
  buttons = contentView.find(Button);
}

function getResultPage() {
  navigationView.append(
    <ResultPage title={'Result Page'} />
  );
}

function getPreviousResultPage() {
  navigationView.append(
    <PreviousResultPage title={'Previous Result Page'} />
  );
  textViews = contentView.find(TextView);
  pickers = contentView.find(Picker);
}

function returnToMainPage() {
  navigationView.pages().slice(1).dispose();
}

function resetData() {
  questionId = 0;
  answers = initAnswers();
}

function setUserAnswer(questionId, answer){
  answers[questionId] = answer;
}

function getNextStep(questionId) {
  return relations[questionId];
}

function showResult(event, answer) {  
  questionId = event.target.value;

  if (questionId === null) {
    getResultPage();
    return;
  } 

  setUserAnswer(questionId, answer);
  let nextStep = getNextStep(questionId);

  buttons.forEach(element => element.value = nextStep[answer]);
  questionId = nextStep[answer];
  
  let question = nextStep[answer] === null ? '' : questions[nextStep[answer]];
  let suggestion = nextStep[answer+2] === null ? '' : suggestions[nextStep[answer+2]];

  if (questionId === null){
    //Remove buttons
    buttons[2].text = 'Show your results';
    buttons[3].dispose();
  }

  textViews[1].text = suggestion;
  textViews[2].text = question;
}

function getUserAnswers() {
  var userAnswers = '';
  answers.forEach(function(element, key) {
    if(element != null) {
      let nextStep = getNextStep(key);
      let question = questions[key];
      let suggestion = nextStep[element+2] === null ? '' : suggestions[nextStep[element+2]];
      let answer = element === 0 ? 'Yes' : 'No';
      
      userAnswers = userAnswers + question + '\n' + answer + '\n\n';
      suggestion != '' ? userAnswers = userAnswers + suggestion + '\n' : userAnswers = userAnswers;
    }
  });

  return userAnswers;
}

function saveResult(userAnswers) {
  let time = getTime();

  localStorage.setItem(time, userAnswers);
  returnToMainPage();
}

function getPreviousResults() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    keys.push(`${localStorage.key(i)}`);
  }

  return keys;
}

function getTime() {
  let today = new Date(),
      date = today.getFullYear() + '-' + (((today.getMonth()+1) < 10)? '0' : '') + (today.getMonth()+1) + '-' + ((today.getDate() < 10)? '0' : '') + today.getDate(),
      time = ((today.getHours() < 10)? '0' : '') + today.getHours() + ":" + ((today.getMinutes() < 10)? '0' : '') + today.getMinutes(),
      dateTime = date + ' ' + time;

  return dateTime;
}

function clearCurrent(index) {
  if (index > -1) {
    localStorage.removeItem(getPreviousResults()[index]);
    returnToMainPage();
  }
}

function clearAll() {
  localStorage.clear();
  returnToMainPage();
}

/** INIT FUNCTIONS */
function initAnswers() {
  return [null, null, null, null, null, null, null, null, null];
}

function initQuestions() {
  return [
    'Do you have any pre-weaning mortality issues?',
    'Do you have satisfactory weaning weights?',
    'Are newly-weaned pigs expereriencing transport stress?',
    'Do you have issues with getting newly-weaned pigs started on feed or water?',
    'Do you have issues with post-weaning diarrhea?',
    'Is milk replacer used in farrowing house?',
    'Is creep feed available in farrowing house?',
    'Is creep feed available in farrowing house?',
    'Are you able to place extra feeders in weaning pens?'
  ];
}

function initSuggestions() {
  return [
    'Use Tonisity Px - 3% solution - 500mL/Litter/day - days 2-8 of age\n',
    'Use Tonisity Px instead of milk replacer in 1st week with Tonisity PX - 3% solution - 500mL/Litter/day - days 2-8 of age\n',
    'Use Tonisity Px - 3% solution - 500mL/Litter on top of creep feed - for the 3 days before weaning\n',
    'Use Tonisity Px - 3% solition - 20mL solution per 100g creep feed - for 3 days at initiation of creep feeding then Use Tonisity Px - 3%, Solution - 500mL/Litter on top of creep feed - for the 3 days before weaning\n',
    'Use Tonisity Px - 3% solition - 20mL solution per 100g sow\'s feed - for 3 days at initiation of sow\'s feeding then Use Tonisity Px - 3%, Solution - 500mL/Litter on top of sow\'s feed - for the 3 days before weaning\n',
    'Congratulations!!!',
    'Use Tonisity Px - 3% solution - Up to 100 mL/pig/day on top of creep feed or starter feed',
    'Use Tonisity PxW - using medicator pump - Deliver through water lines using 5 days tapering dose on arrival in post-weaning barn'
  ];
}

function initRelations() {
  return {
    0: [7, 1, 0, null],
    1: [2, 5, null, null],
    2: [6, 3, null, null],
    3: [8, 4, null, null],
    4: [6, null, null, 5],
    5: [7, 7, 1, null],
    6: [8, 8, 2, null],
    7: [8, 8, 3, 4],
    8: [null, null, 6, 7]
  };
}