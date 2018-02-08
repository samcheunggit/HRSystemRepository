const sgMail = require('@sendgrid/mail');
const sendGridConfig = require('../config/sendgrid');

module.exports = {
    // Reset password email template
    sendResetEmail:(emailObj, callback)=>{
        console.log("email object: ",emailObj);
        let changePasswordURL = emailObj.url+"/reset-password/"+emailObj.token
        console.log("reset password url: "+changePasswordURL);
        sgMail.setApiKey(sendGridConfig.api_key);
        sgMail.setSubstitutionWrappers('{{', '}}'); // Configure the substitution tag wrappers globally
        
        const msg = {
            to: emailObj.toUser,
            from: sendGridConfig.default_sender,
            subject: 'Reset Password',
            text: 'Reset Your Password',
            html: '<h3 style="text-align:center">Reset Your Password</h3>',
            templateId: '18364cf6-ada9-4cc4-b50c-30f2e9e5756e',
            substitutions: { changepasswordurl: changePasswordURL}
        };

        sgMail.send(msg, (error, result) => {
            callback(error, result);
        });
    },
    // Welcome email template
    sendWelcomeEmail:(emailObj, callback)=>{
        console.log("welcome email object: ",emailObj);
        let changePasswordURL = emailObj.url+"/reset-password/"+emailObj.token
        console.log("reset password url: "+changePasswordURL);
        sgMail.setApiKey(sendGridConfig.api_key);
        sgMail.setSubstitutionWrappers('{{', '}}'); // Configure the substitution tag wrappers globally
        
        const msg = {
            to: emailObj.toUser,
            from: sendGridConfig.default_sender,
            subject: 'Welcome to Lok Fu Rhenish Nursery!',
            text: 'Welcome to Lok Fu Rhenish Nursery!',
            html: '<h3 style="text-align:center">Welcome to Lok Fu Rhenish Nursery!</h3>',
            templateId: '22e19af4-57ae-4fc0-bc4d-61a20eb6bb53',
            substitutions: { changepasswordurl: changePasswordURL}
        };

        sgMail.send(msg, (error, result) => {
            callback(error, result);
        });
    }
}