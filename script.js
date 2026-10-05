const addTransaction = document.getElementById("addTransaction");

const transactionbox = document.getElementById("transactionbox");

const canceltransactionbutton =
    document.getElementById("canceltransactionbutton");


const managecategories =
    document.getElementById("managecategories");

const categorymodal =
    document.getElementById("categorymodal");

const categorymodalclose =
    document.getElementById("categorymodalclose");


const income =
    document.getElementById("income");

const used =
    document.getElementById("used");

const remaining =
    document.getElementById("remaining");


const amountfield =
    document.getElementById("amountfield");

const transactionlist =
    document.getElementById("transactionlist");

const transactiondate =
    document.getElementById("date");

const description =
    document.getElementById("description");

const category =
    document.getElementById("category");


const transactionform =
    document.getElementById("transactionform");

const transactionbody =
    document.getElementById("transactionBody");


const catname =
    document.getElementById("catname");

const addcategory =
    document.getElementById("addcategory");


const allfilter =
    document.getElementById("allfilter");

const incomefilter =
    document.getElementById("incomefilter");

const expensefilter =
    document.getElementById("expensefilter");

const categoryfilter =
    document.getElementById("categoryfilter");

const categorytags =
    document.getElementById("categorytags");


const categorylist =
    document.getElementById("categorylist");


const dayOverview =
    document.getElementById("dayoverview");

const weekOverview =
    document.getElementById("weekoverview");

const monthOverview =
    document.getElementById("monthoverview");

const yearOverview =
    document.getElementById("yearoverview");


const overviewcontent =
    document.getElementById("overviewcontent");


const editbudget =
    document.getElementById("editbudget");

const editprofile =
    document.getElementById("editprofile");

const exportdata =
    document.getElementById("exportdata");


const profilename =
    document.getElementById("profilename");


/* =========================
   DATA
========================= */


let array = [];

let editingId = null;


let categories = [
    "Food",
    "Grocery",
    "Laundry",
    "ElectricBill"
];


let budget =
    Number(localStorage.getItem("budget")) || 0;


let currentOverviewPeriod =
    "month";


/* =========================
   LOCAL STORAGE
========================= */


function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(array)
    );


    localStorage.setItem(
        "categories",
        JSON.stringify(categories)
    );


    localStorage.setItem(
        "budget",
        budget
    );

}


/* =========================
   LOAD DATA
========================= */


function loadData() {

    let savedTransactions =
        localStorage.getItem("transactions");


    let savedCategories =
        localStorage.getItem("categories");


    if (savedTransactions !== null) {

        array =
            JSON.parse(savedTransactions);

    }


    if (savedCategories !== null) {

        categories =
            JSON.parse(savedCategories);

    }


    updateCategoryDropdown();

    updateDashboard();

    displayTransactions(array);

}


/* =========================
   TRANSACTION BOX
========================= */


addTransaction.onclick = function () {

    editingId = null;

    transactionform.reset();

    transactionbox.style.display = "block";

};


canceltransactionbutton.onclick = function () {

    transactionbox.style.display = "none";

    editingId = null;

    transactionform.reset();

};


/* =========================
   DASHBOARD
========================= */


function updateDashboard() {

    let totalIncome = 0;

    let totalExpense = 0;


    for (
        let i = 0;
        i < array.length;
        i++
    ) {

        if (
            array[i].type === "income"
        ) {

            totalIncome +=
                Number(array[i].amount);

        }


        if (
            array[i].type === "expense"
        ) {

            totalExpense +=
                Number(array[i].amount);

        }

    }


    income.textContent =
        `₹${totalIncome}`;


    used.textContent =
        `₹${totalExpense}`;


    remaining.textContent =
        `₹${totalIncome - totalExpense}`;

}


/* =========================
   DISPLAY TRANSACTIONS
========================= */


