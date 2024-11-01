function toggleVisibilityForBorrowingPower() {
  const viewResultButton = document.getElementById("viewResult");
	const income = parseFloat(document.getElementById("text-8bd4").value);
	const expense = parseFloat(document.getElementById("text-7847").value);
	const dependants = parseInt(document.getElementById('select-178e').value);

	if (isAllRequiredFieldsEntered(viewResultButton, income, expense)) {
		viewResultButton.classList.add("u-btn-submit");
		const submissionDiv = document.getElementById("carousel_fe60");
		const thanksDiv = document.getElementById("carousel_417d");
		submissionDiv.classList.toggle("u-hidden");
		thanksDiv.classList.toggle("u-hidden");
		calculateBorrowingCapacity(income, expense, dependants);
	}
}

function isAllRequiredFieldsEntered(viewResultButton, income, expense) {
	viewResultButton.classList.remove("u-btn-submit");
  viewResultButton.classList.remove("u-btn-step-next");

	const incomePattern = /^\d+$/;
	const expensePattern = /^\d+$/;

	if (
    !incomePattern.test(income) ||
    !expensePattern.test(expense) ||
    isNaN(income) ||
    isNaN(expense) ||
    income <= 0 ||
    expense <= 0
  ) {
    return false;
  }
  return true;
}

function calculateBorrowingCapacity(income, monthlyExpenses, dependents) {
	// Updated constants for a more lenient calculation
	const incomeFactor = 0.61;          // Increased income portion
	const dependentFactor = 5000;      // Reduced deduction per dependent
	const baseInterestRate = 0.061;     // Assumed interest rate for calculation
	
	// Convert monthly expenses to annual expenses
	const annualExpenses = monthlyExpenses * 12;

	// Adjusted income calculation
	const adjustedIncome = (income * incomeFactor) - annualExpenses;
	const dependentAdjustment = dependents * dependentFactor;
	
	// Calculate preliminary capacity
	const preliminaryCapacity = adjustedIncome - dependentAdjustment;

	// Borrowing capacity formula
	const borrowingCapacity = preliminaryCapacity / baseInterestRate;
	
	// Ensure no negative capacity
	const capacity =  Math.max(borrowingCapacity, 0);
	const capacityInCurrency =  formatCurrency(capacity.toFixed(2));

	document.getElementById(
    "borrowingCapacity"
  ).textContent = capacityInCurrency;


}

function formatCurrency(amount) {
  return `$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}


function submitBorrowingCapacity(){
	const viewResultButton = document.getElementById("viewResult");
	viewResultButton.classList.remove("u-btn-submit");
	viewResultButton.classList.remove("u-btn-step-next");

	const loadingWrapper = document.getElementById("loadingWrapper");
	const form = document.getElementById('BorrowingCapacityCheck');
	const name = document.getElementById('name-5a14').value;
	const mobileNumber = document.getElementById('email-5a14').value;
	const income = document.getElementById('text-8bd4').value;
	const expense = document.getElementById('text-7847').value;
	const dependants = document.getElementById('select-178e').value;

	loadingWrapper.style.display = "flex";

	const data = {
		operationName: 'BorrowingCapacityCheck',
		name: name,
		mobileNumber: mobileNumber,
		income: income,
		expense: expense,
		dependants: dependants
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
			toggleVisibilityForBorrowingPower();
      console.log("Success:", data); 
    })
    .catch((error) => {
			loadingWrapper.style.display = "none";
			toggleVisibilityForBorrowingPower();
      console.error("Error:", error); 
    });

}

function submitBorrowingCapacityCallBack(event){
	const viewResultButton = document.getElementById("viewResult");
	viewResultButton.classList.remove("u-btn-submit");
	viewResultButton.classList.remove("u-btn-step-next");

	const loadingWrapper = document.getElementById("loadingWrapper");
	const thankyou = document.getElementById("thankyou");
	const form = document.getElementById('LoanHealthCheck');
	const name = document.getElementById('name-5a14').value;
	const mobileNumber = document.getElementById('email-5a14').value;
	const income = document.getElementById('text-8bd4').value;
	const expense = document.getElementById('text-7847').value;
	const dependants = document.getElementById('select-178e').value;

	loadingWrapper.style.display = "flex";
	thankyou.classList.toggle("u-form-send-message"); // Toggles the visibility class


	const data = {
		operationName: 'BorrowingCapacityCheckCallBack',
		name: name,
		mobileNumber: mobileNumber,
		income: income,
		expense: expense,
		dependants: dependants
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

