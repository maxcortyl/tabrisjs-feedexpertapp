import {Button, TextView, ScrollView, StackLayout, contentView} from 'tabris';

let answers = initAnswers();
let questionId = 0;
let questions = initQuestions();
let suggestions = initSuggestions();
let relations = initRelations();

contentView.append(
  <$>
    <ScrollView width={300} stretch centerY centerX layout={new StackLayout({alignment: 'stretchX'})} padding={4}>
      <TextView font='24px'></TextView>
      <TextView font='24px' text={questions[questionId]}></TextView>
      <Button centerX value={questionId} onSelect={(event) => showResult(event, 0)}>Yes</Button>
      <Button centerX value={questionId} onSelect={(event) => showResult(event, 1)}>No</Button>
    </ScrollView>
  </$>
);

let textViews = contentView.find(TextView);
let buttons = contentView.find(Button);

function showResult(event, answer) {  
  questionId = event.target.value;

  setUserAnswer(questionId, answer);
  let nextStep = getNextStep(questionId);

  buttons.forEach(element => element.value = nextStep[answer]);
  questionId = nextStep[answer];
  
  let question = nextStep[answer] === null ? '' : questions[nextStep[answer]];
  let suggestion = nextStep[answer+2] === null ? '' : suggestions[nextStep[answer+2]];

  if (questionId === null){
    //Remove buttons
    buttons.forEach(element => element.dispose());
  }

  textViews.first().text = suggestion;
  textViews.last().text = question;
}

function initAnswers() {
  return [null, null, null, null, null, null, null, null, null];
}

function setUserAnswer(questionId, answer){
  answers[questionId] = answer;
}

function getNextStep(questionId) {
  return relations[questionId];
}

function initQuestions() {
  return [
    'Do you have any pre-weaning mortality issues?',
    'Do you have satisfactory weaning weights?',
    'Are newly-weaned pigs expereriencing transport stress?',
    'Do you have issues with getting newly-weaning pigs started on feed or water?',
    'Do you have issues with post-weaning diarrhea?',
    'Is milk replacer used in farrowing house?',
    'Is creep feed available in farrowing house?',
    'Is creep feed available in farrowing house?',
    'Are you able to place extra feeders in weaning pens?'
  ];
}

function initSuggestions() {
  return [
    'Use Tonisity Px - 3% solution - 500mL/Litter/day - days 2-8 of age',
    'Use Tonisity Px instead of milk replacer in 1st week with Tonisity PX - 3% solution - 500mL/Litter/day - days 2-8 of age',
    'Use Tonisity Px - 3% solution - 500mL/Litter on top of creep feed - for the 3 days before weaning',
    'Use Tonisity Px - 3% solition - 20mL solution per 100g creep feed - for 3 days at initiation of creep feeding then Use Tonisity Px - 3%, Solution - 500mL/Litter on top of creep feed - for the 3 days before weaning',
    'Use Tonisity Px - 3% solition - 20mL solution per 100g sow\'s feed - for 3 days at initiation of sow\'s feeding then Use Tonisity Px - 3%, Solution - 500mL/Litter on top of creep feed - for the 3 days before weaning',
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