<?php
// Require connection information and PHPMailer 1
require_once('email_config.php');
require('php_mailer/PHPMailer/PHPMailerAutoload.php');

// // Validate POST inputs
$message = [];  // <-- where we store the SANITIZED DATA

$output = [
    'success' => null,
    'messages' => []
];

// // Sanitize name field 
$message['name'] = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
if(empty($message['name'])){
    $output['success'] = false;
    $output['messages'][] = 'missing name key';
}

// // Validate name field
$message['email'] = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
if(empty($message['email'])){
    $output['success'] = false;
    $output['messages'][] = 'invalid email key';
}

// // Sanitize message field
$message['message'] = filter_var($_POST['message'], FILTER_SANITIZE_STRING);
if(empty($message['message'])){
    $output['success'] = false;
    $output['messages'][] = 'missing message key';
}

// // Sanitize subject
// $message['subject'] = filter_var($_POST['subject'], FILTER_SANITIZE_STRING);
// if(empty($message['subject'])){   <-- subject not necessarily required (up to you to require a subject or even have a subject field )
//     $output['success'] = false;
//     $output['messages'][] = 'missing subject key';
// }

// // Sanitize phone number
// $message['phone'] = preg_replace('/[^0-9]/','',$_POST['phone_number']);
// if(empty($message['phone']) && count($message['phone']) >= 10 && count($message['phone']) <= 11){
//     $output['success'] = false;
//     $output['messages'][] = 'missing phone key';
// }

if($output['success'] !== null){
    http_response_code(422);  // <-- 422 is 'unprocessable entity'
    echo json_encode($output);
    exit();
}

// Set up email object


$mail = new PHPMailer;
$mail->SMTPDebug = 3;           // Enable verbose debug output. Change to 0 to disable debugging output.

$mail->isSMTP();                // Set mailer to use SMTP.
$mail->Host = 'smtp.gmail.com'; // Specify main and backup SMTP servers.
$mail->SMTPAuth = true;         // Enable SMTP authentication

$mail->Username = EMAIL_USER;   // SMTP username
$mail->Password = EMAIL_PASS;   // SMTP password
$mail->SMTPSecure = 'tls';      // Enable TLS encryption, `ssl` also accepted, but TLS is a newer more-secure encryption
$mail->Port = 587;              // TCP port to connect to (default port)
$options = array(               // $options is what Gmail needs or else it won't accept it
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    )
);
$mail->smtpConnect($options);


$mail->From = $message['email'];  // sender's email address (shows in "From" field)
$mail->FromName = $message['name'];   // sender's name (shows in "From" field)
$mail->addAddress(EMAIL_TO_ADDRESS, EMAIL_USERNAME);  // Add a recipient



$mail->addReplyTo($message['email'], $message['name']);                          // Add a reply-to address

$mail->isHTML(true);                                  // Set email format to HTML


// Only necessary if no subject provided (next two lines of code. either /or )
$message['subject'] = $message['name'] . " has sent you a message on your portfolio!";
// OR
$message['subject'] = substr($message['message'], 0, 78);

$mail->Subject = $message['subject'];

$message['message'] = nl2br($message['message']); // Convert newline characters to line break html tags 
$mail->Body = $message['message'];
$mail->AltBody = htmlentities($message['message']);

// Attempt email send, output result to client

if(!$mail->send()) {
    $output['success'] = false;
    $output['messages'][] = $mail->ErrorInfo;
} else {
    $output['success'] = true;
}
echo json_encode($output);
?>



