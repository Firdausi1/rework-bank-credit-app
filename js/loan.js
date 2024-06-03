const welcome = document.getElementById("welcome");
const balance = document.getElementById("balance");
const accountType = document.getElementById("accountType");
const credit = document.getElementById("creditScore");
const appliedText = document.getElementById("appliedText");
const applyForm = document.getElementById("applyForm");
const errorLoan = document.getElementById("errorLoan");
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
let score = 0;

document.getElementById("loanBtn").addEventListener("click", () => {
  let loanAmount = parseInt(document.getElementById("loanAmount").value);

  if (isNaN(loanAmount) || null) {
    errorLoan.style.display = "inline-block";
  } else {
    errorLoan.style.display = "none";
    const users = JSON.parse(localStorage.getItem("users"));
    if (users) {
      const user = users.find((item) => item.username === currentUser.username);
      if (user) {
        score = calculateCredit(user, loanAmount);
        const date = getTodaysDate();

        if (score > 30) {
          user.amount += loanAmount;
          user.lastCollection = date;
          user.creditScore = score;
          user.loanStatus = "applied";
          saveTransaction(
            user,
            users,
            `Applied for a loan of &#8358;${formatCurrency(loanAmount)}`,
            "processing"
          );
          setTimeout(() => {
            saveTransaction(
              user,
              users,
              `Loan Application of &#8358;${formatCurrency(
                loanAmount
              )} on ${new Date().toDateString()} was successful`,
              "approved"
            );
            getUser(user);
          }, 3000);
        } else {
          user.creditScore = score;
          user.loanStatus = "applied";
          saveTransaction(
            user,
            users,
            `Applied for a loan of &#8358;${formatCurrency(loanAmount)}`,
            "processing"
          );

          setTimeout(() => {
            saveTransaction(
              user,
              users,
              `Loan Application of &#8358;${formatCurrency(
                loanAmount
              )} on ${new Date().toDateString()} was declined`,
              "declined"
            );
            getUser(user);
          }, 3000);
        }
      }
    }
  }
});

function calculateCredit(user, amount) {
  let creditScore = 0;
  const now = new Date();
  const lastCollection = new Date(user.lastCollection);
  const lastDeposit = new Date(user.lastDeposit);
  const expectedPeriod = new Date(user.expectedPeriod);
  const repaymentPeriod = new Date(user.repaymentPeriod);

  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth();
  const nowDay = now.getDate();
  const lastCollectionYear = lastCollection.getFullYear();
  const lastCollectionMonth = lastCollection.getMonth();
  const lastDepositMonth = lastDeposit.getMonth();
  const lastDepositDay = lastDeposit.getDate();
  const expectedPeriodYear = expectedPeriod.getFullYear();
  const expectedPeriodMonth = expectedPeriod.getMonth();
  const repaymentPeriodYear = repaymentPeriod.getFullYear();
  const repaymentPeriodMonth = repaymentPeriod.getMonth();

  const yearDifference = lastCollectionYear - nowYear;
  const monthDifference = yearDifference * 12 + lastCollectionMonth - nowMonth;

  const monthDifference2 = nowMonth - lastDepositMonth;
  const dayDifference = monthDifference2 * 30 + nowDay - lastDepositDay;

  const repaymentDate =
    (repaymentPeriodYear - expectedPeriodYear) * 12 +
    expectedPeriodMonth -
    repaymentPeriodMonth;

  if (user.amount > amount) {
    creditScore += 10;
  } else {
    creditScore -= 10;
  }
  if (user.creditHistory >= 6) {
    creditScore += 10;
  }
  if (Math.abs(monthDifference) > 6) {
    creditScore += 10;
  }
  if (Math.abs(dayDifference) < 31) {
    creditScore += 5;
  }
  if (Math.abs(repaymentDate) < 6) {
    creditScore += 5;
  }
  if (user.accountType === "current") {
    creditScore += 10;
  } else {
    creditScore += 5;
  }
  console.log(creditScore);
  return creditScore;
}

function getTodaysDate() {
  const date = new Date();
  const year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  day = day > 10 ? day : `0${day}`;
  month = month > 10 ? month + 1 : `0${month + 1}`;

  return `${year}-${month}-${day}`;
}

function displayTransaction(arr) {
  let transHistory = arr
    .map((item) => {
      return `<li class="display"><span class="${item.status}">${item.status}</span><h5>${item.text}</h5> </li>`;
    })
    .join("");
  const historyContainer = document.getElementById("history");

  historyContainer.innerHTML = transHistory;
}

function saveTransaction(user, users, message, pill) {
  user.transactionHistory.push({
    text: message,
    status: pill,
  });

  localStorage.setItem("currentUser", JSON.stringify(user));
  localStorage.setItem("users", JSON.stringify(users));
  displayTransaction(user.transactionHistory);
}

function formatCurrency(amount) {
  let newAmount = amount.toString();
  let arrAmount = newAmount.split("");
  const size = arrAmount.length;

  if (size > 3) {
    let newArr2 = arrAmount.splice(size - 3, 3);
    newArr2.unshift(",");
    let result = formatCurrency(arrAmount.join("")) + newArr2.join("");
    return result;
  }
  return newAmount;
}

function getUser(currentUser) {
  if (currentUser) {
    welcome.innerHTML = `Hi ${currentUser.username}, welcome back!`;
    balance.innerHTML = `&#8358;${formatCurrency(currentUser.amount)}`;
    accountType.innerHTML = `${currentUser.accountType} account`;
    credit.innerHTML = currentUser.creditScore;
    if (currentUser.loanStatus === "applied") {
      appliedText.style.display = "block";
      applyForm.style.display = "none";
    }
  }
}
getUser(currentUser);
displayTransaction(currentUser.transactionHistory);
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  location.href = "index.html";
});
