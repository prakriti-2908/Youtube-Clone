let videosContainer = document.getElementById("videosContainer");

// videosContainer.innerHTML = "hehe";


let baseURL = "https://www.googleapis.com/youtube/v3/";
let apiKey = "AIzaSyCxe6mfIZU8hWdd9vh_fkoCWHG7tvUzpJM";
let maxResults = 45;

// initial div to be hidden after search

let hideIT = document.querySelector(".hideIt");
let allElements = [];

const fetchAPI = (query) => {
    if(!query) return;
    let api = `${baseURL}search?key=${apiKey}&part=snippet&q=${query}&maxResults=${maxResults}`;
    fetch(api,{
        method:"GET"
    })
    .then(response=>response.json())
    .then((data)=>{
        allElements = data;
        hideIT.style.display = "block";

        displayVideosOnSearchPart(allElements);
    })
    .catch((err)=>console.log("fetch error: " ,err));
}

// fetchAPI("sonia");



// fetch channel data
function fetchChannelData(channelId) {    //fetching logo
    let api = `${baseURL}channels?key=${apiKey}&part=snippet&id=${channelId}`;

    return fetch(api, {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        if (data.items && data.items.length > 0) {
            let channelLogo = data.items[0].snippet.thumbnails.default;
            return channelLogo;
        } else {
            throw new Error("Channel not found");
        }
    })
    .catch(err => {
        console.log("fetch error:", err);
        throw err;
    });
}

const displayVideosOnSearchPart = (data) => {


    hideIT.style.display = "none";
    videosContainer.innerHTML = "";

    data.items.forEach((item)=>{
        
        let videoId = item.id.videoId;       //video id is extracted to redirect video 
        let channelId = item.snippet.channelId;
        // console.log(channelId)
        let typeOfData = item.id.kind;      // whether the data is of a yt channel or yt video of any channel



        // console.log(typeOfData);
        if(typeOfData=="youtube#channel"){
            return;
        }
        let videoDiv = document.createElement("div");
        videoDiv.className = "videoDiv"

        let channelTitle = item.snippet.channelTitle;
        let title = item.snippet.title;
        // console.log(channelTitle);        
        let desc = item.snippet.description;
        // console.log(desc);         -- correct


        let logoID = "";


        // making of thumbnail image
        let imgDiv = document.createElement("div");
        imgDiv.className = "imageDiv";
        let thumbnail = item.snippet.thumbnails.high;
        let thumbnailImg = document.createElement("img");
        thumbnailImg.setAttribute("src",thumbnail.url);
        thumbnailImg.setAttribute("alt",channelTitle);
        thumbnailImg.setAttribute("width","100%");
        thumbnailImg.setAttribute("height","100%");
        thumbnailImg.style.display = "block";
        thumbnailImg.style.objectFit = "contain";
        imgDiv.addEventListener("click",()=>{displayVideosOnPlayPart(videoId,channelId,data,channelTitle,logoID,title)})
        // appending thumbnail image
        imgDiv.append(thumbnailImg);
        videoDiv.append(imgDiv);



        // right div
        let videoRightDiv = document.createElement("div");
        videoRightDiv.className = "right-div"

        
        // appending title
        let titlePara = document.createElement("p");
        titlePara.innerText = title;
        titlePara.classList = "videoTitle"
        videoRightDiv.append(titlePara);


        // appending time
        let publishTime = item.snippet.publishedAt;
        let publishTimePara = document.createElement("p");
        publishTimePara.innerText = timeAgo(publishTime);
        publishTimePara.className = "publishTime"
        videoRightDiv.append(publishTimePara);



        // logo
        
        
        let channelLogoNameDiv = document.createElement("div");
        channelLogoNameDiv.style.display = "flex";
        let logoDiv = document.createElement("div")
        logoDiv.className = "logoDiv";
        let logo = item.snippet.thumbnails.default;
        let logoImg = document.createElement("img");
        fetchChannelData(channelId)
        .then(channelLogo => {
            logoID = channelLogo.url;
            logoImg.setAttribute("src", channelLogo.url);
            // logoURL=channelLogo.url;
            // console.log(channelLogo.url)
        })
        .catch(err => console.log("Error fetching channel data:", err));
        logoImg.setAttribute("alt",channelTitle);
        logoImg.setAttribute("width","100%");
        logoImg.setAttribute("height","100%");
        logoImg.style.objectFit = "contain";
        logoImg.append(logo);
        logoDiv.append(logoImg);
        channelLogoNameDiv.append(logoDiv);

        // appending channelTitle
        let channelTitlePara = document.createElement("p");
        channelTitlePara.innerText = channelTitle;
        channelTitlePara.classList = "channelTitle"
        channelLogoNameDiv.append(channelTitlePara);
        


        // appending both to videoRightDiv
        videoRightDiv.append(channelLogoNameDiv);
        
        // appending description
        let descPara = document.createElement("p");
        descPara.innerText = desc;
        descPara.classList = "description"
        videoRightDiv.append(descPara);
        
        


        videoDiv.append(videoRightDiv);
        videosContainer.append(videoDiv);


    })
}


