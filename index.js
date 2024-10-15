//Get the form and table elements
const button=document.querySelector(".btn");
const form=document.getElementById("student-form");
const tableBody=document.querySelector("#studentTable tbody");

//flag to track edit mode
let isEditMode=false;
let editedRowIndex=-1;

//load existing data from localstorage
loadData();

//add eventlistener to submit form
form.addEventListener("submit",(e)=>{
    e.preventDefault();

//Get input values
    const text=document.querySelector(".name").value;
    const id=document.querySelector(".id").value;
    const email=document.querySelector(".email").value;
    const contact=document.querySelector(".contact").value;

//Validate input fields
    if(!validName(text)){
        alert("Invalid name. Please enter characters");
        return;
    }
    if(!validId(id)){
        alert("Invalid id. Please enter only numbers");
        return;
    }
    if(!validEmail(email)){
        alert("Invalid email");
        return;
    }
    if(!validContact(contact)){
        alert("Invalid contact. Please enter only numbers");
        return;
    }

    if(!text || !id || !email || !contact){
        alert("Please fill all fields");
        return;
    }
//Edit existing record
    if(isEditMode){
        editExistingRecord(text,id,email,contact);
        isEditMode=false;
    }
    else{
//Create new records
        createNewRecord(text,id,email,contact);
    }

//Save data to localstorage
    saveData();

//Clear form fields
    document.getElementById("name").value="";
    document.getElementById("student-id").value="";
    document.getElementById("email").value="";
    document.getElementById("contact").value="";
});

//Valid input details format
function validName(text){
    const valid=/^[a-zA-Z\s]+$/;
    return valid.test(text);
}

function validId(id){
    const valid=/^[0-9]+$/;
    return valid.test(id) && id.length>=1 && id.length<=10;
}

function validEmail(email){
    const valid=/^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+[a-zA-Z]$/;
    return valid.test(email);
}

function validContact(contact){
    const valid=/^[0-9]+$/;
    return valid.test(contact);
}

//Function to create new records to table
    function createNewRecord(text,id,email,contact){

    const row=document.createElement("tr");

    const textCell=document.createElement("td");
    const idCell=document.createElement("td");
    const emailCell=document.createElement("td");
    const contactCell=document.createElement("td");
    const editCell=document.createElement("td");
    const deleteCell=document.createElement("td");


    textCell.innerHTML=text;
    idCell.innerHTML=id;
    emailCell.innerHTML=email;
    contactCell.innerHTML=contact;

//Creating edit button 
    const editBtn=document.createElement("button");
    editBtn.innerHTML="Edit";
    editBtn.classList.add("edit");
    editBtn.onclick=(e)=>{
        const rowIndex=e.target.parentNode.parentNode.rowIndex-1;
        editRecord(rowIndex);
    };

//Creating delete button
    const deleteBtn=document.createElement("button");
    deleteBtn.innerHTML="Delete";
    deleteBtn.classList.add("delete");
    deleteBtn.onclick=(e)=>{
        const rowIndex=e.target.parentNode.parentNode.rowIndex-1;
        deleteRecord(rowIndex);
    };
           
    

    editCell.appendChild(editBtn);
    deleteCell.appendChild(deleteBtn);


    row.appendChild(textCell);
    row.appendChild(idCell);
    row.appendChild(emailCell);
    row.appendChild(contactCell);
    row.appendChild(editCell);
    row.appendChild(deleteCell);

    tableBody.appendChild(row);

}

//Edit existing records function
function editExistingRecord(text,id,email,contact){
    const row=tableBody.rows[editedRowIndex];

    row.cells[0].innerHTML=text;
    row.cells[1].innerHTML=id;
    row.cells[2].innerHTML=email;
    row.cells[3].innerHTML=contact;
    saveData();

}

//Function to edit records
function editRecord(index){

    const row=tableBody.rows[index];
    const text=row.cells[0].innerHTML;
    const id=row.cells[1].innerHTML;
    const email=row.cells[2].innerHTML;
    const contact=row.cells[3].innerHTML;
    document.getElementById("name").value=text;
    document.getElementById("student-id").value=id;
    document.getElementById("email").value=email;
    document.getElementById("contact").value=contact;

    isEditMode=true;
    editedRowIndex=index;
}

//Function to delete records
function deleteRecord(index){

    tableBody.deleteRow(index);

// Update local storage after deleting the record
    let data = JSON.parse(localStorage.getItem('studentData'));
    if (data && index >= 0) {
        data.splice(index, 1); // Remove the record from the array
        localStorage.setItem('studentData', JSON.stringify(data)); // Update local storage
    }
}


//Function to save the data to localstorage
function saveData(){
    const data=[];
    const rows=tableBody.rows;
    for(let i=0;i<rows.length;i++){
        const row=rows[i];
        const text=row.cells[0].innerHTML;
        const id=row.cells[1].innerHTML;
        const email=row.cells[2].innerHTML;
        const contact=row.cells[3].innerHTML;

        data.push({
            text,id,email,contact
        }); 
    }

    localStorage.setItem('studentData',JSON.stringify(data));
}

//Function to load data from localstorage
function loadData(){
    const storedData=localStorage.getItem('studentData');

    if(storedData){
        const data=JSON.parse(storedData);
        data.forEach((student)=>{
            createNewRecord(student.text,student.id,student.email,student.contact);
        });
    }
}

