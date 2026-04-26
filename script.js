let FINAL_TOTAL_STUDENTS = 0;
let FINAL_HALL_STRUCTS = [];

const form = document.querySelector(".form");
const dept_select = document.querySelector(".dept");
const check_boxes = document.querySelector(".check-boxes");
const regRanges = document.querySelector(".regRanges");


//PREVENTS PAGE RELOAD WHEN ENTER IS PRESSED
form.addEventListener("keydown",(evt) => {
    if(evt.key == "ENTER"){
        evt.preventDefault();
    }
});


//ADDS OR REMOVES REGISTER NO SECTION THROUGH CHECK-BOXES
check_boxes.addEventListener("change",(evt) => {
    const regRange = document.createElement("div");
    const course = document.createElement("span");
    const regStart = document.createElement("input");
    const regEnd = document.createElement("input");

    course.textContent = evt.target.value.toUpperCase();
    regRange.classList.add("regRange",`${evt.target.value}`);
    regStart.classList.add("regStart");
    regEnd.classList.add("regEnd");

    regRange.append(course,regStart,"-",regEnd);


    if (evt.target.checked){
        regRanges.appendChild(regRange);
    }
    else{
        const del_el = document.querySelector(`.regRange.${evt.target.value}`);
        del_el.remove();
    }
});


const submitButton = document.querySelector("button");
const noOfHalls = document.querySelector(".halls .num_inp");
const noOfRows = document.querySelector(".hall-row .num_inp");
const noOfCols = document.querySelector(".hall-col .num_inp");


submitButton.addEventListener("click",(evt) => {
    let halls = noOfHalls.value;
    let rows = noOfRows.value;
    let cols = noOfCols.value;
    
    const startRanges = document.querySelectorAll(".regRange .regStart");
    const endRanges = document.querySelectorAll(".regRange .regEnd");
    const courses = document.querySelectorAll(".regRange");

    let coursesDet = [];
    let hallStructs = [];

    for (let i = 0;i<halls;i++){
        let hallStruct = [];
        for (let i = 0;i<rows;i++){
            hallStruct[i] = [];
            for (let j = 0;j<cols;j++){
                hallStruct[i][j] = 0;
            }
        }
        hallStructs.push(hallStruct);
    }


    for (x of courses){
        let  courseDet = {};

        courseDet.courseName = x.classList[1];
        courseDet.start = x.querySelector(".regStart").value;
        courseDet.end = x.querySelector(".regEnd").value;
        courseDet.studentCount = courseDet.end-courseDet.start + 1;
        coursesDet.push(courseDet);
    }

    coursesDet.sort((a,b) => b.studentCount-a.studentCount);

    FINAL_TOTAL_STUDENTS = 0;

    coursesDet.forEach(course => {
        const start = Number(course.start);
        const end = Number(course.end);

        if (!isNaN(start) && !isNaN(end) && end >= start) {
            FINAL_TOTAL_STUDENTS += (end - start + 1);
        }
    });

    let studentLists = [];
    for (let course of coursesDet){
        let studentList = [];
        let student = {};
        let name = course.courseName;
        for (let i = Number(course.start);i<=Number(course.end);i++){
            studentList.push(i);
        }
        student.name = name;
        student.students = studentList;
        studentLists.push(student);
    }
    

    let deptPoint = 0;


// -------- STRICT CHECKERBOARD GROUP ISOLATION --------

    for (let hall of hallStructs) {

        let groupASeats = [];
        let groupBSeats = [];

        // SEPARATE SEATS
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if ((r + c) % 2 === 0) {
                    groupASeats.push([r, c]);
                } else {
                    groupBSeats.push([r, c]);
                }
            }
        }

        // SORT DEPARTMENTS BY SIZE
        studentLists.sort((a, b) => b.students.length - a.students.length);

        // ASSIGN DEPARTMENTS TO GROUPS ALTERNATELY
        let groupADepts = [];
        let groupBDepts = [];   

        studentLists.forEach((dept, index) => {
            if (index % 2 === 0) {
                groupADepts.push(dept);
            } else {
                groupBDepts.push(dept);
            }
        });


        function fillGroup(seats, deptList) {

            let deptIndex = 0;

            for (let [r, c] of seats) {

                let attempts = 0;

                while(attempts < deptList.length && deptList[deptIndex].students.length === 0){
                    deptIndex = (deptIndex + 1) % deptList.length;
                    attempts++;
                }

                if (attempts >= deptList.length) return;

                let dept = deptList[deptIndex];

                hall[r][c] = `${dept.name.toUpperCase()}_${dept.students.shift()}`;

                deptIndex = (deptIndex + 1) % deptList.length;
            }
        }

        fillGroup(groupASeats, groupADepts);
        fillGroup(groupBSeats, groupBDepts);
    }

    FINAL_HALL_STRUCTS = hallStructs;   
    displayHalls(hallStructs, rows, cols);
});


