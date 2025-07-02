//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here
/* Render home page */
/* router.get('/', (req, res) => {
  //const formList = fs.readdirSync('./public/results').filter((item) => item.startsWith("form-"));
  //res.locals.formList = formList;
  res.render('index.njk')
}) */

/* Render results pages */
/* NB this is processed first before the generic paths */
router.get('/page/:pageNum', (req, res) => {
  const pageNum = Number(req.params.pageNum) - 1;
  // NB pages of pages
  const page = req.session.data.pages.pages[pageNum];
  res.locals.pageNum = pageNum;
  res.locals.page = page;
  
  // add a static page into the flow
  if (pageNum == 5){
    res.render('map.html')
  }else{
    res.render('page.html')
  }
})

/* Render results pages */
router.get('/:form/:pageNum', (req, res) => {
//console.log(req.params.form);
//console.log(req.session.data.pages);


  let form = req.session.data.pages;
  if(req.params.form == "AP1" || req.params.form == "AP1v2" || req.params.form == "TR1" || req.params.form == "OC1"){
    form = req.session.data[req.params.form];
  }
  const pageNum = Number(req.params.pageNum) - 1;
  const page = form.pages[pageNum];

  res.locals.form = req.params.form;
  res.locals.pageNum = pageNum;
  res.locals.page = page;
  res.locals.formName = form.serviceName;

  if (page == undefined){
    res.render('cya.html')
  }else{
    res.render('page.html')
  }
})

// handlke save DATA
router.post('/saveData', async (req, res) => {
  console.log('got data');
  let newContent = req.body;
  let question = req.body.question;
  let form = req.body.form;
  console.log(newContent);
  console.log(form);
  console.log(question);
  console.log(req.session.data[form].pages[question]);

  // update the json
  req.session.data[form].pages[question].question_text = newContent.question_text;
  req.session.data[form].pages[question].hint_text = newContent.hint_text;

  res.json({ message: 'Hello, this is a JSON response!', status: 'success' });
  console.log('send response data');
  console.log(req.session.data[form].pages[question]);

});

