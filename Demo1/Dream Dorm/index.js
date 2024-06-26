import { navComponent } from "./components/searchbox.js";

/*------------------ Animations / Dynamic css----------------------------*/


// Navbar animation
window.addEventListener('scroll', () => {
    var scrollPos = window.scrollY;
    var mobileNavbar = document.getElementById('mobile_navbar');
    var heroNavbar = document.getElementById("hero_nav_img");
    if (scrollPos > 0) {
        heroNavbar.style.display = "none";
        mobileNavbar.style.display = 'flex';
    } else {
        heroNavbar.style.display = "flex";
        mobileNavbar.style.display = 'none';
    }
});

let slideFlag = true;
// slide on click hero section
function scrollImgSliding() {
    let slide_link2 = document.getElementById("slider_links_2");
    let slide_link1 = document.getElementById("slider_links_1");
    if (slideFlag) {
        let imgSliding = document.querySelector('.img_sliding');
        imgSliding.scrollBy({
            left: 1000,
            top: 0,
            behavior: 'smooth'
        });
        slide_link2.style.border = "1px solid #61c3ae";
        slide_link1.style.border = "none";
        slideFlag = false;
    }
    else {
        slide_link1.style.border = "1px solid #61c3ae";
        slide_link2.style.border = "none";
        let imgSliding = document.querySelector('.img_sliding');
        imgSliding.scrollBy({
            left: -1000,
            top: 0,
            behavior: 'smooth'
        });
        slideFlag = true;
    }
}

setInterval(scrollImgSliding, 2000); // scroll every 2 seconds

document.getElementById("slider_links_2").onclick = () => {
    let slide_link2 = document.getElementById("slider_links_2");
    let slide_link1 = document.getElementById("slider_links_1");
    let imgSliding = document.querySelector('.img_sliding');

    imgSliding.scrollBy({
        left: 1000,
        top: 0,
        behavior: 'smooth'
    });
    slide_link2.style.border = "1px solid #61c3ae";

    slide_link1.style.border = "none";
}

document.getElementById("slider_links_1").onclick = () => {
    let slide_link2 = document.getElementById("slider_links_2");
    let slide_link1 = document.getElementById("slider_links_1");
    let imgSliding = document.querySelector('.img_sliding');

    imgSliding.scrollBy({
        left: -1000,
        top: 0,
        behavior: 'smooth'
    });
    slide_link1.style.border = "1px solid #61c3ae";

    slide_link2.style.border = "none";
}
/*------------------ Animations / Dynamic css ----------------------------*/


// city data localStorage
var citiesArrayForList = JSON.parse(localStorage.getItem("citiesArr")) || [];

// hero section pop-up

let ex_recidence_btn = document.getElementById("exlpore_residence_link");

ex_recidence_btn.onclick = () => {
    let popup = document.getElementById("explore_residence_popup");
    popup.style.display = "flex";
    document.querySelector('body').style.overflow = "hidden";
    document.getElementById("green_filter1").style.zIndex = "-1";
    document.getElementById("green_filter2").style.zIndex = "-1";
    document.getElementById("green_filter3").style.zIndex = "-1";
}

document.getElementById("close_btn").onclick = () => {
    let popup = document.getElementById("explore_residence_popup");
    popup.style.display = "none";
    document.querySelector('body').style.overflow = "auto";
    document.getElementById("green_filter1").style.zIndex = "2";
    document.getElementById("green_filter2").style.zIndex = "2";
    document.getElementById("green_filter3").style.zIndex = "2";
}


// closing search suggestions
document.getElementById("hero_section").onclick = () => {
    document.getElementById("search_suggestion").style.display = "none";
}






function updateInput() {
    // Focus on the input element
    document.getElementById("searchChip").focus();
}






// https://code735.github.io/stanzaLiving/as/data/db.json github link
let getData = async () => {
    let hostname = location.hostname;
    let url = `https://code735.github.io/stanzaLiving/as/data/db.json`;
    console.log(url);
    let res = await fetch(url);
    let data = await res.json();
    console.log(data);
    return data.data;
}


let searchBox = document.getElementById("searchip");

// searching 

document.getElementById("searchip").oninput = async () => {
    let ipboxval = searchBox.value;
    let data = await getData();
    let Citydata = data.all_cities[0];

    console.log(Citydata);

    const result = checkSubstring(ipboxval, Citydata);
    appendSearchSuggestions(result, Citydata);
}


