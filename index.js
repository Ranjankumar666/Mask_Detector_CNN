/**
 * @type {HTMLVideoElement}
 */
const videoElement = document.querySelector('.video_cam');
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector('.canvas');
const photo = document.querySelector('.captured_image');
const capture = document.querySelector('.capture');
const result = document.querySelector('.result');

const clearImage = () => {
	const ctx = canvas.getContext('2d');
	ctx.fillStyle('#aaa');
	ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const takeImage = () => {
	const ctx = canvas.getContext('2d');
	ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
};

const main = async () => {
	const model = await tf.loadLayersModel('./ml_model/model.json');

	const stream = await navigator.mediaDevices.getUserMedia({
		video: true,
	});

	videoElement.srcObject = stream;
	videoElement.play();

	capture.addEventListener('click', () => {
		takeImage();
		let data = tf.browser.fromPixels(canvas).div(255);
		data = data.reshape([1, ...data.shape]);

		const pred = model.predict(data).dataSync();

		result.textContent = pred[0] <= 0.5 ? 'No Mask' : 'Mask';
	});
};

main()
	.then(() => {
		console.log('App Started');
	})
	.catch((err) => {
		console.log('Error:', err.message);
	});
