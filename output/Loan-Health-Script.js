function generateOTP() {
	const generateOTPButton = document.getElementById("generateOtp");
	const loadingWrapper = document.getElementById("loadingWrapper");

	const mobileNumber = formatPhoneNumber(
    document.getElementById("email-5a14").value
  );
	const phonePattern = /^(\+61\d{9}|0\d{9})$/;
	
	generateOTPButton.classList.remove("u-btn-step-next");
	if (!phonePattern.test(mobileNumber)) {
    alert("Please enter a phone number.");
    return false;
  }

	// generateOTPSuccess(loadingWrapper, generateOTPButton);
	// return;
	loadingWrapper.style.display = "flex";

  const data = {
    mobileNumber: mobileNumber,
  };
  fetch(
    "https://9v4qfkzq5g.execute-api.ap-southeast-2.amazonaws.com/dev/sendotp",
    {
      method: "POST", 
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => {
			if (response.ok) {
				// If status is 200-299, proceed
				return response.json();
			} else {
				// If status is outside 200 range, throw an error
				throw new Error(`HTTP status ${response.status}`);
			}
		}) 
    .then((data) => {
			loadingWrapper.style.display = "none";
			generateOTPButton.classList.add("u-btn-step-next");
			generateOTPButton.onclick = null;
			generateOTPButton.click();
      console.log("Success:", data); 
    })
    .catch((error) => {
			loadingWrapper.style.display = "none";
      console.error("Error:", error); 
    });
}

function generateOTPSuccess(loadingWrapper, generateOTPButton){
		loadingWrapper.style.display = "none";
			generateOTPButton.classList.add("u-btn-step-next");
			generateOTPButton.onclick = null;
			generateOTPButton.click();
}

function verifyOTPSuccess(loadingWrapper, verifyOTPButton){
	verifyOTPButton.classList.add("u-btn-step-next");
			verifyOTPButton.onclick = null;
			verifyOTPButton.click();
			loadingWrapper.style.display = "none";
}
function back() {
	const generateOTPButton = document.getElementById("generateOtp");
	generateOTPButton.onclick = generateOTP;

}
function verifyOTP() {

  const verifyOTPButton = document.getElementById("verifyOtp");
	const loadingWrapper = document.getElementById("loadingWrapper");
	// verifyOTPSuccess(loadingWrapper, verifyOTPButton);
	// return;


	loadingWrapper.style.display = "flex";
	verifyOTPButton.classList.remove("u-btn-step-next");
  const mobileNumber = formatPhoneNumber(
    document.getElementById("email-5a14").value
  );
	const code = document.getElementById("text-8bd3").value;
  const data = {
    mobileNumber: mobileNumber,
		code: code
  };
  fetch(
    "https://9v4qfkzq5g.execute-api.ap-southeast-2.amazonaws.com/dev/verifyotp",
    {
      method: "POST", 
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => {
			if (response.ok) {
				// If status is 200-299, proceed
				return response.json();
			} else {
				// If status is outside 200 range, throw an error
				throw new Error(`HTTP status ${response.status}`);
			}
		}) 
    .then((data) => {
			verifyOTPButton.classList.add("u-btn-step-next");
			verifyOTPButton.onclick = null;
			verifyOTPButton.click();
			loadingWrapper.style.display = "none";
      console.log("Success:", data); 
    })
    .catch((error) => {
			loadingWrapper.style.display = "none";
			alert("Invalid OTP. Try again.");
      console.error("Error:", error); 
    });
}

function viewResults(viewResultButton) {
  viewResultButton.classList.remove("u-btn-submit");
  viewResultButton.classList.remove("u-btn-step-next");
  const interestRateNumberPattern = /^\d+(\.\d+)?$/;
  const principalPattern = /^\d+$/;
  const principal = parseFloat(document.getElementById("text-7847").value);
  const annualInterestRate = parseFloat(
    document.getElementById("text-6839").value
  );

  if (
    !interestRateNumberPattern.test(annualInterestRate) ||
    !principalPattern.test(principal) ||
    isNaN(principal) ||
    isNaN(annualInterestRate) ||
    principal <= 0 ||
    annualInterestRate <= 0
  ) {
    return false;
  }
  return true;
}

function toggleVisibility() {
  const viewResultButton = document.getElementById("viewResult");
  if (viewResults(viewResultButton)) {
    viewResultButton.classList.add("u-btn-submit");
    const submissionDiv = document.getElementById("carousel_fe60");
    const thanksDiv = document.getElementById("carousel_417d");
    submissionDiv.classList.toggle("u-hidden"); // Toggles the visibility class
    thanksDiv.classList.toggle("u-hidden"); // Toggles the visibility class
    calculateMonthlyRepayment();
    calculatePotentialRepaymentAmount();
  }
	window.scrollTo({ top: 0, behavior: 'smooth' });

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
  const annualInterestRate = parseFloat(
    document.getElementById("text-6839").value
  );
  const loanTermYears = 30; // Fixed loan term of 30 years

  // Validate input values
  if (
    isNaN(principal) ||
    isNaN(annualInterestRate) ||
    principal <= 0 ||
    annualInterestRate <= 0
  ) {
    alert("Please enter valid numbers for loan amount and interest rate.");
    return;
  }

  // Convert annual interest rate to monthly and calculate the number of payments
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  // Calculate the monthly repayment using the loan amortization formula
  const monthlyRepayment =
    (principal *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  // Display the monthly repayment rounded to two decimal places
  document.getElementById("monthlyRepayment").textContent = `${formatCurrency(
    monthlyRepayment.toFixed(2)
  )}/month`;
  return monthlyRepayment;
}

function calculatePotentialRepaymentAmount() {
  // Get values from the input fields
  const principal = parseFloat(document.getElementById("text-7847").value);
  const annualInterestRate = 5.79;
  const loanTermYears = 30; // Fixed loan term of 30 years

  // Validate input values
  if (
    isNaN(principal) ||
    isNaN(annualInterestRate) ||
    principal <= 0 ||
    annualInterestRate <= 0
  ) {
    alert("Please enter valid numbers for loan amount and interest rate.");
    return;
  }

  // Convert annual interest rate to monthly and calculate the number of payments
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  // Calculate the monthly repayment using the loan amortization formula
  let potentialMonthlyRepayment =
    (principal *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  const monthlyRepayment = calculateMonthlyRepayment();
  const monthlySavings = monthlyRepayment - potentialMonthlyRepayment;
  const yearlySavings = monthlySavings > 0 ? monthlySavings * 12 : 0;

  if (yearlySavings > 0) {
    document.getElementById(
      "savingsAmount"
    ).textContent = `${formatCurrency(yearlySavings.toFixed(2))}/year`;
  } else {
    // If there are no savings
    document.getElementById("savingsAmount").textContent = `$0/year`;
    potentialMonthlyRepayment = monthlyRepayment;
  }

  // Set potential repayment to monthly repayment if it's higher
  document.getElementById(
    "monthlyPotentialRepayment"
  ).textContent = `${formatCurrency(
    potentialMonthlyRepayment.toFixed(2)
  )}/month`;
  const totalSavings = yearlySavings + 6000;
  document.getElementById(
    "totalSavingsAmount"
  ).textContent = `Total Potential Savings: upto ${formatCurrency(
    totalSavings.toFixed(2)
  )}*`;
}

function formatCurrency(amount) {
  return `$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function formatPhoneNumber(phoneNumber) {
	// Remove any non-digit characters
	const cleanedNumber = phoneNumber.replace(/\D/g, '');

	// Check if it starts with '0'
	if (cleanedNumber.startsWith('0')) {
			// Replace the leading '0' with '+61' (Australia's country code)
			return `+61${cleanedNumber.slice(1)}`;
	}

	// If it already has a plus, return it as is
	if (cleanedNumber.startsWith('61')) {
			return `+${cleanedNumber}`;
	}

	// Return as-is if it doesn't match known patterns
	return cleanedNumber;
}

function submitLoanComparison(){
	const viewResultButton = document.getElementById("viewResult");
	viewResultButton.classList.remove("u-btn-submit");
	viewResultButton.classList.remove("u-btn-step-next");

	const loadingWrapper = document.getElementById("loadingWrapper");
	const form = document.getElementById('LoanHealthCheck');
	const name = document.getElementById('name-5a14').value;
	const mobileNumber = document.getElementById('email-5a14').value;
	const loanAmount = document.getElementById('text-7847').value;
	const interestRate = document.getElementById('text-6839').value;
	const propertyAddress = document.getElementById('text-8bd3').value;

	loadingWrapper.style.display = "flex";

	const data = {
		operationName: 'LoanHealthCheck',
		name: name,
		mobileNumber: mobileNumber,
		loanAmount: loanAmount,
		interestRate: interestRate,
		propertyAddress: propertyAddress
	}


	fetch(
    "https://9v4qfkzq5g.execute-api.ap-southeast-2.amazonaws.com/dev/sendemail",
    {
      method: "POST", 
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => {
			if (response.ok) {
				// If status is 200-299, proceed
				return response.json();
			} else {
				// If status is outside 200 range, throw an error
				throw new Error(`HTTP status ${response.status}`);
			}
		}) 
    .then((data) => {
			loadingWrapper.style.display = "none";
			toggleVisibility();
      console.log("Success:", data); 
    })
    .catch((error) => {
			loadingWrapper.style.display = "none";
			toggleVisibility();
      console.error("Error:", error); 
    });

}

function submitLoanComparisonCallBack(event){
	const viewResultButton = document.getElementById("viewResult");
	viewResultButton.classList.remove("u-btn-submit");
	viewResultButton.classList.remove("u-btn-step-next");

	const loadingWrapper = document.getElementById("loadingWrapper");
	const thankyou = document.getElementById("thankyou");
	const form = document.getElementById('LoanHealthCheck');
	const name = document.getElementById('name-5a14').value;
	const mobileNumber = document.getElementById('email-5a14').value;
	const loanAmount = document.getElementById('text-7847').value;
	const interestRate = document.getElementById('text-6839').value;
	const propertyAddress = document.getElementById('text-8bd3').value;
	const potentialRepayment = document.getElementById('monthlyPotentialRepayment').value;
	const interestSavings = document.getElementById('savingsAmount').value;

	loadingWrapper.style.display = "flex";
	thankyou.classList.toggle("u-form-send-message"); // Toggles the visibility class


	const data = {
		operationName: 'LoanHealthCheckCallBack',
		name: name,
		mobileNumber: mobileNumber,
		loanAmount: loanAmount,
		interestRate: interestRate,
		propertyAddress: propertyAddress,
		potentialRepayment: potentialRepayment,
		interestSavings: interestSavings
	}


	fetch(
    "https://9v4qfkzq5g.execute-api.ap-southeast-2.amazonaws.com/dev/sendemail",
    {
      method: "POST", 
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => {
			if (response.ok) {
				// If status is 200-299, proceed
				return response.json();
			} else {
				// If status is outside 200 range, throw an error
				throw new Error(`HTTP status ${response.status}`);
			}
		}) 
    .then((data) => {
			thankyou.style.display = "block";
			loadingWrapper.style.display = "none";
      console.log("Success:", data); 
    })
    .catch((error) => {
			thankyou.style.display = "block";
			loadingWrapper.style.display = "none";
      console.error("Error:", error); 
    });

}

function onSubmit(event) {
console.log('onSubmit triggered')
}

function submitRefinanceRquestCallback(event){
	alert("I ma submitRefinanceRquestCallback")
}
