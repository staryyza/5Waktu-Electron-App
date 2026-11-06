let activities = JSON.parse(
    localStorage.getItem("activities")
) || [];

let selectedDay = 1;
let editId = null;

document.addEventListener(
    "DOMContentLoaded",
    () => {

        displayHijriDate();

        generateCalendar();

        displayActivities();

        document
        .getElementById("saveBtn")
        .addEventListener(
            "click",
            saveActivity
        );
    }
);

function displayHijriDate(){

    const hijriDate =
    new Intl.DateTimeFormat(
        "en-TN-u-ca-islamic",
        {
            day:"numeric",
            month:"long",
            year:"numeric"
        }
    ).format(new Date());

    document
    .getElementById("hijriDate")
    .innerText = hijriDate;
}

function generateCalendar(){

    const calendarGrid =
    document.getElementById(
        "calendarGrid"
    );

    calendarGrid.innerHTML = "";

    document
    .getElementById(
        "calendarTitle"
    )
    .innerText =
    "Jumadilawal 1448 Hijri";

    for(let day = 1; day <= 30; day++){

        const cell =
        document.createElement("div");

        cell.classList.add(
            "calendar-cell"
        );

        if(day === selectedDay){

            cell.classList.add(
                "selected"
            );
        }

        const hasActivity =
        activities.some(
            activity =>
            activity.day === day
        );

        cell.innerHTML = `
            <div class="calendar-day">
                ${day}
            </div>

            ${
                hasActivity
                ?
                '<div class="activity-mark">● Activity</div>'
                :
                ""
            }
        `;

        cell.addEventListener(
            "click",
            () => {

                selectedDay = day;

                generateCalendar();

                displayActivities();
            }
        );

        calendarGrid.appendChild(
            cell
        );
    }
}

function saveActivity(){

    const title =
    document.getElementById(
        "activityTitle"
    ).value;

    const time =
    document.getElementById(
        "activityTime"
    ).value;

    const note =
    document.getElementById(
        "activityNote"
    ).value;

    const feedback =
    document.getElementById(
        "feedback"
    );

    if(
        title.trim() === "" ||
        time.trim() === ""
    ){

        feedback.innerText =
        "Please fill all required fields.";

        feedback.style.color =
        "red";

        return;
    }

    if(editId){

        activities =
        activities.map(
            activity => {

                if(
                    activity.id === editId
                ){

                    return {

                        ...activity,

                        title,
                        time,
                        note,

                        day:
                        selectedDay
                    };
                }

                return activity;
            }
        );

        editId = null;

        feedback.innerText =
        "Activity updated successfully.";

    }else{

        activities.push({

            id: Date.now(),

            day: selectedDay,

            title,

            time,

            note
        });

        feedback.innerText =
        "Activity added successfully.";
    }

    feedback.style.color =
    "green";

    localStorage.setItem(
        "activities",
        JSON.stringify(
            activities
        )
    );

    clearForm();

    generateCalendar();

    displayActivities();
}

function displayActivities(){

    const activityList =
    document.getElementById(
        "activityList"
    );

    const filteredActivities =
    activities.filter(
        activity =>
        activity.day === selectedDay
    );

    if(
        filteredActivities.length === 0
    ){

        activityList.innerHTML =
        `
        <p>
        No activities for Day
        ${selectedDay}.
        </p>
        `;

        return;
    }

    activityList.innerHTML = "";

    filteredActivities.forEach(
        activity => {

        activityList.innerHTML +=

        `
        <div class="activity-card">

            <h3>
                ${activity.title}
            </h3>

            <p>
                <strong>Day:</strong>
                ${activity.day}
            </p>

            <p>
                <strong>Time:</strong>
                ${activity.time}
            </p>

            <p>
                <strong>Notes:</strong>
                ${activity.note}
            </p>

            <div class="btn-group">

                <button
                onclick="editActivity(${activity.id})">

                Edit

                </button>

                <button
                onclick="deleteActivity(${activity.id})">

                Delete

                </button>

            </div>

        </div>
        `;
    });
}

function editActivity(id){

    const activity =
    activities.find(
        item =>
        item.id === id
    );

    if(!activity) return;

    document
    .getElementById(
        "activityTitle"
    ).value =
    activity.title;

    document
    .getElementById(
        "activityTime"
    ).value =
    activity.time;

    document
    .getElementById(
        "activityNote"
    ).value =
    activity.note;

    selectedDay =
    activity.day;

    editId =
    activity.id;

    generateCalendar();
}

function deleteActivity(id){

    const confirmDelete =
    confirm(
        "Delete this activity?"
    );

    if(!confirmDelete){

        return;
    }

    activities =
    activities.filter(
        activity =>
        activity.id !== id
    );

    localStorage.setItem(
        "activities",
        JSON.stringify(
            activities
        )
    );

    generateCalendar();

    displayActivities();
}

function clearForm(){

    document
    .getElementById(
        "activityTitle"
    ).value = "";

    document
    .getElementById(
        "activityTime"
    ).value = "";

    document
    .getElementById(
        "activityNote"
    ).value = "";
}