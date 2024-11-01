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
