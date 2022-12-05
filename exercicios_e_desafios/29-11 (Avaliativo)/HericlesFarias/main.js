let scoreData= {"Hericles":2};
let colors=["red","green","yellow","blue","purple","grey","pink","brown","orange"]
let divs = ["q1","q2","q3","q4","q5","q6","q7","q8","q9"]
let target = document.getElementById('target');
let answer = document.getElementById('answer');
let score = document.getElementById('score');
let level = document.getElementById('level');
let startG;
let scoreInt=0;
let correctAnswer;
let timerID;

let display = document.querySelector("#time");//elemento apra exibir o timer


let duration=3*100;

function startGame(){
    var startG = document.getElementById("start");
    if(startG.textContent.includes("Restart")){
        location.reload();
    }else{
    startG.innerHTML="Restart";
    //seta o nivel atual
    level.innerHTML="1";
    shuffleColors();
    start();
    }   
}

function shuffleColors(){
    
    shuffleAlg(colors);
    //console.log(c2);
    for(var i=0;i<divs.length;i++){
        element=document.getElementById(divs[i]);
        element.style.backgroundColor=colors[i];
    }
    

}

function shuffleAlg(array){
    //Fisher-Yates Shuffle!

    for (var i=array.length-1;i>0;i--){
        var j = Math.floor(Math.random()*(i+1));
        var temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }

    [array[i],array[j]]=[array[j],array[i]];
    
}


function start(){
    //starta o timer
    
    startTimer(duration, display);

    var r = Math.floor(Math.random()*9);
    
    correctAnswer = colors[r];
    
    answer.innerHTML=correctAnswer;
    target.innerHTML=colors[Math.floor(Math.random()*9)];
    target.style.color=correctAnswer;

    //shuffles the first time it enters the game
    //and then only if level is >=2!
    
    addClick("q1");
    addClick("q2");
    addClick("q3");
    addClick("q4");
    addClick("q5");
    addClick("q6");
    addClick("q7");
    addClick("q8");
    addClick("q9");

    
}


function checkColor(q){
    var myDivObj=document.getElementById(q);
    //var myDivObjBgColor=window.getComputedStyle(myDivObj).backgroundColor;
    var qColor=myDivObj.style.backgroundColor;
    if(qColor===correctAnswer){
        scoreInt++;
        score.innerHTML=scoreInt;
        //como ele acertou já sorteia a nova entao!
        //mata o timer
        clearInterval(timerID);
        //e cria ele denovo dentro da funcao start!
        start();

        //lvl controll
        if(scoreInt>=10 && scoreInt<20){
            duration=2*100;
            level.innerHTML="2";
        }

        if(scoreInt>=20){            
            shuffleColors();
        }
        
        if(scoreInt>=20 && scoreInt<30){
            duration=2*100;
            level.innerHTML="3";
            
        }

        if(scoreInt>=30 && scoreInt<40){
            duration=1.7*100;
            level.innerHTML="4";
        }
        if(scoreInt>=40 && scoreInt<50){
            duration=1.5*100;
            level.innerHTML="5";
        }
        
        if(scoreInt>=50 && scoreInt<59){
            level.innerHTML="Final";
            duration=1*100;
        }
        if(scoreInt==60){
            level.innerHTML="Max";
            //e pausa o timer!
            clearInterval(timerID);
            for(var i=0;i<divs.length;i++){
                element=document.getElementById(divs[i]);
                element.onclick=null;
    
            }

            //e mostra os resultados
            var targetText = document.getElementById('targetText');
            targetText.innerHTML="Parabéns!!!<br>Voce fez: "+scoreInt+" pontos!";
            target.innerText="";
            //habilida a opcao de salvar
            var storeIt = document.getElementById('storeDiv');
            storeIt.classList.remove("hide");   
        }
        
    }else{
        //faz a animacao de erro
        myDivObj.classList.add("hvr-buzz-out");
        //e bloqueia as interacoes de hoover
        //bloqueia o resto do jogo
        for(var i=0;i<divs.length;i++){
            element=document.getElementById(divs[i]);
            element.onclick=null;

        }
        //e pausa o timer!
        clearInterval(timerID);
        //e mostra os resultados
        var targetText = document.getElementById('targetText');
        targetText.innerHTML="Erroooooooou<br>Voce fez: "+scoreInt+" pontos!";
        target.innerText="";
        //habilida a opcao de salvar
        var storeIt = document.getElementById('storeDiv');
        storeIt.classList.remove("hide");


    }




}


function addClick(q){
    var colorSpan = document.getElementById(q);
    let onclick = "checkColor('".concat(q,"')");
    colorSpan.setAttribute("onclick",onclick)

}


function startTimer(duration, display){

    var timer = duration, seconds, miliseconds;

    timerID=setInterval(function(){
        seconds = parseInt(timer/100,10);
        miliseconds = parseInt(timer%100,10);

        seconds=seconds<10?"0"+seconds:seconds;
        miliseconds=miliseconds<10?"0"+miliseconds:miliseconds;

        display.textContent = seconds+":"+miliseconds;
        
        if(--timer==0){
            //stopeia o timer;
            display.textContent="00:00";
            clearInterval(timerID);
            //bloqueia o resto do jogo
            for(var i=0;i<divs.length;i++){
                element=document.getElementById(divs[i]);
                element.onclick=null;
            }
            //chama as mensagens dos resultados!
        }

    },10);

}


function saveToJson(){
    var userName=document.getElementById("userName").value;
    scoreData[userName]=scoreInt;
    // Save them to localStorage
    localStorage.setItem(userName,scoreInt);
    var storeIt = document.getElementById('storeDiv');
    storeIt.classList.add("hide");

}

function hideSave(){
    var storeIt = document.getElementById('storeDiv');
    storeIt.classList.add("hide");
}

function getScores(){
    var container=document.getElementById('userSc');

    var hideSR=document.getElementById('btn-rk');

    if(hideSR.textContent.includes('Show Ranking')){
        hideSR.innerHTML="Hide Ranking";
        container.classList.remove("hide");
        var allScores={...localStorage};
        // sort the list
        const sortable = Object.fromEntries(Object.entries(allScores).sort(([,a],[,b])=>a-b).reverse());
        console.log(sortable);
    
        var k=0
        Object.entries(sortable).forEach(([key, value]) => {
            container.innerHTML+='<div class="userSx">'+'<div>'+k+'</div>'+'<div>'+key+'</div>'+'<div>'+value+'</div></div>';
            k++
          });

    }
    else{
        //clear and hide the ranking
        while(container.firstChild){
            container.removeChild(container.firstChild);
        }

        container.classList.add("hide");
        hideSR.innerHTML="Show Ranking";
    }





}