function checkSubstring(substring, obj) {
    const cityNames = Object.keys(obj);

    const matchingNames = cityNames.filter(name => name.includes(substring));

    return matchingNames;
}


// Individual data
let individualData = JSON.parse(localStorage.getItem("individual")) || {};

// appending search suggestions
let timeoutId = null;

let appendSearchSuggestions = async (result, city_data) => {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    let suggestionBox = document.getElementById("search_suggestion");

    timeoutId = setTimeout(async () => {
        suggestionBox.textContent = "";

        if (result.length != 0) {
            let cityDataArr = city_data[result[0]];
            suggestionBox.style.display = "flex";
            result.forEach(element => {
                const CityName = document.createElement("p");
                let str = element;
                str = str.charAt(0).toUpperCase() + str.slice(1);

                CityName.textContent = str;

                const suggestionType = document.createElement("p");
                suggestionType.textContent = "City";
                suggestionType.style.color = "#61c3ae";

                const cityData = document.createElement("div");
                cityData.append(CityName, suggestionType);
                cityData.style.display = "flex";
                cityData.style.justifyContent = "space-between";
                cityData.style.padding = "10px 15px";
                cityData.classList.add("cityHover");
                cityData.onclick = () => {
                    let p_text = document.getElementById("select_value").textContent;
                    let select_val = "";
                    if (p_text == "Modern Student Housing") {
                        select_val = "HOUSING";
                    }
                    else if (p_text == "Co-living for Professionals") {
                        select_val = "COLIVING";
                    }
                    else if (p_text == "Managed Apartments") {
                        select_val = "APARTMENT";
                    }

                    let filteredData = filterThis(cityDataArr, select_val);
                    if (filteredData.length != 0) {
                        console.log(filteredData);
                        localStorage.setItem("citiesArr", JSON.stringify(filteredData));
                        location.href = "as/pages/product_list.html";
                    }
                    else {
                        localStorage.setItem("citiesArr", JSON.stringify(cityDataArr))
                        console.log(cityDataArr);
                        location.href = "as/pages/product_list.html";
                    }
                }

                suggestionBox.append(cityData);
            });

            console.log(city_data);

            for (let i = 0; i < 20; i++) {
                let propertyType = cityDataArr[i].propertyEntityType

                const CityName = document.createElement("p");
                let str = cityDataArr[i].name + " , " + cityDataArr[i].cityName;
                str = str.charAt(0).toUpperCase() + str.slice(1);

                CityName.textContent = str;

                const suggestionType = document.createElement("p");
                suggestionType.textContent = propertyType.toLowerCase();
                suggestionType.style.color = "#61c3ae";

                const cityData = document.createElement("div");
                cityData.append(CityName, suggestionType);
                cityData.style.display = "flex";
                cityData.style.justifyContent = "space-between";
                cityData.style.padding = "10px 15px";
                cityData.classList.add("cityHover");

                cityData.onclick = () => {
                    console.log(cityDataArr[i]);
                    individualData = { "product": cityDataArr[i] };
                    localStorage.setItem("individual", JSON.stringify(individualData));
                    location.href = "individualPage/individualPage.html";
                }

                suggestionBox.append(cityData);

            }
        }

    }, 500);
}

let rptatingFlag = true;
document.querySelector("#select_property_type").onclick = () => {
    if (rptatingFlag) {
        document.getElementById("select_options").style.display = "block";
        document.getElementById("expanding_angle").classList.add("rotate");
        document.getElementById("expanding_angle").classList.remove("rotateBack");
        rptatingFlag = false;
    }
    else {
        document.getElementById("select_options").style.display = "none";
        document.getElementById("expanding_angle").classList.remove("rotate");
        document.getElementById("expanding_angle").classList.add("rotateBack");
        rptatingFlag = true;
    }
}
// select value setting
let select_options_value = document.querySelectorAll(".select_options_p");
let s_o_v_len = select_options_value.length;

for (let i = 0; i < s_o_v_len; i++) {
    select_options_value[i].onclick = () => {
        document.getElementById("select_value").textContent = select_options_value[i].textContent;
    }
}