function displayHalls(hallStructs, rows, cols) {

    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";

    hallStructs.forEach((hall, hallIndex) => {

        // HALL TITLE
        const hallTitle = document.createElement("h3");
        hallTitle.textContent = `Hall ${hallIndex + 1}`;
        hallTitle.style.margin = "20px 0 10px 0";
        outputDiv.appendChild(hallTitle);

        // CREATE TABLE
        const table = document.createElement("table");
        table.style.borderCollapse = "separate";
        table.style.borderSpacing = "6px";   // SPACING BETWEEN CELLS
        table.style.marginBottom = "30px";

        for (let r = 0; r < rows; r++) {

            const tr = document.createElement("tr");

            for (let c = 0; c < cols; c++) {

                const td = document.createElement("td");

                // SEAT CONTENT
                td.textContent = hall[r][c] ? hall[r][c] : "—";

                // PROPER SPACING & SIZE
                td.style.width = "90px";
                td.style.height = "40px";
                td.style.textAlign = "center";
                td.style.verticalAlign = "middle";
                td.style.border = "1px solid #ccc";
                td.style.borderRadius = "6px";
                td.style.fontSize = "13px";
                td.style.backgroundColor = "#f5f5f5";

                if (td.innerText.slice(0,3) == "CSE"){
                    td.style.backgroundColor = "blue";
                }
                else if (td.innerText.slice(0,3) == "EEE"){
                    td.style.backgroundColor = "green";
                }
                else if (td.innerText.slice(0,3) == "ECE"){
                    td.style.backgroundColor = "grey";
                }
                else if (td.innerText.slice(0,4) == "MECH"){
                    td.style.backgroundColor = "brown";                    
                }
                else if (td.innerText.slice(0,4) == "AERO"){
                    td.style.backgroundColor = "cyan";
                }

                tr.appendChild(td);
            }

            table.appendChild(tr);
        }

        outputDiv.appendChild(table);
    });
}


document.querySelector("button").addEventListener("click", function () {
    setTimeout(generateAnalytics, 100);
});

function generateAnalytics() {

    const analytics = document.getElementById("analytics");
    analytics.innerHTML = "";

    let allottedStudents = 0;

    FINAL_HALL_STRUCTS.forEach(hall => {
        hall.forEach(row => {
            row.forEach(seat => {
                if (seat !== 0) {
                    allottedStudents++;
                }
            });
        });
    });

    const totalStudents = FINAL_TOTAL_STUDENTS;
    const unallottedStudents = Math.max(0, totalStudents - allottedStudents);

    const summaryCard = document.createElement("div");
    summaryCard.classList.add("summary-card");

    summaryCard.innerHTML = `
        <h3>Student Allocation Summary</h3>
        <div class="summary-grid">
            <div><span>Total Students</span><strong>${totalStudents}</strong></div>
            <div><span>Allotted Students</span><strong>${allottedStudents}</strong></div>
            <div><span>Unallotted Students</span><strong>${unallottedStudents}</strong></div>
        </div>
    `;

    analytics.appendChild(summaryCard);


    const findSection = document.createElement("div");
    findSection.classList.add("summary-card");

    findSection.innerHTML = `
    <h3>Find Student</h3>
    <div class="summary-grid">
        <input type="text" id="findInput" placeholder="Enter Reg No">
        <button id="findBtn">Search</button>
        <div><span>Result</span><strong id="findResult">-</strong></div>
    </div>
    `;

    analytics.appendChild(findSection);

    // SEARCH LOGIC
    document.getElementById("findBtn").addEventListener("click", function () {
        const searchValue = document.getElementById("findInput").value.trim();
        const resultPara = document.getElementById("findResult");
        let found = false;

        FINAL_HALL_STRUCTS.forEach((hall, hallIndex) => {
            hall.forEach((row, rowIndex) => {
                row.forEach((seat, colIndex) => {
                    if (seat === searchValue) {
                        resultPara.textContent = 
                            `Found in Hall ${hallIndex + 1}, Row ${rowIndex + 1}, Seat ${colIndex + 1}`;
                        found = true;
                    }
                });
            });
        });

        if (!found) {
            resultPara.textContent = "Student not found.";
        }
    });
}

function findStudent() {

    const regNo = document.getElementById("searchReg").value.trim();
    const result = document.getElementById("findResult");

    if (!regNo) {
        result.textContent = "Enter a register number.";
        return;
    }

    const halls = document.querySelectorAll("#output table");

    for (let h = 0; h < halls.length; h++) {

        const rows = halls[h].querySelectorAll("tr");

        for (let r = 0; r < rows.length; r++) {

            const cols = rows[r].querySelectorAll("td");

            for (let c = 0; c < cols.length; c++) {

                if (cols[c].textContent.trim().toLowerCase() === regNo.toLowerCase() ||
                    cols[c].textContent.toLowerCase().includes(regNo.toLowerCase())) {

                    result.textContent =
                        `Found in Hall ${h + 1} — Row ${r + 1}, Column ${c + 1}`;
                    return;
                }
            }
        }
    }

    result.textContent = "Student not found.";
}