
let contentRender=document.querySelector(".content-container")
let arrPag=document.querySelectorAll(".pag")
let input=document.getElementById("input-container")
arrPag.forEach((item)=>{
    item.addEventListener("click",()=>{
        arrPag.forEach((element)=>{
            element.classList.remove("active")
        })
        item.classList.add("active")
    })
})
let currUrl=window.location.href
let string=currUrl.slice(22,currUrl.length)
console.log(string);
let render= function() {
    fetch(`http://localhost:3000/api/v1/todos${string}`)
    .then(res=>res.json())
    .then(dataAll=>{
    console.log(dataAll);
    let i=dataAll.page_index
    if (i==undefined) {
        i=0
    }
    console.log(dataAll.data[0]);
    console.log(i);
    arrPag[i].classList.add("active")
    let newString="";
    let countFalse=0;
        for (let index = Number(i)*10; index < Number(i)*10 +10 ; index++) {
           if (dataAll.data[index]!=undefined) {
            if (dataAll.data[index].completed==true) {
                newString+=`<div class="todo_detail" style="text-decoration:line-through">${dataAll.data[index].title}<i class="fa-sharp fa-solid fa-trash"></i></div>`
            }else{
                newString+=`<div class="todo_detail">${dataAll.data[index].title}<i class="fa-sharp fa-solid fa-trash"></i></div>` 
                countFalse++
            }
           }
        }
        contentRender.innerHTML=newString
        document.getElementsByTagName("p")[0].innerHTML=`you have ${countFalse} pennding task`
        //update checked
        let task=document.querySelectorAll(".todo_detail")
        let del=document.querySelectorAll(".fa-sharp")
        console.log(del);
        console.log(task);
        task.forEach((item,index)=>{
            item.addEventListener("click",()=>{
              let indexTask=Number(i)*10+index
              dataAll.data[indexTask].completed=true
              console.log(dataAll.data[indexTask]);
              fetch("http://localhost:3000/api/v1/todos",{
                method:"PUT",
                headers:{
                    "Content-type":"application/json"
                },
                body:JSON.stringify(dataAll.data)
              })
              .then(res=>res.json())
              .then(()=>{
                render();
              })
            })
            // console.log(item.children[0]);
            // item.children[0].addEventListener("click",()=>{
            //     let indexTask=Number(i)*10+index
            //     console.log(indexTask);
            // })
        })
        //delete one
        del.forEach((item,index)=>{
            item.addEventListener("click",(e)=>{
                e.stopPropagation();
                let indexTask=Number(i)*10+index
                console.log(indexTask);
                dataAll.data.splice(indexTask,1)
                console.log(dataAll.data);
                fetch(`http://localhost:3000/api/v1/todos/${indexTask}`,{
                    method:"DELETE",
                })
                .then((res)=>res.json())
                .then((data)=>{
                    console.log(data);
                    render();
                })
            })
        })
})
}
render();
// post thêm mới
let add= document.querySelector(".fa-solid")
add.addEventListener("click",()=>{
    if(input.value.trim()!=""){
        fetch("http://localhost:3000/api/v1/todos",{
            method:"POST",
            headers:{
                "Content-type":"application/json"  
            },
            body:JSON.stringify({
                userid:10,
                id:Math.random().toString(36).slice(-8),
                title:input.value,
                completed:false
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data);
            render();
        })
      }
})
// Delete all
let delAll=document.querySelector(".clear-all")
delAll.addEventListener("click",()=>{
    console.log(1111);
    fetch("http://localhost:3000/api/v1/todos",{
        method:"DELETE",
        headers:{
            "Content-type":"application/json"
        }
    })
    .then((res)=>res.json())
    .then((data)=>{
         console.log(data);
         window.location.reload()
        })
})
let content_con=document.querySelector(".content-container")
console.log(content_con);
content_con.addEventListener("click",(e)=>{
    if(e.target.className=="todo_detail"){
       console.log(e.target.innerHTML);
    }

})