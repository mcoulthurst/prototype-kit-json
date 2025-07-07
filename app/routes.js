
//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit');
const router = govukPrototypeKit.requests.setupRouter();

// Add your routes here
var fs = require('file-system');

function readFile( url ){
    fs.readFile(url, 'utf8', function( err, data ){
        if ( err ) {
            console.log( 'error', err );
        } else {
            console.log('file read');
            //console.log(data);
            return data;
        }
    });
}

function saveFile( url, body ){
    fs.writeFile(url, body, (err) => {
        if (err) {
            console.log('Error saving');
            throw err;
        } else {
            console.log('It\'s saved!');
        }
    });
}
/* 
// create constants for filename and dirname
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
 */

let files = fs.readdirSync( __dirname + '/data' );
console.log(files);

 for(var i=0; i<files.length; i++){
  console.log(files[i]);
  
 }
//JSON.parse(fs.readFileSync('./public/results/form-'+formId+'/form.json'))
console.log(__dirname);///Users/mc/projects/HMLR/prototype-kit-json/app

readFile(__dirname+'/data/OC1_v3.json')
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
  res.locals.form = "pages";

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
  console.log(req.params.pageNum);


  let form = req.session.data.pages;
  if(req.params.form == "AP1" || req.params.form == "AP1v2" || req.params.form == "TR1" || req.params.form == "OC1"){
    form = req.session.data[req.params.form];
  }
  const pageNum = Number(req.params.pageNum) - 1;
  const page = form.pages[pageNum];

  res.locals.json = JSON.stringify(req.session.data[req.params.form], null, 2);
  res.locals.form = req.params.form;
  res.locals.pageNum = pageNum;
  res.locals.page = page;
  res.locals.serviceName = form.serviceName;
 

  if (req.params.pageNum == "json"){
    res.render('json.html')

  }else if (page == undefined){
    res.render('page.html')

  }else{
    res.render('page.html')
  }
})

router.post('/setEditMode', async (req, res) => {
  console.log('current EditMode:', req.session.data.isEdit);
  console.log('set EditMode');
  console.log(req.body);
  req.session.data.isEdit = req.body.isEdit;
  console.log(req.session.data.isEdit);
  res.json({ message: 'Hello, this is a JSON response!', status: 'success' });
});

router.post('/save-form', async (req, res) => {
  console.log('save form');
  console.log(req.body);
  res.render('index.html')
});

// handle save DATA
router.post('/saveData', async (req, res) => {
  console.log('got data');
  let newContent = req.body;
  let question = req.body.question;
  let form = req.body.form;
  console.log(newContent);
  /* 
  console.log(form);
  console.log(question);
  console.log(req.session.data[form].pages[question]);
  */
  // update the json
  req.session.data[form].pages[question].question_text = newContent.question_text;
  req.session.data[form].pages[question].hint_text = newContent.hint_text;

  res.json({ message: 'Hello, this is a JSON response!', status: 'success' });
  console.log('send response data');
  console.log(req.session.data[form].pages[question]);

});

