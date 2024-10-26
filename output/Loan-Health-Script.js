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
	calculateMonthlyRepayment();
	calculatePotentialRepaymentAmount();

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
	document.getElementById("monthlyRepayment").textContent = `$${monthlyRepayment.toFixed(2)}/month`;
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
	const potentialMonthlyRepayment = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
													 (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
	

		const monthlyRepayment = calculateMonthlyRepayment();
		const monthlySavings = monthlyRepayment - potentialMonthlyRepayment;
    const yearlySavings = monthlySavings > 0 ? monthlySavings * 12 : 0;
		alert(monthlySavings)

		document.getElementById("monthlyPotentialRepayment").textContent = `$${potentialMonthlyRepayment.toFixed(2)}/month`;


    if (yearlySavings > 0) {
        document.getElementById("savingsAmount").textContent = `By refinancing you could save up to $${yearlySavings.toFixed(2)}/year`;
    } else {
        // If there are no savings
        document.getElementById("savingsAmount").textContent = "Your are on the cheapest loan possible, we could discuss about potential cashback options";
        
        // Set potential repayment to monthly repayment if it's higher
        document.getElementById("potentialRepayment").textContent = `Potential Repayment: $${monthlyRepayment.toFixed(2)}`;
    }


	
}
