var express=require("express");
var path=require("path");
var http=require("http");
var bodyParser=require("body-parser");
var MongoClient=require("mongodb").MongoClient;
var cookieParser=require("cookie-parser");
var ObjectId=require("mongodb").ObjectId;
const helpers = require('./helpers');
const nodemailer = require('nodemailer');
var fs=require('fs');
var url1 = require("url");
// var urlobj = require("urlobj");
var Math = require("math");

const { User } = require("parse");
// const { name } = require("ejs");
// var Url = require('url-parse');
// var Parse = require('parse');
// // var parse=require("ejs")

var app=express();
var server=http.createServer(app);
app.use(bodyParser.urlencoded({extended: false}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));
app.set(express.static(path.join(__dirname, ('/public'))));
app.use(cookieParser());
var email, username, password, mobile, age, gender, address, email_login, password_login, admin_email, admin_password, name_doctor, specialization,  date, Reason, time, doctorlist, doctor, reason, profileid, fees, username1, username_patient, status,announcements



var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);



let transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	service : 'Gmail',
	
	auth: {
		user: 'minalmayekar30@gmail.com',
		pass: 'minal30&!',
	}
	
});


app.get("/", function(_req, res){
	res.sendFile(path.join(__dirname, './views/index.html'));
});

app.get("/login_admin", (req, res, next)=>{
	// var userid=req.cookies["userid"];
	// if(userid!=null && userid!=""){
	// 	res.redirect("/profile_admin");
	// }else{
	res.render("login_admin", {responseMessage: ''});
	// }
});

// app.post("/login_admin", function(req, res, next){
// 	admin_email=req.body.email;
// 	console.log(admin_email);
// 	admin_password=req.body.password;

// 	var url="mongodb://localhost:27017";

// 	MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
// 		if(err) throw err;
// 		var dbo=db.db("minal");

// 		var obj={

// 			email: admin_email,
// 			password: admin_password

// 		};
// 		if(admin_email == 'doctor@gmail.com'){
// 			if(admin_password == 'myAppo'){
// 				//dbo.collection("admin_data").insert(obj, function(req, data){
// 					//console.log(obj);
// 					res.redirect("/profile_admin")

// 				//});	
// 					//res.send("<h1>Logged In</h1>");
// 				}else{
// 					res.render('login_admin', {responseMessage : 'wrong'});
// 				}
// 			}
// 		});
// 	});

app.post("/login_admin", function(req, res, next){
	//check the credentials
	var admin_email=req.body.email;
	var admin_password=req.body.password;
	const obj1 = JSON.parse(JSON.stringify(req.body));
	console.log(obj1);
	
	var url="mongodb://localhost:27017/";
	
	MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
		if(err) throw err;
		var dbo=db.db("minal");
		dbo.collection("admin_data").find({email: admin_email, password: admin_password}).toArray(function(err, data){
			console.log(data);
			if(data.length!=0){
				
				//if right, then store in cookies and redirect user to profile
				res.cookie("userid", data[0]._id, {expire: Date.now()+36000});
				res.redirect("/profile_admin");
				db.close();
			}else{
				//else show error
				res.render("login_admin", {responseMessage : "wrong"});
				db.close();
			}
		});
	});
});

app.get("/login", function(req, res, next){
	// var userid=req.cookies["userid"];
	// if(userid!=null && userid!=""){
	// 	res.redirect("/profile");
	// }else{
	res.render("login", {responseMessage: ''});
	// }
});



app.post("/login", function(req, res, next){
	//check the credentials
	var email_login=req.body.email;
	var password_login=req.body.password;
	const obj1 = JSON.parse(JSON.stringify(req.body));
	console.log(obj1);
	
	var url="mongodb://localhost:27017/";
	
	MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
		if(err) throw err;
		var dbo=db.db("minal");
		dbo.collection("users").find({email: email_login, password: password_login}).toArray(function(err, data){
			console.log(data);
			// var username_patient = data[0].username;
			if(data.length!=0){
				
				//if right, then store in cookies and redirect user to profile
				res.cookie("userid", data[0]._id, {expire: Date.now()+36000});
				res.redirect("/profile");
				db.close();
			}else{
				//else show error
				res.render("login", {responseMessage : "wrong"});
				db.close();
			}
		});
	});
});


