var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mysql = require('mysql');
var db=require('./dbconnection');
var multer = require('multer');
var app = express();
var session = require('express-session')
var crypto = require("crypto");
var config = require('./config');
var jwt = require('jsonwebtoken');
var querystring = require('querystring');
//const sendmail = require('sendmail')();
var fs = require('fs');
var formidable = require('formidable');

var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
//var DOCUMENT_ROOT = 'C:/xampp/htdocs/card/';
var DOCUMENT_ROOT = '/var/www/html/';
app.use(bodyParser.urlencoded({
    extended: true
}));
  //app.use(session({ secret: 'keyboard cat', resave: false,saveUninitialized: false,cookie: { maxAge: 60000 }}))
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(express.static('public'));
  app.use(cookieParser());
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'kr34bn434279m9048b4jfsiwpjlsl21fhn073njjdh',
    resave: false,
    saveUninitialized: false,
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms 
    cookie: {
        expires: 600000
    }
}));
//for spreadsheet API
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

//for drive API
// If modifying these DRIVE_SCOPES, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
var DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive'];
var DRIVE_TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var DRIVE_TOKEN_PATH = DRIVE_TOKEN_DIR + 'drive-nodejs-quickstart.json';


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }    
};


var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'G:/angular-project/card-front/images/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');



app.get('/api/frontend/category_mang', function(req, res, next) {

  var responseData ={};
    if(req.query.id){
      var id = req.query.id
    }
    else{
      var id = 0;
    }
    getcategoryData(id,function(result){
      getinvitationData(result, function (resultset) {
        responseData['message'] = 'Success';
        responseData['response'] = 1;
        responseData['data'] = resultset;
        return res.json(responseData);
      })  
    })
      
  //res.send('received the data.');
});

// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
     console.log("session checker",req.session) 
    //res.redirect('/login');
});
app.post('/api/login', function(req,res,next){

  var cope = req.body;
  //req.body.phone = '9829571737'
  var responseData = {};
  var tablename = 'user'
  var whereCondtion = {};
  var response;
  var query = db.query('SELECT * FROM user where email = "'+req.body.email+'" and password = "'+req.body.password+'" ', whereCondtion, function (err,     result) {
    if (err) {
        console.error(err);
        return res.send(err);
    } else {
      //console.log(result);
      if(result.length)
      {
        if(result[0].status == 0){
          
          responseData['message'] = 'Your account is disabled! Please contact administrator.';
          responseData['response'] = 0;
          return res.json(responseData); 
        }else{
          responseData['message'] = 'Success';
          responseData['response'] = 1;
          responseData['data'] = result; 

          user_id  = result[0].id;  

          var token = jwt.sign({ id: user_id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
          });

          //req.session.user = result;
          console.log("token",token);
            //res.redirect('/dashboard');
          return res.json(responseData);
        } 
      }else{
        responseData['message'] = 'You are not register';
        responseData['response'] = 0;
        return res.json(responseData);
      }
    }
  });
  //return res.json(responseData);
  //res.send('received the data.');
})
app.post('/api/social', function(req,res,next){
 
  var cope = req.body;
  
  //req.body.phone = '9829571999'

  var responseData = {};
  var tablename = 'user'
  var whereCondtion = {fb_id:req.body.fb_id};
  var response;
  var query = db.query('SELECT * FROM user where ? ', whereCondtion, function (err,     result) {
  if (err) {
      console.error(err);
      return res.send(err);
  } else {
    //console.log(result);
    if(result.length)
    {
      var user_id  = result[0].id;
      var token = jwt.sign({ id: user_id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });

      //res.status(200).send({ auth: true, token: token });

      responseData['message'] = 'Success';
      responseData['response'] = 1;
      responseData['data'] = result;
      responseData['token'] = token;
      return res.json(responseData)
    }else{

      var query = db.query('INSERT INTO user SET ?', cope, function(err, result) {
                
                
                if (err) {
                    //console.error(err);
                    responseData['message'] = 'Error Occured!';
                    responseData['response'] = 0;
                    responseData['data'] = err;
                    //return res.send(err);
                    return res.json(responseData);
                }else{
                  var user_id  = result.insertId;
                  var query = db.query('SELECT * FROM user where ? ', whereCondtion, function (err,     result) { 
                      html = 'New User register with phone : '+req.body.email+'!'
                    

                               

                      var token = jwt.sign({ id: user_id }, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                      });

                      //res.status(200).send({ auth: true, token: token });

                      responseData['message'] = 'Success';
                      responseData['response'] = 1;
                      responseData['data'] = result;
                      responseData['token'] = token;
                       return res.json(responseData);                
                  })
                } 
                  console.log(result);
              });
    }
  }
  });
  //return res.json(responseData);
  //res.send('received the data.');
})


