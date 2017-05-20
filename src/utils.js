// I'm quite sure I've stolen this snippet from somewhere. If it feels like
// something you've published somewhere or you recognize it somehow pls lemme
// know so I'll be able to put some credentials here. @michalbe

const fit_image_on_canvas = (image, canvas, context) => {
	const image_aspect_ratio = image.width / image.height;
	const canvas_aspect_ratio = canvas.width / canvas.height;
	let renderable_height, renderable_width, x_start, y_start;

	if (image_aspect_ratio < canvas_aspect_ratio) {

    // If image's aspect ratio is less than canvas's we fit on height
  	// and place the image centrally along width
    renderable_height = canvas.height;
		renderable_width = image.width * (renderable_height / image.height);
		x_start = (canvas.width - renderable_width) / 2;
		y_start = 0;

	} else if (image_aspect_ratio > canvas_aspect_ratio) {

  	// If image's aspect ratio is greater than canvas's we fit on width
  	// and place the image centrally along height
		renderable_width = canvas.width
		renderable_height = image.height * (renderable_width / image.width);
		x_start = 0;
		y_start = (canvas.height - renderable_height) / 2;

	} else {

    // Happy path - keep aspect ratio
		renderable_height = canvas.height;
		renderable_width = canvas.width;
		x_start = 0;
		y_start = 0;
	}

	context.drawImage(image, x_start, y_start, renderable_width, renderable_height);
};


export { fit_image_on_canvas };
