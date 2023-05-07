/** */
const bcrypt = require('bcrypt');


/**
 * verify the email
 */
module.exports = class helper
{
    constructor(){}
    static isvalidEmail(email){
        return new Promise((resolve, reject)=>
        {
            const regex = (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?$/);    
            if (regex.test(email)) 
            {
                const domain = email.split('@')[1]; // get domain name after '@' symbol
                const domainParts = domain.split('.'); // split domain name by '.' separator
                //console.log(domainParts); // output: ['gmail', 'com', 'com']
                if(domainParts[1] === domainParts[2])
                {
                    resolve(false)
                    // console.log('Invalid Email');
                }
                else 
                {
                    resolve(true)
                    // console.log('Valid Email');
                }
            } 
            else
            {
                resolve(false)
            }

        })

    }



}
