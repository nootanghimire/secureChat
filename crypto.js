//Javascript Document

//DH Key Exchange 


/**
 * p => common prime number ; g => common base (together they form a public key) [publicly viewable]
 *
 *
 * Alice: Private Key: a (integer) [pvt]
 * Alice: Calculates A = g^a mod p [pvt]
 * Alice: Sends A to Bob [publicly viewable]
 *
 * Bob: Private Key: b (integer) [pvt]
 * Bob: Calculates B = g^b mod p [pvt]
 * Bob: Sends B to Alice [publicly viewable]
 *
 * Alice: Recieves B, has a 
 * Alice Calculates Key = B^a mod p
 * 						= (g^b mod p)^a mod p
 *
 *
 * Bob: Recieves A, has b
 * Bob Calculates Key   = A^b mod p
 *						= (g^a mod p)^b mod p
 *
 * Their Key's are equal
 *
 * For General Public : They have, p, g, A and B
 * 					  : and cannot calculate a and b, 
 *					  : if p, a, and b are considerably large
 *					  : p > 300 digits, and Safe Prime 
 *					  : a > 100 digits, and Safe Prime
 *					  : b > 100 digits, and Safe Prime
 */



 var crypto = {
	 genPrime: function(n){
	 	//Generates a Prime number of given digit. 
	 	//For now: Ignore n
	 	var arr_prime = [2,3,5,7,13,17,19,23]
	 	var prime = arr_prime[Math.floor(Math.random()*arr_prime.length)];
	 	return prime;
	 }
 }

  module.exports = crypto;

 //Server Side: 
 /**
  *
  * Server Gets a Request. Generates a Public Key, and Sends the request 
  */
