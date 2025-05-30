
const url = ( window.location.hostname.includes('localhost:') )
            ? 'http://localhost:8090/api/auth/'
            : 'http://localhost:8090/api/auth/';

const miFormulario = document.querySelector('form');

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for( let el of miFormulario.elements ) {
        if ( el.name.length > 0 ) 
            formData[el.name] = el.value
    }

    fetch( url + 'login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( resp => resp.json() )
    .then( ({ msg, token }) => {
        if( msg ){
            return console.error( msg );
        }
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch( err => {
        console.log(err)
    })
    
});

function handleCredentialResponse(response) { 
    var id_token  =  response.credential;
    const data = { id_token };
    fetch( url + 'google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( data )
    })
    .then( resp => resp.json() )
    .then( ({ token, usuario }) => {
        localStorage.setItem('token',token);
        localStorage.setItem('correo', usuario.email);
        window.location = 'chat.html';
    })
    .catch( console.log );
    
} 


function signOut() {
    localStorage.removeItem('token');
    const correo = localStorage.getItem('correo');
    localStorage.removeItem('correo');
    google.accounts.id.revoke(correo);
    console.log('consent revoked');
    google.accounts.id.disableAutoSelect();
}