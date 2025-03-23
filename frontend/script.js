let selectedFiles = [];
const fileslist = document.getElementById("files");
const res = document.querySelector("#results tbody");
const fileInput = document.getElementById("resumes");
const spinner = document.getElementById("spinner");
const barchart = document.getElementById("chart").getContext("2d");
let chartIns = null;
let lastRes =[];

document.getElementById("resumes").addEventListener("change",function(event){
    const newFiles = Array.from(event.target.files); //converts filelist obj containing files to array
    newFiles.forEach(file =>{
        if(!selectedFiles.some(f=>f.name === file.name)){
            selectedFiles.push(file);//add the file to selected files if file with same name doesn' exist
        }
    });
   updateList();
   });

function updateList(){
    fileslist.innerHTML="";
    selectedFiles.forEach((file,index) => { //loops through selected files and shows their unordered list
       const li = document.createElement("li");
       li.textContent = file.name;

       const removeButton = document.createElement("button");
       removeButton.textContent = "x";
       removeButton.style.marginLeft = "10px";
       removeButton.style.cursor = "pointer";

       removeButton.addEventListener("click",function(){
        selectedFiles.splice(index,1);//clicking on x removes file at index from unordered list
        removerow(file.name);//calls function to remove row with that filename from results table 
        updateList();
       });
       li.appendChild(removeButton);
       fileslist.appendChild(li);
    });
}

document.getElementById("rankButton").addEventListener("click",async function (event) {  
   event.preventDefault();
   event.stopPropagation();
   //getting the job desc and files and adding to form data that needs to be sent to API
   let formdata = new FormData();
   const jobdescription = document.getElementById("jobdesc").value;
   formdata.append("job_desc",jobdescription);
   selectedFiles.forEach(file => formdata.append("resumes",file));

   spinner.style.display = "block";
   //sending form data to flask api
   try{
    const response = await fetch("http://127.0.0.1:5000/rank",{
        method: "POST",
        body: formdata,
    });

   if (!response.ok){
      throw new Error("Not able to fetch data");
   }
   const data = await response.json(); //converts response to json
   lastRes = data;
   Results(data);
   }
   catch(error){
    console.error(error);
    }
    finally{
        spinner.style.display = "none";
    }
 return false;
});

//resets everything (form,result table, bar chart)
document.getElementById("resetButton").addEventListener("click",async function (event) { 
     document.getElementById("form").reset();
     selectedFiles = [];
     lastRes =[];
     updateList();
     res.innerHTML="";
     document.getElementById("bar").style.display="none";
     document.getElementById("results").style.display="none";
     document.getElementById("heading").style.display="none";
     if(chartIns){
        chartIns.destroy();
        chartIns=null;
     }
});
//shows the similarity score result table
function Results(data){
    const tableheading = document.getElementById("heading");
    const table = document.getElementById("results");
    const chartheading = document.getElementById("bar");
    if(data.length>0){
        chartheading.style.display="block";
        tableheading.style.display="block";
        table.style.display="inline";
    }
    else{
        chartheading.style.display = "none";
        res.innerHTML = "<tr><td colspan='3'>No results</td></tr>";
    }
    let labels = [];
    let scores = [];

    data.forEach(result => {
      const row = document.createElement("tr");
      const rankCell = document.createElement("td");
      rankCell.textContent=result.rank;
      row.appendChild(rankCell);

      const resumeCell = document.createElement("td");
      resumeCell.textContent = result.resume;
      row.appendChild(resumeCell);

      const scoreCell = document.createElement("td");
      scoreCell.textContent = result.score;
      row.appendChild(scoreCell);

      res.appendChild(row);

      labels.push(result.resume);
      scores.push(result.score);
    });

    updateChart(labels,scores);
    return false;
}

function updateChart(labels,scores){
    if(chartIns){
        chartIns.destroy();
    }
    chartIns = new Chart(barchart,{
        type:'bar',
        data:{
            labels:labels,//x-axis label
            datasets:[{
                label:'similarity score',
                data:scores, //y-axis values
                backgroundColor: 'skyblue',
                borderColor:'blue',
                borderWidth:1
            }]
        },
        options:{
            responsive:true,
            scales:{
                y:{
                    beginAtZero: true,
                    max:1 //max 1 similarity score
                }
            }
        }
    });
}
function removerow(file){
    const rows = res.querySelectorAll("tr");
    rows.forEach(row =>{ //loop through all rows looking for resumename that matches file that needs to be removed
        const resumename = row.children[1];
        if(resumename && resumename.textContent === file){
            row.remove();
        }
    });
lastRes = lastRes.filter(result => result.resume !== file);//filter the results by including the resumes that do not match the file to be removed
const labels = lastRes.map(result => result.resume);
const scores = lastRes.map(result => result.score);
updateChart(labels,scores);
}