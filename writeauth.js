// dan autentifikation fil

const fs = require('fs');
 
async function main() {
  let auth= {};
  auth.dafusername= process.env.dafusername;
  auth.dafpassword= process.env.dafpassword;
  auth.kftoken= process.env.kftoken;
  auth.host= process.env.host;
  console.log(`dafusername= ${auth.dafusername}`);
  console.log(`kftoken= ${auth.kftoken}`);
  let tekst= JSON.stringify(auth);
  fs.writeFileSync('auth.js','export var auth =' + tekst);
}

main();