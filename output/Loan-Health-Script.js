function generateOTP() {
	const generateOTPButton = document.getElementById("generateOtp");
	// generateOTPButton.classList.remove("u-btn-step-next");
	// alert("add test");
	// generateOTPButton.classList.add("u-btn-step-next");
} 

function verifyOTP() {
	const verifyOTPButton = document.getElementById("verifyOtp");
}

function viewResults(viewResultButton) {
	viewResultButton.classList.remove("u-btn-submit");
	viewResultButton.classList.remove("u-btn-step-next");
	const interestRateNumberPattern = /^\d+(\.\d+)?$/;
	const principalPattern = /^\d+$/; 
	const principal = parseFloat(document.getElementById("text-7847").value);
	const annualInterestRate = parseFloat(document.getElementById("text-6839").value);

	if (!interestRateNumberPattern.test(annualInterestRate) || !principalPattern.test(principal) || isNaN(principal) || isNaN(annualInterestRate) || principal <= 0 || annualInterestRate <= 0) {
		return false;
	}
	return true;


}

function toggleVisibility() {

	const viewResultButton = document.getElementById("viewResult");
	if(viewResults(viewResultButton)) {
		viewResultButton.classList.add("u-btn-submit");
		const submissionDiv = document.getElementById("carousel_fe60");
		const thanksDiv = document.getElementById("carousel_417d");
		submissionDiv.classList.toggle("u-hidden"); // Toggles the visibility class
		thanksDiv.classList.toggle("u-hidden"); // Toggles the visibility class
		calculateMonthlyRepayment();
		calculatePotentialRepaymentAmount();
	}

	// // Show the hidden section
	// document.getElementById('sec-4977').style.display = 'block';

	// // Smooth scroll to the section
	// document.getElementById('sec-4977').scrollIntoView({ behavior: 'smooth' });

	// document.getElementById('sec-4976').style.display = 'none';
	// document.getElementById('sec-4977').style.display = 'block';
	


}

function calculateMonthlyRepayment() {
	// Get values from the input fields
	const principal = parseFloat(document.getElementById("text-7847").value);
	const annualInterestRate = parseFloat(document.getElementById("text-6839").value);
	const loanTermYears = 30;  // Fixed loan term of 30 years

	
	// Validate input values
	if (isNaN(principal) || isNaN(annualInterestRate) || principal <= 0 || annualInterestRate <= 0) {
			alert("Please enter valid numbers for loan amount and interest rate.");
			return;
	}
	
	// Convert annual interest rate to monthly and calculate the number of payments
	const monthlyInterestRate = annualInterestRate / 100 / 12;
	const numberOfPayments = loanTermYears * 12;

	// Calculate the monthly repayment using the loan amortization formula
	const monthlyRepayment = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
													 (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

	
	// Display the monthly repayment rounded to two decimal places
	document.getElementById("monthlyRepayment").textContent = `${formatCurrency(monthlyRepayment.toFixed(2))}/month`;
	return monthlyRepayment;
}


function calculatePotentialRepaymentAmount() {

	// Get values from the input fields
	const principal = parseFloat(document.getElementById("text-7847").value);
	const annualInterestRate = 5.79;
	const loanTermYears = 30;  // Fixed loan term of 30 years
	
	// Validate input values
	if (isNaN(principal) || isNaN(annualInterestRate) || principal <= 0 || annualInterestRate <= 0) {
			alert("Please enter valid numbers for loan amount and interest rate.");
			return;
	}
	
	// Convert annual interest rate to monthly and calculate the number of payments
	const monthlyInterestRate = annualInterestRate / 100 / 12;
	const numberOfPayments = loanTermYears * 12;

	// Calculate the monthly repayment using the loan amortization formula
	let potentialMonthlyRepayment = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
													 (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
	

		const monthlyRepayment = calculateMonthlyRepayment();
		const monthlySavings = monthlyRepayment - potentialMonthlyRepayment;
    const yearlySavings = monthlySavings > 0 ? monthlySavings * 12 : 0;

    if (yearlySavings > 0) {
        document.getElementById("savingsAmount").textContent = `$${yearlySavings.toFixed(2)}/year`;
    } else {
        // If there are no savings
				document.getElementById("savingsAmount").textContent = `$0/year`;
				alert(potentialMonthlyRepayment);
				alert(monthlyRepayment);
				potentialMonthlyRepayment = monthlyRepayment
				alert(potentialMonthlyRepayment);
    }
    
		// Set potential repayment to monthly repayment if it's higher
    document.getElementById("monthlyPotentialRepayment").textContent = `${formatCurrency(potentialMonthlyRepayment.toFixed(2))}/month`;
		const totalSavings = yearlySavings + 3000 + 2000;
    document.getElementById("totalSavingsAmount").textContent = `Total Potential Savings: ${formatCurrency(totalSavings.toFixed(2))}*`;

}

function formatCurrency(amount) {
	return `$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}