let filterThis = (cityDataArr, selectVal) => {
    // Create a new array to store the filtered data
    let filteredData = [];

    // Loop through the cityDataArr
    for (let i = 0; i < cityDataArr.length; i++) {
        // Check if the propertyEntityType property of the current element in the array matches the selectVal
        if (cityDataArr[i].propertyEntityType === selectVal) {
            // If it matches, add the element to the filteredData array
            filteredData.push(cityDataArr[i]);
        }
    }

    // Return the filtered data array
    return filteredData;
}



// signup sign in 

let loggedInUser = localStorage.getItem("loggedInUser") || "Log In";
document.getElementById("after_login").textContent = loggedInUser;
let loginBtn = document.getElementById("after_login").textContent;

document.getElementById("request_callback").onclick = () => {
    let loginBtn = document.getElementById("after_login").textContent;
    if (loginBtn != "Log In") {
        document.getElementById("logout").style.display = "flex";
        document.querySelector("body").style.overflow = "hidden";
        document.getElementById("green_filter1").style.zIndex = "-1";
        document.getElementById("green_filter2").style.zIndex = "-1";
        document.getElementById("green_filter3").style.zIndex = "-1";
    }
    else {
        document.getElementById("parent").style.display = "block";
    }
}



document.getElementById("logout_close_btn").onclick = () => {
    document.getElementById("after_login").textContent = loggedInUser;
    document.getElementById("logout").style.display = "none";
    document.querySelector("body").style.overflow = "auto";
    document.getElementById("green_filter1").style.zIndex = "2";
    document.getElementById("green_filter2").style.zIndex = "2";
    document.getElementById("green_filter3").style.zIndex = "2";
}

document.getElementById("logout_confirmed").onclick = () => {
    loggedInUser = "Log In";
    localStorage.setItem("loggedInUser", loggedInUser);
    document.getElementById("logout").style.display = "none";
    document.querySelector("body").style.overflow = "auto";
    document.getElementById("after_login").textContent = loggedInUser;
    document.getElementById("green_filter1").style.zIndex = "2";
    document.getElementById("green_filter2").style.zIndex = "2";
    document.getElementById("green_filter3").style.zIndex = "2";
}


// Know More

document.getElementById("know_more").onmouseover = () => {
    document.getElementById("know_more_options").style.display = "block";
}

document.getElementById("know_more").onmouseleave = () => {
    document.getElementById("know_more_options").style.display = "none";
}


document.getElementById("know_more_options").onmouseover = () => {
    document.getElementById("know_more_options").style.display = "block";
}

document.getElementById("know_more_options").onmouseleave = () => {
    document.getElementById("know_more_options").style.display = "none";
}


let g_fltr1 = document.getElementById("green_filter1");


g_fltr1.onmouseenter = () => {
    document.getElementById("green_filter1_text").style.color = "#beb6bd";
    g_fltr1.innerHTML = `
       <p>New-age hostels with all the amenities & vibrant living spaces.</p>`;
    document.querySelector(".ex_btn_1").style.zIndex = "3";
}

g_fltr1.onmouseleave = () => {
    g_fltr1.innerHTML = "";
    document.getElementById("green_filter1_text").style.color = "black";
    document.querySelector(".ex_btn_1").style.zIndex = "0";
}

let g_fltr2 = document.getElementById("green_filter2");


g_fltr2.onmouseenter = () => {
    document.getElementById("green_filter2_text").style.color = "#beb6bd";
    g_fltr2.innerHTML = `
       <p>Chill hostel-style residences that are close to your office.Co-living for Profession.</p>`;
    document.querySelector(".ex_btn_2").style.zIndex = "3";

}

g_fltr2.onmouseleave = () => {
    g_fltr2.innerHTML = "";
    document.getElementById("green_filter2_text").style.color = "black";
    document.querySelector(".ex_btn_2").style.zIndex = "0";
}

let g_fltr3 = document.getElementById("green_filter3");

g_fltr3.onmouseenter = () => {
    g_fltr3.style.transition = "all 0.5s ease-in-out";
    document.getElementById("green_filter3_text").style.color = "#beb6bd";
    g_fltr3.innerHTML = `
       <p>Fully-furnished spaces with all essential amenities and zero capital investment.</p>`;
    document.querySelector(".ex_btn_3").style.zIndex = "3";
}

g_fltr3.onmouseleave = () => {
    g_fltr3.innerHTML = "";
    document.querySelector(".ex_btn_3").style.zIndex = "3";
    document.getElementById("green_filter3_text").style.color = "black";
}