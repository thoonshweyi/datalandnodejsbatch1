const socket = io(); // auto connect to same host

socket.on("connect",()=>{
    console.log("Socket Connected: ",socket.id);
});

// Live
socket.on("posts:created",(payload)=>{
    console.log("New posts: ",payload);

    // Option 1: show toast/alert

    // Option 2: auto refresh page
    if(location.pathname === "/") location.reload();
});

socket.on("posts:updated",(payload)=>{
    console.log("Updated posts: ",payload);

    // Option 1: show toast/alert

    // Option 2: auto refresh page
    if(location.pathname === "/") location.reload();
});

socket.on("posts:deleted",(payload)=>{
    console.log("Deleted posts: ",payload);

    // Option 1: show toast/alert

    // Option 2: auto refresh page
    if(location.pathname === "/") location.reload();
});