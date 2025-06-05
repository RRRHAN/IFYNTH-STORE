include .env

ssh:
	ssh ${VPS_USER}@${VPS_IP}

upload-env:
	scp .env ${VPS_USER}@${VPS_IP}:~/IFYNTH-STORE/.env

upload-model:
	scp ./image-classifier/image_classifier.keras ${VPS_USER}@${VPS_IP}:~/IFYNTH-STORE/ai/image_classifier.keras
	scp ./image-classifier/classes.json ${VPS_USER}@${VPS_IP}:~/IFYNTH-STORE/ai/classes.json