app.get('/api/frontend/user', function(req, res, next) {
  var cope = req.body;
  var responseData ={};
  var query = db.query('SELECT * FROM user where status = "1"', cope, function (err,     result) {
  if (err) {
      responseData['message'] = err;
      responseData['response'] = 0;
      return res.json(responseData);
  } else {
      responseData['message'] = 'Success';
      responseData['response'] = 1;
      responseData['data'] = result;
      return res.json(responseData);
       console.log(cope); 
  }
  });
  
  //res.send('received the data.');
});
app.get('/api/getattribute', function(req, res, next) { 
  var cope = req.body;
  var responseData ={};
  var query = db.query('SELECT * FROM attribute', cope, function (err,     result) {
  if (err) {

      return res.json(err);
  } else {
      return res.json(result);
       console.log(result); 
  }
  });
  
})
app.get('/api/frontend/admin_conf', function(req, res, next) {
  var cope = req.body;
  var responseData ={};
  var query = db.query('SELECT * FROM admin_conf where status = "1"', cope, function (err,     result) {
  if (err) {
      responseData['message'] = err;
      responseData['response'] = 0;
      return res.json(responseData);
  } else {
      responseData['message'] = 'Success';
      responseData['response'] = 1;
      responseData['data'] = result;
      return res.json(responseData);
       console.log(cope); 
  }
  });
  
  //res.send('received the data.');
});
app.get('/api/frontend/banner', function(req, res, next) {
  var cope = req.body;
  var responseData ={};
  var query = db.query('SELECT * FROM banner where status = "1"', cope, function (err,     result) {
  if (err) {
      responseData['message'] = err;
      responseData['response'] = 0;
      return res.json(responseData);
  } else {
      responseData['message'] = 'Success';
      responseData['response'] = 1;
      responseData['data'] = result;
      return res.json(responseData);
       console.log(cope); 
  }
  });
  
  //res.send('received the data.');
});
app.get('/api/frontend/cms_pages', function(req, res, next) {
  var cope = req.body;
  var responseData ={};
  var query = db.query('SELECT * FROM cms_pages where status = "1"', cope, function (err,     result) {
  if (err) {
      responseData['message'] = err;
      responseData['response'] = 0;
      return res.json(responseData);
  } else {
      responseData['message'] = 'Success';
      responseData['response'] = 1;
      responseData['data'] = result;
      return res.json(responseData);
       console.log(cope); 
  }
  });
  
  //res.send('received the data.');
});
app.get('/api/frontend/inquiry_mang', function(req, res, next) {
  var cope = req.body;
  var responseData ={};
  var query = db.query('SELECT * FROM inquiry_mang where status = "1"', cope, function (err,     result) {
  if (err) {
      responseData['message'] = err;
      responseData['response'] = 0;
      return res.json(responseData);
  } else {
      responseData['message'] = 'Success';
      responseData['response'] = 1;
      responseData['data'] = result;
      return res.json(responseData);
       console.log(cope); 
  }
  });
  
  //res.send('received the data.');
});
var onlyUnique = function (value, index, self) { 
    return self.indexOf(value) === index;
}
function makeFilterObject(filter,callback){
  var pending = filter.length;
  var filterArr = {};
  filter.forEach(function(item,index){ 
    filterArr[item.attribute_id] = {};
    filterArr[item.attribute_id]['id'] = item.attribute_id;    
    filterArr[item.attribute_id]['name'] = item.name;
    var idarr = item.attr.split(",").filter( onlyUnique );
    filterArr[item.attribute_id]['attr_id'] = {};
    filterArr[item.attribute_id]['attr_id'] = (idarr)

    var valuearr = item.attribute_value.split(",").filter( onlyUnique );
    filterArr[item.attribute_id]['value'] = {}; 
    filterArr[item.attribute_id]['value'] = (valuearr)

    if(0 === --pending){
      callback(filterArr);
    }
  });
}
app.get('/api/frontend/invitation_card', function(req, res, next) {
  var cope = req.body;
  var responseData ={};
  var id = req.query.id
  var query = db.query('SELECT invitation_product.id, invitation_product.product_id as prd_id,`invitation_product`.price, `invitation_attribute`.attribute_id,`invitation_attribute`.attribute_value,`invitation_attribute`.product_id,`invitation_attribute`.form_id, `invitation_attribute`.video_url, `invitation_attribute`.is_default,invitation_card.name FROM `invitation_attribute` JOIN invitation_product ON invitation_product.id = invitation_attribute.product_id JOIN invitation_card ON invitation_card.id = invitation_product.card_id WHERE `invitation_attribute`.product_id in (SELECT id FROM `invitation_product` where card_id IN (SELECT id FROM `invitation_card` WHERE parent_id IN (SELECT id from category_mang WHERE parent_id = '+id+' or id = '+id+')  and status = "1")) GROUP BY invitation_attribute.product_id', cope, function (err,     result) {
    if (err) {
        responseData['message'] = err;
        responseData['response'] = 0;
        return res.json(responseData);
    } else {
        var query = db.query('SELECT attribute_id, GROUP_CONCAT(`invitation_attribute`.`id` ) as attr, `attribute`.`name`,GROUP_CONCAT(`invitation_attribute`.`attribute_value`) as attribute_value FROM `invitation_attribute` JOIN `attribute` on attribute.id = `invitation_attribute`.`attribute_id` JOIN invitation_product ON invitation_product.id = invitation_attribute.product_id JOIN invitation_card ON invitation_card.id = invitation_product.card_id where `invitation_attribute`.product_id in (SELECT id FROM `invitation_product` where card_id IN (SELECT id FROM `invitation_card` WHERE parent_id IN (SELECT id from category_mang WHERE parent_id = '+id+' or id = '+id+') and status = "1")) GROUP by attribute_id order by attribute_id', cope, function (err, filter) {
          if (err) {
              responseData['message'] = err;
              responseData['response'] = 0;
              return res.json(responseData);
          } else {
            makeFilterObject(filter,function(filterArr){
              console.log(filterArr)
              responseData['message'] = 'Success';
              responseData['response'] = 1;
              responseData['data'] = result;
              responseData['filter'] = filterArr;
              return res.json(responseData);
               console.log(cope);
            })
          }
        }); 
    }
  });
  //res.send('received the data.');
});
app.post('/api/frontend/getcustomizecard', function(req, res, next) {
  var cope = req.body;
  var responseData ={};
  var email = cope.email;
  var query = db.query('SELECT invitation_product.product_id as prd_id,`invitation_attribute`.*,invitation_card.name FROM `invitation_attribute` JOIN invitation_product ON invitation_product.id = invitation_attribute.product_id JOIN invitation_card ON invitation_card.id = invitation_product.card_id WHERE `invitation_attribute`.product_id in (SELECT id FROM `invitation_product` where card_id IN (SELECT id FROM `invitation_card` WHERE parent_id IN (SELECT id from category_mang WHERE parent_id = (SELECT parent_id from designer where email = "'+email+'") or id = (SELECT parent_id from designer where email = "'+email+'"))  and status = "1")) GROUP BY invitation_attribute.product_id', cope, function (err,     result) {
    if (err) {
        responseData['message'] = err;
        responseData['response'] = 0;
        return res.json(responseData);
    } else {
        responseData['message'] = 'Success';
        responseData['response'] = 1;
        responseData['data'] = result;
        return res.json(responseData);
         console.log(cope);
    }
  });
  //res.send('received the data.');
});
app.get('/api/frontend/form', function(req, res, next) {
  var cope = req.body;
  var responseData ={};
  var id = req.query.id
  var query = db.query('SELECT * FROM form_builder where id = '+id+' ', cope, function (err,     result) {
  if (err) {
      responseData['message'] = err;
      responseData['response'] = 0;
      return res.json(responseData);
  } else {
      responseData['message'] = 'Success';
      responseData['response'] = 1;
      responseData['data'] = result[0];
      return res.json(responseData);
       console.log(cope); 
  }
  });
  //res.send('received the data.');
});
app.get('/api/frontend/testimonial', function(req, res, next) {
  var cope = req.body;
  var responseData ={};
  var query = db.query('SELECT * FROM testimonial where status = "1"', cope, function (err,     result) {
  if (err) {
      responseData['message'] = err;
      responseData['response'] = 0;
      return res.json(responseData);
  } else {
      responseData['message'] = 'Success';
      responseData['response'] = 1;
      responseData['data'] = result;
      return res.json(responseData);
       console.log(cope); 
  }
  });
  
  //res.send('received the data.');
});


