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

  let form = req.session.data.pages;
  if(req.params.form == "AP1" || req.params.form == "TR1" || req.params.form == "OC1"){
    form = req.session.data[req.params.form];
  }
  const pageNum = Number(req.params.pageNum) - 1;
  const page = form.pages[pageNum];

  res.locals.pageNum = pageNum;
  res.locals.page = page;
  res.locals.formName = form.serviceName;

  if (page == undefined){
    res.render('cya.html')
  }else{
    res.render('page.html')
  }
})

