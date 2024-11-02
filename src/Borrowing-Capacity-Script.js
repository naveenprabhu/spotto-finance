import AnalyticsService from './analyticsservice.js';

AnalyticsService.logScreenView('Borrowing-Capacity-Check');

document.addEventListener("DOMContentLoaded", function() {
	isUserDataNeeded(); // Call the function defined in utils.js
});

function isUserDataNeeded() {
	const youTab = document.getElementById("you-tab");
	const propertyTab = document.getElementById("property-tab");
	if(getLocalStorageWithExpiry("userData")){

		youTab.classList.remove("u-active");
		propertyTab.classList.remove("u-active");
		propertyTab.classList.add("u-active");
	} else {
		youTab.classList.remove("u-active");
		propertyTab.classList.remove("u-active");
		youTab.classList.add("u-active");
	}

}

function setLocalStorageWithExpiry(key, name, mobileNumber, ttl) {
  const now = new Date();

  // `ttl` is the time-to-live in milliseconds
  const item = {
    name: name,
    mobileNumber: mobileNumber,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getLocalStorageWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
	console.log(itemStr);

  // If the item doesn’t exist, return null
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  // Compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
		console.log("exipred");

    // If the item is expired, remove it from storage and return null
    localStorage.removeItem(key);
    return null;
  }
	console.log("retrun value");


  return item;
}

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
	const storedUserData = getLocalStorageWithExpiry("userData");


	const loadingWrapper = document.getElementById("loadingWrapper");
	const form = document.getElementById('BorrowingCapacityCheck');
	let name = document.getElementById('name-5a14').value;
	let mobileNumber = document.getElementById('email-5a14').value;
	const income = document.getElementById('text-8bd4').value;
	const expense = document.getElementById('text-7847').value;
	const dependants = document.getElementById('select-178e').value;

	loadingWrapper.style.display = "flex";

	if(!storedUserData){
		console.log("userdata not stored");
		setLocalStorageWithExpiry("userData", name, mobileNumber, 3600000);
	} else {
		console.log("user data is stored" );
		name = storedUserData.name;
		mobileNumber = storedUserData.mobileNumber;
	}


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
	const storedUserData = getLocalStorageWithExpiry("userData");


	const loadingWrapper = document.getElementById("loadingWrapper");
	const thankyou = document.getElementById("thankyou");
	const form = document.getElementById('LoanHealthCheck');
	let name = document.getElementById('name-5a14').value;
	let mobileNumber = document.getElementById('email-5a14').value;
	const income = document.getElementById('text-8bd4').value;
	const expense = document.getElementById('text-7847').value;
	const dependants = document.getElementById('select-178e').value;
	const borrowingCapacity = document.getElementById('borrowingCapacity').textContent;

	loadingWrapper.style.display = "flex";
	thankyou.classList.toggle("u-form-send-message"); // Toggles the visibility class



	if(!storedUserData){
		console.log("userdata not stored");
		setLocalStorageWithExpiry("userData", name, mobileNumber, 3600000);
	} else {
		console.log("user data is stored" );
		name = storedUserData.name;
		mobileNumber = storedUserData.mobileNumber;
	}


	const data = {
		operationName: 'BorrowingCapacityCheckCallBack',
		name: name,
		mobileNumber: mobileNumber,
		income: income,
		expense: expense,
		dependants: dependants,
		borrowingCapacity: borrowingCapacity
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