// getting target value of search-input

let searchInput = document.getElementById("search-input");
let searchIcon = document.getElementById("searchIcon");
// searchInput.style.backgroundColor = "red";          --correct

let searchQ = "";

searchInput.addEventListener("keyup",(e)=>{
    // fetchAPI(e.target.value);
    searchQ = e.target.value;
    console.log(searchQ);
})

searchInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      fetchAPI(searchQ)
    }
  });

searchIcon.addEventListener("click",()=>{
    fetchAPI(searchQ);
})




// time calculation
function timeAgo(dateString) {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    
    const diffInMs = currentDate - givenDate;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30); // Approximate month
    const diffInYears = Math.floor(diffInDays / 365); // Approximate year
    
    if (diffInYears > 0) {
        return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
    } else if (diffInMonths > 0) {
        return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    } else if (diffInWeeks > 0) {
        return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    } else if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
        return 'just now';
    }
}

















// fetching comments

function getComments(videoId) {    //fetching logo
    let api = `${baseURL}commentThreads?key=${apiKey}&part=snippet&videoId=${videoId}&maxResults=50`;

    return fetch(api, {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        let comment = [];
        let count = 0;
        if (data.items && data.items.length > 0) {
            data.items.forEach((i)=>{
                comment.push(i);
                console.log("pushed: ",comment[count]);
                count++;
            })
            return comment;
        } else {
            throw new Error("Channel not found");
        }
    })
    .catch(err => {
        console.log("fetch error:", err);
        throw err;
    });
}






// playing the video