function displayTransactions(transactions) {

    transactionbody.innerHTML = "";


    for (
        let i = 0;
        i < transactions.length;
        i++
    ) {

        let transaction =
            transactions[i];


        transactionbody.insertAdjacentHTML(
            "beforeend",
            `
            <tr data-id="${transaction.id}">

                <td>
                    ${transaction.cat}
                </td>

                <td>
                    ${transaction.desc}
                </td>

                <td>
                    ${transaction.date}
                </td>

                <td>
                    ₹${transaction.amount}
                </td>

                <td>
                    ${transaction.type}
                </td>

                <td>

                    <button
                        onclick="editTransaction(${transaction.id})">

                        Edit

                    </button>


                    <button
                        onclick="deleteTransaction(${transaction.id})">

                        Delete

                    </button>

                </td>

            </tr>
            `
        );

    }

}


/* =========================
   ADD / EDIT TRANSACTION
========================= */


transactionform.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        /* Validation */


        if (

            amountfield.value === "" ||

            transactionlist.value === "" ||

            transactiondate.value === "" ||

            description.value === "" ||

            category.value === ""

        ) {

            alert(
                "Please fill all fields"
            );

            return;

        }


        /* Create transaction */


        let transaction = {

            id:
                editingId !== null
                    ? editingId
                    : Date.now(),


            amount:
                amountfield.value,


            type:
                transactionlist.value,


            date:
                transactiondate.value,


            desc:
                description.value,


            cat:
                category.value

        };


        /* Edit existing transaction */


        if (editingId !== null) {

            let index =
                array.findIndex(
                    function (transaction) {

                        return (
                            transaction.id ===
                            editingId
                        );

                    }
                );


            if (index !== -1) {

                array[index] =
                    transaction;

            }


            editingId = null;

        }


        /* Add new transaction */


        else {

            array.push(
                transaction
            );

        }


        /* Save */


        saveData();


        /* Update UI */


        updateDashboard();

        displayTransactions(array);

        filterByOverview(
            currentOverviewPeriod
        );


        /* Reset */


        transactionform.reset();

        transactionbox.style.display =
            "none";

    }
);


/* =========================
   DELETE TRANSACTION
========================= */


function deleteTransaction(id) {

    let index =
        array.findIndex(
            function (transaction) {

                return transaction.id === id;

            }
        );


    if (index === -1) {

        return;

    }


    let confirmation =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmation) {

        return;

    }


    array.splice(
        index,
        1
    );


    saveData();

    updateDashboard();

    displayTransactions(array);

    filterByOverview(
        currentOverviewPeriod
    );

}


/* =========================
   EDIT TRANSACTION
========================= */


function editTransaction(id) {

    let index =
        array.findIndex(
            function (transaction) {

                return transaction.id === id;

            }
        );


    if (index === -1) {

        return;

    }


    let transaction =
        array[index];


    editingId =
        id;


    amountfield.value =
        transaction.amount;


    transactionlist.value =
        transaction.type;


    transactiondate.value =
        transaction.date;


    description.value =
        transaction.desc;


    category.value =
        transaction.cat;


    transactionbox.style.display =
        "block";

}


/* =========================
   CATEGORY MODAL
========================= */


managecategories.onclick =
    function () {

        categorymodal.style.display =
            "block";

        displayCategories();

    };


categorymodalclose.onclick =
    function () {

        categorymodal.style.display =
            "none";

    };


/* =========================
   DISPLAY CATEGORIES
========================= */


function displayCategories() {

    categorylist.innerHTML = "";


    for (
        let i = 0;
        i < categories.length;
        i++
    ) {

        categorylist.insertAdjacentHTML(
            "beforeend",
            `
            <div class="categoryitem">

                <span>
                    ${categories[i]}
                </span>


                <div>

                    <button
                        onclick="editCategory(${i})">

                        Edit

                    </button>


                    <button
                        onclick="deleteCategory(${i})">

                        Delete

                    </button>

                </div>

            </div>
            `
        );

    }

}


/* =========================
   DELETE CATEGORY
========================= */


function deleteCategory(index) {

    categories.splice(
        index,
        1
    );


    saveData();

    displayCategories();

    updateCategoryDropdown();

    displayCategoryTags();

}


