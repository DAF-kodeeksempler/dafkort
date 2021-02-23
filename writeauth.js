// dan autentifikation fil

const fs = require('fs');
 
async function main() {
  let auth= {};
  auth.dafusername= process.env.dafusername;
  auth.dafpassword= process.env.dafpassword;
  console.log(`dafusername= ${auth.dafusername}`);
  let tekst= JSON.stringify(auth);
  fs.writeFileSync('auth.js','export var auth =' + tekst);
}

main();