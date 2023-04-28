import {auth} from '/auth.js'

export function getKortforsyningstoken() {
	return auth.kftoken;
}

export function getDatafordelerensUseridPw() {
	
	let url= new URL(window.location.href); 
	const query = url.searchParams;
	//console.log('hostparameter: ' + query.get('host'));
  
	const username= query.get('username');
	const password= query.get('password');
	if (username && password) {
		auth.dafusername= username;
		auth.dafpassword= password;
	}
	return `username=${auth.dafusername}&password=${auth.dafpassword}`;
}