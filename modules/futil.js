import {auth} from '/auth.js'

export function getKortforsyningstoken() {
	return '8e80645d3ed3b69f82016441786af134';
}

export function getDatafordelerensUseridPw() {
	return `username=${auth.dafusername}&password=${auth.dafpassword}`;
}