app.get("/register", function(req, res){
	var userid=req.cookies["userid"];
	if(userid!=null && userid!=""){
		res.redirect("/profile");
	}else{
		res.render("register", {responseMessage: ''});
	}
});

app.post("/register", function(req, res){
	
	email= req.body.email;
	username= req.body.username;
	password= req.body.password;
	mobile= req.body.phone;
	gender= req.body.gender;
	address= req.body.address;
	age= req.body.age;
	
	var url="mongodb://localhost:27017/";
	MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
		if(err) throw err;
		var dbo=db.db("minal");
		dbo.collection("users").find({email: req.body.email}).toArray(function(err, data){
			if(data.length!=0){
				
				res.render("register", {responseMessage : 'exists'});
				db.close();
			}else{
				var mailOptions={
					to: req.body.email,
					subject: "Otp for registration is: ",
					html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
				};
				
				transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						return console.log(error);
					}
					console.log('Message sent: %s', info.messageId);   
					console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
					
					res.redirect('/otp');
				});
			}	
		})			
		
		
		
	});
});
app.get("/profile", function(req, res){
	var userid=req.cookies["userid"];
	if(userid==null || userid==""){
		res.redirect("/login");
	}else{
		//else get the cookie information and fetch data from databased
		var url="mongodb://localhost:27017/";
		
		MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
			if(err) throw err;
			var dbo=db.db("minal");
			dbo.collection("users").find({_id: ObjectId(userid)}).toArray(function(err, data){
				dbo.collection("announcements").find().toArray(function(err, data1){
				
				var username=data[0].username;
				var email=data[0].email;
				var password=data[0].password;
				var mobile=data[0].mobile;
				var age=data[0].age;
				var gender=data[0].gender;

				var announcements=data1[0].announcements;
				
				
				res.render('profile', {
					username: username, email: email, password: password, age: age, mobile: mobile,gender:gender,users:data, details: data, announcements: announcements });
					db.close();
				});
				// 
			});
		});
		}
		
	});
	
	app.get("/profile_admin", function(req, res){
		var userid=req.cookies["userid"];
		if(userid==null || userid==""){
			res.redirect("/login_admin");
		}else{
			//else get the cookie information and fetch data from databased
			var url="mongodb://localhost:27017/";
			
			
			MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
				if(err) throw err;
				var dbo=db.db("minal");
				dbo.collection("admin_data").find({_id: ObjectId(userid)}).toArray(function(err, data){
					dbo.collection("bookappo").find({status:"Approved"}).toArray(function(err, data1){
						dbo.collection("users").find().toArray(function(err, datatotal){
							dbo.collection("users").find({gender:"Male"}).toArray(function(err, datamale){
								dbo.collection("users").find({gender:"Female"}).toArray(function(err, datafemale){
									
									
									
									var n = data1.length;
									var fees = n*300;
									
									
									var x = datamale.length;
									var y = datafemale.length;
									var z = datatotal.length;
									console.log(x);
									console.log(y);
									console.log(z);
									var male = parseFloat(((x)/(z))*100).toFixed(2);
									var female = parseFloat(((y)/(z))*100).toFixed(2);
									
									
									
									
									var admin_email=data[0].email;
									var admin_password=data[0].password;
									
									
									res.render('profile_admin', {email: admin_email, password: admin_password, fees:fees, male:male, female:female, total:n});
									db.close();
								});
							});
						});
						
					});
				});	
			});	
		}
	});
	
	app.get('/otp',function(req, res){
		res.render("otp", {responseMessage: ''});
	});	
	
	app.post('/otp', function(req, res){
		res.redirect("/register");
	})
	
	app.get('/verify', function(req, res, next){
		res.render('register', {responseMessage: ''});
	})
	
	app.post('/verify',function(req, res, next){
		var url="mongodb://localhost:27017";
		
		MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
			if(err) throw err;
			var dbo=db.db("minal");
			if(req.body.otp==otp){
				var obj={
					username: username,
					email: email,
					mobile: mobile,
					age: age,
					gender: gender,
					address: address,
					password: password
					
				};
				dbo.collection("users").insert(obj, function(req, data){
					console.log(obj);
					res.render("otp", {responseMessage : 'success'});
					db.close();					
				});
			}else{
				res.render("otp", {responseMessage : 'failed'});
			}
		});
		
	});
	
	app.post('/resend',function(req,res){
		var mailOptions={
			to: email,
			subject: "Otp for registration is: ",
			html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
		};
		
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: %s', info.messageId);   
			console.log('Preview URL: %s', nodemailer.responseMessageUrl(info));
			res.render('otp',{msg:"otp has been sent"});
			// redirect('/otp');
		});
		
	});
	
	app.get("/forgot-password", function(req, res){
		var userid=req.cookies["userid"];
		if(userid!=null && userid!=""){
			res.redirect("/profile");
		}else{
			res.render("forgot-password", {responseMessage: ''});
		}
	});
	
	app.post("/forgot-password", function(req, res, next){
		var url="mongodb://localhost:27017/";
		var email=req.body.email;
		
		MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
			if(err) throw err;
			var dbo=db.db("minal");
			dbo.collection("users").find({email:email}).forEach(function(document){
				if(document.email!=0){
					
					var mailOptions={
						to: email,
						subject: "Password",
						html: "<h3>Your Account Password Is: </h3>" + "<h1 style='font-weight:bold;'>" + document.password +"</h1>"
					};
					transporter.sendMail(mailOptions, (error, info) => {
						if (error) {
							return console.log(error);
						}
						console.log('Message sent: %s', info.messageId);
						console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
						res.render("forgot-password", {responseMessage : 'success'});
					});
				}
			});
		});
	});
	
	app.get("/list", function(req, res){
		name_doctor=name_doctor;
		specialization=specialization
		
		
		
		//else get the cookie information and fetch data from databased
		var url="mongodb://localhost:27017/";
		
		MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
			if(err) throw err;
			var dbo=db.db("minal");
			dbo.collection("doctor_data").find().toArray(function(err, data){
				//console.log(data)
				db.close();
				// if(!err){
				res.render('list', {details: data});
				// }
			});
		});
	},
	);
	
	
	app.post("/list", function(req, res){
		name_doctor=req.body.name_doctor;
		console.log(name_doctor);
		specialization=req.body.specialization;
		console.log(specialization);
		
		
		
		var url="mongodb://localhost:27017/";
		MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
			if(err) throw err;
			var dbo=db.db("minal");
			// dbo.collection("doctor_data").find().toArray(function(err, data){
			// 	if(data.length!=0){
			
			
			
			// 		res.render("list", {details : data});
			// 		db.close();
			// 	}else{
			var obj={
				name: req.body.name,
				specialization: req.body.specialization
				
				
			};
			dbo.collection("doctor_data").insert(obj, function(req, data){
				console.log(data)
				db.close();
				res.render("list", {details: data});					
			});
		});
	});
	
	
	
	app.get("/add-doctor", function(req, res){
		//var userid=req.cookies["userid"];
		//if(userid!=null && userid!=""){
		//res.redirect("/list");
		//}else{
		res.render("add-doctor", {responseMessage: ''});
		//}
	});
	app.post("/add-doctor", function(req, res){
		var name_doctor=req.body.name;
		var specialization=req.body.specialization;
		
		var url = "mongodb://localhost:27017/";  
		MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) { 
			var dbo = db.db("minal"); 
			if (err) throw err;  
			dbo.collection("doctor_data").insertOne( {
				name_doctor: req.body.name,
				specialization: req.body.specialization,
				
			})
			if (!err){
				res.redirect("/list");
			}
			// function(err) {
			// 	if (err) throw err;  
			// 	res.redirect("/list");
			// 	res.end();
			
			// });
			
		}); 
	});
	
	app.get("/book-appointment", function(req, res){
		var userid=req.cookies["userid"];
		// name_doctor=name_doctor;
		// specialization=specialization;
		// status=status;
		urlparam = url1.parse(req.url, true);
		bookid = urlparam.query.id;
		var url = "mongodb://localhost:27017/";  
		
		doctorlist=[];
		
		MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) { 
			if (err) throw err ;
			var dbo=db.db("minal");
			dbo.collection("doctor_data").find().toArray(function(err,data){
				dbo.collection("users").find({_id:ObjectId(bookid)}).toArray(function(err,data1){	
					dbo.collection("bookappo").find({username: data1[0].username}).toArray(function(err,data2){
						// console.log(data1.username);
						if(!err){
							res.render("book-appointment", {doctorlist:data , username:data1[0].username, details: data2})
						}
					});
				});
			});
			// res.render("book-appointment", {doctorlist: alldoctors})
			
		})
		// // if(userid!=null && userid!=""){
		// // 	res.redirect("/profile");
		// // }else{
		// 	var doctorlist=[];
		// 	var url="mongodb://localhost:27017/";
		// 	MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
		// 		if(err) throw err;
		// 		// else{
		
		
		// 			var dbo=db.db("minal");	
		// 			dbo.collection("bookappo").find().toArray(function(err,data){	
		// 			if(!err){
		// 			// else{
		// 			// 	if(data.length!=0)
		// 			// 	{
		
		// 					res.render("book-appointment", {doctorlist: data});
		
		
		
		// 			}
		// 		})
		
		
		// 	})
		// })
		
		
		
		
		
		// }else
		// res.render("book-appointment",{doctorlist:""});
		
		
		
		
		// }
		
		// 	})
		
		
		// 			}
		// })	
		// res.render("book-appointment", {responseMessage: ''});
		
	});
	
	app.post("/book-appointment", function(req, res){
		var reason=req.body.reason;
		console.log(reason);
		var date=req.body.date;
		console.log(date);
		var time=req.body.time;
		console.log(time);
		var doctor=req.body.doctor;
		console.log(doctor);
		var status=req.body.status;
		console.log(status);
		var username=req.body.username;
		console.log(username);
		// var doctorlist=req.body.doctorlist
		
		
		
		var url="mongodb://localhost:27017/";
		MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
			var dbo=db.db("minal");
			// if(err) throw err;dbo.collection("bookappo").insertOne( {
			// 	reason: req.body.reason,
			// 	date: req.body.date,
			// 	time: req.body.time
			
			// },
			
			// dbo.collection("bookappo").find({reason: req.body.reason}).toArray(function(err, data){
			// 	if(data.length!=0){
			
			
			
			// 		res.render("book-appointment", {responseMessage : 'exists'});
			// 		db.close();
			// 	}else{
			var obj={
				username:req.body.username,
				reason: req.body.reason,
				date: req.body.date,
				time: req.body.time,
				doctor:req.body.doctor,
				status:req.body.status,
				
				
				
			};
			dbo.collection("bookappo").insertOne(obj, function(req, data){
				
				
				db.close();
				res.render("appo-status", {reason:reason, date:date, time:time, username:username, doctor:doctor, status:status});					
			});
		})
	});
	
	
	
	app.get("/appo-status", function(req, res){
		var userid=req.cookies["userid"];
		// if(userid==null || userid==""){
		// 	res.redirect("/profile");
		// }else{
		//else get the cookie information and fetch data from databased
		
		urlparam = url1.parse(req.url, true);
		appoid = urlparam.query.id;
		console.log(appoid);
		var url="mongodb://localhost:27017/";
		
		MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
			if(err) throw err;
			var dbo=db.db("minal");
			dbo.collection("users").find({_id: ObjectId(userid)}).toArray(function(err, data1){
				
				console.log(data1);
				var username1 = data1[0].username;
				console.log(username1);
				// var obj= {
				// 	username: username1
				// }
				dbo.collection("bookappo").find({username:username1}).toArray(function(err, data) {
					console.log(data);
					if(!err){
						
						// var username = data.username;
						var reason = data[0].reason;
						console.log(reason);
						var time = data[0].time;
						console.log(time);
						var date = data[0].date;
						console.log(date);
						var doctor = data[0].doctor;
						console.log(doctor);
						var status = data[0].status;
						console.log(status);
						
						
						
						res.render('appo-status', {reason: reason, time: time, date: date, doctor: doctor,username:data1[0].username,details:data, status: status});
						db.close();
						
					}
					
				});
			});
		});		
		// }
	});
	
	
	
	
	app.get("/doctor-update", function(req, res){
		var url="mongodb://localhost:27017/";
		urlparam = url1.parse(req.url, true);
		doctorid = urlparam.query.id;
		console.log(doctorid)
		MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
			if(err) throw err;
			else{
				let dbo = db.db("minal")
				dbo.collection("doctor_data").find({_id:ObjectId(doctorid)}).toArray(function(err,data){
					if (err) throw err
					else{
						if(data.length!=0)
						{
							res.render("doctor-update", {message:
								{name:data[0].name_doctor, specialization:data[0].specialization}})
							}
							else
							res.render("doctor-update", {message:""});
						}
					});
					
				}
				
			});
			
			
			
		});					
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		app.post("/doctor-update", function(req, res){
			var name_doctor=req.body.name;
			var specialization=req.body.specialization;
			var url="mongodb://localhost:27017/";
			let query={
				_id:ObjectId(doctorid)
			}
			MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
				
				var dbo=db.db("minal");
				if(err) throw err;
				let docobj = {
					$set:{
						name_doctor: req.body.name,
						specialization: req.body.specialization
					}
				}
				dbo.collection("doctor_data").updateOne(query, docobj, function(err, docs){
					if (!err){res.redirect("/list"); }
					else{
						if (err, name == "ValidationError") {
							handleValidationError( err, req.body);
							res.render("list.ejs", {
								viewTitle: "Update Doctor Details",
								doctor: docobj
							});
						}else{
							console.log("Error during record period : " + err);
						}
					}
				});
				// dbo.collection("doctor_data").insertOne( {
				// 	name_doctor:req.body.name,
				// 	specialization:req.body.specialization
				// })
				// if (!err){
				// 	res.redirect("/list")
				// }
			});
		});
		
		app.get("/doctor-delete/:id", function(req, res){
			var url="mongodb://localhost:27017/";
			let id = req.params.id;
			console.log(req.params.id)
			MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
				if(err) throw err;
				var dbo=db.db("minal");
				// Doctor.findByIdAndRemove(doctorId).then(( ) => {
				// 	res.render("/list");
				// 	next();
				// })
				dbo.collection("doctor_data").deleteOne({_id: ObjectId(req.params.id)}, function(err, data){
					if (!err) {
						res.redirect("/list");
						
					}
					else{ console.log("Error in doctor delete :" + err); }
				});
				
			});
		});
		
		app.get("/profile-edit", function(req, res){
			var url="mongodb://localhost:27017/";
			urlparam = url1.parse(req.url, true);
			profileid = urlparam.query.id;
			// console.log(profileid)
			
			MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
				if(err) throw err;
				else{
					let dbo = db.db("minal")
					
					dbo.collection("users").find({_id:ObjectId(profileid)}).toArray(function(err,data){
						
						if (err) throw err
						
						else{
							if(data.length!=0)
							{
								// var profileid = data[0].id
								res.render("profile-edit", {message:
									{ username:data[0].username, password:data[0].password, mobile:data[0].mobile, age:data[0].age, email:data[0].email, gender:data[0].gender}})
								}
								else
								res.render("profile-edit", {message:""});
							}
						});
						
					}
					
				});
				
				
				
			});	
			app.post("/profile-edit", function(req, res){
				var username=req.body.username;
				var mobile=req.body.mobile;
				var password=req.body.password;
				var age=req.body.age;
				var email=req.body.email;
				var gender=req.body.gender;
				var url="mongodb://localhost:27017/";
				let query={
					_id:ObjectId(profileid)
				}
				
				MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
					
					var dbo=db.db("minal");
					if(err) throw err;
					let docobj = {
						$set:{
							username: req.body.username,
							mobile: req.body.mobile,
							password: req.body.password,
							age: req.body.age,
							email: req.body.email,
							gender:req.body.gender
						}
					}
					dbo.collection("users").updateOne(query, docobj, function(err, docs){
						// if (!err){res.redirect("/profile"); }
						// else{
						// 	if (err, name == "ValidationError") {
						// 		handleValidationError( err, req.body);
						res.render("profile-updated.ejs", {message:
							{ username:username, password:password, mobile:mobile, age:age, email:email, gender:gender, detail:docs}})
						})
						// {
						
						// 	viewTitle: "Update Patients Details",
						// 	profile: docobj
						// });
						// }else{
						// 	console.log("Error during record period : " + err);
						// }
						// }
					});
					
				});
				// });
				
				app.get("/doctors-appo", function(req, res){
					var url="mongodb://localhost:27017/";
					name_doctor=name_doctor;
					MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) { 
						if (err) throw err ;
						var dbo=db.db("minal");
						dbo.collection("doctor_data").find().toArray(function(err,data){	
							if(!err){
								res.render("doctors-appo", {doctorlist:data })
							}
						})
						// res.render("book-appointment", {doctorlist: alldoctors})
						
					})
					
				})
				
				
				app.post("/doctors-appo", function(req, res){
					let doctor=req.body.doctor
					var url="mongodb://localhost:27017/";
					MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
						if(err) throw err;
						var dbo=db.db("minal");
						
						dbo.collection("users").find().toArray(function(err, docs){
							dbo.collection("doctor_data").find().toArray(function(err, docdata){
								dbo.collection("bookappo").find({doctor:doctor}).toArray(function(err, data){
									
									if (err) throw err;
									else
									{
										res.render("doctor-confirmation",{ doctorlist: docdata,  patientdata:data});
									}
								});
							});
						});
					});
				});
				// })
				// })
				
				app.get("/doctor_approve", function(req, res){
					var url="mongodb://localhost:27017/";
					urlparam = url1.parse(req.url, true);
					bookappo_id = urlparam.query.id;
					console.log(bookappo_id)
					MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
						if(err) throw err;
						else{
							let dbo = db.db("minal")
							dbo.collection("bookappo").find({_id:ObjectId(bookappo_id)}).toArray(function(err,data){
								dbo.collection("doctor_data").find().toArray(function(err, data1){
									dbo.collection("users").find().toArray(function(err, data2){
										// res.redirect("/doctors-appo")
										// if (err) throw err
										// else{
										// 	if(data.length!=0)
										{
											res.render("doctor_approve", {patientdata : data, doctorlist: data1, patientname:data2})
										}
									});
									// else
									// res.render("doctor-update", {message:""});
								});
							});
							// });
							
						}
						
					});
					
					
					
				});					
				
				app.post("/doctor_approve", function(req, res){
					// urlparam = url1.parse(req.url, true);
					// bookappo_id = urlparam.query.id;
					var url="mongodb://localhost:27017/";
					let query={
						_id:ObjectId(bookappo_id)
					}
					MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
						
						var dbo=db.db("minal");
						if(err) throw err;
						let docobj = {
							$set:{
								status:"Approved"
							}
						}
						
						dbo.collection("bookappo").updateOne(query, docobj, function(err, docs){
							
							dbo.collection("doctor_data").find().toArray(function(err, data1){
								// dbo.collection("status").insertOne
								
								
								// if (!err){res.redirect("/list"); }
								// else{
								// 	if (err, name == "ValidationError") {
								// 		handleValidationError( err, req.body);
								res.render("doctors-appo", {
									// viewTitle: "Update Doctor Details",
									doctorlist: data1
								});
								// }else{
								// 	console.log("Error during record period : " + err);
							});
						});
						
						// 	}
						// });
						// dbo.collection("doctor_data").insertOne( {
						// 	name_doctor:req.body.name,
						// 	specialization:req.body.specialization
						// })
						// if (!err){
						// 	res.redirect("/list")
						// }
					});
				});
				
				
				
				app.get("/doctor_decline", function(req, res){
					var url="mongodb://localhost:27017/";
					urlparam = url1.parse(req.url, true);
					bookappo_id = urlparam.query.id;
					console.log(bookappo_id)
					MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
						if(err) throw err;
						else{
							let dbo = db.db("minal")
							dbo.collection("bookappo").find({_id:ObjectId(bookappo_id)}).toArray(function(err,data){
								dbo.collection("doctor_data").find().toArray(function(err, data1){
									dbo.collection("users").find().toArray(function(err, data2){
										// res.redirect("/doctors-appo")
										// if (err) throw err
										// else{
										// 	if(data.length!=0)
										{
											res.render("doctor_decline", {patientdata : data, doctorlist: data1, patientname:data2})
										}
									});
									// else
									// res.render("doctor-update", {message:""});
								});
							});
							// });
							
						}
						
					});
					
					
					
				});					
				
				app.post("/doctor_decline", function(req, res){
					// urlparam = url1.parse(req.url, true);
					// bookappo_id = urlparam.query.id;
					var url="mongodb://localhost:27017/";
					let query={
						_id:ObjectId(bookappo_id)
					}
					MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
						
						var dbo=db.db("minal");
						if(err) throw err;
						let docobj = {
							$set:{
								status:"Declined"
							}
						}
						
						dbo.collection("bookappo").updateOne(query, docobj, function(err, docs){
							dbo.collection("doctor_data").find().toArray(function(err, data1){
								
								
								// if (!err){res.redirect("/list"); }
								// else{
								// 	if (err, name == "ValidationError") {
								// 		handleValidationError( err, req.body);
								res.render("doctors-appo", {
									// viewTitle: "Update Doctor Details",
									doctorlist: data1
								});
								// }else{
								// 	console.log("Error during record period : " + err);
							});
						});
						
						
					});
				});
				
				app.get("/announcements", function(req, res){
					// var userid=req.cookies["userid"];
					// name_doctor=name_doctor;
					// specialization=specialization;
					// status=status;
					// urlparam = url1.parse(req.url, true);
					// bookid = urlparam.query.id;
					var url = "mongodb://localhost:27017/";  
					
					patientlist=[];
					
					MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) { 
						if (err) throw err ;
						var dbo=db.db("minal");
						
						dbo.collection("users").find().toArray(function(err,data1){
							res.render("announcements", {patientlist:data1})
						});
					});
				});


				app.post("/announcements", function(req, res){
					var url = "mongodb://localhost:27017/"; 
					var obj={
						announcements:req.body.announcements,
						// patient:req.body.patient,
					}

					MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
						var dbo=db.db("minal");
						dbo.collection("announcements").insertOne(obj, function(req, data){
							console.log("data inserted succesfully");
							// dbo.collection("users").find().toArray(function(err,data1){
							// res.render("profile", { announcements:announcements})
							res.redirect("/profile_admin")

						});
					});
				// });
				});
							



						


				
				
				
				
				
				app.get("/logout", function(req, res){
					res.clearCookie("userid");
					res.redirect("/login");
				});
				
				app.get("/logout_admin", function(req, res){
					res.clearCookie("userid");
					res.redirect("/login_admin");
				});
				server.listen(3000);