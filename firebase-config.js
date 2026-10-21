// Configuração pública do aplicativo Firebase. Nunca coloque segredos de pagamento aqui.
export const firebaseConfig = { apiKey:'', authDomain:'', projectId:'', storageBucket:'', appId:'' };
export const firebaseConfigured = Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);
