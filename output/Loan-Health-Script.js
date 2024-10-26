function toggleVisibility() {
	// // Show the hidden section
	// document.getElementById('sec-4977').style.display = 'block';

	// // Smooth scroll to the section
	// document.getElementById('sec-4977').scrollIntoView({ behavior: 'smooth' });

	// document.getElementById('sec-4976').style.display = 'none';
	// document.getElementById('sec-4977').style.display = 'block';
	const submissionDiv = document.getElementById("carousel_fe60");
	const thanksDiv = document.getElementById("carousel_417d");
	submissionDiv.classList.toggle("u-hidden"); // Toggles the visibility class
	thanksDiv.classList.toggle("u-hidden"); // Toggles the visibility class

}