app.post('/api/getorder', function(req, res, next) {
  var cope = req.body;
  var responseData ={};
  
  var query = db.query('SELECT `order`.*,invitation_product.product_id as product_name , order_invitation.order_id, order_invitation.product_id, order_invitation.card_id, order_invitation.card_data, order_invitation.total, order_invitation.folder_id, order_invitation.personlized_sheet_id, order_invitation.edit_count, order_invitation.video_uploaded, order_invitation.current_stage, order_invitation.video_accepted FROM `order` INNER JOIN order_invitation on order_invitation.order_id = `order`.id INNER JOIN invitation_product ON invitation_product.id = order_invitation.product_id where user_id = '+cope.user_id, cope, function (err,     result) {
  if (err) {
      responseData['message'] = err;
      responseData['response'] = 0;
      return res.json(responseData);
  } else {
      responseData['message'] = 'Success';
      responseData['response'] = 1;
      responseData['data'] = result;
      return res.json(responseData);
       console.log(cope); 
  }
  });
  
  //res.send('received the data.');
});
app.post('/api/accept', function(req, res, next) {
  var cope = req.body;
  var responseData ={};
  
  var query = db.query('UPDATE order_invitation set current_stage = 3, video_accepted = 1 where order_id = '+cope.order_id, cope, function (err,     result) {
  if (err) {
      responseData['message'] = err;
      responseData['response'] = 0;
      return res.json(responseData);
  } else {
      responseData['message'] = 'Success';
      responseData['response'] = 1;
      return res.json(responseData);
  }
  });
  
  //res.send('received the data.');
});
app.post('/api/changeOrderStatus', function(req, res, next) {
  var cope = req.body;
  var responseData ={};
  
  // var query = db.query('UPDATE order_invitation set current_stage = 3, video_accepted = 1 where order_id = '+cope.order_id, cope, function (err,     result) {
  // if (err) {
  //     responseData['message'] = err;
  //     responseData['response'] = 0;
  //     return res.json(responseData);
  // } else {
  //     responseData['message'] = 'Success';
  //     responseData['response'] = 1;
  //     return res.json(responseData);
  // }
      responseData['message'] = 'Success';
      responseData['response'] = 1;
      return res.json(responseData);
  //});
});
function processPost(request, response, callback) {
    var queryData = "";
    if(typeof callback !== 'function') return null;

    if(request.method == 'POST') {
        request.on('data', function(data) {
            queryData += data;
            if(queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
        });

        request.on('end', function() {
            request.post = querystring.parse(queryData);
            callback();
        });

    } else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}
app.post('/api/make_order', function(req, res, next) {

  var requestBody = req.body;
  var postFields;
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      
      postFields = fields;

      

         //console.log("card id - ",req.post.card_id)
      console.log("fields - ",postFields);   
      requestBody.card_id  = postFields.card_id;
      requestBody.form_id  = postFields.form_id;
      requestBody.product_id  = postFields.product_id;    
      requestBody.user_id = postFields.user_id;
      requestBody.formdata = req.query;
      

      //var oldpath = files.filetoupload.path;
      //var newpath = 'C:/Users/Your Name/' + files.filetoupload.name;
       //console.log("music",Object.keys(files))
       Object.keys(files).forEach(function(item,index){ 
        //console.log("file_object", files[item])
        var oldpath = files[item].path;
        var extension = files[item].name.split('.').pop();
        var newpath = DOCUMENT_ROOT+'images/' + item+"."+extension;
        
        // fs.rename(oldpath, newpath, function (err) {
        //   if (err) throw err;
        //   requestBody.formdata[item] = item+"."+extension;
        //   console.log('File uploaded and moved!');
        //  // console.log("requestBody "+item,requestBody[item]);
        //   //delete requestBody[item];
        //   //res.end();
        // });
       })

      console.log("final arr",requestBody);
      var cope = {}; 
      var responseData = {};
      var response = {};
      var query = db.query('SELECT invitation_product.price FROM `invitation_product` where invitation_product.id =  '+requestBody.card_id+' and invitation_product.product_id = "'+requestBody.product_id+'"', cope, function (err, price) { 
          if(err) console.log(err)
          //console.log(price);
          response['price'] = price[0].price;
          response['user_id'] = requestBody.user_id;
          console.log('INSERT INTO `order`(order_total,user_id)VALUES("'+price[0].price+'",'+requestBody.user_id+')');
          var query = db.query('INSERT INTO `order`(order_total,user_id)VALUES("'+price[0].price+'",'+requestBody.user_id+')', cope, function (err,  result) {
            if (err) {
                responseData['message'] = err;
                responseData['response'] = 0;
                return res.json(responseData);
            } else {
              var order_id = result.insertId;
                response['order_id'] = order_id
                // Load client secrets from a local file.
                fs.readFile('client_secret.json', function processClientSecrets(err, content) {
                  if (err) {
                    console.log('Error loading client secret file: ' + err);
                    return;
                  }

                  
                  createFolder(JSON.parse(content), "order_"+order_id, function(folderId){
                    var csv_file_path = DOCUMENT_ROOT+'presonlized_details.csv';
                    var csv_file_name = 'presonlized_details.csv';
                    //uploadFileToFolder(JSON.parse(content),'text/csv',folderId,csv_file_path,csv_file_name,function(spreadsheetId){
                      createSpreadSheet(JSON.parse(content),'text/csv',folderId,csv_file_path,csv_file_name,function(spreadsheetId){
                      console.log("file created")
                      var query = db.query("INSERT INTO `order_invitation`(order_id,product_id, card_id, card_data, folder_id, personlized_sheet_id,edit_count, video_uploaded, current_stage)VALUES("+result.insertId+", "+requestBody.card_id+", "+requestBody.form_id+",'"+JSON.stringify(requestBody.formdata)+"','"+folderId+"', '"+spreadsheetId+"',3, 0, 2)", cope, function (err,     result) { 
                        console.log("Dada");
                        if(err) console.log("order_invitation - ", err)
                        authorize(JSON.parse(content), requestBody,order_id,listMajors); 
                        Object.keys(files).forEach(function(item,index){ 

                          //console.log("file_object", files[item])
                          var oldpath = files[item].path;
                          var extension = files[item].name.split('.').pop();
                          var newpath = DOCUMENT_ROOT+item+"."+extension;
                          var imgName = item+"."+extension;
                          var type = files[item].type;
                          // Authorize a client with the loaded credentials, then call the
                          // Google Sheets API.
                          requestBody.folder_id = folderId;
                           
                          uploadFileToFolder(JSON.parse(content),type,folderId,oldpath,imgName,function(){
                            console.log("file uploaded")
                          })
                        })
                      });
                    })
                    
                        
                      responseData['message'] = 'Order Made Successfully!';
                      responseData['response'] = 1;
                      responseData['data'] = response;
                      return res.json(responseData);
                  })

                });
            }
          });
      })



      


    });
});
function getcategoryData(id,cb) {
      var response = {};
      var cope = {};
      var responseData = [];
      var query = db.query('SELECT * FROM category_mang where parent_id = '+id+' and status = "1"', cope, function (err,     result) {
          if (err) {
              responseData['message'] = err;
              responseData['response'] = 0;
              console.log(err)
              //return res.json(responseData);
          } else {
            response.category = result;
         cb(response); 
              
          }
      });
}
function getinvitationData(result,cb) {
      var cope = {}
      var query = db.query('SELECT `id`,`name`,`description`,`status` FROM invitation_card', cope, function (err,     resultset) {
          if (err) {
              responseData['message'] = err;
              responseData['response'] = 0;
              return res.json(responseData);
          } else {
            
                result.invitation_card = resultset;
                ///console.log(result);
                cb(result);
            
              
          }
      });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize_drive(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(DRIVE_TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken_drive(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken_drive(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: DRIVE_SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken_drive(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken_drive(token) {
  try {
    fs.mkdirSync(DRIVE_TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(DRIVE_TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + DRIVE_TOKEN_PATH);
}


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, req, order_id, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client, req, order_id);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listMajors(auth, requestdata, order_id) {
  console.log("requestdata",requestdata);
  var sheets = google.sheets('v4');
  // sheets.spreadsheets.values.get({
  //   auth: auth,
  //   spreadsheetId: '1148AmNQ8Drbpw3HfQU3AYZeeoHDe8BDrCJbQtfVs9dE',
  //   range: 'Sheet1!A1:E',
  // }, function(err, response) {
  //   if (err) {
  //     console.log('The API returned an error: ' + err);
  //     return;
  //   }
  //   var rows = response.values;
  //   //console.log(rows)
  //   if (rows.length == 0) {
  //     console.log('No data found.');
  //   } else {
  //     //console.log('Name, Major:');
  //     for (var i = 0; i < rows.length; i++) {
  //       var row = rows[i];
  //       // Print columns A and E, which correspond to indices 0 and 4.
  //       //console.log('%s, %s', row[0], row[1]);
  //     }
  //   }
  // });
  
  var start_date = new Date()
  //var sheets = google.sheets('v4');
  sheets.spreadsheets.values.append({
    auth: auth,
    spreadsheetId: '1148AmNQ8Drbpw3HfQU3AYZeeoHDe8BDrCJbQtfVs9dE',
    range: 'Sheet1', //Change Sheet1 if your worksheet's name is something else
    valueInputOption: 'USER_ENTERED',
    includeValuesInResponse:true,
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: [ [start_date, order_id, requestdata.product_id, requestdata.folder_id,'', JSON.stringify(requestdata.formdata),0, 2000, 'Yes', 'No', 'No', 'No', '', 'No', 'No', 'Pending'] ]
    }
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } else {
        console.log("Appended",response);
    }
  });
}

function uploadFileToFolder(credentials,type,folderId,oldpath,filename,callback){
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(DRIVE_TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken_drive(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      //callback(oauth2Client);

      var drive = google.drive('v3');
      var fileMetadata = {
        'name': filename,
        parents: [folderId]
      };
      var media = {
        mimeType: type,
        body: fs.createReadStream(oldpath)
      };
      drive.files.create({
        auth: oauth2Client,
        resource: fileMetadata,
        media: media,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          // Handle error
          console.error(err);
        } else {
          callback(file.id)
          console.log('File Id: ', file.id);
        }
      });
    }
  });  
}


function createFolder(credentials, folderName, callback){
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(DRIVE_TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken_drive(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      //callback(oauth2Client);

      var service = google.drive('v3');
      //// create folder
      var fileMetadata = {
        'name': folderName,
        'mimeType': 'application/vnd.google-apps.folder'
      };
      service.files.create({
        auth: oauth2Client,
        resource: fileMetadata,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          // Handle error
          console.error(err);
        } else {
          callback(file.id);
          console.log('Folder Id: ', file.id);
        }
      });
    }
  });

}



function createSpreadSheet(credentials,type,folderId,oldpath,filename,callback){

  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(DRIVE_TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken_drive(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      //callback(oauth2Client);

      var drive = google.drive('v3');
      var fileMetadata = {
        'name': filename,
        parents: [folderId]
      };
      var media = {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        body: fs.createReadStream(oldpath)
      };
      drive.files.create({
        auth: oauth2Client,
        resource: fileMetadata,
        media: media,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          // Handle error
          console.error(err);
        } else {
          callback(file.id)
          console.log('File Id: ', file.id);
        }
      });
    }
  });  

}
    //Add Records
    app.post('/api/notify', function(req, res, next) {
      
      var tablename = "notify";
      var cope = req.body;
      

      var query = db.query('INSERT INTO '+tablename+' set ? ', cope, function (err,     result) {
      if (err) {
          console.error(err);
          return res.send(err);
      } else {
          var html = '';
          html += '<div style="width: 1000px; margin: 0px auto; padding: 15px 15px;">';
          html += '<header style="display: block;width: 1000px;height: 140px;"> <img src="http://35.231.117.216/images/logo.png" style="float: left; width 208px;"></header>'
          html += '<div class="middlediv">'
          html += '<h1>Dear User</h1>';
          html += '<p>Almost finished. We need to confirm your email address. <br /> <a href="'+VerficationLink+'" style="background: #302C2A; color: #fff; text-align: center; padding: 5px 20px; display: inline-block; text-decoration: none;">Verify my email address</a></p>';
          html += '</div>';  
          html += '<div class="middlediv1" style="text-align: center; font-size:18px;"> <h1>Thank You, <br> GullyyT20 </h1></div>';
          html += '<div class="social" style="text-align: center;">';
          html += '<a href="https://www.facebook.com/GullyyT20/?ref=br_rs" style="padding:10px" target="_blank" title="Facebook"><img src="https://www.gullyy.com/public/images/mail_fb.png" width="20" height="" alt="Facebook" /></a>';
          html += '<a href="https://twitter.com/GullyyT20"   target="_blank" style="padding:10px" title="Twitter"><img src="https://www.gullyy.com/public/images/twitter.png" width="20" height="" alt="twitter"  data-default="placeholder" /></a>';
          html += '<a href="http://www.billionblue.com" title="Bluebillion" target="_blank" style="padding:10px"><img src="https://www.gullyy.com/public/images/mail_website.png" width="20" height="" alt="twitter"  data-default="placeholder" /></a>';
          html += '</div>'; 
          html += '<div class="footer" style=" padding: 15px 0px;text-align: center;background: #302C2A; color:#fff">Copyright &copy; <?php echo date("Y"); ?> <span>blue billion tech pvt.ltd</span> .  All Rights Reserved.</div>';
          html += '</div>';

          console.log(html);

          sendmail({
              from: 'no-reply@gullyy.com',
              to: cope.email,
              subject: 'Verfication Email - Gullyy.com',
              html: html,
            }, function(err, reply) {
              console.log(err && err.stack);
              console.dir(reply);
          });
          return res.json(result.insertId);
      }
      });
      //res.send('received the data.');
    });

