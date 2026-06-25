const historyList = document.getElementById("historyList");
const resultDiv = document.getElementById("result");
const expressionInput = document.getElementById("expression");

let editIndex = -1;

loadHistory();

function evaluateExpression(){

    let expr = expressionInput.value.trim();

    if(expr==="") return;

    try{

        let expression = expr;

        expression = expression.replace(/\^/g,"**");
        expression = expression.replace(/sqrt/gi,"Math.sqrt");
        expression = expression.replace(/sin/gi,"Math.sin");
        expression = expression.replace(/cos/gi,"Math.cos");
        expression = expression.replace(/tan/gi,"Math.tan");
        expression = expression.replace(/log/gi,"Math.log10");

        const value = Function(
            '"use strict"; return ('+expression+')'
        )();

        if(!isFinite(value)){
            throw new Error("División entre cero");
        }

        resultDiv.innerHTML =
        "Resultado: <b>"+value+"</b>";

        saveHistory(expr,value);

        expressionInput.value="";
        expressionInput.focus();

    }

    catch(error){

        resultDiv.innerHTML=
        "❌ Error: "+error.message;

    }

}

function saveHistory(expr,result){

    let history =
    JSON.parse(localStorage.getItem("evalexpr")) || [];

    if(editIndex==-1){

        history.push({
            expr,
            result
        });

    }

    else{

        history[editIndex]={
            expr,
            result
        };

        editIndex=-1;

    }

    if(history.length>50){

        history.shift();

    }

    localStorage.setItem(
        "evalexpr",
        JSON.stringify(history)
    );

    loadHistory();

}

function loadHistory(){

    const history =
    JSON.parse(localStorage.getItem("evalexpr")) || [];

    historyList.innerHTML="";

    if(history.length===0){

        historyList.innerHTML=
        '<div class="empty">No hay historial.</div>';

        return;

    }

    history.forEach((item,index)=>{

        const li=document.createElement("li");

        li.innerHTML=`

            <div class="expression">

                ${item.expr}
                =
                <b>${item.result}</b>

            </div>

            <div class="actions">

                <button
                class="edit"
                onclick="editExpression(${index})">
                Editar
                </button>

                <button
                class="delete"
                onclick="deleteExpression(${index})">
                Eliminar
                </button>

            </div>

        `;

        historyList.appendChild(li);

    });

}

function editExpression(index){

    const history =
    JSON.parse(localStorage.getItem("evalexpr")) || [];

    expressionInput.value =
    history[index].expr;

    expressionInput.focus();

    editIndex=index;

}

function deleteExpression(index){

    let history =
    JSON.parse(localStorage.getItem("evalexpr")) || [];

    history.splice(index,1);

    localStorage.setItem(
        "evalexpr",
        JSON.stringify(history)
    );

    loadHistory();

}

function clearHistory(){

    if(confirm("¿Deseas eliminar todo el historial?")){

        localStorage.removeItem("evalexpr");

        loadHistory();

    }

}

function exportHistory(){

    const history =
    JSON.parse(localStorage.getItem("evalexpr")) || [];

    if(history.length===0){

        alert("No hay historial para exportar.");

        return;

    }

    let text =
    "===== HISTORIAL EVALEXPR =====\n\n";

    history.forEach((item,i)=>{

        text +=
        `${i+1}. ${item.expr} = ${item.result}\n`;

    });

    const blob =
    new Blob(
        [text],
        {type:"text/plain"}
    );

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href=url;

    a.download="historial.txt";

    a.click();

    URL.revokeObjectURL(url);

}

expressionInput.addEventListener("keydown",function(e){

    if(e.key==="Enter"){

        evaluateExpression();

    }

});
