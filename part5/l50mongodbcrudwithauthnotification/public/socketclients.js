const socket = io(); // auto connect to same host

socket.on("connect",()=>{
    console.log("Socket Connected: ",socket.id);
});

// Live
socket.on("posts:created",(payload)=>{
    console.log("New posts: ",payload);

    // emojidb
    // Option 1: show toast/alert
    // showBStoast(`✅ New post created: ${payload.title}`);
    // sweetalert("success",`New post created: ${payload.title}`);
    toastnoti(`New post created: ${payload.title}`,"green")

    // Option 2: auto refresh page
    setTimeout(()=> {if(location.pathname === "/") location.reload()}, 800)

});

socket.on("posts:updated",(payload)=>{
    console.log("Updated posts: ",payload);

    // Option 1: show toast/alert
    // showBStoast(`🔄 Post updated: ${payload.title}`);
    //    sweetalert("info",`Post updated: ${payload.title}`);
    toastnoti(`Post updated: ${payload.title}`,"skyblue")

    // Option 2: auto refresh page
    setTimeout(()=> {if(location.pathname === "/") location.reload()}, 800)
});

socket.on("posts:deleted",(payload)=>{
    console.log("Deleted posts: ",payload);

    // Option 1: show toast/alert
    // showBStoast(`🔴 Post deleted: ${payload.ids}`);
    // sweetalert("info",`Post deleted: ${payload.ids}`);
    toastnoti(`Post deleted`,"red")



    // Option 2: auto refresh page
    // if(location.pathname === "/") location.reload();
    setTimeout(()=> {if(location.pathname === "/") location.reload()}, 800)
});


// Helper
function showBStoast(message){
    const toastel = document.getElementById("liveToast");
    const toastbody = document.getElementById("toastbody");

    if(!toastel || !toastbody) return;

    toastbody.textContent = message;

    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastel,{
        delay: 2500,
        autohide: true
    });
    
    toastBootstrap.show()
}


function sweetalert(icon,title){
    Swal.fire({
        toast: true,
        position: "top-end",
        icon,
        title,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true
    });
}

function toastnoti(title, bgcolor){
    Toastify({
        text: title,
        duration: 2500,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        style: {
            background: bgcolor,
            borderRadius: "6px",
            fonSize: "14px"
        },
    }).showToast();
}