/* =========================
   EDIT CATEGORY
========================= */


function editCategory(index) {

    let newName =
        prompt(
            "Enter new category name:",
            categories[index]
        );


    if (
        newName === null ||
        newName.trim() === ""
    ) {

        return;

    }


    categories[index] =
        newName.trim();


    saveData();

    displayCategories();

    updateCategoryDropdown();

    displayCategoryTags();

}


/* =========================
   ADD CATEGORY
========================= */


addcategory.onclick =
    function () {

        if (
            catname.value.trim() === ""
        ) {

            alert(
                "Enter a category name"
            );

            return;

        }


        if (
            categories.includes(
                catname.value.trim()
            )
        ) {

            alert(
                "Category already exists"
            );

            return;

        }


        categories.push(
            catname.value.trim()
        );


        saveData();

        displayCategories();

        updateCategoryDropdown();

        catname.value = "";

    };


/* =========================
   CATEGORY DROPDOWN
========================= */


function updateCategoryDropdown() {

    category.innerHTML =
        `
        <option value="">
            Select Category
        </option>
        `;


    for (
        let i = 0;
        i < categories.length;
        i++
    ) {

        category.insertAdjacentHTML(
            "beforeend",
            `
            <option value="${categories[i]}">

                ${categories[i]}

            </option>
            `
        );

    }

}


/* =========================
   CATEGORY FILTER TAGS
========================= */


function displayCategoryTags() {

    categorytags.innerHTML = "";


    for (
        let i = 0;
        i < categories.length;
        i++
    ) {

        categorytags.insertAdjacentHTML(
            "beforeend",
            `
            <button
                class="categorytag"
                onclick="filterByCategory('${categories[i]}')">

                ${categories[i]}

            </button>
            `
        );

    }

}


function filterByCategory(
    selectedCategory
) {

    let filtered =
        array.filter(
            function (transaction) {

                return (
                    transaction.cat ===
                    selectedCategory
                );

            }
        );


    displayTransactions(
        filtered
    );

}


/* =========================
   FILTERS
========================= */


allfilter.onclick =
    function () {

        categorytags.innerHTML = "";

        displayTransactions(
            array
        );

    };


incomefilter.onclick =
    function () {

        categorytags.innerHTML = "";


        let filtered =
            array.filter(
                function (transaction) {

                    return (
                        transaction.type ===
                        "income"
                    );

                }
            );


        displayTransactions(
            filtered
        );

    };


expensefilter.onclick =
    function () {

        categorytags.innerHTML = "";


        let filtered =
            array.filter(
                function (transaction) {

                    return (
                        transaction.type ===
                        "expense"
                    );

                }
            );


        displayTransactions(
            filtered
        );

    };


categoryfilter.onclick =
    function () {

        displayCategoryTags();

    };


/* =========================
   OVERVIEW
========================= */


