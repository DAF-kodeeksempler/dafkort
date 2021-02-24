import {auth} from '/auth.js'

export function getKortforsyningstoken() {
	return auth.kftoken;
}

export function getDatafordelerensUseridPw() {
	return `username=${auth.dafusername}&password=${auth.dafpassword}`;
}