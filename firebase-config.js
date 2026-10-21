// Configuração pública do aplicativo Firebase. Nunca coloque segredos de pagamento aqui.
export const firebaseConfig = {
 apiKey: 'AIzaSyA47g7qDD0Wzh_Rwjd_HsAWGFfR8eMzhq4',
 authDomain: 'entrega-de-frutas.firebaseapp.com',
 projectId: 'entrega-de-frutas',
 storageBucket: 'entrega-de-frutas.firebasestorage.app',
 messagingSenderId: '833457434899',
 appId: '1:833457434899:web:025f68ca2acda1f334eae6',
 measurementId: 'G-WER1ZD2ZFP'
};
export const firebaseConfigured = Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);
