import {firebaseConfig,firebaseConfigured} from './firebase-config.js';
let connection;
export function connect(){
 if(!firebaseConfigured)throw new Error('Firebase não configurado');
 return connection??=Promise.all(['app','auth','firestore'].map(s=>import(`https://www.gstatic.com/firebasejs/13.0.0/firebase-${s}.js`))).then(([a,authApi,dbApi])=>{const app=a.getApps().length?a.getApp():a.initializeApp(firebaseConfig);return {authApi,dbApi,auth:authApi.getAuth(app),db:dbApi.getFirestore(app)}});
}
