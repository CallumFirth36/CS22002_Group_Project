/*
    Question List Component

    USE: Used to display an interactive list of questions on the admin page
    AUTHOR: Bailey Clark
    DATE: 23/03/2026
    
*/export function QuestionList() {
  
    const card = document.createElement("div"); // Create new div to contain the card elements
    card.classList.add("Question-List")

    card.innerHTML =` 
        <h2 class="question_list">Questions</h2>
        
        
        
        
    `; // adds all the required elements to the html page

    return card;
}  
