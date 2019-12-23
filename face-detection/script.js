const imgup = document.getElementById("imgup")

Promise.all([
faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
faceapi.nets.faceExpressionNet.loadFromUri('/models'),
faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(start)

function start(){
	const container = document.createElement('div');
	container.style.position = 'relative';
	document.body.append(container);
	document.body.append('Model loaded');
	let image;
	let canvas;
	imgup.addEventListener('change', async () => {
		if (image) image.remove();
		if (canvas) canvas.remove();
		image = await faceapi.bufferToImage(imgup.files[0])
		container.append(image);
		canvas = faceapi.createCanvasFromMedia(image);
		container.append(canvas);
		const dispsize = { width : image.width, height : image.height};
		faceapi.matchDimensions(canvas,dispsize);
		const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptors();
		const resizedDetections = faceapi.resizeResults(detections,dispsize);
		resizedDetections.forEach(detection => {
			const box = detection.detection.box;
			const agge = Math.round(detection.age);
			const drawbox = new faceapi.draw.DrawBox(box, {label : detection.gender +' age:'+ agge });
			drawbox.draw(canvas);
			faceapi.draw.drawFaceExpressions(canvas, detection);
		})
	})
}