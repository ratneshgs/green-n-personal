<?php

/*
// if you need to debug you can uncomment this code
ini_set('display_errors',1);
error_reporting(E_ALL);
mysqli_report(MYSQLI_REPORT_ALL);
*/

/*
	-- import sql query to your database

	CREATE DATABASE contacts;
	USE contacts;

	CREATE TABLE contact_data (
	    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	    name VARCHAR(100),
	    email VARCHAR(100),
	    subject VARCHAR(100),
	    message TEXT,
	    crdate INT(11)
    );

*/

/**
 * [Connect to the database]
 * @author  Hardik Satasiya
 * @since   2016-09-19T15:42:52+0530
 * @version 1.1
 */
function Connect()
{
	$dbhost = "localhost";
	$dbuser = "root";
	$dbpass = "root";
	$dbname = "contacts";

 // Create connection
	$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname) or die($conn->connect_error);

	return $conn;
}

// sender details
$email_from = "yoursite@email.com";

// test data
/*
$_POST['name'] = 'some name';
$_POST['email'] = 'testmail@email.com';
$_POST['subject'] = 'test subject';
$_POST['message'] = 'message';
*/

// if set contact then only add message
if(isset($_POST['contact'])) {

	// connect to db
	$conn = Connect();
	$name = $email = $subject = $message = '';
	$time = time();

	// prepare and bind
	$stmt = $conn->prepare("INSERT INTO contact_data (name, email, subject, message, crdate) VALUES (?, ?, ?, ?, ?)");
	$stmt->bind_param('ssssd', $name, $email, $subject, $message, $time);

	// binding values
	$name = $_POST['name'];
	$email = $_POST['email'];
	$subject = $_POST['subject'];
	$message = $_POST['message'];

	// execting query
	$success = $stmt->execute();

	// closing connection
	$stmt->close();
	$conn->close();

	// sending mail to the contact person
	$email_to = $email;
	$email_subject = $subject;
	$email_message = 'Hello ' . $name . ',';
	$email_message .= "<br/><br/>";
	$email_message .= "We have received your message, we will contact you shortly.<br/><br/>";
	$email_message .= "Message : <br/>" . $message . "<br/><br/>";
	$email_message .= "Thank you.";

	//$message;
	$headers = 'From: ' . $email_from . "\r\n" .
	'Reply-To: ' . $email_from . "\r\n" .
	'Content-type:text/html;charset=UTF-8' . "\r\n" .
	'X-Mailer: PHP/' . phpversion();
	@mail($email_to, $email_subject, $email_message, $headers);
	/*
	// please uncomment this code if admin wish to receive messages as well
	// fill admin email address to receive mail on admin address
	// sending mail to the admin/site owner
	$admin_email = 'siteadmin@email.com';
	@mail($admin_email, $email_subject, $email_message, $headers);
	*/

}

// redirecting to the sucess page
header('Location: ' . 'thank-you.html');