function filterByOverview(period) {

    currentOverviewPeriod =
        period;


    let today =
        new Date();


    let filtered =
        array.filter(
            function (transaction) {

                let transactionDate =
                    new Date(
                        transaction.date
                    );


                if (
                    period === "day"
                ) {

                    return (

                        transactionDate.getDate()
                        ===
                        today.getDate()

                        &&

                        transactionDate.getMonth()
                        ===
                        today.getMonth()

                        &&

                        transactionDate.getFullYear()
                        ===
                        today.getFullYear()

                    );

                }


                if (
                    period === "week"
                ) {

                    let weekAgo =
                        new Date();


                    weekAgo.setDate(
                        today.getDate() - 7
                    );


                    return (

                        transactionDate >=
                        weekAgo

                        &&

                        transactionDate <=
                        today

                    );

                }


                if (
                    period === "month"
                ) {

                    return (

                        transactionDate.getMonth()
                        ===
                        today.getMonth()

                        &&

                        transactionDate.getFullYear()
                        ===
                        today.getFullYear()

                    );

                }


                if (
                    period === "year"
                ) {

                    return (

                        transactionDate.getFullYear()
                        ===
                        today.getFullYear()

                    );

                }

            }
        );


    let totalIncome = 0;

    let totalExpense = 0;


    for (
        let i = 0;
        i < filtered.length;
        i++
    ) {

        if (
            filtered[i].type ===
            "income"
        ) {

            totalIncome +=
                Number(
                    filtered[i].amount
                );

        }


        if (
            filtered[i].type ===
            "expense"
        ) {

            totalExpense +=
                Number(
                    filtered[i].amount
                );

        }

    }


    let balance =
        totalIncome -
        totalExpense;


    overviewcontent.innerHTML =
        `
        <div class="overviewstats">


            <div>

                <span>
                    Income
                </span>

                <strong>
                    ₹${totalIncome}
                </strong>

            </div>


            <div>

                <span>
                    Expenses
                </span>

                <strong>
                    ₹${totalExpense}
                </strong>

            </div>


            <div>

                <span>
                    Balance
                </span>

                <strong>
                    ₹${balance}
                </strong>

            </div>


            <div>

                <span>
                    Budget
                </span>

                <strong>
                    ₹${budget}
                </strong>

            </div>


        </div>
        `;


    dayOverview.classList.remove(
        "active"
    );

    weekOverview.classList.remove(
        "active"
    );

    monthOverview.classList.remove(
        "active"
    );

    yearOverview.classList.remove(
        "active"
    );


    if (
        period === "day"
    ) {

        dayOverview.classList.add(
            "active"
        );

    }


    if (
        period === "week"
    ) {

        weekOverview.classList.add(
            "active"
        );

    }


    if (
        period === "month"
    ) {

        monthOverview.classList.add(
            "active"
        );

    }


    if (
        period === "year"
    ) {

        yearOverview.classList.add(
            "active"
        );

    }

}


/* =========================
   OVERVIEW BUTTONS
========================= */


dayOverview.onclick =
    function () {

        filterByOverview(
            "day"
        );

    };


weekOverview.onclick =
    function () {

        filterByOverview(
            "week"
        );

    };


monthOverview.onclick =
    function () {

        filterByOverview(
            "month"
        );

    };


yearOverview.onclick =
    function () {

        filterByOverview(
            "year"
        );

    };


/* =========================
   EDIT BUDGET
========================= */


editbudget.onclick =
    function () {

        let newBudget =
            prompt(
                "Enter your budget:",
                budget
            );


        if (
            newBudget === null ||
            newBudget.trim() === ""
        ) {

            return;

        }


        if (
            isNaN(
                Number(newBudget)
            ) ||

            Number(newBudget) < 0
        ) {

            alert(
                "Budget cannot be negative."
            );

            return;

        }


        budget =
            Number(newBudget);


        saveData();


        filterByOverview(
            currentOverviewPeriod
        );

    };


/* =========================
   EDIT PROFILE
========================= */


editprofile.onclick =
    function () {

        let newName =
            prompt(
                "Enter your name:",
                profilename.textContent
            );


        if (
            newName === null ||
            newName.trim() === ""
        ) {

            return;

        }


        profilename.textContent =
            newName.trim();


        localStorage.setItem(
            "profileName",
            newName.trim()
        );

    };


/* =========================
   EXPORT DATA
========================= */


exportdata.onclick =
    function () {

        let data = {

            transactions:
                array,

            categories:
                categories,

            budget:
                budget

        };


        let file =
            new Blob(
                [
                    JSON.stringify(
                        data,
                        null,
                        2
                    )
                ],

                {
                    type:
                        "application/json"
                }
            );


        let link =
            document.createElement(
                "a"
            );


        link.href =
            URL.createObjectURL(
                file
            );


        link.download =
            "expense-tracker-data.json";


        link.click();


        URL.revokeObjectURL(
            link.href
        );

    };


/* =========================
   INITIALIZE APPLICATION
========================= */


loadData();


let savedName =
    localStorage.getItem(
        "profileName"
    );


if (
    savedName !== null
) {

    profilename.textContent =
        savedName;

}


filterByOverview(
    "month"
);