function displayVideosOnPlayPart(videoId, channelId, data, channelTitle,logoID,titlee) {
    videosContainer.innerHTML = "";

    let onClickingVideo = document.createElement("div");
    onClickingVideo.id = "playingVideoPart";

    let videoPlayer = document.createElement("div");
    videoPlayer.id = "video-player";
    let leftPart = document.createElement("div");
    leftPart.className = "left-part"
    leftPart.append(videoPlayer)
    onClickingVideo.append(leftPart);

    let recommendations = document.createElement("div");
    recommendations.id = "recommendations";
    onClickingVideo.append(recommendations);

    videosContainer.append(onClickingVideo);
    // let nameChannel = data.items.

    

    
if (window.YT) {
    new YT.Player("video-player", {
        height: "400",
        width: "600",
        videoId,
        events: {
            onReady: onPlayerReady,
        }
    });
} else {
    console.log("YouTube IFrame API is not loaded");
}

let titlePlayVid = document.createElement("h2");
titlePlayVid.innerHTML = titlee;
leftPart.append(titlePlayVid);

let logoImg = document.createElement("img");
logoImg.setAttribute("src",logoID);
logoImg.style.width = "46px";
logoImg.style.height = "46px";
logoImg.style.borderRadius = "50%";
logoImg.style.marginRight = "20px";
logoImg.style.marginTop = "10px";

leftPart.append(logoImg);

let titleIFrame = document.createElement("h3");
titleIFrame.innerHTML = channelTitle;
titleIFrame.style.display = "inline";
titleIFrame.style.position = "relative";
titleIFrame.style.top = "-13px";
leftPart.append(titleIFrame);


let CommentTitle = document.createElement("h2");
CommentTitle.innerHTML = "Comments : ";
CommentTitle.style.marginTop = "30px";
CommentTitle.style.marginBottom = "10px";
leftPart.append(CommentTitle);






// Fetch comments
let comments;
getComments(videoId)
    .then(comment => {
        // Store comments in the variable
        comments = comment;
        // console.log("Comments:", comments);

        // Display comments on UI
        let commentDiv = document.createElement("div");
        commentDiv.className = "commentDiv"
        comments.forEach((comment) => {
            let userDiv = document.createElement("div");
            userDiv.className = "commentCard";
            let userName = document.createElement("h4");
            userName.innerHTML = comment.snippet.topLevelComment.snippet.authorDisplayName;
            userName.style.fontWeight = "20px"
            let userComment = document.createElement("p");
            userComment.innerHTML = comment.snippet.topLevelComment.snippet.textOriginal;
            userComment.style.display = "inline";
            let userProfileImg = document.createElement("img");
            userProfileImg.className = "userProfileImg"
            userProfileImg.setAttribute("src", comment.snippet.topLevelComment.snippet.authorProfileImageUrl);
            userDiv.append(userName);
            userDiv.append(userProfileImg);
            userDiv.append(userComment);

            commentDiv.append(userDiv);
        });

        leftPart.append(commentDiv);

    })
    .catch(err => console.log("Error fetching comments:", err));




    // Adding recommendations
    data.items.forEach((item) => {
        let typeOfData = item.id.kind;

        if (typeOfData == "youtube#channel" || item.id.videoId === videoId) {
            return;
        }

        let videoDiv = document.createElement("div");
        videoDiv.className = "videoDiv-recom";
        
        let channelTitle = item.snippet.channelTitle;
        let title = item.snippet.title;

        let logoIDD = "";
        
        let imgDiv = document.createElement("div");
        imgDiv.className = "imageDiv-recom";
        let thumbnail = item.snippet.thumbnails.high;
        let thumbnailImg = document.createElement("img");
        thumbnailImg.setAttribute("src", thumbnail.url);
        thumbnailImg.setAttribute("alt", channelTitle);
        thumbnailImg.setAttribute("width", "100%");
        thumbnailImg.setAttribute("height", "100%");
        thumbnailImg.style.display = "block";
        thumbnailImg.style.objectFit = "contain";
        imgDiv.addEventListener("click", () => { displayVideosOnPlayPart(item.id.videoId, item.snippet.channelId, data, channelTitle,logoIDD) });
        imgDiv.append(thumbnailImg);
        videoDiv.append(imgDiv);

        let videoRightDiv = document.createElement("div");
        videoRightDiv.className = "right-div";

        let titlePara = document.createElement("p");
        titlePara.innerText = title;
        titlePara.classList = "videoTitle-recom";
        videoRightDiv.append(titlePara);

        let publishTime = item.snippet.publishedAt;
        let publishTimePara = document.createElement("p");
        publishTimePara.innerText = timeAgo(publishTime);
        publishTimePara.className = "publishTime";
        videoRightDiv.append(publishTimePara);

        let channelLogoNameDiv = document.createElement("div");
        channelLogoNameDiv.style.display = "flex";
        let logoDiv = document.createElement("div");
        logoDiv.className = "logoDiv-recom";
        let logoImg = document.createElement("img");
        fetchChannelData(item.snippet.channelId)
            .then(channelLogo => {
                logoIDD = channelLogo.url;
                logoImg.setAttribute("src", channelLogo.url);
            })
            .catch(err => console.log("Error fetching channel data:", err));
        logoImg.setAttribute("alt", channelTitle);
        logoImg.setAttribute("width", "100%");
        logoImg.setAttribute("height", "100%");
        logoImg.style.objectFit = "contain";
        logoDiv.append(logoImg);
        channelLogoNameDiv.append(logoDiv);

        let channelTitlePara = document.createElement("p");
        channelTitlePara.innerText = channelTitle;
        channelTitlePara.classList = "channelTitle";
        channelLogoNameDiv.append(channelTitlePara);



        videoRightDiv.append(channelLogoNameDiv);


        videoDiv.append(videoRightDiv);
        recommendations.append(videoDiv);
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
}