/////////////get master data//////////
function getTree(parent_id,callback){
    var whereCondtion = {}
    whereCondtion = {parent_id: parent_id};
    var query = db.query('SELECT * FROM category_mang where ?', whereCondtion, function (err,     result) { 
      
    })
}
app.post('/api/adminlogin', function(req, res, next) {
  
  var cope = req.body;
  //req.body.phone = '9829571737'
  var responseData = {};
  var tablename = 'user'
  var whereCondtion = {username:req.body.username,password:req.body.password};
  var response;
  var query = db.query('SELECT * FROM admin where ?', whereCondtion, function (err,     result) {
    if (err) {
        console.error(err);
        return res.send(err);
    } else {
      //console.log(result);
      if(result.length)
      {
        if(result[0].status == 0){
          
          responseData['message'] = 'Your account is disabled! Please contact administrator.';
          responseData['response'] = 0;
          return res.json(responseData); 
        }else{
          responseData['message'] = 'Success';
          responseData['response'] = 1;
          responseData['data'] = result; 
          return res.json(responseData);                
        } 
      }else{
        responseData['message'] = 'You are not register';
        responseData['response'] = 0;
        return res.json(responseData);
      }
    }
  });
  //return res.json(responseData);
  //res.send('received the data.');
});


    app.get('/master/:tablename', function(req, res, next) {
      var cope = req.body;
      var tablename = req.params.tablename
      console.log("session",req.session)
      console.log(tablename);
      console.log('request received:', req.body);
      var query = db.query('SELECT * FROM `'+tablename+'`', cope, function (err,     result) {
      if (err) {
          console.error(err);
          return res.send(err);
      } else {
          if(tablename == 'marketing_child')
          {
            
          }
          return res.json(result);
      }
      });
      //res.send('received the data.');
    });
    //get edit records
    app.get('/master/record/:id/:tablename', function(req, res, next) {
      var cope = req.body;
      var tablename = req.params.tablename
      var id = req.params.id
      var responseData = {};
      var query = db.query('SELECT * FROM '+tablename+' where id='+id, cope, function (err,     result) {
      if (err) {
          console.error(err);
          return res.send(err);
      } else {
          if(result.length)
          {
            responseData['message'] = 'Success';
            responseData['data'] = result[0];
            responseData['response'] = 0;
            return res.json(responseData);  
          }else{
            responseData['message'] = 'No Record Found';
            responseData['response'] = 1;
            return res.json(responseData);
          }
      }
      });
      //res.send('received the data.');
    });
    //update records
    app.post('/master/update/:tablename', function(req, res, next) {
      var tablename = req.params.tablename;
      var cope = req.body;
      var whereCondtion = {id:req.body.id};
      var mysqlQueryBody = [];
      mysqlQueryBody[0] = cope;
      mysqlQueryBody[1] = whereCondtion;
      console.log('request received:', req.body);
      console.log('request received:', mysqlQueryBody);

      var query = db.query('update '+tablename+' set ? where ? ', mysqlQueryBody, function (err,     result) {
      if (err) {
          console.error(err);
          return res.send(err);
      } else {
          return res.json(result);
      }
      });
      //res.send('received the data.');
    });
    //Add Records
    app.post('/master/add/:tablename', function(req, res, next) {
      req.session.views = 1;
      var tablename = req.params.tablename;
      var cope = req.body;
      console.log("body", req.session.views);
      console.log('request received:', req.body);
      
      // upload(req,res,function(err){
      //     if(err){
      //          res.json({error_code:1,err_desc:err});
      //          return;
      //     }
      //      res.json({error_code:0,err_desc:null});
      // });      

      var query = db.query('INSERT INTO '+tablename+' set ? ', cope, function (err,     result) {
      if (err) {
          console.error(err);
          return res.send(err);
      } else {
          return res.json(result.insertId);
      }
      });
      //res.send('received the data.');
    });

    app.post('/master/delete/:tablename', function(req, res, next) {
      var tablename = req.params.tablename;
      var cope = req.body;
      console.log('request received:', req.body);
      

      var query = db.query('DELETE FROM '+tablename+' where ? ', cope, function (err,     result) {
      if (err) {
          console.error(err);
          return res.send(err);
      } else {
          return res.json(result);
      }
      });
      //res.send('received the data.');
    }); 

    //get DropDown Values
    app.post('/dropdown/:tablename', function(req, res, next) {  
      var cope = req.body.fields;
      var tablename = req.params.tablename
      var responseData = {};
      var mysqlQueryBody = [];
      mysqlQueryBody[0] = cope;
      mysqlQueryBody[1] = tablename;

      console.log(mysqlQueryBody);
      console.log('request received:', req.body);
      var query = db.query('SELECT '+cope+' FROM '+tablename, mysqlQueryBody, function (err,     result) {
      if (err) {
          console.error(err);
          return res.send(err);
      } else {

          if(result.length)
          {
            responseData['message'] = 'Success';
            responseData['data'] = result;
            responseData['response'] = 1;
            return res.json(responseData);  
          }else{
            responseData['message'] = 'No Record Found';
            responseData['response'] = 0;
            return res.json(responseData);
          }
      }
      });
      //res.send('received the data.');
    });



    app.post('/master/addcard', function(req, res, next) {
      req.session.views = 1;
      var tablename = 'invitation_card';
      var cope = req.body.card_data;
      var attribute_set = req.body.attribute_data;

      
      
      // upload(req,res,function(err){
      //     if(err){
      //          res.json({error_code:1,err_desc:err});
      //          return;
      //     }
      //      res.json({error_code:0,err_desc:null});
      // });      

      var query = db.query('INSERT INTO '+tablename+' set ? ', cope, function (err,     result) {
      if (err) {
          console.error(err);
          return res.send(err);
      } else {
          
          Object.keys(attribute_set).forEach(function(item,index){
            var query = db.query('INSERT INTO invitation_product (card_id,product_id,price)VALUES("'+result.insertId+'", "'+attribute_set[item].product_id+'", "'+attribute_set[item].price+'")', cope, function (err, res) { 
              if(err){
                console.log(err)
              }
              console.log("QUERY 1 : ", 'INSERT INTO invitation_product(card_id,product_id)VALUES("'+result.insertId+'", "'+attribute_set[item].product_id+'")');
              Object.keys(attribute_set[item].attribute).forEach(function(attr_item,attr_index){ 
                console.log('QUERY 2 : ','INSERT INTO invitation_attribute(attribute_id,attribute_value,product_id,form_id,video_url)VALUES("'+attr_item+'", "'+attribute_set[item].attribute[attr_item]+'","'+res.insertId+'","'+attribute_set[item].form_id+'","'+attribute_set[item].video_link+'") ')
                var query = db.query('INSERT INTO invitation_attribute (attribute_id,attribute_value,product_id,form_id,video_url)VALUES("'+attr_item+'", "'+attribute_set[item].attribute[attr_item]+'","'+res.insertId+'","'+attribute_set[item].form_id+'","'+attribute_set[item].video_link+'") ', cope, function (err, res2) { 
                  if(err){
                    console.log(err)
                  }
                });      
              })
            }) 
          })
          return res.json(result.insertId);
      }
      });
      //res.send('received the data.');
    });

        //update records
    app.post('/master/updatecard', function(req, res, next) {
      var tablename = 'invitation_card';
      var cope = req.body.card_data;
      var attribute_set = req.body.attribute_data;
      var whereCondtion = {id:cope.id};
      var mysqlQueryBody = [];
      mysqlQueryBody[0] = cope;
      mysqlQueryBody[1] = whereCondtion;
      console.log('request received:', req.body);
      console.log('request received:', mysqlQueryBody);

      var query = db.query('update '+tablename+' set ? where ? ', mysqlQueryBody, function (err,     result) {
      if (err) {
          console.error(err);
          return res.send(err);
      } else {
        var query = db.query('DELETE FROM `invitation_attribute` WHERE invitation_attribute.product_id IN (SELECT id from invitation_product where card_id = '+cope.id+')', mysqlQueryBody, function (err,     result) { 
          var query = db.query('DELETE FROM `invitation_product` WHERE card_id = '+cope.id, mysqlQueryBody, function (err,     result) { 
            Object.keys(attribute_set).forEach(function(item,index){
              var query = db.query('INSERT INTO invitation_product (card_id,product_id,price)VALUES("'+cope.id+'", "'+attribute_set[item].product_id+'", "'+attribute_set[item].price+'")', cope, function (err, res) { 
                if(err){
                  console.log(err)
                }
                console.log("QUERY 1 : ", 'INSERT INTO invitation_product(card_id,product_id)VALUES("'+cope.id+'", "'+attribute_set[item].product_id+'")');
                Object.keys(attribute_set[item].attribute).forEach(function(attr_item,attr_index){ 
                  console.log('QUERY 2 : ','INSERT INTO invitation_attribute(attribute_id,attribute_value,product_id,form_id,video_url)VALUES("'+attr_item+'", "'+attribute_set[item].attribute[attr_item]+'","'+res.insertId+'","'+attribute_set[item].form_id+'","'+attribute_set[item].video_link+'") ')
                  var query = db.query('INSERT INTO invitation_attribute (attribute_id,attribute_value,product_id,form_id,video_url)VALUES("'+attr_item+'", "'+attribute_set[item].attribute[attr_item]+'","'+res.insertId+'","'+attribute_set[item].form_id+'","'+attribute_set[item].video_link+'") ', cope, function (err, res2) { 
                    if(err){
                      console.log(err)
                    }
                  });      
                })
              }) 
            })
            return res.json(result);
          })
        })
        
          
      }
      });
      //res.send('received the data.');
    });

    app.get('/master/getcard/:id', function(req, res, next) {
      var cope = req.body;
      var tablename = 'invitation_card';
      var id = req.params.id
      var responseData = {};
      var query = db.query('SELECT * FROM '+tablename+' where id='+id, cope, function (err,     result) {
      if (err) {
          console.error(err);
          return res.send(err);
      } else {
          if(result.length)
          {
            var query = db.query('SELECT invitation_product.product_id, invitation_product.price, invitation_attribute.form_id, invitation_attribute.video_url,  GROUP_CONCAT(`invitation_attribute`.`id` ) as attr_id, GROUP_CONCAT(`invitation_attribute`.`attribute_id` ) as attr, GROUP_CONCAT(`attribute`.`name`) as name,GROUP_CONCAT(`invitation_attribute`.`attribute_value`) as attribute_value FROM `invitation_attribute` JOIN `attribute` on attribute.id = `invitation_attribute`.`attribute_id` JOIN invitation_product ON invitation_product.id = invitation_attribute.product_id JOIN invitation_card ON invitation_card.id = invitation_product.card_id where invitation_card.id = '+id+' GROUP by invitation_attribute.product_id', cope, function (err,  attr_result) {
              if (err) {
                  console.error(err);
                  return res.send(err);
              } else {

                responseData['message'] = 'Success';
                responseData['data'] = result[0];
                responseData['response'] = 0;
                responseData['attribute'] = attr_result;
                return res.json(responseData); 
              }
            });
            
             
          }else{
            responseData['message'] = 'No Record Found';
            responseData['response'] = 1;
            return res.json(responseData);
          }
      }
      });
      //res.send('received the data.');
    });
    app.listen(8080);